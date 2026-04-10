import React, { useEffect, useState } from "react";
import { fetchLeaderboard } from "../services/aiService";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Layout/Navbar";
import { ASSETS } from "../config/assets";
import { Trophy, Medal, Crown, Star, Flame } from "lucide-react";

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
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const top3 = leaders.slice(0, 3);
    const others = leaders.slice(3);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display relative overflow-hidden transition-colors duration-300">
             {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[10%] size-[30rem] bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-[110px]" />
                <div className="absolute bottom-[20%] right-[10%] size-[30rem] bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full blur-[110px]" />
            </div>

            <div className="flex flex-col min-h-screen relative z-10 w-full max-w-7xl mx-auto md:px-6">
                <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-xl py-4 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="size-10 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center shadow-lg">
                            <Trophy className="text-white" size={20} />
                        </div>
                        <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Ranking</h1>
                    </div>
                    <div className="hidden md:block">
                        <Navbar />
                    </div>
                    <div className="md:hidden">
                        <Navbar />
                    </div>
                </header>

                <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
                    <div className="text-center mb-16">
                         <motion.div 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white dark:border-white/10 shadow-sm mb-6"
                        >
                            <Flame className="text-orange-500" size={16} />
                            <span className="text-[10px] font-black text-gray-600 dark:text-gray-400 tracking-widest uppercase">Hall of Fame</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-none">
                            เหล่าคนเทพ <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 px-2 uppercase">แห่ง APM AI</span>
                        </h2>
                    </div>

                    {/* Podium for Top 3 */}
                    <div className="flex flex-wrap justify-center items-end gap-4 md:gap-8 mb-20 px-4">
                        {/* 2nd Place */}
                        {top3[1] && (
                            <motion.div 
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col items-center group"
                            >
                                <div className="relative mb-4">
                                    <div className="size-20 md:size-24 rounded-3xl bg-white dark:bg-gray-800 border-4 border-slate-300 shadow-xl overflow-hidden">
                                        <img src={getAvatarIcon(top3[1].equipped_avatar)} className="w-full h-full object-cover" alt="Rank 2" />
                                    </div>
                                    <div className="absolute -top-3 -right-3 size-10 rounded-full bg-slate-300 flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900">
                                        <span className="font-black text-gray-700">2</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-tight">{top3[1].username}</p>
                                </div>
                                <div className="h-24 w-28 mt-4 bg-gradient-to-t from-slate-400/20 to-slate-400/10 rounded-t-3xl border-t border-slate-300/30" />
                            </motion.div>
                        )}

                        {/* 1st Place */}
                        {top3[0] && (
                            <motion.div 
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="flex flex-col items-center z-20 -mb-4 md:-mb-8"
                            >
                                <div className="relative mb-6 scale-125 md:scale-150">
                                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-30">
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, -2] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="px-4 py-1.5 bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-600 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.6)] border-2 border-white"
                                        >
                                            <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest whitespace-nowrap">
                                                มหาเทพ
                                            </span>
                                        </motion.div>
                                    </div>
                                    <Crown className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-500 size-12 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] z-20" />
                                    <div className="size-24 md:size-28 rounded-[2.5rem] bg-white dark:bg-gray-800 border-4 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.4)] overflow-hidden">
                                        <img src={getAvatarIcon(top3[0].equipped_avatar)} className="w-full h-full object-cover" alt="Rank 1" />
                                    </div>
                                    <div className="absolute -top-3 -right-3 size-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900 z-30">
                                        <span className="font-black text-white text-lg">1</span>
                                    </div>
                                    {/* Pulse Effect Aura */}
                                    <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-yellow-400/20 blur-2xl animate-pulse" />
                                </div>
                                <div className="text-center mt-4">
                                    <p className="font-black text-gray-900 dark:text-white text-xl uppercase tracking-tight italic">{top3[0].username}</p>
                                </div>
                                <div className="h-32 w-32 mt-6 bg-gradient-to-t from-yellow-400/40 via-yellow-400/20 to-transparent rounded-t-3xl border-x border-t border-yellow-400/30" />
                            </motion.div>
                        )}

                        {/* 3rd Place */}
                        {top3[2] && (
                            <motion.div 
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col items-center group"
                            >
                                <div className="relative mb-4">
                                    <div className="size-20 md:size-24 rounded-3xl bg-white dark:bg-gray-800 border-4 border-amber-600/50 shadow-xl overflow-hidden">
                                        <img src={getAvatarIcon(top3[2].equipped_avatar)} className="w-full h-full object-cover" alt="Rank 3" />
                                    </div>
                                    <div className="absolute -top-3 -right-3 size-10 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900">
                                        <span className="font-black">3</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-tight">{top3[2].username}</p>
                                </div>
                                <div className="h-16 w-28 mt-4 bg-gradient-to-t from-amber-600/20 to-amber-600/10 rounded-t-3xl border-t border-amber-600/20 shadow-sm" />
                            </motion.div>
                        )}
                    </div>

                    {/* Rankings List */}
                    <div className="space-y-3">
                        {others.map((user, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 + (idx * 0.05) }}
                                className="flex items-center gap-4 bg-white/60 dark:bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white dark:border-white/10 shadow-sm hover:translate-x-2 transition-transform"
                            >
                                <div className="size-8 font-black text-gray-400 dark:text-gray-500 flex items-center justify-center italic">
                                    #{idx + 4}
                                </div>
                                <div className="size-12 rounded-2xl overflow-hidden border-2 border-white dark:border-gray-700 bg-white">
                                    <img src={getAvatarIcon(user.equipped_avatar)} className="w-full h-full object-cover" alt="User" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-lg">{user.username}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 text-center border-t border-gray-100 dark:border-white/5 pt-10">
                        <p className="text-xs font-bold text-gray-400 italic">
                            ขยันเรียน ขยันแชท แล้วมาติดอันดับกันนะครับเพื่อนๆ !
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Leaderboard;
