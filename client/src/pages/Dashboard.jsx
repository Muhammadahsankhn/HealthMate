import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Activity,
  FileText,
  Plus,
  UploadCloud,
  Heart,
  Scale,
  Droplets
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);

  // 1. Initial State (Empty placeholders instead of fake numbers)
  const [latestVitals, setLatestVitals] = useState({
    bp: "--/--",
    heartRate: "--",
    weight: "--",
    sugar: "--"
  });

  // ------------------ Auth & Data Loading ------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);

      // 2. Fetch both Reports AND Vitals
      fetchReports(token);
      fetchLatestVitals(token);

    } catch (error) {
      navigate("/auth");
    }
  }, [navigate]);

  const fetchReports = async (token) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await axios.get(`${API_URL}/files/uploaded`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data.files || []);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  // 3. New Function to get Real Vitals
  const fetchLatestVitals = async (token) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      // We reuse the endpoint you used in VitalsRecord
      const res = await axios.get(`${API_URL}/vitals/allVitals`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allVitals = res.data.data;

      // If we have data, take the FIRST one (Latest)
      if (allVitals && allVitals.length > 0) {
        const latest = allVitals[0]; // Assuming backend sorts by new -> old
        setLatestVitals({
          bp: latest.bloodPressure,
          heartRate: latest.heartRate,
          weight: latest.weight,
          sugar: latest.bloodSugar
        });
      }
    } catch (err) {
      console.error("Failed to fetch vitals:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">

      <main className="max-w-6xl mx-auto w-full p-6 space-y-8">

        {/* --- Header Section --- */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end gap-4"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Health Overview</h2>
            <p className="text-gray-500 mt-1">
              Welcome back, <b> {user?.username || "User"}!</b> Here is your latest health update.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <Link to="/upload-report">
              <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm">
                <UploadCloud size={18} />
                <span>Upload Report</span>
              </button>
            </Link>
            <Link to="/upload-vitals">
              <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-md shadow-green-200">
                <Plus size={18} />
                <span>Log Vitals</span>
              </button>
            </Link>
          </div>
        </motion.div>

        {/* --- Vitals Summary Cards (REAL DATA) --- */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">Latest Vitals</h3>
          <Link to="/vitals-record" className="text-sm text-green-600 hover:underline">View History</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Activity size={24} />}
            label="Blood Pressure"
            value={latestVitals.bp}
            unit="mmHg"
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            icon={<Heart size={24} />}
            label="Heart Rate"
            value={latestVitals.heartRate}
            unit="bpm"
            color="bg-red-50 text-red-600"
          />
          <StatCard
            icon={<Scale size={24} />}
            label="Weight"
            value={latestVitals.weight}
            unit="kg"
            color="bg-orange-50 text-orange-600"
          />
          <StatCard
            icon={<Droplets size={24} />}
            label="Blood Sugar"
            value={latestVitals.sugar}
            unit="mg/dL"
            color="bg-purple-50 text-purple-600"
          />
        </div>

        {/* --- Recent Reports Section --- */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Recent Documents</h3>
            <Link to="/report-record" className="text-sm text-green-600 hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {reports.length > 0 ? (
              reports.slice(0, 5).map((report) => (
                <div key={report._id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg text-gray-500 group-hover:bg-green-100 group-hover:text-green-600 transition">
                      <FileText size={20} />
                    </div>
                    <div>
                      {/* Use fileName (standardized) */}
                      <h4 className="font-semibold text-gray-800">{report.fileName || report.filename}</h4>
                      <p className="text-xs text-gray-400">Uploaded {new Date(report.uploadDate).toLocaleDateString()}</p>
                    </div>
                  </div>


                  {/* Inside your reports.map loop */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                    {/* Button 1: View Original File */}
                    <a
                      href={report.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center text-sm border border-gray-200 px-3 py-1.5 rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
                    >
                      View File
                    </a>

                    {/* Button 2: AI Analysis */}
                    <Link
                      to={`/c/${report._id}`}
                      className="text-center text-sm border border-green-200 px-3 py-1.5 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition"
                    >
                      AI Analysis
                    </Link>
                  </div>


                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-400">
                No reports found. Upload one to get started!
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

// Reusable Component for the Top Cards
const StatCard = ({ icon, label, value, unit, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between"
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
        <span className="text-xs text-gray-400 font-medium">{unit}</span>
      </div>
    </div>
  </motion.div>
);

export default Dashboard;