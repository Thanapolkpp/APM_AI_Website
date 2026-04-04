import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../assets/logo.png";
import { resetPassword } from "../services/aiService";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [error, setError] = useState("");

    // Password validation logic
    const isLengthValid = newPassword.length >= 8;
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const passwordsMatch = newPassword === confirmPassword && confirmPassword !== "";

    const isReady = isLengthValid && hasUpperCase && hasLowerCase && hasNumber && passwordsMatch;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!isReady) {
            setError("กรุณากรอกรหัสผ่านให้ครบตามเงื่อนไข");
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(token, newPassword);
            setIsDone(true);
        } catch (err) {
            setError(err.response?.data?.detail || "ลิงก์ไม่ถูกต้องหรือหมดอายุแล้ว");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-10 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />

            <div className="w-full max-w-[500px] bg-white/40 dark:bg-white/5 backdrop-blur-2xl rounded-[48px] shadow-2xl border border-white/60 dark:border-white/10 p-8 md:p-10 z-10 text-center">
                <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 rounded-3xl bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-white/80 dark:border-white/20 shadow-md overflow-hidden">
                        <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                </div>

                {!token ? (
                    <div className="py-8">
                        <h2 className="text-2xl font-black text-red-500 mb-4">ลิงก์ไม่ถูกต้อง</h2>
                        <p className="text-gray-500 font-bold mb-8">กรุณาคลิกลิงก์จาก Email อีกครั้ง</p>
                        <button onClick={() => navigate("/forgot-password")} className="w-full py-5 rounded-2xl bg-primary text-white font-black text-lg shadow-xl">
                            ขอลิงก์ใหม่
                        </button>
                    </div>
                ) : isDone ? (
                    <div className="py-8">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl text-green-500">check_circle</span>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">เปลี่ยนรหัสสำเร็จ!</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่</p>
                        <button onClick={() => navigate("/login")} className="w-full py-5 rounded-2xl bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-black text-lg shadow-xl hover:-translate-y-1 transition-all">
                            ไปหน้า Login
                        </button>
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">ตั้งรหัสผ่านใหม่</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">กรอกรหัสผ่านใหม่ที่ตรงตามเงื่อนไขความปลอดภัย</p>

                        {error && (
                            <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">error</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6 text-left">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">รหัสผ่านใหม่</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-6 py-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 outline-none focus:ring-4 focus:ring-primary/20 transition-all text-gray-800 dark:text-white font-bold"
                                />

                                {/* Password Requirements Checklist */}
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 px-1 bg-gray-50/50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                    {[
                                        { label: "อย่างน้อย 8 ตัวอักษร", met: isLengthValid },
                                        { label: "ตัวพิมพ์ใหญ่ (A-Z)", met: hasUpperCase },
                                        { label: "ตัวพิมพ์เล็ก (a-z)", met: hasLowerCase },
                                        { label: "มีตัวเลข (0-9)", met: hasNumber },
                                    ].map((req, index) => (
                                        <div 
                                            key={index} 
                                            className={`flex items-center gap-2 text-[10px] font-black transition-all duration-300 ${
                                                req.met ? "text-green-500" : "text-gray-400 opacity-70"
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-[14px]">
                                                {req.met ? "check_circle" : "circle"}
                                            </span>
                                            {req.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">ยืนยันรหัสผ่าน</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-6 py-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 outline-none focus:ring-4 focus:ring-primary/20 transition-all text-gray-800 dark:text-white font-bold"
                                />
                                {confirmPassword && (
                                    <div className={`mt-2 flex items-center gap-2 text-[11px] font-black ml-1 ${passwordsMatch ? "text-green-500" : "text-red-400"}`}>
                                        <span className="material-symbols-outlined text-[16px]">
                                            {passwordsMatch ? "check_circle" : "error"}
                                        </span>
                                        {passwordsMatch ? "รหัสผ่านตรงกัน" : "รหัสผ่านไม่ตรงกัน"}
                                    </div>
                                )}
                            </div>
                            
                            <button
                                type="submit"
                                disabled={isLoading || !isReady}
                                className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                                    isReady 
                                    ? "bg-gray-900 dark:bg-white dark:text-gray-900 text-white" 
                                    : "bg-gray-300 dark:bg-gray-700 text-gray-500"
                                }`}
                            >
                                {isLoading ? "กำลังบันทึก..." : "RESET PASSWORD"}
                            </button>
                        </form>
                    </>
                )}

                <div className="mt-8">
                    <button onClick={() => navigate("/login")} className="text-sm font-bold text-gray-500 hover:text-primary transition">
                        กลับไปหน้า Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
