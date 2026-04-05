import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Navbar from "../components/Layout/Navbar"
import ModeCard from "../components/UI/ModeCard"
import Middlesection from "../components/Layout/Middlesection"
import Footer from "../components/Layout/footer"
import LessonTabs from "../components/Course/LessonTabs"
import HomeworkSummary from "../components/Course/HomeworkSummary"
import NotificationBell from "../components/UI/NotificationBell"
import CoinBadge from "../components/UI/CoinBadge"
import { ASSETS } from "../config/assets"

const Logo = ASSETS.BRANDING.LOGO
const BroIcon = ASSETS.AVATARS.BRO
const NerdIcon = ASSETS.AVATARS.NERD1
const CuteGirlIcon = ASSETS.AVATARS.GIRL

const Home = () => {
  const navigate = useNavigate()
  const [profileImage] = useState(() => {
    if (!localStorage.getItem("token")) return Logo
    const savedImage = localStorage.getItem("avatarImage")
    if (savedImage) return savedImage
    const savedAvatar = localStorage.getItem("avatar") || "bro"
    const map = { girl: CuteGirlIcon, nerd: NerdIcon, bro: BroIcon }
    return map[savedAvatar.toLowerCase()] || BroIcon
  })

  const modes = [
    {
      id: "bro",
      title: "Bro Mode",
      icon: BroIcon,
      description: "Chill vibes only. Let’s tackle that assignment without the stress. We got this, man 😎",
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
      title: "Cute Girl Mode",
      icon: CuteGirlIcon,
      description: "Hey bestie ✨ Ready to smash those goals? You’re doing amazing! Let’s do this 💕",
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
      title: "Nerd Mode",
      icon: NerdIcon,
      description: "Let’s dive deep into the data. Optimization is the key to academic excellence 🤓📚",
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
      {/* Background Blobs - Better optimized for mobile */}
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
            <div className="scale-[0.7] md:scale-90 origin-right">
              <CoinBadge />
            </div>
            <NotificationBell />
            <button
              type="button"
              onClick={() => navigate(localStorage.getItem("token") ? "/account" : "/login")}
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
            {/* Minimalist Badge from Photo 2 */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-black text-[9px] md:text-[11px] uppercase tracking-[0.2em] border border-black/5 dark:border-white/10">
              Welcome bestie
            </div>

            {/* Headline from Photo 2 */}
            <h2 className="text-4xl md:text-[84px] font-black tracking-tight leading-[1.05] text-gray-900 dark:text-white mb-6">
              Your <span className="bg-gradient-to-r from-[#97d8c9] via-[#ae97d8] to-[#d897c5] bg-clip-text text-transparent">AI friend</span> for Uni Life 
              <motion.span 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block ml-2"
              >
                ❤️
              </motion.span>
            </h2>

            <p className="text-sm md:text-xl font-bold text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              How can I help you today, Bestie? 🌷
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

          {/* Secondary Sections */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full space-y-16 md:space-y-40 scale-95 md:scale-100 origin-top"
          >
            <LessonTabs />
            <HomeworkSummary />
            <div className="hidden md:block">
              <Middlesection />
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default Home
