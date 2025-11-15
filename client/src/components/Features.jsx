import React from "react";
import { HeartPulse, Stethoscope, Brain, FileText } from "lucide-react";

const features = [
  {
    icon: <FileText size={32} />,
    title: "Upload Your Medical Reports",
    desc: "Easily upload blood tests, prescriptions, or health PDFs securely.",
  },
  {
    icon: <Brain size={32} />,
    title: "AI Health Analysis",
    desc: "Our AI reviews your report and summarizes the results in simple words.",
  },
  {
    icon: <HeartPulse size={32} />,
    title: "Personal Health Insights",
    desc: "Understand trends like high sugar, low vitamin levels, and more.",
  },
  {
    icon: <Stethoscope size={32} />,
    title: "Doctor-Ready Questions",
    desc: "Get smart questions you can ask your doctor for deeper understanding.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-10">
        How HealthMate Helps You Stay Informed
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl shadow-md hover:shadow-lg transition bg-green-50 border border-green-100"
          >
            <div className="flex justify-center text-[#4ade80] mb-4">{f.icon}</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
