import React from "react"
import { useTranslation } from "react-i18next"
import { Info } from "lucide-react"

export const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200];
export const LEVEL_THEMES = {
    1: { from: "#92400e", to: "#d97706", name: "Bronze", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368522/Broze_xwm5gg.png" },
    2: { from: "#475569", to: "#cbd5e1", name: "Silver", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368517/Sliver_ea2lid.png" },
    3: { from: "#b45309", to: "#fbbf24", name: "Gold", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368525/Gold_bglivb.png" },
    4: { from: "#0f172a", to: "#94a3b8", name: "Platinum", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368536/Plat_rakik4.png" },
    5: { from: "#0e7490", to: "#67e8f9", name: "Diamond", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368517/Diamond_gjekkx.png" },
    6: { from: "#5b21b6", to: "#c084fc", name: "Master", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368537/Master_ypfzxo.png" },
    7: { from: "#7f1d1d", to: "#f87171", name: "Legend", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368533/Legen_vts5jo.png" },
};

const LevelBar = ({ exp = 0, onInfoClick }) => {
    const { t } = useTranslation();
    let level = 1;
    let nextThreshold = LEVEL_THRESHOLDS[1];
    let currentThreshold = 0;

    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
        if (exp >= LEVEL_THRESHOLDS[i]) {
            level = i + 1;
            currentThreshold = LEVEL_THRESHOLDS[i];
            nextThreshold = LEVEL_THRESHOLDS[i + 1] || null;
        } else {
            break;
        }
    }

    const expInLevel = exp - currentThreshold;
    const expNeeded = nextThreshold ? nextThreshold - currentThreshold : 1; 
    const percentage = nextThreshold ? Math.min((expInLevel / expNeeded) * 100, 100) : 100;
    const theme = LEVEL_THEMES[level] || LEVEL_THEMES[7];
    
    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                    <div 
                        className="bg-white/80 dark:bg-black/20 p-1 rounded-lg shadow-sm border border-white/50"
                    >
                        <img src={theme.img} alt={theme.name} className="size-5 object-contain" />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{theme.name} • LV. {level}</span>
                </div>
                <button 
                    onClick={onInfoClick}
                    className="flex items-center gap-1 text-[10px] font-black text-gray-400 hover:text-primary transition-colors uppercase tracking-widest"
                >
                    <Info size={12}/> {t("todo.rank_info")}
                </button>
            </div>
            <div className="h-2.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden border border-white/50 dark:border-white/10 shadow-inner">
                <div 
                    className="h-full transition-all duration-1000" 
                    style={{ 
                        width: `${percentage}%`,
                        background: `linear-gradient(to right, ${theme.from}, ${theme.to})`,
                        boxShadow: `0 0 10px ${theme.from}66`
                    }}
                />
            </div>
            <div className="flex justify-end">
                <span className="text-[9px] font-black" style={{ color: theme.from }}>
                    {nextThreshold ? t("todo.xp_to_next", { current: expInLevel, needed: expNeeded }) : t("todo.max_rank")}
                </span>
            </div>
        </div>
    );
};

export default LevelBar;
