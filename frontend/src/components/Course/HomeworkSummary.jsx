import React, { useState, useEffect } from "react"
import { HiOutlineBookOpen, HiOutlineDownload, HiOutlineEye, HiOutlineSparkles, HiOutlineX, HiOutlinePlus } from "react-icons/hi"
import { BookText, FileText, Code2, Calculator, Atom, Palette, PlusCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import jsPDF from "jspdf"
import { fetchMarketSheets } from "../../services/aiService"

const RAW_URL = import.meta.env.VITE_API_BASE_URL || "https://apm-ai-website.onrender.com"
const API_BASE_URL = RAW_URL.endsWith('/') ? RAW_URL.slice(0, -1) : RAW_URL;

const ICON_MAP = {
    BookText,
    FileText,
    Code2,
    Calculator,
    Atom,
    Palette,
    PlusCircle
}

const HomeworkSummary = () => {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [summaryText, setSummaryText] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)

    const checkAuth = () => {
        const token = localStorage.getItem("token")
        if (!token) {
            alert("กรุณาเข้าสู่ระบบก่อนดูสรุปนะครับ 🌷")
            navigate("/login")
            return false
        }
        return true
    }

    const [summaries, setSummaries] = useState([])

    useEffect(() => {
        const loadSheets = async () => {
            try {
                const data = await fetchMarketSheets()
                // เอาแค่ 4 อันแรกมาโชว์ที่หน้า Home
                setSummaries((data || []).slice(0, 4))
            } catch (err) {
                console.error("Failed to fetch market sheets", err)
            }
        }
        loadSheets()
    }, [])

    const handleAIGenerate = (item) => {
        if (!checkAuth()) return
        setSelectedItem(item)
        setIsModalOpen(true)
        setIsGenerating(true)
        setSummaryText("")

        setTimeout(() => {
            const aiSummary = `✨ สรุปเนื้อหาสำคัญโดย APM AI ✨\n\nหัวข้อ: ${item.title}\nหมวดหมู่: ${item.subject}\n\n[ประเด็นสำคัญ]\n1. เนื้อหาหลักครอบคลุมเรื่องสถาปัตยกรรมพื้นฐานและทฤษฎีสำคัญ\n2. สรุปความสัมพันธ์เชิงตรรกะและสูตรที่ต้องจำ\n3. แนวข้อสอบเก่าที่มักจะออกในหัวข้อนี้\n\n[รายละเอียดสรุป]\n${item.fullContent}\n\n--- สรุปนี้สร้างขึ้นเพื่อเป็นแนวทางในการทบทวนบทเรียน ---`
            setSummaryText(aiSummary)
            setIsGenerating(false)
        }, 1500)
    }

    // --- SECURITY PROTOCOL (Anti-Screenshot) ---
    useEffect(() => {
        const handleSecurity = (e) => {
            const isProtected = selectedItem && 
                               selectedItem.price > 0 && 
                               !selectedItem.is_mine && 
                               !selectedItem.already_purchased;

            if (isProtected) {
                if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && e.key === 's') || (e.ctrlKey && e.key === 'p')) {
                    if (isPdfModalOpen) {
                        e.preventDefault();
                        alert("⚠️ ตรวจพบความพยายามบันทึกหน้าจอ! ห้ามบันทึกภาพหน้าจอสรุปนี้นะครับเพื่อน เพื่อเป็นการให้เกียรติผู้สร้างสรรค์ผลงาน 🌷");
                    }
                }
            }
        };

        window.addEventListener('keydown', handleSecurity);
        window.addEventListener('keyup', handleSecurity);

        return () => {
            window.removeEventListener('keydown', handleSecurity);
            window.removeEventListener('keyup', handleSecurity);
        };
    }, [isPdfModalOpen, selectedItem]);

    const downloadPDF = () => {
        const doc = new jsPDF()
        doc.setFontSize(20)
        doc.text("APM AI - Homework Summary", 10, 20)
        doc.setFontSize(14)
        doc.text(`Title: ${selectedItem.title}`, 10, 40)
        doc.text(`Subject: ${selectedItem.subject}`, 10, 50)
        doc.setFontSize(12)
        const splitText = doc.splitTextToSize(summaryText, 180)
        doc.text(splitText, 10, 70)
        doc.save(`${selectedItem.title}_Summary.pdf`)
    }

    return (
        <section className="w-full max-w-7xl mx-auto py-16 px-6 relative mb-20 md:mb-0">
            {/* Header - Simplified on Mobile */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-12">
                <div className="text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-[10px] md:text-[12px] tracking-wider uppercase mb-3 md:mb-4 border border-primary/20">
                        Homework Archive
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        คลังสรุปการบ้านตัวทึง ✨
                    </h2>
                    <p className="hidden md:block text-gray-500 dark:text-gray-400 font-medium mt-3 text-lg">
                        ไม่ใช่แค่สรุปไฟล์เดิมไปวันๆ แต่ให้ AI ช่วยติวให้เข้าใจง่ายขึ้น 💗
                    </p>
                </div>
                <button
                    onClick={() => navigate("/summaries")}
                    className="hidden md:block h-fit px-8 py-3 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 font-black text-gray-700 dark:text-gray-200 hover:bg-white transition-all shadow-sm hover:shadow-lg active:scale-95"
                >
                    ดูทั้งหมด
                </button>
            </div>

            {/* Grid - Adjusted for Mobile (Icon-only focus and 3 items) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {summaries.map((item, index) => (
                    <div
                        key={item.id}
                        className={`group relative transition-all duration-500 flex flex-col 
                            ${index === 3 ? 'hidden sm:flex' : 'flex'}
                            md:h-[380px] md:bg-white/40 md:dark:bg-white/5 md:backdrop-blur-3xl md:border md:border-white/60 md:dark:border-white/10 md:rounded-[40px] md:overflow-hidden md:shadow-sm md:hover:shadow-2xl md:hover:-translate-y-2
                        `}
                    >
                        {/* Mobile: Square Icon Button / Desktop: Header Image */}
                        <div
                            className={`h-24 w-24 mx-auto md:h-40 md:w-full rounded-3xl md:rounded-none bg-gradient-to-br ${item.gradient} relative flex items-center justify-center overflow-hidden cursor-pointer shadow-lg md:shadow-none hover:scale-105 md:hover:scale-100 active:scale-95 md:active:scale-100 transition-all`}
                            onClick={() => {
                                if (window.innerWidth < 768) {
                                    handleAIGenerate(item); // On mobile, click icon starts AI
                                } else {
                                    if (!checkAuth()) return;
                                    const pdfUrl = item.file_path ? `${API_BASE_URL}${item.file_path}` : "";
                                    setSelectedItem({ ...item, pdfUrl });
                                    setIsPdfModalOpen(true);
                                }
                            }}
                        >
                            <div className="absolute inset-0 opacity-10 mix-blend-overlay hidden md:block">
                                <svg width="100%" height="100%"><pattern id={`pattern-${item.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 40L40 0" fill="none" stroke="white" strokeWidth="2" /></pattern><rect width="100%" height="100%" fill={`url(#pattern-${item.id})`} /></svg>
                            </div>

                            <div className="relative z-10 w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl md:shadow-2xl group-hover:scale-110 md:group-hover:scale-125 md:group-hover:rotate-12 transition-all duration-500">
                                {(() => {
                                    const IconComp = ICON_MAP[item.iconName] || FileText;
                                    return <IconComp className="text-white drop-shadow-md w-6 h-6 md:w-10 md:h-10" />;
                                })()}
                            </div>

                            <div className="absolute bottom-2 text-[8px] font-black text-white/80 uppercase tracking-tighter md:hidden">
                                AI TUTOR
                            </div>
                        </div>

                        {/* DESKTOP CONTENT - Hidden on Mobile */}
                        <div className="hidden md:flex flex-1 p-6 flex-col">
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${item.textAccent || 'text-primary border-primary/20'} ${item.bgLight || 'bg-primary/5'} dark:bg-white/5 uppercase tracking-wide`}>
                                    {item.subject}
                                </span>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 ml-auto">
                                    ⭐ {item.rating || '5.0'}
                                </div>
                            </div>

                            <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight mb-auto group-hover:text-primary transition-colors">
                                {item.title}
                            </h3>

                            <div className="mt-4 flex flex-col gap-3">
                                <button
                                    onClick={() => handleAIGenerate(item)}
                                    className="w-full py-3.5 rounded-[20px] bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    <HiOutlineSparkles size={18} /> สรุปด้วย AI
                                </button>

                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                        <HiOutlineEye size={14} />
                                        {item.views || '0'} Views
                                    </div>
                                    <span className="text-[11px] font-black text-emerald-500 tracking-widest uppercase">
                                        {item.price === 0 || item.price === "Free" ? "Free" : `${item.price} 🪙`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Navigation Tab (Moved from Top to Bottom) */}
            <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[340px]">
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl border border-white/60 dark:border-white/10 rounded-[2.5rem] p-2 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                    <button 
                        onClick={() => navigate("/reading")}
                        className="flex-1 flex flex-col items-center gap-1 text-gray-500 hover:text-primary transition-colors"
                    >
                        <HiOutlineBookOpen size={22} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">อ่านหนังสือ</span>
                    </button>
                    
                    {/* BLACK IN THE CENTER */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="size-16 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black shadow-2xl shadow-black/40 -mt-10 border-4 border-white dark:border-gray-900 active:scale-90 transition-transform"
                    >
                        <HiOutlineSparkles size={30} />
                    </button>

                    <button 
                        onClick={() => navigate("/todo")}
                        className="flex-1 flex flex-col items-center gap-1 text-gray-500 hover:text-primary transition-colors"
                    >
                        <PlusCircle size={22} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">เพิ่มภารกิจ</span>
                    </button>
                </div>
            </div>

            {/* AI Summary Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-[48px] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl relative z-[210] border border-white/60 dark:border-white/10 flex flex-col animate-in fade-in zoom-in duration-500">

                        <div className="p-8 pb-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-xl">
                                    <HiOutlineSparkles size={30} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">AI Summary</h3>
                                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">Smart Learning 🌷</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">
                                <HiOutlineX size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 text-gray-700 dark:text-gray-200 font-medium leading-relaxed whitespace-pre-wrap text-lg">
                            {isGenerating ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-6">
                                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                                    <p className="font-black text-gray-500 dark:text-gray-400 text-xl animate-pulse">กำลังติวสรุปให้เพื่อนอยู่นะ... ✨</p>
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-display">
                                    {summaryText}
                                </div>
                            )}
                        </div>

                        <div className="p-8 flex gap-4 bg-gray-50/50 dark:bg-white/5">
                            <button
                                onClick={downloadPDF}
                                disabled={isGenerating}
                                className="flex-1 py-5 rounded-[28px] bg-black dark:bg-white text-white dark:text-black font-black text-lg flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 disabled:opacity-50"
                            >
                                <HiOutlineDownload size={22} /> Download PDF
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-10 py-5 rounded-[28px] bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white font-black text-lg hover:bg-gray-50 transition-all active:scale-95"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PDF Viewer Modal */}
            {isPdfModalOpen && selectedItem && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-xl transition-opacity" onClick={() => setIsPdfModalOpen(false)}></div>
                    <div className="bg-white dark:bg-gray-900 rounded-[48px] w-full max-w-6xl h-full overflow-hidden shadow-2xl relative z-[210] border border-white/20 flex flex-col animate-in fade-in zoom-in duration-500">
                        <div className="p-8 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-3xl bg-gradient-to-br ${selectedItem.gradient} text-white flex items-center justify-center shadow-xl`}>
                                    {(() => {
                                        const IconComp = ICON_MAP[selectedItem.iconName] || FileText;
                                        return <IconComp size={30} />;
                                    })()}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white truncate max-w-lg">{selectedItem.title}</h3>
                                    <p className="text-xs text-primary font-black uppercase tracking-[0.2em] mt-1">{selectedItem.subject}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setIsPdfModalOpen(false)} className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                                    <HiOutlineX size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-gray-100 dark:bg-black relative select-none group/pdf-container">
                            <iframe
                                src={`${selectedItem.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                className="w-full h-full border-none relative z-10"
                                title="PDF Viewer"
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default HomeworkSummary;
