import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between px-8 lg:px-16 py-16 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl"
      >
        <h1 className="text-5xl font-bold leading-tight text-gray-900">
          Analyze Your Documents with <span className="text-[#B9FF66]">AI</span>
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Upload PDFs, Reports, or Research Papers — get instant insights, summaries, and smart analysis powered by AI.
        </p>
        <button className="mt-6 bg-[#B9FF66] text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition">
          Upload Document
        </button>
      </motion.div>

      <motion.img
        src="https://cdn-icons-png.flaticon.com/512/4727/4727260.png"
        alt="AI Analysis"
        className="w-80 mt-10 lg:mt-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      />
    </section>
  );
};

export default Hero;