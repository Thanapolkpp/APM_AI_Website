import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import Logo from "../assets/logo.png";

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

        if (formData.password !== formData.confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน");
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
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/login");
            } else {
                setError(data.message || "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่");
            }
        } catch {
            setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
            <main className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">

                    {/* ✅ Logo กลม ตรงกลาง */}
                    <div className="flex justify-center mb-6">
                        <div className="size-20 rounded-full overflow-hidden bg-white shadow-md ring-2 ring-pink-300/60">
                            <img
                                src={Logo}
                                alt="Logo"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-gray-800 dark:text-white text-center mb-2">
                        Register
                    </h1>

                    <p className="text-gray-500 dark:text-gray-300 text-center mb-8 text-sm">
                        สมัครสมาชิกเพื่อเริ่มใช้งานระบบ
                    </p>

                    {error && (
                        <div className="mb-6 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary/60 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="student@ku.th"
                                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary/60 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary/60 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary/60 dark:text-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-2xl bg-primary text-white font-extrabold shadow-lg hover:brightness-110 active:scale-[0.98] transition disabled:opacity-70"
                        >
                            {isLoading ? "Loading..." : "Register"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500 dark:text-gray-300">
                            มีบัญชีอยู่แล้ว?
                        </span>{" "}
                        <button
                            onClick={() => navigate("/login")}
                            className="font-extrabold text-primary hover:underline"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Register;
