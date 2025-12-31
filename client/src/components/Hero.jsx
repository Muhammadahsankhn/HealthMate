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

  const handleGetStarted = () => {
    // Logic update: Go to Dashboard if logged in, otherwise Auth
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-100 px-6 lg:px-20 py-20">
      
      {/* Background Decor (Optional Blob) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12 z-10">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:w-1/2 text-center lg:text-left space-y-6"
        >
          <div className="inline-block px-4 py-1.5 bg-green-100 text-green-700 font-semibold rounded-full text-sm mb-2 shadow-sm">
            AI-Powered Healthcare
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight text-gray-900">
            Your Personal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
              AI Health Companion
            </span>
          </h1>
          
          <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
            Upload your medical reports and track your vitals. Let <strong>HealthMate’s AI</strong> analyze them to give you simple summaries, insights, and actionable health recommendations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="px-8 py-4 bg-green-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-green-700 hover:shadow-green-500/30 transition-all"
            >
              {user ? "Go to Dashboard" : "Get Health Insights"}
            </motion.button>
            
            <button className="px-8 py-4 bg-white text-gray-700 text-lg font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Right Image / Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-1/2 relative flex justify-center"
        >
          {/* Main Image with floating animation */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <img
              src="https://delivix.digital/wp-content/uploads/2024/12/455_the_role_of_AI_in_healthcare.webp"
              alt="AI Health Analysis"
              className="w-full max-w-md rounded-3xl shadow-2xl border-4 border-white"
            />

            {/* Floating Badge 1 (Glassmorphism) */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3"
            >
              <div>
                <p className="text-xs text-gray-500 font-semibold">Report Status</p>
                <p className="text-sm font-bold text-green-700">Analysis Complete</p>
              </div>
            </motion.div>

            {/* Floating Badge 2 */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute top-10 -right-6 bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2"
            >
              <div>
                 <p className="text-xs text-gray-500">Heart Rate</p>
                 <p className="text-sm font-bold text-gray-800">Normal</p>
              </div>
            </motion.div>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;