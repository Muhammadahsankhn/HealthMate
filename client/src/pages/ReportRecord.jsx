import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const ReportRecord = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${API_URL}/files/uploaded`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data.files || []);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8">🗂️ Your Uploaded Reports</h2>
      <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-2">
        {reports.length > 0 ? (
          reports.map((report) => (
            <motion.div
                key={report._id}
                className="bg-white shadow-lg rounded-2xl p-5 hover:shadow-2xl transition"
                whileHover={{ scale: 1.02 }}
              >
            <Link to={`/c/${report._id}`} key={report._id}>
                <h4 className="font-semibold text-gray-800 truncate">{report.fileName}</h4>
                <p className="text-gray-500 text-sm mt-2">
                  Uploaded on {new Date(report.uploadDate).toLocaleDateString()}
                </p>
                </Link>
                <a
                  href={report.fileUrl}
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
    </div>
  );
};

export default ReportRecord;