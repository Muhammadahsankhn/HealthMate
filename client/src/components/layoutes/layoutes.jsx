// src/layouts/Layout.jsx
import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-green-100">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
