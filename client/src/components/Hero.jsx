import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Hero = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleClick = () => {
    navigate(user ? "/dashboard" : "/auth");
  };

  return (
    <section className="flex flex-col lg:flex-row items-center justify-between px-8 lg:px-20 py-20 bg-gradient-to-br from-green-50 via-white to-[#e8ffe6]">
      <motion.div
        initial={{ opacity: 0, y: 70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl"
      >
        <h1 className="text-5xl font-bold leading-tight text-gray-900">
          Your Personal <span className="text-[#4ade80]">AI Health Companion</span>
        </h1>
        <p className="text-gray-600 mt-5 text-lg">
          Upload your <strong>medical reports</strong>, and let HealthMate’s AI
          analyze them — giving you a quick summary, insights, and
          recommendations in <strong>plain, simple language</strong>.
        </p>

        <button
          onClick={handleClick}
          className="mt-8 bg-[#B9FF66] text-black px-8 py-3 rounded-xl font-semibold hover:bg-[#A4FF44] hover:scale-105 transition"
        >
          Get Your Health Insights
        </button>
      </motion.div>

      <motion.img
        src="https://delivix.digital/wp-content/uploads/2024/12/455_the_role_of_AI_in_healthcare.webp"
        alt="AI Health Analysis"
        className="w-80 mt-12 lg:mt-0 drop-shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      />
    </section>
  );
};

export default Hero;
