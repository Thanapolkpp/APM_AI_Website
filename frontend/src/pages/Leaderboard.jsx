import React, { useEffect, useState } from "react";
import { fetchLeaderboard } from "../services/aiService";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Layout/Navbar";
import { ASSETS } from "../config/assets";
import { Trophy, Crown, Star, Flame, Award } from "lucide-react";
import RankInfoModal from "../components/UI/RankInfoModal";

const GirlIcon = ASSETS.AVATARS.GIRL;
const BroIcon = ASSETS.AVATARS.BRO;
const NerdIcon = ASSETS.AVATARS.NERD2;

const Leaderboard = () => {
    const { t } = useTranslation();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        fetchLeaderboard()
            .then(setLeaders)
            .finally(() => setLoading(false));
    }, []);

    const getAvatarIcon = (avatarName) => {
        const name = avatarName?.toLowerCase();
        const map = { 
            girl: GirlIcon, 
            bestie: GirlIcon, 
            nerd: NerdIcon, 
            genius: NerdIcon, 
            bro: BroIcon 
        };
        return map[name] || BroIcon;
    };

    const getLevelInfo = (totalExp) => {
        const thresholds = [0, 50, 150, 300, 500, 800, 1200];
        let level = 1;
        for (let i = 0; i < thresholds.length; i++) {
            if (totalExp >= thresholds[i]) level = i + 1;
            else break;
        }
        return level;
    };

    const getRankImg = (lvl) => {
        const imgs = {
            1: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368522/Broze_xwm5gg.png",
            2: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368517/Sliver_ea2lid.png",
            3: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368525/Gold_bglivb.png",
            4: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368536/Plat_rakik4.png",
            5: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368517/Diamond_gjekkx.png",
            6: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368537/Master_ypfzxo.png",
            7: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368533/Legen_vts5jo.png",
        };
        return imgs[lvl] || imgs[1];
    };

    const getRankName = (lvl) => {
        const names = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "LEGEND"];
        return names[lvl - 1] || "BRONZE";
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const top3 = leaders.slice(0, 3);
    const others = leaders.slice(3);

    const currentUser = leaders.find(u => u.username === localStorage.getItem("username"));
    const currentLvl = currentUser ? getLevelInfo(currentUser.exp) : 1;

    const ranksData = [
        { name: "BRONZE", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368522/Broze_xwm5gg.png" },
        { name: "SILVER", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368517/Sliver_ea2lid.png" },
        { name: "GOLD", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368525/Gold_bglivb.png" },
        { name: "PLATINUM", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368536/Plat_rakik4.png" },
        { name: "DIAMOND", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368517/Diamond_gjekkx.png" },
        { name: "MASTER", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368537/Master_ypfzxo.png" },
        { name: "LEGEND", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368533/Legen_vts5jo.png" }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] font-display relative overflow-hidden transition-colors duration-300">
             {/* Dynamic Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px]" />
            </div>

            <div className="flex flex-col min-h-screen relative z-0">
                <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl py-4 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="size-10 rounded-xl bg-gradient-to-tr from-primary to-pink-500 flex items-center justify-center shadow-lg shadow-primary/20">
                            <Trophy className="text-white" size={20} />
                        </div>
                        <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">Ranking</h1>
                    </div>
                    <div className="hidden lg:block">
                        <Navbar />
                    </div>
                    <button onClick={() => window.history.back()} className="lg:hidden text-slate-500 font-bold p-2">
                         <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                </header>

                <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 md:py-16">
                        {/* PATH OF GLORY Label */}
                        <motion.div 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex items-center justify-center gap-2 mb-4"
                        >
                            <Trophy className="text-yellow-500" size={16}/>
                            <span className="text-[12px] font-black text-slate-900 dark:text-white tracking-[0.4em] uppercase">
                                {t("rank.path_of_glory")}
                            </span>
                        </motion.div>

                        {/* Rank Title */}
                        <div className="relative mb-12">
                            <h2 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter uppercase relative z-10 flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
                                <span>{getRankName(currentLvl)}</span>
                                <span className="bg-gradient-to-r from-teal-300 via-blue-400 to-pink-500 bg-clip-text text-transparent opacity-80">
                                    {getRankName(currentLvl)}
                                </span>
                            </h2>
                        </div>

                        {/* Ranks Row Inside Pill Container */}
                        <div className="max-w-4xl mx-auto mb-16 px-4">
                            <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/5 rounded-[3rem] p-4 shadow-xl flex items-center justify-center gap-2 md:gap-8 overflow-x-auto no-scrollbar">
                                {ranksData.map((rank, idx) => {
                                    const isActive = currentLvl === (idx + 1);
                                    return (
                                        <button 
                                            key={idx} 
                                            onClick={() => setIsMenuOpen(true)}
                                            className={`flex flex-col items-center gap-1.5 min-w-[60px] md:min-w-[80px] p-2 rounded-3xl transition-all hover:scale-105 active:scale-95 ${isActive ? 'bg-white dark:bg-slate-800 shadow-lg ring-2 ring-emerald-400/30 scale-110' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100'}`}
                                        >
                                            <div className={`size-10 md:size-12 rounded-2xl flex items-center justify-center p-1.5 ${isActive ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-gray-100 dark:bg-slate-800'}`}>
                                                <img src={rank.img} alt={rank.name} className="w-full h-full object-contain" />
                                            </div>
                                            <span className={`text-[8px] font-black tracking-widest ${isActive ? 'text-emerald-500' : 'text-gray-400'}`}>
                                                {rank.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>


                    {/* Podium Area */}
                    <div className="flex justify-center items-end gap-3 md:gap-12 mb-24 px-2">
                        {/* 2nd Place */}
                        {top3[1] && (
                            <motion.div 
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col items-center flex-1 max-w-[120px] md:max-w-[150px]"
                            >
                                <div className="relative mb-6">
                                    <div className="size-20 md:size-24 rounded-[2rem] bg-white dark:bg-slate-800 border-4 border-slate-300 shadow-xl overflow-hidden group">
                                        <img src={getAvatarIcon(top3[1].equipped_avatar)} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Rank 2" />
                                    </div>
                                    <div className="absolute -top-3 -right-3 size-10 rounded-2xl bg-slate-300 flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800">
                                        <span className="font-black text-slate-700">2</span>
                                    </div>
                                </div>
                                <p className="font-black text-slate-700 dark:text-slate-300 text-sm md:text-base uppercase truncate w-full text-center">{top3[1].username}</p>
                                <div className="mt-1 flex items-center gap-1.5">
                                    <img src={getRankImg(getLevelInfo(top3[1].exp))} className="size-4 object-contain" alt="rank" />
                                    <span className="text-[10px] font-black text-slate-400">{top3[1].exp} XP</span>
                                </div>
                                <div className="w-full h-20 md:h-28 mt-4 bg-gradient-to-b from-slate-200 dark:from-slate-800 to-transparent rounded-t-2xl opacity-40" />
                            </motion.div>
                        )}

                        {/* 1st Place */}
                        {top3[0] && (
                            <motion.div 
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="flex flex-col items-center z-20 flex-1 max-w-[150px] md:max-w-[200px]"
                            >
                                <div className="relative mb-8 pt-8">
                                    {/* Deity Badge */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30">
                                        <motion.div
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                            className="px-5 py-1.5 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 rounded-full shadow-[0_10px_20px_rgba(245,158,11,0.3)] border-2 border-white text-center"
                                        >
                                            <span className="text-[11px] font-black text-amber-900 uppercase tracking-tighter">มหาเทพ</span>
                                        </motion.div>
                                    </div>
                                    
                                    <div className="relative">
                                        <Crown size={40} className="absolute -top-10 left-1/2 -translate-x-1/2 text-amber-500 drop-shadow-lg z-20 animate-bounce" />
                                        <div className="size-28 md:size-36 rounded-[3rem] bg-white dark:bg-slate-800 border-4 border-amber-400 shadow-[0_20px_50px_rgba(245,158,11,0.25)] overflow-hidden">
                                            <img src={getAvatarIcon(top3[0].equipped_avatar)} className="w-full h-full object-cover" alt="Rank 1" />
                                        </div>
                                        <div className="absolute -top-4 -right-4 size-12 md:size-14 rounded-3xl bg-amber-400 flex items-center justify-center shadow-xl border-4 border-white dark:border-slate-800 z-30">
                                            <span className="font-black text-white text-xl">1</span>
                                        </div>
                                        {/* Glow Aura */}
                                        <div className="absolute inset-0 bg-amber-400 blur-3xl opacity-20 -z-10 animate-pulse" />
                                    </div>
                                </div>
                                <p className="font-black text-slate-900 dark:text-white text-lg md:text-2xl uppercase italic tracking-tight truncate w-full text-center">{top3[0].username}</p>
                                <div className="mt-2 flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-black/20 rounded-full border border-amber-200/50 shadow-sm">
                                    <img src={getRankImg(getLevelInfo(top3[0].exp))} className="size-5 md:size-6 object-contain" alt="rank" />
                                    <span className="text-xs md:text-sm font-black text-amber-600 dark:text-amber-400">{top3[0].exp} XP</span>
                                </div>
                                <div className="w-full h-28 md:h-40 mt-4 bg-gradient-to-b from-amber-400 dark:from-amber-600 to-transparent rounded-t-3xl opacity-30 shadow-inner" />
                            </motion.div>
                        )}

                        {/* 3rd Place */}
                        {top3[2] && (
                            <motion.div 
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col items-center flex-1 max-w-[120px] md:max-w-[150px]"
                            >
                                <div className="relative mb-6">
                                    <div className="size-20 md:size-24 rounded-[2rem] bg-white dark:bg-slate-800 border-4 border-amber-700/40 shadow-xl overflow-hidden">
                                        <img src={getAvatarIcon(top3[2].equipped_avatar)} className="w-full h-full object-cover" alt="Rank 3" />
                                    </div>
                                    <div className="absolute -top-3 -right-3 size-10 rounded-2xl bg-amber-700/80 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800">
                                        <span className="font-black">3</span>
                                    </div>
                                </div>
                                <p className="font-black text-slate-700 dark:text-slate-300 text-sm md:text-base uppercase truncate w-full text-center">{top3[2].username}</p>
                                <div className="mt-1 flex items-center gap-1.5">
                                    <img src={getRankImg(getLevelInfo(top3[2].exp))} className="size-4 object-contain" alt="rank" />
                                    <span className="text-[10px] font-black text-slate-400">{top3[2].exp} XP</span>
                                </div>
                                <div className="w-full h-16 md:h-20 mt-4 bg-gradient-to-b from-amber-800/20 dark:from-amber-800/40 to-transparent rounded-t-2xl opacity-40" />
                            </motion.div>
                        )}
                    </div>

                    {/* Minimalist Rankings List */}
                    <div className="max-w-2xl mx-auto space-y-4">
                        {others.map((user, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-5 bg-white dark:bg-slate-800/50 p-4 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="w-8 font-black text-slate-300 dark:text-slate-600 text-xl italic ml-2">
                                    {idx + 4}
                                </div>
                                <div className="size-14 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-inner bg-slate-50 shrink-0">
                                    <img src={getAvatarIcon(user.equipped_avatar)} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="User" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight text-lg leading-none">{user.username}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                         <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/5">
                                            <span className="text-[10px] font-black text-slate-500">{user.exp} XP</span>
                                         </div>
                                         <div className="flex items-center gap-1">
                                            <img src={getRankImg(getLevelInfo(user.exp))} className="size-4 object-contain opacity-80" alt="rank" />
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{getRankName(getLevelInfo(user.exp))}</span>
                                         </div>
                                    </div>
                                </div>
                                <div className="px-4 opacity-20 group-hover:opacity-100 transition-opacity">
                                     <Award size={20} className="text-slate-400" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-24 text-center">
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                            {t("leaderboard.subtitle")}
                        </p>
                    </div>
                </main>
            </div>
            
            <style jsx>{`
                .italic { font-style: italic; }
            `}</style>

            <RankInfoModal 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
            />
        </div>
    );
};

export default Leaderboard;
