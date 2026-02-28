import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AntigravityCanvas from '../components/AntigravityCanvas';

const StudyScheduler = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('studySessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [completedSession, setCompletedSession] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [practiceType, setPracticeType] = useState('');
  const [mockTest, setMockTest] = useState(null);
  const [loadingMock, setLoadingMock] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newSession, setNewSession] = useState({
    subject: '',
    topic: '',
    date: '',
    time: '',
    duration: '60'
  });

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isSessionComplete = (session) => {
    const sessionDateTime = new Date(`${session.date}T${session.time}`);
    const sessionEndTime = new Date(sessionDateTime.getTime() + parseInt(session.duration) * 60000);
    return currentTime >= sessionEndTime;
  };

  const handleCreateSession = () => {
    if (newSession.subject && newSession.date && newSession.time) {
      const updatedSessions = [...sessions, { ...newSession, id: Date.now(), status: 'scheduled' }];
      setSessions(updatedSessions);
      localStorage.setItem('studySessions', JSON.stringify(updatedSessions));
      setNewSession({ subject: '', topic: '', date: '', time: '', duration: '60' });
      setShowModal(false);
    }
  };

  const handleCompleteSession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    setCompletedSession(session);
    setShowImageUpload(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitCompletion = () => {
    const updatedSessions = sessions.map(s => 
      s.id === completedSession.id ? { ...s, status: 'completed', image: uploadedImage, practiceType } : s
    );
    setSessions(updatedSessions);
    localStorage.setItem('studySessions', JSON.stringify(updatedSessions));
    setShowImageUpload(false);
    setShowCompletionPopup(true);
  };

  const handleDeleteSession = (sessionId) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    localStorage.setItem('studySessions', JSON.stringify(updatedSessions));
  };

  const generateMockTest = async () => {
    setLoadingMock(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: completedSession.subject,
          topic: completedSession.topic
        })
      });
      const data = await response.json();
      if (data.success) {
        setMockTest(data.mockTest);
      } else {
        alert('Failed to generate mock test. Please try again.');
      }
    } catch (error) {
      alert('Failed to generate mock test. Please try again.');
    } finally {
      setLoadingMock(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-gray-200">
      <AntigravityCanvas />

      <style>{`
        .glass-panel {
          background: rgba(26, 29, 35, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(247, 140, 37, 0.1);
        }
      `}</style>

      <nav className="border-b border-[#2d3139] glass-panel sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-brand-orange p-2 rounded-lg shadow-[0_0_15px_rgba(247,140,37,0.4)]">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
              </svg>
            </div>
            <h1 className="font-bold text-white text-xl tracking-tight">Incloudhub <span className="text-brand-orange">AI</span></h1>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <button onClick={() => navigate('/landing')} className="hover:text-brand-orange transition-colors">Home</button>
            <button onClick={() => navigate('/resources')} className="hover:text-brand-orange transition-colors">Resources Engine</button>
            <button className="text-white border-b-2 border-brand-orange pb-1">Study Scheduler</button>
            <button onClick={() => navigate('/resume')} className="hover:text-brand-orange transition-colors">AI Resume</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
        <header className="mb-12 flex justify-between items-start">
          <div>
            <h2 className="text-5xl font-extrabold text-white tracking-tight mb-4">Study <span className="text-brand-orange">Scheduler</span></h2>
            <p className="text-gray-400 text-lg max-w-2xl">Plan and track your study sessions with AI-powered accountability.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-brand-orange hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-brand-orange/20 active:scale-95"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
            New Session
          </button>
        </header>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold">📅</span>
            <h3 className="text-xl font-bold text-white">Your Sessions</h3>
          </div>

          {sessions.length === 0 ? (
            <div className="border-2 border-dashed border-[#2d3139] rounded-2xl h-96 flex flex-col items-center justify-center glass-panel group hover:border-brand-orange/30 transition-colors">
              <div className="p-4 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform">
                <svg className="h-10 w-10 text-gray-500 group-hover:text-brand-orange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium group-hover:text-gray-300">No sessions scheduled</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 text-brand-orange hover:text-white text-sm font-semibold underline underline-offset-4 decoration-brand-orange/30 hover:decoration-brand-orange"
              >
                Click here to schedule your first session
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map(session => (
                <div key={session.id} className="glass-panel p-6 rounded-3xl group hover:border-brand-orange/50 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-bold text-white">{session.subject}</h4>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        session.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-brand-orange/20 text-brand-orange'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4">{session.topic}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                      <span>{session.time} • {session.duration} mins</span>
                    </div>
                    {session.status === 'scheduled' && isSessionComplete(session) && (
                      <button
                        onClick={() => handleCompleteSession(session.id)}
                        className="w-full font-bold py-2 rounded-lg transition-all bg-green-500/20 hover:bg-green-500/30 text-green-400 cursor-pointer"
                      >
                        ✓ Mark as Complete
                      </button>
                    )}
                    {session.status === 'scheduled' && !isSessionComplete(session) && (
                      <div className="w-full font-bold py-2 rounded-lg bg-gray-500/20 text-gray-500 text-center">
                        ⏳ Session in Progress
                      </div>
                    )}
                    {session.status === 'completed' && (
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="w-full font-bold py-2 rounded-lg transition-all bg-red-500/20 hover:bg-red-500/30 text-red-400 cursor-pointer"
                      >
                        🗑️ Delete Session
                      </button>
                    )}
                  </div>
                ))}
            </div>
          )}
        </section>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Create Study Session</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                <input
                  type="text"
                  value={newSession.subject}
                  onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-brand-orange"
                  placeholder="e.g., Data Structures"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Topic</label>
                <input
                  type="text"
                  value={newSession.topic}
                  onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-brand-orange"
                  placeholder="e.g., Binary Trees"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
                  <input
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Time</label>
                  <input
                    type="time"
                    value={newSession.time}
                    onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Duration (minutes)</label>
                <select
                  value={newSession.duration}
                  onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-brand-orange"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 border border-white/10 rounded-lg text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSession}
                className="flex-1 py-3 bg-brand-orange hover:bg-orange-600 rounded-lg text-white font-bold transition-all"
              >
                Create Session
              </button>
            </div>
          </div>
        </div>
      )}

      {showImageUpload && completedSession && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Session Completed! 🎉</h3>
            <p className="text-gray-400 mb-6">Did you practice or just study?</p>
            
            <div className="space-y-4 mb-6">
              <button
                onClick={() => setPracticeType('practiced')}
                className={`w-full py-3 px-4 rounded-lg border transition-all ${
                  practiceType === 'practiced' 
                    ? 'border-brand-orange bg-brand-orange/20 text-brand-orange' 
                    : 'border-white/10 text-white hover:bg-white/5'
                }`}
              >
                ✍️ I Practiced (Upload proof)
              </button>
              <button
                onClick={() => setPracticeType('studied')}
                className={`w-full py-3 px-4 rounded-lg border transition-all ${
                  practiceType === 'studied' 
                    ? 'border-brand-orange bg-brand-orange/20 text-brand-orange' 
                    : 'border-white/10 text-white hover:bg-white/5'
                }`}
              >
                📚 I Just Studied
              </button>
            </div>

            {practiceType === 'practiced' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Upload Practice Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 bg-[#121212] border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-orange file:text-black file:font-bold hover:file:bg-orange-600"
                />
                {uploadedImage && (
                  <div className="mt-4">
                    <img src={uploadedImage} alt="Practice" className="w-full h-40 object-cover rounded-lg" />
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowImageUpload(false);
                  setUploadedImage(null);
                  setPracticeType('');
                }}
                className="flex-1 py-3 border border-white/10 rounded-lg text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitCompletion}
                disabled={!practiceType || (practiceType === 'practiced' && !uploadedImage)}
                className="flex-1 py-3 bg-brand-orange hover:bg-orange-600 rounded-lg text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompletionPopup && completedSession && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-[#1e1e1e] border border-green-500/30 rounded-2xl p-8 max-w-2xl w-full text-center my-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">🎉 Session Completed!</h3>
            <p className="text-gray-400 mb-2">Great job completing your study session on</p>
            <p className="text-brand-orange font-bold text-xl mb-6">{completedSession.subject} - {completedSession.topic}</p>
            
            {practiceType === 'practiced' && uploadedImage && (
              <div className="mb-6">
                <p className="text-green-400 mb-3">✅ Practice proof uploaded!</p>
                <img src={uploadedImage} alt="Practice" className="w-full h-32 object-cover rounded-lg" />
              </div>
            )}
            
            <p className="text-gray-500 text-sm mb-8">Keep up the momentum! Consistency is key to success.</p>
            
            {mockTest && (
              <div className="mb-6 text-left bg-[#121212] p-6 rounded-lg max-h-96 overflow-y-auto">
                <h4 className="text-brand-orange font-bold mb-4 text-center">📝 Mock Test Generated</h4>
                <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">{mockTest}</pre>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={generateMockTest}
                disabled={loadingMock}
                className="w-full py-3 bg-brand-orange hover:bg-orange-600 rounded-lg text-white font-bold transition-all disabled:opacity-50"
              >
                {loadingMock ? 'Generating...' : `Generate Mock Test on ${completedSession.topic}`}
              </button>
              <button
                onClick={() => {
                  setShowCompletionPopup(false);
                  setUploadedImage(null);
                  setPracticeType('');
                  setMockTest(null);
                }}
                className="w-full py-3 border border-white/10 rounded-lg text-white hover:bg-white/5 transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyScheduler;
