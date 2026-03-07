import React, { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { PiAtomBold, PiBackspaceBold } from "react-icons/pi"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  // ✅ กัน scroll ตอนเมนูเปิด
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "auto"
    return () => (document.body.style.overflow = "auto")
  }, [isOpen])

  const linkClasses = ({ isActive }) =>
    `w-full px-6 py-4 text-base font-extrabold transition-all duration-200 rounded-2xl
     border
     ${isActive
      ? "text-primary bg-gradient-to-r from-primary/15 to-pink-500/15 border-primary/20"
      : "text-gray-700 dark:text-gray-200 border-transparent hover:text-gray-900 dark:hover:text-white hover:border-pink-300/40 dark:hover:border-pink-400/20 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-500/10 dark:hover:to-purple-500/10"
    }`

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Event", to: "/event" },
    { name: "Contact", to: "/contact" },
  ]

  return (
    <div className="relative">
      {/* --- Desktop --- */}
      <nav className="hidden md:flex items-center gap-1 bg-white/60 dark:bg-white/5 backdrop-blur-md px-2 py-2 rounded-full border border-white/60 dark:border-gray-800 shadow-sm">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-6 py-2 text-sm font-extrabold rounded-xl transition-all duration-200
               border
                ${isActive
                ? "text-pink-600 bg-gradient-to-r from-pink-100 to-purple-100 border-pink-300/40 dark:text-pink-300 dark:from-pink-500/15 dark:to-purple-500/15 dark:border-pink-400/20"
                : "text-gray-700 dark:text-gray-200 border-transparent hover:text-gray-900 dark:hover:text-white hover:border-pink-300/40 dark:hover:border-pink-400/20 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-500/10 dark:hover:to-purple-500/10"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* --- Mobile Button --- */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-2xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-200 active:scale-90 transition"
        aria-label="Open menu"
      >
        <PiAtomBold size={28} />
      </button>

      {/* ✅ Mobile Full Screen Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden">
          {/* Background blur */}
          <div
            className="absolute inset-0 bg-black/35 backdrop-blur-lg"
            onClick={() => setIsOpen(false)}
          />

          {/* Cute blobs */}
          <div className="pointer-events-none absolute -top-24 -left-24 size-72 bg-pink-300/30 blur-3xl rounded-full" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 bg-blue-300/30 blur-3xl rounded-full" />

          {/* Menu content */}
          <div className="relative z-10 w-full h-full flex flex-col">
            {/* Top bar */}
            <div className="w-full px-6 pt-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold tracking-widest text-white/80 uppercase">
                  Menu
                </p>
                <h3 className="text-2xl font-extrabold text-white">APM AI</h3>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-3 rounded-2xl bg-white/15 text-white hover:scale-105 active:scale-95 transition"
                aria-label="Close menu"
              >
                <PiBackspaceBold size={26} />
              </button>
            </div>

            {/* Links Card */}
            <div className="flex-1 flex items-center justify-center px-6">
              <div className="w-full max-w-sm bg-white/85 dark:bg-gray-900/80 border border-white/40 dark:border-gray-700 rounded-[2.5rem] shadow-2xl p-5">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={linkClasses}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </NavLink>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold">
                    Powered by APM AI • Assistant for Personal Motivation 💖
                  </p>
                </div>
              </div>
            </div>

            {/* bottom spacing */}
            <div className="h-10" />
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
