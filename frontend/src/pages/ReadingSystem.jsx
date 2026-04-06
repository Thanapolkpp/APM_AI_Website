import React, { useState, useEffect, useRef } from "react"
import { HiOutlineClock, HiOutlinePlay, HiOutlinePause, HiOutlineX } from "react-icons/hi"
import { Timer, Music, CloudRain, Coffee, Library, Trees, Sparkles, Play, Pause, RotateCcw, Youtube, Maximize, Minimize, AlertCircle, CheckCircle2, MinusCircle, PlusCircle, Coins, Heart, Sun, EyeOff, Bell, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Layout/Navbar"
import Footer from "../components/Layout/footer"
import CoinBadge from "../components/UI/CoinBadge"
import { useCoins } from "../hooks/useCoins"
import { updateExp } from "../services/aiService"

// --- Cloudinary Asset Configuration ---
const CLOUD_NAME = "dxfxkq0zs";
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/v1/APM-AI/assets/`;

import { ASSETS, getStaticFrame, mapImagePath } from "../config/assets";
import { fetchOwnedRooms, fetchOwnedAvatars } from "../services/aiService";

const Logo = ASSETS.BRANDING.LOGO;
const BroIcon = ASSETS.AVATARS.BRO;
const NerdIcon = ASSETS.AVATARS.NERD2;
const CuteGirlIcon = ASSETS.AVATARS.GIRL;
const MotionReading = ASSETS.READING.MOTION_GIF;
const TableImg = ASSETS.READING.TABLE;
const Glass = ASSETS.READING.GLASS_BEAR;
const Speech = ASSETS.READING.SPEAKER;
const DefaultBackground = ASSETS.READING.BACKGROUND;
const Chair = ASSETS.READING.CHAIR;

const ReadingSystem = () => {
    const navigate = useNavigate()
    const { addCoins } = useCoins()

    // --- State Management ---
    const [focusDuration, setFocusDuration] = useState(25 * 60)
    const [breakDuration, setBreakDuration] = useState(5 * 60)
    const [timeLeft, setTimeLeft] = useState(focusDuration)
    const [isActive, setIsActive] = useState(false)
    const [currentMode, setCurrentMode] = useState("Focus") // Focus, Break
    const [selectedAmbience, setSelectedAmbience] = useState("None")
    const [youtubeUrl, setYoutubeUrl] = useState("")
    const [youtubeId, setYoutubeId] = useState("")
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Custom Alert State
    const [customAlert, setCustomAlert] = useState({ isOpen: false, message: "", type: "info" })
    const [isTimeModalOpen, setIsTimeModalOpen] = useState(false)
    const [tempMinutes, setTempMinutes] = useState(25)

    // Assets & Profile State
    const [background, setBackground] = useState(DefaultBackground)
    const [profileImage, setProfileImage] = useState(BroIcon)
    const [companionName, setCompanionName] = useState("Bro")

    // --- แก้ไขจุดที่มีปัญหา: เพิ่ม State สำหรับ Static Frames ---
    const [staticMotionImg, setStaticMotionImg] = useState(null)
    const [staticGlass, setStaticGlass] = useState(null)
    const [staticSpeech, setStaticSpeech] = useState(null)

    const timerRef = useRef(null)

    // Sync Inventory Data
    useEffect(() => {
        const syncInventory = async () => {
            try {
                const rooms = await fetchOwnedRooms();
                const equippedRoom = rooms.find(r => r.is_equipped);
                if (equippedRoom) {
                    setBackground(mapImagePath(equippedRoom.image_path));
                }

                const avatars = await fetchOwnedAvatars();
                const equippedAvatar = avatars.find(a => a.is_equipped);
                if (equippedAvatar) {
                    const mode = equippedAvatar.name.toLowerCase();
                    setCompanionName(equippedAvatar.name);
                    setProfileImage(mapImagePath(equippedAvatar.model_path));

                    let modeStr = "bro";
                    if (mode.includes("girl") || mode.includes("bestie")) modeStr = "girl";
                    if (mode.includes("nerd") || mode.includes("genius")) modeStr = "nerd";
                    localStorage.setItem("avatar", modeStr);
                }
            } catch (err) { console.error("Inventory sync error:", err); }
        };
        syncInventory();
    }, []);

    // Set Static Frames for Assets
    useEffect(() => {
        setStaticMotionImg(getStaticFrame(MotionReading));
        setStaticGlass(getStaticFrame(Glass));
        setStaticSpeech(getStaticFrame(Speech));
    }, [MotionReading, Glass, Speech])

    const showCustomAlert = (message, type = "info") => {
        setCustomAlert({ isOpen: true, message, type })
    }

    const ambiences = [
        { id: "Rain", icon: CloudRain, color: "bg-blue-400", title: "Rainy Day", youtubeId: "35AdtzquJYg" },
        { id: "Cafe", icon: Coffee, color: "bg-orange-400", title: "Cozy Cafe", youtubeId: "MYPVQccHhAQ" },
        { id: "Library", icon: Library, color: "bg-emerald-400", title: "Silent Library", youtubeId: "phRZKH1tQsQ" },
        { id: "Forest", icon: Trees, color: "bg-green-400", title: "Forest Walk", youtubeId: "gZknpSi4CP8" },
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
            showCustomAlert(<span className="flex items-center justify-center gap-2">ใส่ลิ้ง YouTube ให้ถูกต้องหน่อยนะเพื่อน! <AlertCircle size={18} className="text-red-500" /></span>, "error")
        }
    }

    // Timer Logic
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000)
        } else if (timeLeft === 0 && isActive) {
            clearInterval(timerRef.current)
            setIsActive(false)
            if (currentMode === "Focus") {
                addCoins(5)
                updateExp(10).catch(() => { })
                showCustomAlert(<span className="flex flex-col items-center gap-1 text-center"><span>เก่งมากกล้ามาก ขอบคุณครับ! <Heart size={18} className="text-pink-500 inline fill-pink-500" /></span> <span className="text-xs opacity-70 font-bold">รับไปเลย 5 เหรียญ และ 10 EXP น้าา <Sparkles size={14} className="text-yellow-500 inline" /></span></span>, "success")
            } else {
                showCustomAlert(<span className="flex items-center justify-center gap-2">พร้อมกลับไปลุยต่อรึยัง?! <Sparkles size={18} className="text-yellow-500" /></span>, "success")
            }
            // Auto reset timer to prevent farming
            setTimeout(() => {
                resetTimer();
            }, 3000);
        } else {
            clearInterval(timerRef.current)
        }
        return () => clearInterval(timerRef.current)
    }, [isActive, timeLeft, currentMode, addCoins])

    const setManualTime = (totalSeconds) => {
        if (totalSeconds < 10) return;
        setTimeLeft(totalSeconds);
        if (currentMode === "Focus") setFocusDuration(totalSeconds);
        else setBreakDuration(totalSeconds);
    }

    // Visibility Check
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isActive && currentMode === "Focus") {
                setIsActive(false)
                showCustomAlert(<span className="flex flex-col items-center gap-2 text-center"><span>แอบหนีไปเล่นอย่างอื่นเหรอ?! <EyeOff size={18} className="text-gray-500 inline" /></span> <span>เราหยุดเวลาไว้ให้แล้วนะ กลับมาตั้งใจต่อเร็ว! <Sparkles size={18} className="text-yellow-500 inline" /></span></span>, "info")
            }
        }
        document.addEventListener("visibilitychange", handleVisibilityChange)
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
    }, [isActive, currentMode])

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

    const adjustTime = (minutes) => {
        const newSeconds = timeLeft + (minutes * 60);
        if (newSeconds < 60) return;
        setTimeLeft(newSeconds);
        if (currentMode === "Focus") setFocusDuration(newSeconds);
        else setBreakDuration(newSeconds);
    }

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(currentMode === "Focus" ? focusDuration : breakDuration)
    }

    const switchMode = (mode) => {
        setCurrentMode(mode)
        const duration = mode === "Focus" ? focusDuration : breakDuration
        setTimeLeft(duration)
        setIsActive(false)
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/60 dark:bg-black/20 backdrop-blur-xl transition-all">
                <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
                        <div className="relative size-12 rounded-2xl bg-white shadow-xl ring-2 ring-pink-100 flex items-center justify-center overflow-hidden">
                            <img src={Logo} alt="Logo" className="size-8 object-contain transition duration-500 hover:scale-110" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-black text-gray-900 dark:text-white leading-tight">APM Focus</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Focus Mode 🧘‍♂️</p>
                        </div>
                    </div>
                    <div className="hidden lg:flex flex-1 justify-center px-4">
                        <Navbar />
                    </div>
                    <div className="flex justify-end items-center gap-3 sm:gap-4 shrink-0">
                        <div className="hidden sm:block">
                            <CoinBadge className="scale-90" />
                        </div>
                        <img 
                            src={profileImage} 
                            className="size-10 rounded-2xl border-2 border-white dark:border-white/10 shadow-lg cursor-pointer hover:scale-110 transition-transform" 
                            onClick={() => navigate("/account")}
                            alt="Profile"
                        />
                        <div className="lg:hidden">
                            <Navbar />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-5xl mx-auto py-4 md:py-8 px-2 sm:px-4 md:px-6 flex flex-col items-center text-center">
                <div className="w-full max-w-2xl bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/60 dark:border-white/10 rounded-[40px] md:rounded-[64px] p-5 md:p-8 shadow-2xl flex flex-col items-center mb-6 md:mb-8">
                    <div className="flex flex-col items-center mb-10 gap-3">
                        <div className="flex gap-4 bg-white/40 dark:bg-white/10 p-2 rounded-3xl border border-white/60 dark:border-white/10">
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
                        {currentMode === 'Focus' && (
                            <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2">
                                <Sparkles size={16} className="text-yellow-500" />
                                โฟกัสครบ 25 นาทีตามที่ตั้งไว้ รับไปเลย <span className="text-yellow-600">5 เหรียญ</span> และ <span className="text-pink-500">10 EXP</span>! <Star size={16} className="fill-yellow-500" />
                            </div>
                        )}
                        {currentMode === 'Break' && (
                            <div className="bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2">
                                <Coffee size={16} /> พักสมองให้เต็มที่นะจ๊ะ!
                            </div>
                        )}
                    </div>

                    {/* Room View */}
                    <div className="mb-6 w-full max-w-lg flex justify-center perspective-1000">
                        <div className={`relative w-full aspect-[16/10] transition-all duration-1000 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl border-4 md:border-8 border-white/60 dark:border-white/10 ${isActive ? 'scale-[1.03] translate-y-[-10px]' : 'scale-100'}`}>
                            <div className={`absolute -inset-10 bg-gradient-to-tr from-primary/40 via-transparent to-pink-400/40 blur-[100px] transition-opacity duration-1000 ${isActive ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
                            <img src={background} className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${isActive ? 'scale-110' : 'scale-100'}`} style={{ filter: isActive ? 'brightness(100%) saturate(120%)' : 'brightness(40%)' }} alt="BG" />
                            <img src={Chair} className={`absolute left-1/2 -translate-x-[48%] top-[32%] w-[32%] z-10 transition-all ${isActive ? 'scale-105 brightness-[100%]' : 'opacity-90 grayscale-[15%] brightness-[50%]'}`} alt="Chair" />
                            <img src={isActive ? MotionReading : (staticMotionImg || MotionReading)} className="absolute left-1/2 -translate-x-1/2 top-[32%] w-[50%] z-20 drop-shadow-2xl" style={{ filter: isActive ? 'none' : 'grayscale(20%) brightness(70%)' }} alt="Avatar" />
                            <img src={TableImg} className="absolute bottom-[-5%] w-full object-contain z-30" style={{ filter: isActive ? 'brightness(100%)' : 'brightness(60%)' }} alt="Table" />
                            <img src={isActive ? Glass : (staticGlass || Glass)} className={`absolute right-[15%] bottom-[-5%] w-[15%] z-40 transition-all ${isActive ? 'animate-float brightness-[100%]' : 'grayscale-[20%] brightness-[60%]'}`} alt="Glass" />
                            <img src={isActive ? Speech : (staticSpeech || Speech)} className={`absolute left-[5%] bottom-[0%] w-[30%] z-40 transition-all ${isActive ? 'animate-float brightness-[100%]' : 'grayscale-[20%] brightness-[60%]'}`} alt="Speaker" />
                        </div>
                    </div>

                    {/* Timer Display */}
                    <div className="relative mb-6 md:mb-10 flex items-center justify-center gap-2 md:gap-8 w-full">
                        {!isActive && (
                            <button onClick={() => adjustTime(-5)} className="relative z-10 text-gray-300 hover:text-primary disabled:opacity-30" disabled={timeLeft <= 300}>
                                <MinusCircle className="size-8 md:size-12 fill-white" />
                            </button>
                        )}
                        <div 
                            onClick={() => {
                                if (!isActive) {
                                    setTempMinutes(Math.floor(timeLeft / 60));
                                    setIsTimeModalOpen(true);
                                }
                            }}
                            className={`text-6xl sm:text-[160px] md:text-[180px] font-black tracking-tighter text-gray-900 dark:text-white relative z-10 font-mono leading-none ${!isActive ? 'cursor-pointer hover:text-primary transition-colors' : ''}`}
                        >
                            {formatTime(timeLeft)}
                        </div>
                        {!isActive && (
                            <button onClick={() => adjustTime(5)} className="relative z-10 text-gray-300 hover:text-primary">
                                <PlusCircle className="size-8 md:size-12 fill-white" />
                            </button>
                        )}
                    </div>

                    <div className="flex gap-4 md:gap-6 relative z-10 w-full max-w-sm">
                        <button onClick={() => setIsActive(!isActive)} className={`flex-1 py-4 md:py-6 rounded-[24px] md:rounded-[32px] text-white font-black text-sm md:text-xl flex items-center justify-center gap-2 md:gap-3 shadow-2xl transition-all active:scale-95 ${isActive ? 'bg-gray-400' : 'bg-primary'}`}>
                            {isActive ? <Pause size={20} className="md:size-7" fill="white" /> : <Play size={20} className="md:size-7" fill="white" />}
                            {isActive ? "PAUSE" : "START"}
                        </button>
                        <button onClick={resetTimer} className="size-14 md:w-20 md:h-[inherit] rounded-[24px] md:rounded-[32px] bg-white border border-gray-200 text-gray-500 flex items-center justify-center shadow-xl active:scale-95 transition-all hover:bg-gray-50">
                            <RotateCcw className="size-6 md:size-7" />
                        </button>
                        <button onClick={toggleFullscreen} className="size-14 md:w-20 md:h-[inherit] rounded-[24px] md:rounded-[32px] bg-white border border-gray-200 text-gray-500 flex items-center justify-center shadow-xl active:scale-95 transition-all hover:bg-gray-50">
                            {isFullscreen ? <Minimize className="size-6 md:size-7" /> : <Maximize className="size-6 md:size-7" />}
                        </button>
                    </div>
                </div>

                {/* Character & Ambience */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 w-full">
                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 p-6 md:p-8 rounded-[40px] md:rounded-[48px] flex items-center gap-6">
                        <div className="relative shrink-0">
                            <img src={profileImage} alt="Companion" className="w-24 h-24 sm:w-32 sm:h-32 object-contain animate-float" style={{ filter: 'brightness(80%)' }} />
                            <div className="absolute -top-1 -right-1 bg-yellow-400 p-1.5 rounded-full shadow-lg"><Sparkles className="text-white" size={14} /></div>
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                {companionName} <Heart size={20} className="fill-pink-500 text-pink-500" />
                            </h3>
                            <div className="text-gray-500 dark:text-gray-400 font-bold italic text-xs sm:text-base">
                                {currentMode === 'Focus'
                                    ? <span>"ตั้งใจอ่านน้าเพื่อนจ๋า! <Sparkles size={14} className="text-yellow-500 inline" />"</span>
                                    : <span>"พักผ่อนให้เต็มที่นะ! <Sun size={14} className="text-orange-400 inline" />"</span>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 p-6 md:p-8 rounded-[40px] md:rounded-[48px] flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-6">
                            <Music className="text-primary" size={24} />
                            <h3 className="text-xl font-black text-gray-800 dark:text-white">Study Ambience</h3>
                        </div>
                        <div className="flex md:grid md:grid-cols-5 items-center gap-3 md:gap-4 overflow-x-auto md:overflow-x-visible no-scrollbar pb-4 md:pb-0 snap-x relative">
                            {ambiences.map(amb => (
                                <button
                                    key={amb.id}
                                    onClick={() => {
                                        setSelectedAmbience(amb.id)
                                        if (amb.youtubeId) {
                                            setYoutubeId(amb.youtubeId)
                                            setYoutubeUrl(`https://www.youtube.com/watch?v=${amb.youtubeId}`)
                                        } else if (amb.id === "YouTube") {
                                            setYoutubeId("")
                                            setYoutubeUrl("")
                                        }
                                    }}
                                    className={`flex flex-col items-center shrink-0 md:shrink-1 snap-start gap-2 md:gap-3 p-3 md:p-5 rounded-[24px] md:rounded-[32px] border transition-all min-w-[80px] md:min-w-[0] ${selectedAmbience === amb.id ? 'bg-primary/10 border-primary text-primary scale-105 shadow-lg' : 'bg-white/40 dark:bg-white/10 border-transparent hover:bg-white'}`}
                                >
                                    <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${amb.color} text-white shadow-sm`}><amb.icon size={20} className="md:size-6" /></div>
                                    <span className="text-[8px] md:text-xs font-black uppercase tracking-widest">{amb.id}</span>
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 dark:border-white/10">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Youtube size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="วางลิ้ง Youtube ตรงนี้จ้า..."
                                        className="w-full bg-white/50 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={youtubeUrl}
                                        onChange={(e) => setYoutubeUrl(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleYoutubeSubmit()}
                                    />
                                </div>
                                <button onClick={handleYoutubeSubmit} className="bg-red-500 text-white font-black px-6 py-3 rounded-2xl shadow-md active:scale-95">PLAY MUSIC</button>
                            </div>
                        </div>

                        {youtubeId && (
                            <div className="mt-6 rounded-2xl overflow-hidden aspect-video shadow-2xl border border-white/20">
                                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`} title="Music" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Alert Modal */}
            {customAlert.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl border border-white/20 p-8 flex flex-col items-center text-center">
                        <div className={`size-20 rounded-full mb-6 flex items-center justify-center ${customAlert.type === 'success' ? 'bg-emerald-100 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                            {customAlert.type === 'success' ? <CheckCircle2 size={40} /> : <AlertCircle size={40} />}
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">
                            {customAlert.type === 'success' ? "สำเร็จแล้วจ้า!" : "แจ้งเตือนเพื่อนรัก!"}
                        </h3>
                        <div className="text-gray-500 dark:text-gray-400 font-bold mb-8">{customAlert.message}</div>
                        <button onClick={() => setCustomAlert({ ...customAlert, isOpen: false })} className="w-full py-4 rounded-2xl bg-primary text-white font-black text-lg shadow-xl active:scale-95">ตกลงจ้า!</button>
                    </div>
                </div>
            )}

            {/* Time Adjustment Modal */}
            {isTimeModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[48px] overflow-hidden shadow-2xl border border-white/20 p-10 animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                <Timer className="text-primary" size={32}/> Set Time
                            </h3>
                            <button onClick={() => setIsTimeModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-all">
                                <HiOutlineX size={24} className="text-gray-400" />
                            </button>
                        </div>
                        
                        <div className="flex flex-col items-center gap-8 mb-10">
                            <div className="relative group">
                                <input 
                                    type="number"
                                    value={tempMinutes}
                                    onChange={(e) => setTempMinutes(parseInt(e.target.value) || 0)}
                                    className="w-40 bg-gray-50 dark:bg-white/5 border-4 border-gray-100 dark:border-white/10 rounded-[32px] py-8 text-center text-5xl font-black text-primary focus:outline-none focus:border-primary transition-all shadow-inner"
                                />
                                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-1 rounded-full text-[10px] font-black text-gray-400 border border-gray-100 dark:border-white/10 uppercase tracking-widest shadow-sm">Minutes</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-bold text-center text-sm px-4">
                                อยากจะโฟกัสกี่นาทีดีจ๊ะเพื่อนรัก? <br/>
                                <span className="text-xs opacity-70">ใส่เป็นตัวเลขนาทีนะ (เช่น 25, 45, 60)</span>
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setIsTimeModalOpen(false)}
                                className="flex-1 py-5 rounded-3xl bg-gray-100 dark:bg-white/10 text-gray-400 font-black text-lg hover:bg-gray-200 transition-all border border-transparent"
                            >
                                ยกเลิก
                            </button>
                            <button 
                                onClick={() => {
                                    if (tempMinutes > 0) {
                                        setManualTime(tempMinutes * 60);
                                        setIsTimeModalOpen(false);
                                    } else {
                                        alert("ใส่เวลาหน่อยนะจ๊ะ!");
                                    }
                                }}
                                className="flex-1 py-5 rounded-3xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all"
                            >
                                ตั้งค่าเวลา
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    )
}

export default ReadingSystem;