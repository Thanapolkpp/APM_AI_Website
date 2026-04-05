import React, { useEffect } from "react"
import { FaTimes, FaCheckCircle, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa"

const typeStyles = {
    success: "bg-green-50 border-green-200 text-green-700",
    error: "bg-red-50 border-red-200 text-red-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    info: "bg-sky-50 border-sky-200 text-sky-700",
}

const typeIcon = {
    success: <FaCheckCircle className="text-xl" />,
    error: <FaTimes className="text-xl" />,
    warning: <FaExclamationTriangle className="text-xl" />,
    info: <FaInfoCircle className="text-xl" />,
}

const Notification = ({
    show,
    type = "info",
    title = "แจ้งเตือน",
    message = "นี่คือข้อความแจ้งเตือน",
    onClose,
    autoClose = true,
    duration = 3000,
}) => {
    useEffect(() => {
        if (!show) return
        if (!autoClose) return

        const timer = setTimeout(() => {
            onClose?.()
        }, duration)

        return () => clearTimeout(timer)
    }, [show, autoClose, duration, onClose])

    if (!show) return null

    return (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-5 md:top-5 z-[200] animate-in slide-in-from-top-4 duration-300">
            <div className={`mx-auto w-full max-w-sm md:w-[380px] rounded-[2rem] border shadow-2xl p-5 flex gap-4 backdrop-blur-xl transition-all ${typeStyles[type]}`}>
                <div className="size-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    {typeIcon[type]}
                </div>

                <div className="flex-1 pt-0.5">
                    <p className="font-black text-sm uppercase tracking-tight">{title}</p>
                    <p className="text-sm font-medium opacity-90 mt-0.5 leading-relaxed">{message}</p>
                </div>

                <button
                    onClick={onClose}
                    className="size-8 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition flex items-center justify-center shrink-0"
                >
                    <FaTimes className="text-xs" />
                </button>
            </div>
        </div>
    )
}

export default Notification
