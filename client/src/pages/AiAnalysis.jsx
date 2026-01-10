import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Send, Bot, User } from "lucide-react";

const AiReview = () => {
  const { state } = useLocation();
  const file = state?.file;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // 🧠 Show AI analysis from upload
  useEffect(() => {
    if (!file) return;

    let messageText = "";

    if (typeof file.aiSummary === "object") {
      messageText = `
🩺 **Health Summary**

${file.aiSummary.summary}

📌 **Doctor's Advice:**
${file.aiSummary.doctorAdvice}

🌐 **Roman Urdu Explanation:**
${file.aiSummary.romanUrdu}
    `;
    } else {
      messageText = file.aiSummary || "No AI analysis found.";
    }

    setMessages([
      {
        role: "assistant",
        text: messageText,
      },
    ]);
  }, [file]);


  // 💬 Handle Chat with AI
  // 💬 Handle Chat with AI
  const handleChat = async () => {
    if (!input.trim() || !file) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Use the API_URL constant defined at the top
      const res = await axios.post(
        `${API_URL}/chat/chat`,
        {
          message: input,
          id: file._id,
          source: file.type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
          // Remove withCredentials if you're using Bearer token auth
          // withCredentials: true,
        }
      );

      const aiReply = res.data.reply || "Hmm... I couldn't interpret that.";
      setMessages((prev) => [...prev, { role: "assistant", text: aiReply }]);

    } catch (error) {
      console.error("Chat error:", error);

      // Better error handling
      let errorMessage = "⚠️ Unable to connect to AI at the moment. Try again later.";

      if (error.response) {
        // Server responded with error
        console.error("Server error:", error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // Request made but no response
        console.error("No response received:", error.request);
        errorMessage = "⚠️ No response from server. Check your connection.";
      } else {
        // Something else happened
        console.error("Error setting up request:", error.message);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-green-100">

      {/* Chat Section */}
      <main className="flex-1 p-6 relative ">
        <div className="max-w-3xl mx-auto space-y-4 absolute overflow-y-auto inset-0 pb-24 bg-zinc-300 p-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl shadow ${msg.role === "user"
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
                  }`}
              >
                <div className="flex items-center gap-2">
                  {msg.role === "assistant" ? (
                    <Bot className="w-4 h-4 text-green-500" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                  <p>{msg.text}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {loading && (
            <p className="text-center text-gray-500">Analyzing your question...</p>
          )}
        </div>
      </main>

      {/* Input Section */}
      <footer className="bg-white shadow-inner px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="flex-1 flex items-center border border-gray-300 rounded-lg px-3">
            <input
              type="text"
              placeholder="Ask about your report..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 outline-none py-2"
            />
            <button
              onClick={handleChat}
              className="text-green-600 hover:text-green-800 transition"
              disabled={loading}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AiReview;
