import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/footer";
import { useTranslation } from "react-i18next";
import { ASSETS, mapImagePath } from "../config/assets";

const Logo = ASSETS.BRANDING.LOGO;
const BroIcon = ASSETS.AVATARS.BRO;
const CuteGirlIcon = ASSETS.AVATARS.GIRL;
const NerdIcon = ASSETS.AVATARS.NERD2; // Default Nerd
import Notification from "../components/UI/Notification";
import CoinBadge from "../components/UI/CoinBadge";
import { getUserProfile, fetchOwnedRooms, fetchNotifications, fetchUnreadNotificationCount, markAllNotificationsRead } from "../services/aiService";
import { motion, AnimatePresence } from "framer-motion";
import SpecialMissions from "../components/Account/SpecialMissions";



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

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch User Profile and Equipped Room
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

                const equipped = rooms.find(r => r.is_equipped) || rooms[0];
                if (equipped) {
                    setCoverImage(mapImagePath(equipped.image_path));
                }
            })
            .catch(() => { });
    }, []);

    // รูปภาพสำรอง (Fallback) กรณีที่ยังไม่ได้เซฟรูป 3D
    const avatarMap = {
        girl: CuteGirlIcon,
        nerd: NerdIcon,
        bro: BroIcon,
    };

    // 🌟 1. สร้าง State สำหรับเก็บ Source ของรูปภาพที่จะแสดง
    const [profileImage, setProfileImage] = useState(() => {
        // ลองหาว่ามีรูป 3D ที่ถูกถ่ายเก็บไว้ไหม
        const savedImage = localStorage.getItem("avatarImage");
        if (savedImage) return savedImage;

        // ถ้าไม่มีรูป 3D ให้กลับไปดูว่าเลือกตัวละคร id ไหนไว้ แล้วใช้รูป 2D แทน
        const savedAvatar = localStorage.getItem("avatar") || "bro";
        return avatarMap[savedAvatar.toLowerCase()] || BroIcon;
    });

    useEffect(() => {
        // 🌟 2. อัปเดตเมื่อโหลดหน้าเว็บ
        const savedImage = localStorage.getItem("avatarImage");
        if (savedImage) {
            setProfileImage(savedImage);
        } else {
            const savedAvatar = localStorage.getItem("avatar") || "bro";
            setProfileImage(avatarMap[savedAvatar.toLowerCase()] || BroIcon);
        }
    }, []);

    // ✅ Dark Mode State
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        const dark = savedTheme === "dark";

        if (dark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        return dark;
    });

    const [showNoti, setShowNoti] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const loadNotifications = () => {
        fetchNotifications().then(setNotifications).catch(() => {});
        fetchUnreadNotificationCount().then(setUnreadCount).catch(() => {});
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) loadNotifications();
    }, []);

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

    // Cover Image State - Defaults to equipped room from Mall
    const [coverImage, setCoverImage] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        navigate("/login");
    };

    return (
        <div className="bg-gradient-to-br from-[#e0e7ff] via-[#fae8ff] to-[#fce7f3] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen text-[#333333] dark:text-gray-100 transition-colors duration-300 font-display relative overflow-hidden flex flex-col">

            {/* Background Blobs for Glassmorphism */}
            <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-sky-300/30 dark:bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-pink-300/30 dark:bg-pink-500/10 rounded-full blur-[150px] pointer-events-none"></div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/30 dark:bg-gray-900/40 backdrop-blur-xl border-b border-white/50 dark:border-gray-700 shadow-sm transition-colors duration-300">
                <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-4 sm:px-6 h-20">
                    {/* Left - Brand */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-sm border border-white/60 bg-white dark:border-gray-600 dark:bg-gray-800">
                            <img src={Logo} alt="Logo" className="w-full h-full object-cover transition duration-300 hover:scale-110" />
                        </div>
                        <div className="hidden min-[1140px]:block">
                            <h1 className="font-extrabold text-[15px] sm:text-xl text-gray-900 dark:text-white tracking-tight leading-none">APM AI</h1>
                            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 font-medium mt-0.5">{t("nav.brand_subtitle")}</p>
                        </div>
                    </div>

                    {/* Center - Back Button */}
                    <div className="flex-1 flex justify-center">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/50 dark:bg-white/10 border border-white dark:border-white/10 text-gray-600 dark:text-gray-300 font-black text-sm uppercase tracking-widest hover:bg-white transition-all active:scale-95 shadow-sm"
                        >
                            <span className="material-symbols-outlined text-xl">arrow_back</span>
                            Back to Home
                        </button>
                    </div>

                    {/* Right - Profile & Noti */}
                    <div className="flex justify-end gap-3 items-center shrink-0">
                        <CoinBadge className="hidden sm:flex scale-90" />

                        {/* Leaderboard Button */}
                        <button
                            onClick={() => navigate("/leaderboard")}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-sm hover:scale-105 transition active:scale-95 border border-white dark:border-gray-600 relative group"
                            title="Leaderboard"
                        >
                            <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-yellow-500 group-hover:rotate-12 transition-transform">trophy</span>
                        </button>

                        {/* Notification Button */}
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

                            <AnimatePresence>
                                {showNoti && (
                                    <>
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setShowNoti(false)}
                                            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white dark:border-gray-700 p-6 z-[101] overflow-hidden"
                                        >
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="font-black text-xl text-gray-900 dark:text-white flex items-center gap-2 italic">
                                                    NOTIFICATIONS <span className="text-primary text-2xl font-black">!</span>
                                                </h3>
                                                {unreadCount > 0 && (
                                                    <button 
                                                        onClick={handleMarkAllRead}
                                                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                                                    >
                                                        Mark all read
                                                    </button>
                                                )}
                                            </div>

                                            <div className="max-h-[400px] overflow-y-auto space-y-3 scrollbar-hide">
                                                {notifications.length > 0 ? (
                                                    notifications.map((n) => (
                                                        <div 
                                                            key={n.id} 
                                                            className={`p-4 rounded-3xl border transition-all ${n.is_read ? 'bg-gray-50/50 dark:bg-white/5 border-transparent' : 'bg-white dark:bg-gray-800 border-primary/20 shadow-sm shadow-primary/5'}`}
                                                        >
                                                            <div className="flex gap-3">
                                                                <div className={`size-10 rounded-2xl flex items-center justify-center shrink-0 ${n.type === 'reward' ? 'bg-yellow-400/10 text-yellow-600' : 'bg-primary/10 text-primary'}`}>
                                                                    <span className="material-symbols-outlined text-[20px]">
                                                                        {n.type === 'reward' ? 'database' : 'notifications'}
                                                                    </span>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="font-black text-sm text-gray-900 dark:text-white leading-tight">{n.title}</p>
                                                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{n.message}</p>
                                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mt-2">
                                                                        {new Date(n.created_at).toLocaleString('th-TH')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="py-12 text-center">
                                                        <div className="size-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                                            <span className="material-symbols-outlined text-3xl">notifications_off</span>
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-400 italic">ไม่มีแจ้งเตือนใหม่นะเพื่อน... 🌷</p>
                                                    </div>
                                                )}
                                            </div>

                                            <button 
                                                onClick={() => setShowNoti(false)}
                                                className="w-full mt-6 py-4 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition"
                                            >
                                                Close
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Profile Image (Mini) */}
                        <div
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cover bg-center border-2 border-pink-200 dark:border-pink-500 shadow-sm cursor-default"
                            style={{ backgroundImage: `url("${profileImage}")`, backgroundColor: "white" }}
                        />

                        {/* Mobile Nav */}
                        <div className="lg:hidden ml-2">
                            <Navbar />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center w-full px-6 py-10 z-10">
                <div className="w-full max-w-4xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/60 dark:border-gray-700/50 overflow-hidden">

                    {/* Cover Photo - Compact Height */}
                    <div className="h-40 md:h-48 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 dark:from-pink-900/50 dark:via-purple-900/50 dark:to-indigo-900/50 relative overflow-hidden">
                        {coverImage && (
                            <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 animate-in fade-in" />
                        )}
                        <div className="absolute inset-0 bg-black/5 dark:bg-black/20" />
                        
                        {/* Edit Cover Button - Link to Mall */}
                        <button 
                            onClick={() => navigate("/avatar")}
                            className="absolute top-4 right-4 bg-white/30 hover:bg-white/50 dark:bg-black/30 dark:hover:bg-black/50 backdrop-blur-md p-2 rounded-xl transition text-white shadow-sm border border-white/40 cursor-pointer active:scale-90 group z-10"
                            title="Go to Mall to change Screen"
                        >
                            <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">shopping_bag</span>
                        </button>
                    </div>

                    <div className="px-8 sm:px-12 pb-12">
                        {/* Profile Info Section */}
                        <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 -mt-20 sm:-mt-24 mb-10">

                            {/* Avatar Display */}
                            <div className="relative group">
                                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-[2rem] border-[6px] border-white dark:border-gray-800 shadow-xl overflow-hidden bg-white flex items-center justify-center transform transition duration-500 group-hover:scale-105">
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Change Avatar Badge */}
                                <button
                                    onClick={() => navigate("/avatar")}
                                    className="absolute bottom-2 right-2 bg-pink-500 text-white p-2.5 rounded-xl shadow-lg hover:bg-pink-600 transition hover:scale-110 active:scale-95"
                                    title="Edit Avatar"
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

                        {/* Special Missions Section */}
                        <div className="mb-10">
                            <SpecialMissions />
                        </div>

                        {/* Two Columns Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Account Info Panel */}
                            <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 dark:border-gray-700/50 shadow-sm">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">account_circle</span> {t("account.details")}
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 bg-white/70 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100/50 dark:border-gray-700/50">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 flex items-center justify-center">
                                            <span className="material-symbols-outlined">mail</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">{t("account.email")}</p>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-white/70 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100/50 dark:border-gray-700/50">
                                        <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 dark:text-yellow-400 flex items-center justify-center">
                                            <span className="material-symbols-outlined">toll</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">{t("account.coins")}</p>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">{user.coins} 🪙</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-white/70 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100/50 dark:border-gray-700/50">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400 flex items-center justify-center">
                                            <span className="material-symbols-outlined">star</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">{t("account.exp")}</p>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">{user.exp} XP</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-white/70 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100/50 dark:border-gray-700/50">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400 flex items-center justify-center">
                                            <span className="material-symbols-outlined">badge</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">{t("account.student_id")}</p>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">{user.studentId}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-white/70 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100/50 dark:border-gray-700/50">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400 flex items-center justify-center">
                                            <span className="material-symbols-outlined">school</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">{t("account.uni")}</p>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">Kasetsart University</p>
                                        </div>
                                    </div>
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
                                            aria-label="Toggle dark mode"
                                        >
                                            <div className={`absolute top-1 size-5 bg-white rounded-full shadow-md transition-all ${isDark ? "right-1" : "left-1"}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Logout Button */}
                                <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full py-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-500/20 font-black text-lg shadow-sm hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-red-100 dark:border-red-500/20"
                                    >
                                        <span className="material-symbols-outlined">logout</span> {t("account.logout_btn")}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Account;