import React from "react"
import Navbar from "../components/Navbar"
import ModeCard from "../components/ModeCard"
import Middlesection from "../components/Middlesection"
import Footer from "../components/footer"
import LessonTabs from "../components/LessonTabs"
import { useNavigate } from "react-router-dom"
import Logo from "../assets/logo.png"
import BroIcon from "../assets/Bro.png"
import NerdIcon from "../assets/Nerd.png"


const Home = ({ onStartChat }) => {
  const navigate = useNavigate()

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
      icon: "🎀",
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
        bg: "bg-green-100 dark:bg-green-900/20",
        hoverBorder: "hover:border-green-200",
        shadow: "shadow-soft-green",
        iconBg: "bg-white/80 dark:bg-green-800/40",
        text: "text-green-700/80 dark:text-green-300",
        button:
          "bg-white dark:bg-green-600 dark:text-white text-green-600 group-hover:bg-green-50",
      },
    },
  ]

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#333333] dark:text-gray-100 transition-colors duration-300 font-display relative overflow-hidden">
      {/* cute pastel background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-80 rounded-full bg-pink-300/25 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 size-80 rounded-full bg-blue-300/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 size-[32rem] rounded-full bg-purple-300/15 blur-3xl" />

      <div className="layout-container flex flex-col min-h-screen relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full bg-background-light/70 dark:bg-background-dark/70 backdrop-blur-xl border-b border-white/40 dark:border-gray-800">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 grid grid-cols-2 md:grid-cols-3 items-center">

            {/* LEFT */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-11 sm:size-12 rounded-2xl flex items-center justify-center shadow-sm overflow-hidden ring-2 ring-primary/30 shrink-0">
                <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
              </div>

              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-extrabold tracking-tight leading-none truncate">
                  <span className="sm:hidden">APM AI</span>
                  <span className="hidden sm:inline">Assistant for Personal Motivation</span>
                </h1>

                <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 truncate">
                  ผู้ช่วยที่เป็นเพื่อนที่ดีสำหรับคุณ
                </p>
              </div>
            </div>

            {/* CENTER (Desktop only) ✅ */}
            <div className="hidden md:flex justify-center">
              <Navbar />
            </div>

            {/* RIGHT */}
            <div className="flex justify-end items-center gap-2 sm:gap-4">
              {/* Mobile Navbar (Hamburger) */}
              <div className="md:hidden">
                <Navbar />
              </div>

              {/* Notification */}
              <button className="relative size-9 sm:size-10 rounded-full flex items-center justify-center bg-white/90 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-105 active:scale-95">
                <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-gray-700 dark:text-gray-200">
                  notifications
                </span>
                <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
              </button>

              {/* Avatar */}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="size-9 sm:size-10 rounded-full bg-cover bg-center border-2 border-primary/70 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-sm"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde")',
                }}
                title="Go to Login"
                aria-label="Go to login"
              />
            </div>
          </div>
        </header>



        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center px-6 py-14 max-w-7xl mx-auto w-full">
          {/* Hero Section */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 dark:bg-white/10 border border-white/60 dark:border-gray-800 shadow-sm text-xs font-extrabold tracking-widest uppercase text-primary">
              ✨ Welcome bestie
            </div>

            <h2 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Your{" "}
              <span className="bg-gradient-to-r from-primary via-pink-500 to-blue-500 bg-clip-text text-transparent">
                AI friend
              </span>{" "}
              for uni life{" "}
              <span className="inline-block animate-bounce">💖</span>
            </h2>

            <p className="mt-4 text-lg md:text-xl font-medium text-gray-500 dark:text-gray-400">
              How can I help you today, Bestie? 🌷
            </p>

            <LessonTabs />

          </div>

          {/* Mode Cards */}
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

          {/* Middle Section */}
          <Middlesection />

          {/* ✅ Footer อยู่ตรงนี้ */}
          <div className="w-full mt-20">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Home
