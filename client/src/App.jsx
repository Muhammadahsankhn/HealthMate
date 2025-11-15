import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AiAnalysis from './pages/AiAnalysis';
import VitalsUpload from "./pages/VitalsUpload";
import ReportUpload from "./pages/ReportUpload";
import VitalsRecord from "./pages/VitalsRecord";
import ReportRecord from "./pages/ReportRecord";
import Layout from './components/layoutes/layoutes';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/c/:_id" element={<AiAnalysis />} />
        <Route path="/vitals-upload" element={<Layout><VitalsUpload /></Layout>} />
        <Route path="/report-upload" element={<Layout><ReportUpload /></Layout>} />
        <Route path="/vitals-record" element={<Layout><VitalsRecord /></Layout>} />
        <Route path="/report-record" element={<Layout><ReportRecord /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App