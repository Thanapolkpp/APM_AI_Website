import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"

import Navbar from "../components/Layout/Navbar"
import ModeCard from "../components/UI/ModeCard"
import Middlesection from "../components/Layout/Middlesection"
import Footer from "../components/Layout/footer"
import LessonTabs from "../components/Course/LessonTabs"
import HomeworkSummary from "../components/Course/HomeworkSummary"
import NotificationBell from "../components/UI/NotificationBell"
import CoinBadge from "../components/UI/CoinBadge"
import { ASSETS } from "../config/assets"
import { useCoins } from "../hooks/useCoins"

const Logo = ASSETS.BRANDING.LOGO
const BroIcon = ASSETS.AVATARS.BRO
const NerdIcon = ASSETS.AVATARS.NERD1
const CuteGirlIcon = ASSETS.AVATARS.GIRL

const Home = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { coins, exp } = useCoins()
  const [showSupportAlert, setShowSupportAlert] = useState(false)

  // Logic: เช็คว่าวันนี้เคยแสดง Alert ไปหรือยัง
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // ตัวอย่าง: "2026-04-07"
    const lastAlertDate = localStorage.getItem("last_alert_view_date");

    if (lastAlertDate !== today) {
      const timer = setTimeout(() => {
        setShowSupportAlert(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  // ฟังก์ชันสำหรับปิด Alert และบันทึกวันที่ปัจจุบันลงเครื่อง
  const handleCloseAlert = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem("last_alert_view_date", today);
    setShowSupportAlert(false);
  };

  // Level calculation logic
  const getLevelInfo = (totalExp) => {
    const thresholds = [0, 50, 150, 300, 500, 800, 1200];
    let level = 1;
    for (let i = 0; i < thresholds.length; i++) {
      if (totalExp >= thresholds[i]) level = i + 1;
      else break;
    }
    return level;
  };

  const getRankImg = (lvl) => {
    const imgs = {
      1: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368522/Broze_xwm5gg.png",
      2: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368517/Sliver_ea2lid.png",
      3: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368525/Gold_bglivb.png",
      4: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368536/Plat_rakik4.png",
      5: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368517/Diamond_gjekkx.png",
      6: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368537/Master_ypfzxo.png",
      7: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368533/Legen_vts5jo.png",
    };
    return imgs[lvl] || imgs[1];
  };

  const getLevelTheme = (lvl) => {
    const themes = {
      1: { from: "#92400e", to: "#d97706", name: "Bronze" },
      2: { from: "#475569", to: "#cbd5e1", name: "Silver" },
      3: { from: "#b45309", to: "#fbbf24", name: "Gold" },
      4: { from: "#0f172a", to: "#94a3b8", name: "Platinum" },
      5: { from: "#0e7490", to: "#67e8f9", name: "Diamond" },
      6: { from: "#5b21b6", to: "#c084fc", name: "Master" },
      7: { from: "#7f1d1d", to: "#f87171", name: "Legend" },
    };
    return themes[lvl] || themes[1];
  };

  const userLevel = getLevelInfo(exp);
  const theme = getLevelTheme(userLevel);
  const rankImage = getRankImg(userLevel);
  const isLoggedIn = !!localStorage.getItem("token");

  const [profileImage] = useState(() => {
    if (!isLoggedIn) return Logo
    const savedImage = localStorage.getItem("avatarImage")
    if (savedImage) return savedImage
    const savedAvatar = localStorage.getItem("avatar") || "bro"
    const map = { girl: CuteGirlIcon, nerd: NerdIcon, bro: BroIcon }
    return map[savedAvatar.toLowerCase()] || BroIcon
  })

  const modes = [
    {
      id: "bro",
      title: t("home.modes.bro.title"),
      icon: BroIcon,
      description: t("home.modes.bro.description"),
      buttonIcon: "arrow_forward",
      colors: {
        bg: "bg-bro-blue dark:bg-blue-900/40",
        hoverBorder: "hover:border-blue-300",
        shadow: "shadow-soft-blue",
        iconBg: "bg-blue-100 dark:bg-blue-800/40",
        text: "text-blue-700/80 dark:text-blue-300",
        button: "bg-blue-100 dark:bg-blue-600 dark:text-white text-blue-600 group-hover:bg-blue-50",
      },
    },
    {
      id: "girl",
      title: t("home.modes.girl.title"),
      icon: CuteGirlIcon,
      description: t("home.modes.girl.description"),
      buttonIcon: "favorite",
      colors: {
        bg: "bg-girl-pink dark:bg-pink-900/40",
        hoverBorder: "hover:border-pink-300",
        shadow: "shadow-soft-pink",
        iconBg: "bg-pink-100 dark:bg-pink-800/40",
        text: "text-pink-700/80 dark:text-pink-300",
        button: "bg-pink-100 dark:bg-pink-600 dark:text-white text-pink-600 group-hover:bg-pink-50",
      },
    },
    {
      id: "nerd",
      title: t("home.modes.nerd.title"),
      icon: NerdIcon,
      description: t("home.modes.nerd.description"),
      buttonIcon: "calculate",
      colors: {
        bg: "bg-nerd-purple dark:bg-purple-900/40",
        hoverBorder: "hover:border-purple-300",
        shadow: "shadow-soft-purple",
        iconBg: "bg-green-100 dark:bg-purple-800/40",
        text: "text-green-700/80 dark:text-purple-300",
        button: "bg-green-100 dark:bg-green-600 dark:text-white text-green-600 group-hover:bg-green-50",
      },
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120 } }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#333333] dark:text-gray-100 transition-colors duration-300 font-display relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-40 size-[400px] md:size-[600px] rounded-full bg-primary/10 blur-[80px] md:blur-[120px]" />
      <div className="pointer-events-none absolute top-40 -right-40 size-[400px] md:size-[600px] rounded-full bg-pink-300/10 blur-[100px] md:blur-[150px]" />

      <div className="layout-container flex flex-col min-h-screen relative z-10">
        <header className="sticky top-0 z-[100] w-full border-b border-white/20 bg-white/60 dark:bg-black/30 backdrop-blur-2xl px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3 shrink-0 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="relative size-10 md:size-12 shrink-0 overflow-hidden rounded-2xl bg-white shadow-xl ring-2 ring-pink-100 flex items-center justify-center">
              <img src={Logo} alt="Logo" className="size-6 md:size-8 object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-black tracking-tight leading-none text-gray-900 dark:text-white">APM AI</h1>
              <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Your Bestie 🌷</p>
            </div>
          </motion.div>

          <div className="hidden lg:flex flex-1 justify-center">
            <Navbar />
          </div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-1.5 md:gap-3"
          >
            <div className="hidden md:block scale-90 origin-right">
              <CoinBadge />
            </div>
            <NotificationBell />
            <button
              type="button"
              onClick={() => navigate(isLoggedIn ? "/account" : "/login")}
              className="size-8 md:size-10 rounded-2xl bg-white dark:bg-white/10 border-2 border-white dark:border-white/20 cursor-pointer shadow-lg hover:rotate-6 active:scale-95 transition-all overflow-hidden shrink-0"
            >
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            </button>
            <div className="lg:hidden">
              <Navbar />
            </div>
          </motion.div>
        </header>

        <main className="flex-1 flex flex-col items-center px-6 py-10 md:py-24 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="relative mb-8 md:mb-12 group cursor-pointer md:hidden"
              onClick={() => navigate(isLoggedIn ? "/account" : "/login")}
            >
              <div className="inline-flex flex-col items-center px-8 py-3 md:px-14 md:py-7 rounded-[40px] md:rounded-[60px] bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-2xl transition-all duration-500 hover:shadow-primary/20 hover:scale-[1.02] active:scale-95">
                <div className="flex items-center gap-3 mb-3 md:mb-4">
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                    {t("home.welcome", { username: (localStorage.getItem("username") || "BESTIE").toUpperCase() })}
                  </span>
                  {isLoggedIn && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-[8px] md:text-[10px] font-black">
                      <span className="material-symbols-outlined text-[10px] md:text-[12px]">monetization_on</span>
                      {coins.toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="relative size-16 md:size-24 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-white/5 shadow-inner" />
                  <svg className="absolute inset-0 size-full -rotate-90">
                    <defs>
                      <linearGradient id="hero-exp-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={isLoggedIn ? theme.from : "#e5e7eb"} />
                        <stop offset="100%" stopColor={isLoggedIn ? theme.to : "#d1d5db"} />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="50%"
                      cy="50%"
                      r="44%"
                      fill="none"
                      stroke="url(#hero-exp-gradient)"
                      strokeWidth="4"
                      strokeDasharray="100 100"
                      strokeDashoffset={100 - (isLoggedIn ? Math.min((exp % 200) / 2, 100) : 0)}
                      className="transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="relative z-10 size-10 md:size-16 drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500">
                    <img src={rankImage} alt="Rank" className="w-full h-full object-contain" />
                  </div>
                  {isLoggedIn && (
                    <div className="absolute -top-1 -right-1">
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles size={16} className="text-primary" />
                      </motion.div>
                    </div>
                  )}
                </div>

                <div className="mt-3 md:mt-4 flex flex-col items-center gap-1">
                  {isLoggedIn ? (
                    <div className="flex items-center gap-2">
                       <div className="size-1.5 md:size-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                       <span className="text-[10px] md:text-[12px] font-black text-gray-700 dark:text-gray-300">
                         {t("home.exp_earned", { exp: exp.toLocaleString() })}
                       </span>
                     </div>
                   ) : (
                     <span className="text-[10px] md:text-[12px] font-black text-primary animate-pulse">
                       {t("home.login_to_start")}
                     </span>
                   )}
                </div>
              </div>
              <div className="absolute inset-0 -z-10 blur-3xl opacity-20 mix-blend-overlay bg-gradient-to-tr from-primary to-pink-400 rounded-full" />
            </motion.div>

            <h2 className="text-4xl md:text-[84px] font-black tracking-tight leading-[1.05] text-gray-900 dark:text-white mb-6">
              {t("home.hero_title_uni_life", { aiFriend: "" })}
              <span className="bg-gradient-to-r from-[#97d8c9] via-[#ae97d8] to-[#d897c5] bg-clip-text text-transparent">
                {t("home.hero_title_ai_friend")}
              </span>
              {i18n.language === 'en' ? " for Uni Life" : ""}
              <motion.span
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block ml-2"
              >
                ❤️
              </motion.span>
            </h2>
            <p className="text-sm md:text-xl font-bold text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              {t("home.hero_subtitle")}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-8 w-full max-w-5xl mb-16 md:mb-12"
          >
            {modes.map((mode) => (
              <motion.div key={mode.id} variants={itemVariants}>
                <ModeCard
                  title={mode.title}
                  icon={mode.icon}
                  description={mode.description}
                  buttonIcon={mode.buttonIcon}
                  colors={mode.colors}
                  onClick={() => navigate(`/chat/${mode.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full space-y-16 md:space-y-40 scale-95 md:scale-100 origin-top"
          >
            <LessonTabs />
            <div className="hidden md:block">
              <Middlesection />
            </div>
          </motion.div>
        </main>

        <Footer />

        <AnimatePresence>
          {showSupportAlert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm"
              onClick={handleCloseAlert}
            >
              <motion.div
                initial={{ scale: 0.8, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 20, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-[32px] p-8 md:p-10 shadow-2xl max-w-sm md:max-w-md w-full border border-white/20 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute top-0 right-0 -mr-10 -mt-10 size-32 bg-primary/10 blur-3xl rounded-full" />
                <div className="relative z-10 text-center">
                  <div className="size-16 md:size-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary">
                    <span className="material-symbols-outlined text-3xl md:text-4xl">warning</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-3">
                    {t("home.alert.title")}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 font-bold text-sm md:text-base leading-relaxed mb-8">
                    {t("home.alert.p1")} <span className="text-red-500">{t("home.alert.beta")}</span> {t("home.alert.p2")} <span className="text-red-500">{t("home.alert.server_free")}</span> <br className="hidden md:block" />
                    {t("home.alert.p3")}
                  </p>
                  <a
                    href="mailto:apmaiservice@gmail.com?subject=แจ้งปัญหาการใช้งาน AI&body=พบปัญหา Ai กรุณาเปิด server ให้ฉัน ด่วน ๆ"
                    className="w-full py-4 px-6 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-sm md:text-base shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 group mb-3"
                  >
                    <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">mail</span>
                    {t("home.alert.report_problem")}
                  </a>
                  <button
                    onClick={handleCloseAlert}
                    className="w-full py-4 text-gray-400 dark:text-gray-500 font-black text-xs md:text-sm hover:text-gray-600 dark:hover:text-gray-300 transition-colors uppercase tracking-widest"
                  >
                    {t("home.alert.close")}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Home