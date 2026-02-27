import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AntigravityCanvas from '../components/AntigravityCanvas';
import resourcesData from '../data/resources.json';

const ResourcesEngine = () => {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const branches = ['CSE', 'IT', 'AIDS', 'AIML', 'MECH', 'CIVIL', 'ECE', 'EEE'];

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setSelectedYear(null);
    setSelectedSection(null);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setSelectedSection(null);
  };

  const handleSectionSelect = (section) => {
    setSelectedSection(section);
  };

  const getSubjects = () => {
    if (!selectedBranch || !selectedYear || !selectedSection) return null;
    return resourcesData.branches[selectedBranch]?.years[selectedYear]?.sections?.[selectedSection]?.subjects || {};
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
            <button onClick={() => navigate('/scheduler')} className="hover:text-brand-orange transition-colors">Study Scheduler</button>
            <button onClick={() => navigate('/resume')} className="hover:text-brand-orange transition-colors">AI Resume</button>
            <button className="text-white border-b-2 border-brand-orange pb-1">Resources Engine</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
        <header className="mb-12">
          <h2 className="text-5xl font-extrabold text-white tracking-tight mb-4">Resources <span className="text-brand-orange">Engine</span></h2>
          <p className="text-gray-400 text-lg max-w-2xl">Structured access to your academic materials. Move your cursor to see the gravity effect.</p>
        </header>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold">1</span>
            <h3 className="text-xl font-bold text-white">Select Branch</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {branches.map(branch => (
              <button
                key={branch}
                onClick={() => handleBranchSelect(branch)}
                className={`p-4 rounded-xl border transition-all text-center group ${
                  selectedBranch === branch
                    ? 'border-brand-orange bg-brand-orange/10 ring-1 ring-brand-orange'
                    : 'border-[#2d3139] bg-[#1a1d23]/40 hover:border-brand-orange hover:bg-brand-orange/10'
                }`}
              >
                <span className="block font-bold text-white group-hover:scale-110 transition-transform">{branch}</span>
              </button>
            ))}
          </div>
        </section>

        {selectedBranch && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold">2</span>
              <h3 className="text-xl font-bold text-white">Select Year</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['1', '2', '3', '4'].map(year => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className={`py-5 px-6 rounded-2xl border transition-all text-left group ${
                    selectedYear === year
                      ? 'border-brand-orange bg-brand-orange/10 ring-1 ring-brand-orange'
                      : 'border-[#2d3139] bg-[#1a1d23]/40 hover:border-brand-orange'
                  }`}
                >
                  <h4 className="font-bold text-white group-hover:text-brand-orange">{year === '1' ? '1st' : year === '2' ? '2nd' : year === '3' ? '3rd' : '4th'} Year</h4>
                  <p className="text-xs text-gray-500">{year === '1' ? 'Foundation' : year === '2' ? 'Core Engineering' : year === '3' ? 'Specialization' : 'Advanced Electives'}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {selectedBranch && selectedYear && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold">3</span>
              <h3 className="text-xl font-bold text-white">Select Section</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {['A', 'B', 'C', 'D'].map(section => (
                <button
                  key={section}
                  onClick={() => handleSectionSelect(section)}
                  className={`py-5 px-6 rounded-2xl border transition-all text-center group ${
                    selectedSection === section
                      ? 'border-brand-orange bg-brand-orange/10 ring-1 ring-brand-orange'
                      : 'border-[#2d3139] bg-[#1a1d23]/40 hover:border-brand-orange'
                  }`}
                >
                  <h4 className="font-bold text-white text-2xl group-hover:text-brand-orange">Section {section}</h4>
                </button>
              ))}
            </div>
          </section>
        )}

        {selectedBranch && selectedYear && selectedSection && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold">4</span>
              <h3 className="text-xl font-bold text-white">{selectedBranch} - {selectedYear === '1' ? '1st' : selectedYear === '2' ? '2nd' : selectedYear === '3' ? '3rd' : '4th'} Year - Section {selectedSection} Materials</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(getSubjects()).map(([subject, data]) => (
                <div key={subject} className="glass-panel p-6 rounded-3xl group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-brand-orange/20 p-3 rounded-xl border border-brand-orange/30 text-brand-orange group-hover:scale-110 transition-transform">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth="2"></path>
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-6">{subject}</h4>
                  <div className="space-y-3">
                    {data.units.filter(unit => !(subject.includes('Mathematics') && unit.name.includes('Important Questions'))).map((unit, idx) => (
                      <a
                        key={idx}
                        href={
                          subject === 'C Language' && selectedSection === 'A' && unit.name.includes('Unit 1') 
                            ? 'https://drive.google.com/file/d/1VVuh0pPNP7fIH3JOz4MtBm6DlvwywF_4/view'
                            : subject === 'C Language' && selectedSection === 'A' && unit.name.includes('Unit 2')
                            ? 'https://acrobat.adobe.com/id/urn:aaid:sc:AP:a121ac7e-1706-4fb5-ad1a-ab495ea69a8a'
                            : subject === 'C Language' && selectedSection === 'A' && unit.name.includes('Unit 3')
                            ? 'https://acrobat.adobe.com/id/urn:aaid:sc:AP:ce7ffb4a-95d5-459d-b312-aa49720e6ec1'
                            : unit.link
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-[#0f1115]/80 hover:bg-brand-orange hover:text-white transition-all text-sm text-gray-400"
                      >
                        <span>{unit.name}</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="2"></path>
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ResourcesEngine;
