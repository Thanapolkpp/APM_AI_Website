import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/footer";
import Logo from "../assets/logo.png";

import BroIcon from "../assets/Bro.png";
import CuteGirlIcon from "../assets/Girl.png";
import NerdIcon from "../assets/Nerd.1.2.png";
import Notification from "../components/UI/Notification";
import { getUserProfile } from "../services/aiService";


const Account = () => {
    const navigate = useNavigate();

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
        getUserProfile()
            .then((data) => {
                localStorage.setItem("user_coins", String(data.coins));
                setUser((prev) => ({
                    ...prev,
                    name: data.username || prev.name,
                    email: data.email || prev.email,
                    coins: data.coins,
                    exp: data.exp,
                }));
            })
            .catch(() => {});
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

            {/* Background Blobs for Glassmorphism */}
            <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-sky-300/30 dark:bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-pink-300/30 dark:bg-pink-500/10 rounded-full blur-[150px] pointer-events-none"></div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/30 dark:bg-gray-900/40 backdrop-blur-xl border-b border-white/50 dark:border-gray-700 shadow-sm transition-colors duration-300">
                <div className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-3 items-center px-4 py-4 sm:px-6">
                    {/* Left */}
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-sm border border-white/60 bg-white dark:border-gray-600 dark:bg-gray-800">
                            <img src={Logo} alt="Logo" className="w-full h-full object-cover transition duration-300 hover:scale-110" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-[15px] sm:text-xl text-gray-900 dark:text-white tracking-tight">APM AI</h1>
                            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 font-medium">🌷 ผู้ช่วยที่เป็นเพื่อนที่ดีสำหรับคุณ</p>
                        </div>
                    </div>

                    {/* Center */}
                    <div className="hidden lg:flex justify-center">
                        <div className="bg-white/50 dark:bg-gray-800/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/60 dark:border-gray-600 shadow-sm">
                            <Navbar />
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex justify-end gap-3 items-center">
                        {/* Notification Button */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNoti(true)}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-sm hover:scale-105 transition active:scale-95 border border-white dark:border-gray-600"
                            >
                                <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-gray-700 dark:text-gray-200">notifications</span>
                            </button>
                            <span className="absolute top-0 right-0 size-2.5 rounded-full bg-red-500 shadow-sm ring-2 ring-white dark:ring-gray-800" />

                            <Notification
                                show={showNoti}
                                type="info"
                                title="APM AI แจ้งเตือน"
                                message="สู้ๆน้า วันนี้เธอทำได้แน่นอน 💖✨"
                                onClose={() => setShowNoti(false)}
                                autoClose={true}
                                duration={3000}
                            />
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

                    {/* Cover Photo */}
                    <div className="h-40 sm:h-48 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 dark:from-pink-900/50 dark:via-purple-900/50 dark:to-indigo-900/50 relative">
                        {/* Edit Cover Button (Ornamental) */}
                        <button className="absolute top-4 right-4 bg-white/30 hover:bg-white/50 dark:bg-black/30 dark:hover:bg-black/50 backdrop-blur-md p-2 rounded-xl transition text-white shadow-sm border border-white/40">
                            <span className="material-symbols-outlined text-sm">edit</span>
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
                                    Joined {user.joinedDate}
                                </p>
                            </div>
                        </div>

                        {/* Two Columns Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Account Info Panel */}
                            <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 dark:border-gray-700/50 shadow-sm">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">account_circle</span> Account Details
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 bg-white/70 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100/50 dark:border-gray-700/50">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 flex items-center justify-center">
                                            <span className="material-symbols-outlined">mail</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Email Address</p>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-white/70 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100/50 dark:border-gray-700/50">
                                        <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 dark:text-yellow-400 flex items-center justify-center">
                                            <span className="material-symbols-outlined">toll</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Coins</p>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">{user.coins} 🪙</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-white/70 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100/50 dark:border-gray-700/50">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400 flex items-center justify-center">
                                            <span className="material-symbols-outlined">star</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">EXP</p>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">{user.exp} XP</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-white/70 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100/50 dark:border-gray-700/50">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400 flex items-center justify-center">
                                            <span className="material-symbols-outlined">badge</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Student ID</p>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">{user.studentId}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-white/70 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100/50 dark:border-gray-700/50">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400 flex items-center justify-center">
                                            <span className="material-symbols-outlined">school</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">University / Faculty</p>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">Kasetsart University</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Settings Panel */}
                            <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 dark:border-gray-700/50 shadow-sm flex flex-col">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">settings</span> App Settings
                                </h3>

                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-4 bg-white/70 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100/50 dark:border-gray-700/50">
                                        <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-500 dark:text-pink-400 flex items-center justify-center">
                                            <span className="material-symbols-outlined">smart_toy</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Current AI Preference</p>
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
                                                <p className="font-bold text-gray-800 dark:text-gray-200">Dark Theme</p>
                                                <p className="text-[11px] text-gray-500 font-medium">Switch between Light / Dark</p>
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
                                        <span className="material-symbols-outlined">logout</span> Log Out Let's Go
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