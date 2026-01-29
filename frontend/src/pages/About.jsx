import React from "react"
import { useNavigate } from "react-router-dom"
import {
    HiOutlineLightBulb,
    HiOutlineUserGroup,
    HiOutlineShieldCheck,
} from "react-icons/hi"
import Navbar from "../components/Navbar"
import Logo from "../assets/logo.png"
import CuteGirlIcon from "../assets/Girl.png"



const About = () => {
    const navigate = useNavigate()

    const features = [
        {
            icon: <HiOutlineLightBulb />,
            title: "Smart Learning",
            description: "AI ที่ช่วยสรุปบทเรียนและตอบข้อสงสัยทางการเรียนของคุณได้ทันที",
        },
        {
            icon: <HiOutlineUserGroup />,
            title: "Diverse Personalities",
            description:
                "เลือกคุยกับ AI หลายบุคลิก ไม่ว่าจะเป็นสายชิลล์ (Bro) หรือสายเนิร์ด (Nerd)",
        },
        {
            icon: <HiOutlineShieldCheck />,
            title: "Student Privacy",
            description: "ข้อมูลของคุณปลอดภัยและเน้นการใช้งานเพื่อพัฒนาการเรียนโดยเฉพาะ",
        },
    ]

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display relative overflow-hidden">
            {/* Background Decor */}
            <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />
            <div className="pointer-events-none absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10" />

            {/* ✅ Header (Cute + Soft) */}
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
                            {/* cute shine */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-pink-200/30 via-transparent to-blue-200/20" />
                        </div>

                        {/* Title */}
                        <div className="min-w-0">
                            <h1 className="truncate text-[15px] sm:text-xl font-extrabold tracking-tight leading-none text-black drop-shadow-sm dark:text-white">
                                <span className="sm:hidden">APM AI</span>
                                <span className="hidden sm:inline">
                                    Assistant for Personal Motivation
                                </span>
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
                        <button className="relative size-9 sm:size-10 rounded-full flex items-center justify-center bg-white/90 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-105 active:scale-95">
                            <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-gray-700 dark:text-gray-200">
                                notifications
                            </span>
                            <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
                        </button>

                        {/* Avatar */}
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="size-9 sm:size-10 rounded-full bg-cover bg-center border-2 border-primary/70 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-sm"
                            style={{
                                backgroundImage: `url("${CuteGirlIcon}")`,
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




            {/* ✅ Main */}
            <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">

                {/* Cute Badge */}
                <div
                    className="inline-flex items-center gap-2 px-5 py-2 mb-6 rounded-full
    bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-sky-400/20
    text-gray-900 dark:text-white font-extrabold text-sm tracking-widest
    shadow-sm border border-gray-200/70 dark:border-white/20"
                >
                    About APM AI
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight text-gray-900 dark:text-white">
                    The AI Companion for <br />
                    <span className="relative inline-block">
                        <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 bg-clip-text text-transparent">
                            Next-Gen Students
                        </span>
                        {/* underline glow */}
                        <span className="absolute -bottom-2 left-0 w-full h-[10px] rounded-full bg-pink-400/20 blur-md" />
                    </span>
                </h1>


                <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                    APM AI (Assistant for Personal Motivation) ถูกสร้างขึ้นมาเพื่อเปลี่ยนประสบการณ์การเรียนของนิสิตให้ง่ายขึ้น
                    เราผสานเทคโนโลยี AI ล้ำสมัยเข้ากับบุคลิกที่เข้าใจนักศึกษา
                    เพื่อเป็นเพื่อนคู่คิดในทุกก้าวย่างของชีวิตมหาวิทยาลัย ✨🌷
                </p>

                {/* ✅ Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-14 text-left">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="group p-7 md:p-8 rounded-[32px]
        border border-gray-200/70 dark:border-white/10
        bg-white shadow-sm
        dark:bg-white/5 dark:backdrop-blur-xl
        hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Icon Bubble */}
                            <div
                                className="inline-flex items-center justify-center size-12 rounded-2xl
          bg-gradient-to-tr from-pink-400/20 via-purple-400/20 to-sky-400/20
          border border-gray-200/70 dark:border-white/15 shadow-sm mb-4"
                            >
                                <div className="text-2xl text-gray-900 dark:text-white group-hover:text-pink-400 transition">
                                    {f.icon}
                                </div>

                            </div>

                            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 group-hover:translate-x-1 transition duration-300">
                                {f.title}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                {f.description}
                            </p>

                            {/* Cute glow bottom */}
                            <div className="mt-5 h-[6px] w-16 rounded-full bg-gradient-to-r from-pink-400/50 to-sky-400/40 blur-[1px]" />
                        </div>
                    ))}
                </div>

            </main>


        </div>
    )
}

export default About
