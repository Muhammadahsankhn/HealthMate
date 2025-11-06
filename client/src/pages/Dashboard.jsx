import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [reports, setReports] = useState([]);
  const [vitals, setVitals] = useState({
    bloodPressure: "",
    bloodSugar: "",
    weight: "",
    heartRate: "",
  });
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // ------------------ Decode JWT & load user ------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      fetchReports(token);
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/auth");
    }
  }, [navigate]);

  // ------------------ Fetch Reports ------------------
  const fetchReports = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/files/uploadReport", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setReports(res.data.files || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  // ------------------ Upload Report ------------------
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${API_URL}/files/uploadReport`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });


      setFile(null);
      fetchReports(token);
      const uploadedFile = res.data.file; // assuming backend returns file info
      navigate("/ai-review", { state: { file: uploadedFile } });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };


  // ------------------ Upload Vitals ------------------
  const handleVitalsUpload = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await axios.post(`${API_URL}/vitals/addVitals`, {
        bloodPressure: vitals.bloodPressure,
        bloodSugar: vitals.bloodSugar,
        weight: vitals.weight,
        heartRate: vitals.heartRate,
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });


      // ✅ Navigate to AI Review page with vitals AI summary
      const aiSummary = res.data.aiSummary;
      navigate("/ai-review", {
        state: { file: { aiSummary, type: "vitals" } },
      });

      // Reset fields
      setVitals({
        bloodPressure: "",
        sugar: "",
        weight: "",
        heartRate: "",
      });
    } catch (err) {
      console.error("Error uploading vitals:", err);
      alert("Failed to upload vitals!");
    } finally {
      setLoading(false);
    }
  };


  // ------------------ Logout ------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/">
          <h1 className="text-2xl font-extrabold text-gray-800 cursor-pointer"
          >
            🩺 Health<span className="text-green-600">Mate</span>
          </h1>
        </Link>

        <div
          onClick={() => setShowProfile(true)}
          className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition"
        >
          {user ? user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() : ""}
        </div>

        {/* Profile Side Panel */}
        <AnimatePresence>
          {showProfile && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowProfile(false)}
              />
              <motion.div
                className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 z-50 flex flex-col"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 80, damping: 18 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Profile</h3>
                  <button
                    onClick={() => setShowProfile(false)}
                    className="text-gray-500 hover:text-red-500 text-xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-col items-center bg-white">
                  <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
                    {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </div>

                  <h4 className="text-xl font-semibold text-gray-800">{user?.username || "N/A"}</h4>
                  <p className="text-gray-600">{user?.email}</p>

                  <div className="mt-6 w-full border-t pt-4 text-sm text-gray-600">
                    <p><strong>User ID:</strong> {user?.id || "N/A"}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-auto bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
                >
                  Logout
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Page Tabs */}
      <div className="flex justify-center gap-6 mt-6">
        {["dashboard", "records"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full font-medium transition-all ${activeTab === tab
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {tab === "dashboard" ? "Dashboard" : "View Records"}
          </button>
        ))}
      </div>

      {/* ---------------- Main Dashboard ---------------- */}
      {activeTab === "dashboard" && (
        <main className="flex-1 p-8">
          <motion.h2
            className="text-3xl font-semibold text-gray-800 mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Welcome{user ? `, ${user.username || user.email.split("@")[0]}` : ""} 👋
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Upload Report */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                📤 Upload Medical Report
              </h3>
              <form onSubmit={handleUpload} className="flex flex-col gap-3">
                <input
                  type="file"
                  className="border border-gray-300 rounded-lg p-2"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all"
                >
                  {loading ? "Uploading..." : "Upload Report"}
                </button>
              </form>
            </motion.div>

            {/* Add Vitals */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">💉 Add Your Vitals</h3>
              <form onSubmit={handleVitalsUpload} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Blood Pressure (e.g. 120/80)"
                  value={vitals.bloodPressure}
                  onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2"
                />
                <input
                  type="number"
                  placeholder="Blood Sugar (mg/dL)"
                  value={vitals.bloodSugar}
                  onChange={(e) => setVitals({ ...vitals, bloodSugar: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2"
                />
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={vitals.weight}
                  onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2"
                />
                <input
                  type="number"
                  placeholder="Heart Rate (bpm)"
                  value={vitals.heartRate}
                  onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2"
                />

                {/* ✅ This button now submits to backend */}
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all"
                >
                  {loading ? "Saving..." : "Save & Analyze Vitals"}
                </button>
              </form>

            </motion.div>
          </div>
        </main>
      )}

      {/* ---------------- Records Page ---------------- */}
      {activeTab === "records" && (
        <section className="p-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            🗂️ Your Uploaded Reports
          </h3>
          <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-2">
            {reports.length > 0 ? (
              reports.map((report) => (
                <motion.div
                  key={report._id}
                  className="bg-white shadow-lg rounded-2xl p-5 hover:shadow-2xl transition"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-semibold text-gray-800 truncate">{report.filename}</h4>
                  <p className="text-gray-500 text-sm mt-2">
                    Uploaded on {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  <a
                    href={`http://localhost:5000/uploads/${report.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    View Report
                  </a>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No reports uploaded yet.
              </p>
            )}
          </div>
        </section>
      )}

      <footer className="text-center py-4 bg-gray-100 text-gray-500 mt-auto">
        © {new Date().getFullYear()} HealthMate | Designed by Ahsan 💚
      </footer>
    </div>
  );
};

export default Dashboard;
