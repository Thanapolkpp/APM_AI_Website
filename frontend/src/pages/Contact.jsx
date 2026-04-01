import React from "react"
import { useNavigate } from "react-router-dom"
import { Github, Instagram } from "lucide-react"
import Navbar from "../components/Layout/Navbar"
import Logo from "../assets/logo.png"
import BroIcon from "../assets/Bro.png"
import NerdIcon from "../assets/Nerd.1.2.png"
import CuteGirlIcon from "../assets/Girl.png"

const Contact = () => {
    const navigate = useNavigate()

    const [profileImage] = React.useState(() => {
        if (!localStorage.getItem("token")) return Logo;
        const savedImage = localStorage.getItem("avatarImage");
        if (savedImage) return savedImage;
        const savedAvatar = localStorage.getItem("avatar") || "bro";
        const map = { girl: CuteGirlIcon, nerd: NerdIcon, bro: BroIcon };
        return map[savedAvatar.toLowerCase()] || BroIcon;
    });

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
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display relative overflow-hidden transition-colors duration-300">
            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 size-[34rem] bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-[110px]" />
                <div className="absolute -bottom-24 -left-24 size-[34rem] bg-primary/15 dark:bg-primary/10 rounded-full blur-[110px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[40rem] bg-purple-300/10 dark:bg-purple-500/5 rounded-full blur-[130px]" />
            </div>

            <div className="flex flex-col min-h-screen relative z-10 w-full max-w-7xl mx-auto md:px-6">
                <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-xl">
                    <div className="mx-auto grid w-full max-w-7xl grid-cols-2 items-center px-4 py-4 sm:px-6 md:grid-cols-3">
                        <div className="flex min-w-0 items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                            <div className="relative size-11 sm:size-12 shrink-0 overflow-hidden rounded-2xl bg-white/20 ring-2 ring-pink-300/50 shadow-md">
                                <img src={Logo} alt="Logo" className="h-full w-full object-cover transition duration-300 hover:scale-110" />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-pink-200/30 via-transparent to-blue-200/20" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="truncate text-[15px] sm:text-xl font-extrabold tracking-tight leading-none text-gray-900 dark:text-white drop-shadow-sm">APM AI</h1>
                                <p className="truncate text-[10px] sm:text-[11px] font-semibold text-gray-500 dark:text-gray-400">🌷 ทีมผู้พัฒนาสุดเท่</p>
                            </div>
                        </div>
                        <div className="hidden md:flex justify-center">
                            <div className="rounded-full border border-white/20 bg-white/15 px-6 py-2 shadow-sm">
                                <Navbar />
                            </div>
                        </div>
                        <div className="flex justify-end items-center gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(localStorage.getItem("token") ? "/account" : "/login")}
                                className="size-10 rounded-full bg-cover bg-center border-2 border-primary/70 cursor-pointer hover:scale-105 transition-all shadow-sm"
                                style={{ backgroundImage: `url("${profileImage}")`, backgroundColor: "white" }}
                            />
                            <div className="md:hidden"><Navbar /></div>
                        </div>
                    </div>
                </header>

                <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-6 py-2.5 mb-6 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md shadow-sm border border-white/60 dark:border-white/10 text-primary font-black text-sm tracking-widest uppercase">
                            The Creators ✨
                        </div>
                        <h2 className="text-gray-900 dark:text-white text-5xl md:text-7xl font-black tracking-tight leading-tight">
                            Website by <br />
                            <span className="bg-gradient-to-r from-primary via-pink-400 to-primary bg-clip-text text-transparent">AI for Gen Z</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {developers.map((dev, index) => (
                            <div
                                key={dev.id}
                                className={`group relative flex flex-col items-center transition-all duration-500 ${index === 1 ? "md:-mt-8" : ""}`}
                            >
                                <div className={`relative transition-all duration-500 group-hover:-translate-y-4 ${index === 1 ? "md:scale-110" : "md:scale-95"}`}>
                                    <div className="w-full max-w-[320px] aspect-[3/4] bg-white/40 dark:bg-white/5 backdrop-blur-2xl rounded-[48px] border border-white/60 dark:border-white/10 shadow-xl overflow-hidden flex items-end justify-center p-6">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <img
                                            src={dev.image}
                                            alt={dev.name}
                                            className="w-full h-full object-contain object-bottom drop-shadow-2xl translate-y-4 group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-6 py-2 rounded-2xl shadow-xl border border-white/50 dark:border-white/10 text-xs font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                                        {dev.position}
                                    </div>
                                </div>

                                <div className="mt-8 bg-white/60 dark:bg-white/5 backdrop-blur-2xl p-8 rounded-[40px] w-full max-w-[20rem] border border-white/60 dark:border-white/10 text-center shadow-xl group-hover:shadow-2xl transition-all">
                                    <h3 className="text-gray-900 dark:text-white text-xl font-black mb-1">{dev.name}</h3>
                                    <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">{dev.position}</p>
                                    
                                    <div className="flex justify-center gap-4">
                                        <a href={dev.ig} target="_blank" rel="noopener noreferrer" className="size-12 rounded-2xl bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg hover:shadow-pink-500/30">
                                            <Instagram size={24} />
                                        </a>
                                        {dev.github && (
                                            <a href={dev.github} target="_blank" rel="noopener noreferrer" className="size-12 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg border border-white/20">
                                                <Github size={24} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-24 text-center">
                        <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto mb-8" />
                        <p className="text-gray-400 font-black text-[11px] tracking-[0.4em] uppercase">APM AI • Personal Motivation Engine 💖</p>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Contact
