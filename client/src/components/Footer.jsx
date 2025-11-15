// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto py-6 bg-white shadow-inner rounded-t-2xl text-center">
      <p className="text-gray-600 text-sm">
        © {new Date().getFullYear()} <span className="font-semibold text-green-600">HealthMate</span> — Designed by{" "}
        <span className="font-semibold text-[#B9FF66]">Ahsan 💚</span>
      </p>
    </footer>
  );
};

export default Footer;
