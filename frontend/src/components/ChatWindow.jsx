import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { sendMessageToAI, sendMessageToAIWithImage } from "../services/aiService";
import remarkGfm from "remark-gfm";

const ChatWindow = ({ mode: propsMode }) => {
  const { mode: urlMode } = useParams();
  const mode = urlMode || propsMode || "bro";

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ เพิ่ม state รูปภาพ
  const [selectedImage, setSelectedImage] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const getSystemMessage = (currentMode) => {
    switch (currentMode) {
      case "bro":
        return "Yo bro! What's up? 🧢";
      case "girl":
        return "Hi bestie! ✨ Ready to study? 🎀";
      case "nerd":
        return "Greetings. Let's optimize your learning. 🧪";
      default:
        return "Hello! How can I help you today?";
    }
  };

  // ✅ แปลงอะไรก็ตามให้เป็น string เสมอ (กัน Markdown พัง)
  const safeText = (value) => {
    if (typeof value === "string") return value;
    if (value === null || value === undefined) return "";
    try {
      return JSON.stringify(value, null, 2);
    } catch (e) {
      return String(value);
    }
  };
  const buildPlannerSystemPrompt = (userText) => {
    return `
คุณเป็น AI ผู้ช่วยจัด "ตารางอ่านหนังสือ + To-do + ระบบเตือนงาน" แบบเป็นระบบ

**ห้ามทำสิ่งต่อไปนี้**
- ห้ามใส่ตัวเลขแปลก ๆ เช่น 6730202571 | 36 หรือรหัสวิชา/ไอดีสุ่ม
- ห้ามตอบเป็นรายการมั่ว ๆ
- ห้ามตอบสั้นแบบแปะชื่อวิชาเฉย ๆ

**รูปแบบคำตอบ (ต้องมีครบ และต้องจัดเป็น Markdown)**
## 1) สรุปวิชา/หัวข้อที่ต้องอ่าน
- ...

## 2) ตารางอ่านหนังสือรายสัปดาห์ (แบ่งวัน)
| วัน | เวลา | หัวข้อ | เป้าหมาย |
|---|---|---|---|

## 3) ตารางอ่านวันนี้ (6 ชั่วโมง / วัน)
| ช่วงเวลา | ทำอะไร |
|---|---|
| 1 ชั่วโมงที่ 1 | ... |
| 1 ชั่วโมงที่ 2 | ... |
| 1 ชั่วโมงที่ 3 | ... |
| พัก | 10-15 นาที |
| 1 ชั่วโมงที่ 4 | ... |
| 1 ชั่วโมงที่ 5 | ... |
| 1 ชั่วโมงที่ 6 | ... |

## 4) To-do List (Checklist)
- [ ] ...
- [ ] ...
- [ ] ...

## 5) ระบบเตือนงาน
- เตือนทุกวันเวลา 20:00 ให้ทบทวนสรุป 20 นาที
- ก่อนสอบ 7 วัน / 3 วัน / 1 วัน ต้องทำอะไร

**เงื่อนไขของผู้ใช้**
- อ่านวันละ 6 ชั่วโมง (1 ชั่วโมงต่อหัวข้อ)
- ต้องมีเวลาพัก ห้ามอัดแน่นเกินไป
- น้ำเสียงเป็นมิตร แต่ไม่ลากเสียง/ไม่ยืดคำ

ข้อมูลผู้ใช้:
${userText}
`.trim();
  };


  // ✅ Quick Prompt สำหรับจัดตาราง + To-do + เตือนงาน
  const plannerPrompt = `
ช่วยจัดตารางอ่านหนังสือแบบเป็นระบบให้หน่อย

**วิชาที่ต้องอ่าน**
- Data Science
- Introduction to Programming
- Economics
- Networking Technologies and Applications
- Internet Technology
- สรุป

**เงื่อนไข**
- อ่านวันละ 6 ชั่วโมง
- 1 ชั่วโมงต่อ 1 หัวข้อ
- พักทุก 2 ชั่วโมง ครั้งละ 10-15 นาที
- ขอแบบตารางรายสัปดาห์ + แผนวันนี้ + To-do + ระบบเตือนงาน
`.trim();


  useEffect(() => {
    setMessages([{ text: getSystemMessage(mode), sender: "ai" }]);
  }, [mode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClearChat = () => {
    setMessages([{ text: getSystemMessage(mode), sender: "ai" }]);
  };

  // ✅ กดปุ่มแนบรูป
  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  // ✅ เลือกรูป
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }

    setSelectedImage(file);
  };

  // ✅ ลบรูปที่เลือก
  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const textToSend = input.trim();

    // ✅ เพิ่มข้อความ user
    const userMsg = {
      text: textToSend || "(แนบรูปภาพ)",
      sender: "user",
      imagePreview: selectedImage ? URL.createObjectURL(selectedImage) : null,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // ✅ ถ้าข้อความผู้ใช้มีคำว่า "ตาราง" หรือ "To-do" → เสริมระบบ planner
      const shouldPlannerMode =
        textToSend.includes("ตาราง") ||
        textToSend.toLowerCase().includes("to-do") ||
        textToSend.includes("todo") ||
        textToSend.includes("เตือนงาน");

      const finalPrompt = shouldPlannerMode
        ? buildPlannerSystemPrompt(textToSend)
        : textToSend;

      // ✅ ถ้ามีรูป -> ส่งแบบมีรูป
      const reply = selectedImage
        ? await sendMessageToAIWithImage(finalPrompt, mode, selectedImage)
        : await sendMessageToAI(finalPrompt, mode);

      setMessages((prev) => [...prev, { text: safeText(reply), sender: "ai" }]);

      // ✅ ส่งเสร็จล้างรูป
      removeSelectedImage();
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: safeText(error?.message || "คุยกับ AI ไม่ได้ครับ"), sender: "ai" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-4xl mx-auto p-2 md:p-4 bg-gray-50 rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div
        className={`p-4 rounded-t-2xl font-bold capitalize shadow-md transition-all duration-500 flex items-center justify-between ${mode === "bro"
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
          : mode === "girl"
            ? "bg-gradient-to-r from-pink-400 to-pink-500 text-white"
            : "bg-gradient-to-r from-purple-600 to-indigo-700 text-white"
          }`}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined">
            {mode === "bro"
              ? "smart_toy"
              : mode === "girl"
                ? "face_6"
                : "psychology"}
          </span>
          <span>{mode} Mode Online</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClearChat}
            className="px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-sm"
          >
            ล้างแชท
          </button>
          <div className="size-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50 backdrop-blur-sm custom-scrollbar">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-sm transition-all ${msg.sender === "user"
                ? "bg-blue-600 text-white rounded-tr-none"
                : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                }`}
            >
              {/* ✅ ถ้า user แนบรูป ให้โชว์ preview */}
              {msg.sender === "user" && msg.imagePreview && (
                <img
                  src={msg.imagePreview}
                  alt="uploaded"
                  className="w-48 h-48 object-cover rounded-xl mb-2 border border-white/30"
                />
              )}

              {msg.sender === "ai" ? (
                <div
                  className="markdown-content prose prose-sm max-w-none 
                  prose-table:border-collapse prose-table:w-full prose-table:my-2
                  prose-th:border prose-th:border-gray-300 prose-th:p-2 prose-th:bg-gray-50
                  prose-td:border prose-td:border-gray-300 prose-td:p-2
                  prose-ul:list-disc prose-ul:ml-4
                  prose-strong:font-bold prose-strong:text-current"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {safeText(msg.text)}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed">{safeText(msg.text)}</p>
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

      {/* Quick Action */}
      <div className="px-4 pb-2 bg-white border-t border-gray-100">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => setInput(plannerPrompt)}
          className="w-full px-4 py-3 rounded-2xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all"
        >
          📅 ช่วยจัดตาราง + To-do + เตือนงาน
        </button>
      </div>

      {/* Preview รูปก่อนส่ง */}
      {selectedImage && (
        <div className="px-4 pb-2 bg-white border-t border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="preview"
              className="w-16 h-16 rounded-xl object-cover border"
            />
            <div className="flex-1 text-sm text-gray-600">
              <div className="font-semibold">แนบรูปแล้ว</div>
              <div className="truncate">{selectedImage.name}</div>
            </div>
            <button
              type="button"
              onClick={removeSelectedImage}
              className="px-3 py-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all"
            >
              ลบ
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSend} className="flex gap-2 p-4 bg-white border-t border-gray-100">
        {/* hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {/* attach image button */}
        <button
          type="button"
          onClick={handlePickImage}
          disabled={isLoading}
          className="size-12 rounded-2xl flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-all"
          title="แนบรูปภาพ"
        >
          <span className="material-symbols-outlined text-gray-700">image</span>
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-2xl px-5 py-3 bg-gray-100 outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-700"
          placeholder={`ถามอะไร ${mode} หน่อยสิ...`}
          disabled={isLoading}
        />

        <button
          type="submit"
          className={`size-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg transition-all active:scale-90 ${isLoading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:rotate-12"
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
