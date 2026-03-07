import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/footer";
import Logo from "../assets/logo.png";
import CuteGirlIcon from "../assets/Girl.png";
import BroIcon from "../assets/Bro.png";
import NerdIcon from "../assets/Nerd.1.2.png";
import {
    HiOutlineLightBulb,
    HiOutlineUserGroup,
    HiOutlineShieldCheck,
    HiOutlineHeart,
    HiOutlineLightningBolt,
    HiOutlineChartBar
} from "react-icons/hi";

const About = () => {
    const navigate = useNavigate();

    const [profileImage] = React.useState(() => {
        if (!localStorage.getItem("token")) return Logo;
        const savedImage = localStorage.getItem("avatarImage");
        if (savedImage) return savedImage;
        const savedAvatar = localStorage.getItem("avatar") || "bro";
        const map = { girl: CuteGirlIcon, nerd: NerdIcon, bro: BroIcon };
        return map[savedAvatar.toLowerCase()] || BroIcon;
    });

    const features = [
        {
            icon: <HiOutlineLightBulb />,
            title: "Smart Learning",
            description: "เรียนรู้ได้อย่างชาญฉลาดด้วย AI ที่คอยช่วยสรุปประเด็นหลักจากบทเรียนที่ซับซ้อนให้เข้าใจง่าย เหมือนมีติวเตอร์ส่วนตัวตลอดเวลา",
            color: "from-amber-400 to-orange-400"
        },
        {
            icon: <HiOutlineUserGroup />,
            title: "Diverse Personalities",
            description: "ไม่ว่าคุณจะชอบคุยแบบเพื่อนซี้ แบบวัยรุ่นชิลๆ หรือแบบเนิร์ดสายวิชาการ เรามี AI หลายบุคลิกให้คุณเลือกเพื่อการเรียนรู้ที่ไม่น่าเบื่อ",
            color: "from-pink-400 to-rose-400"
        },
        {
            icon: <HiOutlineShieldCheck />,
            title: "Safe Environment",
            description: "พื้นที่การเรียนรู้ที่รู้สึกปลอดภัย ไม่มีใครตัดสิน ช่วยให้คุณสามารถถามคำถามและแบ่งปันปัญหาเรื่องเรียนได้อย่างสบายใจ 100%",
            color: "from-emerald-400 to-teal-500"
        },
        {
            icon: <HiOutlineHeart />,
            title: "Emotional Support",
            description: "ไม่ใช่แค่ช่วยเรื่องเรียน แต่ยังคอยให้กำลังใจในวันที่เหนื่อยล้า เพื่อบูสต์พลังการเรียนและความหวังดีให้คุณพุ่งกระฉูด",
            color: "from-purple-400 to-indigo-500"
        },
        {
            icon: <HiOutlineLightningBolt />,
            title: "Lightning Fast API",
            description: "ทำงานด้วยระบบประมวลผลด่วนจี๋ ให้คำปรึกษาและตอบคำถามแบบรวดเร็วทันใจ พร้อมลุยตลอด 24 ชั่วโมง ไม่มีพัก!",
            color: "from-yellow-400 to-yellow-600"
        },
        {
            icon: <HiOutlineChartBar />,
            title: "Track Progression",
            description: "ติดตามความก้าวหน้าและการพัฒนาในทักษะต่างๆ ผ่านรูปแบบที่เข้าใจง่าย ให้เห็นว่าวันนี้คุณเก่งขึ้นกว่าเมื่อวานแค่ไหน",
            color: "from-sky-400 to-blue-500"
        }
    ];

    const ais = [
        {
            name: "Girl (Bestie)",
            image: CuteGirlIcon,
            role: "Motivation & Encouragement",
            desc: "เพื่อนสาวสุดคิวท์ที่คอยส่งกำลังใจให้คุณเสมอ เหมาะสำหรับวันที่ต้องการพลังบวก",
            border: "border-pink-300",
            bg: "bg-pink-50",
            shadow: "shadow-[0_0_30px_rgba(244,114,182,0.3)]",
            text: "text-pink-600"
        },
        {
            name: "Bro (Chill Mate)",
            image: BroIcon,
            role: "Relaxed & Casual",
            desc: "เพื่อนซี้สายชิลล์ คุยง่าย สบายๆ ช่วยอธิบายเรื่องยากให้กลายเป็นเรื่องคุยเล่น",
            border: "border-sky-300",
            bg: "bg-sky-50",
            shadow: "shadow-[0_0_30px_rgba(56,189,248,0.3)]",
            text: "text-sky-600"
        },
        {
            name: "Nerd (Academic)",
            image: NerdIcon,
            role: "Deep Knowledge & Stats",
            desc: "สายวิชาการตัวจริง ข้อมูลแน่นเป๊ะ อ้างอิงได้ เหมาะสำหรับสืบคืนข้อมูลทำรายงาน",
            border: "border-emerald-300",
            bg: "bg-emerald-50",
            shadow: "shadow-[0_0_30px_rgba(52,211,153,0.3)]",
            text: "text-emerald-600"
        }
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display relative overflow-hidden transition-colors duration-300">
            {/* Background Decorations */}
            <div className="pointer-events-none absolute -top-40 -left-20 size-[500px] rounded-full bg-pink-300/20 blur-[120px]" />
            <div className="pointer-events-none absolute top-80 -right-20 size-[600px] rounded-full bg-blue-300/20 blur-[150px]" />
            <div className="pointer-events-none absolute -bottom-40 left-1/3 size-[500px] rounded-full bg-purple-300/20 blur-[130px]" />

            <div className="flex flex-col min-h-screen relative z-10 w-full max-w-7xl mx-auto md:px-6">

                {/* ✅ Header Customizations */}
                <header className="sticky top-0 z-50 w-full md:mt-2 md:rounded-3xl border-b md:border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
                    <div className="mx-auto grid w-full grid-cols-2 items-center px-4 py-3 sm:px-6 md:grid-cols-3">

                        {/* ✅ Left (Logo) */}
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="relative size-11 sm:size-12 shrink-0 overflow-hidden rounded-2xl bg-white/20 ring-2 ring-pink-300/50 shadow-md">
                                <img
                                    src={Logo}
                                    alt="Logo"
                                    className="h-full w-full object-cover transition duration-300 hover:scale-110"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-pink-200/30 via-transparent to-blue-200/20" />
                            </div>

                            <div className="min-w-0">
                                <h1 className="truncate text-[15px] sm:text-lg font-extrabold tracking-tight leading-none text-gray-800 dark:text-white drop-shadow-sm">
                                    APM AI
                                </h1>
                                <p className="truncate text-[10px] sm:text-[11px] font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
                                    Assistant for Personal Motivation ✨
                                </p>
                            </div>
                        </div>

                        {/* ✅ Center (Navbar - Desktop) */}
                        <div className="hidden md:flex justify-center">
                            <div className="rounded-full shadow-inner bg-black/5 dark:bg-white/5 border border-white/10 px-4 py-1.5 backdrop-blur-md">
                                <Navbar />
                            </div>
                        </div>

                        {/* ✅ Right (Actions) */}
                        <div className="flex items-center justify-end gap-3 sm:gap-4">
                            {/* Notification */}
                            <button className="relative flex items-center justify-center size-9 sm:size-10 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 shadow-sm transition hover:-translate-y-0.5 active:scale-95">
                                <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-gray-700 dark:text-gray-200">notifications</span>
                                <span className="absolute top-2 right-2 size-2 rounded-full bg-pink-500 ring-2 ring-white dark:ring-gray-800 animate-pulse" />
                            </button>

                            {/* Avatar */}
                            <button
                                type="button"
                                onClick={() => navigate(localStorage.getItem("token") ? "/account" : "/login")}
                                className="size-9 sm:size-10 rounded-full bg-cover bg-center border-2 border-primary/70 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-sm"
                                style={{
                                    backgroundImage: `url("${profileImage}")`,
                                    backgroundColor: "white"
                                }}
                                title="Go to Login"
                                aria-label="Go to login"
                            />
                            {/* Mobile Nav */}
                            <div className="lg:hidden ml-2">
                                <Navbar />
                            </div>
                        </div>
                    </div>
                </header>

                {/* ================= HERO SECTION ================= */}
                <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2.5 mb-8 rounded-full bg-white/60 backdrop-blur-md shadow-sm border border-white text-pink-600 font-bold text-sm tracking-wide hover:scale-105 transition-transform cursor-default">
                        <span className="animate-pulse">✨</span> Discover The Future of Learning
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-[80px] font-black mb-8 leading-[1.1] text-gray-900 drop-shadow-sm">
                        Your True <br className="hidden md:block" />
                        <span className="relative inline-block mt-2">
                            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                                Academic Companion
                            </span>
                        </span>
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                        APM AI (Assistant for Personal Motivation) ถูกออกแบบมาเพื่อเปลี่ยนวิธีการเรียนของคนรุ่นใหม่
                        เราผสานเทคโนโลยี AI อันทรงพลังเข้ากับบุคลิกที่เข้าใจง่าย เป็นมิตร
                        เพื่อเป็นเพื่อนคู่คิดในทุกก้าวย่างของชีวิตมหาวิทยาลัยของคุณ
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                        <button onClick={() => navigate("/chat/girl")} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all">
                            Try It Now ✨
                        </button>
                        <button className="px-8 py-4 rounded-2xl bg-white text-gray-800 font-bold text-lg shadow-sm hover:shadow-md hover:bg-gray-50 hover:scale-105 transition-all border border-gray-100 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">play_circle</span> Watch Demo
                        </button>
                    </div>
                </section>

                {/* ================= STATS / HIGHLIGHTS ================= */}
                <section className="relative z-10 max-w-6xl mx-auto px-6 py-10 mb-20 block">
                    <div className="bg-white/40 backdrop-blur-2xl border border-white/60 shadow-xl rounded-[40px] p-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/50">
                            <div className="text-center px-4">
                                <div className="text-5xl font-black bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent mb-2">24/7</div>
                                <div className="text-gray-600 font-bold text-lg">Availability</div>
                                <p className="text-sm text-gray-500 mt-2">พร้อมช่วยเหลือคุณทุกเวลาไม่ว่าดึกแค่ไหน</p>
                            </div>
                            <div className="text-center px-4 pt-8 md:pt-0">
                                <div className="text-5xl font-black bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent mb-2">3+</div>
                                <div className="text-gray-600 font-bold text-lg">AI Personalities</div>
                                <p className="text-sm text-gray-500 mt-2">ตอบโจทย์ทุกอารมณ์และสไตล์การเรียนรู้</p>
                            </div>
                            <div className="text-center px-4 pt-8 md:pt-0">
                                <div className="text-5xl font-black bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent mb-2">100%</div>
                                <div className="text-gray-600 font-bold text-lg">Safe & Private</div>
                                <p className="text-sm text-gray-500 mt-2">ข้อมูลการเรียนของคุณถูกเก็บเป็นความลับ</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= CORE FEATURES ================= */}
                <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Why Choose APM AI?</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">ฟีเจอร์เด่นที่ทำให้เราเป็นผู้ช่วยเบอร์ 1 ของนักศึกษา</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                        {features.map((f, i) => (
                            <div key={i} className="group p-8 rounded-[32px] bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                                {/* Hover background effect */}
                                <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${f.color} rounded-full blur-[40px] opacity-20 group-hover:opacity-60 transition-opacity duration-500`}></div>

                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg bg-gradient-to-br ${f.color} mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition duration-300`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-pink-600 transition duration-300">{f.title}</h3>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    {f.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>



                {/* ================= FOOTER ================= */}
                <Footer />
            </div>
        </div>
    );
};

export default About;
