// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AntigravityCanvas from '../components/AntigravityCanvas';
// import api from '../utils/api';

// const ResumeSuggester = () => {
//   const navigate = useNavigate();
//   const [skills, setSkills] = useState([]);
//   const [currentSkill, setCurrentSkill] = useState('');
//   const [year, setYear] = useState('Year 1');
//   const [targetRole, setTargetRole] = useState('');
//   const [resumeText, setResumeText] = useState('');
//   const [analyzed, setAnalyzed] = useState(false);
//   const [analysis, setAnalysis] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const addSkill = () => {
//     if (currentSkill.trim()) {
//       setSkills([...skills, currentSkill.trim()]);
//       setCurrentSkill('');
//     }
//   };

//   const removeSkill = (index) => {
//     setSkills(skills.filter((_, i) => i !== index));
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type === 'text/plain') {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setResumeText(event.target.result);
//       };
//       reader.readAsText(file);
//     } else {
//       alert('Please upload a .txt file');
//     }
//   };

//   const handleAnalyze = async () => {
//     if (skills.length === 0 || !targetRole || !resumeText) {
//       alert('Please fill all fields and upload resume');
//       return;
//     }
    
//     setLoading(true);
//     try {
//       const response = await api.post('/analyze-resume', {
//         skills,
//         year,
//         targetRole,
//         resumeText
//       });
//       setAnalysis(response.data.analysis);
//       setAnalyzed(true);
//     } catch (error) {
//       alert('Failed to analyze resume');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-[#121212] text-gray-200">
//       <AntigravityCanvas />

//       <div className="flex flex-col h-screen overflow-y-auto relative z-10">
//         <header className="max-w-6xl mx-auto w-full px-8 pt-10 pb-6 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center shadow-lg shadow-brand-orange/20">
//               <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
//                 <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
//               </svg>
//             </div>
//             <div>
//               <h1 className="font-bold text-white text-xl">Incloudhub AI</h1>
//               <p className="text-[10px] text-gray-500 uppercase tracking-widest">Academic Growth Ecosystem</p>
//             </div>
//           </div>
//           <button onClick={() => navigate('/landing')} className="text-sm text-gray-400 hover:text-brand-orange">← Back</button>
//         </header>

//         <main className="max-w-6xl mx-auto w-full px-8 pb-12">
//           <div className="mb-10">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 bg-brand-orange/10 rounded-lg">
//                 <svg className="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
//                 </svg>
//               </div>
//               <h2 className="text-3xl font-bold text-white">Resume AI Intelligence</h2>
//             </div>
//             <p className="text-gray-500">Get AI-powered insights to strengthen your profile</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
//             <div className="bg-[#1e1e1e]/60 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-2xl">
//               <div className="flex items-center gap-2 mb-8">
//                 <div className="w-6 h-6 rounded-full border-2 border-brand-orange flex items-center justify-center">
//                   <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></div>
//                 </div>
//                 <h3 className="font-semibold text-white">Your Profile</h3>
//               </div>

//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-2">Current Year</label>
//                   <select
//                     value={year}
//                     onChange={(e) => setYear(e.target.value)}
//                     className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all outline-none"
//                   >
//                     <option>Year 1</option>
//                     <option>Year 2</option>
//                     <option>Year 3</option>
//                     <option>Year 4</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-2">Target Role</label>
//                   <input
//                     type="text"
//                     value={targetRole}
//                     onChange={(e) => setTargetRole(e.target.value)}
//                     placeholder="e.g., Software Engineer, Data Scientist"
//                     className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange outline-none transition-all"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-2">Upload Resume (.txt)</label>
//                   <input
//                     type="file"
//                     accept=".txt"
//                     onChange={handleFileUpload}
//                     className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-orange file:text-white file:cursor-pointer"
//                   />
//                   {resumeText && (
//                     <p className="text-xs text-green-400 mt-2">✓ Resume uploaded ({resumeText.length} characters)</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-2">Your Skills</label>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={currentSkill}
//                       onChange={(e) => setCurrentSkill(e.target.value)}
//                       onKeyPress={(e) => e.key === 'Enter' && addSkill()}
//                       placeholder="e.g., Python, React, SQL..."
//                       className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange outline-none transition-all"
//                     />
//                     <button
//                       onClick={addSkill}
//                       className="bg-brand-orange hover:bg-orange-600 p-3 rounded-lg transition-all shadow-lg shadow-brand-orange/20 active:scale-90"
//                     >
//                       <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
//                       </svg>
//                     </button>
//                   </div>
//                   <p className="text-xs text-gray-600 mt-2">Add your skills to get started</p>

//                   {skills.length > 0 && (
//                     <div className="flex flex-wrap gap-2 mt-4">
//                       {skills.map((skill, index) => (
//                         <span
//                           key={index}
//                           className="px-3 py-1 bg-brand-orange/20 text-brand-orange rounded-full text-sm flex items-center gap-2"
//                         >
//                           {skill}
//                           <button onClick={() => removeSkill(index)} className="hover:text-white">×</button>
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <button
//                   onClick={handleAnalyze}
//                   disabled={skills.length === 0 || !targetRole || !resumeText || loading}
//                   className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-orange/10 active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
//                   </svg>
//                   {loading ? 'Analyzing...' : 'Analyze My Profile'}
//                 </button>
//               </div>
//             </div>

//             <div className="bg-[#1e1e1e]/60 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col">
//               <div className="flex items-center gap-2 mb-6">
//                 <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
//                 </svg>
//                 <h3 className="font-semibold text-white">AI Analysis</h3>
//               </div>

//               {!analyzed ? (
//                 <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
//                   <div className="bg-white/5 p-6 rounded-full inline-block mb-4">
//                     <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
//                     </svg>
//                   </div>
//                   <p className="text-gray-500 font-medium max-w-[200px] mx-auto">Upload resume and analyze to see insights</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4 overflow-y-auto max-h-96">
//                   <div className="prose prose-invert max-w-none">
//                     <pre className="whitespace-pre-wrap text-sm text-gray-300 bg-[#1a1a1a] p-4 rounded-lg">{analysis}</pre>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="bg-gradient-to-r from-[#1e1e1e] to-brand-orange/5 border border-white/5 rounded-2xl p-8 flex items-start gap-6">
//             <div className="bg-brand-orange/20 p-4 rounded-xl">
//               <svg className="w-8 h-8 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
//               </svg>
//             </div>
//             <div className="max-w-3xl">
//               <h4 className="text-white font-bold text-lg mb-2">Pro Tip</h4>
//               <p className="text-gray-400 leading-relaxed">
//                 Focus on building real projects that solve actual problems. Recruiters value practical experience over certificates. Start with one project, complete it fully, then move to the next.
//               </p>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ResumeSuggester;
// 
// import React, { useState } from "react";

// const ResumeAnalyzer = () => {
//   const [skillsInput, setSkillsInput] = useState("");
//   const [branch, setBranch] = useState("CSE");
//   const [year, setYear] = useState(1);
//   const [loading, setLoading] = useState(false);

//   // Results State
//   const [matchedSkills, setMatchedSkills] = useState([]);
//   const [missingSkills, setMissingSkills] = useState([]);
//   const [atsScoreValue, setAtsScoreValue] = useState(0);

//   // THE STRICT MATRIX: Every year MUST have different skills
//   const SKILL_MAPS = {
//     CSE: {
//       1: ['c', 'html', 'css', 'logic building'],
//       2: ['java', 'python', 'data structures', 'sql'],
//       3: ['react', 'node.js', 'operating systems', 'git'],
//       4: ['docker', 'aws', 'system design', 'kubernetes']
//     },
//     ECE: {
//       1: ['basic electronics', 'physics', 'c programming'],
//       2: ['circuit design', 'digital electronics', 'signals'],
//       3: ['microprocessors', 'vlsi', 'embedded c'],
//       4: ['iot', 'dsp', 'verilog']
//     },
//     // Add other branches here...
//   };

//   const analyzeResume = () => {
//     if (!skillsInput.trim()) {
//       alert("Please enter your current skills");
//       return;
//     }

//     setLoading(true);

//     // Reset old results immediately so the user knows a new calculation is happening
//     setMatchedSkills([]);
//     setMissingSkills([]);
//     setAtsScoreValue(0);

//     setTimeout(() => {
//       const userSkills = skillsInput
//         .split(",")
//         .map((s) => s.trim().toLowerCase())
//         .filter(Boolean);

//       // CRITICAL FIX: Access skills ONLY for the selected year
//       const targetYearSkills = SKILL_MAPS[branch][year] || [];

//       // Only match against the skills for THIS specific year
//       const matched = userSkills.filter((u) =>
//         targetYearSkills.some((t) => u.includes(t) || t.includes(u))
//       );

//       const missing = targetYearSkills.filter(
//         (t) => !userSkills.some((u) => u.includes(t) || t.includes(u))
//       );

//       const score = Math.round((matched.length / targetYearSkills.length) * 100);

//       setMatchedSkills(matched);
//       setMissingSkills(missing);
//       setAtsScoreValue(score);
//       setLoading(false);
//     }, 800);
//   };

//   return (
//     <div style={{ padding: '40px', backgroundColor: '#121212', color: 'white', minHeight: '100vh' }}>
//       <div style={{ maxWidth: '800px', margin: '0 auto', background: '#1e1e1e', padding: '30px', borderRadius: '15px' }}>
//         <h2>Skill Analyzer</h2>

//         {/* Inputs */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
//           <input
//             placeholder="Enter skills (e.g., C, Python)"
//             value={skillsInput}
//             onChange={(e) => setSkillsInput(e.target.value)}
//             style={{ padding: '12px', background: '#2d2d2d', border: '1px solid #444', color: 'white', borderRadius: '8px' }}
//           />

//           <div style={{ display: 'flex', gap: '20px' }}>
//             <select 
//                 value={branch} 
//                 onChange={(e) => setBranch(e.target.value)}
//                 style={{ flex: 1, padding: '10px', background: '#2d2d2d', color: 'white' }}
//             >
//               {Object.keys(SKILL_MAPS).map(b => <option key={b} value={b}>{b}</option>)}
//             </select>

//             <select 
//                 value={year} 
//                 onChange={(e) => setYear(Number(e.target.value))}
//                 style={{ flex: 1, padding: '10px', background: '#2d2d2d', color: 'white' }}
//             >
//               <option value={1}>1st Year</option>
//               <option value={2}>2nd Year</option>
//               <option value={3}>3rd Year</option>
//               <option value={4}>4th Year</option>
//             </select>
//           </div>

//           <button 
//             onClick={analyzeResume}
//             style={{ padding: '15px', background: '#f39c12', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
//           >
//             {loading ? "Analyzing..." : "🚀 Analyze My Profile"}
//           </button>
//         </div>

//         {/* Results Section */}
//         <div style={{ marginTop: '40px' }}>
//           <div style={{ textAlign: 'center', marginBottom: '30px' }}>
//             <h1 style={{ color: '#f39c12' }}>{atsScoreValue}%</h1>
//             <p>ATS Match for {branch} - Year {year}</p>
//           </div>

//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
//             <div style={{ background: '#2d2d2d', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #2ecc71' }}>
//               <h4>✅ Matched (Year {year})</h4>
//               <p>{matchedSkills.length > 0 ? matchedSkills.join(", ") : "---"}</p>
//             </div>

//             <div style={{ background: '#2d2d2d', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #e74c3c' }}>
//               <h4>⚠️ Missing (Year {year})</h4>
//               <p>{missingSkills.length > 0 ? missingSkills.join(", ") : "---"}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResumeAnalyzer;
import React, { useState } from "react";
import AntigravityCanvas from "../components/AntigravityCanvas";

const ResumeAnalyzer = () => {
  const [skillsInput, setSkillsInput] = useState("");
  const [branch, setBranch] = useState("CSE");
  const [year, setYear] = useState(1);
  const [loading, setLoading] = useState(false);

  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [atsScoreValue, setAtsScoreValue] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [scores, setScores] = useState([]);

  const SKILL_MAPS = {
    CSE: {
      1: ['c', 'html', 'css', 'logic building', 'communication'],
      2: ['java', 'python', 'data structures', 'sql', 'communication'],
      3: ['react', 'node.js', 'operating systems', 'git', 'communication'],
      4: ['docker', 'aws', 'system design', 'kubernetes', 'communication']
    },
    IT: {
      1: ['html', 'css', 'c', 'basics of it', 'communication'],
      2: ['javascript', 'python', 'sql', 'networking', 'communication'],
      3: ['react', 'web development', 'git', 'api design', 'communication'],
      4: ['cloud computing', 'devops', 'security', 'microservices', 'communication']
    },
    AIDS: {
      1: ['python', 'statistics', 'mathematics', 'excel', 'communication'],
      2: ['pandas', 'numpy', 'sql', 'data visualization', 'communication'],
      3: ['machine learning', 'scikit-learn', 'matplotlib', 'seaborn', 'communication'],
      4: ['deep learning', 'tensorflow', 'nlp', 'computer vision', 'communication']
    },
    AIML: {
      1: ['python', 'mathematics', 'statistics', 'linear algebra', 'communication'],
      2: ['numpy', 'pandas', 'matplotlib', 'sql', 'communication'],
      3: ['machine learning', 'scikit-learn', 'tensorflow', 'keras', 'communication'],
      4: ['deep learning', 'pytorch', 'nlp', 'reinforcement learning', 'communication']
    },
    MECH: {
      1: ['engineering drawing', 'autocad', 'mechanics', 'materials', 'communication'],
      2: ['solidworks', 'thermodynamics', 'manufacturing', 'cad', 'communication'],
      3: ['ansys', 'catia', 'fluid mechanics', 'heat transfer', 'communication'],
      4: ['cfd', 'fem', 'robotics', 'automation', 'communication']
    },
    CIVIL: {
      1: ['engineering drawing', 'autocad', 'surveying', 'basics', 'communication'],
      2: ['structural analysis', 'concrete design', 'soil mechanics', 'cad', 'communication'],
      3: ['staad pro', 'revit', 'construction management', 'estimation', 'communication'],
      4: ['advanced design', 'project management', 'bim', 'gis', 'communication']
    },
    ECE: {
      1: ['basic electronics', 'physics', 'c programming', 'circuits', 'communication'],
      2: ['circuit design', 'digital electronics', 'signals', 'matlab', 'communication'],
      3: ['microprocessors', 'vlsi', 'embedded c', 'arduino', 'communication'],
      4: ['iot', 'dsp', 'verilog', 'pcb design', 'communication']
    },
    EEE: {
      1: ['electrical circuits', 'physics', 'c programming', 'basics', 'communication'],
      2: ['power systems', 'electrical machines', 'matlab', 'circuits', 'communication'],
      3: ['power electronics', 'control systems', 'plc', 'scada', 'communication'],
      4: ['renewable energy', 'smart grid', 'automation', 'hvdc', 'communication']
    }
  };

  const analyzeResume = () => {
    if (!skillsInput.trim()) {
      alert("Please enter your current skills");
      return;
    }

    setLoading(true);
    setMatchedSkills([]);
    setMissingSkills([]);
    setAtsScoreValue(0);

    setTimeout(() => {
      const userSkills = skillsInput
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      const targetYearSkills = SKILL_MAPS[branch][year] || [];
      const allBranchSkills = Object.values(SKILL_MAPS[branch]).flat();

      const matched = userSkills.filter((u) =>
        targetYearSkills.some((t) => u.includes(t) || t.includes(u))
      );

      const missing = targetYearSkills.filter(
        (t) => !userSkills.some((u) => u.includes(t) || t.includes(u))
      );

      const skillsCoverage = Math.round((matched.length / targetYearSkills.length) * 100);
      const profileCompleteness = Math.min(100, Math.round((userSkills.length / allBranchSkills.length) * 100) + year * 5);
      const jobReadiness = year >= 3 && matched.length >= 3 ? Math.min(85, skillsCoverage + 15) : Math.max(20, skillsCoverage - 15);

      setScores([
        { label: "Skills Coverage", value: skillsCoverage },
        { label: "Profile Completeness", value: profileCompleteness },
        { label: "Job Readiness", value: jobReadiness }
      ]);

      const projectIdeas = {
        1: `Mini-project: Build a simple ${branch === 'CSE' || branch === 'IT' ? 'calculator or portfolio website' : branch === 'ECE' || branch === 'EEE' ? 'LED circuit with Arduino' : 'basic CAD drawing'} to practice fundamentals.`,
        2: `Intermediate project: Create a ${branch === 'CSE' || branch === 'IT' ? 'CRUD app with database' : branch === 'AIDS' || branch === 'AIML' ? 'data analysis dashboard' : branch === 'ECE' || branch === 'EEE' ? 'sensor-based IoT system' : 'structural analysis model'}.`,
        3: `Advanced project: Develop a ${branch === 'CSE' || branch === 'IT' ? 'full-stack web application' : branch === 'AIDS' || branch === 'AIML' ? 'ML model with deployment' : branch === 'ECE' || branch === 'EEE' ? 'embedded system project' : 'complete design simulation'}.`,
        4: `Capstone project: Build an industry-ready ${branch === 'CSE' || branch === 'IT' ? 'scalable microservices app' : branch === 'AIDS' || branch === 'AIML' ? 'AI solution with real-world data' : branch === 'ECE' || branch === 'EEE' ? 'IoT/automation system' : 'comprehensive engineering solution'}.`
      };

      const proTips = {
        'git': '💡 Pro-Tip: Add Git immediately for version control — essential for all tech roles.',
        'docker': '🐳 Pro-Tip: Learn Docker for containerization — critical for modern deployment.',
        'communication': '🗣️ Pro-Tip: Develop communication skills — crucial for interviews and teamwork.',
        'sql': '💾 Pro-Tip: Master SQL for database management — required by 90% of companies.',
        'python': '🐍 Pro-Tip: Learn Python — the most versatile language for all domains.'
      };

      const missingTool = missing.find(m => proTips[m]);
      const suggestions = [
        projectIdeas[year],
        missingTool ? proTips[missingTool] : '✅ Great! You have the core tools covered.',
        skillsCoverage < 50 ? `⚠️ Focus on mastering Year ${year} skills before moving ahead.` : `🌟 Strong foundation for Year ${year}!`
      ];

      setAiSuggestions(suggestions);

      const nextYearSkills = SKILL_MAPS[branch][year + 1] || [];
      setRoadmap([
        { month: "Month 1", title: `Master ${branch} Year ${year} Core`, items: missing.slice(0, 2) },
        { month: "Month 2", title: "Build Real Projects", items: ["GitHub portfolio", "Industry project", "Open source contribution"] },
        { month: "Month 3", title: year < 4 ? `Preview Year ${year + 1}` : "Job Prep", items: year < 4 ? nextYearSkills.slice(0, 2) : ["Resume polish", "Mock interviews", "DSA practice"] }
      ]);

      setMatchedSkills(matched);
      setMissingSkills(missing);
      setAtsScoreValue(skillsCoverage);
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#0A0A0A', color: 'white', minHeight: '100vh', position: 'relative' }}>
      <AntigravityCanvas />
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#1e1e1e', padding: '30px', borderRadius: '15px', position: 'relative', zIndex: 10 }}>
        <h2>Skill Analyzer</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input
            placeholder="Enter skills (e.g., C, Python)"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            style={{ padding: '12px', background: '#2d2d2d', border: '1px solid #444', color: 'white', borderRadius: '8px' }}
          />

          <div style={{ display: 'flex', gap: '20px' }}>
            <select 
                value={branch} 
                onChange={(e) => setBranch(e.target.value)}
                style={{ flex: 1, padding: '10px', background: '#2d2d2d', color: 'white' }}
            >
              {Object.keys(SKILL_MAPS).map(b => <option key={b} value={b}>{b}</option>)}
            </select>

            <select 
                value={year} 
                onChange={(e) => setYear(Number(e.target.value))}
                style={{ flex: 1, padding: '10px', background: '#2d2d2d', color: 'white' }}
            >
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
            </select>
          </div>

          <button 
            onClick={analyzeResume}
            style={{ padding: '15px', background: '#f39c12', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {loading ? "Analyzing..." : "🚀 Analyze My Profile"}
          </button>
        </div>

        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '30px' }}>
            {scores.map((s, i) => (
              <div key={i} style={{ background: '#2d2d2d', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <h1 style={{ color: '#f39c12', margin: 0 }}>{s.value}%</h1>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#aaa' }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: '#2d2d2d', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #2ecc71' }}>
              <h4>✅ Matched (Year {year})</h4>
              <p>{matchedSkills.length > 0 ? matchedSkills.join(", ") : "---"}</p>
            </div>

            <div style={{ background: '#2d2d2d', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #e74c3c' }}>
              <h4>⚠️ Required Skills (Year {year})</h4>
              <p>{missingSkills.length > 0 ? missingSkills.join(", ") : "---"}</p>
            </div>
          </div>

          <div style={{ background: '#2d2d2d', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
            <h3 style={{ color: '#f39c12', marginTop: 0 }}>🤖 AI Career Coach Suggestions</h3>
            {aiSuggestions.map((s, i) => (
              <div key={i} style={{ background: '#1a1a1a', padding: '12px', borderRadius: '8px', marginBottom: '10px', fontSize: '14px' }}>
                {s}
              </div>
            ))}
          </div>

          <div style={{ background: '#2d2d2d', padding: '20px', borderRadius: '10px' }}>
            <h3 style={{ color: '#f39c12', marginTop: 0 }}>🗺️ 3-Month Roadmap</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              {roadmap.map((r, i) => (
                <div key={i} style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px' }}>
                  <div style={{ color: '#f39c12', fontWeight: 'bold', marginBottom: '8px' }}>{r.month}</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>{r.title}</div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#aaa' }}>
                    {r.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;