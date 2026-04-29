import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ASSETS } from "../config/assets";

const Logo = ASSETS.BRANDING.LOGO;
const CuteGirlIcon = ASSETS.AVATARS.GIRL;
const BroIcon = ASSETS.AVATARS.BRO;
import { login } from "../services/aiService";

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
            const data = await login(identifier, password);
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("username", data.username);
            localStorage.setItem("email", data.email);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-yellow-400 font-cartoon flex items-center justify-center p-6 relative overflow-hidden">
            {/* Playful Background Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary border-4 border-toon-black rounded-full shadow-toon animate-bounce"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-300 border-4 border-toon-black rotate-12 shadow-toon animate-pulse"></div>
            <div className="absolute top-1/4 right-20 w-24 h-24 bg-purple-400 border-4 border-toon-black -rotate-12 shadow-toon"></div>

            <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 toon-card z-10">

                {/* Left Side - Illustration / Brand */}
                <div className="hidden md:flex flex-col items-center justify-center p-12 bg-white border-r-4 border-toon-black relative overflow-hidden">
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-40 h-40 rounded-[32px] bg-yellow-200 border-4 border-toon-black shadow-toon overflow-hidden mb-8 transform -rotate-6 hover:rotate-0 transition duration-500">
                            <img src={Logo} alt="Logo" className="w-full h-full object-cover p-2" />
                        </div>
                        <h2 className="text-5xl font-black text-toon-black tracking-tight mb-4 leading-tight uppercase">Hey there!</h2>
                        <p className="text-toon-black font-bold text-xl leading-relaxed">
                            ดีใจที่ได้เจอกันอีกครั้งนะจ๊ะ! 🌈 <br /> มาลุยเรียนรู้กันต่อเถอะ!
                        </p>

                        <div className="mt-12 flex gap-4">
                            <img src={CuteGirlIcon} alt="Girl" className="w-20 h-20 rounded-full border-4 border-toon-black shadow-toon transform rotate-12 hover:scale-110 transition-transform bg-girl-pink" />
                            <img src={BroIcon} alt="Bro" className="w-20 h-20 rounded-full border-4 border-toon-black shadow-toon transform -rotate-12 -ml-8 hover:scale-110 transition-transform bg-bro-blue" />
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="p-8 sm:p-10 md:p-14 flex flex-col justify-center bg-white">
                    <div className="md:hidden flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-3xl bg-yellow-200 border-4 border-toon-black shadow-toon overflow-hidden transform -rotate-3">
                            <img src={Logo} alt="Logo" className="w-full h-full object-cover p-3" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-toon-black mb-2 text-center md:text-left uppercase italic">เข้าสู่ระบบ</h1>
                    <p className="text-gray-600 font-bold mb-8 text-center md:text-left text-lg">กรอกข้อมูลเพื่อเข้าสู่โลก AI กันเลย! ✨</p>

                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-100 border-4 border-toon-black text-red-600 font-black flex items-center gap-2 shadow-toon animate-wiggle">
                            <span className="material-symbols-outlined text-xl">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-black text-toon-black uppercase tracking-widest mb-2 ml-1">
                                Username / Email
                            </label>
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="ใครเอ่ย?"
                                required
                                className="toon-input w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-black text-toon-black uppercase tracking-widest mb-2 ml-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="ความลับนะ!"
                                required
                                className="toon-input w-full"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button 
                                type="button" 
                                onClick={() => navigate("/forgot-password")}
                                className="text-sm font-black text-toon-black hover:text-primary transition underline decoration-4 underline-offset-4"
                            >
                                ลืมรหัสผ่าน?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="toon-button w-full text-2xl uppercase italic"
                        >
                            {isLoading ? "รอแป๊บน้า..." : "ไปกันเลย! 🚀"}
                        </button>
                    </form>

                    <div className="mt-10 text-center text-gray-600 font-bold text-lg">
                        ยังไม่มีไอดีหรอ?{" "}
                        <button
                            onClick={() => navigate("/register")}
                            className="font-black text-purple-600 hover:text-primary underline underline-offset-4 decoration-4 transition"
                        >
                            สมัครตรงนี้เลย!
                        </button>
                    </div>
                </div>
            </div>

            <button
                onClick={() => navigate("/")}
                className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border-4 border-toon-black text-toon-black font-black text-sm shadow-toon hover:-translate-y-1 hover:shadow-toon-lg transition active:scale-95 z-20"
            >
                <span className="material-symbols-outlined font-black">arrow_back</span> กลับบ้าน
            </button>
        </div>
    );  
}
    
export default Login;