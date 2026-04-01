import React, { useState } from "react"
import { HiOutlinePlus, HiOutlineEmojiHappy, HiOutlineCamera } from "react-icons/hi"
import { Trash2, CheckCircle2, Circle, Upload, X, Trophy } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Layout/Navbar"
import Footer from "../components/Layout/footer"
import CoinBadge from "../components/UI/CoinBadge"
import { useCoins } from "../hooks/useCoins"
import Logo from "../assets/logo.png"
import BroIcon from "../assets/Bro.png"
import NerdIcon from "../assets/Nerd.1.2.png"
import CuteGirlIcon from "../assets/Girl.png"

const TodoList = () => {
    const navigate = useNavigate()
    const { addCoins } = useCoins()
    const [tasks, setTasks] = useState([
        { id: 1, text: "ทำการบ้านฟิสิกส์ ข้อ 1-5", completed: false, priority: "High" },
        { id: 2, text: "อ่านหนังสือสอบ Midterm Computer Arch", completed: true, priority: "Medium" },
    ])
    const [newTask, setNewTask] = useState("")
    const [showProofModal, setShowProofModal] = useState(false)
    const [activeTaskId, setActiveTaskId] = useState(null)
    const [isUploading, setIsUploading] = useState(false)

    const addTask = (e) => {
        e.preventDefault()
        if (!newTask.trim()) return
        setTasks([...tasks, { id: Date.now(), text: newTask, completed: false, priority: "Normal" }])
        setNewTask("")
    }

    const openProofDialog = (id) => {
        setActiveTaskId(id)
        setShowProofModal(true)
    }

    const completeWithProof = () => {
        setIsUploading(true)
        // Simulate upload & verification
        setTimeout(() => {
            setTasks(tasks.map(t => t.id === activeTaskId ? { ...t, completed: true } : t))
            addCoins(1) // ใช้ระบบเหรียญส่วนกลาง
            setShowProofModal(false)
            setIsUploading(false)
            setActiveTaskId(null)
        }, 1500)
    }

    const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id))
    }

    const [profileImage] = useState(() => {
        const savedAvatar = localStorage.getItem("avatar") || "bro"
        const map = { girl: CuteGirlIcon, nerd: NerdIcon, bro: BroIcon }
        return map[savedAvatar.toLowerCase()] || BroIcon
    })

    const companionName = localStorage.getItem("avatar") || "Bro"

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col transition-colors duration-300">
            <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-xl">
                <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-4 py-4 sm:px-6">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => navigate("/")}>
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-2xl bg-white/20 ring-2 ring-pink-300/50 shadow-md">
                            <img src={Logo} alt="Logo" className="h-full w-full object-cover" />
                        </div>
                        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white hidden sm:block">APM Quest</h1>
                    </div>

                    {/* Center: Navbar */}
                    <div className="hidden lg:flex flex-1 justify-center px-4">
                        <Navbar />
                    </div>

                    {/* Right: Actions */}
                    <div className="flex justify-end items-center gap-4 shrink-0">
                        <CoinBadge />
                        <img src={profileImage} className="size-10 rounded-full border-2 border-primary shadow-sm ml-2" />
                        <div className="lg:hidden"><Navbar /></div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-4xl mx-auto py-12 px-6">
                {/* Stats Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="md:col-span-2 flex items-center gap-8 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 p-10 rounded-[40px] shadow-xl">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-100 group-hover:scale-110 transition-transform" />
                            <img src={profileImage} alt="Avatar" className="w-28 h-28 object-contain relative z-10 animate-float" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">ทำเควสกันเถอะ! 🎮</h2>
                            <p className="text-gray-500 dark:text-gray-400 font-bold italic leading-relaxed">
                                "ส่งหลักฐานว่าทำเควสเสร็จแล้ว รับทอง 1 เหรียญทันทีจ๊ะ {companionName} รอดูรูปอยู่นะ! ✨"
                            </p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-primary to-purple-600 p-10 rounded-[40px] shadow-xl text-white flex flex-col justify-center items-center text-center">
                        <Trophy size={48} className="mb-4 text-yellow-300 animate-pulse" />
                        <h3 className="text-sm font-black uppercase tracking-widest opacity-80">Rank: Rookie</h3>
                        <div className="text-3xl font-black mt-2">Next reward: 5 Coins</div>
                    </div>
                </div>

                {/* Input Section */}
                <form onSubmit={addTask} className="relative mb-12 group">
                    <input 
                        type="text" 
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="เพิ่มเควสใหม่ที่อยากทำวันนี้..."
                        className="w-full px-10 py-6 rounded-[32px] bg-white/60 dark:bg-white/10 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-sm focus:shadow-2xl focus:border-primary/40 focus:bg-white dark:focus:bg-white/20 outline-none font-bold text-lg text-gray-800 dark:text-white transition-all pr-40"
                    />
                    <button type="submit" className="absolute right-4 top-4 bottom-4 px-10 rounded-2xl bg-primary text-white font-black text-sm shadow-xl active:scale-95 transition-all hover:bg-primary/90 flex items-center gap-2">
                        <HiOutlinePlus size={20} /> เพิ่มเควส
                    </button>
                </form>

                {/* List Section */}
                <div className="space-y-4">
                    {tasks.map(task => (
                        <div key={task.id} className={`group flex items-center gap-6 p-6 rounded-[32px] border transition-all duration-300 ${task.completed ? 'bg-white/20 border-transparent opacity-60' : 'bg-white/60 dark:bg-white/5 border-white/60 dark:border-white/10 hover:shadow-2xl hover:-translate-y-1'}`}>
                            <div className={`size-10 rounded-2xl flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-400'}`}>
                                {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                            </div>
                            <div className="flex-1">
                                <span className={`font-black text-xl block ${task.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                                    {task.text}
                                </span>
                                <span className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-1 block">Reward: 1 Coin + 20 XP</span>
                            </div>
                            
                            {!task.completed && (
                                <button 
                                    onClick={() => openProofDialog(task.id)}
                                    className="px-6 py-3 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-sm flex items-center gap-2 hover:bg-emerald-500 hover:text-white transition-all"
                                >
                                    <HiOutlineCamera size={18} /> ส่งหลักฐาน!
                                </button>
                            )}

                            <button onClick={() => deleteTask(task.id)} className="p-4 bg-red-50 dark:bg-red-500/10 text-red-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="py-24 text-center bg-white/30 dark:bg-white/5 rounded-[48px] border border-dashed border-gray-300 dark:border-white/20">
                            <HiOutlineEmojiHappy size={80} className="mx-auto text-gray-300 mb-6" />
                            <h3 className="text-2xl font-black text-gray-400">ว่างงานเฉยเล้ยยย เพิ่มเควสใหม่เร็ว! 🕹️</h3>
                        </div>
                    )}
                </div>
            </main>

            {/* Proof Modal */}
            {showProofModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 size-40 bg-primary/20 rounded-full blur-3xl" />
                        <button onClick={() => setShowProofModal(false)} className="absolute top-6 right-6 p-3 bg-gray-100 dark:bg-white/10 rounded-2xl hover:bg-red-100 hover:text-red-500 transition-colors">
                            <X size={20} />
                        </button>

                        <div className="text-center mb-8">
                            <div className="size-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                                <Upload className="text-emerald-500" size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">เควสใกล้เสร็จแล้ว!</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-bold italic text-center">"อัปโหลดรูปภาพงานที่ทำเสร็จแล้ว <br /> เพื่อรับเหรียญจาก {companionName} นะ ✨"</p>
                        </div>

                        <div className="space-y-6">
                            <div className="border-4 border-dashed border-gray-200 dark:border-white/10 rounded-[32px] p-12 text-center relative group hover:border-primary/50 transition-colors cursor-pointer">
                                <HiOutlineCamera size={48} className="mx-auto text-gray-300 mb-4 group-hover:text-primary transition-colors" />
                                <span className="block font-black text-gray-400 group-hover:text-primary">คลิกเพื่อเลือกรูปภาพ</span>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>

                            <button 
                                onClick={completeWithProof}
                                disabled={isUploading}
                                className="w-full py-5 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                            >
                                {isUploading ? "กำลังตรวจสอบ..." : "ยืนยันและรับทอง 🪙"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default TodoList
