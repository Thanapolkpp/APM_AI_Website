import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import CuteGirlIcon from "../assets/Girl.png"; // Decorative image for the side panel logic
import BroIcon from "../assets/Bro.png";

const Login = () => {
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // ✅ Test user
        const TEST_USER = "1";
        const TEST_PASS = "1";

        // ✅ ถ้าเป็น test ไม่ต้องยิง API
        if (identifier === TEST_USER && password === TEST_PASS) {
            localStorage.setItem("token", "test-token");
            navigate("/");
            setIsLoading(false);
            return;
        }

        // ✅ ถ้าไม่ใช่ test → ยิง API จริง
        try {
            const loginData = {
                username: identifier.includes("@") ? "" : identifier,
                email: identifier.includes("@") ? identifier : "",
                password: password,
            };

            const response = await fetch("http://localhost:8000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                // เก็บ Token เข้า LocalStorage
                localStorage.setItem("token", data.access_token);
                // เก็บข้อมูล User ลง LocalStorage ไปด้วย
                localStorage.setItem("username", data.username);
                localStorage.setItem("email", data.email);

                navigate("/");
            } else {
                setError(data.message || "Login failed. Please check your credentials.");
            }
        } catch {
            setError("Unable to connect to the server. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
            {/* Background Blobs for Glassmorphism */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

            <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 bg-white/40 dark:bg-white/5 backdrop-blur-2xl rounded-[48px] shadow-2xl border border-white/60 dark:border-white/10 overflow-hidden z-10 transition-all">

                {/* Left Side - Illustration / Brand */}
                <div className="hidden md:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-pink-400/10 to-primary/10 relative overflow-hidden border-r border-white/40 dark:border-white/10">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-[32px] bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/80 dark:border-white/20 shadow-xl overflow-hidden mb-8 transform -rotate-3 hover:rotate-0 transition duration-500">
                            <img src={Logo} alt="Logo" className="w-full h-full object-cover scale-110" />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4 leading-tight">Welcome Back!</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-bold text-lg leading-relaxed">
                            ดีใจที่ได้เจอกันอีกครั้ง 🌷 <br /> ถึงเวลาสนุกกับการเรียนรู้ต่อไปแล้ว!
                        </p>

                        <div className="mt-12 flex gap-4">
                            <img src={CuteGirlIcon} alt="Girl" className="w-16 h-16 rounded-full border-4 border-white/60 shadow-md transform rotate-6 hover:scale-110 transition-transform" />
                            <img src={BroIcon} alt="Bro" className="w-16 h-16 rounded-full border-4 border-white/60 shadow-md transform -rotate-6 -ml-8 hover:scale-110 transition-transform" />
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="p-8 md:p-14 flex flex-col justify-center">
                    <div className="md:hidden flex justify-center mb-8">
                        <div className="w-24 h-24 rounded-3xl bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-white/80 dark:border-white/20 shadow-md overflow-hidden">
                            <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">เข้าสู่ระบบ</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">กรอกข้อมูลบัญชีเพื่อเข้าใช้งาน APM AI</p>

                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2 shadow-sm animate-shake">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                ชื่อผู้ใช้ หรือ อีเมล
                            </label>
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="Enter username or email"
                                required
                                className="w-full px-6 py-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 shadow-sm outline-none focus:ring-4 focus:ring-primary/20 focus:bg-white dark:focus:bg-white/10 transition-all text-gray-800 dark:text-white font-bold"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                รหัสผ่าน
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-6 py-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 shadow-sm outline-none focus:ring-4 focus:ring-primary/20 focus:bg-white dark:focus:bg-white/10 transition-all text-gray-800 dark:text-white font-bold"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button type="button" className="text-sm font-bold text-primary hover:text-pink-600 transition">ลืมรหัสผ่าน?</button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 mt-2 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white font-black text-lg shadow-xl hover:shadow-primary/30 hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            {isLoading ? "กำลังเข้าสู่ระบบ..." : "LOGIN"}
                        </button>
                    </form>

                    <div className="mt-10 text-center text-gray-500 font-bold">
                        ยังไม่มีบัญชีใช่ไหม?{" "}
                        <button
                            onClick={() => navigate("/register")}
                            className="font-black text-primary hover:text-pink-600 underline underline-offset-4 decoration-2 transition"
                        >
                            สมัครสมาชิกเลย!
                        </button>
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

export default Login;
