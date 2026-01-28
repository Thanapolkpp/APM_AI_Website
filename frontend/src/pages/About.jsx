import React from "react"
import { useNavigate } from "react-router-dom"
import {
    HiOutlineLightBulb,
    HiOutlineUserGroup,
    HiOutlineShieldCheck,
} from "react-icons/hi"
import Navbar from "../components/Navbar"

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

            {/* ✅ Header */}
            <header className="sticky top-0 z-50 w-full bg-background-light/70 dark:bg-background-dark/70 backdrop-blur-xl border-b border-white/40 dark:border-gray-800">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="font-extrabold text-lg text-gray-800 dark:text-white">
                        APM AI
                    </div>
                    <Navbar />
                </div>
            </header>

            {/* ✅ Main */}
            <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest">
                    About APM AI
                </div>

                <h1 className="text-4xl md:text-7xl font-black text-gray-800 dark:text-white mb-6 leading-tight">
                    The AI Companion for <br />
                    <span className="text-primary">Next-Gen Students</span>
                </h1>

                <p className="text-base md:text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                    APM AI (Assistant for Personal Motivation) ถูกสร้างขึ้นมาเพื่อเปลี่ยนประสบการณ์การเรียนของนิสิตให้ง่ายขึ้น
                    เราผสานเทคโนโลยี AI ล้ำสมัยเข้ากับบุคลิกที่เข้าใจนักศึกษา
                    เพื่อเป็นเพื่อนคู่คิดในทุกก้าวย่างของชีวิตมหาวิทยาลัย ✨
                </p>

                {/* ✅ Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-14 text-left">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="p-7 md:p-8 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/30 dark:border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="text-3xl text-primary mb-4">{f.icon}</div>
                            <h3 className="text-xl font-extrabold text-gray-800 dark:text-white mb-2">
                                {f.title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                {f.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ✅ Button */}
                <button
                    onClick={() => navigate("/")}
                    className="px-10 py-4 bg-primary text-white rounded-2xl font-extrabold text-base md:text-lg shadow-xl shadow-primary/30 hover:brightness-110 active:scale-95 transition-all"
                >
                    Go Back Home 🏠
                </button>
            </main>
        </div>
    )
}

export default About
