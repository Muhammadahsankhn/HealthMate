import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  ShieldCheck, 
  AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // UI States
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // 1. Load User Info from Token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          username: decoded.username || "User",
          email: decoded.email || "user@example.com" // Ensure your JWT includes email if needed
        });
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  // 2. Handle Input Change
  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    // Clear errors when typing
    if (status.message) setStatus({ type: "", message: "" });
  };

  // 3. Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setStatus({ type: "error", message: "All fields are required." });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setStatus({ type: "error", message: "New passwords do not match." });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setStatus({ type: "error", message: "Password must be at least 6 characters." });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;

      // Make sure you have this route in your backend!
      const res = await axios.post(
        `${API_URL}/auth/change-password`, 
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus({ type: "success", message: "Password updated successfully!" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to update password.";
      setStatus({ type: "error", message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans flex justify-center items-start">
      
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: User Info Card --- */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <User size={40} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{user.username}</h2>
            <p className="text-gray-500 text-sm mb-6">{user.email}</p>
            
            <div className="text-left space-y-3">
              <div className="flex items-center gap-3 text-gray-600 text-sm p-3 bg-gray-50 rounded-lg">
                <ShieldCheck size={18} className="text-green-600" />
                <span>Account Verified</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm p-3 bg-gray-50 rounded-lg">
                <Mail size={18} className="text-blue-600" />
                <span>Email Linked</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Change Password Form --- */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Lock className="text-green-600" size={24} />
                Security Settings
              </h3>
              <p className="text-gray-500 text-sm">Update your password to keep your account secure.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Status Message */}
              <AnimatePresence>
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
                      status.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                    }`}
                  >
                    {status.type === "error" ? <AlertCircle size={18} /> : <ShieldCheck size={18} />}
                    {status.message}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition"
                    placeholder="Enter current password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition"
                      placeholder="Min. 6 characters"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
                      passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                    }`}
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-200 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Save size={20} /> Update Password
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;