import React, { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Navbar from "../components/Navbar"
import Logo from "../assets/logo.png"
import GirlIcon from "../assets/Girl.png"
import BroIcon from "../assets/Bro.png"
import NerdIcon from "../assets/Nerd.1.1.png"
import { sendMessageToAI, sendMessageToAIWithImage } from "../services/aiService"

const ChatWindow = ({ mode: propsMode }) => {
  const navigate = useNavigate()
  const { mode: urlMode } = useParams()
  const mode = urlMode || propsMode || "bro"

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // ✅ แนบรูป
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)

  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  // ✅ system message
  const getSystemMessage = (currentMode) => {
    switch (currentMode) {
      case "bro":
        return "Yo bro! What's up? 🧢"
      case "girl":
        return "Hi bestie! ✨ Ready to study? 🎀"
      case "nerd":
        return "Greetings. Let's optimize your learning. 🧪"
      default:
        return "Hello! How can I help you today?"
    }
  }

  // ✅ กัน Markdown พัง
  const safeText = (value) => {
    if (typeof value === "string") return value
    if (value === null || value === undefined) return ""
    try {
      return JSON.stringify(value, null, 2)
    } catch (e) {
      return String(value)
    }
  }

  // ✅ build planner system prompt
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
`.trim()
  }

  // ✅ Quick Prompt
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
`.trim()

  // ✅ preview url (ไม่กินแรม)
  useEffect(() => {
    if (!selectedImage) {
      setImagePreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(selectedImage)
    setImagePreviewUrl(url)

    return () => URL.revokeObjectURL(url)
  }, [selectedImage])

  // ✅ init messages
  useEffect(() => {
    setMessages([{ text: getSystemMessage(mode), sender: "ai" }])
  }, [mode])

  // ✅ auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleClearChat = () => {
    setMessages([{ text: getSystemMessage(mode), sender: "ai" }])
  }

  // ✅ pick image
  const handlePickImage = () => {
    fileInputRef.current?.click()
  }

  // ✅ change image
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น")
      return
    }

    setSelectedImage(file)
  }

  // ✅ remove image
  const removeSelectedImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // ✅ styles by mode
  const headerTheme = useMemo(() => {
    if (mode === "bro") {
      return {
        pill: "from-blue-500 to-blue-600",
        ring: "ring-blue-300/40",
        focus: "focus:ring-blue-400",
        placeholder: "ถามอะไร bro หน่อยสิ...",
      }
    }
    if (mode === "girl") {
      return {
        pill: "from-pink-400 to-pink-500",
        ring: "ring-pink-300/50",
        focus: "focus:ring-pink-400",
        placeholder: "ถามอะไร bestie หน่อยสิ...",
      }
    }
    return {
      pill: "from-green-600 to-green-700",
      ring: "ring-green-300/50",
      focus: "focus:ring-green-400",
      placeholder: "ถามอะไร nerd หน่อยสิ...",
    }
  }, [mode])

  const handleSend = async (e) => {
    e.preventDefault()
    if ((!input.trim() && !selectedImage) || isLoading) return

    const textToSend = input.trim()

    const userMsg = {
      text: textToSend || "(แนบรูปภาพ)",
      sender: "user",
      imagePreview: imagePreviewUrl || null,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    try {
      // ✅ planner trigger (ฉลาดขึ้น)
      const shouldPlannerMode = /ตาราง|อ่านหนังสือ|สอบ|midterm|final|to-do|todo|เตือนงาน/i.test(
        textToSend
      )

      const finalPrompt = shouldPlannerMode
        ? buildPlannerSystemPrompt(textToSend)
        : textToSend

      const reply = selectedImage
        ? await sendMessageToAIWithImage(finalPrompt, mode, selectedImage)
        : await sendMessageToAI(finalPrompt, mode)

      setMessages((prev) => [...prev, { text: safeText(reply), sender: "ai" }])

      removeSelectedImage()
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: safeText(error?.message || "คุยกับ AI ไม่ได้ครับ"),
          sender: "ai",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[85vh] max-w-4xl mx-auto p-2 md:p-4 bg-gray-50 rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* ✅ App Header (รวมให้จบในอันเดียว ไม่ซ้อน) */}
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-xl">
        <div className="mx-auto grid w-full grid-cols-2 items-center px-4 py-4 sm:px-6 md:grid-cols-3">
          {/* LEFT */}
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`relative size-11 sm:size-12 shrink-0 overflow-hidden rounded-2xl bg-white/20 shadow-md ring-2 ${headerTheme.ring}`}
            >
              <img
                src={Logo}
                alt="Logo"
                className="h-full w-full object-cover transition duration-300 hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-pink-200/30 via-transparent to-blue-200/20" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-[15px] sm:text-xl font-extrabold tracking-tight leading-none text-gray-800 drop-shadow-sm dark:text-white">
                <span className="sm:hidden">APM AI</span>
                <span className="hidden sm:inline">
                  APM AI
                </span>
              </h1>

              <p className="truncate text-[10px] sm:text-[11px] font-semibold text-gray-600/70 dark:text-white/70">
                🌷 ผู้ช่วยที่เป็นเพื่อนที่ดีสำหรับคุณ
              </p>
            </div>
          </div>

          {/* CENTER */}
          <div className="hidden md:flex justify-center">
            <div className="rounded-full border border-white/20 bg-white/15 px-6 py-2 shadow-sm">
              <Navbar />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-end items-center gap-3">
            <button className="relative size-9 sm:size-10 rounded-full flex items-center justify-center bg-white/90 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-105 active:scale-95">
              <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-gray-700 dark:text-gray-200">
                notifications
              </span>
              <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="size-9 sm:size-10 rounded-full bg-cover bg-center border-2 border-primary/70 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-sm"
              style={{ backgroundImage: `url("${GirlIcon}")` }}
              title="Go to Login"
              aria-label="Go to login"
            />

            {/* Mobile Navbar */}
            <div className="md:hidden">
              <Navbar />
            </div>
          </div>
        </div>

        {/* ✅ Mode Pill (อยู่ใน header เดียวกัน) */}
        <div
          className={`px-4 pb-4`}
        >
          <div
            className={`w-full rounded-2xl p-4 font-bold capitalize shadow-md transition-all duration-500 flex items-center justify-between bg-gradient-to-r ${headerTheme.pill} text-white`}
          >
            <div className="flex items-center gap-2">
              <img
                src={mode === "bro" ? BroIcon : mode === "girl" ? GirlIcon : NerdIcon}
                alt="mode icon"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/60"
              />

              <span>{mode} Mode Online</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleClearChat}
                className="px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-sm"
              >
                ล้างแชท
              </button>

              <div className="size-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            </div>
          </div>
        </div>
      </header>

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
              {/* user image preview inside chat */}
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
                <p className="whitespace-pre-wrap leading-relaxed">
                  {safeText(msg.text)}
                </p>
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
      {selectedImage && imagePreviewUrl && (
        <div className="px-4 pb-2 bg-white border-t border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={imagePreviewUrl}
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
          className={`flex-1 rounded-2xl px-5 py-3 bg-gray-100 outline-none transition-all text-gray-700 focus:ring-2 ${headerTheme.focus}`}
          placeholder={headerTheme.placeholder}
          disabled={isLoading}
        />

        <button
          type="submit"
          className={`size-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg transition-all active:scale-90 ${isLoading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 hover:rotate-12"
            }`}
          disabled={isLoading}
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  )
}

export default ChatWindow
