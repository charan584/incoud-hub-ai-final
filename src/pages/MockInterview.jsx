import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AntigravityCanvas from '../components/AntigravityCanvas';
import api from '../utils/api';

const MockInterview = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('setup');
  const [interviewType, setInterviewType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    if (!interviewType || !difficulty || !targetRole) return;
    
    setLoading(true);
    try {
      const response = await api.post('/mock-interview/start', {
        interviewType,
        difficulty,
        targetRole
      });
      setQuestion(response.data.question);
      setStep('interview');
    } catch (error) {
      alert('Failed to start interview');
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    
    setLoading(true);
    try {
      const response = await api.post('/mock-interview/evaluate', {
        question,
        answer,
        interviewType
      });
      setEvaluation(response.data.evaluation);
      setStep('result');
    } catch (error) {
      alert('Failed to evaluate answer');
    }
    setLoading(false);
  };

  const reset = () => {
    setStep('setup');
    setInterviewType('');
    setDifficulty('');
    setTargetRole('');
    setQuestion('');
    setAnswer('');
    setEvaluation(null);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200">
      <AntigravityCanvas />

      <nav className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-[#121212]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
              </svg>
            </div>
            <h1 className="font-bold text-white text-lg">Incloudhub AI</h1>
          </div>
          <button onClick={() => navigate('/landing')} className="text-sm text-gray-400 hover:text-brand-orange">← Back</button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-white mb-2">AI Mock Interview</h2>
          <p className="text-gray-400">Practice with AI-powered interview simulation</p>
        </div>

        {step === 'setup' && (
          <div className="bg-[#1e1e1e]/60 backdrop-blur-md border border-white/5 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Setup Interview</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Interview Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['technical', 'behavioral', 'hr', 'case-study'].map(type => (
                    <button
                      key={type}
                      onClick={() => setInterviewType(type)}
                      className={`p-4 rounded-xl border transition-all ${
                        interviewType === type
                          ? 'border-brand-orange bg-brand-orange/10'
                          : 'border-white/10 hover:border-brand-orange/50'
                      }`}
                    >
                      <span className="font-semibold text-white capitalize">{type.replace('-', ' ')}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Easy', 'Medium', 'Hard'].map(level => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`p-4 rounded-xl border transition-all ${
                        difficulty === level
                          ? 'border-brand-orange bg-brand-orange/10'
                          : 'border-white/10 hover:border-brand-orange/50'
                      }`}
                    >
                      <span className="font-semibold text-white">{level}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Target Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Software Engineer, Data Analyst"
                  className="w-full bg-[#121212] border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <button
                onClick={startInterview}
                disabled={!interviewType || !difficulty || !targetRole || loading}
                className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Starting...' : 'Start Interview'}
              </button>
            </div>
          </div>
        )}

        {step === 'interview' && (
          <div className="space-y-6">
            <div className="bg-[#1e1e1e]/60 backdrop-blur-md border border-white/5 rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></div>
                <span className="text-sm text-brand-orange font-semibold uppercase">{interviewType} • {difficulty}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Question:</h3>
              <p className="text-gray-300 leading-relaxed">{question}</p>
            </div>

            <div className="bg-[#1e1e1e]/60 backdrop-blur-md border border-white/5 rounded-2xl p-8">
              <label className="block text-sm font-medium text-gray-400 mb-3">Your Answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows="8"
                placeholder="Type your answer here..."
                className="w-full bg-[#121212] border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-brand-orange resize-none"
              ></textarea>
              <button
                onClick={submitAnswer}
                disabled={!answer.trim() || loading}
                className="mt-4 w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Evaluating...' : 'Submit Answer'}
              </button>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-6">
            <div className="bg-[#1e1e1e]/60 backdrop-blur-md border border-white/5 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Evaluation Result</h3>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-gray-300 bg-[#121212] p-6 rounded-lg">{evaluation}</pre>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={reset}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-lg"
              >
                New Interview
              </button>
              <button
                onClick={() => navigate('/landing')}
                className="flex-1 bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 rounded-lg"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MockInterview;
