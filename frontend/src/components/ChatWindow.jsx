import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { sendMessageToAI } from "../services/aiService";
import remarkGfm from 'remark-gfm'; // แนะนำให้ลงเพิ่มเพื่อให้ตารางแสดงผลแม่นยำขึ้น

const ChatWindow = ({ mode: propsMode }) => {
  const { mode: urlMode } = useParams();
  const mode = urlMode || propsMode || "bro";

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const getSystemMessage = (currentMode) => {
    switch (currentMode) {
      case "bro": return "Yo bro! What's up? 🧢";
      case "girl": return "Hi bestie! ✨ Ready to study? 🎀";
      case "nerd": return "Greetings. Let's optimize your learning. 🧪";
      default: return "Hello! How can I help you today?";
    }
  };

  useEffect(() => {
    setMessages([{ text: getSystemMessage(mode), sender: "ai" }]);
  }, [mode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await sendMessageToAI(input, mode);
      setMessages(prev => [...prev, { text: reply, sender: "ai" }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Error: คุยกับ AI ไม่ได้ครับ", sender: "ai" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-4xl mx-auto p-2 md:p-4 bg-gray-50 rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className={`p-4 rounded-t-2xl font-bold capitalize shadow-md transition-all duration-500 flex items-center justify-between ${mode === 'bro' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
          mode === 'girl' ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white' :
            'bg-gradient-to-r from-purple-600 to-indigo-700 text-white'
        }`}>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined">
            {mode === 'bro' ? 'smart_toy' : mode === 'girl' ? 'face_6' : 'psychology'}
          </span>
          <span>{mode} Mode Online</span>
        </div>
        <div className="size-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50 backdrop-blur-sm custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-sm transition-all ${msg.sender === "user"
                ? "bg-blue-600 text-white rounded-tr-none"
                : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
              }`}>
              {msg.sender === "ai" ? (
                /* จัดการ Format Markdown ให้สวยงาม */
                <div className="markdown-content prose prose-sm max-w-none 
                  prose-table:border-collapse prose-table:w-full prose-table:my-2
                  prose-th:border prose-th:border-gray-300 prose-th:p-2 prose-th:bg-gray-50
                  prose-td:border prose-td:border-gray-300 prose-td:p-2
                  prose-ul:list-disc prose-ul:ml-4
                  prose-strong:font-bold prose-strong:text-current">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-2xl text-xs text-gray-400 animate-bounce">
              AI is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="flex gap-2 p-4 bg-white border-t border-gray-100">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-2xl px-5 py-3 bg-gray-100 outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-700"
          placeholder={`ถามอะไร ${mode} หน่อยสิ...`}
          disabled={isLoading}
        />
        <button
          className={`size-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg transition-all active:scale-90 ${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:rotate-12'
            }`}
          disabled={isLoading}
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;