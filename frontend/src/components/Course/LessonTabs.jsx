import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, ShieldCheck, Sparkles, Star, ChevronRight } from "lucide-react"

const ranks = [
    { key: "bronze", name: "Bronze", tier: "Junior", exp: "0 XP", benefit: "Normal", color: "from-amber-700/40 to-amber-900/40", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368522/Broze_xwm5gg.png" },
    { key: "silver", name: "Silver", tier: "Junior", exp: "50 XP", benefit: "Normal", color: "from-slate-400/40 to-slate-600/40", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368517/Sliver_ea2lid.png" },
    { key: "gold", name: "Gold", tier: "Senior", exp: "150 XP", benefit: "+0.5x Bonus", color: "from-yellow-400/40 to-yellow-600/40", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368525/Gold_bglivb.png" },
    { key: "platinum", name: "Platinum", tier: "Senior", exp: "300 XP", benefit: "+1.0x Bonus", color: "from-teal-400/40 to-teal-600/40", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368536/Plat_rakik4.png" },
    { key: "diamond", name: "Diamond", tier: "Elite", exp: "500 XP", benefit: "+1.2x Bonus", color: "from-blue-400/40 to-blue-600/40", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368517/Diamond_gjekkx.png" },
    { key: "master", name: "Master", tier: "Elite", exp: "800 XP", benefit: "+1.5x Bonus", color: "from-purple-400/40 to-purple-600/40", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368537/Master_ypfzxo.png" },
    { key: "legend", name: "Legend", tier: "Legendary", exp: "1200 XP", benefit: "+2.0x Bonus", color: "from-red-500/40 to-red-800/40", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368533/Legen_vts5jo.png" },
]

export default function RankingSystem() {
    const navigate = useNavigate()
    const [active, setActive] = useState("gold")
    const activeRank = ranks.find(r => r.key === active)

    return (
        <div className="w-full max-w-6xl mx-auto py-10 md:py-20 px-4 mt-6 md:mt-10">
            {/* Header - Simplified for Mobile */}
            <div className="text-center mb-10 md:mb-16">
                <div className="hidden md:inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white font-black text-sm tracking-[.3em] uppercase mb-4">
                    <Trophy className="text-yellow-500" size={16}/> Path of Glory
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white">
                    Ranking <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">LEGEND</span>
                </h2>
                <p className="hidden md:block text-gray-500 dark:text-gray-400 mt-4 font-bold max-w-2xl mx-auto">
                    สะสม EXP จากการทำภารกิจเพื่อเลื่อนระดับและรับสิทธิพิเศษมากมาย ✨
                </p>
            </div>

            <div className="flex flex-col gap-6 max-w-5xl mx-auto md:scale-80 origin-top">
                
                {/* 1. Rank Selection (All visible on mobile) */}
                <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 bg-white/5 dark:bg-black/10 backdrop-blur-3xl p-3 rounded-[32px] border border-white/10 shadow-lg">
                    {ranks.map((rank) => {
                        const isActive = rank.key === active
                        return (
                            <motion.button
                                key={rank.key}
                                onClick={() => setActive(rank.key)}
                                className={`relative group flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all duration-500 min-w-[65px] md:min-w-[90px] ${
                                    isActive 
                                    ? "bg-white dark:bg-white/10 shadow-lg scale-105 z-20 border border-emerald-400/30" 
                                    : "opacity-40 hover:opacity-100"
                                }`}
                            >
                                <div className={`size-8 md:size-12 rounded-lg md:rounded-xl bg-gradient-to-br ${rank.color} flex items-center justify-center p-1 shadow-inner`}>
                                    <img src={rank.img} className="w-full h-full object-contain" alt={rank.name} />
                                </div>
                                <h4 className={`font-black text-[8px] uppercase tracking-tighter ${isActive ? "text-emerald-500" : "text-gray-400"}`}>
                                    {rank.name}
                                </h4>
                            </motion.button>
                        )
                    })}
                </div>

                {/* 2. Main Content - Redesigned for Mobile (No Clutter) */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[40px] md:rounded-[48px] border border-white/20 p-6 md:p-10 shadow-xl overflow-hidden">
                    
                    {/* Visual Preview Box - Hidden on Mobile to reduce "รก" */}
                    <div className="hidden lg:flex relative aspect-[3/2] rounded-[40px] bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-hidden shadow-2xl flex items-center justify-center group ring-1 ring-white/10">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-primary blur-3xl" />
                        
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                initial={{ y: 20, opacity: 0, scale: 0.9 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: -20, opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 100 }}
                                className="relative z-10 flex flex-col items-center"
                            >
                                <img 
                                    src={activeRank.img} 
                                    className="w-44 h-44 object-contain drop-shadow-2xl mb-2"
                                    alt={activeRank.name} 
                                />
                                <div className="text-center -mt-4">
                                    <div className="inline-block px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white/40 tracking-widest uppercase mb-1">
                                        LEVEL ACHIEVED
                                    </div>
                                    <h3 className={`text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r ${
                                        active === 'bronze' ? 'from-amber-700 to-amber-500' :
                                        active === 'gold' ? 'from-yellow-600 to-yellow-300' :
                                        'from-primary to-pink-300'
                                    } uppercase`}>
                                        {activeRank.name}
                                    </h3>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Info & Rewards Column - Focused Mobile View */}
                    <div className="flex flex-col justify-center space-y-6">
                        {/* Mobile Only: Show current Rank Icon simply */}
                        <div className="lg:hidden flex items-center gap-4 mb-2">
                            <div className={`p-4 rounded-3xl bg-gradient-to-br ${activeRank.color} shadow-lg shadow-black/5`}>
                                <img src={activeRank.img} className="size-16 object-contain" alt={activeRank.name} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic">{activeRank.name}</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Season 01 Status</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase leading-tight tracking-tight">
                                NEXT <span className="text-emerald-400 italic">BONUS</span> FOR YOU
                            </h2>
                            <p className="hidden md:block text-xs text-gray-500 dark:text-gray-400 font-bold leading-relaxed max-w-xs">
                                {activeRank.name} Tier คือจุดพิสูจน์ความตั้งใจของคุณ ระบบจะมอบสิทธิพิเศษที่เหนือกว่าให้ผู้ที่สม่ำเสมอ! ✨
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-[24px] bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 text-center">
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Target</p>
                                <p className="text-lg font-black text-gray-700 dark:text-emerald-400 whitespace-nowrap">{activeRank.exp}</p>
                            </div>
                            <div className="p-4 rounded-[24px] bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 text-center">
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Benefit</p>
                                <p className="text-lg font-black text-emerald-500">{activeRank.benefit}</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate("/todo")}
                            className="w-full p-4 bg-[#99d9ca] hover:bg-[#88c9ba] text-white rounded-[24px] flex items-center justify-between group shadow-lg shadow-emerald-200/20 transition-all active:scale-95"
                        >
                            <span className="font-black text-xs ml-4 tracking-[0.2em]">GO MISSION</span>
                            <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center transition-all group-hover:px-2">
                                <ChevronRight size={18} strokeWidth={4}/>
                            </div>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    )
}
