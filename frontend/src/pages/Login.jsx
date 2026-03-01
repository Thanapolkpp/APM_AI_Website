import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import Logo from "../assets/logo.png";

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
        const TEST_USER = "test";
        const TEST_PASS = "1234";

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

            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
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
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
            <main className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                    {/* ✅ Logo กลม ตรงกลาง */}
                    <div className="flex justify-center -mt-16 mb-6">
                        <div className="size-24 rounded-full overflow-hidden bg-white shadow-md ring-2 ring-pink-300/60">
                            <img src={Logo} alt="Logo" className="h-full w-full object-cover" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-gray-800 dark:text-white text-center mb-2">
                        Login
                    </h1>

                    <p className="text-gray-500 dark:text-gray-300 text-center mb-8 text-sm">
                        เข้าสู่ระบบเพื่อใช้งานระบบ APM AI
                    </p>

                    {error && (
                        <div className="mb-6 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">
                                Username / Email
                            </label>
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="Enter username or email"
                                required
                                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary/60 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary/60 dark:text-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-2xl bg-primary text-white font-extrabold shadow-lg hover:brightness-110 active:scale-[0.98] transition disabled:opacity-70"
                        >
                            {isLoading ? "Loading..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500 dark:text-gray-300">ยังไม่มีบัญชี?</span>{" "}
                        <button
                            onClick={() => navigate("/register")}
                            className="font-extrabold text-primary hover:underline"
                        >
                            Register
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Login;
