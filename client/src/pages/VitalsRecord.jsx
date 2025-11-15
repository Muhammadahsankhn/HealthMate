import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  HeartPulse,
  Weight,
  Activity,
  Droplets,
  Calendar,
} from "lucide-react";

const VitalsRecord = () => {
  const [vitals, setVitals] = useState([]);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${API_URL}/vitals/allVitals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVitals(res.data.data || []);
        
      } catch (err) {
        console.error("Failed to fetch vitals:", err);
      }
    };
    fetchVitals();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D4F7DC] via-white to-[#E9FFE3] p-10">
      <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">
        💊 Your Vitals History
      </h2>

      <div className="grid gap-8 md:grid-cols-3 sm:grid-cols-2">
        {vitals.length > 0 ? (
          vitals.map((v) => (
            <motion.div
              key={v._id}
              className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-lg rounded-3xl p-6 hover:shadow-2xl transition-all"
              whileHover={{ scale: 1.03 }}
            >
              {/* BP */}
              <div className="flex items-center gap-3 mb-2">
                <Activity className="text-green-700" />
                <p className="font-semibold text-gray-700">
                  Blood Pressure:{" "}
                  <span className="text-gray-900">{v.bloodPressure}</span>
                </p>
              </div>

              {/* Sugar */}
              <div className="flex items-center gap-3 mb-2">
                <Droplets className="text-blue-600" />
                <p className="font-semibold text-gray-700">
                  Blood Sugar:{" "}
                  <span className="text-gray-900">{v.bloodSugar}</span>
                </p>
              </div>

              {/* Weight */}
              <div className="flex items-center gap-3 mb-2">
                <Weight className="text-yellow-600" />
                <p className="font-semibold text-gray-700">
                  Weight:{" "}
                  <span className="text-gray-900">{v.weight} kg</span>
                </p>
              </div>

              {/* Heart Rate */}
              <div className="flex items-center gap-3 mb-2">
                <HeartPulse className="text-red-600" />
                <p className="font-semibold text-gray-700">
                  Heart Rate:{" "}
                  <span className="text-gray-900">{v.heartRate} bpm</span>
                </p>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3 mt-3 text-gray-600 text-sm">
                <Calendar size={18} />
                <span>
                  Added on{" "}
                  {new Date(v.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No vitals uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default VitalsRecord;
