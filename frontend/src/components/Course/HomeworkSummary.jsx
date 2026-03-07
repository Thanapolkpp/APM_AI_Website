import React, { useState } from "react"
import { HiOutlineBookOpen, HiOutlineDownload, HiOutlineEye, HiOutlineSparkles, HiOutlineX, HiOutlinePlus } from "react-icons/hi"
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
            color: "bg-blue-50 text-blue-600 border-blue-100",
            iconColor: "text-blue-500",
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
            color: "bg-pink-50 text-pink-600 border-pink-100",
            iconColor: "text-pink-500",
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
            color: "bg-purple-50 text-purple-600 border-purple-100",
            iconColor: "text-purple-500",
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
            color: "bg-emerald-50 text-emerald-600 border-emerald-100",
            iconColor: "text-emerald-500",
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

        // จำลองการสรุปโดย AI
        setTimeout(() => {
            const aiSummary = `✨ สรุปเนื้อหาสำคัญโดย APM AI ✨\n\nหัวข้อ: ${item.title}\nหมวดหมู่: ${item.subject}\n\n[ประเด็นสำคัญ]\n1. เนื้อหาหลักครอบคลุมเรื่องสถาปัตยกรรมพื้นฐานและทฤษฎีสำคัญ\n2. สรุปความสัมพันธ์เชิงตรรกะและสูตรที่ต้องจำ\n3. แนวข้อสอบเก่าที่มักจะออกในหัวข้อนี้\n\n[รายละเอียดสรุป]\n${item.fullContent}\n\n--- สรุปนี้สร้างขึ้นเพื่อเป็นแนวทางในการทบทวนบทเรียน ---`
            setSummaryText(aiSummary)
            setIsGenerating(false)
        }, 1500)
    }

    const downloadPDF = () => {
        const doc = new jsPDF()

        // จัดการเรื่องฟอนต์เบื้องต้น (Thai font support requires adding font to jsPDF)
        // เพื่อให้ง่ายในตอนนี้ เราจะใช้ตัวอักษรมาตรฐานที่รองรับภาษาอังกฤษได้ดี
        // แต่ถ้าต้องการภาษาไทยสมบูรณ์แบบ ต้องมีการทำ font rendering

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

    const handleUploadPdf = (e) => {
        if (!checkAuth()) return
        const file = e.target.files?.[0]
        if (!file) return

        if (file.type !== "application/pdf") {
            alert("กรุณาอัปโหลดไฟล์ PDF เท่านั้นครับ 🌷")
            return
        }

        // จำลองการเพิ่มข้อมูลสรุปใหม่จากการอัปโหลด
        const newSummary = {
            id: summaries.length + 1,
            title: file.name.replace(".pdf", ""),
            subject: "Uploaded Assignment",
            price: "Free",
            rating: 5.0,
            views: "0",
            color: "bg-amber-50 text-amber-600 border-amber-100",
            iconColor: "text-amber-500",
            fullContent: "เนื้อหาจากไฟล์สรุปที่คุณอัปโหลด กำลังรอการวิเคราะห์ข้อมูลเพิ่มเติม...",
            pdfUrl: URL.createObjectURL(file)
        }

        setSummaries(prev => [newSummary, ...prev])
        alert(`อัปโหลดไฟล์ ${file.name} สำเร็จแล้ว! สรุปของคุณถูกเพิ่มเข้าคลังเรียบร้อยครับ ✨`)
    }

    return (
        <section className="w-full max-w-6xl mx-auto py-12 px-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                        <span className="p-2 rounded-2xl bg-amber-100 text-amber-600">
                            <HiOutlineBookOpen size={28} />
                        </span>
                        คลังสรุปการบ้านตัวทึง ✨
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">แหล่งรวมสรุปเนื้อหาจากเพื่อนๆ สารพัดวิชา</p>
                </div>
                <button className="px-6 py-2.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-all shadow-sm">
                    ดูทั้งหมด
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Upload Card */}
                <label className="group bg-dashed-border bg-white/40 dark:bg-gray-800/20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-[32px] p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-white/60 transition-all duration-300">
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleUploadPdf} />
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                        <HiOutlinePlus size={32} className="text-gray-400 group-hover:text-primary" />
                    </div>
                    <p className="font-bold text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">เพิ่มสรุป PDF ของคุณ</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium italic">ส่งต่อความรู้ให้เพื่อนๆ 🌷</p>
                </label>

                {summaries.map((item) => (
                    <div
                        key={item.id}
                        className="group bg-white dark:bg-gray-800/60 backdrop-blur-xl border border-white dark:border-gray-700 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col h-full"
                    >
                        {/* Clickable Area for PDF Viewer */}
                        <div
                            className="flex-1 cursor-pointer"
                            onClick={() => {
                                if (!checkAuth()) return;
                                setSelectedItem(item);
                                setIsPdfModalOpen(true);
                            }}
                        >
                            <div className={`absolute -right-6 -top-6 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity ${item.color.split(' ')[0]}`}></div>

                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${item.color} border`}>
                                <HiOutlineBookOpen size={24} />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-primary transition-colors">
                                {item.title}
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-4">
                                📚 {item.subject}
                            </p>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                                    <HiOutlineEye size={14} />
                                    {item.views}
                                </div>
                                <div className="text-amber-500 text-xs font-bold flex items-center gap-1">
                                    ⭐ {item.rating}
                                </div>
                            </div>
                        </div>

                        {/* Control Section (Not strictly part of the clickable preview) */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleAIGenerate(item)}
                                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
                            >
                                <HiOutlineSparkles /> สรุปด้วย AI
                            </button>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700/50">
                                <span className="text-xs font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    {item.price}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400">กดที่การ์ดเพื่อดูไฟล์</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Summary Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white dark:bg-gray-800 rounded-[40px] w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl relative z-10 border border-white dark:border-gray-700 flex flex-col animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center">
                                    <HiOutlineSparkles size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 dark:text-white">AI สรุปให้แล้วนะ!</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Generated by APM AI Friend</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <HiOutlineX size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 text-gray-700 dark:text-gray-300 font-medium leading-relaxed whitespace-pre-wrap">
                            {isGenerating ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-4">
                                    <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
                                    <p className="font-bold text-gray-500 animate-pulse">กำลังสรุปเนื้อหาให้เพื่อนอยู่ แป๊บนึงนะ...</p>
                                </div>
                            ) : (
                                summaryText
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex gap-4">
                            <button
                                onClick={downloadPDF}
                                disabled={isGenerating}
                                className="flex-1 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black flex items-center justify-center gap-3 shadow-lg shadow-purple-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
                            >
                                <HiOutlineDownload size={22} />
                                ดาวน์โหลดเป็น PDF
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-8 py-4 rounded-2xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200 font-bold hover:bg-gray-50 transition-all"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* PDF Viewer Modal */}
            {isPdfModalOpen && selectedItem && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsPdfModalOpen(false)}></div>
                    <div className="bg-white dark:bg-gray-900 rounded-[40px] w-full max-w-5xl h-[90vh] overflow-hidden shadow-2xl relative z-10 border border-white dark:border-gray-700 flex flex-col animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                                    <HiOutlineBookOpen size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 dark:text-white truncate max-w-md">{selectedItem.title}</h3>
                                    <p className="text-xs text-gray-500 font-bold uppercase">{selectedItem.subject}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <a
                                    href={selectedItem.pdfUrl}
                                    download={`${selectedItem.title}.pdf`}
                                    className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
                                    title="ดาวน์โหลดไฟล์"
                                >
                                    <HiOutlineDownload size={22} />
                                </a>
                                <button onClick={() => setIsPdfModalOpen(false)} className="p-2.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
                                    <HiOutlineX size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-gray-100 dark:bg-gray-950 flex flex-col items-center justify-center relative">
                            {/* PDF Viewer */}
                            {selectedItem.pdfUrl.startsWith("http") ? (
                                <iframe
                                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedItem.pdfUrl)}&embedded=true`}
                                    className="w-full h-full border-none z-10"
                                    title="PDF Viewer"
                                ></iframe>
                            ) : (
                                <iframe
                                    src={selectedItem.pdfUrl}
                                    className="w-full h-full border-none z-10"
                                    title="PDF Viewer"
                                ></iframe>
                            )}

                            {/* Background Loading / Fallback UI */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin mb-4"></div>
                                <h4 className="font-bold text-gray-500 mb-2">กำลังเรียกดูไฟล์ PDF...</h4>
                                <p className="text-sm text-gray-400 max-w-xs mb-4">หากไฟล์ไม่แสดงโดยอัตโนมัติ คุณสามารถกดปุ่มด้านล่างเพื่อเปิดโดยตรงได้ครับ</p>
                                <div className="flex gap-3">
                                    <a
                                        href={selectedItem.pdfUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-6 py-2 rounded-xl bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-200"
                                    >

                                        เปิดในแท็บใหม่
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default HomeworkSummary
