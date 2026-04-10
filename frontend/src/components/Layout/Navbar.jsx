import React, { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { PiAtomBold, PiBackspaceBold, PiTranslateBold } from "react-icons/pi"
import CoinBadge from "../UI/CoinBadge"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const toggleLanguage = () => {
    const newLang = i18n.language === "th" ? "en" : "th"
    i18n.changeLanguage(newLang)
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto"
    return () => (document.body.style.overflow = "auto")
  }, [isOpen])

  const isLoggedIn = !!localStorage.getItem("token")

  const navLinks = isLoggedIn 
    ? [
        { name: t("nav.home"), to: "/", icon: "home" },
        { name: t("nav.mall"), to: "/avatar", icon: "shopping_bag" },
        { name: t("nav.summaries"), to: "/summaries", icon: "description" },
        { name: t("nav.todo"), to: "/todo", icon: "task_alt" },
        { name: t("nav.reading"), to: "/reading", icon: "menu_book" },
        { name: t("nav.events"), to: "/event", icon: "celebration" },
      ]
    : [
        { name: t("nav.home"), to: "/", icon: "home" },
        { name: t("nav.about"), to: "/about", icon: "info" },
        { name: t("nav.contact"), to: "/contact", icon: "alternate_email" },
      ]

  return (
    <>
      {/* DESKTOP NAV - Consistent with site theme */}
      <nav className={`hidden md:flex items-center ${i18n.language === "th" ? "gap-1" : "gap-1.5"} p-1.5 bg-white/40 dark:bg-black/20 backdrop-blur-3xl rounded-2xl border border-white/60 dark:border-white/10 shadow-sm max-w-full overflow-hidden`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-3 lg:px-4 py-2 ${i18n.language === "th" ? "text-[12px] lg:text-[13px]" : "text-sm"} font-black rounded-xl transition-all duration-200 border whitespace-nowrap shrink-0 flex items-center gap-1.5
                ${isActive
                ? "text-white bg-gradient-to-r from-primary to-pink-500 border-white/20 shadow-md"
                : "text-gray-600 dark:text-gray-300 border-transparent hover:bg-white/50 dark:hover:bg-white/10"
              }`
            }
          >
            <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
        
        {/* Language Switcher Desktop */}
        <button
          onClick={toggleLanguage}
          className="ml-1 px-2 py-2 text-xs font-black rounded-xl border border-transparent hover:bg-white/50 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-all flex items-center gap-1 shrink-0"
        >
          <PiTranslateBold size={16} className="text-primary" />
          <span className="uppercase text-[10px]">{i18n.language === "th" ? "TH" : "EN"}</span>
        </button>
      </nav>

      {/* MOBILE TRIGGER - Small & Compact to avoid header crowding */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          onClick={toggleLanguage}
          className="size-10 rounded-xl bg-white/90 dark:bg-white/5 border border-white/60 dark:border-white/10 text-primary active:scale-90 transition-all shadow-sm flex items-center justify-center font-black text-[10px]"
        >
          {i18n.language.toUpperCase()}
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl bg-white/90 dark:bg-white/5 border border-white/60 dark:border-white/10 text-primary active:scale-90 transition-all shadow-sm"
        >
          <PiAtomBold size={24} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[10000] md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Card - Absolute centering for maximum reliability */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, x: "-50%", y: "0%" }}
              animate={{ scale: 1, opacity: 1, x: "-50%", y: "0%" }}
              exit={{ scale: 0.9, opacity: 0, x: "-50%", y: "0%" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[90%] max-w-[340px] max-h-[85vh] bg-white/95 dark:bg-[#111113] rounded-[3rem] shadow-2xl border border-white/20 overflow-y-auto scrollbar-hide flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-8 pb-4">
                <h3 className="font-black text-2xl text-primary italic">MENU</h3>
                <div className="flex gap-2">
                   <button
                    onClick={toggleLanguage}
                    className="size-12 rounded-2xl bg-gray-100 dark:bg-white/5 text-primary active:scale-90 flex items-center justify-center font-black"
                  >
                    {i18n.language.toUpperCase()}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="size-12 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 active:scale-90 flex items-center justify-center"
                  >
                    <PiBackspaceBold size={28} />
                  </button>
                </div>
              </div>

              {/* Links */}
              <div className="flex-1 flex flex-col gap-2 px-6 pb-12">
                
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="w-full"
                  >
                    <NavLink
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between w-full px-7 py-4 rounded-2xl font-black transition-all border
                          ${isActive
                            ? "bg-gradient-to-r from-primary to-pink-500 text-white border-white/30 shadow-lg"
                            : "text-gray-500 dark:text-gray-400 border-transparent hover:bg-primary/5 active:bg-primary/10"
                          }`
                      }
                    >
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-2xl">{link.icon}</span>
                        <span className="text-lg uppercase tracking-tight">{link.name}</span>
                      </div>
                      <span className="material-symbols-outlined text-xl opacity-60">chevron_right</span>
                    </NavLink>
                  </motion.div>
                ))}

                {isLoggedIn && (
                   <motion.button
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: navLinks.length * 0.05 + 0.1 }}
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/";
                    }}
                    className="flex items-center justify-center gap-2 w-full mt-6 px-7 py-4 rounded-2xl font-black text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 active:scale-95 transition-all shadow-sm"
                   >
                     <span className="material-symbols-outlined">logout</span>
                     <span className="uppercase">{t("nav.logout")}</span>
                   </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
