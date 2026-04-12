import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import ResumeBuilder from './components/builder/ResumeBuilder';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ResumeProvider } from './context/ResumeContext';
import {
  Sparkles, Zap, ShieldCheck, FileText, ArrowRight,
  BarChart2, Target, Download, ChevronRight, Star, Users, Award, Moon, Sun
} from 'lucide-react';

// ---------- THEME TOGGLE ----------
function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial state
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    } else {
      setIsDark(false);
      document.documentElement.classList.add('dark'); // Default to dark if nothing
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl text-gray-500 hover:text-gray-900 bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:bg-white/10 transition-colors"
      aria-label="Toggle Theme"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

// ---------- FEATURE CARDS ----------
const features = [
  {
    icon: <Sparkles size={22} />,
    title: 'AI Bullet Generator',
    desc: 'Enter your job title and get 3 powerful, quantifiable bullet points instantly powered by Llama 3.',
    color: 'from-orange-500 to-rose-500',
  },
  {
    icon: <Target size={22} />,
    title: 'ATS Score Checker',
    desc: 'Scan your resume against any job description and get a keyword match score with actionable fixes.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: <Zap size={22} />,
    title: 'Smart Improve',
    desc: 'One-click AI rewrite of any experience bullet to make it punchier, more impactful, and ATS-friendly.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: <BarChart2 size={22} />,
    title: 'Job Match %',
    desc: 'Cosine-similarity analysis compares your resume to any JD and shows exactly what keywords you\'re missing.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'ATS-Friendly Templates',
    desc: 'Choose from recruiter-approved layouts built to pass through applicant tracking systems without issues.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: <Download size={22} />,
    title: 'Live Preview & Export',
    desc: 'See your resume update in real-time as you type. Export a pixel-perfect PDF ready to send.',
    color: 'from-pink-500 to-rose-500',
  },
];

const stats = [
  { value: '98%', label: 'ATS Pass Rate', icon: <ShieldCheck size={18} /> },
  { value: '3x', label: 'More Interviews', icon: <Star size={18} /> },
  { value: '60s', label: 'To Build a Resume', icon: <Zap size={18} /> },
  { value: '10k+', label: 'Resumes Created', icon: <Users size={18} /> },
];

// ---------- HOME PAGE ----------
function Home() {
  return (
    <div className="bg-gray-50 dark:bg-[#0f0f11] text-gray-900 dark:text-white min-h-screen overflow-x-hidden transition-colors duration-300">

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-28 pb-24 overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-rust opacity-[0.05] dark:opacity-[0.12] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600 opacity-[0.05] dark:opacity-[0.10] rounded-full blur-[120px] pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-orange-500 dark:text-orange-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm shadow-sm dark:shadow-none">
          <Sparkles size={12} /> Powered by Llama 3 &amp; Groq — Free AI
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] max-w-4xl mb-6 font-display text-gray-900 dark:text-white">
          Land Your Dream Job
          <br />
          <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600 dark:from-orange-400 dark:via-rose-400 dark:to-pink-500 bg-clip-text text-transparent">
            With an AI Resume
          </span>
        </h1>

        <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Build a perfectly formatted, ATS-optimized resume in under 60 seconds.
          AI writes your bullets, suggests skills, and scores your job match — all for free.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            to="/builder"
            className="group inline-flex items-center gap-2 bg-brand-rust hover:bg-[#8B4534] text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-lg shadow-brand-rust/30 hover:shadow-brand-rust/50 hover:scale-105"
          >
            Build My Resume — It's Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-6 py-4 rounded-2xl font-medium border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 transition-all text-sm bg-white dark:bg-transparent shadow-sm dark:shadow-none"
          >
            Sign In <ChevronRight size={16} />
          </Link>
        </div>

        {/* Trust line */}
        <p className="mt-8 text-xs text-gray-500 dark:text-gray-600 flex items-center gap-2">
          <Award size={13} className="text-amber-500" />
          No credit card · No signup required to try
        </p>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-white/[0.02] py-12 px-4 transition-colors duration-300">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center gap-2 p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-all shadow-sm dark:shadow-none">
              <div className="text-brand-rust">{s.icon}</div>
              <div className="text-3xl font-black text-gray-900 dark:text-white font-display">{s.value}</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4 bg-white dark:bg-[#0f0f11] transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-rust text-sm font-semibold uppercase tracking-widest mb-3">Everything You Need</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white font-display mb-4">
              Your Entire Job Hunt,
              <br />
              <span className="text-gray-400 dark:text-gray-500">Supercharged by AI</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              From writing bullets to scoring your JD match — every feature is designed to get you more callbacks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative rounded-2xl p-6 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.07] hover:border-gray-300 dark:hover:border-white/15 hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-all duration-300 overflow-hidden"
              >
                {/* Icon glow blob */}
                <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${f.color} opacity-5 dark:opacity-10 rounded-full blur-2xl group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity`} />
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} text-white mb-4 shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className="text-gray-900 dark:text-white font-bold text-base mb-2 font-display">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-[#0f0f11] transition-colors duration-300">
        <div className="max-w-3xl mx-auto text-center rounded-3xl border border-orange-100 dark:border-white/10 bg-white dark:bg-gradient-to-br dark:from-brand-rust/10 dark:to-transparent p-14 relative overflow-hidden shadow-sm dark:shadow-none">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-indigo-50/50 dark:from-brand-rust/5 dark:to-indigo-600/5 rounded-3xl" />
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 relative font-display">
            Ready to Beat the Bots?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 relative">Start building your ATS-optimized resume right now — no account needed.</p>
          <Link
            to="/builder"
            className="group inline-flex items-center gap-2 bg-brand-rust hover:bg-[#8B4534] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-brand-rust/30 hover:scale-105 relative"
          >
            Start Building for Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#0f0f11] py-8 px-4 text-center text-gray-500 dark:text-gray-600 text-xs transition-colors duration-300">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-brand-rust rounded-lg flex items-center justify-center">
            <FileText size={13} className="text-white" />
          </div>
          <span className="font-bold text-gray-600 dark:text-gray-400">ResumeAI</span>
        </div>
        Crafted with precision · AI by Groq (Llama 3) · © {new Date().getFullYear()} created by Sachin Kumar
      </footer>
    </div>
  );
}

// ---------- NAVIGATION ----------
function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-10 py-4 border-b border-gray-200 dark:border-white/5 bg-white/90 dark:bg-[#0f0f11]/80 backdrop-blur-xl transition-colors duration-300">
      <Link to="/" className="flex items-center gap-2.5 font-bold text-gray-900 dark:text-white">
        <div className="w-8 h-8 bg-brand-rust rounded-lg flex items-center justify-center shadow-lg shadow-brand-rust/30">
          <FileText size={16} className="text-white" />
        </div>
        <span className="text-lg tracking-tight font-display">Resume<span className="text-brand-rust">AI</span></span>
      </Link>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
        {isAuthenticated ? (
          <>
            {location.pathname !== '/builder' && (
              <Link
                to="/builder"
                className="text-gray-600 dark:text-gray-400 hover:text-brand-rust dark:hover:text-white text-sm font-medium transition-colors px-3 py-1.5"
              >
                Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 px-4 py-2 rounded-xl transition-all"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors px-3 py-1.5"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-sm font-bold text-white bg-brand-rust hover:bg-[#8B4534] px-5 py-2 rounded-xl transition-all shadow-md shadow-brand-rust/30"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

// ---------- APP ----------
function AppContent() {
  return (
    <div className="min-h-screen font-sans bg-gray-50 dark:bg-[#0f0f11] transition-colors duration-300">
      <Navigation />
      <main className="pt-[65px] h-[calc(100vh-65px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/builder"
            element={
              <ProtectedRoute>
                <ResumeBuilder />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ResumeProvider>
        <AppContent />
      </ResumeProvider>
    </AuthProvider>
  );
}

export default App;
