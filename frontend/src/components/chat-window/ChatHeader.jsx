import React from "react"
import Navbar from "../Layout/Navbar"
import { ASSETS } from "../../config/assets";
import { User, Bell } from "lucide-react";
import CoinBadge from "../UI/CoinBadge"

const Logo = ASSETS.BRANDING.LOGO;
const GirlIcon = ASSETS.AVATARS.GIRL;
const BroIcon = ASSETS.AVATARS.BRO;
const NerdIcon = ASSETS.AVATARS.NERD2;

const ChatHeader = ({ mode, headerTheme, onClearChat, navigate, guestChatCount, isLoggedIn }) => {
    const [profileImage] = React.useState(() => {
        const savedImage = localStorage.getItem("avatarImage");
        if (savedImage) return savedImage;
        const savedAvatar = localStorage.getItem("avatar") || "bro";
        const map = { girl: GirlIcon, nerd: NerdIcon, bro: BroIcon };
        const mapped = map[savedAvatar.toLowerCase()];
        if (mapped) return mapped;
        return null;
    });

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-black/40 backdrop-blur-xl">
            <div className="mx-auto flex items-center justify-between px-3 py-2 sm:px-6 sm:py-4">
                {/* LEFT: Branding */}
                <div className="flex items-center gap-1.5 xs:gap-2 group cursor-pointer shrink-0" onClick={() => navigate("/")}>
                    <div className={`relative size-8 sm:size-11 rounded-xl bg-white shadow-sm ring-1 sm:ring-2 ${headerTheme.ring} overflow-hidden`}>
                        <img
                            src={Logo}
                            alt="Logo"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col leading-none">
                        <h1 className="text-[10px] sm:text-sm font-black text-gray-900 dark:text-white tracking-tighter">APM AI</h1>
                        <p className="text-[7px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">Assistant</p>
                    </div>
                </div>

                {/* CENTER: Navbar (Desktop) */}
                <div className="hidden md:flex justify-center flex-1 mx-4">
                    <div className="rounded-full border border-white/20 bg-white/10 px-6 py-2 shadow-sm">
                        <Navbar />
                    </div>
                </div>
         
                {/* RIGHT: Actions */}
                <div className="flex justify-end items-center gap-1.5 sm:gap-3 shrink-0">
                    <button className="relative size-8 sm:size-10 rounded-full flex items-center justify-center bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm text-gray-500 transition-all active:scale-95">
                        <Bell size={16} className="sm:hidden" />
                        <Bell size={20} className="hidden sm:block" />
                        <span className="absolute top-2 right-2 size-1.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-black" />
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(isLoggedIn ? "/account" : "/login")}
                        className="size-8 sm:size-10 rounded-full flex items-center justify-center border border-gray-200 dark:border-white/10 cursor-pointer overflow-hidden transition-all shadow-sm bg-gray-50"
                    >
                        {isLoggedIn && profileImage ? (
                            <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={16} className="text-gray-400" />
                        )}
                    </button>

                    <div className="md:hidden">
                        <Navbar />
                    </div>
                </div>
            </div>

            {/* Mode Pill: Ultra Compact for Mobile */}
            <div className="px-2 pb-2">
                <div
                    className={`w-full rounded-2xl px-3 py-2.5 font-bold shadow-md transition-all duration-500 flex items-center justify-between bg-gradient-to-r ${headerTheme.pill} text-white`}
                >
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="size-7 sm:size-9 rounded-full bg-white/20 p-0.5 shrink-0 ring-1 ring-white/40">
                             <img
                                src={mode === "bro" ? BroIcon : mode === "girl" ? GirlIcon : NerdIcon}
                                alt="mode icon"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <div className="min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-2">
                            <span className="text-[11px] sm:text-sm font-black truncate">{mode.toUpperCase()} MODE</span>
                            <div className="flex items-center gap-1.5 sm:hidden">
                                <div className="size-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                                <span className="text-[8px] font-bold opacity-80 uppercase tracking-widest">Active</span>
                            </div>
                            <span className="text-[10px] font-bold opacity-80 tracking-widest hidden sm:block">Online Now</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* Status elements are mutually exclusive now to save space */}
                        {isLoggedIn ? (
                             <CoinBadge isVibrant={true} className="hidden sm:block scale-90 origin-right transition-transform" />
                        ) : (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/10 backdrop-blur-md border border-white/20 text-[9px] font-black shadow-inner whitespace-nowrap">
                                <span className="material-symbols-outlined text-[12px] sm:text-[14px]">bolt</span>
                                <span className="opacity-90">{5 - guestChatCount} LFT</span>
                            </div>
                        )}

                        <button
                            onClick={onClearChat}
                            className="px-2.5 py-1 sm:px-4 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-[9px] sm:text-xs font-black uppercase tracking-wider border border-white/10 active:scale-95"
                        >
                            Reset
                        </button>
                        
                        <div className="hidden sm:block size-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default ChatHeader
