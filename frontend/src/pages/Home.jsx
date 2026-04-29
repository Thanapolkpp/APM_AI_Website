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
import { ASSETS, getAvatarIcon } from "../config/assets"
import { useCoins } from "../hooks/useCoins"
import { getUserProfile } from "../services/aiService"

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

  const [profileImage, setProfileImage] = useState(Logo)

  const refreshProfileImage = () => {
    const savedAvatar = localStorage.getItem("avatar");
    setProfileImage(getAvatarIcon(savedAvatar));
  };

  useEffect(() => {
    refreshProfileImage()

    // Sync avatar from server to localStorage if logged in
    if (isLoggedIn) {
      getUserProfile()
        .then(profile => {
          if (profile.equipped_avatar) {
            localStorage.setItem("avatar", profile.equipped_avatar);
            refreshProfileImage();
          }
        })
        .catch(err => console.error("Profile sync failed:", err));
    }

    window.addEventListener("avatarUpdated", refreshProfileImage)
    return () => window.removeEventListener("avatarUpdated", refreshProfileImage)
  }, [isLoggedIn])

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
    <div className="bg-yellow-400 min-h-screen text-toon-black transition-colors duration-300 font-cartoon relative overflow-hidden">
      {/* Playful Background Elements */}
      <div className="pointer-events-none absolute -top-20 -left-20 size-[300px] rounded-full bg-primary border-8 border-toon-black opacity-20" />
      <div className="pointer-events-none absolute top-1/2 -right-20 size-[400px] rounded-[60px] bg-pink-300 border-8 border-toon-black rotate-12 opacity-20" />

      <div className="layout-container flex flex-col min-h-screen relative z-10">
        <header className="sticky top-4 z-[100] mx-6 my-4 border-4 border-toon-black bg-white rounded-3xl px-6 py-4 flex items-center justify-between shadow-toon-lg">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3 shrink-0 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="relative size-12 shrink-0 overflow-hidden rounded-2xl bg-yellow-200 border-4 border-toon-black shadow-toon flex items-center justify-center">
              <img src={profileImage || Logo} alt="Logo" className="size-8 object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-black tracking-tight leading-none uppercase italic">APM AI</h1>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-0.5">Your Bestie 🌷</p>
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
            <div
              className="size-12 rounded-2xl border-4 border-toon-black cursor-pointer bg-white bg-cover bg-center shadow-toon hover:-translate-y-1 hover:shadow-toon-lg active:scale-95 transition-all overflow-hidden"
              style={{ backgroundImage: `url("${profileImage}")` }}
              onClick={() => navigate(isLoggedIn ? "/account" : "/login")}
            />
            <div className="lg:hidden">
              <Navbar />
            </div>
          </motion.div>
        </header>

        <main className="flex-1 flex flex-col items-center px-6 py-10 md:py-16 max-w-7xl mx-auto w-full">
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
              <div className="inline-flex flex-col items-center px-8 py-5 rounded-[40px] bg-white border-4 border-toon-black shadow-toon-lg transition-all duration-300 hover:shadow-toon-xl hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-toon-black">
                    {t("home.welcome", { username: (localStorage.getItem("username") || "BESTIE").toUpperCase() })}
                  </span>
                </div>

                <div className="relative size-20 flex items-center justify-center">
                   <div className="absolute inset-0 rounded-full border-4 border-toon-black bg-yellow-100 shadow-inner" />
                   <div className="relative z-10 size-12 drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500">
                    <img src={rankImage} alt="Rank" className="w-full h-full object-contain" />
                  </div>
                </div>

                <div className="mt-4 flex flex-col items-center gap-1">
                  {isLoggedIn ? (
                    <div className="flex items-center gap-2">
                      <div className="size-2 bg-green-500 border-2 border-toon-black rounded-full" />
                      <span className="text-xs font-black text-toon-black">
                        {t("home.exp_earned", { exp: exp.toLocaleString() })}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-black text-primary uppercase italic">
                      {t("home.login_to_start")}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            <h2 className="text-5xl md:text-[90px] font-black tracking-tight leading-[1] text-toon-black mb-6 uppercase italic">
              {t("home.hero_title_uni_life", { aiFriend: "" })}
              <span className="block text-white drop-shadow-[4px_4px_0px_#1a1a1a]">
                {t("home.hero_title_ai_friend")}
              </span>
              {i18n.language === 'en' ? " for Uni Life" : ""}
              <motion.span
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block ml-4"
              >
                🌈
              </motion.span>
            </h2>
            <p className="text-lg md:text-2xl font-black text-toon-black/70 max-w-2xl mx-auto">
              {t("home.hero_subtitle")}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 w-full max-w-6xl mb-16 md:mb-12"
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
            className="w-full space-y-16 md:space-y-40 origin-top"
          >
            <LessonTabs />
            <div className="hidden md:block">
              <Middlesection />
            </div>
          </motion.div>
        </main>

        <Footer />

        {/* Floating Ranking Button */}
        {isLoggedIn && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/leaderboard")}
            className="fixed bottom-8 right-8 z-[90] size-16 md:size-20 rounded-3xl bg-yellow-400 text-toon-black shadow-toon-lg flex items-center justify-center border-4 border-toon-black group"
          >
            <span className="material-symbols-outlined text-4xl md:text-5xl font-black">trophy</span>
          </motion.button>
        )}

        <AnimatePresence>
          {showSupportAlert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm"
              onClick={handleCloseAlert}
            >
              <motion.div
                initial={{ scale: 0.8, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 20, opacity: 0 }}
                className="bg-white border-4 border-toon-black rounded-[40px] p-8 md:p-12 shadow-toon-xl max-w-sm md:max-w-lg w-full relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative z-10 text-center font-cartoon">
                  <div className="size-20 bg-yellow-200 border-4 border-toon-black rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-toon">
                    <span className="material-symbols-outlined text-4xl font-black">warning</span>
                  </div>
                  <h3 className="text-3xl font-black text-toon-black mb-4 uppercase italic">
                    {t("home.alert.title")}
                  </h3>
                  <p className="text-toon-black font-black text-lg leading-relaxed mb-10">
                    {t("home.alert.p1")} <span className="text-red-500 underline decoration-4 underline-offset-4">{t("home.alert.beta")}</span> {t("home.alert.p2")} <span className="text-red-500 underline decoration-4 underline-offset-4">{t("home.alert.server_free")}</span> <br className="hidden md:block" />
                    {t("home.alert.p3")}
                  </p>
                  <a
                    href="mailto:apmaiservice@gmail.com?subject=แจ้งปัญหาการใช้งาน AI&body=พบปัญหา Ai กรุณาเปิด server ให้ฉัน ด่วน ๆ"
                    className="toon-button w-full flex items-center justify-center gap-3 mb-4"
                  >
                    <span className="material-symbols-outlined text-2xl font-black">mail</span>
                    <span className="uppercase italic">Report Problem</span>
                  </a>
                  <button
                    onClick={handleCloseAlert}
                    className="w-full py-4 text-toon-black/50 font-black text-sm hover:text-toon-black transition-colors uppercase tracking-widest italic"
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