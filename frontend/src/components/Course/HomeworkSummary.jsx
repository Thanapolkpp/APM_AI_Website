import React, { useState } from "react"
import { HiOutlineBookOpen, HiOutlineDownload, HiOutlineEye, HiOutlineSparkles, HiOutlineX, HiOutlinePlus } from "react-icons/hi"
import { BookText, FileText, Code2, Calculator, Atom, Palette, PlusCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import jsPDF from "jspdf"

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

    const [summaries, setSummaries] = useState([
        {
            id: 1,
            title: "สรุป Computer Architecture (Midterm)",
            subject: "Computer Engineering",
            price: "Free",
            rating: 4.9,
            views: "1.2k",
            Icon: Code2,
            gradient: "from-blue-400 to-indigo-500",
            bgLight: "bg-blue-50/50",
            textAccent: "text-blue-600",
            fullContent: "หน่วยประมวลผลกลาง (CPU) ประกอบด้วย Register, ALU และ Control Unit... สถาปัตยกรรมแบบ Von Neumann แยกส่วนความจำและหน่วยประมวลผล... การจัดลำดับคำสั่งแบบ Pipelining ช่วยเพิ่มความเร็วในการทำงาน...",
            pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        },
        {
            id: 2,
            title: "สรุปสูตรฟิสิกส์ 1 ครบทุกบท",
            subject: "Science",
            price: "Free",
            rating: 4.7,
            views: "850",
            Icon: Atom,
            gradient: "from-rose-400 to-pink-500",
            bgLight: "bg-pink-50/50",
            textAccent: "text-pink-600",
            fullContent: "กฎของนิวตัน: F=ma... การเคลื่อนที่แนวตรง: v=u+at, s=ut+1/2at^2... งานและพลังงาน: W=Fscosθ, Ek=1/2mv^2, Ep=mgh...",
            pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        },
        {
            id: 3,
            title: "สรุป Database Design (ER Diagram)",
            subject: "Information Technology",
            price: "Free",
            rating: 4.8,
            views: "2.1k",
            Icon: Calculator,
            gradient: "from-purple-400 to-violet-500",
            bgLight: "bg-purple-50/50",
            textAccent: "text-purple-600",
            fullContent: "Entity คือ สิ่งที่เราสนใจเก็บข้อมูล... Relationship คือ ความสัมพันธ์ระหว่าง Entity (1:1, 1:N, M:N)... Attribute คือ คุณลักษณะของ Entity...",
            pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        },
        {
            id: 4,
            title: "ชีทสรุปภาษาอังกฤษพื้นฐาน",
            subject: "General Education",
            price: "Free",
            rating: 4.5,
            views: "540",
            Icon: BookText,
            gradient: "from-emerald-400 to-teal-500",
            bgLight: "bg-emerald-50/50",
            textAccent: "text-emerald-600",
            fullContent: "Present Simple: S + V.1 (s/es)... Past Simple: S + V.2... Present Continuous: S + is/am/are + V.ing...",
            pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        },
    ])

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
        <section className="w-full max-w-7xl mx-auto py-16 px-6 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-[12px] tracking-wider uppercase mb-4 border border-primary/20">
                        Homework Archive
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                        คลังสรุปการบ้านตัวทึง ✨
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-3 text-lg">
                        ไม่ใช่แค่สรุปไฟล์เดิมไปวันๆ แต่ให้ AI ช่วยติวให้เข้าใจง่ายขึ้น 💗
                    </p>
                </div>
                <button 
                    onClick={() => navigate("/summaries")}
                    className="h-fit px-8 py-3 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 font-black text-gray-700 dark:text-gray-200 hover:bg-white transition-all shadow-sm hover:shadow-lg active:scale-95"
                >
                    ดูทั้งหมด
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {summaries.map((item) => (
                    <div
                        key={item.id}
                        className="group relative h-[380px] bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/60 dark:border-white/10 rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
                    >
                        {/* THE COVER - Visual first approach */}
                        <div
                            className={`h-40 w-full bg-gradient-to-br ${item.gradient} relative flex items-center justify-center overflow-hidden cursor-pointer`}
                            onClick={() => {
                                if (!checkAuth()) return;
                                setSelectedItem(item);
                                setIsPdfModalOpen(true);
                            }}
                        >
                            {/* Decorative background pattern */}
                            <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                                <svg width="100%" height="100%"><pattern id={`pattern-${item.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 40L40 0" fill="none" stroke="white" strokeWidth="2" /></pattern><rect width="100%" height="100%" fill={`url(#pattern-${item.id})`} /></svg>
                            </div>

                            <div className="relative z-10 w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                                <item.Icon size={40} className="text-white drop-shadow-md" />
                            </div>

                            {/* Hover info badge */}
                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to View
                            </div>
                        </div>

                        {/* CONTENT SECTION */}
                        <div className="flex-1 p-6 flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${item.textAccent} ${item.bgLight} dark:bg-white/5 uppercase tracking-wide`}>
                                    {item.subject}
                                </span>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 ml-auto">
                                    ⭐ {item.rating}
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
                                        {item.views} Views
                                    </div>
                                    <span className="text-[11px] font-black text-emerald-500 tracking-widest uppercase">
                                        {item.price}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Summary Modal - Redesigned to match Login/Account glassy style */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-[48px] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.2)] relative z-10 border border-white/60 dark:border-white/10 flex flex-col animate-in fade-in zoom-in duration-500 ease-out">

                        <div className="p-8 pb-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-xl shadow-purple-500/20">
                                    <HiOutlineSparkles size={30} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">AI สรุปให้แล้วนะ!</h3>
                                    <p className="text-xs text-primary font-black uppercase tracking-[0.2em] mt-0.5">APM AI Assistant</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-white transition-all hover:rotate-90">
                                <HiOutlineX size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 text-gray-700 dark:text-gray-200 font-medium leading-[1.8] whitespace-pre-wrap text-lg">
                            {isGenerating ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full border-4 border-purple-100 dark:border-purple-500/20 border-t-purple-600 animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-10 h-10 bg-purple-500/10 rounded-full animate-ping"></div>
                                        </div>
                                    </div>
                                    <p className="font-black text-gray-500 dark:text-gray-400 text-xl animate-pulse">กำลังติวสรุปให้เพื่อนอยู่ แป๊บนึงนะ... ✨</p>
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    {summaryText}
                                </div>
                            )}
                        </div>

                        <div className="p-8 flex gap-4 bg-gray-50/50 dark:bg-white/5">
                            <button
                                onClick={downloadPDF}
                                disabled={isGenerating}
                                className="flex-1 py-5 rounded-[28px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] text-white font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-indigo-500/30 transition-all disabled:opacity-50"
                            >
                                <HiOutlineDownload size={22} />
                                ดาวน์โหลด PDF
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-10 py-5 rounded-[28px] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white font-black text-lg hover:bg-gray-50 transition-all active:scale-95"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PDF Viewer Modal */}
            {isPdfModalOpen && selectedItem && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-xl transition-opacity" onClick={() => setIsPdfModalOpen(false)}></div>
                    <div className="bg-white dark:bg-gray-900 rounded-[48px] w-full max-w-6xl h-full overflow-hidden shadow-[0_32px_128px_rgba(0,0,0,0.4)] relative z-10 border border-white/20 flex flex-col animate-in fade-in zoom-in duration-500">
                        <div className="p-8 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-3xl bg-gradient-to-br ${selectedItem.gradient} text-white flex items-center justify-center shadow-xl`}>
                                    <selectedItem.Icon size={30} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white truncate max-w-lg">{selectedItem.title}</h3>
                                    <p className="text-xs text-primary font-black uppercase tracking-[0.2em] mt-1">{selectedItem.subject}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <a
                                    href={selectedItem.pdfUrl}
                                    download={`${selectedItem.title}.pdf`}
                                    className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white flex items-center justify-center hover:bg-white dark:hover:bg-primary transition-all shadow-sm hover:shadow-lg"
                                >
                                    <HiOutlineDownload size={24} />
                                </a>
                                <button onClick={() => setIsPdfModalOpen(false)} className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all hover:rotate-90">
                                    <HiOutlineX size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-gray-100 dark:bg-black relative">
                            {/* PDF Viewer with fallback loading state */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-6"></div>
                                <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-3">กำลังเปิดไฟล์สรุป...</h4>
                                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 font-medium">รอแป๊บนึงนะเพื่อน กำลังโหลดสถาปัตยกรรมสุดเจ๋งมาให้ดูอยู่ 🚀</p>
                                <a
                                    href={selectedItem.pdfUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-10 py-4 rounded-[28px] bg-primary text-white font-black text-lg shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
                                >
                                    เปิดในหน้าต่างใหม่
                                </a>
                            </div>

                            <iframe
                                src={selectedItem.pdfUrl.startsWith("http")
                                    ? `https://docs.google.com/viewer?url=${encodeURIComponent(selectedItem.pdfUrl)}&embedded=true`
                                    : selectedItem.pdfUrl}
                                className="w-full h-full border-none relative z-10"
                                title="PDF Viewer"
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default HomeworkSummary

