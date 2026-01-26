import React, { useState, useEffect, useRef } from "react";
import { sendMessageToAI } from "../services/aiservice";


const ChatWindow = ({ mode }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // ข้อความทักทายตามโหมด
  const getSystemMessage = (currentMode) => {
    switch (currentMode) {
      case "bro":
        return "Yo bro! What's up? (Bro Mode ON) 🧢";
      case "girl":
        return "Hi bestie! ✨ Ready to study? (Cute Mode ON) 🎀";
      case "nerd":
        return "Greetings. Let's optimize your learning. (Nerd Mode ON) 🧪";
      default:
        return "Hello! How can I help you today?";
    }
  };

  // reset chat เมื่อเปลี่ยนโหมด
  useEffect(() => {
    setMessages([{ text: getSystemMessage(mode), sender: "ai" }]);
  }, [mode]);

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // ✅ ส่ง mode ไป backend
      const aiReplyText = await sendMessageToAI(input, mode);
      const aiMessage = { text: aiReplyText, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { text: "Error: คุยกับ AI ไม่ได้ครับ", sender: "ai" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getThemeColors = () => {
    switch (mode) {
      case "bro":
        return "bg-blue-100 text-blue-900";
      case "girl":
        return "bg-pink-100 text-pink-900";
      case "nerd":
        return "bg-purple-100 text-purple-900";
      default:
        return "bg-gray-100 text-gray-900";
    }
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className={`p-4 rounded-t-2xl flex gap-3 ${getThemeColors()}`}>
        <span className="material-symbols-outlined">smart_toy</span>
        <div>
          <h2 className="font-bold capitalize">{mode} Mode</h2>
          <p className="text-xs">Online</p>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-4 py-2 rounded-2xl max-w-[75%]
              ${msg.sender === "user" ? "bg-primary text-white" : "bg-gray-100"}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-sm text-gray-400">AI กำลังพิมพ์...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 p-4 bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-xl px-4 py-2 bg-gray-100"
          placeholder="Ask me anything..."
          disabled={isLoading}
        />
        <button
          disabled={isLoading || !input.trim()}
          className="bg-primary text-white px-6 rounded-xl"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
