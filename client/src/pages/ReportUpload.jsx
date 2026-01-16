import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CloudUpload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";

const ReportUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Helper to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handle Drag & Drop Events
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  // Handle Manual Selection
  const onFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  // Validate File Type (Optional but recommended)
  const validateAndSetFile = (file) => {
    if (!file) return;

    // Check file type (example: images and pdfs only)
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF, JPG, or PNG file.");
      setFile(null);
      return;
    }

    setError("");
    setFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

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

      // Delay navigation slightly to show success state
      setTimeout(() => {
        navigate(`/c/${uploadedFile._id}`, {
          state: { file: { ...uploadedFile, type: "report" } },
        });
      }, 1000);

    } catch (err) {
      console.error("Upload failed:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError("Upload failed. Please check your connection.");
      }

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50 p-6 font-sans">

      {/* Decorative background blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 md:p-12 overflow-hidden"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Upload Medical Report</h2>
          <p className="text-gray-500 text-sm">
            Upload your prescriptions, lab reports, or X-rays for AI analysis.
          </p>
        </div>

        <form onSubmit={handleUpload} className="flex flex-col gap-6">

          {/* DRAG & DROP AREA */}
          <div
            onClick={() => fileInputRef.current.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`
              relative group cursor-pointer border-2 border-dashed rounded-2xl p-10 transition-all duration-300 flex flex-col items-center justify-center text-center
              ${isDragging
                ? "border-green-500 bg-green-50 scale-[1.02]"
                : "border-gray-300 hover:border-green-400 hover:bg-gray-50"
              }
              ${file ? "border-green-500 bg-green-50/30" : ""}
            `}
          >
            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={onFileSelect}
            />

            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <CloudUpload size={32} />
                  </div>
                  <p className="text-gray-700 font-medium">Click to upload or drag & drop</p>
                  <p className="text-gray-400 text-xs mt-2">SVG, PNG, JPG or PDF (MAX. 10MB)</p>
                </motion.div>
              ) : (
                <motion.div
                  key="filled"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center w-full"
                >
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <FileText size={32} />
                  </div>
                  <p className="text-gray-800 font-semibold truncate max-w-[200px]">{file.name}</p>
                  <p className="text-gray-500 text-xs mt-1">{formatFileSize(file.size)}</p>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="mt-4 text-red-500 text-sm flex items-center gap-1 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-full transition"
                  >
                    <X size={14} /> Remove file
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm"
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!file || loading}
            className={`
              w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform
              ${!file || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-teal-600 text-white hover:scale-[1.02] hover:shadow-green-500/30"
              }
            `}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              "Upload & Analyze"
            )}
          </button>

        </form>
      </motion.div>
    </div>
  );
};

export default ReportUpload;