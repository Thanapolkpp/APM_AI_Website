import React, { useEffect, useState } from "react";
import { fetchSpecialMissions, claimSpecialMission } from "../../services/aiService";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const SpecialMissions = () => {
    const { t } = useTranslation();
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(null);

    const loadMissions = () => {
        setLoading(true);
        fetchSpecialMissions()
            .then(setMissions)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadMissions();
    }, []);

    const handleClaim = async (missionId) => {
        setClaiming(missionId);
        try {
            const res = await claimSpecialMission(missionId);
            alert(res.message);
            loadMissions();
            window.dispatchEvent(new Event('coinsUpdated'));
        } catch (error) {
            alert(error.response?.data?.detail || "Error");
        } finally {
            setClaiming(null);
        }
    };

    // Helper to SVG Circle Progress
    const CircularProgress = ({ percent, isClaimed, isClaimable, onClick, isLoading }) => {
        const radius = 36;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;

        return (
            <div 
                className={`relative size-24 flex items-center justify-center cursor-pointer transition-transform active:scale-90 ${isClaimable ? 'animate-pulse-slow' : ''}`}
                onClick={isClaimable ? onClick : null}
            >
                <svg className="size-full -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="48" cy="48" r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-gray-100 dark:text-gray-700"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx="48" cy="48" r={radius}
                        fill="transparent"
                        stroke={percent >= 100 ? "#10b981" : "#ec4899"}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        strokeLinecap="round"
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={percent >= 100 ? "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" : ""}
                    />
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {isLoading ? (
                        <div className="size-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                    ) : isClaimed ? (
                        <span className="material-symbols-outlined text-emerald-500 text-3xl font-black">check_circle</span>
                    ) : percent >= 100 ? (
                        <span className="material-symbols-outlined text-emerald-500 text-3xl font-black animate-bounce-slow">redeem</span>
                    ) : (
                        <span className="text-xs font-black text-gray-900 dark:text-white">{Math.round(percent)}%</span>
                    )}
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 mb-6 italic uppercase tracking-tight">
                <span className="material-symbols-outlined text-pink-500 bg-pink-50 dark:bg-pink-900/30 p-2 rounded-xl">grid_view</span> 
                {t("missions.title")}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {missions.map((mission, index) => (
                    <motion.div
                        key={mission.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white dark:border-gray-700 shadow-sm flex flex-col items-center text-center group hover:shadow-xl hover:shadow-pink-500/5 transition-all"
                    >
                        <CircularProgress 
                            percent={mission.progress} 
                            isClaimed={mission.is_claimed}
                            isClaimable={mission.progress >= 100 && !mission.is_claimed}
                            isLoading={claiming === mission.id}
                            onClick={() => handleClaim(mission.id)}
                        />
                        
                        <div className="mt-4 space-y-1">
                            <h4 className="font-black text-xs text-gray-900 dark:text-white uppercase tracking-tighter line-clamp-1 group-hover:text-pink-500 transition-colors">
                                {mission.title}
                            </h4>
                            <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 leading-tight">
                                {mission.current} / {mission.target} {mission.unit}
                            </p>
                        </div>
                        
                        <div className="mt-3 py-1 px-3 bg-white dark:bg-gray-700/50 rounded-full border border-gray-100 dark:border-gray-600 shadow-sm">
                            <span className="text-[9px] font-black text-pink-500">
                                +{mission.reward_coins} 🪙
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            <p className="text-center text-[9px] font-bold text-gray-400 dark:text-gray-500 italic mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">
                {t("missions.footer")}
            </p>
        </div>
    );
};

export default SpecialMissions;
