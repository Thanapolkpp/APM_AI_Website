import React from "react"
import Navbar from "../Layout/Navbar"
import { ASSETS, getAvatarIcon } from "../../config/assets";
import { User, Bell } from "lucide-react";
import CoinBadge from "../UI/CoinBadge"

const Logo = ASSETS.BRANDING.LOGO;
const GirlIcon = ASSETS.AVATARS.GIRL;
const BroIcon = ASSETS.AVATARS.BRO;
const NerdIcon = ASSETS.AVATARS.NERD2;

const ChatHeader = ({ mode, headerTheme, onClearChat, navigate, guestChatCount, isLoggedIn }) => {
    const [profileImage, setProfileImage] = React.useState(null);

    const refreshProfileImage = React.useCallback(() => {
        const savedImage = localStorage.getItem("avatarImage");
        if (savedImage) {
            setProfileImage(savedImage);
            return;
        }
        const savedAvatar = localStorage.getItem("avatar");
        setProfileImage(getAvatarIcon(savedAvatar));
    }, []);

    React.useEffect(() => {
        refreshProfileImage();
        window.addEventListener("avatarUpdated", refreshProfileImage);
        return () => window.removeEventListener("avatarUpdated", refreshProfileImage);
    }, [refreshProfileImage]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-white/5 bg-white backdrop-blur-xl">
            <div className="mx-auto flex items-center justify-between px-4 py-2 sm:px-6 sm:py-3">
                {/* LEFT: Branding */}
                <div className="flex items-center gap-2 group cursor-pointer shrink-0" onClick={() => navigate("/")}>
                    <div className="relative size-10 sm:size-12 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden p-1.5 transition-transform group-hover:scale-105">
                        <img
                            src={profileImage || Logo}
                            alt="Logo"
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <h1 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">APM AI</h1>
                        <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Assistant</p>
                    </div>
                </div>

                {/* CENTER: Navbar (Desktop) */}
                <div className="hidden md:flex justify-center flex-1 mx-8">
                    <div className="rounded-full border border-gray-100 bg-gray-50/50 px-8 py-2 shadow-sm">
                        <Navbar />
                    </div>
                </div>
         
                {/* RIGHT: Actions */}
                <div className="flex justify-end items-center gap-2 sm:gap-4 shrink-0">


                    <button className="relative size-10 rounded-full flex items-center justify-center bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm text-gray-400 transition-all hover:text-gray-600 active:scale-95">
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-black" />
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(isLoggedIn ? "/account" : "/login")}
                        className="size-10 rounded-full flex items-center justify-center border-2 border-white dark:border-white/10 cursor-pointer overflow-hidden transition-all shadow-md bg-gray-100 ring-1 ring-gray-100"
                    >
                        {isLoggedIn && profileImage ? (
                            <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={20} className="text-gray-400" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mode Pill: Integrated with Coins & Rank */}
            <div className="px-3 pb-3">
                <div
                    className={`w-full rounded-[2.5rem] p-4 font-bold shadow-xl transition-all duration-500 flex items-center justify-between bg-gradient-to-r ${headerTheme.pill} text-white`}
                >
                    <div className="flex items-center gap-4 min-w-0 ml-1">
                        <div className="size-12 sm:size-16 rounded-full bg-white/20 p-1 shrink-0 ring-4 ring-white/20">
                             <img
                                src={mode === "bro" ? BroIcon : mode === "girl" ? GirlIcon : NerdIcon}
                                alt="mode icon"
                                className="w-full h-full rounded-full object-cover border-2 border-white/40 shadow-lg"
                            />
                        </div>
                        <div className="min-w-0 flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-base sm:text-xl font-black tracking-tight">{mode.toUpperCase()} MODE</span>
                            </div>
                            <div className="flex items-center gap-2 opacity-80">
                                <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase">Online Now</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 mr-1">
                        {isLoggedIn && (
                             <div className="hidden sm:flex items-center gap-3 p-2 px-4 rounded-3xl bg-black/20 backdrop-blur-md border border-white/20">
                                <CoinBadge isVibrant={true} className="!gap-4" />
                             </div>
                        )}

                        {!isLoggedIn && (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/20 backdrop-blur-md border border-white/20 text-xs font-black shadow-inner whitespace-nowrap">
                                <span className="material-symbols-outlined text-lg">bolt</span>
                                <span className="opacity-90">{5 - guestChatCount} LFT</span>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClearChat}
                                className="px-5 py-2 sm:px-7 rounded-full bg-blue-500 hover:bg-blue-600 transition-all text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] border border-white/30 active:scale-95 shadow-xl"
                            >
                                Reset
                            </button>
                            <div className="size-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,1)] border-2 border-white/40" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default ChatHeader
