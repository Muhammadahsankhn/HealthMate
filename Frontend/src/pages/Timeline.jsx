import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import NavBar from '../components/NavBar';

const Timeline = () => {
  const { authFetch } = useContext(AuthContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [rRes, vRes] = await Promise.all([authFetch('/users/reports'), authFetch('/vitals')]);
      const rData = await rRes.json();
      const vData = await vRes.json();
      const reports = (rData.reports || []).map(r => ({ type: 'report', date: r.file.uploadedAt, data: r }));
      const vitals = (vData.vitals || []).map(v => ({ type: 'vital', date: v.date, data: v }));
      const merged = [...reports, ...vitals].sort((a,b) => new Date(b.date) - new Date(a.date));
      setItems(merged);
    };
    load();
  }, [authFetch]);

  return (
    <div>
      <NavBar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Timeline</h1>
      <ul>
        {items.map((it, i) => (
          <li key={i} className="mb-3 border p-2">
            <div className="text-sm text-gray-500">{new Date(it.date).toLocaleString()}</div>
            {it.type === 'report' ? (
              <div>Report: <a href={it.data.file.fileUrl} target="_blank" rel="noreferrer">Open</a></div>
            ) : (
              <div>Vitals: BP {it.data.bp} | Sugar {it.data.sugar} | Weight {it.data.weight}</div>
            )}
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default Timeline;
