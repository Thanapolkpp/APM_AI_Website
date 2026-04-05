import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/footer";
import CoinBadge from "../components/UI/CoinBadge";
import { ASSETS } from "../config/assets";

const Logo = ASSETS.BRANDING.LOGO;
const BroIcon = ASSETS.AVATARS.BRO;
const NerdIcon = ASSETS.AVATARS.NERD1; // Default Nerd
const CuteGirlIcon = ASSETS.AVATARS.GIRL;

const Event = () => {
    const navigate = useNavigate();
    const [isClaimed, setIsClaimed] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const [profileImage] = React.useState(() => {
        if (!localStorage.getItem("token")) return Logo;
        const savedImage = localStorage.getItem("avatarImage");
        if (savedImage) return savedImage;
        const savedAvatar = localStorage.getItem("avatar") || "bro";
        const map = { girl: CuteGirlIcon, nerd: NerdIcon, bro: BroIcon };
        return map[savedAvatar.toLowerCase()] || BroIcon;
    });

    React.useEffect(() => {
        const checkStatus = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://apm-ai-website.onrender.com";
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/user/me`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setIsClaimed(data.has_claimed_test_reward);
                }
            } catch (error) {
                console.error("Error fetching status:", error);
            }
        };
        checkStatus();
    }, []);

    const handleClaim = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        setIsLoading(true);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://apm-ai-website.onrender.com";
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/user/claim-test-reward`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                setIsClaimed(true);
                // สั่งเปิดลิ้งแบบประเมิน
                window.open("https://docs.google.com/forms/d/e/1FAIpQLSegQ66d04YKhqMBLo6X946tg_cokeUwgbAwJZ2ngdocyvZ9_w/viewform?usp=publish-editor", "_blank");
            } else {
                const errorData = await response.json();
                alert(errorData.detail || "เกิดข้อผิดพลาดในการรับรางวัล");
            }
        } catch (error) {
            console.error("Error claiming reward:", error);
            alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
        } finally {
            setIsLoading(false);
        }
    };

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
                        <CoinBadge className="scale-90" />
                        
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

            <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
                {/* Section Header */}
                <div className="text-center mb-10 max-w-2xl px-6">
                    <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
                        กิจกรรมพิเศษ 🎉
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg font-bold">
                        ร่วมสนุกกับกิจกรรมในระบบ เพื่อรับรางวัลสุดพรีเมียม!
                    </p>
                </div>

                {/* Event Card */}
                <div className="w-full max-w-2xl bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/60 dark:border-white/10 rounded-[48px] p-8 sm:p-12 shadow-2xl transition-all hover:scale-[1.02] duration-500">
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        {/* Event Icon/Graphic */}
                        <div className="relative shrink-0">
                            <div className="size-32 sm:size-40 rounded-[40px] bg-gradient-to-br from-primary/30 to-pink-300/30 flex items-center justify-center p-8 backdrop-blur-sm shadow-inner group">
                                <span className="material-symbols-outlined text-6xl sm:text-7xl text-primary animate-pulse">
                                    rocket_launch
                                </span>
                            </div>
                            {/* Floating Badges */}
                            <div className="absolute -top-4 -right-4 bg-yellow-400 text-white text-[12px] font-black px-4 py-1.5 rounded-full shadow-lg border-2 border-white animate-bounce">
                                NEW!
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-3">
                                เข้าร่วมทดสอบเว็บไซต์ 🚀
                            </h3>
                            <p className="text-gray-500 dark:text-gray-300 font-bold mb-6 italic sm:text-lg">
                                สำหรับผู้ใช้ใหม่ที่เข้าร่วมทดสอบระบบ Beta Test วันนี้!
                            </p>

                            {/* Rewards Box */}
                            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-8">
                                <div className="bg-yellow-100/80 dark:bg-yellow-500/20 px-5 py-3 rounded-2xl flex items-center gap-3 border border-yellow-200/50">
                                    <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 font-black">
                                        database
                                    </span>
                                    <span className="text-yellow-700 dark:text-yellow-300 font-black text-lg">
                                        50 Coins
                                    </span>
                                </div>
                                <div className="bg-primary/10 px-5 py-3 rounded-2xl flex items-center gap-3 border border-primary/20">
                                    <span className="material-symbols-outlined text-primary font-black">
                                        temp_preferences_custom
                                    </span>
                                    <span className="text-primary font-black text-lg">
                                        30 EXP
                                    </span>
                                </div>
                            </div>

                            {/* Status Button */}
                            <div className="w-full">
                                <button
                                    onClick={handleClaim}
                                    disabled={isClaimed || isLoading}
                                    className={`w-full sm:w-auto px-10 py-4 font-black text-lg rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 ${isClaimed
                                        ? 'bg-gray-400 text-white cursor-not-allowed shadow-none'
                                        : 'bg-primary text-white shadow-primary/30 hover:bg-primary/90'
                                        }`}
                                >
                                    <span className="material-symbols-outlined">
                                        {isLoading ? 'autorenew' : (isClaimed ? 'check_circle' : 'redeem')}
                                    </span>
                                    {isLoading ? 'กำลังโหลด...' : (isClaimed ? 'รับรางวัลแล้ว' : 'รับของรางวัล')}
                                </button>
                                <p className="mt-3 text-xs font-bold text-gray-400 dark:text-gray-500 italic">
                                    * รางวัลจะถูกเพิ่มเข้าบัญชีของคุณโดยอัตโนมัติ และจะเปิดแบบประเมินให้ทำจ้า
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center text-gray-400 dark:text-gray-600 font-bold text-sm italic">
                    ติดตามกิจกรรมใหม่ๆ ได้ที่นี่เร็วๆ นี้... 🌸
                </div>
            </main>



            <Footer />
        </div>
    );
};

export default Event;
