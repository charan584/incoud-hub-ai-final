# Incloudhub AI - Smart Academic Intelligence Platform

## 🧠 Overview

Incloudhub AI is a production-ready academic AI ecosystem built with React, TailwindCSS, Node.js, Express, and MongoDB. It features three core intelligence engines:

1. **Resources Engine** - Structured academic library with internal JSON-based resources
2. **AI Study Scheduler** - Adaptive learning system with Gemini Vision verification
3. **AI Resume Suggester** - Growth-oriented career intelligence

## 🎨 Design System

**Brand Colors (STRICT):**
- Orange: `#F78C25`
- Dark: `#0A0A0A`
- Charcoal: `#121212`
- Gray: `#333333`

**Key Features:**
- Antigravity dot-grid canvas animation
- Glass-morphism UI components
- GSAP scroll animations
- Smooth transitions and hover effects

## 🚀 Installation

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will run on `http://localhost:3000`

### Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start server
npm start
```

The server will run on `http://localhost:5000`

## 📁 Project Structure

```
incloudhub-ai/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── AntigravityCanvas.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Landing.jsx
│   │   ├── ResourcesEngine.jsx
│   │   ├── StudyScheduler.jsx
│   │   └── ResumeSuggester.jsx
│   ├── data/
│   │   └── resources.json
│   ├── App.jsx
│   ├── index.jsx
│   └── index.css
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env
└── package.json
```

## 🔧 Configuration

### MongoDB Connection
Update the connection string in `server/.env`:
```
MONGODB_URI=mongodb+srv://testDB:<password>@cluster0.efnaipp.mongodb.net/incloudhub
```

### Gemini API Key
The Gemini Vision API key is configured in `server/.env`:
```
GEMINI_API_KEY=AIzaSyCcKRsFVJv9dXYiyDEug57HuFXTUKcoTmk
```

## 🎯 Features

### 1. Resources Engine
- Branch selection (CSE, IT, AIDS, AIML, MECH, CIVIL, ECE, EEE)
- Year-wise navigation (1st to 4th year)
- Subject and unit-level organization
- Internal JSON-based resource system (NO external links)

### 2. AI Study Scheduler
- Create and manage study sessions
- Adaptive rescheduling (never deletes missed sessions)
- Gemini Vision API integration for study verification
- Before/after image comparison
- Accountability tracking

### 3. AI Resume Suggester
- Skill gap analysis
- ATS optimization suggestions
- Career roadmap generation
- Year-based recommendations

## 🌌 Antigravity Canvas

All pages feature an interactive dot-grid background that responds to mouse movement with physics-based animations:
- Dots repel from cursor (antigravity effect)
- Spring-back animation to original position
- Orange glow on interaction
- Performance optimized with requestAnimationFrame

## 🔒 Ecosystem Rules

✅ **DO:**
- Use only brand colors (#F78C25, #333333)
- Maintain glass-morphism design
- Keep antigravity canvas on all pages
- Use internal resources only

❌ **DON'T:**
- Use external Google links
- Add blue/indigo colors
- Break layout structure
- Remove animations

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Sessions
- `GET /api/sessions/:userId` - Get user sessions
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `POST /api/sessions/:id/reschedule` - Reschedule session

### AI Features
- `POST /api/verify-study` - Verify study with Gemini Vision
- `POST /api/analyze-resume` - Analyze resume and get suggestions

## 🎓 Usage

1. **Login** - Start at the login page
2. **Landing** - Navigate to different features
3. **Resources** - Browse academic materials by branch/year
4. **Scheduler** - Create and track study sessions
5. **Resume** - Analyze skills and get career guidance

## 🛠️ Technologies

- **Frontend:** React 18, TailwindCSS, GSAP, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **AI:** Google Gemini Vision API
- **Styling:** TailwindCSS with custom configuration

## 📦 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
```

### Backend (Heroku/Railway)
```bash
cd server
npm start
```

## 🔐 Security Notes

- Never commit `.env` files
- Rotate API keys regularly
- Use environment variables for sensitive data
- Implement proper authentication in production

## 📄 License

© 2024 Incloudhub AI. All rights reserved.

---

**Built with ❤️ for students and professionals**
