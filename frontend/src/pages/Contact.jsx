import React from "react"
import { Github, Instagram } from "lucide-react"
import Navbar from "../components/Navbar"
import Logo from "../assets/logo.png"
import CuteGirlIcon from "../assets/Girl.png"


const Contact = () => {
    const developers = [
        {
            id: 1,
            name: "Supinyo Moontan",
            image: "/src/assets/2.png",
            position: "UX/UI Designer",
            ig: "https://www.instagram.com/marque.k_/",
        },
        {
            id: 2,
            name: "Thanapol Khampimpit",
            image: "/src/assets/1.png",
            position: "Frontend Developer",
            ig: "https://www.instagram.com/punz_tnp/",
            github: "https://github.com/Thanapolkpp",
        },
        {
            id: 3,
            name: "Tharatap Tape",
            image: "/src/assets/3.png",
            position: "Backend Developer",
            ig: "https://www.instagram.com/chaje_e/",
            github: "https://github.com/Tharatap",
        },
    ]

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#1a234e]">
            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 size-[28rem] md:size-[34rem] bg-blue-600/20 rounded-full blur-[110px]" />
                <div className="absolute -bottom-24 -left-24 size-[28rem] md:size-[34rem] bg-purple-600/20 rounded-full blur-[110px]" />
            </div>

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
                            <h1 className="truncate text-[15px] sm:text-xl font-extrabold tracking-tight leading-none text-white drop-shadow-sm">
                                <span className="sm:hidden">APM AI</span>
                                <span className="hidden sm:inline">
                                    APM AI
                                </span>
                            </h1>

                            <p className="truncate text-[10px] sm:text-[11px] font-semibold text-white/70">
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

                    {/* ✅ Right */}
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
            <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-16">
                {/* Header text */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-white text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none italic">
                        Developer
                    </h2>
                    <p className="mt-3 text-white/90 text-lg md:text-2xl font-extrabold tracking-tight uppercase italic">
                        Website by AI for Gen Z
                    </p>
                    <p className="mt-2 text-white/60 text-sm md:text-base font-medium">
                        ทีมผู้พัฒนา APM AI ✨
                    </p>
                </div>

                {/* ✅ Team (Mobile = 1 col, Desktop = 3 col) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-end">
                    {developers.map((dev, index) => (
                        <div
                            key={dev.id}
                            className={`group relative flex flex-col items-center transition-all duration-500
              ${index === 1 ? "md:-mt-8" : ""}`}
                        >
                            {/* Image */}
                            <div className={`relative transition-all duration-500 group-hover:-translate-y-3 ${index === 1 ? "md:scale-110" : "md:scale-95"}`}>
                                <div className="w-64 sm:w-72 md:w-80 h-[320px] sm:h-[360px] md:h-[500px] overflow-hidden flex items-end justify-center">
                                    <img
                                        src={dev.image}
                                        alt={dev.name}
                                        className="w-full h-full object-contain object-bottom translate-y-6 drop-shadow-[0_25px_25px_rgba(0,0,0,0.6)]"
                                    />

                                </div>
                                -
                                {/* Badge */}
                                <div className="absolute bottom-8 left-0 right-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="bg-black/50 text-white py-1.5 px-4 rounded-full w-fit mx-auto backdrop-blur-md text-xs md:text-sm">
                                        {dev.position}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Card */}
                            <div className="mt-4 bg-white/10 md:bg-white/5 backdrop-blur-xl p-5 rounded-3xl w-full max-w-[20rem] border border-white/15 text-center shadow-2xl group-hover:bg-white/15 transition-colors">
                                <h3 className="text-white text-lg font-extrabold truncate">
                                    {dev.name}
                                </h3>

                                <p className="mt-1 text-blue-200 text-sm font-bold uppercase tracking-wider truncate">
                                    {dev.position}
                                </p>

                                <div className="mt-4 flex justify-center gap-4">
                                    <a
                                        href={dev.ig}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-2xl text-white hover:scale-110 active:scale-95 transition-all shadow-lg"
                                    >
                                        <Instagram size={20} />
                                    </a>

                                    {dev.github && (
                                        <a
                                            href={dev.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-black/40 rounded-2xl text-white hover:scale-110 active:scale-95 transition-all border border-white/20 shadow-lg"
                                        >
                                            <Github size={20} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-14 text-center text-white/50 text-xs font-bold tracking-widest uppercase">
                    APM AI • Assistant for Personal Motivation 💖
                </div>
            </main>
        </section>
    )
}

export default Contact
