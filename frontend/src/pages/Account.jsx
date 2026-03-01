import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Logo from "../assets/logo.png";

import BroIcon from "../assets/Bro.png";
import CuteGirlIcon from "../assets/Girl.png";
import NerdIcon from "../assets/Nerd.1.2.png";

import Notification from "../components/Notification";

const Account = () => {
    const navigate = useNavigate();

    const [user] = useState({
        name: "Bestie User",
        email: "bestie@university.ac.th",
        studentId: "66010xxx",
        major: "Computer Science",
        joinedDate: "January 2024",
        preferredMode: "Cute Girl Mode",
    });

    // รูปภาพสำรอง (Fallback) กรณีที่ยังไม่ได้เซฟรูป 3D
    const avatarMap = {
        girl: CuteGirlIcon,
        nerd: NerdIcon,
        Bro: BroIcon,
    };

    // 🌟 1. สร้าง State สำหรับเก็บ Source ของรูปภาพที่จะแสดง
    const [profileImage, setProfileImage] = useState(() => {
        // ลองหาว่ามีรูป 3D ที่ถูกถ่ายเก็บไว้ไหม
        const savedImage = localStorage.getItem("avatarImage");
        if (savedImage) return savedImage;

        // ถ้าไม่มีรูป 3D ให้กลับไปดูว่าเลือกตัวละคร id ไหนไว้ แล้วใช้รูป 2D แทน
        const savedAvatar = localStorage.getItem("avatar") || "Bro";
        return avatarMap[savedAvatar] || BroIcon;
    });

    useEffect(() => {
        // 🌟 2. อัปเดตเมื่อโหลดหน้าเว็บ
        const savedImage = localStorage.getItem("avatarImage");
        if (savedImage) {
            setProfileImage(savedImage);
        } else {
            const savedAvatar = localStorage.getItem("avatar") || "Bro";
            setProfileImage(avatarMap[savedAvatar] || BroIcon);
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

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#333333] dark:text-gray-100 transition-colors duration-300 font-display relative overflow-hidden">
            {/* Background Blobs */}
            <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-blue-300/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 size-80 rounded-full bg-pink-300/20 blur-3xl" />

            <div className="layout-container flex flex-col min-h-screen relative z-10">
                {/* Header */}
                <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-xl">
                    <div className="mx-auto grid w-full max-w-7xl grid-cols-2 items-center px-4 py-4 sm:px-6 md:grid-cols-3">
                        {/* ✅ Left */}
                        <div className="flex min-w-0 items-center gap-3">
                            {/* Logo */}
                            <div className="relative size-11 sm:size-12 shrink-0 overflow-hidden rounded-2xl bg-white/20 ring-2 ring-pink-300/50 shadow-md">
                                <img
                                    src={Logo}
                                    alt="Logo"
                                    className="h-full w-full object-cover transition duration-300 hover:scale-110"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-pink-200/30 via-transparent to-blue-200/20" />
                            </div>

                            {/* Title */}
                            <div className="min-w-0">
                                <h1 className="truncate text-[15px] sm:text-xl font-extrabold tracking-tight leading-none text-black drop-shadow-sm dark:text-white">
                                    <span className="sm:hidden">APM AI</span>
                                    <span className="hidden sm:inline">APM AI</span>
                                </h1>

                                <p className="truncate text-[10px] sm:text-[11px] font-semibold text-black/70 dark:text-white/70">
                                    🌷 ผู้ช่วยที่เป็นเพื่อนที่ดีสำหรับคุณ
                                </p>
                            </div>
                        </div>

                        {/* ✅ Center (Desktop) */}
                        <div className="hidden md:flex justify-center">
                            <div className="rounded-full border border-white/20 bg-white/15 px-6 py-2 shadow-sm">
                                <Navbar />
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex justify-end items-center gap-3">
                            {/* Notification */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowNoti(true)}
                                    className="relative size-9 sm:size-10 rounded-full flex items-center justify-center bg-white/90 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-105 active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-gray-700 dark:text-gray-200">
                                        notifications
                                    </span>

                                    <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
                                </button>

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

                            {/* 🌟 3. เปลี่ยนรูปใน Navbar ให้ดึงจาก profileImage */}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="size-9 sm:size-10 rounded-full bg-cover bg-center border-2 border-primary/70 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-sm"
                                style={{
                                    backgroundImage: `url("${profileImage}")`,
                                    backgroundColor: "white" // กันเหนียวเผื่อพื้นหลังใส
                                }}
                                title="Go to Login"
                                aria-label="Go to login"
                            />

                            {/* Mobile Navbar */}
                            <div className="md:hidden">
                                <Navbar />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex flex-col items-center px-6 py-10 max-w-4xl mx-auto w-full">
                    {/* Profile Card */}
                    <div className="w-full bg-white/60 dark:bg-gray-800/40 backdrop-blur-md rounded-[2.5rem] border border-white/40 dark:border-gray-700 shadow-xl overflow-hidden">
                        {/* Cover */}
                        <div className="h-32 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 dark:from-pink-900/40 dark:to-blue-900/40" />

                        <div className="px-8 pb-8">
                            <div className="relative -mt-16 flex flex-col items-center sm:flex-row sm:items-end sm:gap-6">

                                {/* 🌟 4. เปลี่ยนรูปโปรไฟล์ใหญ่ ให้ดึงจาก profileImage */}
                                <div className="size-32 rounded-3xl border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-white flex items-center justify-center">
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="mt-4 text-center sm:text-left flex-1">
                                    <h2 className="text-2xl font-black text-gray-800 dark:text-white">
                                        {user.name}
                                    </h2>
                                    <p className="text-pink-500 dark:text-pink-400 font-semibold">
                                        @{user.major}
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate("/avatar")}
                                    className="mt-4 px-6 py-2 bg-white dark:bg-gray-700 hover:bg-pink-50 dark:hover:bg-gray-600 text-pink-600 dark:text-pink-300 font-bold rounded-full border border-pink-100 dark:border-gray-600 transition-all shadow-sm active:scale-95"
                                >
                                    Edit Avatar
                                </button>
                            </div>

                            {/* Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                                {/* Account Details */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                                        Account Details
                                    </h3>

                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800">
                                        <span className="material-symbols-outlined text-blue-400">
                                            mail
                                        </span>
                                        <div>
                                            <p className="text-xs text-gray-500">Email Address</p>
                                            <p className="font-semibold">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800">
                                        <span className="material-symbols-outlined text-purple-400">
                                            badge
                                        </span>
                                        <div>
                                            <p className="text-xs text-gray-500">Student ID</p>
                                            <p className="font-semibold">{user.studentId}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* App Settings */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                                        App Settings
                                    </h3>

                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800">
                                        <span className="material-symbols-outlined text-pink-400">
                                            auto_awesome
                                        </span>
                                        <div>
                                            <p className="text-xs text-gray-500">Current AI Bestie</p>
                                            <p className="font-semibold">{user.preferredMode}</p>
                                        </div>
                                    </div>

                                    {/* ✅ Dark Mode Toggle */}
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-orange-400">
                                                dark_mode
                                            </span>
                                            <p className="font-semibold">Dark Mode</p>
                                        </div>

                                        <button
                                            onClick={toggleDarkMode}
                                            className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${isDark ? "bg-pink-500" : "bg-gray-300"
                                                }`}
                                            aria-label="Toggle dark mode"
                                        >
                                            <div
                                                className={`absolute top-1 size-4 bg-white rounded-full shadow-sm transition-all ${isDark ? "right-1" : "left-1"
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Sign out */}
                            <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-center">
                                <button
                                    onClick={() => navigate("/login")}
                                    className="flex items-center gap-2 text-red-400 hover:text-red-500 font-bold transition-colors"
                                >
                                    <span className="material-symbols-outlined">logout</span>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default Account;