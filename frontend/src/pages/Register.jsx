import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ASSETS } from "../config/assets";

const Logo = ASSETS.BRANDING.LOGO;
const BroIcon = ASSETS.AVATARS.BRO;
const NerdIcon = ASSETS.AVATARS.NERD2; // Default Nerd
import { register } from "../services/aiService";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // ตรวจความปลอดภัยรหัสผ่าน
        const password = formData.password;
        if (password.length < 8) {
            setError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
            setIsLoading(false);
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setError("รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัว");
            setIsLoading(false);
            return;
        }
        if (!/[a-z]/.test(password)) {
            setError("รหัสผ่านต้องมีตัวอักษรพิมพ์เล็ก (a-z) อย่างน้อย 1 ตัว");
            setIsLoading(false);
            return;
        }
        if (!/[0-9]/.test(password)) {
            setError("รหัสผ่านต้องมีตัวเลข (0-9) อย่างน้อย 1 ตัว");
            setIsLoading(false);
            return;
        }

        if (password !== formData.confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
            setIsLoading(false);
            return;
        }
        try {
            await register(formData.username, formData.email, formData.password);
            navigate("/login");
        } catch (err) {
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) {
                // สำหรับ 422 Unprocessable Entity จาก FastAPI (Pydantic Validation)
                setError(detail[0]?.msg || "ข้อมูลไม่ถูกต้อง");
            } else {
                setError(detail || "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isUsernameValid = formData.username.length >= 3 && formData.username.length <= 30;
    const isLengthValid = formData.password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";

    const isReady = isUsernameValid && isLengthValid && hasUpperCase && hasLowerCase && hasNumber && passwordsMatch;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex items-center justify-center p-6 lg:p-12 relative overflow-hidden transition-colors duration-300">
            {/* Background Blobs for Glassmorphism */}
            <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-pink-300/20 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>

            <div className="w-full max-w-[1100px] flex flex-col-reverse lg:flex-row bg-white/40 dark:bg-white/5 backdrop-blur-2xl rounded-[48px] shadow-2xl border border-white/60 dark:border-white/10 overflow-hidden z-10 transition-all">

                {/* Left Side - Register Form */}
                <div className="w-full lg:w-3/5 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="lg:hidden flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-white/80 dark:border-white/20 shadow-md overflow-hidden">
                            <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">สร้างบัญชีใหม่ ✨</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">เข้าร่วมครอบครัว APM AI เพื่อเริ่มใช้งานผู้ช่วยในการเรียนของคุณ</p>

                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2 shadow-sm animate-shake">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="your_username"
                                    className="w-full px-6 py-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 shadow-sm outline-none focus:ring-4 focus:ring-primary/20 focus:bg-white dark:focus:bg-white/10 transition-all text-gray-800 dark:text-white font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="student@ku.th"
                                    className="w-full px-6 py-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 shadow-sm outline-none focus:ring-4 focus:ring-primary/20 focus:bg-white dark:focus:bg-white/10 transition-all text-gray-800 dark:text-white font-bold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-6 py-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 shadow-sm outline-none focus:ring-4 focus:ring-primary/20 focus:bg-white dark:focus:bg-white/10 transition-all text-gray-800 dark:text-white font-bold"
                            />

                            {/* Password Requirements Checklist */}
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2.5 px-1 bg-gray-50/50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                {[
                                    { label: "อย่างน้อย 8 ตัวอักษร", met: isLengthValid },
                                    { label: "ตัวพิมพ์ใหญ่ (A-Z)", met: hasUpperCase },
                                    { label: "ตัวพิมพ์เล็ก (a-z)", met: hasLowerCase },
                                    { label: "มีตัวเลข (0-9)", met: hasNumber },
                                ].map((req, index) => (
                                    <div 
                                        key={index} 
                                        className={`flex items-center gap-2 text-[11px] font-black transition-all duration-300 ${
                                            req.met ? "text-green-500 dark:text-green-400" : "text-gray-400 dark:text-gray-500 opacity-70"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">
                                            {req.met ? "check_circle" : "circle"}
                                        </span>
                                        {req.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-6 py-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 shadow-sm outline-none focus:ring-4 focus:ring-primary/20 focus:bg-white dark:focus:bg-white/10 transition-all text-gray-800 dark:text-white font-bold"
                            />
                            {formData.confirmPassword && (
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
                            className={`w-full py-5 mt-4 rounded-2xl font-black text-lg shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${
                                isReady 
                                ? "bg-gray-900 dark:bg-white dark:text-gray-900 text-white" 
                                : "bg-gray-300 dark:bg-gray-700 text-gray-500"
                            }`}
                        >
                            {isLoading ? "กำลังสร้างบัญชี..." : "REGISTER NOW"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-gray-500 font-bold">
                        มีบัญชีอยู่แล้วใช่ไหม?{" "}
                        <button
                            onClick={() => navigate("/login")}
                            className="font-black text-primary hover:text-pink-600 underline underline-offset-4 decoration-2 transition"
                        >
                            เข้าสู่ระบบ
                        </button>
                    </div>
                </div>

                {/* Right Side - Brand & Graphics */}
                <div className="hidden lg:flex w-2/5 flex-col items-center justify-center p-12 bg-gradient-to-br from-primary/10 to-pink-400/10 relative overflow-hidden border-l border-white/40 dark:border-white/10">
                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-40 h-40 rounded-[2.5rem] bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/80 dark:border-white/20 shadow-2xl overflow-hidden mb-10 transform rotate-3 hover:rotate-0 transition duration-500">
                            <img src={Logo} alt="Logo" className="w-full h-full object-cover scale-110" />
                        </div>

                        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4 leading-tight">Start Your <br /> Journey!</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-bold leading-relaxed max-w-xs">
                            อนาคตของการเรียนหนังสืออยู่ในมือคุณแล้ว เริ่มให้ไว ไปได้ไกลกว่า 🚀
                        </p>

                        <div className="mt-12 flex gap-[-10px]">
                            <img src={BroIcon} alt="Bro" className="w-14 h-14 rounded-full border-4 border-white/80 shadow-lg transform -rotate-12 z-20 hover:scale-110 transition-transform" />
                            <img src={NerdIcon} alt="Nerd" className="w-14 h-14 rounded-full border-4 border-white/80 shadow-lg transform rotate-6 -ml-4 z-10 hover:scale-110 transition-transform" />
                        </div>
                    </div>
                </div>

            </div>

            <button
                onClick={() => navigate("/")}
                className="absolute top-8 left-8 flex items-center gap-2 px-6 py-3 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md border border-white/50 dark:border-white/10 text-gray-700 dark:text-white font-black shadow-sm hover:bg-white dark:hover:bg-white/20 transition z-20 active:scale-95"
            >
                <span className="material-symbols-outlined text-lg">arrow_back</span> กลับหน้าแรก
            </button>
        </div>
    );
};

export default Register;
