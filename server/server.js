const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/incloudhub';

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  console.log('📍 Database:', mongoose.connection.name);
  console.log('🔗 Host:', mongoose.connection.host);
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  console.log('💡 Make sure MongoDB is running on your PC');
});

// Schemas
const SessionSchema = new mongoose.Schema({
  userId: String,
  subject: String,
  topic: String,
  date: Date,
  time: String,
  duration: Number,
  status: { type: String, default: 'scheduled' },
  verificationImage: String,
  completionImage: String,
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  rescheduledCount: { type: Number, default: 0 }
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  branch: String,
  year: Number,
  skills: [String],
  createdAt: { type: Date, default: Date.now }
});

const Session = mongoose.model('Session', SessionSchema);
const User = mongoose.model('User', UserSchema);

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyCcW7AcozuL0qV1aXk-md4W_KBHBEODFwM';
const GEMINI_PRO_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const GEMINI_VISION_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// JWT Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Access denied' });
  }
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ success: false, error: 'Invalid token' });
  }
};

// Test endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend is running',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Routes

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });
    await user.save();
    
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ success: true, token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ success: true, token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Session Routes (Protected)
app.get('/api/sessions/:userId', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/sessions', authMiddleware, async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/sessions/:id', authMiddleware, async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Gemini Vision API - Study Verification (Protected)
app.post('/api/verify-study', authMiddleware, async (req, res) => {
  try {
    const { imageBase64, sessionId } = req.body;
    
    const response = await axios.post(GEMINI_VISION_URL, {
      contents: [{
        parts: [
          { text: "Analyze this image and identify: 1) Subject/topic being studied 2) Type of material (book, notes, screen) 3) Estimated study progress. Respond in JSON format." },
          { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }
        ]
      }]
    });

    const analysis = response.data;
    
    await Session.findByIdAndUpdate(sessionId, {
      verificationImage: imageBase64,
      verified: true
    });

    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Resume Analysis with Gemini (No Auth)
app.post('/api/analyze-resume', async (req, res) => {
  try {
    const { resumeText, targetRole, skills, year } = req.body;
    
    const prompt = `Analyze this resume for a ${targetRole} role. Current year: ${year}.
Skills: ${skills.join(', ')}
Resume: ${resumeText}

Provide:
1. Skill gaps (list missing skills)
2. ATS optimization tips
3. Improvement suggestions
4. Strength areas

Respond in JSON format with keys: skillGaps, atsOptimization, improvements, strengths`;
    
    const response = await axios.post(GEMINI_PRO_URL, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const analysis = response.data.candidates[0].content.parts[0].text;
    
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mock Interview - Start Session (No Auth)
app.post('/api/mock-interview/start', async (req, res) => {
  try {
    const { interviewType, difficulty, targetRole } = req.body;
    
    let prompt = '';
    
    if (interviewType === 'technical') {
      prompt = `You are a ${difficulty} level technical interviewer for a ${targetRole} position. Ask 1 technical question. Be professional and clear.`;
    } else if (interviewType === 'behavioral') {
      prompt = `You are conducting a behavioral interview for a ${targetRole} position. Ask 1 behavioral question using the STAR method. Difficulty: ${difficulty}.`;
    } else if (interviewType === 'hr') {
      prompt = `You are an HR interviewer for a ${targetRole} position. Ask 1 HR-related question. Difficulty: ${difficulty}.`;
    } else if (interviewType === 'case-study') {
      prompt = `Present a ${difficulty} level case study problem for a ${targetRole} position. Be concise and clear.`;
    }
    
    const response = await axios.post(GEMINI_PRO_URL, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const question = response.data.candidates[0].content.parts[0].text;
    
    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mock Interview - Evaluate Answer (No Auth)
app.post('/api/mock-interview/evaluate', async (req, res) => {
  try {
    const { question, answer, interviewType } = req.body;
    
    const prompt = `Interview Type: ${interviewType}
Question: ${question}
Candidate Answer: ${answer}

Evaluate this answer and provide:
1. Score (0-10)
2. Strengths
3. Areas for improvement
4. Better answer example

Respond in JSON format with keys: score, strengths, improvements, betterAnswer`;
    
    const response = await axios.post(GEMINI_PRO_URL, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const evaluation = response.data.candidates[0].content.parts[0].text;
    
    res.json({ success: true, evaluation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Adaptive Rescheduling Logic (Protected)
app.post('/api/sessions/:id/reschedule', authMiddleware, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    // Intelligent rescheduling based on priority
    const newDate = new Date(session.date);
    newDate.setDate(newDate.getDate() + 1);
    
    session.date = newDate;
    session.rescheduledCount += 1;
    session.status = 'rescheduled';
    
    await session.save();
    
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
