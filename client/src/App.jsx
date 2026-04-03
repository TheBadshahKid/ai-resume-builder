import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import ResumeBuilder from './components/builder/ResumeBuilder';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ResumeProvider } from './context/ResumeContext';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">Create Your Winning Resume with AI</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">Use our advanced AI engine to craft, format, and optimize your resume for applicant tracking systems.</p>
      <Link to="/builder" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition transform hover:scale-105 shadow-lg">Build Resume Now</Link>
    </div>
  );
}

function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 flex justify-between items-center p-4 px-8">
      <Link to="/" className="font-bold text-2xl text-blue-600 flex items-center gap-2">
        <span>📄</span> ResumeAI
      </Link>
      <div className="space-x-4">
        {isAuthenticated ? (
          <>
            <Link to="/builder" className="text-gray-600 hover:text-black font-medium mr-4">Dashboard</Link>
            <button onClick={handleLogout} className="bg-red-50 text-red-600 px-5 py-2 rounded-full font-medium hover:bg-red-100 transition">Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-black font-medium mr-4">Log in</Link>
            <Link to="/signup" className="bg-black text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition shadow-md">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen font-sans">
      <Navigation />
      <main className="h-[calc(100vh-73px)]">
        <Routes>
          <Route path="/" element={<div className="container mx-auto"><Home /></div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/builder" element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          } />
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
