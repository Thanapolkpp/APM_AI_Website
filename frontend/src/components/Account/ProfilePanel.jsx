import React from "react";
import { useTranslation } from "react-i18next";

const ProfilePanel = ({ user, profileImage, coverImage, onEditAvatar, onEditCover }) => {
    const { t } = useTranslation();

    return (
        <div className="w-full max-w-7xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/60 dark:border-gray-700/50 overflow-hidden mb-8">
            {/* Cover Photo */}
            <div className="h-40 md:h-48 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 dark:from-pink-900/50 dark:via-purple-900/50 dark:to-indigo-900/50 relative overflow-hidden">
                {coverImage && (
                    <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 animate-in fade-in" />
                )}
                <div className="absolute inset-0 bg-black/5 dark:bg-black/20" />
                
                <button 
                    onClick={onEditCover}
                    className="absolute top-4 right-4 bg-white/30 hover:bg-white/50 dark:bg-black/30 dark:hover:bg-black/50 backdrop-blur-md p-2 rounded-xl transition text-white shadow-sm border border-white/40 cursor-pointer active:scale-90 group z-10"
                >
                    <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">shopping_bag</span>
                </button>
            </div>

            <div className="px-8 sm:px-12 pb-8">
                <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 -mt-20 sm:-mt-24 mb-6">
                    {/* Avatar Display */}
                    <div className="relative group">
                        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-[2rem] border-[6px] border-white dark:border-gray-800 shadow-xl overflow-hidden bg-white flex items-center justify-center transform transition duration-500 group-hover:scale-105">
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button
                            onClick={onEditAvatar}
                            className="absolute bottom-2 right-2 bg-pink-500 text-white p-2.5 rounded-xl shadow-lg hover:bg-pink-600 transition hover:scale-110 active:scale-95"
                        >
                            <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
                        </button>
                    </div>

                    <div className="text-center sm:text-left flex-1 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md p-4 rounded-3xl border border-white/60 dark:border-gray-700/50 shadow-sm relative top-4">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                            {user.name}
                        </h2>
                        <p className="text-pink-600 dark:text-pink-400 font-bold text-sm tracking-wide bg-pink-100 dark:bg-pink-900/30 inline-block px-3 py-1 rounded-full">
                            🎓 {user.major}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
                            {t("account.joined")} {user.joinedDate}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePanel;
