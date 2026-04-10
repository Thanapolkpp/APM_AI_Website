import React, { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import pdfToText from "react-pdftotext"
import { sendMessageToAI, sendMessageToAIWithImage, fetchChatHistory, sendMessageToAIStreaming } from "../../services/aiService"

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
  const [activeHistoryContextId, setActiveHistoryContextId] = useState(null)

  // Image state
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)

  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const pdfInputRef = useRef(null)

  // Safe text util
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
    setMessages([{ text: getSystemMessage(mode, username), sender: "ai" }]);
    setActiveHistoryContextId(null);
  }, [mode])

  // Listen for active chat selection from sidebar
  useEffect(() => {
    const handleLoadSelectedHistory = (e) => {
      const item = e.detail;
      if (!item) return;

      const username = localStorage.getItem("username");
      const initSystemMessage = { text: getSystemMessage(mode, username), sender: "ai" };
      
      const newMessages = [initSystemMessage];
      if (item.user_message) {
          newMessages.push({ text: item.user_message, sender: "user", historyId: item.id });
      }
      if (item.ai_response) {
          newMessages.push({ text: item.ai_response, sender: "ai", historyId: item.id });
      }
      
      setMessages(newMessages);
      setActiveHistoryContextId(item.id);
    };
    window.addEventListener("loadSelectedHistory", handleLoadSelectedHistory);
    return () => window.removeEventListener("loadSelectedHistory", handleLoadSelectedHistory);
  }, [mode]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleClearChat = () => {
    const username = localStorage.getItem("username");
    setMessages([{ text: getSystemMessage(mode, username), sender: "ai" }]);
    setActiveHistoryContextId(null);
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
        const truncatedText = text.length > 5000 ? text.substring(0, 5000) + "..." : text
        setInput(prev => prev + "\n[เนื้อหาจาก PDF]:\n" + truncatedText)
        alert("อ่านไฟล์ PDF สำเร็จแล้ว! (ตัดเนื้อหาหากยาวเกินไป) คุณสามารถส่งข้อความต่อได้เลย")
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

  // Image compression helper
  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            },
            "image/jpeg",
            0.7
          );
        };
      };
    });
  };

  // Handle Send
  const handleSend = async (e) => {
    e.preventDefault()
    if ((!input.trim() && !selectedImage) || isLoading) return
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

    if (!isLoggedIn) {
      const newCount = guestChatCount + 1
      setGuestChatCount(newCount)
      localStorage.setItem("guest_chat_count", newCount.toString())
    }

    try {
      const shouldPlannerMode = /ตาราง|อ่านหนังสือ|สอบ|midterm|final|to-do|todo|เตือนงาน/i.test(textToSend)

      const finalPrompt = shouldPlannerMode
        ? buildPlannerSystemPrompt(textToSend)
        : textToSend

      const conversationHistory = messages.slice(1).map(m => ({
          role: m.sender,
          content: m.text
      }));

      if (selectedImage) {
          // Optimization: Compress image if large
          let fileToUpload = selectedImage;
          if (selectedImage && selectedImage.size > 500 * 1024) {
            fileToUpload = await compressImage(selectedImage);
          }
          const reply = await sendMessageToAIWithImage(finalPrompt, mode, fileToUpload, activeHistoryContextId, conversationHistory)
          setMessages((prev) => [...prev, { text: safeText(reply), sender: "ai" }])
      } else {
          // Streaming mode for text
          let fullReply = ""
          // Add a temporary AI message that will be updated
          setMessages((prev) => [...prev, { text: "", sender: "ai", isStreaming: true }])
          
          await sendMessageToAIStreaming(finalPrompt, mode, [], conversationHistory, (chunk) => {
              fullReply += chunk
              setMessages((prev) => {
                  const newMsgs = [...prev]
                  const last = newMsgs[newMsgs.length - 1]
                  if (last && last.sender === "ai" && last.isStreaming) {
                      last.text = fullReply
                  }
                  return newMsgs
              })
          })
          
          // Finalize the message
          setMessages((prev) => {
              const newMsgs = [...prev]
              const last = newMsgs[newMsgs.length - 1]
              if (last && last.sender === "ai") {
                  delete last.isStreaming
              }
              return newMsgs
          })
      }

      setActiveHistoryContextId(null)
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
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto bg-white md:bg-gray-50 md:rounded-[40px] md:shadow-2xl border-none md:border md:border-gray-100 overflow-hidden relative">

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

      {/* Footer Area with Fixed Height on Mobile to ensure visibility */}
      <div className="flex flex-col shrink-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-white/5 pb-safe">
        
        {/* Quick Action Buttons: Compact Scrollable Row for Mobile */}
        <div className="px-4 py-3 overflow-x-auto no-scrollbar">
          <div className="flex gap-3 min-w-min">
            <button
              onClick={() => setInput(plannerPrompt)}
              disabled={isLoading || isLimitReached}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/50 rounded-2xl text-[13px] font-bold text-indigo-700 transition-all shadow-sm shrink-0 active:scale-95"
            >
              <span className="text-base">📅</span>
              <span className="whitespace-nowrap">จัดตารางเรียน</span>
            </button>
            <button
              onClick={() => setInput("เหงาจัง ชวนคุยหน่อยสิ ชวนคุยเรื่องอะไรก็ได้ที่สนุกๆ หรือเล่าเรื่องตลกให้ฟังหน่อย 🌷")}
              disabled={isLoading || isLimitReached}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-orange-50/50 hover:bg-orange-50 border border-orange-100/50 rounded-2xl text-[13px] font-bold text-orange-700 transition-all shadow-sm shrink-0 active:scale-95"
            >
              <span className="text-base">🐥</span>
              <span className="whitespace-nowrap">คุยแก้เหงา</span>
            </button>
            <button
              onClick={() => setInput("มีเรื่องอยากปรึกษาหน่อย พอดีช่วงนี้ [ระบุเรื่องที่กังวล] อยากได้คำแนะนำหรือแนวทางแก้ไขปัญหาหน่อยครับ ✨")}
              disabled={isLoading || isLimitReached}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-yellow-50/50 hover:bg-yellow-50 border border-yellow-100/50 rounded-2xl text-[13px] font-bold text-yellow-700 transition-all shadow-sm shrink-0 active:scale-95"
            >
              <span className="text-base">🤝</span>
              <span className="whitespace-nowrap">ปรึกษา</span>
            </button>
          </div>
        </div>

        <ImagePreview
          selectedImage={selectedImage}
          imagePreviewUrl={imagePreviewUrl}
          onRemove={removeSelectedImage}
        />

        {isLimitReached && (
          <div className="mx-4 my-1 p-2 rounded-xl bg-red-50 border border-red-100 flex items-center justify-between text-[10px] text-red-600 font-bold shadow-sm shrink-0">
            <div className="flex items-center gap-2 truncate">
              <span className="material-symbols-outlined text-base">error</span>
              <span className="truncate">ใช้งานครบ 5 ครั้งแล้ว กรุณา Login นะครับ 🌷</span>
            </div>
            <button onClick={() => navigate("/login")} className="px-3 py-1 bg-red-600 text-white rounded-lg text-[10px] shrink-0 font-black">
              LOGIN
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
    </div>
  )
}

export default ChatWindow
