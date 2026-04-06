import React from "react"
import { Link } from "react-router-dom"
import { Mail, ArrowRight } from "lucide-react"

const Footer = () => {
    return (
        <footer className="w-full bg-pink-50/50 border-t border-pink-100/50 dark:bg-black/20 dark:border-white/5 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Top Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-16">
                    
                    {/* Brand Section */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="size-10 rounded-2xl bg-white shadow-lg ring-2 ring-pink-100 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110">
                                <span className="text-xl">🌸</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                                    APM AI
                                </h2>
                                <p className="text-[10px] font-bold text-pink-500/80 uppercase tracking-widest mt-0.5">
                                    Personal Motivation Engine
                                </p>
                            </div>
                        </div>
                        <p className="max-w-sm text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                            ทุกความก้าวหน้าของคุณ คือความภูมิใจของเรา 💖 <br />
                            AI ที่พร้อมจะเป็นทั้งเพื่อนและผู้ช่วยที่รู้ใจที่สุด
                        </p>
                    </div>

                    {/* Quick Access */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">เมนูด่วน</h3>
                        <div className="flex flex-col gap-4">
                            <Link to="/about" className="group flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-pink-500 transition-all">
                                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                About Us
                            </Link>
                            <Link to="/contact" className="group flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-pink-500 transition-all">
                                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                Contact Our Team
                            </Link>
                            <Link to="/summaries" className="group flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-pink-500 transition-all">
                                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                Marketplace
                            </Link>
                        </div>
                    </div>

                    {/* Support & Contact */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Support</h3>
                        <div className="space-y-4">
                            <a 
                                href="mailto:apmaiservice@gmail.com" 
                                className="group flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-white/5 border border-pink-100/50 dark:border-white/10 hover:border-pink-300 dark:hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-pink-500/5 active:scale-95"
                            >
                                <div className="size-10 rounded-xl bg-pink-50 dark:bg-primary/10 flex items-center justify-center text-pink-500 transition-transform group-hover:rotate-12">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Email Support</p>
                                    <p className="text-sm font-black text-gray-700 dark:text-white">apmaiservice@gmail.com</p>
                                </div>
                            </a>
                            
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLScd6CNZibj2bnY9mjHOLXR4iy7yoowv7DOFiK9h1U4vvdjfXw/viewform?usp=publish-editor"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full flex items-center justify-center py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                            >
                                ร้องเรียน / แจ้งปัญหา
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
                        <p className="text-xs font-bold text-gray-400">© 2024 APM AI. All rights reserved.</p>
                        <div className="flex items-center gap-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                            <span className="cursor-pointer hover:text-pink-500 transition">Privacy Policy</span>
                            <span>•</span>
                            <span className="cursor-pointer hover:text-pink-500 transition">Terms of Service</span>
                        </div>
                    </div>

                    <div className="text-xs font-black text-gray-400/60 uppercase tracking-widest">
                        Handcrafted with 💖 by <span className="text-pink-400">Gen Z Team</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
