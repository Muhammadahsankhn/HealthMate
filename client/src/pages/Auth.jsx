import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const Auth = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await axios.post(`${API_URL}/users/${isLogin ? "login" : "register"}`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });


      // // ✅ Backend now returns { success, message, token, user }
      // if (res.data?.success) {
      //   // ✅ Show success toast
      //   toast.success(res.data.message || (isLogin ? "Login successful 🎉" : "Registered successfully 🎉"));

      //   // ✅ Save token only
      //   localStorage.setItem("token", res.data.token);

      //   // ✅ Optional callback
      //   if (onSuccess) onSuccess(res.data.user);

      //   // ✅ Reset fields
      //   setFormData({ username: "", email: "", password: "" });

      //   // ✅ Redirect after short delay (so toast is visible)
      //   setTimeout(() => {
      //     window.location.href = "/dashboard";
      //   }, 2000);
      // } else {
      //   toast.error(res.data?.message || "Something went wrong!");
      // }
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data.message || (isLogin ? "Login successful 🎉" : "Registered successfully 🎉"));
        localStorage.setItem("token", res.data.token);
        if (onSuccess) onSuccess(res.data.user);
        setFormData({ username: "", email: "", password: "" });

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        toast.error(res.data?.message || "Something went wrong!");
      }

    } catch (error) {
      console.error("❌ Error during authentication:", error);
      toast.error(error.response?.data?.message || "Server error, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 relative overflow-hidden text-white">
      {/* Background glow */}
      <div className="absolute w-72 h-72 bg-[#B9FF66]/20 rounded-full blur-3xl top-0 left-0 animate-pulse" />
      <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-[90%] max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
      >
        <h2 className="text-center text-4xl font-extrabold text-[#B9FF66] mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? "login" : "register"}
            onSubmit={handleSubmit}
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
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full mt-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B9FF66]/60 transition"
                />
              </div>
            )}

            <div>
              <label className="text-gray-300 text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full mt-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B9FF66]/60 transition"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B9FF66]/60 transition"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-3 bg-[#B9FF66] text-black font-semibold rounded-xl shadow-lg shadow-[#B9FF66]/30 transition hover:bg-[#a8ff33]"
            >
              {isLogin ? "Login" : "Register"}
            </motion.button>
          </motion.form>
        </AnimatePresence>

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
