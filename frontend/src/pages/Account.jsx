import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Logo from "../assets/logo.png";
import CuteGirlIcon from "../assets/Girl.png";

const Account = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "Bestie User",
        email: "bestie@university.ac.th",
        studentId: "66010xxx",
        major: "Computer Science",
        joinedDate: "January 2024",
        preferredMode: "Cute Girl Mode",
    });

    // ✅ Dark Mode State
    const [isDark, setIsDark] = useState(false);

    // ✅ โหลดค่าที่เคยตั้งไว้จาก localStorage + sync กับ html class
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme"); // "dark" | "light"
        const dark = savedTheme === "dark";
        setIsDark(dark);

        if (dark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    // ✅ Toggle Dark Mode จริง
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
                        {/* Left: Logo */}
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => navigate("/")}
                        >
                            <div className="relative size-10 shrink-0 overflow-hidden rounded-xl bg-white/20 ring-2 ring-pink-300/50">
                                <img src={Logo} alt="Logo" className="h-full w-full object-cover" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-black leading-none dark:text-white">
                                    APM AI
                                </h1>
                                <p className="text-[10px] font-bold opacity-70">
                                    Account Settings
                                </p>
                            </div>
                        </div>

                        {/* Center: Navbar */}
                        <div className="hidden md:flex justify-center">
                            <div className="rounded-full border border-white/20 bg-white/15 px-6 py-2 shadow-sm">
                                <Navbar />
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex justify-end items-center gap-3">
                            <button
                                onClick={() => navigate("/")}
                                className="hidden sm:flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-pink-500 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">home</span>
                                Home
                            </button>

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
                                {/* Avatar */}
                                <div className="size-32 rounded-3xl border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-white">
                                    <img
                                        src={CuteGirlIcon}
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

                                <button className="mt-4 px-6 py-2 bg-white dark:bg-gray-700 hover:bg-pink-50 dark:hover:bg-gray-600 text-pink-600 dark:text-pink-300 font-bold rounded-full border border-pink-100 dark:border-gray-600 transition-all shadow-sm active:scale-95">
                                    Edit Profile
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

                                    {/* ✅ Dark Mode Toggle ใช้ได้จริง */}
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
