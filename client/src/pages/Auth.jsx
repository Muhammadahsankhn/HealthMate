import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 relative overflow-hidden text-white">
      {/* Animated glowing blobs */}
      <div className="absolute w-72 h-72 bg-[#B9FF66]/20 rounded-full blur-3xl top-0 left-0 animate-pulse" />
      <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-[90%] max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
      >
        <h2 className="text-center text-4xl font-extrabold bg-gradient-to-r text-[#B9FF66] mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {!isLogin && (
              <div>
                <label className="text-gray-300 text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full mt-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B9FF66]/60 transition"
                />
              </div>
            )}

            <div>
              <label className="text-gray-300 text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full mt-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B9FF66]/60 transition"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B9FF66]/60 transition"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-3 bg-[#B9FF66] text-black font-semibold rounded-xl shadow-lg shadow-[#B9FF66]/30 transition"
            >
              {isLogin ? "Login" : "Register"}
            </motion.button>
          </motion.form>
        </AnimatePresence>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 my-6">
          <div className="h-[1px] w-20 bg-gray-600" />
          <span className="text-gray-400 text-sm">or continue with</span>
          <div className="h-[1px] w-20 bg-gray-600" />
        </div>

        {/* Social Login Buttons */}
        <div className="flex justify-center gap-4">
          <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition border border-white/10">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition border border-white/10">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" className="w-6 h-6 invert" />
          </button>
        </div>

        {/* Toggle */}
        <p className="text-center text-gray-400 mt-6">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#B9FF66] font-medium hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
