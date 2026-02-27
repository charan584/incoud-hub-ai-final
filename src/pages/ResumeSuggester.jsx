import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AntigravityCanvas from '../components/AntigravityCanvas';
import api from '../utils/api';

const ResumeSuggester = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [year, setYear] = useState('Year 1');
  const [targetRole, setTargetRole] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const addSkill = () => {
    if (currentSkill.trim()) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target.result);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a .txt file');
    }
  };

  const handleAnalyze = async () => {
    if (skills.length === 0 || !targetRole || !resumeText) {
      alert('Please fill all fields and upload resume');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/analyze-resume', {
        skills,
        year,
        targetRole,
        resumeText
      });
      setAnalysis(response.data.analysis);
      setAnalyzed(true);
    } catch (error) {
      alert('Failed to analyze resume');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200">
      <AntigravityCanvas />

      <div className="flex flex-col h-screen overflow-y-auto relative z-10">
        <header className="max-w-6xl mx-auto w-full px-8 pt-10 pb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center shadow-lg shadow-brand-orange/20">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-white text-xl">Incloudhub AI</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Academic Growth Ecosystem</p>
            </div>
          </div>
          <button onClick={() => navigate('/landing')} className="text-sm text-gray-400 hover:text-brand-orange">← Back</button>
        </header>

        <main className="max-w-6xl mx-auto w-full px-8 pb-12">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-brand-orange/10 rounded-lg">
                <svg className="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Resume AI Intelligence</h2>
            </div>
            <p className="text-gray-500">Get AI-powered insights to strengthen your profile</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-[#1e1e1e]/60 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-6 h-6 rounded-full border-2 border-brand-orange flex items-center justify-center">
                  <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></div>
                </div>
                <h3 className="font-semibold text-white">Your Profile</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Current Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all outline-none"
                  >
                    <option>Year 1</option>
                    <option>Year 2</option>
                    <option>Year 3</option>
                    <option>Year 4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Target Role</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g., Software Engineer, Data Scientist"
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Upload Resume (.txt)</label>
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-orange file:text-white file:cursor-pointer"
                  />
                  {resumeText && (
                    <p className="text-xs text-green-400 mt-2">✓ Resume uploaded ({resumeText.length} characters)</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Your Skills</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      placeholder="e.g., Python, React, SQL..."
                      className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange outline-none transition-all"
                    />
                    <button
                      onClick={addSkill}
                      className="bg-brand-orange hover:bg-orange-600 p-3 rounded-lg transition-all shadow-lg shadow-brand-orange/20 active:scale-90"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Add your skills to get started</p>

                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-brand-orange/20 text-brand-orange rounded-full text-sm flex items-center gap-2"
                        >
                          {skill}
                          <button onClick={() => removeSkill(index)} className="hover:text-white">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={skills.length === 0 || !targetRole || !resumeText || loading}
                  className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-orange/10 active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  {loading ? 'Analyzing...' : 'Analyze My Profile'}
                </button>
              </div>
            </div>

            <div className="bg-[#1e1e1e]/60 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <h3 className="font-semibold text-white">AI Analysis</h3>
              </div>

              {!analyzed ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                  <div className="bg-white/5 p-6 rounded-full inline-block mb-4">
                    <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium max-w-[200px] mx-auto">Upload resume and analyze to see insights</p>
                </div>
              ) : (
                <div className="space-y-4 overflow-y-auto max-h-96">
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-300 bg-[#1a1a1a] p-4 rounded-lg">{analysis}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#1e1e1e] to-brand-orange/5 border border-white/5 rounded-2xl p-8 flex items-start gap-6">
            <div className="bg-brand-orange/20 p-4 rounded-xl">
              <svg className="w-8 h-8 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <div className="max-w-3xl">
              <h4 className="text-white font-bold text-lg mb-2">Pro Tip</h4>
              <p className="text-gray-400 leading-relaxed">
                Focus on building real projects that solve actual problems. Recruiters value practical experience over certificates. Start with one project, complete it fully, then move to the next.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResumeSuggester;
