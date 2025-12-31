import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Heart, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Animation variants for staggered reveal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const About = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 overflow-x-hidden">
      
      {/* --- Hero Section --- */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-b from-green-50/50 to-white">
        {/* Background Blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
              We make health data <br />
              <span className="text-green-600">human-readable.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              HealthMate bridges the gap between complex medical reports and your peace of mind using advanced AI technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- Mission Section --- */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-block px-4 py-1 bg-green-100 text-green-700 font-bold rounded-full text-sm">
              Our Mission
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Democratizing Medical Knowledge
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Medical reports are often filled with jargon that only doctors understand. We believe that **everyone deserves to understand their own body** without needing a medical degree.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              By translating blood tests, prescriptions, and vitals into simple language, we empower you to have better conversations with your doctor.
            </p>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative"
          >
            <div className="absolute inset-0 bg-green-600 rounded-3xl rotate-3 opacity-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" 
              alt="Team working on health tech" 
              className="relative rounded-3xl shadow-2xl border-4 border-white"
            />
          </motion.div>
        </div>
      </section>

      {/* --- Values Grid --- */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why HealthMate?</h2>
            <p className="text-gray-500 mt-3">Built with privacy, speed, and accuracy at the core.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <ValueCard 
              icon={<ShieldCheck size={32} />} 
              title="Privacy First" 
              desc="Your health data is sensitive. We encrypt every report and never share your data with third parties."
              color="bg-blue-100 text-blue-600"
            />
            <ValueCard 
              icon={<Zap size={32} />} 
              title="Instant AI Analysis" 
              desc="No waiting days for results. Our LLM-powered engine analyzes your documents in seconds."
              color="bg-yellow-100 text-yellow-600"
            />
            <ValueCard 
              icon={<Heart size={32} />} 
              title="User Centric" 
              desc="Designed for real people, not just data scientists. Simple, clean, and accessible for all ages."
              color="bg-red-100 text-red-600"
            />
          </motion.div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      

      
    </div>
  );
};

// Sub-component for clean code
const ValueCard = ({ icon, title, desc, color }) => (
  <motion.div 
    variants={itemVariants}
    className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
  >
    <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-6`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">
      {desc}
    </p>
  </motion.div>
);

export default About;