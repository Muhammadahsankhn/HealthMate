import React from 'react'
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";


//Pages
import Auth from './pages/Auth';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AiAnalysis from './pages/AiAnalysis';
import VitalsUpload from "./pages/VitalsUpload";
import ReportUpload from "./pages/ReportUpload";
import VitalsRecord from "./pages/VitalsRecord";
import ReportRecord from "./pages/ReportRecord";
import Contact from './pages/Contact';


//components
import Layout from './components/layoutes/layoutes';
import About from './components/About';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Features from './components/Features';



const ProtectedLayout = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to='/auth' />
}



const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  )
}
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* public route */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/features' element={<Features />} />
        </Route>

        <Route path="/auth" element={<Auth />} />


        {/* protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route element={<Layout><Outlet /></Layout>}>

            <Route path="/dashboard" element={<Dashboard />} />


            <Route path="/c/:_id" element={<AiAnalysis />} />


            <Route path="/upload-vitals" element={<Layout><VitalsUpload /></Layout>} />
            <Route path="/upload-report" element={<Layout><ReportUpload /></Layout>} />
            <Route path="/vitals-record" element={<Layout><VitalsRecord /></Layout>} />
            <Route path="/report-record" element={<Layout><ReportRecord /></Layout>} />


          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App