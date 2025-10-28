import React from "react";

const Footer = () => {
  return (
    <footer className="text-center py-6 bg-gray-50 border-t">
      <p className="text-gray-600">
        © {new Date().getFullYear()} <span className="text-[#B9FF66] font-semibold">AI Doc Analyzer</span>. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;