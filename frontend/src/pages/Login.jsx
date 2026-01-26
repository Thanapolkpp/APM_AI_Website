import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMail, HiLockClosed, HiOutlineQuestionMarkCircle, HiUser } from "react-icons/hi";
import Footer from "../components/footer";

const Login = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const loginData = {
                username: identifier.includes('@') ? "" : identifier,
                email: identifier.includes('@') ? identifier : "",
                password: password
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
        } catch (err) {
            setError("Unable to connect to the server. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display relative overflow-hidden flex flex-col">

            {/* Background Decor */}
            <div className="absolute -top-48 -left-48 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full z-0" />
            <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full z-0" />

            {/* Header */}
            <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined font-bold">rocket_launch</span>
                    </div>
                    <h1 className="text-xl font-extrabold tracking-tight dark:text-white">
                        UniBuddy <span className="text-primary">AI</span>
                    </h1>
                </div>
                <button className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
                    <HiOutlineQuestionMarkCircle className="text-lg" />
                    <span>Help?</span>
                </button>
            </header>

            <main className="flex-1 flex items-center justify-center px-6 py-8 z-10">
                <div className="w-full max-w-[1050px] flex flex-col md:flex-row bg-white/70 dark:bg-gray-900/80 backdrop-blur-2xl rounded-[40px] shadow-2xl overflow-hidden border border-white/20 dark:border-white/5">

                    {/* Left Side: Mascot */}
                    <div className="w-full md:w-1/2 p-12 flex flex-col justify-center items-center text-center bg-gradient-to-br from-primary/5 to-transparent">
                        <div className="relative mb-10 group">
                            <div className="w-64 h-64 bg-white dark:bg-gray-800 rounded-[60px] shadow-2xl flex items-center justify-center relative animate-bounce" style={{ animationDuration: '3s' }}>
                                <span className="text-8xl select-none"></span>
                                <div className="absolute -bottom-4 -right-4 bg-primary text-white p-4 rounded-2xl shadow-xl rotate-12">
                                    <p className="text-[10px] font-black uppercase tracking-widest">Studying...</p>
                                </div>
                            </div>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-4 leading-tight">
                            Your AI Friend <br /> for Uni Life
                        </h2>
                        <p className="text-gray-500 dark:text-pink-100/40 text-lg max-w-sm">
                            Simplifying studies with AI personalities that understand you.
                        </p>
                    </div>

                    {/* Right Side: Form Container */}
                    <div className="flex-1 p-8 md:p-16 bg-white/30 dark:bg-black/20">
                        {/* Tabs สลับหน้า */}
                        <div className="flex gap-8 mb-10 border-b border-gray-100 dark:border-white/5">
                            <button
                                className="pb-4 text-lg font-bold border-b-4 border-primary text-gray-800 dark:text-white"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </button>
                            <button
                                className="pb-4 text-lg font-bold text-gray-400 hover:text-primary transition-colors"
                                onClick={() => navigate("/register")}
                            >
                                Register
                            </button>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold text-center animate-pulse">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 dark:text-gray-300 ml-1">Username or Email</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-primary transition-colors">
                                        {identifier.includes('@') ? <HiMail /> : <HiUser />}
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        placeholder="Enter username or email"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-primary/50 dark:text-white transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-sm font-bold text-gray-600 dark:text-gray-300">Password</label>
                                    <span className="text-xs font-bold text-primary cursor-pointer hover:underline">Forgot?</span>
                                </div>
                                <div className="relative group">
                                    <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-primary/50 dark:text-white transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : "Login"}
                            </button>
                        </form>

                        <div className="mt-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px grow bg-gray-100 dark:bg-white/5"></div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">OR LOGIN WITH</span>
                                <div className="h-px grow bg-gray-100 dark:bg-white/5"></div>
                            </div>

                            <div className="flex justify-center">
                                <button className="flex items-center justify-center gap-3 py-3.5 px-8 rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm active:scale-95 font-bold dark:text-white text-sm">
                                    <img src="https://www.google.com/favicon.ico" className="size-4" alt="Google" />
                                    Google
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;