import React, { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
    fetchNotifications,
    fetchUnreadCount,
    markNotificationRead,
    markAllNotificationsRead,
} from "../../services/notificationService"

const TYPE_CONFIG = {
    purchase: { icon: "🛒", color: "text-blue-500" },
    sale:     { icon: "💰", color: "text-green-500" },
    coin_earned: { icon: "⭐", color: "text-yellow-500" },
    general:  { icon: "🔔", color: "text-purple-500" },
}

function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
}

const NotificationBell = () => {
    const [open, setOpen] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const dropdownRef = useRef(null)

    const token = localStorage.getItem("token")

    const loadData = async () => {
        if (!token) return
        try {
            const [notifs, count] = await Promise.all([
                fetchNotifications(),
                fetchUnreadCount(),
            ])
            setNotifications(notifs)
            setUnreadCount(count)
        } catch {
            // ไม่ login หรือ token หมดอายุ
        }
    }

    // โหลดครั้งแรก + polling ทุก 30 วินาที
    useEffect(() => {
        loadData()
        const interval = setInterval(loadData, 30000)
        return () => clearInterval(interval)
    }, [token])

    // ปิด dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleOpen = () => {
        setOpen((prev) => !prev)
    }

    const handleMarkRead = async (id) => {
        try {
            await markNotificationRead(id)
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            )
            setUnreadCount((prev) => Math.max(0, prev - 1))
        } catch {}
    }

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead()
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
            setUnreadCount(0)
        } catch {}
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={handleOpen}
                className="relative size-9 sm:size-10 rounded-full flex items-center justify-center bg-white/90 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-105 active:scale-95"
                aria-label="Notifications"
            >
                <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-gray-700 dark:text-gray-200">
                    notifications
                </span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800 flex items-center justify-center text-white text-[10px] font-bold">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown / Overlay Control */}
            <AnimatePresence>
                {open && (
                    <div className="fixed sm:absolute inset-0 sm:inset-auto sm:right-0 sm:mt-2 z-[500] w-full sm:w-[380px] h-full sm:h-auto flex items-center justify-center sm:block p-6 sm:p-0">
                        {/* Mobile Backdrop Overlay */}
                        <div 
                            className="fixed inset-0 bg-black/70 sm:hidden backdrop-blur-xl"
                            onClick={() => setOpen(false)}
                        />

                        {/* Content Card - Positioned in the bottom half (Top-50%, no Y translation) for consistency */}
                        <motion.div 
                            initial={{ opacity: 0, x: "-50%", y: "20%", scale: 0.95 }}
                            animate={{ opacity: 1, x: "-50%", y: "0%", scale: 1 }}
                            exit={{ opacity: 0, x: "-50%", y: "20%", scale: 0.95 }}
                            style={{ position: 'absolute', top: '50%', left: '50%' }}
                            className="z-10 w-full bg-white/95 dark:bg-[#0c0c0e] rounded-[3.5rem] sm:rounded-3xl shadow-[0_32px_128px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/10 overflow-hidden flex flex-col max-h-[75vh] sm:max-h-[500px]"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-7 sm:px-6 sm:py-5 bg-white/50 dark:bg-white/5 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
                                <div>
                                    <p className="text-[10px] font-black tracking-[0.2em] text-primary uppercase mb-0.5">Inbox</p>
                                    <h3 className="font-black text-2xl sm:text-lg text-gray-900 dark:text-white leading-tight">การแจ้งเตือน</h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={handleMarkAllRead}
                                            className="text-xs font-black text-primary px-3 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 transition-all border border-primary/20"
                                        >
                                            อ่านทั้งหมด
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => setOpen(false)}
                                        className="sm:hidden size-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 active:scale-90"
                                    >
                                        <span className="material-symbols-outlined text-3xl">close</span>
                                    </button>
                                </div>
                            </div>

                            {/* List area */}
                            <div className="flex-1 overflow-y-auto scrollbar-hide">
                                {notifications.length === 0 ? (
                                    <div className="px-6 py-20 flex flex-col items-center justify-center text-center">
                                        <div className="size-20 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-6 text-gray-300 dark:text-gray-600">
                                            <span className="material-symbols-outlined text-5xl">notifications_none</span>
                                        </div>
                                        <p className="font-black text-gray-400 text-sm italic">ยังไม่มีการแจ้งเตือนครับเพื่อน ✨</p>
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {notifications.map((n) => {
                                            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.general
                                            return (
                                                <li
                                                    key={n.id}
                                                    onClick={() => !n.is_read && handleMarkRead(n.id)}
                                                    className={`flex gap-5 px-7 py-6 sm:py-4 cursor-pointer transition-all duration-300 ${
                                                        n.is_read
                                                            ? "bg-transparent opacity-80"
                                                            : "bg-primary/5 dark:bg-primary/10 hover:bg-primary/10"
                                                    }`}
                                                >
                                                    <span className="text-3xl pt-1 shrink-0">{cfg.icon}</span>
                                                    <div className="min-w-0 flex-1">
                                                        <p className={`text-lg sm:text-sm font-black tracking-tight leading-tight mb-1.5 ${n.is_read ? "text-gray-600 dark:text-gray-400" : "text-gray-900 dark:text-white"}`}>
                                                            {n.title}
                                                        </p>
                                                        <p className="text-base sm:text-xs font-semibold text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                                            {n.message}
                                                        </p>
                                                        <p className="text-[11px] font-black text-gray-400 dark:text-gray-600 mt-3 uppercase tracking-widest opacity-60">
                                                            {timeAgo(n.created_at)}
                                                        </p>
                                                    </div>
                                                    {!n.is_read && (
                                                        <span className="size-2.5 rounded-full bg-primary mt-4 shrink-0 shadow-[0_0_15px_rgba(255,20,147,0.6)]" />
                                                    )}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </div>
                            
                            {/* Mobile Branding Footer */}
                            <div className="sm:hidden p-10 pt-4 text-center pb-12">
                                <p className="text-[10px] text-gray-300 dark:text-gray-600 font-black uppercase tracking-[0.4em]">
                                    Stay Updated Bestie 🌷
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default NotificationBell
