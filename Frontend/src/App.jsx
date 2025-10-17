import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthSlider from './components/AuthSlider';
import Home from "./pages/Home";
const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/auth" element={<AuthSlider />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;