import React, { useState, useEffect, useRef } from "react"
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

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="font-bold text-sm text-gray-800 dark:text-white">
                            การแจ้งเตือน
                        </span>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-primary hover:underline font-medium"
                            >
                                อ่านทั้งหมด
                            </button>
                        )}
                    </div>

                    {/* List */}
                    {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                            ยังไม่มีการแจ้งเตือน
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-50 dark:divide-gray-800">
                            {notifications.map((n) => {
                                const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.general
                                return (
                                    <li
                                        key={n.id}
                                        onClick={() => !n.is_read && handleMarkRead(n.id)}
                                        className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors ${
                                            n.is_read
                                                ? "bg-white dark:bg-gray-900"
                                                : "bg-primary/5 dark:bg-primary/10 hover:bg-primary/10"
                                        }`}
                                    >
                                        <span className="text-xl mt-0.5 shrink-0">{cfg.icon}</span>
                                        <div className="min-w-0 flex-1">
                                            <p className={`text-sm font-semibold truncate ${n.is_read ? "text-gray-600 dark:text-gray-400" : "text-gray-900 dark:text-white"}`}>
                                                {n.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                                {timeAgo(n.created_at)}
                                            </p>
                                        </div>
                                        {!n.is_read && (
                                            <span className="size-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}

export default NotificationBell
