import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Menu, X, ChevronDown, User, LogOut, FileText, Pill, LayoutDashboard, HeartPulse } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
    setShowProfile(false);
    setActiveDropdown(null);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <nav className="flex justify-between items-center py-4 px-6 md:px-10 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        
        {/* --- Logo --- */}
        <Link to="/" className="flex items-center gap-2 group z-50">
          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center font-bold text-xl group-hover:bg-green-600 group-hover:text-white transition">H</div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Health<span className="text-green-600">Mate</span>
          </h1>
        </Link>

        {/* --- Desktop Menu --- */}
        <div className="hidden md:flex gap-8 items-center font-medium text-sm text-gray-600">
          <Link to="/" className="hover:text-green-600 transition">Home</Link>
          <Link to="/about" className="hover:text-green-600 transition">About</Link>

          {user && (
            <>
              <Link to="/dashboard" className="hover:text-green-600 transition">Dashboard</Link>
              <Link to="/medications" className="hover:text-green-600 transition">Meds</Link>
              
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown("upload")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 hover:text-green-600 transition py-4">
                  Upload <ChevronDown size={14} />
                </button>
                <AnimatePresence>
                  {activeDropdown === "upload" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 bg-white shadow-xl rounded-xl border border-gray-100 p-2 w-48 overflow-hidden"
                    >
                      <Link to="/upload-report" className="block px-4 py-2 hover:bg-green-50 text-gray-700 rounded-lg">Upload Report</Link>
                      <Link to="/upload-vitals" className="block px-4 py-2 hover:bg-green-50 text-gray-700 rounded-lg">Log Vitals</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* --- Desktop Profile Actions --- */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div onClick={() => setShowProfile(true)} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
              <span className="text-sm font-semibold text-gray-700">{user.username}</span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-green-600 text-white flex items-center justify-center font-bold shadow-lg shadow-green-200">
                {user.username?.charAt(0).toUpperCase()}
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/auth"><button className="px-5 py-2 text-green-600 font-semibold hover:bg-green-50 rounded-full transition">Login</button></Link>
              <Link to="/auth"><button className="px-5 py-2 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition">Get Started</button></Link>
            </div>
          )}
        </div>

        {/* --- Mobile Hamburger Button --- */}
        <button className="md:hidden text-gray-700 z-50" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          {showMobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* --- Desktop Profile Slide-in --- */}
      <AnimatePresence>
        {showProfile && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProfile(false)} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-[70] p-6 flex flex-col border-l border-green-50">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-lg text-gray-800">My Profile</h3>
                <button onClick={() => setShowProfile(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-4xl font-bold mb-4">{user?.username?.charAt(0).toUpperCase()}</div>
                <h4 className="text-xl font-bold text-gray-900">{user?.username}</h4>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <div className="space-y-2">
                <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 text-gray-700 transition"><LayoutDashboard size={18} /> Dashboard</Link>
                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 text-gray-700 transition"><User size={18} /> Account</Link>
              </div>
              <div className="mt-auto pt-6 border-t border-gray-100">
                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition font-semibold"><LogOut size={18} /> Sign Out</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Mobile Navigation Menu (FIXED) --- */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[40] bg-white pt-24 px-6 pb-6 flex flex-col gap-2 md:hidden overflow-y-auto"
          >
            {/* ✅ ADDED: Mobile Profile Header */}
            {user ? (
              <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4 mb-4 border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            ) : null}

            <Link to="/" className="text-lg font-medium p-4 hover:bg-gray-50 rounded-xl">Home</Link>
            <Link to="/about" className="text-lg font-medium p-4 hover:bg-gray-50 rounded-xl">About</Link>
            
            {user && (
              <>
                <div className="h-px bg-gray-100 my-2" />
                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">Features</p>
                <Link to="/dashboard" className="flex items-center gap-3 text-lg font-medium p-4 hover:bg-green-50 text-gray-700 hover:text-green-700 rounded-xl">
                  <LayoutDashboard size={20} /> Dashboard
                </Link>
                <Link to="/medications" className="flex items-center gap-3 text-lg font-medium p-4 hover:bg-green-50 text-gray-700 hover:text-green-700 rounded-xl">
                  <Pill size={20} /> Medications
                </Link>
                <Link to="/upload-report" className="flex items-center gap-3 text-lg font-medium p-4 hover:bg-green-50 text-gray-700 hover:text-green-700 rounded-xl">
                  <FileText size={20} /> Upload Report
                </Link>
                <Link to="/upload-vitals" className="flex items-center gap-3 text-lg font-medium p-4 hover:bg-green-50 text-gray-700 hover:text-green-700 rounded-xl">
                  <HeartPulse size={20} /> Log Vitals
                </Link>
                
                <div className="h-px bg-gray-100 my-4" />
                <button onClick={handleLogout} className="flex items-center gap-3 text-lg font-medium p-4 text-red-500 hover:bg-red-50 rounded-xl w-full text-left">
                  <LogOut size={20} /> Logout
                </button>
              </>
            )}

            {!user && (
              <div className="mt-auto flex flex-col gap-4">
                <Link to="/auth" className="w-full py-4 bg-green-600 text-white text-center rounded-xl font-bold text-lg shadow-lg">
                  Login / Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;