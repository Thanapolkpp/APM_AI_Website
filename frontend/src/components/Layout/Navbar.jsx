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
      {/* DESKTOP NAV */}
      <nav className={`hidden md:flex items-center ${i18n.language === "th" ? "gap-2" : "gap-3"} p-2 bg-white rounded-2xl border-4 border-toon-black shadow-toon max-w-full overflow-hidden font-cartoon`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-4 py-2 ${i18n.language === "th" ? "text-sm" : "text-base"} font-black rounded-xl transition-all duration-200 border-2 whitespace-nowrap shrink-0 flex items-center gap-2
                ${isActive
                ? "text-toon-black bg-primary border-toon-black shadow-toon"
                : "text-gray-600 border-transparent hover:bg-yellow-50"
              }`
            }
          >
            <span className="material-symbols-outlined font-black text-xl">{link.icon}</span>
            <span className="uppercase italic">{link.name}</span>
          </NavLink>
        ))}
        
        {/* Language Switcher Desktop */}
        <button
          onClick={toggleLanguage}
          className="ml-2 px-3 py-2 text-sm font-black rounded-xl border-2 border-toon-black bg-yellow-200 hover:bg-yellow-300 text-toon-black transition-all flex items-center gap-1 shrink-0 shadow-toon"
        >
          <PiTranslateBold size={18} />
          <span className="uppercase">{i18n.language === "th" ? "TH" : "EN"}</span>
        </button>
      </nav>

      {/* MOBILE TRIGGER */}
      <div className="flex items-center gap-3 md:hidden font-cartoon">
        <button
          onClick={toggleLanguage}
          className="size-12 rounded-2xl bg-white border-4 border-toon-black text-toon-black active:scale-90 transition-all shadow-toon flex items-center justify-center font-black text-sm uppercase italic"
        >
          {i18n.language}
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className="size-12 rounded-2xl bg-primary border-4 border-toon-black text-toon-black active:scale-90 transition-all shadow-toon flex items-center justify-center"
        >
          <PiAtomBold size={28} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[10000] md:hidden font-cartoon">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, x: "-50%", y: "0%" }}
              animate={{ scale: 1, opacity: 1, x: "-50%", y: "0%" }}
              exit={{ scale: 0.9, opacity: 0, x: "-50%", y: "0%" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[90%] max-w-[340px] max-h-[85vh] bg-white rounded-[40px] shadow-toon-xl border-4 border-toon-black overflow-y-auto scrollbar-hide flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-8 pb-4">
                <h3 className="font-black text-3xl text-toon-black italic uppercase">Menu</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="size-12 rounded-2xl bg-red-100 border-4 border-toon-black text-toon-black active:scale-90 flex items-center justify-center shadow-toon"
                  >
                    <PiBackspaceBold size={28} />
                  </button>
                </div>
              </div>

              {/* Links */}
              <div className="flex-1 flex flex-col gap-3 px-6 pb-12">
                
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
                        `flex items-center justify-between w-full px-7 py-4 rounded-2xl font-black transition-all border-4 shadow-toon
                          ${isActive
                            ? "bg-primary text-toon-black border-toon-black"
                            : "bg-white text-gray-500 border-toon-black/10 hover:border-toon-black active:bg-yellow-50"
                          }`
                      }
                    >
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-2xl font-black">{link.icon}</span>
                        <span className="text-xl uppercase italic tracking-tight">{link.name}</span>
                      </div>
                      <span className="material-symbols-outlined text-xl font-black">chevron_right</span>
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
                    className="flex items-center justify-center gap-2 w-full mt-6 px-7 py-4 rounded-2xl font-black text-white bg-red-500 border-4 border-toon-black shadow-toon active:translate-y-0.5 active:shadow-none transition-all"
                   >
                     <span className="material-symbols-outlined font-black">logout</span>
                     <span className="uppercase italic">{t("nav.logout")}</span>
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
