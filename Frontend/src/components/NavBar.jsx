import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NavBar = () => {
  const { token, logout } = useContext(AuthContext);

  return (
    <nav className="w-full bg-white/80 backdrop-blur sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo → Redirect to Home */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold group-hover:bg-sky-700 transition-all duration-300">
            HM
          </div>
          <div className="font-semibold text-sky-800 group-hover:text-sky-600 transition-all duration-300">
            HealthMate
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/dashboard" className="text-slate-700 hover:text-sky-600">Dashboard</Link>
          <Link to="/timeline" className="text-slate-700 hover:text-sky-600">Timeline</Link>
          <Link to="/upload" className="text-slate-700 hover:text-sky-600">Upload</Link>
          <Link to="/chat" className="text-slate-700 hover:text-sky-600">AI Chat</Link>
          
          {token ? (
            <button
              onClick={logout}
              className="ml-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Link
            to="/auth"
            className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
          >
            Menu
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
