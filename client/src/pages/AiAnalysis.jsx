import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  ArrowLeft, 
  Bot, 
  User, 
  FileText, 
  Languages, 
  Stethoscope,
  Loader2
} from "lucide-react";

const AiReview = () => {
  const { id } = useParams(); // Get ID from URL if user lands here directly
  const location = useLocation();
  const scrollRef = useRef(null);

  // 1. Get Initial Data (From State or Fetch)
  // If state is missing (e.g. refresh), we need to fetch it.
  const [data, setData] = useState(location.state?.file || null);
  const [loading, setLoading] = useState(!location.state?.file);
  const [error, setError] = useState(null);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  // Determine Type (Report or Vitals)
  const source = data?.type || location.state?.file?.type || "report"; 

  // --- 1. Fetch Data if Missing (Page Refresh) ---
  useEffect(() => {
    if (data) {
        // If data exists, load chat history if any
        if (data.chatHistory && data.chatHistory.length > 0) {
            setMessages(data.chatHistory.map(msg => ({
                role: msg.sender === "ai" ? "assistant" : "user",
                text: msg.message
            })));
        }
        return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL;
        
        // Decide endpoint
        const endpoint = source === "vitals" 
            ? `${API_URL}/vitals/${id}` 
            : `${API_URL}/files/${id}`;

        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const record = res.data.data;
        setData(record);
        
        // Load Chat History
        if (record.chatHistory && record.chatHistory.length > 0) {
            setMessages(record.chatHistory.map(msg => ({
                role: msg.sender === "ai" ? "assistant" : "user",
                text: msg.message
            })));
        }
      } catch (err) {
        console.error("Failed to load data", err);
        setError("Record not found or access denied.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, data, source]);

  // Auto-scroll chat
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // --- 2. Handle Chat ---
  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await axios.post(
        `${API_URL}/chat/chat`,
        { message: userMsg.text, id: data._id, source: source },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const aiReply = res.data.reply;
      setMessages((prev) => [...prev, { role: "assistant", text: aiReply }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", text: "⚠️ Error connecting to AI." }]);
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50 text-green-600">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin" size={32} />
        <p>Loading Analysis...</p>
      </div>
    </div>
  );

  if (error || !data) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <h2 className="text-xl font-bold text-gray-700">{error || "Record Not Found"}</h2>
            <Link to="/dashboard" className="text-green-600 hover:underline mt-4 inline-block">Back to Dashboard</Link>
        </div>
    </div>
  );

  // Helper to safely get summary text
  const summaryText = data.aiSummary?.summary || data.aiSummary || "No summary available.";
  const urduText = data.aiSummary?.romanUrdu || data.aiRomanUrdu || "Not available.";
  const adviceText = data.aiSummary?.doctorAdvice || data.aiDoctorQuestions || data.aiDoctorAdvice || "No specific advice.";

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 shadow-sm z-20 sticky top-0">
        <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600">
             <ArrowLeft size={24} />
        </Link>
        <div>
            <h1 className="text-xl font-bold text-gray-800">
                {source === "vitals" ? "Vitals Analysis" : "Report Analysis"}
            </h1>
            <p className="text-xs text-gray-500">
              {data.fileName || "Recorded Vitals"} • {new Date(data.uploadDate || data.createdAt).toLocaleDateString()}
            </p>
        </div>
      </header>

      {/* --- MAIN CONTENT (Scrollable) --- */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 bg-gray-50/50">
        
        {/* 1. ANALYSIS CARDS GRID */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Card 1: English Summary */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 hover:shadow-md transition relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-6 -mt-6 opacity-50"></div>
                <div className="flex items-center gap-2 mb-4 text-blue-600">
                    <FileText size={24} />
                    <h3 className="font-bold text-lg">Summary</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                    {summaryText}
                </p>
            </motion.div>

            {/* Card 2: Roman Urdu */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 hover:shadow-md transition relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-6 -mt-6 opacity-50"></div>
                <div className="flex items-center gap-2 mb-4 text-purple-600">
                    <Languages size={24} />
                    <h3 className="font-bold text-lg">Desi Explanation</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm italic">
                    {urduText}
                </p>
            </motion.div>

            {/* Card 3: Doctor Advice */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 hover:shadow-md transition relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-6 -mt-6 opacity-50"></div>
                <div className="flex items-center gap-2 mb-4 text-red-600">
                    <Stethoscope size={24} />
                    <h3 className="font-bold text-lg">Doctor's Note</h3>
                </div>
                <div className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                    {adviceText}
                </div>
            </motion.div>
        </div>

        {/* 2. CHAT SECTION HEADER */}
        <div className="max-w-4xl mx-auto border-t border-gray-200 pt-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Bot size={24} className="text-green-600"/> 
                Ask Follow-up Questions
            </h3>
            
            <div className="space-y-6 pb-20">
                {messages.length === 0 && (
                    <div className="text-center bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-gray-400">
                        <p>Have questions about your report?</p>
                        <p className="text-sm">Type below to chat with Health Mate.</p>
                    </div>
                )}

                <AnimatePresence>
                {messages.map((msg, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        key={index} 
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
                                msg.role === "user" ? "bg-gray-200" : "bg-green-100 text-green-600"
                            }`}>
                                {msg.role === "user" ? <User size={16}/> : <Bot size={16}/>}
                            </div>
                            
                            {/* Bubble */}
                            <div className={`p-4 rounded-2xl text-sm whitespace-pre-wrap shadow-sm leading-relaxed ${
                                msg.role === "user" 
                                ? "bg-gray-800 text-white rounded-tr-none" 
                                : "bg-white border border-gray-100 text-gray-700 rounded-tl-none"
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    </motion.div>
                ))}
                </AnimatePresence>

                {/* Loading State */}
                {sending && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                         <div className="ml-11 bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2 text-sm text-gray-500">
                            <Loader2 className="animate-spin" size={14} />
                            Health Mate is typing...
                        </div>
                    </motion.div>
                )}
                <div ref={scrollRef} />
            </div>
        </div>

      </main>

      {/* --- FOOTER INPUT --- */}
      <footer className="bg-white border-t border-gray-200 p-4 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto">
          <form 
            onSubmit={handleSend}
            className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-5 py-2 focus-within:ring-2 focus-within:ring-green-100 focus-within:border-green-400 transition shadow-sm"
          >
            <input
              type="text"
              placeholder="Ask something..."
              className="flex-1 bg-transparent outline-none text-gray-700 py-2 placeholder-gray-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-95 shadow-md"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </footer>

    </div>
  );
};

export default AiReview;