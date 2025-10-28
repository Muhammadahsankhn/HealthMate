import React from "react";
import { FileText, Brain, BarChart } from "lucide-react";

const features = [
  {
    icon: <FileText size={32} />,
    title: "PDF & DOCX Support",
    desc: "Upload multiple document formats for instant AI-driven insights.",
  },
  {
    icon: <Brain size={32} />,
    title: "AI-Powered Summaries",
    desc: "Get concise summaries and keyword extraction using Gemini or OpenAI models.",
  },
  {
    icon: <BarChart size={32} />,
    title: "Smart Analysis",
    desc: "Understand sentiment, context, and extract important metrics automatically.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-16 bg-white text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-10">Key Features</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl shadow-md hover:shadow-xl transition bg-gray-50"
          >
            <div className="flex justify-center text-[#B9FF66] mb-4">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;