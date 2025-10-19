import React, { useState, useContext, useRef, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/Input';

const Chat = () => {
  const { authFetch } = useContext(AuthContext);
  const { token } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  const sendMessage = async () => {
    setError(null);
    if (!message && !file) return;
    if (!token) {
      setError('Please login to chat with HealthMate.');
      return;
    }

    setLoading(true);
    try {
      let aiReply = '';

      if (file) {
        // ---- Upload and analyze file ----
        const formData = new FormData();
        formData.append('file', file);
        const res = await authFetch('/ai/chat', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'AI file analysis failed');

        aiReply = `
📄 **AI Analysis (English):** ${data.englishSummary || 'N/A'}

🇵🇰 **AI Analysis (Roman Urdu):** ${data.romanUrduSummary || 'N/A'}

❓ **Questions for your Doctor:**
${(data.doctorQuestions || []).map((q, i) => `${i + 1}. ${q}`).join('\n')}
        `;
        setFile(null);
      } else {
        // ---- Send normal text message ----
        const res = await authFetch('/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'AI chat error');
        aiReply = data.reply?.text || data.reply || data.text || 'No response';
      }

      // Add both user + AI messages to chat
      setHistory(h => [
        ...h,
        message && { from: 'user', text: message },
        { from: 'ai', text: aiReply },
      ].filter(Boolean));
      setMessage('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div>
      <NavBar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-sky-700">AI HealthMate Chat</h1>
        <div
          ref={containerRef}
          className="border rounded p-4 mb-4 bg-gradient-to-b from-sky-50 to-white shadow h-96 overflow-auto"
        >
          {history.length === 0 && (
            <div className="text-sm text-gray-500">Start a conversation or upload your report for AI analysis.</div>
          )}
          {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
          {history.map((m, i) => (
            <div key={i} className={`mb-3 flex ${m.from === 'ai' ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg whitespace-pre-line ${
                  m.from === 'ai'
                    ? 'bg-sky-100 text-sky-800'
                    : 'bg-slate-800 text-white'
                }`}
              >
                <div className="text-sm">{m.text}</div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {m.from === 'ai' ? 'HealthMate' : 'You'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input and file upload */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="file"
            accept=".pdf, image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="border rounded px-2 py-1 text-sm cursor-pointer"
          />
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about your report or health..."
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
          >
            {loading ? 'Analyzing...' : file ? 'Analyze File' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
