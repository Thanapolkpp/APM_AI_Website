import React from "react";
import { Coins, Sparkles } from "lucide-react";
import { useCoins } from "../../hooks/useCoins";

const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200];

const CoinBadge = ({ className = "" }) => {
    const { coins, exp } = useCoins();

    // Level calculation logic
    const getLevelInfo = (totalExp) => {
        let level = 1;
        let nextThreshold = LEVEL_THRESHOLDS[1];
        let currentThreshold = 0;

        for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
            if (totalExp >= LEVEL_THRESHOLDS[i]) {
                level = i + 1;
                currentThreshold = LEVEL_THRESHOLDS[i];
                nextThreshold = LEVEL_THRESHOLDS[i + 1] || null;
            } else {
                break;
            }
        }

        const expInLevel = totalExp - currentThreshold;
        const expNeeded = nextThreshold ? nextThreshold - currentThreshold : 1;
        const percentage = nextThreshold ? Math.min((expInLevel / expNeeded) * 100, 100) : 100;

        return { level, percentage, isMax: !nextThreshold };
    };

    const { level, percentage } = getLevelInfo(exp);

    // Dynamic Color Mapping by Level
    const getLevelTheme = (lvl) => {
        const themes = {
            1: { from: "#92400e", to: "#d97706", shadow: "rgba(146, 64, 14, 0.3)", text: "text-amber-800", name: "Bronze" },    // น้ำตาลทองแดงเข้มขึ้น
            2: { from: "#475569", to: "#cbd5e1", shadow: "rgba(71, 85, 105, 0.2)", text: "text-slate-600", name: "Silver" },    // เงินที่ดูสว่างและคลีน
            3: { from: "#b45309", to: "#fbbf24", shadow: "rgba(180, 83, 9, 0.3)", text: "text-yellow-700", name: "Gold" },      // ทองที่มีมิติเงางาม
            4: { from: "#0f172a", to: "#94a3b8", shadow: "rgba(15, 23, 42, 0.2)", text: "text-slate-500", name: "Platinum" },  // เข้มแบบ Midnight ดูหรู
            5: { from: "#0e7490", to: "#67e8f9", shadow: "rgba(14, 116, 144, 0.3)", text: "text-cyan-700", name: "Diamond" },   // ฟ้าใสแบบอัญมณี
            6: { from: "#5b21b6", to: "#c084fc", shadow: "rgba(91, 33, 182, 0.3)", text: "text-violet-700", name: "Master" },   // ม่วงลึกลับ ทรงพลัง
            7: { from: "#7f1d1d", to: "#f87171", shadow: "rgba(127, 29, 29, 0.4)", text: "text-red-700", name: "Legendary" }  // แดงเข้มตัดแดงสว่าง ดูดุดัน
        };
        return themes[lvl] || themes[7];
    };


    const theme = getLevelTheme(level);

    // Circular progress constants
    const size = 42;
    const strokeWidth = 3.5;
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className={`flex items-center gap-4 ${className}`}>
            {/* Coins Badge */}
            <div className="group flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/20 active:scale-95">
                <div className="relative">
                    <Coins className="text-yellow-500 transition-transform group-hover:rotate-12" size={20} />
                    <div className="absolute inset-0 bg-yellow-400/30 blur-lg rounded-full -z-10 animate-pulse" />
                </div>
                <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Coins</span>
                    <span className="text-gray-900 dark:text-white font-black text-base tabular-nums">
                        {coins.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Circular Level & EXP Badge */}
            <div className="group relative flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ boxShadow: `0 10px 15px -3px ${theme.shadow}` }}>
                {/* Ring Container */}
                <div className="relative size-[42px] flex items-center justify-center shrink-0">
                    <svg width={size} height={size} className="transform -rotate-90">
                        {/* Background Ring */}
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            className="text-gray-200 dark:text-gray-800"
                        />
                        {/* Progress Ring */}
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="transparent"
                            stroke={`url(#exp-gradient-${level})`}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            style={{
                                strokeDashoffset,
                                transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient id={`exp-gradient-${level}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={theme.from} />
                                <stop offset="100%" stopColor={theme.to} />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Level Number */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xs font-black tracking-tighter sm:text-[13px] ${theme.text} dark:text-white`}>LV.{level}</span>
                    </div>

                    {/* Small Floating Sparkle */}
                    <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Sparkles size={10} className="text-yellow-400 animate-pulse" />
                    </div>
                </div>

                {/* EXP Info */}
                <div className="flex flex-col items-start leading-none pr-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Rank: {theme.name}</span>
                    <div className="flex items-baseline gap-1">

                        <span
                            className="font-black text-base tabular-nums tracking-tight bg-clip-text text-transparent"
                            style={{ backgroundImage: `linear-gradient(to right, ${theme.from}, ${theme.to})` }}
                        >
                            {exp.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 italic font-display">XP</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoinBadge;



