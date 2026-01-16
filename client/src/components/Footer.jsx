// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- Top Section: Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                🩺 Health<span className="text-green-600">Mate</span>
              </h2>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Empowering you to understand your health data with the power of AI. Secure, fast, and easy to use.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Github size={20} />} href="https://github.com/muhammadahsankhn" />
              <SocialIcon icon={<Linkedin size={20} />} href="https://linkedin.com/in/ahsan-khan-a284132a0/" />
              <SocialIcon icon={<Twitter size={20} />} href="#" />
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/dashboard" className="hover:text-green-600 transition">Dashboard</Link></li>
              <li><Link to="/upload-report" className="hover:text-green-600 transition">Upload Report</Link></li>
              <li><Link to="/upload-vitals" className="hover:text-green-600 transition">Track Vitals</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="/features" className="hover:text-green-600 transition">Features</a></li>
              <li><Link to="/about" className="hover:text-green-600 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-green-600 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-green-600 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-green-600 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-green-600 transition">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* --- Bottom Section: Credits --- */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} HealthMate. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <span>Designed & Built by</span>
            <span className="font-bold text-gray-900 flex items-center gap-1">
              Ahsan <Heart size={14} className="text-red-500 fill-current" />
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

// Helper Component for Social Icons
const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-green-600 hover:text-white transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;