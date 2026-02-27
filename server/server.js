const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_SECRET_KEY = 'incloudhub_admin_2024';

// Middleware
app.use(cors());
app.use(express.json());

// Email Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordOTP: String,
  resetPasswordExpires: Date,
  createdAt: { type: Date, default: Date.now }
});

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  resetPasswordOTP: String,
  resetPasswordExpires: Date,
  createdAt: { type: Date, default: Date.now }
});

const ResourceSchema = new mongoose.Schema({
  branch: String,
  year: String,
  section: String,
  subject: String,
  unit: String,
  link: String,
  createdAt: { type: Date, default: Date.now }
});

const Session = mongoose.model('Session', SessionSchema);
const User = mongoose.model('User', UserSchema);
const Admin = mongoose.model('Admin', AdminSchema);
const Resource = mongoose.model('Resource', ResourceSchema);

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
    const user = new User({ email, password: hashedPassword, name, isVerified: true });
    await user.save();
    
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ success: true, token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify Email
app.get('/api/auth/verify-email/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid verification token' });
    }
    
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ success: true, token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Forgot Password - Send OTP
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
    await user.save();
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - Incloudhub AI',
      html: `<h2>Password Reset Request</h2><p>Your OTP is: <strong>${otp}</strong></p><p>This OTP will expire in 10 minutes.</p>`
    });
    
    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reset Password with OTP
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    const user = await User.findOne({ 
      email, 
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }
    
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Signup
app.post('/api/auth/admin-signup', async (req, res) => {
  try {
    const { email, password, name, adminKey } = req.body;
    
    if (adminKey !== ADMIN_SECRET_KEY) {
      return res.status(403).json({ success: false, error: 'Invalid admin key' });
    }
    
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, error: 'Admin already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword, name });
    await admin.save();
    
    const token = jwt.sign({ adminId: admin._id, email: admin.email, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ success: true, token, admin: { id: admin._id, email: admin.email, name: admin.name } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Login
app.post('/api/auth/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ adminId: admin._id, email: admin.email, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ success: true, token, admin: { id: admin._id, email: admin.email, name: admin.name } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Forgot Password - Send OTP
app.post('/api/auth/admin-forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetPasswordOTP = otp;
    admin.resetPasswordExpires = Date.now() + 600000;
    await admin.save();
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Admin Password Reset OTP - Incloudhub AI',
      html: `<h2>Admin Password Reset Request</h2><p>Your OTP is: <strong>${otp}</strong></p><p>This OTP will expire in 10 minutes.</p>`
    });
    
    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Reset Password with OTP
app.post('/api/auth/admin-reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    const admin = await Admin.findOne({ 
      email, 
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!admin) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }
    
    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetPasswordOTP = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();
    
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Routes
app.get('/api/admin/resources', async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json({ success: true, resources });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/admin/resources', async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/resources/:id', async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ success: true });
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
