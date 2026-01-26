import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMail, HiLockClosed, HiUser, HiOutlineBadgeCheck } from "react-icons/hi";
import Footer from "../components/footer";

const Register = () => {
    // ใช้ Object State เพื่อจัดการข้อมูลหลายฟิลด์แบบสะอาดตา (คล้าย OOP)
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // ตรวจสอบรหัสผ่านเบื้องต้นก่อนส่ง (Client-side Validation)
        if (formData.password !== formData.confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน!");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("สมัครสมาชิกสำเร็จ:", data);
                navigate("/login"); // เมื่อสำเร็จให้ไปหน้า Login
            } else {
                setError(data.message || "การสมัครสมาชิกล้มเหลว กรุณาลองใหม่");
            }
        } catch (err) {
            setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display relative overflow-hidden flex flex-col">

            {/* Background Decor */}
            <div className="absolute -top-48 -right-48 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full z-0" />
            <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full z-0" />

            {/* Header */}
            <header className="w-full max-w-7xl mx-auto px-6 py-6 z-10">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                        <span className="material-symbols-outlined">rocket_launch</span>
                    </div>
                    <h1 className="text-xl font-extrabold dark:text-white">UniBuddy <span className="text-primary">AI</span></h1>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-6 py-8 z-10">
                <div className="w-full max-w-[1050px] flex flex-col md:flex-row bg-white/70 dark:bg-gray-900/80 backdrop-blur-2xl rounded-[40px] shadow-2xl overflow-hidden border border-white/20">

                    {/* Left Side: Mascot */}
                    <div className="w-full md:w-1/2 p-12 flex flex-col justify-center items-center text-center bg-gradient-to-br from-primary/5 to-transparent">
                        <div className="w-64 h-64 bg-white dark:bg-gray-800 rounded-[60px] shadow-2xl flex items-center justify-center relative animate-pulse">
                            <span className="text-8xl"></span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mt-8 leading-tight">สร้างบัญชีใหม่</h2>
                        <p className="text-gray-500 dark:text-pink-100/40 mt-4 max-w-xs">สมัครสมาชิกเพื่อเริ่มต้นใช้งาน AI หลายบุคลิกสำหรับชีวิตมหาลัย</p>
                    </div>

                    {/* Right Side: Registration Form */}
                    <div className="flex-1 p-8 md:p-16 bg-white/30 dark:bg-black/20">
                        <div className="flex gap-8 mb-10 border-b border-gray-100 dark:border-white/5">
                            <button onClick={() => navigate("/login")} className="pb-4 text-lg font-bold text-gray-400 hover:text-primary transition-colors">Login</button>
                            <button className="pb-4 text-lg font-bold border-b-4 border-primary text-gray-800 dark:text-white">Register</button>
                        </div>

                        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-bold text-center">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Username */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Username</label>
                                <div className="relative group">
                                    <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-primary transition-colors" />
                                    <input type="text" name="username" required value={formData.username} onChange={handleChange} placeholder="ชื่อผู้ใช้"
                                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-primary/50 dark:text-white outline-none" />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Email</label>
                                <div className="relative group">
                                    <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-primary transition-colors" />
                                    <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="student@ku.th"
                                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-primary/50 dark:text-white outline-none" />
                                </div>
                            </div>

                            {/* Password Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Password</label>
                                    <div className="relative group">
                                        <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                                        <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••"
                                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-primary/50 dark:text-white outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Confirm</label>
                                    <div className="relative group">
                                        <HiOutlineBadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                                        <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••"
                                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-primary/50 dark:text-white outline-none" />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={isLoading} className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                {isLoading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Register Now 🚀"}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Register;