import React, { useState, useMemo, useEffect, useCallback } from "react"
import { HiOutlineDownload, HiOutlineX, HiOutlineSparkles } from "react-icons/hi"
import { BookText, FileText, PlusCircle, Search, Coins, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Layout/Navbar"
import Footer from "../components/Layout/footer"
import CoinBadge from "../components/UI/CoinBadge"
import { ASSETS, getAvatarIcon } from "../config/assets";
import { jsPDF } from "jspdf"
import pdfToText from 'react-pdftotext'
import { pdfjs } from "react-pdf"

// Configure PDF.js worker for react-pdftotext
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`
import { 
    fetchMySheets, fetchMarketSheets, uploadSheet, buySheet, 
    fetchPurchasedSheets, deleteSheet, updateExp, 
    summarizeSheetStreaming 
} from "../services/aiService"
import { formatDocUrl } from "../utils/url"

// New Modular Components
import SummaryCard from "../components/Summaries/SummaryCard"
import AIModal from "../components/Summaries/AIModal"
import PdfViewerModal from "../components/Summaries/PdfViewerModal"
import UploadModal from "../components/Summaries/UploadModal"

const Logo = ASSETS.BRANDING.LOGO;

const Summaries = () => {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด")
    const [selectedSubject, setSelectedSubject] = useState("ทั้งหมด")
    const [currentView, setCurrentView] = useState("market")
    
    const categories = ["ทั้งหมด", "บทเรียน", "สรุปสอบ", "ชีทติว", "งานวิจัย"]
    const subjects = ["ทั้งหมด", "Computer Engineering", "Science", "Information Technology", "General Education"]

    // Data States
    const [mySummaries, setMySummaries] = useState([])
    const [marketSheets, setMarketSheets] = useState([])
    const [purchasedSheets, setPurchasedSheets] = useState([])
    const [isLoadingSheets, setIsLoadingSheets] = useState(false)

    // UI States
    const [isAIModalOpen, setIsAIModalOpen] = useState(false)
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [summaryText, setSummaryText] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [uploadForm, setUploadForm] = useState({ title: "", price: 0, is_public: false })
    const [selectedFile, setSelectedFile] = useState(null)
    const [profileImage, setProfileImage] = useState(Logo)

    const loadSheets = useCallback(async () => {
        const token = localStorage.getItem("token")
        if (!token) return
        setIsLoadingSheets(true)
        try {
            const [mine, market, purchased] = await Promise.all([
                fetchMySheets(),
                fetchMarketSheets(),
                fetchPurchasedSheets(),
            ])
            setMySummaries(mine)
            setMarketSheets(market)
            setPurchasedSheets(purchased)
        } catch (error) {
            console.error("Load sheets error:", error)
        } finally {
            setIsLoadingSheets(false)
        }
    }, [])

    useEffect(() => { loadSheets() }, [loadSheets])

    const refreshProfileImage = useCallback(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setProfileImage(Logo);
            return;
        }
        const savedAvatar = localStorage.getItem("avatar");
        setProfileImage(getAvatarIcon(savedAvatar));
    }, []);

    useEffect(() => {
        refreshProfileImage();
        window.addEventListener("avatarUpdated", refreshProfileImage);
        return () => window.removeEventListener("avatarUpdated", refreshProfileImage);
    }, [refreshProfileImage]);

    const checkAuth = () => {
        const token = localStorage.getItem("token")
        if (!token) {
            alert("กรุณาเข้าสู่ระบบก่อนนะครับเพื่อน 🌷")
            navigate("/login")
            return false
        }
        return true
    }

    const filteredMarket = useMemo(() => {
        return (marketSheets || []).filter(item => {
            const matchesSearch = (item.title || "").toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === "ทั้งหมด" || item.category === selectedCategory
            const matchesSubject = selectedSubject === "ทั้งหมด" || item.subject === selectedSubject
            return matchesSearch && matchesCategory && matchesSubject
        })
    }, [marketSheets, searchQuery, selectedCategory, selectedSubject])

    const handleAIGenerate = async (item) => {
        if (!checkAuth()) return
        setSelectedItem(item)
        setIsAIModalOpen(true)
        setIsGenerating(true)
        setSummaryText("")

        let fullSummary = `✨ สรุปโดย APM AI (Streaming Mode) ✨\n\nหัวข้อ: ${item.title}\n\n`
        setSummaryText(fullSummary)

        try {
            await summarizeSheetStreaming(item.id, (chunk) => {
                fullSummary += chunk
                setSummaryText(fullSummary)
            })
        } catch (error) {
            setSummaryText(prev => prev + "\n\nขออภัยครับเพื่อน พอดี AI สรุปชีทเล่มนี้ขัดข้องนิดหน่อย ลองใหม่อีกรอบนะ! 🌷")
        } finally {
            setIsGenerating(false)
        }
    }

    const downloadPDF = () => {
        if (!selectedItem) return
        const doc = new jsPDF()
        doc.text("Summary Report: " + selectedItem.title, 10, 10)
        doc.text(summaryText, 10, 20, { maxWidth: 180 })
        doc.save(`${selectedItem.title}.pdf`)
    }

    const handleUploadSubmit = async () => {
        if (!selectedFile) { alert("กรุณาเลือกไฟล์ PDF ก่อนนะครับ"); return }
        if (!uploadForm.title.trim()) { alert("กรุณาใส่ชื่อชีทด้วยนะครับ"); return }

        setIsLoadingSheets(true)
        try {
            let extractedText = ""
            try {
                extractedText = await pdfToText(selectedFile)
            } catch (extractErr) {
                console.warn("Client-side extraction failed, falling back to server:", extractErr)
            }

            const result = await uploadSheet(
                uploadForm.title,
                uploadForm.price,
                uploadForm.is_public,
                selectedFile,
                extractedText
            )
            localStorage.setItem("user_coins", String(result.coins_total))
            window.dispatchEvent(new Event("coinsUpdated"))
            updateExp(15).catch(() => { })
            await loadSheets()
            setIsUploadModalOpen(false)
            setUploadForm({ title: "", price: 0, is_public: false })
            setSelectedFile(null)
            alert("เย้! ชีทของคุณขึ้นระบบแล้วครับ ✨")
        } catch (err) {
            const errorMsg = err.response?.data?.detail || "อัปโหลดไม่สำเร็จ กรุณาลองใหม่ครับเพื่อน";
            alert(errorMsg)
        } finally {
            setIsLoadingSheets(false)
        }
    }

    const handleCollectSheet = async (item) => {
        if (!checkAuth()) return
        try {
            const result = await buySheet(item.id)
            localStorage.setItem("user_coins", String(result.coins_remaining))
            window.dispatchEvent(new Event("coinsUpdated"))
            updateExp(5).catch(() => { })
            await loadSheets()
            alert(`เย้! ซื้อสรุป "${item.title}" สำเร็จแล้วครับ 🌷`)
        } catch (err) {
            alert(err?.response?.data?.detail || "ซื้อไม่สำเร็จ กรุณาลองใหม่")
        }
    }

    const handleRead = (item) => {
        if (!checkAuth()) return;
        const pdfUrl = formatDocUrl(item.file_path);
        setSelectedItem({ ...item, pdfUrl });
        setIsPdfModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('ต้องการลบใช่ไหมครับ?')) return;
        try {
            await deleteSheet(id)
            await loadSheets()
        } catch (err) { }
    };

    const handleDownloadOriginal = (item) => {
        const link = document.createElement('a');
        link.href = item.pdfUrl;
        link.download = `${item.title}.pdf`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background-dark font-display flex flex-col transition-colors duration-300 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-40 -left-40 size-[500px] rounded-full bg-primary/10 blur-[120px] opacity-60" />
            <div className="pointer-events-none absolute top-1/4 -right-40 size-[500px] rounded-full bg-pink-400/10 blur-[120px] opacity-60" />

            <header className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/60 dark:bg-black/20 backdrop-blur-xl transition-all">
                <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
                        <div className="relative size-12 rounded-2xl bg-white shadow-xl ring-2 ring-pink-100 flex items-center justify-center overflow-hidden">
                            <img src={profileImage || Logo} alt="Logo" className="size-8 object-contain group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-black text-gray-900 dark:text-white leading-tight">APM AI</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Community Store 🌷</p>
                        </div>
                    </div>
                    <div className="hidden md:flex flex-1 justify-center px-4"><Navbar /></div>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="hidden sm:block"><CoinBadge className="scale-90" /></div>
                        <div
                            className="size-10 rounded-2xl border-2 border-white dark:border-white/10 cursor-pointer bg-white bg-cover bg-center shadow-lg hover:scale-110 active:scale-95 transition-all overflow-hidden"
                            style={{ backgroundImage: `url("${profileImage}")` }}
                            onClick={() => navigate("/account")}
                        />
                        <div className="md:hidden"><Navbar /></div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 md:px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 md:mb-12">
                    <div className="space-y-2 text-center md:text-left transition-all">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary font-black text-[9px] uppercase tracking-[0.2em] shadow-sm border border-primary/20">
                            <Sparkles className="size-3" /> {currentView === 'market' ? 'Community Store' : currentView === 'my-sheets' ? 'Private Collection' : 'Purchased'}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-white">
                            {currentView === 'market' ? 'Summaries 🌷' : currentView === 'my-sheets' ? 'My Library ✨' : 'My Orders 🛍️'}
                        </h2>
                    </div>

                    <div className="flex bg-gray-100 dark:bg-white/5 p-1.5 rounded-[28px] border border-gray-200 dark:border-white/10 shadow-inner overflow-x-auto no-scrollbar max-w-full">
                        {['market', 'my-sheets', 'purchased'].map((view) => (
                            <button
                                key={view}
                                onClick={() => setCurrentView(view)}
                                className={`px-6 md:px-8 py-3.5 rounded-[22px] font-black text-sm capitalize whitespace-nowrap transition-all duration-300 ${currentView === view ? 'bg-white dark:bg-primary text-gray-900 dark:text-white shadow-xl scale-[1.05]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                            >
                                {view.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {currentView === 'market' ? (
                    <div className="space-y-8 animate-in fade-in duration-700">
                        <div className="space-y-6 bg-white/40 dark:bg-white/5 p-5 md:p-6 rounded-[32px] md:rounded-[40px] border border-white/60 dark:border-white/10 shadow-sm backdrop-blur-md">
                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search for summaries..."
                                    className="w-full pl-14 pr-6 py-4 rounded-[22px] bg-white border border-gray-100 dark:bg-black/40 dark:border-white/10 outline-none font-bold text-base dark:text-white focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="space-y-3">
                                    <p className="px-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Subjects</p>
                                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
                                        {subjects.map(s => (
                                            <button key={s} onClick={() => setSelectedSubject(s)} className={`px-5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all border ${selectedSubject === s ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 'bg-white/50 dark:bg-black/20 border-gray-100 dark:border-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>{s}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="px-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Categories</p>
                                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
                                        {categories.map(c => (
                                            <button key={c} onClick={() => setSelectedCategory(c)} className={`px-5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all border ${selectedCategory === c ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/50 dark:bg-black/20 border-gray-100 dark:border-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>{c}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isLoadingSheets && <div className="text-center py-8 text-gray-400 font-bold">กำลังโหลดชีทจากตลาด...</div>}
                        
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
                            {filteredMarket.map((item) => (
                                <SummaryCard 
                                    key={item.id} 
                                    item={item} 
                                    onRead={handleRead} 
                                    onCollect={handleCollectSheet}
                                    checkAuth={checkAuth}
                                />
                            ))}
                        </div>

                        {filteredMarket.length === 0 && (
                            <div className="py-24 text-center">
                                <div className="size-24 bg-gray-100 dark:bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-6 text-gray-400 border border-white/10 shadow-inner"><Search size={40} /></div>
                                <h3 className="text-2xl font-black text-gray-400">ไม่พบสรุปที่ค้นหาเลยเพื่อน... 🌷</h3>
                                <p className="font-bold text-gray-400/60 mt-2">ลองพิมพ์ keyword อื่นดูนะ! ✨</p>
                            </div>
                        )}
                    </div>
                ) : currentView === "my-sheets" ? (
                    <div className="space-y-8 animate-in fade-in duration-700">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                            {[
                                { label: "ชีทสรุปทั้งหมด", value: mySummaries.length, icon: BookText, color: "bg-blue-600" },
                                { label: "ยอดดาวน์โหลด", value: "0", icon: HiOutlineDownload, color: "bg-purple-600" },
                                { label: "เหรียญสะสม", value: "0", icon: Coins, color: "bg-amber-500" }
                            ].map((stat, i) => (
                                <div key={i} className="p-5 rounded-[28px] bg-white border border-gray-100 dark:bg-white/5 dark:border-white/10 flex items-center gap-4 shadow-sm hover:shadow-lg transition-all group">
                                    <div className={`size-12 rounded-[16px] ${stat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                                        {React.createElement(stat.icon, { size: 20 })}
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-tight">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div
                                onClick={() => setIsUploadModalOpen(true)}
                                className="group h-[320px] bg-white dark:bg-white/5 border-4 border-dashed border-gray-100 dark:border-white/10 rounded-[48px] flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all relative overflow-hidden"
                            >
                                <div className="size-20 rounded-[32px] bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-inner text-primary">
                                    <PlusCircle size={48} />
                                </div>
                                <h4 className="font-black text-2xl text-gray-900 dark:text-white">อัปโหลดชีทใหม่</h4>
                                <p className="text-xs font-bold text-gray-400 mt-2 tracking-widest uppercase">ส่งต่อความรู้ รับเหรียญฟรี 🪙</p>
                            </div>

                            {mySummaries.map((item) => (
                                <div key={item.id} className="group h-[200px] md:h-[320px] bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-white/10 rounded-[32px] md:rounded-[48px] overflow-hidden flex shadow-xl hover:-translate-y-2 transition-all duration-500">
                                    <div className="w-1/3 bg-gray-100 dark:bg-black/40 flex items-center justify-center relative overflow-hidden group">
                                        <div className="p-3 rounded-xl bg-primary text-white shadow-2xl group-hover:rotate-12 transition-transform">
                                            <FileText size={24} />
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4 md:p-8 flex flex-col min-w-0">
                                        <div className="flex justify-between items-start mb-1 md:mb-2">
                                            <span className="text-[8px] md:text-[10px] font-black px-1.5 py-0.5 rounded bg-gray-100 dark:bg-black/40 text-gray-500 dark:text-gray-400 uppercase tracking-widest truncate max-w-[60px] md:max-w-none">{item.category}</span>
                                            <button onClick={() => handleDelete(item.id)} className="size-7 md:size-9 rounded-lg md:rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                                <HiOutlineX size={14} />
                                            </button>
                                        </div>
                                        <h3 className="text-[11px] md:text-xl font-black text-gray-900 dark:text-white line-clamp-2 leading-tight mb-2 md:mb-4">{item.title}</h3>
                                        <div className="mt-auto border-t border-gray-100 dark:border-white/5 pt-3 md:pt-5 flex items-center justify-between">
                                            <span className="text-[10px] md:text-lg font-black text-emerald-500">{item.price ?? 0} 🪙</span>
                                            <button onClick={() => handleRead(item)} className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-[8px] md:text-xs">READ</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12 animate-in fade-in duration-700">
                        <div className="mb-4 px-2 text-sm font-black text-primary">🛍️ ชีทที่ซื้อมา ({purchasedSheets.length} รายการ)</div>
                        {purchasedSheets.length === 0 && !isLoadingSheets && (
                            <div className="py-24 text-center">
                                <div className="size-24 bg-gray-100 dark:bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-6 text-gray-400 border border-white/10 shadow-inner"><BookText size={40} /></div>
                                <h3 className="text-2xl font-black text-gray-400">ยังไม่มีชีทที่ซื้อมาเลยเพื่อน 🌷</h3>
                                <p className="font-bold text-gray-400/60 mt-2">ลองไปเลือกชีทใน Marketplace ดูนะ ✨</p>
                                <button onClick={() => setCurrentView("market")} className="mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-primary text-white font-black shadow-lg hover:scale-105 transition-all">ไปที่ Marketplace</button>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {purchasedSheets.map((item) => (
                                <div key={item.id} className="group h-[280px] bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-white/10 rounded-[48px] overflow-hidden flex shadow-xl hover:-translate-y-2 transition-all duration-500">
                                    <div className="w-1/3 bg-indigo-500 flex items-center justify-center relative overflow-hidden">
                                        <div className="p-4 rounded-2xl bg-white/20 border border-white/40 backdrop-blur-xl text-white shadow-2xl group-hover:rotate-12 transition-transform"><FileText size={32} /></div>
                                    </div>
                                    <div className="flex-1 p-8 flex flex-col justify-between">
                                        <div>
                                            <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 uppercase tracking-widest border border-purple-200 dark:border-purple-500/20">ซื้อแล้ว ✓</span>
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white line-clamp-2 leading-tight mt-3 group-hover:text-primary transition-colors">{item.title}</h3>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-4">
                                            <span className="text-sm font-black text-gray-400">{item.price ?? 0} 🪙</span>
                                            <button onClick={() => handleRead(item)} className="px-5 py-2.5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-xs hover:shadow-xl hover:scale-105 active:scale-95 transition-all">เปิดอ่านชีท</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <AIModal 
                isOpen={isAIModalOpen} 
                onClose={() => setIsAIModalOpen(false)} 
                summaryText={summaryText} 
                isGenerating={isGenerating} 
                onDownloadPDF={downloadPDF} 
            />

            <PdfViewerModal 
                isOpen={isPdfModalOpen} 
                onClose={() => setIsPdfModalOpen(false)} 
                item={selectedItem} 
                onAIGenerate={handleAIGenerate} 
                onDownload={handleDownloadOriginal} 
            />

            <UploadModal 
                isOpen={isUploadModalOpen} 
                onClose={() => setIsUploadModalOpen(false)} 
                uploadForm={uploadForm} 
                setUploadForm={setUploadForm} 
                selectedFile={selectedFile} 
                onFileChange={(e) => setSelectedFile(e.target.files[0])} 
                onSubmit={handleUploadSubmit} 
                isLoading={isLoadingSheets} 
            />

            <Footer />
        </div>
    )
}

export default Summaries