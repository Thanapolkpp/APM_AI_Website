import React from "react"
import { createPortal } from "react-dom"
import { useNavigate, useParams } from "react-router-dom"
import { ASSETS } from "../../config/assets";

const broImg = ASSETS.AVATARS.BRO;
const girlImg = ASSETS.AVATARS.GIRL;
const nerdImg = ASSETS.AVATARS.NERD2; // Default Nerd
import { Lock, Sparkles, History as HistoryIcon, Heart } from "lucide-react"
import { getUserProfile, fetchChatHistory, fetchOwnedAvatars } from "../../services/aiService"

const ChatSidebar = () => {
    const navigate = useNavigate()
    const { mode: selectedAvatar } = useParams()

    const avatars = [
        {
            id: "bro",
            name: "Bro",
            image: broImg,
            glow: "border-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.3)]",
        },
        {
            id: "girl",
            name: "Girl",
            image: girlImg,
            glow: "border-pink-300 shadow-[0_0_20px_rgba(244,114,182,0.3)]",
        },
        {
            id: "nerd",
            name: "Nerd",
            image: nerdImg,
            glow: "border-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.3)]",
        }
    ]

    const [history, setHistory] = React.useState([])
    const [selectedHistory, setSelectedHistory] = React.useState(null)
    const [exp, setExp] = React.useState(0)

    React.useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) return

        const fetchData = async () => {
            try {
                const [historyData, profileData] = await Promise.all([
                    fetchChatHistory(),
                    getUserProfile()
                ])
                setHistory(historyData)
                setExp(profileData.exp ?? 0)
            } catch (err) {
                console.error("Failed to fetch sidebar data", err)
            }
        }

        fetchData()
    }, [])

    const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200]
    const getLevel = (exp) => LEVEL_THRESHOLDS.filter(t => exp >= t).length
    const getLevelProgress = (exp) => {
        const lvl = getLevel(exp)
        if (lvl >= LEVEL_THRESHOLDS.length) return 100
        const from = LEVEL_THRESHOLDS[lvl - 1]
        const to = LEVEL_THRESHOLDS[lvl]
        return Math.round(((exp - from) / (to - from)) * 100)
    }

    const handleAvatarClick = (id) => {
        navigate(`/chat/${id}`)
    }

    return (
        <aside className="flex flex-col w-full lg:w-80 h-auto lg:h-full p-3 lg:p-4 bg-white/30 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/40 overflow-x-auto lg:overflow-y-auto z-40">
            <div className="flex flex-row lg:flex-col gap-4 lg:gap-6 items-center lg:items-stretch h-full">
                {/* Brand / Title */}
                <div className="hidden lg:block px-2 pt-2">
                    <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                        AI BESTIES ✨
                    </h2>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                        เลือกเพื่อนที่คุณชอบ
                    </p>
                </div>

                {/* Avatar Selection List */}
                <div className="flex flex-row lg:flex-col gap-3 justify-center lg:justify-start overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide">
                    {avatars.map(a => {
                        return (
                            <button
                                key={a.id}
                                onClick={() => handleAvatarClick(a.id)}
                                className={`group flex items-center gap-3 lg:gap-4 p-2 lg:p-3 rounded-[20px] lg:rounded-[22px] border-2 transition-all duration-300 shrink-0 relative overflow-hidden
                                ${selectedAvatar === a.id
                                        ? `${a.glow} bg-white border-white scale-102`
                                        : "border-transparent bg-white/20 hover:bg-white/50 hover:scale-101"}
                                `}
                            >
                                <div className="relative">
                                    <img
                                        src={a.image}
                                        className={`w-9 h-9 lg:w-10 lg:h-10 rounded-full shadow-md transition-transform duration-500 group-hover:rotate-6
                                        ${selectedAvatar === a.id ? "ring-2 ring-primary/20 p-0.5" : ""}
                                        `}
                                        alt={a.name}
                                    />
                                </div>
                                <div className="flex flex-col items-start leading-tight">
                                    <span className={`font-black text-xs lg:text-sm transition-colors flex items-center gap-1.5
                                    ${selectedAvatar === a.id ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"}
                                    `}>
                                        {a.name}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* --- ส่วนใหม่: ประวัติการคุย 3 อันล่าสุด --- */}
                <div className="hidden lg:flex flex-col mt-4 space-y-4 flex-1">
                    <div className="px-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">ความทรงจำล่าสุด 💌</span>
                    </div>
                    
                    <div className="space-y-3">
                        {history.length > 0 ? (
                            history.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => {
                                        const targetMode = item.mode || "bro";
                                        navigate(`/chat/${targetMode}`);
                                        
                                        // หน่วงเวลาเล็กน้อยเพื่อให้ ChatWindow อัปเดตโหมดตาม URL ก่อน
                                        setTimeout(() => {
                                            const event = new CustomEvent("loadSelectedHistory", { detail: item });
                                            window.dispatchEvent(event);
                                        }, 50);
                                    }}
                                    className={`bg-white/40 p-4 rounded-[24px] border border-white/60 shadow-sm transition-all hover:translate-x-1 cursor-pointer
                                        ${item.mode === "bro" ? "hover:bg-blue-50 hover:border-blue-200" 
                                        : item.mode === "nerd" ? "hover:bg-emerald-50 hover:border-emerald-200" 
                                        : "hover:bg-pink-50 hover:border-pink-200"}`}
                                >
                                    <div className="flex gap-2 items-center mb-2">
                                        <div className={`w-1.5 h-1.5 rounded-full 
                                            ${item.mode === "bro" ? "bg-blue-400" 
                                            : item.mode === "nerd" ? "bg-emerald-400" 
                                            : "bg-pink-400"}`}
                                        ></div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider
                                            ${item.mode === "bro" ? "text-blue-400" 
                                            : item.mode === "nerd" ? "text-emerald-500" 
                                            : "text-pink-400"}`}
                                        >
                                            {item.mode || "GIRL"}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400 ml-auto">
                                            {item.created_at ? new Date(item.created_at).toLocaleDateString('th-TH') : "ล่าสุด"}
                                        </span>
                                    </div>
                                    <p className="text-[12px] font-bold text-gray-700 line-clamp-2 leading-relaxed italic">
                                        "{item.user_message}"
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-400">
                                <span className="material-symbols-outlined text-3xl opacity-30 block mb-2">auto_stories</span>
                                <p className="text-[10px] font-bold">ยังไม่มีความทรงจำใหม่ๆ</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="hidden lg:block mt-auto pb-4 space-y-4">
                    <div className="bg-white/40 p-4 rounded-[28px] border border-white/60 shadow-sm transition-all hover:shadow-md">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider">พลังความสนิท</span>
                            <span className="text-[10px] font-bold text-gray-400">Lv.{getLevel(exp)} — {exp} XP</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200/50 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full shadow-sm transition-all duration-700"
                                style={{ width: `${getLevelProgress(exp)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default ChatSidebar
