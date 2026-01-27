import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

const Account = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Redirecting...
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col font-display">
            <Navbar />

            <main className="flex-1 container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">

                        {/* Header Banner */}
                        <div className="h-32 bg-gradient-to-r from-primary to-purple-600 relative">
                            <div className="absolute -bottom-12 left-10">
                                <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg">
                                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-4xl">
                                        👤
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 pb-10 px-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">My Account</h1>
                                    <p className="text-gray-500 dark:text-gray-400">Manage your profile and settings</p>
                                </div>
                                <button
                                    onClick={() => {
                                        logout();
                                        navigate("/login");
                                    }}
                                    className="px-6 py-2.5 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all duration-300 flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">logout</span>
                                    Sign Out
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Profile Info */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">badge</span>
                                        Profile Information
                                    </h2>

                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Status</label>
                                            <div className="flex items-center gap-2 text-green-500 font-bold bg-green-500/10 w-fit px-3 py-1 rounded-lg">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                Active Member
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Login Method</label>
                                            <div className="font-semibold text-gray-700 dark:text-gray-200">
                                                Standard Login
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Preferences */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">tune</span>
                                        Preferences
                                    </h2>

                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                            <span className="font-semibold text-gray-700 dark:text-gray-200">Dark Mode</span>
                                            <div className="w-10 h-6 bg-gray-200 dark:bg-gray-600 rounded-full relative cursor-pointer">
                                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                            <span className="font-semibold text-gray-700 dark:text-gray-200">Notifications</span>
                                            <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Account;