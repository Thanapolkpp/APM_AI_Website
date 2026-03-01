import React from "react"
import { useState } from "react"
import Navbar from "../components/Navbar"
import ModeCard from "../components/ModeCard"
import Middlesection from "../components/Middlesection"
import Footer from "../components/footer"
import LessonTabs from "../components/LessonTabs"
import { useNavigate } from "react-router-dom"
import Notification from "../components/Notification"
import Logo from "../assets/logo.png"
import BroIcon from "../assets/Bro.png"
import NerdIcon from "../assets/Nerd.1.1.png"
import CuteGirlIcon from "../assets/Girl.png"



const Home = () => {
  const navigate = useNavigate()
  const [showNoti, setShowNoti] = useState(false)

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
        bg: "bg-gray-100 dark:bg-green-900/20",
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
        <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-xl">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-2 items-center px-4 py-4 sm:px-6 md:grid-cols-3">

            {/* ✅ Left */}
            <div className="flex min-w-0 items-center gap-3">
              {/* Logo */}
              <div className="relative size-11 sm:size-12 shrink-0 overflow-hidden rounded-2xl bg-white/20 ring-2 ring-pink-300/50 shadow-md">
                <img
                  src={Logo}
                  alt="Logo"
                  className="h-full w-full object-cover transition duration-300 hover:scale-110"
                />
                {/* Cute shine */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-pink-200/30 via-transparent to-blue-200/20" />
              </div>

              {/* Title */}
              <div className="min-w-0">
                <h1 className="truncate text-[15px] sm:text-xl font-extrabold tracking-tight leading-none text-black drop-shadow-sm dark:text-white">
                  <span className="sm:hidden">APM AI</span>
                  <span className="hidden sm:inline">
                    APM AI
                  </span>
                </h1>

                <p className="truncate text-[10px] sm:text-[11px] font-semibold text-black/70 dark:text-white/70">
                  🌷 ผู้ช่วยที่เป็นเพื่อนที่ดีสำหรับคุณ
                </p>
              </div>
            </div>

            {/* ✅ Center (Desktop) */}
            <div className="hidden md:flex justify-center">
              <div className="rounded-full border border-white/20 bg-white/15 px-6 py-2 shadow-sm">
                <Navbar />
              </div>
            </div>

            {/* Right */}
            <div className="flex justify-end items-center gap-3">
              {/* Notification */}
              {/* Notification */}
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

                {/* Notification Popup */}
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


              {/* Avatar */}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="size-9 sm:size-10 rounded-full bg-cover bg-center border-2 border-primary/70 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-sm"
                style={{
                  backgroundImage: `url("${CuteGirlIcon}")`,
                }}
                title="Go to Login"
                aria-label="Go to login"
              />

              {/* Mobile Navbar */}
              <div className="md:hidden">
                <Navbar />
              </div>
            </div>

          </div>
        </header>




        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center px-6 py-14 max-w-7xl mx-auto w-full">
          {/* Hero Section */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-5 py-2 mb-6 rounded-full
    bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-sky-400/20
    text-gray-900 dark:text-white font-extrabold text-sm tracking-widest
    shadow-sm border border-gray-200/70 dark:border-white/20">
              Welcome bestie
            </div>

            <h2 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Your{" "}
              <span className="bg-gradient-to-r from-primary via-pink-500 to-blue-500 bg-clip-text text-transparent">
                AI friend
              </span>{" "}
              for Uni Life
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

        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Home
