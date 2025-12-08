import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FileUp } from "lucide-react";

const ReportUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

      const uploadedFile = res.data.file;
      navigate(`/c/${uploadedFile._id}`, {
        state: { file: { ...uploadedFile, type: "report" } },
      });
      setFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#DCF4FF] via-white to-[#E0F7FF] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-10"
      >
        <motion.h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          📤 Upload Medical Report
        </motion.h2>

        <motion.form
          onSubmit={handleUpload}
          className="flex flex-col gap-6"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-xl px-4 py-4 rounded-xl border border-gray-200 shadow-sm">
            <FileUp className="text-green-600" size={22} />

            <input
              type="file"
              className="bg-transparent w-full text-gray-700"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-green-700 transition-all"
          >
            {loading ? "Uploading..." : "Upload Report"}
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ReportUpload;
