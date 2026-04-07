import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Timer, LogOut, ChevronDown, ChevronUp } from "lucide-react";

const SESSION_DURATION = 60 * 60; // 1 ชั่วโมง (วินาที)
const STORAGE_KEY = "session_start_time";
const WARNING_THRESHOLD = 5 * 60; // เตือนเมื่อเหลือ 5 นาที

const SessionTimer = () => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isWarning, setIsWarning] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // คำนวณ timeLeft จาก session_start_time ที่เก็บไว้
    const calcTimeLeft = useCallback(() => {
        const startTime = parseInt(localStorage.getItem(STORAGE_KEY) || "0");
        if (!startTime) return null;
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        return Math.max(0, SESSION_DURATION - elapsed);
    }, []);

    // Logout อัตโนมัติ
    const handleAutoLogout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("avatar");
        localStorage.removeItem("user_coins");
        localStorage.removeItem(STORAGE_KEY);
        alert("⏰ Session หมดอายุแล้วครับ กรุณาเข้าสู่ระบบใหม่นะครับเพื่อน 🌷");
        navigate("/login");
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsVisible(false);
            return;
        }

        // ถ้ายังไม่มี session_start_time ให้เริ่มนับใหม่
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, Date.now().toString());
        }

        setIsVisible(true);
        setTimeLeft(calcTimeLeft());

        const interval = setInterval(() => {
            const remaining = calcTimeLeft();
            setTimeLeft(remaining);
            setIsWarning(remaining !== null && remaining <= WARNING_THRESHOLD);

            if (remaining === 0) {
                clearInterval(interval);
                handleAutoLogout();
            }
        }, 1000);

        // รับฟัง event login ใหม่ → รีเซ็ต timer
        const handleLogin = () => {
            localStorage.setItem(STORAGE_KEY, Date.now().toString());
            setTimeLeft(SESSION_DURATION);
            setIsWarning(false);
            setIsVisible(true);
        };

        // รับฟัง event logout ด้วยตัวเอง → ซ่อน timer
        const handleLogout = () => {
            localStorage.removeItem(STORAGE_KEY);
            setIsVisible(false);
        };

        window.addEventListener("userLoggedIn", handleLogin);
        window.addEventListener("userLoggedOut", handleLogout);

        return () => {
            clearInterval(interval);
            window.removeEventListener("userLoggedIn", handleLogin);
            window.removeEventListener("userLoggedOut", handleLogout);
        };
    }, [calcTimeLeft, handleAutoLogout]);

    if (!isVisible || timeLeft === null) return null;

    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    const pad = (n) => String(n).padStart(2, "0");
    const progress = (timeLeft / SESSION_DURATION) * 100;

    return (
        <div
            className={`fixed bottom-6 left-4 z-[9999] transition-all duration-500 select-none ${
                isWarning ? "animate-pulse" : ""
            }`}
        >
            <div
                className={`rounded-2xl shadow-2xl border backdrop-blur-xl overflow-hidden transition-all duration-300 ${
                    isWarning
                        ? "bg-red-50/95 dark:bg-red-950/90 border-red-200 dark:border-red-500/30 shadow-red-500/20"
                        : "bg-white/95 dark:bg-gray-900/90 border-gray-100 dark:border-white/10 shadow-black/10"
                }`}
            >
                {/* Header Bar */}
                <div
                    className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer"
                    onClick={() => setIsMinimized((p) => !p)}
                >
                    <div className="flex items-center gap-2">
                        <div
                            className={`size-7 rounded-xl flex items-center justify-center ${
                                isWarning
                                    ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
                                    : "bg-primary/10 text-primary"
                            }`}
                        >
                            <Timer size={15} />
                        </div>
                        <span
                            className={`text-[10px] font-black uppercase tracking-widest ${
                                isWarning
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-gray-500 dark:text-gray-400"
                            }`}
                        >
                            {isWarning ? "⚠️ Session ใกล้หมด!" : "Session Time"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Countdown Display */}
                        <div
                            className={`font-black text-sm tabular-nums tracking-tight ${
                                isWarning
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-gray-900 dark:text-white"
                            }`}
                        >
                            {hours > 0 ? `${pad(hours)}:` : ""}{pad(minutes)}:{pad(seconds)}
                        </div>

                        {isMinimized ? (
                            <ChevronUp size={14} className="text-gray-400" />
                        ) : (
                            <ChevronDown size={14} className="text-gray-400" />
                        )}
                    </div>
                </div>

                {/* Expanded Content */}
                {!isMinimized && (
                    <div className="px-4 pb-4 space-y-3">
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${
                                    isWarning
                                        ? "bg-gradient-to-r from-red-500 to-orange-500"
                                        : "bg-gradient-to-r from-primary to-indigo-500"
                                }`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 text-center">
                            {isWarning
                                ? "Session จะหมดอายุเร็วๆ นี้ กรุณาบันทึกงาน!"
                                : "Session จะหมดอายุอัตโนมัติใน 1 ชั่วโมง"}
                        </p>

                        {/* Logout Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm("ต้องการออกจากระบบเดี๋ยวนี้เลยไหมครับ?")) {
                                    handleAutoLogout();
                                }
                            }}
                            className="w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent hover:border-red-100 dark:hover:border-red-500/20"
                        >
                            <LogOut size={12} />
                            ออกจากระบบ
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionTimer;
