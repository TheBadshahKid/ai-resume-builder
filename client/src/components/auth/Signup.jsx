import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowRight } from 'lucide-react';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(name, email, password);
    navigate('/builder');
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-brand-zinc px-4 py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-rust opacity-20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600 opacity-10 rounded-full blur-[100px]"></div>
      
      <div className="glass max-w-md w-full space-y-8 p-10 rounded-3xl relative z-10 border border-gray-800">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-white bg-opacity-10 rounded-xl flex items-center justify-center mb-4">
            <UserPlus className="text-brand-rust" size={24} />
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Start building your ATS-optimized resume in minutes.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <input
                name="name"
                type="text"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 bg-white bg-opacity-5 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-brand-rust focus:border-transparent sm:text-sm transition-all"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 bg-white bg-opacity-5 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-brand-rust focus:border-transparent sm:text-sm transition-all"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 bg-white bg-opacity-5 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-brand-rust focus:border-transparent sm:text-sm transition-all"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-brand-rust hover:bg-[#8B4534] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-rust focus:ring-offset-gray-900 transition-all shadow-lg shadow-brand-rust/30"
            >
              Sign up
              <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                <ArrowRight className="h-5 w-5 text-orange-200 group-hover:text-white transition-colors" />
              </span>
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-rust hover:text-orange-400 transition">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
