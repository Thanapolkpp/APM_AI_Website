import React from "react";
import { Coins, Sparkles } from "lucide-react";
import { useCoins } from "../../hooks/useCoins";

const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200];

const CoinBadge = ({ className = "", isVibrant = false }) => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (!isLoggedIn) return null;

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

    // Dynamic Color Mapping by Level with Rank Images
    const getLevelTheme = (lvl) => {
        const themes = {
            1: { 
                from: "#92400e", to: "#d97706", shadow: "rgba(146, 64, 14, 0.3)", 
                text: isVibrant ? "text-white" : "text-amber-800", name: "Bronze",
                img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368522/Broze_xwm5gg.png"
            },
            2: { 
                from: "#475569", to: "#cbd5e1", shadow: "rgba(71, 85, 105, 0.2)", 
                text: isVibrant ? "text-white" : "text-slate-600", name: "Silver",
                img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368517/Sliver_ea2lid.png" 
            },
            3: { 
                from: "#b45309", to: "#fbbf24", shadow: "rgba(180, 83, 9, 0.3)", 
                text: isVibrant ? "text-white" : "text-yellow-700", name: "Gold",
                img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368525/Gold_bglivb.png"
            },
            4: { 
                from: "#0f172a", to: "#94a3b8", shadow: "rgba(15, 23, 42, 0.2)", 
                text: isVibrant ? "text-white" : "text-slate-500", name: "Platinum",
                img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368536/Plat_rakik4.png"
            },
            5: { 
                from: "#0e7490", to: "#67e8f9", shadow: "rgba(14, 116, 144, 0.3)", 
                text: isVibrant ? "text-white" : "text-cyan-700", name: "Diamond",
                img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368517/Diamond_gjekkx.png"
            },
            6: { 
                from: "#5b21b6", to: "#c084fc", shadow: "rgba(91, 33, 182, 0.3)", 
                text: isVibrant ? "text-white" : "text-violet-700", name: "Master",
                img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368537/Master_ypfzxo.png"
            },
            7: { 
                from: "#7f1d1d", to: "#f87171", shadow: "rgba(127, 29, 29, 0.4)", 
                text: isVibrant ? "text-white" : "text-red-700", name: "Legend",
                img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368533/Legen_vts5jo.png"
            },
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

    const pillClass = isVibrant 
        ? "bg-white/5 backdrop-blur-sm border border-white/10"
        : "bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10";
    
    const labelClass = isVibrant ? "text-white/70" : "text-gray-400";
    const valueClass = isVibrant ? "text-white drop-shadow-sm" : "text-gray-900 dark:text-white";

    const isStacked = className.includes("!flex-col");

    if (isStacked) {
        return (
            <div className={`flex flex-col gap-2 ${className}`}>
                 {/* Coins Row */}
                 <div className="flex items-center gap-2 group">
                    <div className="relative size-6 flex items-center justify-center">
                        <Coins className="text-yellow-300" size={16} />
                        <div className="absolute inset-0 blur-md bg-yellow-400/30 rounded-full animate-pulse -z-10" />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Coins</span>
                        <span className="text-sm font-black text-white">{coins.toLocaleString()}</span>
                    </div>
                </div>

                {/* Rank Row */}
                <div className="flex items-center gap-2 group">
                    <div className="relative size-6 flex items-center justify-center p-0.5">
                         <img src={theme.img} alt={theme.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Rank: {theme.name}</span>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-sm font-black text-white">{exp.toLocaleString()}</span>
                            <span className="text-[8px] font-bold text-white/60">XP</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`flex items-center gap-2 sm:gap-4 ${className}`}>
            <div className={`flex group items-center gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${isVibrant ? "" : "shadow-lg " + pillClass}`}>
                <div className="relative">
                    <Coins className={isVibrant ? "text-yellow-300" : "text-yellow-500"} size={isVibrant ? 16 : 18} />
                    <div className={`absolute inset-0 blur-lg rounded-full -z-10 animate-pulse ${isVibrant ? "bg-yellow-200/40" : "bg-yellow-400/30"}`} />
                </div>
                <div className="flex items-center gap-1.5 leading-none">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${labelClass}`}>Coins</span>
                    <span className={`font-black text-xs sm:text-base tabular-nums ${valueClass}`}>
                        {coins.toLocaleString()}
                    </span>
                </div>
            </div>

            {isVibrant && <div className="w-px h-4 bg-white/20" />}

            <div className={`flex group relative items-center gap-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 
                ${isVibrant ? "" : "bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-lg px-4 py-2"}
                `}
                style={{ boxShadow: (isVibrant) ? "none" : `0 10px 15px -3px ${theme.shadow}` }}>
                {/* Ring Container */}
                <div className="relative size-[28px] sm:size-[40px] flex items-center justify-center shrink-0">
                    {!isVibrant && (
                         <svg width={size} height={size} className="transform -rotate-90 scale-[0.7] sm:scale-100">
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
                    )}

                    {/* Rank Image */}
                    <div className={`absolute inset-0 flex items-center justify-center ${isVibrant ? "p-0" : "p-1"}`}>
                        <img 
                            src={theme.img} 
                            alt={theme.name} 
                            className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110" 
                        />
                    </div>
                </div>

                {/* EXP Info */}
                <div className="flex items-center gap-1.5 leading-none pr-1">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${labelClass}`}>Rank: {theme.name}</span>
                    <div className="flex items-baseline gap-0.5">
                        <span
                            className={`font-black text-xs sm:text-base tabular-nums tracking-tight ${isVibrant ? "text-white" : "bg-clip-text text-transparent"}`}
                            style={isVibrant ? { textShadow: "0 2px 4px rgba(0,0,0,0.1)" } : { backgroundImage: `linear-gradient(to right, ${theme.from}, ${theme.to})` }}
                        >
                            {exp.toLocaleString()}
                        </span>
                        <span className={`text-[8px] sm:text-[10px] font-bold italic ${labelClass}`}>XP</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoinBadge;
