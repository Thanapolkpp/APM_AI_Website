import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/footer";
import CoinBadge from "../components/UI/CoinBadge";
import { ASSETS } from "../config/assets";
import { Sparkles, Trophy, ExternalLink, ClipboardCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const Logo = ASSETS.BRANDING.LOGO;
const BroIcon = ASSETS.AVATARS.BRO;
const NerdIcon = ASSETS.AVATARS.NERD1; // Default Nerd
const CuteGirlIcon = ASSETS.AVATARS.GIRL;

const Event = () => {
    const { t } = useTranslation();
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

            const RAW_URL = import.meta.env.VITE_API_URL || "https://apm-ai-website.onrender.com";
            const API_BASE_URL = RAW_URL.endsWith('/') ? RAW_URL.slice(0, -1) : RAW_URL;
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
        const RAW_URL = import.meta.env.VITE_API_URL || "https://apm-ai-website.onrender.com";
        const API_BASE_URL = RAW_URL.endsWith('/') ? RAW_URL.slice(0, -1) : RAW_URL;
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/user/claim-test-reward`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                setIsClaimed(true);
                alert(t("event.success_alert"));
            } else {
                const errorData = await response.json();
                alert(errorData.detail || "Error");
            }
        } catch (error) {
            console.error("Error claiming reward:", error);
            alert("Connection error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col transition-colors duration-300">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-primary/10 blur-[120px] opacity-60" />
                <div className="absolute top-1/2 -left-40 size-[500px] rounded-full bg-pink-400/10 blur-[120px] opacity-60" />
            </div>

            <header className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/60 dark:bg-black/20 backdrop-blur-xl transition-all">
                <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-6 py-4">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex items-center gap-3 shrink-0 cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <div className="relative size-10 md:size-12 shrink-0 overflow-hidden rounded-2xl bg-white shadow-xl ring-2 ring-pink-100 flex items-center justify-center">
                            <img src={profileImage || Logo} alt="Logo" className="size-6 md:size-8 object-contain" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg md:text-xl font-black tracking-tight leading-none text-gray-900 dark:text-white">APM AI</h1>
                            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Special Events 🎉</p>
                        </div>
                    </motion.div>
                    {/* Desktop Navbar */}
                    <div className="hidden lg:flex flex-1 justify-center">
                        <Navbar />
                    </div>
                    <div className="flex justify-end items-center gap-4 shrink-0">
                        <CoinBadge className="scale-90" />
                        <button
                            type="button"
                            onClick={() => navigate(localStorage.getItem("token") ? "/account" : "/login")}
                            className="size-10 rounded-2xl border-2 border-white dark:border-white/10 shadow-lg bg-white/20 bg-cover bg-center cursor-pointer hover:scale-110 active:scale-95 transition-all"
                            style={{ backgroundImage: `url("${profileImage}")`, backgroundColor: "white" }}
                        />
                        <div className="lg:hidden"><Navbar /></div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-5xl mx-auto py-8 md:py-16 px-4 md:px-6 relative z-10">
                <div className="text-center mb-10 md:mb-16 space-y-3 md:space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-widest border border-primary/20 shadow-sm animate-bounce-slow">
                        <Trophy size={14}/> {t("event.reward_program")}
                    </div>
                    <h2 className="text-3xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight md:leading-none">
                        {t("event.title_main")} <br />
                        <span className="bg-gradient-to-r from-primary via-pink-400 to-indigo-500 bg-clip-text text-transparent">{t("event.title_sub")}</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-sm md:text-xl font-bold text-gray-500 dark:text-gray-400 leading-relaxed pt-2 md:pt-4">
                        {t("event.subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {/* Step 1: Claim Reward */}
                    <div className="group bg-white/60 dark:bg-white/5 backdrop-blur-3xl border border-white/60 dark:border-white/10 rounded-[32px] md:rounded-[48px] p-6 md:p-10 shadow-2xl flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:scale-150 transition-transform duration-700 hidden md:block">
                             <Trophy size={120} />
                        </div>
                        
                        <div className="size-16 md:size-20 rounded-[24px] md:rounded-[32px] bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/20 mb-6 md:mb-8 z-10">
                            <Sparkles size={32} className="md:size-10 animate-pulse" />
                        </div>
                        
                        <div className="z-10 space-y-3 md:space-y-4">
                            <span className="text-[8px] md:text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">{t("event.step1_tag")}</span>
                            <h3 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white">{t("event.step1_title")}</h3>
                            <p className="text-xs md:text-gray-500 md:dark:text-gray-400 font-bold leading-relaxed mb-6 md:mb-8">
                                {t("event.step1_desc")}
                            </p>

                            <div className="flex flex-wrap justify-center gap-3 mb-10">
                                <div className="px-4 py-2 bg-yellow-400/10 rounded-2xl border border-yellow-400/20 flex items-center gap-2">
                                    <span className="text-yellow-600 font-black text-sm">50 COINS 🪙</span>
                                </div>
                                <div className="px-4 py-2 bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-2">
                                    <span className="text-primary font-black text-sm">30 EXP ✨</span>
                                </div>
                            </div>

                            <button
                                onClick={handleClaim}
                                disabled={isClaimed || isLoading}
                                className={`w-full py-4 md:py-5 rounded-[22px] md:rounded-[28px] font-black text-sm md:text-lg uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isClaimed
                                    ? 'bg-gray-100 dark:bg-white/5 text-gray-400 shadow-none cursor-not-allowed border border-gray-100 dark:border-white/5'
                                    : 'bg-primary text-white shadow-primary/30 hover:brightness-110'
                                    }`}
                            >
                                {isLoading ? (
                                    <div className="size-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : isClaimed ? (
                                    <><span>{t("event.claimed_btn")}</span></>
                                ) : (
                                    <><span>{t("event.claim_btn")}</span> <ExternalLink size={16}/></>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Step 2: Evaluation Form */}
                    <div className="group bg-white/60 dark:bg-white/5 backdrop-blur-3xl border border-white/60 dark:border-white/10 rounded-[32px] md:rounded-[48px] p-6 md:p-10 shadow-2xl flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-indigo-500/10 group-hover:scale-150 transition-transform duration-700 hidden md:block">
                             <ClipboardCheck size={120} />
                        </div>

                        <div className="size-16 md:size-20 rounded-[24px] md:rounded-[32px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 mb-6 md:mb-8 z-10">
                            <ClipboardCheck size={32} className="md:size-10 group-hover:rotate-12 transition-transform" />
                        </div>

                        <div className="z-10 space-y-3 md:space-y-4">
                            <span className="text-[8px] md:text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">{t("event.step2_tag")}</span>
                            <h3 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white">{t("event.step2_title")}</h3>
                            <p className="text-xs md:text-gray-500 md:dark:text-gray-400 font-bold leading-relaxed mb-6 md:mb-8">
                                {t("event.step2_desc")}
                            </p>

                            <div className="py-2 mb-10">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Google Form Link</p>
                                <p className="text-xs font-bold text-gray-300 dark:text-gray-500 italic mt-1">{t("event.form_hint")}</p>
                            </div>

                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSegQ66d04YKhqMBLo6X946tg_cokeUwgbAwJZ2ngdocyvZ9_w/viewform?usp=sf_link"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-4 md:py-5 rounded-[22px] md:rounded-[28px] bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-sm md:text-lg uppercase tracking-widest shadow-2xl shadow-indigo-500/30 hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 md:gap-3 transition-all"
                            >
                                {t("event.form_btn")} <ExternalLink size={16}/>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-6">
                    <p className="text-gray-400 dark:text-gray-600 font-bold text-sm uppercase tracking-[0.3em]">{t("event.coming_soon")}</p>
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent mx-auto" />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Event;
