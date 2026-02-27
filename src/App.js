import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminSignup from './pages/AdminSignup.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Landing from './pages/Landing.jsx';
import ResourcesEngine from './pages/ResourcesEngine.jsx';
import StudyScheduler from './pages/StudyScheduler.jsx';
import ResumeSuggester from './pages/ResumeSuggester.jsx';
import MockInterview from './pages/MockInterview.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/resources" element={<ResourcesEngine />} />
        <Route path="/scheduler" element={<StudyScheduler />} />
        <Route path="/resume" element={<ResumeSuggester />} />
        <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
