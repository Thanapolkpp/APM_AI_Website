import React from "react";
import { HiOutlineDownload, HiOutlineX, HiOutlineSparkles } from "react-icons/hi";

const AIModal = ({ isOpen, onClose, summaryText, isGenerating, onDownloadPDF }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-[48px] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
                <div className="p-8 flex items-center justify-between border-b dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <HiOutlineSparkles size={24} />
                        </div>
                        <h3 className="text-2xl font-black dark:text-white">APM AI Assistant ✨</h3>
                    </div>
                    <button onClick={onClose} className="size-10 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400 hover:rotate-90 hover:bg-red-50 hover:text-red-500 transition-all">
                        <HiOutlineX size={24} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-10 dark:text-gray-200 whitespace-pre-wrap text-lg leading-relaxed antialiased">
                    {summaryText}
                    {isGenerating && (
                        <div className="inline-flex items-center gap-2 ml-2">
                            <span className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    )}
                    {!summaryText && isGenerating && (
                        <div className="flex flex-col items-center justify-center h-full py-12 space-y-4">
                             <p className="font-black text-xl md:text-2xl animate-pulse text-gray-900 dark:text-white">กำลังเตรียมสรุปให้เพื่อนอยู่... 🧠✨</p>
                        </div>
                    )}
                </div>
                <div className="p-8 bg-gray-50 dark:bg-white/5 flex gap-4">
                    <button onClick={onDownloadPDF} className="flex-1 py-5 rounded-[28px] bg-primary text-white font-black text-lg shadow-xl shadow-primary/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3">
                        <HiOutlineDownload size={24} /> ดาวน์โหลดสรุป PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIModal;
