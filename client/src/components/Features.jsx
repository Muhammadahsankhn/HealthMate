import React from "react";
import { HeartPulse, Stethoscope, Brain, FileText } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <FileText size={28} />,
    title: "Smart Report Upload",
    desc: "Drag & drop your PDF blood tests or prescriptions. We handle the secure encryption.",
  },
  {
    icon: <Brain size={28} />,
    title: "AI Explanation",
    desc: "Don't struggle with medical jargon. Our AI translates complex results into plain English.",
  },
  {
    icon: <HeartPulse size={28} />,
    title: "Vitals Tracking",
    desc: "Log blood pressure, sugar, and weight to visualize your health trends over time.",
  },
  {
    icon: <Stethoscope size={28} />,
    title: "Doctor-Ready Prep",
    desc: "Get auto-generated questions based on your results to ask your doctor during visits.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5, // Delays each child animation by 0.2s
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Features = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-green-50/50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-green-100 text-green-700 font-semibold rounded-full text-sm mb-4"
          >
            ✨ Core Features
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold text-gray-900 leading-tight"
          >
            Everything you need to <br className="hidden md:block"/>
            <span className="text-green-600">understand your health.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 mt-4 text-lg"
          >
            HealthMate empowers you with tools that turn confusing medical data into actionable insights.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 group hover:border-green-400 transition-all duration-300"
            >
              {/* Icon Container with Gradient */}
              <div className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-green-200 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                {f.title}
              </h3>
              
              <p className="text-gray-500 leading-relaxed text-sm">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Features;