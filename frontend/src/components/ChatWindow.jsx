import React, { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { sendMessageToAI, sendMessageToAIWithImage } from "../services/aiService"

// New Components
import ChatHeader from "./chat-window/ChatHeader"
import MessageList from "./chat-window/MessageList"
import ChatInput from "./chat-window/ChatInput"
import ImagePreview from "./chat-window/ImagePreview"

const ChatWindow = ({ mode: propsMode }) => {
  const navigate = useNavigate()
  const { mode: urlMode } = useParams()
  const mode = urlMode || propsMode || "bro"

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Image state
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)

  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  // System message logic
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

  // Safe text util (also used in MessageItem, but needed here for setting initial state if needed, mostly for error handling)
  const safeText = (value) => {
    if (typeof value === "string") return value
    if (value === null || value === undefined) return ""
    try {
      return JSON.stringify(value, null, 2)
    } catch (e) {
      return String(value)
    }
  }

  // Planner System Prompt
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

  // Quick Prompt
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

  // Preview URL effect
  useEffect(() => {
    if (!selectedImage) {
      setImagePreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(selectedImage)
    setImagePreviewUrl(url)

    return () => URL.revokeObjectURL(url)
  }, [selectedImage])

  // Init messages
  useEffect(() => {
    setMessages([{ text: getSystemMessage(mode), sender: "ai" }])
  }, [mode])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleClearChat = () => {
    setMessages([{ text: getSystemMessage(mode), sender: "ai" }])
  }

  const handlePickImage = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น")
      return
    }

    setSelectedImage(file)
  }

  const removeSelectedImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Theme logic
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

  // Handle Send
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

      <ChatHeader
        mode={mode}
        headerTheme={headerTheme}
        onClearChat={handleClearChat}
        navigate={navigate}
      />

      <MessageList
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />

      {/* Quick Action Button - kept in main file as it interacts with setInput directly */}
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

      <ImagePreview
        selectedImage={selectedImage}
        imagePreviewUrl={imagePreviewUrl}
        onRemove={removeSelectedImage}
      />

      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        handleSend={handleSend}
        handlePickImage={handlePickImage}
        fileInputRef={fileInputRef}
        handleImageChange={handleImageChange}
        headerTheme={headerTheme}
      />
    </div>
  )
}

export default ChatWindow
