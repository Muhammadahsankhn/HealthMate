import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

const UploadReport = () => {
  const { authFetch } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please choose a file');
    setLoading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await authFetch('/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
  const fileId = data.file?._id || (data.file && data.file._id);
        // If we have the saved file id, navigate to the report view so the user immediately sees preview + AI summary
        if (fileId) {
          navigate(`/report/${fileId}`);
          return;
        }
        // fallback
        navigate('/dashboard');
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Report</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files[0])} />
        <button type="submit" className="btn ml-2" disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
      </form>
      </div>
    </div>
  );
};

export default UploadReport;
