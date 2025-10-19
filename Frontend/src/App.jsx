import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import AuthSlider from './components/AuthSlider';
import Dashboard from './pages/Dashboard';
import UploadReport from './pages/UploadReport';
import ViewReport from './pages/ViewReport';
import AddVitals from './pages/AddVitals';
import Timeline from './pages/Timeline';
import Chat from './pages/Chat';

const App = () => (
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthSlider />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadReport />} />
        <Route path="/report/:id" element={<ViewReport />} />
        <Route path="/vitals/add" element={<AddVitals />} />
        <Route path="/timeline" element={<Timeline />} />
  <Route path="/chat" element={<Chat />} />
      </Routes>
    </AuthProvider>
  </Router>
);

export default App;