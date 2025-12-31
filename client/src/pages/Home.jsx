import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import About from "../components/About";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Footer />

    </>
  );
};

export default Home;