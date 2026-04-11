import React from "react";
import { motion } from "framer-motion";
import { Trophy, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200];
const LEVEL_THEMES = {
    1: { name: "Bronze", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368522/Broze_xwm5gg.png" },
    2: { name: "Silver", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368517/Sliver_ea2lid.png" },
    3: { name: "Gold", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368525/Gold_bglivb.png" },
    4: { name: "Platinum", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368536/Plat_rakik4.png" },
    5: { name: "Diamond", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368517/Diamond_gjekkx.png" },
    6: { name: "Master", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368537/Master_ypfzxo.png" },
    7: { name: "Legend", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368533/Legen_vts5jo.png" },
};

const RankInfoModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[48px] overflow-hidden shadow-2xl border border-white/20 p-8 md:p-10"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                        <Trophy className="text-yellow-500" size={32}/> 
                        <span className="text-gray-900 dark:text-white uppercase">
                            {t("rank.path_of_glory")}
                        </span>
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-all">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>
                <div className="space-y-4 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar no-scrollbar">
                    {Object.entries(LEVEL_THEMES).map(([lvl, theme], idx) => (
                        <div key={lvl} className="flex items-center justify-between p-4 md:p-5 rounded-[28px] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 group hover:scale-[1.02] transition-all">
                            <div className="flex items-center gap-4">
                                <div className="size-12 md:size-16 rounded-2xl flex items-center justify-center p-2 bg-white dark:bg-white/5 shadow-lg ring-4 ring-gray-50 dark:ring-white/5">
                                    <img src={theme.img} alt={theme.name} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <p className="font-black text-lg md:text-xl text-gray-800 dark:text-white">{theme.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 tracking-[.2em]">LEVEL {lvl}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-base md:text-lg text-emerald-500">{LEVEL_THRESHOLDS[idx] || 0} XP</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Required</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className="w-full mt-8 py-4 rounded-3xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black text-lg shadow-xl active:scale-95 transition-all">
                    เข้าใจแล้วจ้า!
                </button>
            </motion.div>
        </div>
    );
};

export default RankInfoModal;
