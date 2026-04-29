import React from "react";
import { useTranslation } from "react-i18next";

const SettingsPanel = ({ user, isDark, toggleDarkMode, onLogout }) => {
    const { t } = useTranslation();

    const infoItems = [
        { icon: "mail", label: t("account.email"), value: user.email, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400" },
        { icon: "toll", label: t("account.coins"), value: `${user.coins} 🪙`, color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 dark:text-yellow-400" },
        { icon: "star", label: t("account.exp"), value: `${user.exp} XP`, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400" },
        { icon: "badge", label: t("account.student_id"), value: user.studentId, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400" },
        { icon: "school", label: t("account.uni"), value: "Kasetsart University", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Account Info Panel */}
            <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 dark:border-gray-700/50 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">account_circle</span> {t("account.details")}
                </h3>
                <div className="space-y-4">
                    {infoItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-white/70 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100/50 dark:border-gray-700/50">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                                <span className="material-symbols-outlined">{item.icon}</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                                <p className="font-bold text-gray-800 dark:text-gray-200">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Settings Panel */}
            <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 dark:border-gray-700/50 shadow-sm flex flex-col">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">settings</span> {t("account.settings")}
                </h3>

                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4 bg-white/70 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100/50 dark:border-gray-700/50">
                        <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-500 dark:text-pink-400 flex items-center justify-center">
                            <span className="material-symbols-outlined">smart_toy</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">{t("account.preference")}</p>
                            <p className="font-bold text-gray-800 dark:text-gray-200">{user.preferredMode}</p>
                        </div>
                    </div>

                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between bg-white/70 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer" onClick={toggleDarkMode}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 flex items-center justify-center">
                                <span className="material-symbols-outlined">{isDark ? "dark_mode" : "light_mode"}</span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 dark:text-gray-200">{t("account.theme")}</p>
                                <p className="text-[11px] text-gray-500 font-medium">{t("account.theme_desc")}</p>
                            </div>
                        </div>
                        <button
                            className={`w-14 h-7 rounded-full relative transition-all ${isDark ? "bg-gradient-to-r from-purple-500 to-indigo-500" : "bg-gray-300 dark:bg-gray-600"}`}
                        >
                            <div className={`absolute top-1 size-5 bg-white rounded-full shadow-md transition-all ${isDark ? "right-1" : "left-1"}`} />
                        </button>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <button
                        onClick={onLogout}
                        className="w-full py-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-500/20 font-black text-lg shadow-sm hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-red-100 dark:border-red-500/20"
                    >
                        <span className="material-symbols-outlined">logout</span> {t("account.logout_btn")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
