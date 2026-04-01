import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/footer";
import Logo from "../assets/logo.png";
import BroIcon from "../assets/Bro.png";
import NerdIcon from "../assets/Nerd.1.2.png";
import CuteGirlIcon from "../assets/Girl.png";

const Event = () => {
    const navigate = useNavigate();

    const [profileImage] = React.useState(() => {
        if (!localStorage.getItem("token")) return Logo;
        const savedImage = localStorage.getItem("avatarImage");
        if (savedImage) return savedImage;
        const savedAvatar = localStorage.getItem("avatar") || "bro";
        const map = { girl: CuteGirlIcon, nerd: NerdIcon, bro: BroIcon };
        return map[savedAvatar.toLowerCase()] || BroIcon;
    });

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
            {/* ✅ Header */}
            <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-xl">
                <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-4 py-4 sm:px-6">
                    {/* ✅ Left */}
                    <div className="flex items-center gap-3 shrink-0" onClick={() => navigate("/")}>
                        <div className="relative size-11 sm:size-12 shrink-0 overflow-hidden rounded-2xl bg-white/20 ring-2 ring-pink-300/50 shadow-md">
                            <img
                                src={Logo}
                                alt="Logo"
                                className="h-full w-full object-cover transition duration-300 hover:scale-110"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-pink-200/30 via-transparent to-blue-200/20" />
                        </div>

                        <div className="min-w-0 hidden sm:block">
                            <h1 className="truncate text-xl font-extrabold tracking-tight leading-none text-black dark:text-white">
                                APM AI
                            </h1>
                            <p className="truncate text-[10px] sm:text-[11px] font-semibold text-black/70 dark:text-white/60">
                                🌷 ผู้ช่วยที่เป็นเพื่อนที่ดีสำหรับคุณ
                            </p>
                        </div>
                    </div>

                    {/* ✅ Center: Navbar (Desktop Only) */}
                    <div className="hidden lg:flex flex-1 justify-center px-4">
                        <Navbar />
                    </div>

                    {/* ✅ Right */}
                    <div className="flex justify-end items-center gap-3 shrink-0">
                        {/* Notification */}
                        <button className="relative size-9 sm:size-10 rounded-full flex items-center justify-center bg-white/90 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-105 active:scale-95">
                            <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-gray-700 dark:text-gray-200">
                                notifications
                            </span>
                            <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
                        </button>

                        {/* ✅ Avatar */}
                        <button
                            type="button"
                            onClick={() => navigate(localStorage.getItem("token") ? "/account" : "/login")}
                            className="size-9 sm:size-10 rounded-full bg-cover bg-center border-2 border-primary/70 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-sm"
                            style={{
                                backgroundImage: `url("${profileImage}")`,
                                backgroundColor: "white"
                            }}
                            title="Account"
                            aria-label="Account"
                        />

                        {/* Mobile Navbar */}
                        <div className="lg:hidden">
                            <Navbar />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="text-center bg-white/70 dark:bg-gray-800/40 backdrop-blur-md border border-white/40 dark:border-gray-700 rounded-[2.5rem] shadow-xl px-10 py-12 max-w-xl w-full">
                    <p className="text-sm font-bold text-pink-500 dark:text-pink-400 mb-3">
                        Event Feature
                    </p>

                    <h1 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-white mb-4">
                        COMING SOON
                    </h1>

                    <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                        ฟีเจอร์ Event กำลังอยู่ระหว่างพัฒนา <br />
                        อีกไม่นานจะมาให้ใช้งานแน่นอนน้า
                    </p>

                    <div className="mt-8 flex justify-center">
                        <div className="h-[6px] w-28 rounded-full bg-gradient-to-r from-pink-400/60 to-sky-400/60 blur-[1px]" />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Event;
