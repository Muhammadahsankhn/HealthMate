import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

const Dashboard = () => {
  const { authFetch } = useContext(AuthContext);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await authFetch('/users/reports');
      const data = await res.json();
      setReports(data.reports || []);
    };
    load();
  }, [authFetch]);

  return (
    <div>
      <NavBar />
      <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="mb-6 flex gap-3">
        <Link to="/upload" className="px-4 py-2 bg-sky-600 text-white rounded">Upload New Report</Link>
        <Link to="/vitals/add" className="px-4 py-2 border rounded">Add Manual Vitals</Link>
      </div>

      <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
      <div className="grid gap-4">
        {reports.map(r => (
          <div key={r.file._id} className="p-4 bg-white rounded shadow flex justify-between items-start">
            <div>
              <a href={`/report/${r.file._id}`} className="text-sky-700 font-semibold">View Report</a>
              {r.insight && <div className="text-sm text-gray-600 mt-2">{r.insight.englishSummary?.slice(0, 120)}...</div>}
            </div>
            <div className="text-xs text-gray-400">{new Date(r.file.uploadedAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
