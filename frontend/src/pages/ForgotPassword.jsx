import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ASSETS } from "../config/assets";

const Logo = ASSETS.BRANDING.LOGO;
import { forgotPassword } from "../services/aiService";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await forgotPassword(email);
            setIsSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.detail || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ในขณะนี้");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
            {/* Background Blobs */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

            <div className="w-full max-w-[500px] bg-white/40 dark:bg-white/5 backdrop-blur-2xl rounded-[48px] shadow-2xl border border-white/60 dark:border-white/10 p-10 z-10 text-center">
                
                <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 rounded-3xl bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-white/80 dark:border-white/20 shadow-md overflow-hidden">
                        <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                </div>

                {!isSubmitted ? (
                    <>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">ลืมรหัสผ่านใช่ไหม?</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">ไม่ต้องกังวล! เพียงกรอกอีเมลของคุณ <br/> เราจะส่งรหัสกู้คืนไปให้</p>

                        {error && (
                            <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2 animate-shake">
                                <span className="material-symbols-outlined text-lg">error</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="text-left">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                    อีเมลที่ใช้สมัคร
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full px-6 py-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 shadow-sm outline-none focus:ring-4 focus:ring-primary/20 transition-all text-gray-800 dark:text-white font-bold"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white font-black text-lg shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {isLoading ? "กำลังส่ง..." : "ส่งรหัสกู้คืน"}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="py-8">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl text-green-500">check_circle</span>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">ส่งเรียบร้อย!</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">
                            ตรวจสอบอีเมลของคุณเพื่อดำเนินการรีเซ็ตรหัสผ่าน <br/> 
                            (อย่าลืมเช็คใน Junk Mail/Spam นะ!)
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full py-5 rounded-2xl bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-black text-lg shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all"
                        >
                            กลับไปที่หน้า Login
                        </button>
                    </div>
                )}

                <div className="mt-8">
                    <button
                        onClick={() => navigate("/login")}
                        className="text-sm font-bold text-gray-500 hover:text-primary transition"
                    >
                        นึกออกแล้ว! กลับไปเข้าสู่ระบบ
                    </button>
                </div>
            </div>
            
            <button
                onClick={() => navigate("/login")}
                className="absolute top-8 left-8 flex items-center gap-2 px-6 py-3 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md border border-white/50 dark:border-white/10 text-gray-700 dark:text-white font-black shadow-sm hover:bg-white transition z-20 active:scale-95"
            >
                <span className="material-symbols-outlined text-lg">arrow_back</span> ย้อนกลับ
            </button>
        </div>
    );
};

export default ForgotPassword;
