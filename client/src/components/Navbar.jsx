import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.id || decoded._id,
          username: decoded.username,
          email: decoded.email,
        });
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  // 👤 Toggle Profile Drawer
  const handleProfileClick = () => {
    setShowProfile((prev) => !prev);
  };

  // 🚪 Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowProfile(false);
    window.location.href = "/"; // redirect to home
  };

  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-white shadow-md relative">
      <Link to="/" className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-[#B9FF66]">AI Doc Analyzer</h1>
      </Link>

      <div className="flex gap-6 items-center">
        <a href="/" className="text-gray-700 hover:text-[#B9FF66] transition">
          Home
        </a>
        <a href="#features" className="text-gray-700 hover:text-[#B9FF66] transition">
          Features
        </a>
        <a href="/dashboard" className="text-gray-700 hover:text-[#B9FF66] transition">
          Upload
        </a>

        {user ? (
          <>
            <div className="flex items-center gap-2">
              <div
                onClick={handleProfileClick}
                className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition"
              >
                {user.username?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* 🧾 Animated Profile Drawer */}
            <AnimatePresence>
              {showProfile && (
                <>
                  <motion.div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowProfile(false)}
                  />
                  <motion.div
                    className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 z-50 flex flex-col"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 80, damping: 18 }}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">Profile</h3>
                      <button
                        onClick={() => setShowProfile(false)}
                        className="text-gray-500 hover:text-red-500 text-xl"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>

                      <h4 className="text-xl font-semibold text-gray-800">
                        {user.username || "N/A"}
                      </h4>
                      <p className="text-gray-600">{user.email}</p>

                      <div className="mt-6 w-full border-t pt-4 text-sm text-gray-600">
                        <p>
                          <strong>User ID:</strong> {user.id || "N/A"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="mt-auto bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
                    >
                      Logout
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        ) : (
          <a href="/auth">
            <Button className="bg-[#B9FF66] text-black hover:bg-[#B9FF20] px-4 py-2 rounded-xl hover:scale-105 transition">
              Get Started
            </Button>
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
