import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/footer";
import { ASSETS } from "../config/assets";
import CoinBadge from "../components/UI/CoinBadge";
import {
    HiOutlineLightBulb,
    HiOutlineUserGroup,
    HiOutlineShieldCheck,
    HiOutlineHeart,
    HiOutlineLightningBolt,
    HiOutlineChartBar
} from "react-icons/hi";

const Logo = ASSETS.BRANDING.LOGO;
const CuteGirlIcon = ASSETS.AVATARS.GIRL;
const BroIcon = ASSETS.AVATARS.BRO;
const NerdIcon = ASSETS.AVATARS.NERD2; // Default Nerd

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display relative overflow-hidden transition-colors duration-300">
            {/* Background Decorations */}
            <div className="pointer-events-none absolute -top-40 -left-20 size-[500px] rounded-full bg-pink-300/20 dark:bg-pink-500/10 blur-[120px]" />
            <div className="pointer-events-none absolute top-80 -right-20 size-[600px] rounded-full bg-blue-300/20 dark:bg-primary/10 blur-[150px]" />
            <div className="pointer-events-none absolute -bottom-40 left-1/2 size-[500px] rounded-full bg-purple-300/20 dark:bg-purple-500/10 blur-[130px]" />

            <div className="flex flex-col min-h-screen relative z-10 w-full max-w-7xl mx-auto md:px-6">

                <header className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/60 dark:bg-black/20 backdrop-blur-xl transition-all">
                    <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-6 py-4">
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-3 cursor-pointer group" 
                            onClick={() => navigate("/")}
                        >
                            <div className="relative size-12 rounded-2xl bg-white shadow-xl ring-2 ring-pink-100 flex items-center justify-center overflow-hidden">
                                <img src={Logo} alt="Logo" className="size-8 object-contain transition duration-500 hover:scale-110" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-black text-gray-900 dark:text-white leading-tight">APM AI</h1>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Motivation Engine ✨</p>
                            </div>
                        </motion.div>

                        <div className="hidden lg:flex flex-1 justify-center px-4">
                            <Navbar />
                        </div>

                        <motion.div 
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex justify-end items-center gap-3 sm:gap-4 ml-auto lg:ml-0"
                        >
                            <div className="hidden sm:block">
                                <CoinBadge className="scale-90" />
                            </div>
                            <div
                                className="size-11 rounded-2xl border-2 border-white dark:border-white/10 cursor-pointer bg-white overflow-hidden shadow-lg hover:scale-110 active:scale-95 transition-all"
                                onClick={() => navigate(localStorage.getItem("token") ? "/account" : "/login")}
                            >
                                <img src={profileImage} alt="User" className="w-full h-full object-cover" />
                            </div>
                            <div className="lg:hidden">
                                <Navbar />
                            </div>
                        </motion.div>
                    </div>
                </header>

                {/* ================= HERO SECTION ================= */}
                <motion.section 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-2.5 mb-8 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md shadow-sm border border-white/60 dark:border-white/10 text-primary font-black text-sm tracking-widest uppercase cursor-default">
                        <span className="animate-pulse">✨</span> Discover The Future of Learning
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-[84px] font-black mb-8 leading-[1.05] text-gray-900 dark:text-white tracking-tighter">
                        Your True <br className="hidden md:block" />
                        <span className="bg-gradient-to-r from-primary via-pink-400 to-primary bg-clip-text text-transparent">
                            Academic Companion
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-bold">
                        APM AI (Assistant for Personal Motivation) ถูกออกแบบมาเพื่อเปลี่ยนวิธีการเรียนของคนรุ่นใหม่
                        เราผสานเทคโนโลยี AI อันทรงพลังเข้ากับบุคลิกที่เข้าถึงง่าย เพื่อเป็นเพื่อนคู่คิดในทุกก้าวนะครับ
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/chat/girl")} 
                            className="px-10 py-5 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all font-display"
                        >
                            เริ่มใช้งานฟรี ✨
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-5 rounded-2xl bg-white dark:bg-white/5 text-gray-900 dark:text-white font-black text-lg shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-white/10 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-2xl text-primary">play_circle</span> ดูตัวอย่าง
                        </motion.button>
                    </div>
                </motion.section>

                {/* ================= STATS / HIGHLIGHTS ================= */}
                <motion.section 
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    className="relative z-10 max-w-6xl mx-auto px-6 py-10 mb-20"
                >
                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/60 dark:border-white/10 shadow-2xl rounded-[48px] p-12 transition-all">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/20">
                            <div className="text-center px-4 group">
                                <div className="text-6xl font-black bg-gradient-to-r from-orange-400 to-primary bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">24/7</div>
                                <div className="text-gray-900 dark:text-white font-black text-xl mb-2">Availability</div>
                                <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">พร้อมช่วยเหลือคุณทุกเวลาไม่ว่าดึกแค่ไหน</p>
                            </div>
                            <div className="text-center px-4 pt-12 md:pt-0 group border-white/20">
                                <div className="text-6xl font-black bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">3+</div>
                                <div className="text-gray-900 dark:text-white font-black text-xl mb-2">Personalities</div>
                                <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">ตอบโจทย์ทุกอารมณ์และสไตล์การเรียนรู้</p>
                            </div>
                            <div className="text-center px-4 pt-12 md:pt-0 group border-white/20">
                                <div className="text-6xl font-black bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">100%</div>
                                <div className="text-gray-900 dark:text-white font-black text-xl mb-2">Safe & Private</div>
                                <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">ข้อมูลการเรียนของคุณถูกเก็บเป็นความลับ</p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ================= CORE FEATURES ================= */}
                <motion.section 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20"
                >
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">Why Choose APM AI?</h2>
                        <div className="h-2 w-24 bg-primary rounded-full mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <motion.div 
                                key={i} 
                                variants={itemVariants}
                                whileHover={{ y: -12 }}
                                className="group p-10 rounded-[48px] bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                            >
                                <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${f.color} rounded-full blur-[64px] opacity-10 group-hover:opacity-30 transition-opacity`} />
                                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl text-white shadow-xl bg-gradient-to-br ${f.color} mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition duration-300`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-primary transition">{f.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-bold">
                                    {f.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                <Footer />
            </div>
        </div>
    );
};

export default About;
