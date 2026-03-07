import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import broImg from "../../assets/Bro.png"
import girlImg from "../../assets/Girl.png"
import nerdImg from "../../assets/Nerd.1.2.png"

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

    return (
        <aside className="flex flex-col w-full lg:w-72 h-auto lg:h-full p-3 lg:p-4 bg-white/30 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/40 overflow-x-auto lg:overflow-y-auto z-40">
            <div className="flex flex-row lg:flex-col gap-4 lg:gap-6 items-center justify-center lg:justify-start lg:items-stretch">
                {/* Brand / Title - Hidden or smaller on mobile */}
                <div className="hidden lg:block px-2 pt-4">
                    <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                        AI BESTIES ✨
                    </h2>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                        เลือกคุยกับเพื่อนที่คุณชอบ
                    </p>
                </div>

                {/* Avatar Selection List - Horizontal on mobile, Vertical on desktop */}
                <div className="flex flex-row lg:flex-col gap-3 justify-center lg:justify-start overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide">
                    {avatars.map(a => (
                        <button
                            key={a.id}
                            onClick={() => navigate(`/chat/${a.id}`)}
                            className={`group flex items-center gap-3 lg:gap-4 p-2 lg:p-3.5 rounded-[20px] lg:rounded-[24px] border-2 transition-all duration-300 shrink-0
                            ${selectedAvatar === a.id
                                    ? `${a.glow} bg-white border-white scale-102`
                                    : "border-transparent bg-white/20 hover:bg-white/50 hover:scale-101"}
                            `}
                        >
                            <div className="relative">
                                <img
                                    src={a.image}
                                    className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full shadow-md transition-transform duration-500 group-hover:rotate-6
                                    ${selectedAvatar === a.id ? "ring-2 ring-primary/20 p-0.5" : ""}
                                    `}
                                    alt={a.name}
                                />
                                {selectedAvatar === a.id && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                                )}
                            </div>

                            <div className="flex flex-col items-start leading-tight">
                                <span className={`font-black text-xs lg:text-sm transition-colors
                                ${selectedAvatar === a.id ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"}
                                `}>
                                    {a.name}
                                </span>
                                <span className="hidden lg:inline text-[10px] font-bold text-gray-400">
                                    {selectedAvatar === a.id ? "กำลังคุยอยู่..." : "พร้อมแสตนบาย"}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Stats - Hidden on mobile to save space */}
                <div className="hidden lg:block mt-8 space-y-4">
                    <div className="bg-white/40 p-5 rounded-[28px] border border-white/60 shadow-sm transition-all hover:shadow-md">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider">พลังความสนิท</span>
                            <span className="text-[10px] font-bold text-gray-400">EXP 65%</span>
                        </div>
                        <div className="h-2.5 w-full bg-gray-200/50 rounded-full overflow-hidden p-0.5 border border-white/50">
                            <div className="h-full w-[65%] bg-gradient-to-r from-pink-400 to-purple-400 rounded-full shadow-sm"></div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 p-5 rounded-[28px] border border-white/60 text-center">
                        <p className="text-[11px] font-bold text-gray-500 italic">"คุยกับ AI บ่อยๆ <br /> เพื่อปลดล็อคชุดใหม่ๆ นะ 🌷"</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default ChatSidebar
