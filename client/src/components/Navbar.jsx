import React from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-[#B9FF66]">AI Doc Analyzer</h1>
      <div className="flex gap-6 items-center">
        <a href="#" className="text-gray-700 hover:text-[#B9FF66] transition">Home</a>
        <a href="#features" className="text-gray-700 hover:text-[#B9FF66] transition">Features</a>
        <a href="#upload" className="text-gray-700 hover:text-[#B9FF66] transition">Upload</a>
        <a href="/auth">
          <Button className="bg-[#B9FF66] text-black hover:bg-[#B9FF20] px-4 py-2 rounded-xl hover:scale-105 transition" >
            Get Started
          </Button>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;