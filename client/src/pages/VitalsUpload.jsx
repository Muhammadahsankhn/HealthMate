import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  HeartPulse, 
  Activity, 
  Weight, 
  Droplets, 
  ArrowRight, 
  Sparkles 
} from "lucide-react";

const VitalsUpload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vitals, setVitals] = useState({
    bloodPressure: "",
    bloodSugar: "",
    weight: "",
    heartRate: "",
  });

  // Configuration for fields to make rendering cleaner and more customizable
  const fields = [
    { 
      key: "bloodPressure", 
      label: "Blood Pressure", 
      icon: Activity, 
      unit: "mmHg", 
      placeholder: "120/80", 
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    { 
      key: "heartRate", 
      label: "Heart Rate", 
      icon: HeartPulse, 
      unit: "bpm", 
      placeholder: "72", 
      color: "text-red-500",
      bg: "bg-red-50"
    },
    { 
      key: "bloodSugar", 
      label: "Blood Sugar", 
      icon: Droplets, 
      unit: "mg/dL", 
      placeholder: "100", 
      color: "text-pink-500",
      bg: "bg-pink-50"
    },
    { 
      key: "weight", 
      label: "Weight", 
      icon: Weight, 
      unit: "kg", 
      placeholder: "70", 
      color: "text-orange-500",
      bg: "bg-orange-50"
    },
  ];

  const handleVitalsUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await axios.post(`${API_URL}/vitals/addVitals`, vitals, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const id = res.data.data._id;
      
      // Small delay to show the success animation state if you wanted one
      setTimeout(() => {
          navigate(`/c/${id}`, {
            state: {
              file: {
                ...res.data.data,
                type: "vitals",
                aiSummary: res.data.aiSummary,
              },
            },
          });
      }, 500);

    } catch (err) {
      console.error("Error uploading vitals:", err);
      // In a real app, use a Toast notification here instead of alert
      alert("Failed to upload vitals. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans relative overflow-hidden">
      
      {/* Background Decor (Subtle Blobs) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white shadow-xl rounded-3xl p-8 md:p-10 relative z-10 border border-gray-100"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-green-100"
          >
            <Sparkles size={16} />
            <span>AI-Powered Health Check</span>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Log Your Vitals
          </h2>
          <p className="text-gray-500 mt-2">
            Enter your metrics below to get an instant AI health analysis.
          </p>
        </div>

        <form onSubmit={handleVitalsUpload}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field, index) => (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                  {field.label}
                </label>
                
                <div className="relative group">
                  {/* Icon Container */}
                  <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${field.bg} ${field.color}`}>
                    <field.icon size={20} />
                  </div>

                  {/* Input */}
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={vitals[field.key]}
                    onChange={(e) => setVitals({ ...vitals, [field.key]: e.target.value })}
                    className="w-full pl-16 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium text-gray-800 placeholder-gray-400"
                  />

                  {/* Unit Label */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400 pointer-events-none">
                    {field.unit}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className={`
              w-full mt-10 py-4 rounded-2xl font-bold text-lg text-white shadow-lg shadow-green-500/20 flex items-center justify-center gap-3 transition-all
              ${loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              }
            `}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Analyzing Data...</span>
              </>
            ) : (
              <>
                <span>Generate Analysis</span>
                <ArrowRight size={20} />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default VitalsUpload;