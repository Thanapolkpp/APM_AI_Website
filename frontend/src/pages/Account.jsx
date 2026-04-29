import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/footer";
import { useTranslation } from "react-i18next";
import { ASSETS, mapImagePath, getAvatarIcon } from "../config/assets";
import CoinBadge from "../components/UI/CoinBadge";
import { 
    getUserProfile, fetchOwnedRooms, fetchNotifications, 
    fetchUnreadNotificationCount, markAllNotificationsRead 
} from "../services/aiService";
import { AnimatePresence } from "framer-motion";
import SpecialMissions from "../components/Account/SpecialMissions";

// Modular Components
import NotificationDropdown from "../components/Account/NotificationDropdown";
import ProfilePanel from "../components/Account/ProfilePanel";
import SettingsPanel from "../components/Account/SettingsPanel";

const Logo = ASSETS.BRANDING.LOGO;

const Account = () => {
    const navigate = useNavigate();
    const { t } = useTranslation()
    
    const [user, setUser] = useState({
        name: localStorage.getItem("username") || "Unknown User",
        email: localStorage.getItem("email") || "No email",
        studentId: "66010xxx",
        major: "Computer Science",
        joinedDate: "January 2024",
        preferredMode: localStorage.getItem("avatar") || "Cute Girl Mode",
        coins: Number(localStorage.getItem("user_coins") || 0),
        exp: 0,
    });

    const [profileImage, setProfileImage] = useState(Logo);
    const [coverImage, setCoverImage] = useState(null);
    const [showNoti, setShowNoti] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        const dark = savedTheme === "dark";
        if (dark) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
        return dark;
    });

    const refreshProfileImage = useCallback(() => {
        const savedImage = localStorage.getItem("avatarImage");
        if (savedImage) {
            setProfileImage(savedImage);
            return;
        }
        const savedAvatar = localStorage.getItem("avatar");
        setProfileImage(getAvatarIcon(savedAvatar));
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        Promise.all([getUserProfile(), fetchOwnedRooms()])
            .then(([profileData, rooms]) => {
                localStorage.setItem("user_coins", String(profileData.coins));
                setUser((prev) => ({
                    ...prev,
                    name: profileData.username || prev.name,
                    email: profileData.email || prev.email,
                    coins: profileData.coins,
                    exp: profileData.exp,
                }));
                if (profileData.equipped_avatar) {
                    localStorage.setItem("avatar", profileData.equipped_avatar);
                    refreshProfileImage();
                }
                const equipped = rooms.find(r => r.is_equipped) || rooms[0];
                if (equipped) setCoverImage(mapImagePath(equipped.image_path));
            })
            .catch(() => { });
    }, [refreshProfileImage]);

    useEffect(() => {
        refreshProfileImage();
        window.addEventListener("avatarUpdated", refreshProfileImage);
        return () => window.removeEventListener("avatarUpdated", refreshProfileImage);
    }, [refreshProfileImage]);

    const loadNotifications = useCallback(() => {
        fetchNotifications().then(setNotifications).catch(() => {});
        fetchUnreadNotificationCount().then(setUnreadCount).catch(() => {});
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) loadNotifications();
    }, [loadNotifications]);

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            setUnreadCount(0);
            loadNotifications();
        } catch (error) {}
    };

    const toggleDarkMode = () => {
        setIsDark((prev) => {
            const next = !prev;
            if (next) {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
            }
            return next;
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        navigate("/login");
    };

    return (
        <div className="bg-gradient-to-br from-[#e0e7ff] via-[#fae8ff] to-[#fce7f3] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen text-[#333333] dark:text-gray-100 transition-colors duration-300 font-display relative overflow-hidden flex flex-col">
            <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-sky-300/30 dark:bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-pink-300/30 dark:bg-pink-500/10 rounded-full blur-[150px] pointer-events-none"></div>

            <header className="sticky top-0 z-50 bg-white/30 dark:bg-gray-900/40 backdrop-blur-xl border-b border-white/50 dark:border-gray-700 shadow-sm transition-colors duration-300">
                <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-4 sm:px-6 h-20">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-sm border border-white/60 bg-white dark:border-gray-600 dark:bg-gray-800 transition-transform hover:scale-105 active:scale-95 cursor-pointer" onClick={() => navigate("/")}>
                            <img src={profileImage || Logo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <div className="hidden min-[1140px]:block">
                            <h1 className="font-extrabold text-[15px] sm:text-xl text-gray-900 dark:text-white tracking-tight leading-none">APM AI</h1>
                            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 font-medium mt-0.5">{t("nav.brand_subtitle")}</p>
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/50 dark:bg-white/10 border border-white dark:border-white/10 text-gray-600 dark:text-gray-300 font-black text-sm uppercase tracking-widest hover:bg-white transition-all active:scale-95 shadow-sm"
                        >
                            <span className="material-symbols-outlined text-xl">arrow_back</span>
                            Back to Home
                        </button>
                    </div>

                    <div className="flex justify-end gap-3 items-center shrink-0">
                        <CoinBadge className="hidden sm:flex scale-90" />
                        <button
                            onClick={() => navigate("/leaderboard")}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-sm hover:scale-105 transition active:scale-95 border border-white dark:border-gray-600 relative group"
                        >
                            <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-yellow-500 group-hover:rotate-12 transition-transform">trophy</span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowNoti(!showNoti)}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-sm hover:scale-105 transition active:scale-95 border border-white dark:border-gray-600 relative"
                            >
                                <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-gray-700 dark:text-gray-200">notifications</span>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 size-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white dark:ring-gray-800 animate-bounce">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            <NotificationDropdown 
                                isOpen={showNoti} 
                                onClose={() => setShowNoti(false)} 
                                notifications={notifications} 
                                unreadCount={unreadCount} 
                                onMarkAllRead={handleMarkAllRead} 
                            />
                        </div>

                        <div
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cover bg-center border-2 border-pink-200 dark:border-pink-500 shadow-sm cursor-default"
                            style={{ backgroundImage: `url("${profileImage}")`, backgroundColor: "white" }}
                        />
                        <div className="lg:hidden ml-2"><Navbar /></div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-6 py-10 z-10">
                <ProfilePanel 
                    user={user} 
                    profileImage={profileImage} 
                    coverImage={coverImage} 
                    onEditAvatar={() => navigate("/avatar")} 
                    onEditCover={() => navigate("/avatar")} 
                />

                <div className="w-full max-w-7xl">
                    <div className="mb-10"><SpecialMissions /></div>
                    <SettingsPanel 
                        user={user} 
                        isDark={isDark} 
                        toggleDarkMode={toggleDarkMode} 
                        onLogout={handleLogout} 
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Account;