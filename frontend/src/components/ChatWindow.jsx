import React, { useState, useEffect, useRef } from 'react';

// Mock function จำลองการส่งข้อมูล (ถ้าคุณมีไฟล์ service จริง ให้ import มาแทนตรงนี้)
const sendMessageToAI = async (text) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("นี่คือคำตอบจำลองจาก AI ครับ (คุณต้องเชื่อมต่อ API จริงตรงนี้)");
    }, 1000);
  });
};

const ChatWindow = ({ mode }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // ฟังก์ชันเลือกข้อความทักทายตามโหมด
  const getSystemMessage = (currentMode) => {
    switch (currentMode) {
      case 'bro': return "Yo bro! What's up? (Bro Mode ON) 🧢";
      case 'girl': return "Hi bestie! ✨ Ready to study? (Cute Mode ON) 🎀";
      case 'nerd': return "Greetings. Let's optimize your learning. (Nerd Mode ON) 🧪";
      default: return "Hello! How can I help you today?";
    }
  };

  // กำหนด Theme สีตามโหมด
  const getThemeColors = () => {
    switch (mode) {
      case 'bro': return 'bg-bro-blue text-blue-900 border-blue-200';
      case 'girl': return 'bg-girl-pink text-pink-900 border-pink-200';
      case 'nerd': return 'bg-nerd-purple text-purple-900 border-purple-200';
      default: return 'bg-gray-100 text-gray-900 border-gray-200';
    }
  };

  // เมื่อเริ่มแหลดหน้า หรือเปลี่ยนโหมด ให้ส่งข้อความทักทายใหม่
  useEffect(() => {
    setMessages([
      { text: getSystemMessage(mode), sender: "ai" }
    ]);
  }, [mode]);

  // Auto scroll ลงล่างสุดเมื่อมีข้อความใหม่
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault(); // ป้องกันหน้าเว็บ Refresh เมื่อกด Enter
    if (!input.trim()) return;

    // 1. เพิ่มข้อความเราลงในจอทันที
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 2. ส่งไปหา AI
      const aiReplyText = await sendMessageToAI(input);

      // 3. เอาคำตอบ AI มาแปะในจอ
      const aiMessage = { text: aiReplyText, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Error: คุยกับ AI ไม่ได้ครับ", sender: "ai" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-4xl mx-auto p-4">

      {/* Header บอกโหมด */}
      <div className={`p-4 rounded-t-2xl flex items-center gap-3 shadow-sm border-b ${getThemeColors()}`}>
        <div className="bg-white/50 p-2 rounded-full">
          <span className="material-symbols-outlined">smart_toy</span>
        </div>
        <div>
          <h2 className="font-bold text-lg capitalize">{mode} Mode</h2>
          <p className="text-xs opacity-80">Online & Ready to help</p>
        </div>
      </div>

      {/* พื้นที่แชท (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-800 shadow-inner space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed
                    ${msg.sender === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-gray-600'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 px-5 py-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ช่องพิมพ์ข้อความ */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-b-2xl shadow-lg border-t border-gray-100 dark:border-gray-700">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 bg-gray-50 dark:bg-gray-900 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-teal-400 text-white rounded-xl px-6 py-3 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>

    </div>
  );
};

export default ChatWindow;