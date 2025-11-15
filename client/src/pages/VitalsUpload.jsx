import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HeartPulse, Activity, Weight, Droplets } from "lucide-react";

const VitalsUpload = () => {
  const navigate = useNavigate();
  const [vitals, setVitals] = useState({
    bloodPressure: "",
    bloodSugar: "",
    weight: "",
    heartRate: "",
  });
  const [loading, setLoading] = useState(false);

  const fieldIcons = {
    bloodPressure: <Activity size={20} />,
    bloodSugar: <Droplets size={20} />,
    weight: <Weight size={20} />,
    heartRate: <HeartPulse size={20} />,
  };

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
      navigate(`/c/${id}`, {
        state: {
          file: {
            ...res.data.data,
            type: "vitals",
            aiSummary: res.data.aiSummary,
          },
        },
      });

      setVitals({ bloodPressure: "", bloodSugar: "", weight: "", heartRate: "" });
    } catch (err) {
      console.error("Error uploading vitals:", err);
      alert("Failed to upload vitals!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D4F7DC] via-white to-[#E9FFE3] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl shadow-2xl border border-white/30 rounded-3xl p-10"
      >
        <motion.h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          💉 Add Your Vitals
        </motion.h2>

        <motion.form
          onSubmit={handleVitalsUpload}
          className="flex flex-col gap-5"
          whileHover={{ scale: 1.01 }}
        >
          {Object.keys(vitals).map((field) => (
            <div
              key={field}
              className="flex items-center gap-3 bg-white/60 backdrop-blur-xl px-4 py-3 rounded-xl border border-gray-200 shadow-sm"
            >
              <span className="text-green-600">{fieldIcons[field]}</span>

              <input
                type="text"
                placeholder={field.replace(/([A-Z])/g, " $1")}
                value={vitals[field]}
                onChange={(e) => setVitals({ ...vitals, [field]: e.target.value })}
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 bg-green-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-green-700 transition-all"
          >
            {loading ? "Saving..." : "Save & Analyze Vitals"}
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default VitalsUpload;
