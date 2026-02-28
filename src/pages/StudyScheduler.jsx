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
  const [completedSession, setCompletedSession] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newSession, setNewSession] = useState({
    subject: '',
    topic: '',
    date: '',
    time: '',
    duration: '60'
  });

  // Update current time every minute
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isSessionTimeComplete = (session) => {
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
    const updatedSessions = sessions.map(s => 
      s.id === sessionId ? { ...s, status: 'completed' } : s
    );
    setSessions(updatedSessions);
    localStorage.setItem('studySessions', JSON.stringify(updatedSessions));
    setCompletedSession(session);
    setShowCompletionPopup(true);
  };

  return (
    <div className="bg-[#1a1a1a] text-gray-100 min-h-screen">
      <AntigravityCanvas />

      <div className="flex h-screen overflow-hidden relative">
        <main className="flex-1 flex flex-col overflow-y-auto z-10">
          <header className="max-w-7xl mx-auto w-full px-8 pt-10 pb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center shadow-lg shadow-brand-orange/20">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                  </svg>
                </div>
                <h1 className="font-bold text-white text-lg leading-tight">Incloudhub AI</h1>
              </div>
              <h2 className="text-4xl font-bold text-white tracking-tight">Study Scheduler</h2>
              <p className="text-gray-400 mt-2 text-lg">Plan and track your study sessions</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-brand-orange hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-brand-orange/20 active:scale-95"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              New Session
            </button>
          </header>

          <section className="max-w-7xl mx-auto w-full px-8 py-6">
            <div className="flex items-center gap-2 mb-6 text-brand-orange">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white">Today's Sessions</h3>
            </div>

            {sessions.length === 0 ? (
              <div className="border-2 border-dashed border-white/10 rounded-2xl h-96 flex flex-col items-center justify-center bg-white/[0.02] backdrop-blur-sm group hover:border-brand-orange/30 transition-colors">
                <div className="p-4 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform">
                  <svg className="h-10 w-10 text-gray-500 group-hover:text-brand-orange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <p className="text-gray-500 text-lg font-medium group-hover:text-gray-300">No sessions scheduled for today</p>
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
                  <div key={session.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-brand-orange/50 transition-all">
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
                    {session.status === 'scheduled' && (
                      <button
                        onClick={() => handleCompleteSession(session.id)}
                        disabled={!isSessionTimeComplete(session)}
                        className={`w-full font-bold py-2 rounded-lg transition-all ${
                          isSessionTimeComplete(session)
                            ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 cursor-pointer'
                            : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                        }`}
                        title={!isSessionTimeComplete(session) ? 'Complete the session duration first' : 'Mark as complete'}
                      >
                        {isSessionTimeComplete(session) ? '✓ Mark as Complete' : '⏳ Session in Progress'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

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

      {showCompletionPopup && completedSession && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#1e1e1e] border border-green-500/30 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">🎉 Session Completed!</h3>
            <p className="text-gray-400 mb-2">Great job completing your study session on</p>
            <p className="text-brand-orange font-bold text-xl mb-6">{completedSession.subject}</p>
            <p className="text-gray-500 text-sm mb-8">Keep up the momentum! Consistency is key to success.</p>
            <button
              onClick={() => setShowCompletionPopup(false)}
              className="w-full py-3 bg-brand-orange hover:bg-orange-600 rounded-lg text-white font-bold transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyScheduler;
