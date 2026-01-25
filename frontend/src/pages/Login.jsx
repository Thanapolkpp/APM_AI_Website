import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // 🔥 ตอนนี้ mock login ก่อน
        if (email && password) {
            console.log("Login success:", email);
            navigate("/"); // login สำเร็จ → ไป Home
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                    Welcome Back 👋
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    ยังไม่มีบัญชี? <span className="text-primary cursor-pointer">Register</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
