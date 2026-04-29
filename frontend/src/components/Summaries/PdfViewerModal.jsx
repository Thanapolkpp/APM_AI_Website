import React, { useEffect } from "react";
import { HiOutlineDownload, HiOutlineX, HiOutlineSparkles, HiOutlineEye } from "react-icons/hi";
import { FileText } from "lucide-react";

const PdfViewerModal = ({ isOpen, onClose, item, onAIGenerate, onAIQuiz, onDownload }) => {
    useEffect(() => {
        if (!isOpen || !item) return;

        const handleKeyDown = (e) => {
            const isProtected = item.price > 0 && !item.is_mine && !item.already_purchased;
            if (isProtected) {
                if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && e.key === 's') || (e.ctrlKey && e.key === 'p')) {
                    e.preventDefault();
                    alert("⚠️ คำเตือน! ห้ามบันทึกภาพหน้าจอสรุปนี้นะครับเพื่อน เพื่อเป็นการให้เกียรติผู้สร้างสรรค์ผลงาน 🌷");
                }
            }
        };

        window.addEventListener('keyup', handleKeyDown);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keyup', handleKeyDown);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, item]);

    if (!isOpen || !item) return null;

    const isProtected = item.price > 0 && !item.is_mine && !item.already_purchased;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-[48px] w-full max-w-6xl h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300 relative">
                <div className="p-6 flex items-center justify-between border-b dark:border-white/10 bg-white/50 dark:bg-black/40 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className={`size-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl ring-2 ring-white/20`}>
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black dark:text-white leading-tight">{item.title}</h3>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{item.subject}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="size-12 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90">
                        <HiOutlineX size={28} />
                    </button>
                </div>
                <div 
                    className="flex-1 overflow-hidden relative select-none print:hidden"
                    onMouseLeave={(e) => {
                        if (isProtected) {
                            const overlay = e.currentTarget.querySelector('.security-overlay');
                            if (overlay) overlay.classList.remove('hidden');
                        }
                    }}
                    onMouseEnter={(e) => {
                        const overlay = e.currentTarget.querySelector('.security-overlay');
                        if (overlay) overlay.classList.add('hidden');
                    }}
                >
                    {/* Watermark Overlay */}
                    {isProtected && (
                        <div className="absolute inset-0 z-20 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-[0.08] select-none uppercase font-black text-gray-500 text-4xl overflow-hidden rotate-[-15deg] scale-125">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="flex items-center justify-center whitespace-nowrap">APM AI SECURITY</div>
                            ))}
                        </div>
                    )}

                    {/* Blackout Overlay */}
                    {isProtected && (
                        <div className="security-overlay hidden absolute inset-0 z-30 bg-black flex flex-col items-center justify-center text-white text-center gap-4 transition-all">
                            <div className="p-5 rounded-full bg-red-500/20 text-red-500"><HiOutlineEye size={48} /></div>
                            <h4 className="text-xl font-black">Content Hidden for Security</h4>
                            <p className="text-xs text-gray-400">ขยับเมาส์กลับเข้ามาดูสรุปต่อนะครับเพื่อน 🌷</p>
                        </div>
                    )}

                    <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(item.pdfUrl)}&embedded=true`}
                        className={`w-full h-full border-none ${isProtected ? 'pointer-events-none' : ''}`}
                        title="PDF Viewer"
                        allow="autoplay"
                    />
                </div>
                <div className="p-6 bg-white dark:bg-gray-900 border-t dark:border-white/10 flex justify-between items-center px-10">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.category}</span>
                        <span className="text-emerald-500 font-black text-sm tracking-tighter">
                            {item.price === 0 ? 'FREE DOCUMENT' : `${item.price} COINS`}
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => onAIGenerate(item)} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-sm flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-pink-500/20">
                            <HiOutlineSparkles size={20} /> AI สรุปให้
                        </button>
                        <button onClick={() => onAIQuiz(item)} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-black text-sm flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20">
                            <HiOutlineSparkles size={20} /> AI สร้างควิซ
                        </button>
                        <button
                            onClick={() => onDownload(item)}
                            disabled={!item.already_purchased && !item.is_mine && item.price > 0}
                            className={`px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 transition-all shadow-xl ${(item.already_purchased || item.is_mine || item.price === 0)
                                ? 'bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/20 cursor-pointer'
                                : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed opacity-50'
                                }`}
                        >
                            <HiOutlineDownload size={20} />
                            {(item.already_purchased || item.is_mine || item.price === 0) ? 'DOWNLOAD' : 'ซื้อเพื่อดาวน์โหลด'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfViewerModal;
