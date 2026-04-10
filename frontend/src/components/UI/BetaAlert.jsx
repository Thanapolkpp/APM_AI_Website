import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Info, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const BetaAlert = () => {
    const [show, setShow] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        // Check if shown in this session
        const isShown = sessionStorage.getItem("beta_alert_shown");
        if (!isShown) {
            const timer = setTimeout(() => setShow(true), 2000); // Show after 2 seconds
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setShow(false);
        sessionStorage.setItem("beta_alert_shown", "true");
    };

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={handleClose}
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-[32px] overflow-hidden shadow-2xl border border-white dark:border-white/10"
                    >
                        {/* Header Image/Background */}
                        <div className="h-32 bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center relative">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse-slow"></div>
                            <Clock size={48} className="text-white relative z-10 animate-bounce-slow" />
                            <button 
                                onClick={handleClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-black/10 text-white hover:bg-black/20 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-8 text-center space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-500 font-black text-[10px] uppercase tracking-widest">
                                <Info size={12} /> Beta Testing Mode
                            </div>
                            
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                                ประกาศช่วงเวลาให้บริการ <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">APM AI Beta 🚀</span>
                            </h2>
                            
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 leading-relaxed">
                                เพื่อความเสถียรของระบบในช่วงทดสอบ <br/>
                                คุณสามารถใช้ AI ได้ในช่วงเวลาดังนี้ครับเพื่อนๆ:
                            </p>

                            <div className="grid grid-cols-1 gap-3 py-2">
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between">
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-wider">รอบเช้า</span>
                                    <span className="text-lg font-black text-gray-900 dark:text-white">09:00 - 11:00 น.</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between">
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-wider">รอบบ่าย</span>
                                    <span className="text-lg font-black text-gray-900 dark:text-white">13:00 - 15:00 น.</span>
                                </div>
                            </div>

                            <p className="text-[10px] font-bold text-gray-400 italic">
                                * เนื่องจากเป็นตัว BETA อาจมีการปรับปรุงระบบในช่วงเวลาอื่นนะครับ 🌷
                            </p>

                            <button
                                onClick={handleClose}
                                className="w-full py-4 mt-4 rounded-2xl bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                รับทราบครับผม !
                            </button>

                            <a
                                href="mailto:tanapolkpp@gmail.com?subject=Requesting access to APM AI Beta outside hours&body=Hello team, I would like to request access during..."
                                className="inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-pink-500 transition-colors pt-2 group"
                            >
                                <X size={14} className="group-hover:rotate-90 transition-transform" /> 
                                ต้องการใช้งานนอกเวลา? <span className="underline">ส่งเมลหาทีมงาน</span> ✉️
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BetaAlert;
