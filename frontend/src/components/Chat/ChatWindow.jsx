import React, { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import pdfToText from "react-pdftotext"
import { sendMessageToAI, sendMessageToAIWithImage } from "../../services/aiService"

// New Components
import ChatHeader from "../chat-window/ChatHeader"
import MessageList from "../chat-window/MessageList"
import ChatInput from "../chat-window/ChatInput"
import ImagePreview from "../chat-window/ImagePreview"
import { getSystemMessage, buildPlannerSystemPrompt, plannerPrompt } from "../../data/aiPrompts"
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
  const pdfInputRef = useRef(null)



  // Safe text util (also used in MessageItem, but needed here for setting initial state if needed, mostly for error handling)
  const safeText = (value) => {
    if (typeof value === "string") return value
    if (value === null || value === undefined) return ""
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }





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
    const username = localStorage.getItem("username");
    setMessages([{ text: getSystemMessage(mode, username), sender: "ai" }])
  }, [mode])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleClearChat = () => {
    const username = localStorage.getItem("username");
    setMessages([{ text: getSystemMessage(mode, username), sender: "ai" }])
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

  const handlePickPdf = () => {
    pdfInputRef.current?.click()
  }

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      alert("กรุณาเลือกไฟล์ PDF เท่านั้น")
      return
    }

    setIsLoading(true)
    pdfToText(file)
      .then((text) => {
        setInput(prev => prev + "\n[เนื้อหาจาก PDF]:\n" + text)
        alert("อ่านไฟล์ PDF สำเร็จแล้ว! คุณสามารถส่งข้อความต่อได้เลย")
      })
      .catch((error) => {
        console.error("Failed to extract text from pdf", error)
        alert("ขออภัย ไม่สามารถอ่านไฟล์ PDF นี้ได้")
      })
      .finally(() => {
        setIsLoading(false)
        if (pdfInputRef.current) pdfInputRef.current.value = ""
      })
  }

  const [guestChatCount, setGuestChatCount] = useState(() => {
    return parseInt(localStorage.getItem("guest_chat_count") || "0")
  })

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

  const isLoggedIn = !!localStorage.getItem("token")
  const isLimitReached = !isLoggedIn && guestChatCount >= 5

  // Handle Send
  const handleSend = async (e) => {
    e.preventDefault()
    if ((!input.trim() && !selectedImage) || isLoading) return

    // Guest Limit Check
    if (isLimitReached) {
      alert("คุณใช้งานครบจำนวนจำกัด 5 ครั้งแล้ว กรุณาเข้าสู่ระบบเพื่อใช้งานต่อครับ")
      navigate("/login")
      return
    }

    const textToSend = input.trim()

    const userMsg = {
      text: textToSend || "(แนบรูปภาพ)",
      sender: "user",
      imagePreview: imagePreviewUrl || null,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    // Increment guest count if not logged in
    if (!isLoggedIn) {
      const newCount = guestChatCount + 1
      setGuestChatCount(newCount)
      localStorage.setItem("guest_chat_count", newCount.toString())
    }

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
    <div className="flex flex-col h-full max-w-4xl mx-auto p-2 md:p-4 bg-gray-50 rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

      <ChatHeader
        mode={mode}
        headerTheme={headerTheme}
        onClearChat={handleClearChat}
        navigate={navigate}
        guestChatCount={guestChatCount}
        isLoggedIn={isLoggedIn}
      />

      <MessageList
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
        mode={mode}
      />

      {/* Quick Action Button - kept in main file as it interacts with setInput directly */}
      <div className="px-4 pb-2 bg-white border-t border-gray-100">
        <button
          type="button"
          disabled={isLoading || isLimitReached}
          onClick={() => setInput(plannerPrompt)}
          className={`w-full px-4 py-3 rounded-2xl font-semibold transition-all ${isLoading || isLimitReached
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          📅 ช่วยจัดตาราง + To-do + เตือนงาน
        </button>
      </div>

      <ImagePreview
        selectedImage={selectedImage}
        imagePreviewUrl={imagePreviewUrl}
        onRemove={removeSelectedImage}
      />

      {isLimitReached && (
        <div className="mx-4 mb-2 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center justify-between text-sm text-red-600 font-bold animate-bounce shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            <span>คุณใช้งานครบ 5 ครั้งแล้ว กรุณาเข้าสู่ระบบนะครับ 🌷</span>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            ไปหน้า Login
          </button>
        </div>
      )}

      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        handleSend={handleSend}
        handlePickImage={handlePickImage}
        fileInputRef={fileInputRef}
        handleImageChange={handleImageChange}
        pdfInputRef={pdfInputRef}
        handlePickPdf={handlePickPdf}
        handlePdfChange={handlePdfChange}
        headerTheme={headerTheme}
        disabled={isLimitReached}
      />
    </div>
  )
}

export default ChatWindow
