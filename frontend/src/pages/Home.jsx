import React from "react"
import { useState } from "react"
import Navbar from "../components/Layout/Navbar"
import ModeCard from "../components/UI/ModeCard"
import Middlesection from "../components/Layout/Middlesection"
import Footer from "../components/Layout/footer"
import LessonTabs from "../components/Course/LessonTabs"
import HomeworkSummary from "../components/Course/HomeworkSummary"
import { useNavigate } from "react-router-dom"
import Notification from "../components/UI/Notification"
import CoinBadge from "../components/UI/CoinBadge"
import Logo from "../assets/logo.png"
import BroIcon from "../assets/Bro.png"
import NerdIcon from "../assets/Nerd.1.2.png"
import CuteGirlIcon from "../assets/Girl.png"

const Home = () => {
  const navigate = useNavigate()
  const [showNoti, setShowNoti] = useState(false)

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
      description:
        "Chill vibes only. Let’s tackle that assignment without the stress. We got this, man 😎",
      buttonIcon: "arrow_forward",
      colors: {
        bg: "bg-bro-blue dark:bg-blue-900/20",
        hoverBorder: "hover:border-blue-200",
        shadow: "shadow-soft-blue",
        iconBg: "bg-white/80 dark:bg-blue-800/40",
        text: "text-blue-700/80 dark:text-blue-300",
        button:
          "bg-white dark:bg-blue-600 dark:text-white text-blue-600 group-hover:bg-blue-50",
      },
    },
    {
      id: "girl",
      title: "Cute Girl Mode",
      icon: CuteGirlIcon,
      description:
        "Hey bestie ✨ Ready to smash those goals? You’re doing amazing! Let’s do this 💕",
      buttonIcon: "favorite",
      colors: {
        bg: "bg-girl-pink dark:bg-pink-900/20",
        hoverBorder: "hover:border-pink-200",
        shadow: "shadow-soft-pink",
        iconBg: "bg-white/80 dark:bg-pink-800/40",
        text: "text-pink-700/80 dark:text-pink-300",
        button:
          "bg-white dark:bg-pink-600 dark:text-white text-pink-600 group-hover:bg-pink-50",
      },
    },
    {
      id: "nerd",
      title: "Nerd Mode",
      icon: NerdIcon,
      description:
        "Let’s dive deep into the data. Optimization is the key to academic excellence 🤓📚",
      buttonIcon: "calculate",
      colors: {
        bg: "bg-primary/10 dark:bg-primary/20",
        hoverBorder: "hover:border-primary/30",
        shadow: "shadow-soft-purple",
        iconBg: "bg-white/80 dark:bg-primary/30",
        text: "text-primary dark:text-pink-200",
        button:
          "bg-white dark:bg-primary dark:text-white text-primary group-hover:bg-primary/5",
      },
    },
  ]

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#333333] dark:text-gray-100 transition-colors duration-300 font-display relative overflow-hidden">
      {/* refined brand background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 size-80 rounded-full bg-pink-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 size-[32rem] rounded-full bg-primary/10 blur-3xl" />

      <div className="layout-container flex flex-col min-h-screen relative z-10">
        <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-xl">
          <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-4 py-4 sm:px-6">
            {/* Left: Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative size-11 sm:size-12 shrink-0 overflow-hidden rounded-2xl bg-white/20 ring-2 ring-pink-300/50 shadow-md">
                <img
                  src={Logo}
                  alt="Logo"
                  className="h-full w-full object-cover transition duration-300 hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-pink-200/30 via-transparent to-primary/20" />
              </div>
              <div className="min-w-0 hidden sm:block">
                <h1 className="truncate text-[15px] sm:text-xl font-extrabold tracking-tight leading-none text-black drop-shadow-sm dark:text-white">
                  APM AI
                </h1>
                <p className="truncate text-[10px] sm:text-[11px] font-semibold text-black/70 dark:text-white/70">
                  🌷 ผู้ช่วยที่ดีสำหรับคุณ
                </p>
              </div>
            </div>

            {/* Center: Navbar (Desktop Only) */}
            <div className="hidden lg:flex flex-1 justify-center px-4">
              <Navbar />
            </div>

            {/* Right: Actions */}
            <div className="flex justify-end items-center gap-2 sm:gap-4 shrink-0">
              <CoinBadge className="hidden sm:flex" />

              <div className="relative">
                <button
                  onClick={() => setShowNoti(true)}
                  className="relative size-9 sm:size-10 rounded-full flex items-center justify-center bg-white/90 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-105 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-gray-700 dark:text-gray-200">
                    notifications
                  </span>
                  <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
                </button>

                <Notification
                  show={showNoti}
                  type="info"
                  title="APM AI แจ้งเตือน"
                  message="สู้ๆน้า วันนี้เธอทำได้แน่นอน 💖✨"
                  onClose={() => setShowNoti(false)}
                  autoClose={true}
                  duration={3000}
                />
              </div>

              <button
                type="button"
                onClick={() => navigate(localStorage.getItem("token") ? "/account" : "/login")}
                className="size-9 sm:size-10 rounded-full bg-cover bg-center border-2 border-primary/70 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-sm"
                style={{
                  backgroundImage: `url("${profileImage}")`,
                  backgroundColor: "white",
                }}
                title="Go to Account"
                aria-label="Go to account"
              />

              <div className="lg:hidden">
                <Navbar />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center px-6 py-14 max-w-7xl mx-auto w-full">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-5 py-2 mb-6 rounded-full bg-gradient-to-r from-primary/20 via-pink-300/20 to-primary/20 text-gray-900 dark:text-white font-extrabold text-sm tracking-widest shadow-sm border border-gray-200/70 dark:border-white/20">
              Welcome bestie
            </div>

            <h2 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Your{" "}
              <span className="bg-gradient-to-r from-primary via-pink-400 to-primary bg-clip-text text-transparent">
                AI friend
              </span>{" "}
              for Uni Life
              <span className="inline-block animate-bounce">💖</span>
            </h2>

            <p className="mt-4 text-lg md:text-xl font-medium text-gray-500 dark:text-gray-400">
              How can I help you today, Bestie? 🌷
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-20">
            {modes.map((mode) => (
              <ModeCard
                key={mode.id}
                title={mode.title}
                icon={mode.icon}
                description={mode.description}
                buttonIcon={mode.buttonIcon}
                colors={mode.colors}
                onClick={() => navigate(`/chat/${mode.id}`)}
              />
            ))}
          </div>

          <LessonTabs />

          <HomeworkSummary />
          <Middlesection />
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default Home
