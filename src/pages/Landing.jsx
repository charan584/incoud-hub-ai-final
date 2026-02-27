import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AntigravityCanvas from '../components/AntigravityCanvas';

const Landing = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // GSAP Hero Animation
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle && window.gsap) {
      const text = heroTitle.innerText;
      heroTitle.innerText = '';

      text.split(' ').forEach(word => {
        const span = document.createElement('span');
        span.classList.add('reveal-word');
        span.innerText = word + ' ';
        heroTitle.appendChild(span);
      });

      window.gsap.registerPlugin(window.ScrollTrigger);
      const words = document.querySelectorAll('.reveal-word');

      window.gsap.to(words, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        rotation: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top center+=200',
          toggleActions: 'play none none none'
        }
      });
    }

    // Float text animation
    const floatText = document.getElementById('float-text');
    if (floatText && window.gsap) {
      const text = floatText.innerText;
      floatText.innerHTML = '';

      text.split('').forEach(char => {
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        span.innerText = char === ' ' ? '\u00A0' : char;
        floatText.appendChild(span);
      });

      const chars = floatText.querySelectorAll('span');

      window.gsap.fromTo(chars,
        { opacity: 0, yPercent: 120, scaleY: 2.3, scaleX: 0.7 },
        {
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: '#scroll-float-section',
            start: 'center bottom+=50%',
            end: 'bottom bottom-=40%',
            scrub: true
          }
        }
      );
    }

    // Reveal on scroll
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const targets = document.querySelectorAll('.reveal-on-scroll');
    targets.forEach(target => observer.observe(target));

    return () => {
      targets.forEach(target => observer.unobserve(target));
    };
  }, []);

  return (
    <div className="scroll-smooth">
      <AntigravityCanvas />
      
      <style>{`
        body {
          background-color: #0A0A0A;
          color: #FFFFFF;
          overflow-x: hidden;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.4s ease;
        }
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(247, 140, 37, 0.5);
          transform: translateY(-4px);
          box-shadow: 0 0 25px rgba(247, 140, 37, 0.3);
        }
        .reveal-word {
          display: inline-block;
          opacity: 0;
          filter: blur(10px);
          transform: translateY(20px) rotate(5deg);
        }
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .reveal-on-scroll.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-orange/5 blur-[120px] rounded-full"></div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-brand-dark/80 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
              <i className="w-5 h-5 text-black fill-current" data-lucide="zap"></i>
            </div>
            <span className="text-xl font-bold tracking-tight">Incloudhub <span className="text-brand-orange">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <button onClick={() => navigate('/resources')} className="hover:text-brand-orange transition-colors">Resources Engine</button>
            <button onClick={() => navigate('/scheduler')} className="hover:text-brand-orange transition-colors">Study Scheduler</button>
            <button onClick={() => navigate('/resume')} className="hover:text-brand-orange transition-colors">AI Resume Suggester</button>
          </div>
          <button onClick={handleLogout} className="px-6 py-2 bg-white/10 hover:bg-brand-orange hover:text-black text-sm font-bold rounded-xl transition-all">
            Logout
          </button>
        </nav>
      </header>

      <main className="relative pt-20">
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto py-20" id="hero">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-semibold mb-8 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></span>
            Ecosystem 2.0 is now live
          </div>
          <h1 className="font-bold leading-[1.1] mb-8 tracking-tighter" id="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
            Welcome back, Explorer.<br />Elevate your future with our AI ecosystem.
          </h1>
          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            The most powerful suite of AI tools designed for students and professionals. Streamline your workflow, ace your interviews, and build your career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button onClick={() => navigate('/resources')} className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-brand-orange hover:text-black transition-all duration-300">
              Launch Dashboard
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all">
              View Documentation
            </button>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-8 rounded-[2rem] flex flex-col group reveal-on-scroll">
              <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className="w-7 h-7 text-brand-orange" data-lucide="search"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Resources Engine</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-8 flex-grow">
                Intelligent search and curation of top-tier learning materials tailored to your specific goals.
              </p>
              <button onClick={() => navigate('/resources')} className="w-full py-3 px-4 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Open Engine
              </button>
            </div>

            <div className="glass-card p-8 rounded-[2rem] flex flex-col group reveal-on-scroll">
              <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className="w-7 h-7 text-brand-orange" data-lucide="calendar"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Study Scheduler</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-8 flex-grow">
                Dynamic AI-driven planning that adjusts to your pace and identifies optimal learning windows.
              </p>
              <button onClick={() => navigate('/scheduler')} className="w-full py-3 px-4 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Plan Session
              </button>
            </div>

            <div className="glass-card p-8 rounded-[2rem] flex flex-col group reveal-on-scroll">
              <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className="w-7 h-7 text-brand-orange" data-lucide="mic"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Mock Interviewer</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-8 flex-grow">
                Real-time vocal feedback and behavioral analysis to perfect your performance for top firms.
              </p>
              <button onClick={() => navigate('/mock-interview')} className="w-full py-3 px-4 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Start Practice
              </button>
            </div>

            <div className="glass-card p-8 rounded-[2rem] flex flex-col group reveal-on-scroll">
              <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className="w-7 h-7 text-brand-orange" data-lucide="file-text"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Resume Suggester</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-8 flex-grow">
                Precision scanning and keyword optimization to bypass ATS filters and catch recruiter attention.
              </p>
              <button onClick={() => navigate('/resume')} className="w-full py-3 px-4 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Analyze Resume
              </button>
            </div>
          </div>
        </section>

        <section className="py-32 flex items-center justify-center overflow-hidden" id="scroll-float-section">
          <h2 className="text-[12vw] font-bold uppercase tracking-tight leading-none text-white whitespace-nowrap opacity-100" id="float-text">
            Incloudhub AI
          </h2>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-orange/20 rounded flex items-center justify-center">
              <i className="w-3.5 h-3.5 text-brand-orange" data-lucide="zap"></i>
            </div>
            <span className="text-sm font-semibold tracking-tight">Incloudhub AI © 2024</span>
          </div>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-white/40">
            <a className="hover:text-brand-orange transition-colors" href="#">Twitter</a>
            <a className="hover:text-brand-orange transition-colors" href="#">LinkedIn</a>
            <a className="hover:text-brand-orange transition-colors" href="#">GitHub</a>
            <a className="hover:text-brand-orange transition-colors" href="#">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
