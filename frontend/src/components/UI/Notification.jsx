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
        <div className="fixed top-5 right-5 z-50">
            <div className={`w-[340px] rounded-2xl border shadow-lg p-4 flex gap-3 items-start ${typeStyles[type]}`}>
                <div>{typeIcon[type]}</div>

                <div className="flex-1">
                    <p className="font-bold text-sm">{title}</p>
                    <p className="text-sm opacity-90 mt-1">{message}</p>
                </div>

                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/60 hover:bg-white transition flex items-center justify-center"
                >
                    <FaTimes className="text-sm" />
                </button>
            </div>
        </div>
    )
}

export default Notification
