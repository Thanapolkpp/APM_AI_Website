import React, { useState, useEffect, useRef } from "react"
import { HiOutlineClock, HiOutlinePlay, HiOutlinePause, HiOutlineX } from "react-icons/hi"
import { Timer, Music, CloudRain, Coffee, Library, Trees, Sparkles, Play, Pause, RotateCcw, Youtube, Maximize, Minimize, AlertCircle, CheckCircle2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Layout/Navbar"
import Footer from "../components/Layout/footer"
import CoinBadge from "../components/UI/CoinBadge"
import { useCoins } from "../hooks/useCoins"
import { updateExp } from "../services/aiService"
import Logo from "../assets/logo.png"
import BroIcon from "../assets/Bro.png"
import NerdIcon from "../assets/Nerd.1.2.png"
import CuteGirlIcon from "../assets/Girl.png"

const ReadingSystem = () => {
    const navigate = useNavigate()
    const { addCoins } = useCoins()
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [isActive, setIsActive] = useState(false)
    const [currentMode, setCurrentMode] = useState("Focus") // Focus, Break
    const [selectedAmbience, setSelectedAmbience] = useState("None")
    const [youtubeUrl, setYoutubeUrl] = useState("")
    const [youtubeId, setYoutubeId] = useState("")
    
    // Custom Alert State
    const [customAlert, setCustomAlert] = useState({ isOpen: false, message: "", type: "info" })
    const showCustomAlert = (message, type = "info") => {
        setCustomAlert({ isOpen: true, message, type })
    }

    const timerRef = useRef(null)

    const ambiences = [
        { id: "Rain", icon: CloudRain, color: "bg-blue-400", title: "Rainy Day" },
        { id: "Cafe", icon: Coffee, color: "bg-orange-400", title: "Cozy Cafe" },
        { id: "Library", icon: Library, color: "bg-emerald-400", title: "Silent Library" },
        { id: "Forest", icon: Trees, color: "bg-green-400", title: "Forest Walk" },
        { id: "YouTube", icon: Youtube, color: "bg-red-500", title: "YouTube Music" }
    ]

    const extractYoutubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    const handleYoutubeSubmit = () => {
        const id = extractYoutubeId(youtubeUrl)
        if (id) {
            setYoutubeId(id)
            setSelectedAmbience("YouTube")
        } else {
            showCustomAlert("ใส่ลิ้ง YouTube ให้ถูกต้องหน่อยนะเพื่อน! 🌸", "error")
        }
    }

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            clearInterval(timerRef.current)
            setIsActive(false)
            if (currentMode === "Focus") {
                addCoins(5) // แลกเป็นเหรียญเมื่อจดจ่อสำเร็จ
                updateExp(10).catch(() => {}) // เพิ่ม EXP ความสนิท
                showCustomAlert("ดีมากเลยเพื่อน! รับไปเลย 5 เหรียญ! 🪙 พักสักนิดมั้ยจ๊ะ? 🌷", "success")
            } else {
                showCustomAlert("พร้อมกลับไปลุยต่อรึยัง?! ✨", "success")
            }
        } else {
            clearInterval(timerRef.current)
        }
        return () => clearInterval(timerRef.current)
    }, [isActive, timeLeft, currentMode, addCoins])

    // ตรวจสอบการสลับ Tab หรือออกจากหน้าจอ
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isActive && currentMode === "Focus") {
                setIsActive(false)
                showCustomAlert("แอบหนีไปเล่นอย่างอื่นเหรอ?! 🫣 เราหยุดเวลาไว้ให้แล้วนะ กลับมาตั้งใจต่อเร็ว! ✨", "info")
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
    }, [isActive, currentMode])

    const [isFullscreen, setIsFullscreen] = useState(false)
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
            setIsFullscreen(true)
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
                setIsFullscreen(false)
            }
        }
    }

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(currentMode === "Focus" ? 25 * 60 : 5 * 60)
    }

    const switchMode = (mode) => {
        setCurrentMode(mode)
        setTimeLeft(mode === "Focus" ? 25 * 60 : 5 * 60)
        setIsActive(false)
    }

    const [profileImage] = useState(() => {
        const savedAvatar = localStorage.getItem("avatar") || "bro"
        const map = { girl: CuteGirlIcon, nerd: NerdIcon, bro: BroIcon }
        return map[savedAvatar.toLowerCase()] || BroIcon
    })

    const companionName = localStorage.getItem("avatar") || "Bro"

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-xl">
                <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-4 py-4 sm:px-6">
                    {/* Left: Logo & Title */}
                    <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => navigate("/")}>
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-2xl bg-white/20 ring-2 ring-pink-300/50 shadow-md">
                            <img src={Logo} alt="Logo" className="h-full w-full object-cover" />
                        </div>
                        <h1 className="text-xl font-extrabold text-black dark:text-white hidden sm:block">APM Focus</h1>
                    </div>

                    {/* Center: Navbar */}
                    <div className="hidden lg:flex flex-1 justify-center px-4">
                        <Navbar />
                    </div>

                    {/* Right: Coins & Profile */}
                    <div className="flex justify-end items-center gap-4 shrink-0">
                        <CoinBadge className="hidden sm:flex" />
                        <img src={profileImage} className="size-10 rounded-full border-2 border-primary shadow-sm" />
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-6xl mx-auto py-12 px-6 flex flex-col items-center">
                {/* Timer Display */}
                <div className="w-full max-w-2xl bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/60 dark:border-white/10 rounded-[64px] p-12 shadow-2xl flex flex-col items-center mb-12">
                    <div className="flex gap-4 mb-10 bg-white/40 dark:bg-white/10 p-2 rounded-3xl border border-white/60 dark:border-white/10">
                        <button
                            onClick={() => switchMode("Focus")}
                            className={`px-8 py-3 rounded-2xl font-black text-sm transition-all ${currentMode === 'Focus' ? 'bg-primary text-white shadow-xl translate-y-[-2px]' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Focus Time
                        </button>
                        <button
                            onClick={() => switchMode("Break")}
                            className={`px-8 py-3 rounded-2xl font-black text-sm transition-all ${currentMode === 'Break' ? 'bg-emerald-500 text-white shadow-xl translate-y-[-2px]' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Short Break
                        </button>
                    </div>

                    <div className="relative mb-12">
                        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse"></div>
                        <div className="text-[120px] font-black tracking-tighter text-gray-900 dark:text-white relative z-10 font-mono leading-none">
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className="flex gap-6 relative z-10 w-full max-w-sm">
                        <button
                            onClick={() => setIsActive(!isActive)}
                            className={`flex-1 py-6 rounded-[32px] text-white font-black text-xl flex items-center justify-center gap-3 shadow-2xl transition-all transform active:scale-95 ${isActive ? 'bg-gray-400' : 'bg-primary'}`}
                        >
                            {isActive ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
                            {isActive ? "PAUSE" : "START"}
                        </button>
                        <button
                            onClick={resetTimer}
                            className="w-20 rounded-[32px] bg-white border border-gray-200 text-gray-500 flex items-center justify-center shadow-xl active:scale-95 transition-all hover:bg-gray-50"
                        >
                            <RotateCcw size={28} />
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            className="w-20 rounded-[32px] bg-white border border-gray-200 text-gray-500 flex items-center justify-center shadow-xl active:scale-95 transition-all hover:bg-gray-50"
                            title="Fullscreen Mode"
                        >
                            {isFullscreen ? <Minimize size={28} /> : <Maximize size={28} />}
                        </button>
                    </div>
                </div>

                {/* Character & Ambience Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                    {/* Character Advice */}
                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 p-10 rounded-[48px] shadow-sm flex items-center gap-8">
                        <div className="relative">
                            <img src={profileImage} alt="Companion" className="w-40 h-40 object-contain animate-float" />
                            <div className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-full shadow-lg"><Sparkles className="text-white" size={18} /></div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">{companionName} กำลังให้กำลังใจอยู่! 🌷</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-bold italic text-lg leading-relaxed">
                                "{currentMode === 'Focus'
                                    ? 'ตั้งใจอ่านน้าเพื่อนจ๋า! วางมือถือแล้วโฟกัสกับเป้าหมายกันเถอะ ✨'
                                    : 'พักผ่อนให้เต็มที่นะ ยืดเส้นยืดสายหน่อย เดี๋ยวเราค่อยกลับไปลุยกันต่อ! 🌈'}"
                            </p>
                        </div>
                    </div>

                    {/* Ambience Control */}
                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 p-10 rounded-[48px] shadow-sm flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-6">
                            <Music className="text-primary" size={24} />
                            <h3 className="text-xl font-black text-gray-800 dark:text-white">Study Ambience</h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                            {ambiences.map(amb => (
                                <button
                                    key={amb.id}
                                    onClick={() => setSelectedAmbience(amb.id)}
                                    className={`flex flex-col items-center gap-3 p-5 rounded-[32px] border transition-all duration-300 ${selectedAmbience === amb.id ? 'bg-primary/10 border-primary text-primary shadow-lg scale-105' : 'bg-white/40 dark:bg-white/10 border-transparent hover:bg-white active:scale-95'}`}
                                >
                                    <div className={`p-4 rounded-2xl ${amb.color} text-white shadow-xl`}><amb.icon size={24} /></div>
                                    <span className="text-xs font-black uppercase tracking-wider">{amb.id}</span>
                                </button>
                            ))}
                        </div>

                        {/* YouTube Link Input (Show when YouTube is selected or as an option) */}
                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                                        <Youtube size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="วางลิ้ง Youtube ตรงนี้จ้า..."
                                        className="w-full bg-white/50 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        value={youtubeUrl}
                                        onChange={(e) => setYoutubeUrl(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleYoutubeSubmit()}
                                    />
                                </div>
                                <button
                                    onClick={handleYoutubeSubmit}
                                    className="bg-red-500 hover:bg-red-600 text-white font-black px-6 py-3 rounded-2xl transition-all shadow-md active:scale-95"
                                >
                                    PLAY MUSIC
                                </button>
                            </div>
                        </div>

                        {/* YouTube Player Embed */}
                        {selectedAmbience === "YouTube" && youtubeId && (
                            <div className="mt-6 rounded-2xl overflow-hidden aspect-video shadow-2xl border border-white/20">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Custom Alert Modal */}
            {customAlert.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
                        <div className="p-8 flex flex-col items-center text-center">
                            <div className={`size-20 rounded-full mb-6 flex items-center justify-center ${customAlert.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                                {customAlert.type === 'success' ? <CheckCircle2 size={40} /> : <AlertCircle size={40} />}
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">
                                {customAlert.type === 'success' ? 'สำเร็จแล้วจ้า! 🌟' : 'แจ้งเตือนเพื่อนรัก! 🔔'}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 font-bold leading-relaxed mb-8">
                                {customAlert.message}
                            </p>
                            <button 
                                onClick={() => setCustomAlert({ ...customAlert, isOpen: false })}
                                className="w-full py-4 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95"
                            >
                                ตกลงจ้า!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default ReadingSystem
