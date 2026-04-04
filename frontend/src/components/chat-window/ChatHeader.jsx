import React from "react"
import Navbar from "../Layout/Navbar"
import Logo from "../../assets/logo.png"
import GirlIcon from "../../assets/Girl.png"
import BroIcon from "../../assets/Bro.png"
import NerdIcon from "../../assets/Nerd.1.2.png"
import CoinBadge from "../UI/CoinBadge"


const ChatHeader = ({ mode, headerTheme, onClearChat, navigate, guestChatCount, isLoggedIn }) => {
    const [profileImage] = React.useState(() => {
        if (!localStorage.getItem("token")) return Logo;
        const savedImage = localStorage.getItem("avatarImage");
        if (savedImage) return savedImage;
        const savedAvatar = localStorage.getItem("avatar") || "bro";
        const map = { girl: GirlIcon, nerd: NerdIcon, bro: BroIcon };
        return map[savedAvatar.toLowerCase()] || BroIcon;
    });

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-xl">
            <div className="mx-auto grid w-full grid-cols-2 items-center px-4 py-4 sm:px-6 md:grid-cols-3">
                {/* LEFT */}
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className={`relative size-11 sm:size-12 shrink-0 overflow-hidden rounded-2xl bg-white/20 shadow-md ring-2 ${headerTheme.ring}`}
                    >
                        <img
                            src={Logo}
                            alt="Logo"
                            className="h-full w-full object-cover transition duration-300 hover:scale-110"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-pink-200/30 via-transparent to-blue-200/20" />
                    </div>
                </div>

                {/* CENTER */}
                <div className="hidden md:flex justify-center">
                    <div className="rounded-full border border-white/20 bg-white/15 px-6 py-2 shadow-sm">
                        <Navbar />
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex justify-end items-center gap-3">
                    <CoinBadge className="hidden sm:flex scale-90" />
                    
                    <button className="relative size-9 sm:size-10 rounded-full flex items-center justify-center bg-white/90 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-105 active:scale-95">
                        <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-gray-700 dark:text-gray-200">
                            notifications
                        </span>
                        <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
                    </button>


                    <button
                        type="button"
                        onClick={() => navigate(localStorage.getItem("token") ? "/account" : "/login")}
                        className="size-9 sm:size-10 rounded-full bg-cover bg-center border-2 border-primary/70 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-sm"
                        style={{ backgroundImage: `url("${profileImage}")`, backgroundColor: "white" }}
                        title="Go to Login"
                        aria-label="Go to login"
                    />

                    {/* Mobile Navbar */}
                    <div className="md:hidden">
                        <Navbar />
                    </div>
                </div>
            </div>

            {/* Mode Pill */}
            <div className="px-4 pb-4">
                <div
                    className={`w-full rounded-2xl p-4 font-bold capitalize shadow-md transition-all duration-500 flex items-center justify-between bg-gradient-to-r ${headerTheme.pill} text-white`}
                >
                    <div className="flex items-center gap-2">
                        <img
                            src={mode === "bro" ? BroIcon : mode === "girl" ? GirlIcon : NerdIcon}
                            alt="mode icon"
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-white/60"
                        />

                        <span>{mode} Mode Online</span>
                    </div>

                    {!isLoggedIn && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold shadow-sm">
                            <span className="material-symbols-outlined text-[14px]">bolt</span>
                            <div>เหลือ {5 - guestChatCount} ครั้ง</div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClearChat}
                            className="px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-sm"
                        >
                            ล้างแชท
                        </button>

                        <div className="size-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default ChatHeader
