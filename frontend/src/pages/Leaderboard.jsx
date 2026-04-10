import React, { useEffect, useState } from "react";
import { fetchLeaderboard } from "../services/aiService";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Layout/Navbar";
import { ASSETS } from "../config/assets";
import { Trophy, Crown, Star, Flame, Award } from "lucide-react";

const GirlIcon = ASSETS.AVATARS.GIRL;
const BroIcon = ASSETS.AVATARS.BRO;
const NerdIcon = ASSETS.AVATARS.NERD2;

const Leaderboard = () => {
    const { t } = useTranslation();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard()
            .then(setLeaders)
            .finally(() => setLoading(false));
    }, []);

    const getAvatarIcon = (avatarName) => {
        const map = { girl: GirlIcon, nerd: NerdIcon, bro: BroIcon };
        return map[avatarName?.toLowerCase()] || BroIcon;
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const top3 = leaders.slice(0, 3);
    const others = leaders.slice(3);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] font-display relative overflow-hidden transition-colors duration-300">
             {/* Dynamic Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px]" />
            </div>

            <div className="flex flex-col min-h-screen relative z-10">
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

                <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8 md:py-16">
                    <div className="text-center mb-20">
                         <motion.div 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 mb-6"
                        >
                            <Flame className="text-primary" size={14} />
                            <span className="text-[10px] font-black text-primary tracking-widest uppercase">Hall of Fame</span>
                        </motion.div>
                        <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none mb-4">
                            เหล่าคนเทพ <br/>
                            <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-600 bg-clip-text text-transparent">แห่ง APM AI</span>
                        </h2>
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
                                    <p className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight text-lg">{user.username}</p>
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
        </div>
    );
};

export default Leaderboard;
