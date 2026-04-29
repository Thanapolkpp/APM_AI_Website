import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const NotificationDropdown = ({ 
    isOpen, 
    onClose, 
    notifications, 
    unreadCount, 
    onMarkAllRead 
}) => {
    const { t } = useTranslation();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white dark:border-gray-700 p-6 z-[101] overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-xl text-gray-900 dark:text-white flex items-center gap-2 italic">
                                NOTIFICATIONS <span className="text-primary text-2xl font-black">!</span>
                            </h3>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={onMarkAllRead}
                                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto space-y-3 scrollbar-hide">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div 
                                        key={n.id} 
                                        className={`p-4 rounded-3xl border transition-all ${n.is_read ? 'bg-gray-50/50 dark:bg-white/5 border-transparent' : 'bg-white dark:bg-gray-800 border-primary/20 shadow-sm shadow-primary/5'}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`size-10 rounded-2xl flex items-center justify-center shrink-0 ${n.type === 'reward' ? 'bg-yellow-400/10 text-yellow-600' : 'bg-primary/10 text-primary'}`}>
                                                <span className="material-symbols-outlined text-[20px]">
                                                    {n.type === 'reward' ? 'database' : 'notifications'}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-black text-sm text-gray-900 dark:text-white leading-tight">{n.title}</p>
                                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{n.message}</p>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mt-2">
                                                    {new Date(n.created_at).toLocaleString('th-TH')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="size-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <span className="material-symbols-outlined text-3xl">notifications_off</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 italic">ไม่มีแจ้งเตือนใหม่นะเพื่อน... 🌷</p>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={onClose}
                            className="w-full mt-6 py-4 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition"
                        >
                            Close
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationDropdown;
