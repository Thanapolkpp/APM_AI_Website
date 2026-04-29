import React from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Mail, ArrowRight } from "lucide-react"

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="w-full bg-white border-t-8 border-toon-black mt-16 font-cartoon">
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Top Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-16">
                    
                    {/* Brand Section */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="size-14 rounded-2xl bg-yellow-200 border-4 border-toon-black shadow-toon flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110 group-hover:rotate-6">
                                <span className="text-3xl">🌸</span>
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-toon-black tracking-tight uppercase italic">
                                    APM AI
                                </h2>
                                <p className="text-xs font-black text-pink-600 uppercase tracking-widest mt-0.5">
                                    Personal Motivation Engine
                                </p>
                            </div>
                        </div>
                        <p className="max-w-sm text-lg font-black text-toon-black/70 leading-relaxed">
                            {t("footer.brand_desc")}
                        </p>
                    </div>

                    {/* Quick Access */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">{t("footer.quick_links")}</h3>
                        <div className="flex flex-col gap-4">
                            <Link to="/about" className="group flex items-center gap-2 text-lg font-black text-toon-black hover:text-primary transition-all">
                                <ArrowRight size={20} className="font-black" />
                                <span className="uppercase italic">{t("nav.about")}</span>
                            </Link>
                            <Link to="/contact" className="group flex items-center gap-2 text-lg font-black text-toon-black hover:text-primary transition-all">
                                <ArrowRight size={20} className="font-black" />
                                <span className="uppercase italic">{t("nav.contact")}</span>
                            </Link>
                            <Link to="/summaries" className="group flex items-center gap-2 text-lg font-black text-toon-black hover:text-primary transition-all">
                                <ArrowRight size={20} className="font-black" />
                                <span className="uppercase italic">{t("nav.mall")}</span>
                            </Link>
                        </div>
                    </div>

                    {/* Support & Contact */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Support</h3>
                        <div className="space-y-4">
                            <a 
                                href="mailto:apmaiservice@gmail.com" 
                                className="group flex items-center gap-4 p-5 rounded-3xl bg-white border-4 border-toon-black shadow-toon hover:-translate-y-1 hover:shadow-toon-lg transition-all active:scale-95"
                            >
                                <div className="size-12 rounded-xl bg-primary border-4 border-toon-black flex items-center justify-center text-toon-black transition-transform group-hover:rotate-12">
                                    <Mail size={24} className="font-black" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Email Support</p>
                                    <p className="text-sm font-black text-toon-black">apmaiservice@gmail.com</p>
                                </div>
                            </a>
                            
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLScd6CNZibj2bnY9mjHOLXR4iy7yoowv7DOFiK9h1U4vvdjfXw/viewform?usp=publish-editor"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full flex items-center justify-center py-4 rounded-2xl bg-toon-black text-white border-4 border-toon-black font-black text-xs uppercase tracking-widest hover:-translate-y-1 hover:shadow-toon transition-all shadow-lg italic"
                            >
                                {t("footer.report")}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t-4 border-toon-black flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
                        <p className="text-sm font-black text-toon-black/50">{t("footer.rights")}</p>
                        <div className="flex items-center gap-4 text-xs font-black text-toon-black uppercase tracking-widest">
                            <span className="cursor-pointer hover:text-primary transition">Privacy Policy</span>
                            <span>•</span>
                            <span className="cursor-pointer hover:text-primary transition">Terms of Service</span>
                        </div>
                    </div>

                    <div className="text-xs font-black text-toon-black/40 uppercase tracking-widest italic">
                        {t("footer.handcrafted")} <span className="text-pink-500">{t("footer.team")}</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
