import React, { useState, useMemo, useEffect, useCallback } from "react"
import { HiOutlineDownload, HiOutlineEye, HiOutlineSparkles, HiOutlineX } from "react-icons/hi"
import { Lock, Unlock } from "lucide-react"
import { BookText, FileText, Code2, Calculator, Atom, Palette, PlusCircle, Search, Filter, Upload, Coins, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Layout/Navbar"
import Footer from "../components/Layout/footer"
import CoinBadge from "../components/UI/CoinBadge"
import { ASSETS } from "../config/assets";

const Logo = ASSETS.BRANDING.LOGO;
const GirlIcon = ASSETS.AVATARS.GIRL;
const BroIcon = ASSETS.AVATARS.BRO;
const NerdIcon = ASSETS.AVATARS.NERD2; // Default Nerd
import { jsPDF } from "jspdf"
import { pdfjs, Document, Page } from 'react-pdf';
import pdfToText from 'react-pdftotext'
import { fetchMySheets, fetchMarketSheets, uploadSheet, buySheet, fetchPurchasedSheets, toggleSheetPublish, updateSheetPrice, deleteSheet, updateExp, sendMessageToAI, sendMessageToAIWithPDF, summarizeSheet } from "../services/aiService"

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


// แมพชื่อ string เข้ากับ Component จริงๆ เพื่อป้องกัน Error: Element type is invalid
const ICON_MAP = {
    BookText,
    FileText,
    Code2,
    Calculator,
    Atom,
    Palette,
    PlusCircle,
    Search,
    Filter,
    Upload
}

const RAW_URL = import.meta.env.VITE_API_URL || "https://apm-ai-website.onrender.com"
const API_BASE_URL = RAW_URL.endsWith('/') ? RAW_URL.slice(0, -1) : RAW_URL;

const formatDocUrl = (path) => {
    if (!path) return "";

    // ถ้าใน DB เผลอเก็บ localhost มา (เช่น ตอนรัน local) ให้เปลี่ยนเป็น production URL
    let cleanPath = path;
    if (cleanPath.includes("localhost:8000") || cleanPath.includes("127.0.0.1:8000")) {
        cleanPath = cleanPath.replace(/^https?:\/\/[^/]+/, API_BASE_URL);
    }

    if (cleanPath.startsWith("http")) return cleanPath;

    // ถ้าเป็น path สัมพัทธ์ ให้เติม API_BASE_URL
    const normalizedPath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;

    // ตรวจสอบว่ามีคำว่า uploads หรือยัง
    if (normalizedPath.startsWith('uploads/')) {
        return `${API_BASE_URL}/${normalizedPath}`;
    }
    // กรณีเก็บแค่ชื่อไฟล์หรือ path ใน bucket
    return `${API_BASE_URL}/uploads/sheets/${normalizedPath}`;
};

const SUMMARIES_DATA = []

const Summaries = () => {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด")
    const [selectedPrice, setSelectedPrice] = useState("ทั้งหมด")
    const [selectedSubject, setSelectedSubject] = useState("ทั้งหมด")
    const [currentView, setCurrentView] = useState("market")
    const [purchasedSheets, setPurchasedSheets] = useState([])
    const [editingPriceId, setEditingPriceId] = useState(null)
    const [editingPriceValue, setEditingPriceValue] = useState(0)

    const categories = ["ทั้งหมด", "บทเรียน", "สรุปสอบ", "ชีทติว", "งานวิจัย"]
    const prices = ["ทั้งหมด", "Free", "Paid"]
    const subjects = ["ทั้งหมด", "Computer Engineering", "Science", "Information Technology", "General Education"]

    // My Summaries State
    const [mySummaries, setMySummaries] = useState([])
    const [marketSheets, setMarketSheets] = useState([])
    const [isLoadingSheets, setIsLoadingSheets] = useState(false)

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [uploadForm, setUploadForm] = useState({ title: "", price: 0, is_public: false })
    const [selectedFile, setSelectedFile] = useState(null)

    // โหลด my sheets + market จาก backend
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
        } catch {
            // silently fail
        } finally {
            setIsLoadingSheets(false)
        }
    }, [])

    useEffect(() => { loadSheets() }, [loadSheets])

    const handleTogglePublish = async (sheetId) => {
        try {
            await toggleSheetPublish(sheetId)
            await loadSheets()
        } catch {
            alert("เกิดข้อผิดพลาด กรุณาลองใหม่")
        }
    }

    const handleUpdatePrice = async (sheetId) => {
        try {
            await updateSheetPrice(sheetId, editingPriceValue)
            setEditingPriceId(null)
            await loadSheets()
        } catch {
            alert("เกิดข้อผิดพลาด กรุณาลองใหม่")
        }
    }

    const filteredSummaries = useMemo(() => {
        return (marketSheets || []).filter(item => {
            const matchesSearch = (item.title || "").toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === "ทั้งหมด" || item.category === selectedCategory
            const matchesPriceValue = item.price === 0 || item.price === "Free" ? "Free" : "Paid"
            const matchesPrice = selectedPrice === "ทั้งหมด" || matchesPriceValue === selectedPrice
            const matchesSubject = selectedSubject === "ทั้งหมด" || item.subject === selectedSubject
            return matchesSearch && matchesCategory && matchesPrice && matchesSubject
        })
    }, [marketSheets, searchQuery, selectedCategory, selectedPrice, selectedSubject])

    // UI States
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [summaryText, setSummaryText] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [timeLeft, setTimeLeft] = useState(0)

    const checkAuth = () => {
        const token = localStorage.getItem("token")
        if (!token) {
            alert("กรุณาเข้าสู่ระบบก่อนนะครับเพื่อน 🌷")
            navigate("/login")
            return false
        }
        return true
    }

    const handleAIGenerate = (item) => {
        if (!checkAuth()) return
        setSelectedItem(item)
        setIsModalOpen(true)
        setIsGenerating(true)
        setSummaryText("")

        const TOTAL_TIME = 200 
        setTimeLeft(TOTAL_TIME)

        // สร้างตัวแปรสำหรับเก็บ timer เพื่อให้ล้างค่าได้จากภายใน promise
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1))
        }, 1000)

        // --- [REAL AI CALL] เรียกสรุปทันที ไม่ต้องรอเวลาจบ ---
        summarizeSheet(item.id)
            .then((result) => {
                clearInterval(timer) // หยุดเวลาทันทีที่ข้อมูลมาถึง!
                const finalSummary = `✨ สรุปโดย APM AI (Backend Mode) ✨\n\nหัวข้อ: ${result.title}\n\n${result.summary}`
                setSummaryText(finalSummary)
                setIsGenerating(false)
            })
            .catch((error) => {
                clearInterval(timer) // หยุดเวลาในกรณี error ด้วย
                console.error("Summarize Error:", error)
                setSummaryText("ขออภัยครับเพื่อน พอดี AI สรุปชีทเล่มนี้ขัดข้องนิดหน่อย ลองใหม่อีกรอบนะ! 🌷")
                setIsGenerating(false)
            })
    }

    // --- SECURITY PROTOCOL (Anti-Screenshot) ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Apply security ONLY if it's a paid sheet AND the user doesn't own/purchase it yet
            const isProtected = selectedItem &&
                selectedItem.price > 0 &&
                !selectedItem.is_mine &&
                !selectedItem.already_purchased;

            if (isProtected) {
                // Detect PrintScreen or Snipping tool shortcuts
                if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && e.key === 's') || (e.ctrlKey && e.key === 'p')) {
                    if (isPdfModalOpen) {
                        e.preventDefault();
                        alert("⚠️ คำเตือน! ห้ามบันทึกภาพหน้าจอสรุปนี้นะครับเพื่อน เพื่อเป็นการให้เกียรติผู้สร้างสรรค์ผลงาน 🌷");
                    }
                }
            }
        };

        const handleBlur = () => {
            const isProtected = selectedItem &&
                selectedItem.price > 0 &&
                !selectedItem.is_mine &&
                !selectedItem.already_purchased;

            if (isPdfModalOpen && isProtected) {
                console.log("Window blurred - Security activated");
            }
        };

        window.addEventListener('keyup', handleKeyDown);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('keyup', handleKeyDown);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('blur', handleBlur);
        };
    }, [isPdfModalOpen, selectedItem]);

    const downloadPDF = () => {
        if (!selectedItem) return
        const doc = new jsPDF()
        doc.text("Summary Report: " + selectedItem.title, 10, 10)
        doc.text(summaryText, 10, 20, { maxWidth: 180 })
        doc.save(`${selectedItem.title}.pdf`)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) setSelectedFile(file)
    }

    const handleUploadSubmit = async () => {
        if (!selectedFile) { alert("กรุณาเลือกไฟล์ PDF ก่อนนะครับ"); return }
        if (!uploadForm.title.trim()) { alert("กรุณาใส่ชื่อชีทด้วยนะครับ"); return }

        setIsLoadingSheets(true)
        try {
            // STEP 1: Extract Text at Client-side (Offload burden from server)
            let extractedText = ""
            try {
                extractedText = await pdfToText(selectedFile)
                console.log("Successfully extracted text on client-side")
            } catch (extractErr) {
                console.warn("Client-side extraction failed, falling back to server:", extractErr)
            }

            // STEP 2: Upload to Backend
            const result = await uploadSheet(
                uploadForm.title,
                uploadForm.price,
                uploadForm.is_public,
                selectedFile,
                extractedText // Send text along with file
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
            console.error("Upload Error:", err)
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

    const [profileImage] = useState(() => {
        const token = localStorage.getItem("token")
        if (!token) return Logo
        const savedAvatar = localStorage.getItem("avatar") || "bro"
        const map = { girl: GirlIcon, nerd: NerdIcon, bro: BroIcon }
        return map[savedAvatar.toLowerCase()] || BroIcon
    })

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background-dark font-display flex flex-col transition-colors duration-300 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="pointer-events-none absolute -top-40 -left-40 size-[500px] rounded-full bg-primary/10 blur-[120px] opacity-60" />
            <div className="pointer-events-none absolute top-1/4 -right-40 size-[500px] rounded-full bg-pink-400/10 blur-[120px] opacity-60" />

            <header className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/60 dark:bg-black/20 backdrop-blur-xl transition-all">
                <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
                        <div className="relative size-12 rounded-2xl bg-white shadow-xl ring-2 ring-pink-100 flex items-center justify-center overflow-hidden">
                            <img src={Logo} alt="Logo" className="size-8 object-contain group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-black text-gray-900 dark:text-white leading-tight">APM AI</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Community Store 🌷</p>
                        </div>
                    </div>
                    <div className="hidden md:flex flex-1 justify-center px-4"><Navbar /></div>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="hidden sm:block">
                            <CoinBadge className="scale-90" />
                        </div>
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
                {/* Header View Options */}
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
                        <button
                            onClick={() => setCurrentView("market")}
                            className={`px-6 md:px-8 py-3.5 rounded-[22px] font-black text-sm whitespace-nowrap transition-all duration-300 ${currentView === 'market' ? 'bg-white dark:bg-primary text-gray-900 dark:text-white shadow-xl scale-[1.05]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                        >
                            Market
                        </button>
                        <button
                            onClick={() => setCurrentView("my-sheets")}
                            className={`px-6 md:px-8 py-3.5 rounded-[22px] font-black text-sm whitespace-nowrap transition-all duration-300 ${currentView === 'my-sheets' ? 'bg-white dark:bg-primary text-gray-900 dark:text-white shadow-xl scale-[1.05]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                        >
                            My Sheets
                        </button>
                        <button
                            onClick={() => setCurrentView("purchased")}
                            className={`px-6 md:px-8 py-3.5 rounded-[22px] font-black text-sm whitespace-nowrap transition-all duration-300 ${currentView === 'purchased' ? 'bg-white dark:bg-primary text-gray-900 dark:text-white shadow-xl scale-[1.05]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                        >
                            Purchased
                        </button>
                    </div>
                </div>

                {currentView === 'market' ? (
                    /* --- Marketplace Section --- */
                    <div className="space-y-8 animate-in fade-in duration-700">
                        {/* Improved Search & Filters Area */}
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

                        {/* Marketplace Grid */}
                        {isLoadingSheets && (
                            <div className="text-center py-8 text-gray-400 font-bold">กำลังโหลดชีทจากตลาด...</div>
                        )}
                        {marketSheets.length > 0 && (
                            <div className="mb-2 px-2 text-[10px] font-black text-primary uppercase tracking-widest">📦 Community Marketplace ({marketSheets.length})</div>
                        )}
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
                            {filteredSummaries.map((item) => (
                                <div key={item.id} className="group relative bg-white dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-[260px] md:h-[420px]">
                                    {/* Preview Top */}
                                    <div
                                        className={`h-24 md:h-40 w-full bg-gray-100 dark:bg-black/40 flex items-center justify-center relative cursor-pointer overflow-hidden`}
                                        onClick={() => {
                                            if (checkAuth()) {
                                                const pdfUrl = formatDocUrl(item.file_path);
                                                setSelectedItem({ ...item, pdfUrl });
                                                setIsPdfModalOpen(true);
                                            }
                                        }}
                                    >
                                        {item.file_path ? (
                                            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-center justify-center p-2 bg-gray-50/50">
                                                <Document
                                                    file={formatDocUrl(item.file_path)}
                                                    loading={<div className="size-4 border-2 border-primary/40 border-t-transparent rounded-full animate-spin" />}
                                                >
                                                    <Page 
                                                        pageNumber={1} 
                                                        renderTextLayer={false} 
                                                        renderAnnotationLayer={false}
                                                        scale={0.5} 
                                                        width={300}
                                                        className="shadow-md rounded-md overflow-hidden"
                                                    />
                                                </Document>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors duration-500" />
                                                <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-xl border border-white/40 text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 relative z-10">
                                                    {(() => {
                                                        const IconComponent = ICON_MAP[item.iconName] || FileText;
                                                        return <IconComponent size={24} className="md:size-32" />;
                                                    })()}
                                                </div>
                                            </>
                                        )}
                                        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 text-[6px] md:text-[8px] font-black uppercase tracking-widest z-10">{item.views} V</div>
                                    </div>

                                    {/* Content Bottom */}
                                    <div className="flex-1 p-2.5 md:p-6 flex flex-col relative bg-white dark:bg-gray-900/40 min-w-0">
                                        <div className="flex justify-between items-start mb-1.5 md:mb-3">
                                            <span className="text-[6px] md:text-[8px] font-black px-1.5 py-0.5 rounded bg-primary/5 text-primary uppercase truncate max-w-[50px] md:max-w-none">{item.category}</span>
                                            <div className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-[7px] md:text-[10px] uppercase">{item.price === 0 ? 'FREE' : item.price}</div>
                                        </div>

                                        <h3 className="text-[10px] md:text-base font-black text-gray-900 dark:text-white line-clamp-2 leading-tight mb-0.5 md:mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="hidden md:block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-4">{item.subject}</p>

                                        <div className="mt-auto grid grid-cols-1 gap-1.5">
                                            <button
                                                onClick={() => handleCollectSheet(item)}
                                                disabled={item.already_purchased || item.is_mine || (item.price === 0 && false)}
                                                className={`w-full py-1.5 md:py-3 rounded-lg md:rounded-xl font-black shadow-md flex items-center justify-center gap-1.5 transition-all text-[8px] md:text-[11px] uppercase tracking-tighter ${(item.already_purchased || item.is_mine)
                                                    ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-indigo-600 to-primary text-white active:scale-95'
                                                    }`}
                                            >
                                                {item.is_mine ? 'MY SHEET' : (item.already_purchased || item.price === 0) ? 'OWNED' : 'GET'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredSummaries.length === 0 && (
                            <div className="py-24 text-center">
                                <div className="size-24 bg-gray-100 dark:bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-6 text-gray-400 border border-white/10 shadow-inner"><Search size={40} /></div>
                                <h3 className="text-2xl font-black text-gray-400">ไม่พบสรุปที่ค้นหาเลยเพื่อน... 🌷</h3>
                                <p className="font-bold text-gray-400/60 mt-2">ลองพิมพ์ keyword อื่นดูนะ! ✨</p>
                            </div>
                        )}
                    </div>
                ) : currentView === "my-sheets" ? (
                    /* --- My Collection Section --- */
                    <div className="space-y-8 animate-in fade-in duration-700">
                        {/* User Performance Stats */}
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
                                        {item.file_path ? (
                                            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-center justify-center p-2 bg-gray-50/50">
                                                <Document
                                                    file={formatDocUrl(item.file_path)}
                                                    loading={<div className="size-4 border-2 border-primary/40 border-t-transparent rounded-full animate-spin" />}
                                                >
                                                    <Page 
                                                        pageNumber={1} 
                                                        renderTextLayer={false} 
                                                        renderAnnotationLayer={false}
                                                        scale={0.6} 
                                                        width={200}
                                                        className="shadow-md rounded-md overflow-hidden"
                                                    />
                                                </Document>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="p-3 rounded-xl bg-white/20 border border-white/40 backdrop-blur-xl text-white shadow-2xl group-hover:rotate-12 transition-transform">
                                                    {(() => {
                                                        const IconComponent = ICON_MAP[item.iconName] || FileText;
                                                        return <IconComponent size={24} />;
                                                    })()}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex-1 p-4 md:p-8 flex flex-col min-w-0">
                                        <div className="flex justify-between items-start mb-1 md:mb-2">
                                            <span className="text-[8px] md:text-[10px] font-black px-1.5 py-0.5 rounded bg-gray-100 dark:bg-black/40 text-gray-500 dark:text-gray-400 uppercase tracking-widest truncate max-w-[60px] md:max-w-none">{item.category}</span>
                                            <button
                                                onClick={async () => {
                                                    if (confirm('ต้องการลบใช่ไหมครับ?')) {
                                                        try {
                                                            await deleteSheet(item.id)
                                                            await loadSheets()
                                                        } catch (err) { }
                                                    }
                                                }}
                                                className="size-7 md:size-9 rounded-lg md:rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <HiOutlineX size={14} />
                                            </button>
                                        </div>
                                        <h3 className="text-[11px] md:text-xl font-black text-gray-900 dark:text-white line-clamp-2 leading-tight mb-2 md:mb-4">{item.title}</h3>
                                        <div className="mt-auto border-t border-gray-100 dark:border-white/5 pt-3 md:pt-5 space-y-2 md:space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[7px] md:text-[9px] font-black text-gray-400 uppercase mb-0.5">Price</span>
                                                    <span className="text-[10px] md:text-lg font-black text-emerald-500">{item.price ?? 0} 🪙</span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const pdfUrl = formatDocUrl(item.file_path);
                                                        setSelectedItem({ ...item, pdfUrl });
                                                        setIsPdfModalOpen(true);
                                                    }}
                                                    className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-[8px] md:text-xs"
                                                >
                                                    READ
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* --- Purchased Sheets Section --- */
                    <div className="space-y-12 animate-in fade-in duration-700">
                        <div className="mb-4 px-2 text-sm font-black text-primary">🛍️ ชีทที่ซื้อมา ({purchasedSheets.length} รายการ)</div>
                        {isLoadingSheets && (
                            <div className="text-center py-8 text-gray-400 font-bold">กำลังโหลด...</div>
                        )}
                        {!isLoadingSheets && purchasedSheets.length === 0 && (
                            <div className="py-24 text-center">
                                <div className="size-24 bg-gray-100 dark:bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-6 text-gray-400 border border-white/10 shadow-inner">
                                    <BookText size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-400">ยังไม่มีชีทที่ซื้อมาเลยเพื่อน 🌷</h3>
                                <p className="font-bold text-gray-400/60 mt-2">ลองไปเลือกชีทใน Marketplace ดูนะ ✨</p>
                                <button
                                    onClick={() => setCurrentView("market")}
                                    className="mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-primary text-white font-black shadow-lg hover:scale-105 transition-all"
                                >
                                    ไปที่ Marketplace
                                </button>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {purchasedSheets.map((item) => (
                                <div key={item.id} className="group h-[280px] bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-white/10 rounded-[48px] overflow-hidden flex shadow-xl hover:-translate-y-2 transition-all duration-500">
                                    <div className={`w-1/3 bg-gradient-to-br ${item.gradient || 'from-indigo-500 to-purple-600'} flex items-center justify-center relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="p-4 rounded-2xl bg-white/20 border border-white/40 backdrop-blur-xl text-white shadow-2xl group-hover:rotate-12 transition-transform">
                                            <FileText size={32} />
                                        </div>
                                    </div>
                                    <div className="flex-1 p-8 flex flex-col justify-between">
                                        <div>
                                            <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 uppercase tracking-widest border border-purple-200 dark:border-purple-500/20">ซื้อแล้ว ✓</span>
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white line-clamp-2 leading-tight mt-3 group-hover:text-primary transition-colors">{item.title}</h3>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-4">
                                            <span className="text-sm font-black text-gray-400">{item.price ?? 0} 🪙</span>
                                            <button
                                                onClick={() => {
                                                    const pdfUrl = formatDocUrl(item.file_path);
                                                    setSelectedItem({ ...item, pdfUrl });
                                                    setIsPdfModalOpen(true);
                                                }}
                                                className="px-5 py-2.5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-xs hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                                            >
                                                เปิดอ่านชีท
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Modals are kept the same but ensured they fit the new tone */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-900 rounded-[48px] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
                        <div className="p-8 flex items-center justify-between border-b dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <HiOutlineSparkles size={24} />
                                </div>
                                <h3 className="text-2xl font-black dark:text-white">APM AI Assistant ✨</h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="size-10 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400 hover:rotate-90 hover:bg-red-50 hover:text-red-500 transition-all"><HiOutlineX size={24} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-10 dark:text-gray-200 whitespace-pre-wrap text-lg leading-relaxed antialiased">
                            {isGenerating ? (
                                <div className="flex flex-col items-center justify-center h-full py-12 space-y-8">
                                    <div className="relative size-32 md:size-40">
                                        {/* Background Ring */}
                                        <svg className="size-full -rotate-90">
                                            <circle cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100 dark:text-white/5" />
                                            {/* Progress Ring */}
                                            <circle
                                                cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth="8"
                                                strokeDasharray="283"
                                                strokeDashoffset={283 - (283 * (200 - timeLeft)) / 200}
                                                className="text-primary transition-all duration-1000"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl md:text-4xl font-black text-primary">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Analyzing</span>
                                        </div>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="font-black text-xl md:text-2xl animate-pulse text-gray-900 dark:text-white">กำลังติวเข้มให้เพื่อนอยู่... 🧠✨</p>
                                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">กรุณารอสักครู่ AI กำลังอ่านชีทเล่มนี้อย่างละเอียดน้าา</p>
                                    </div>
                                    <div className="w-full max-w-xs h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-1000"
                                            style={{ width: `${((200 - timeLeft) / 200) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ) : summaryText}
                        </div>
                        <div className="p-8 bg-gray-50 dark:bg-white/5 flex gap-4">
                            <button onClick={downloadPDF} className="flex-1 py-5 rounded-[28px] bg-primary text-white font-black text-lg shadow-xl shadow-primary/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3">
                                <HiOutlineDownload size={24} /> ดาวน์โหลดสรุป PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isPdfModalOpen && selectedItem && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-900 rounded-[48px] w-full max-w-6xl h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300 relative">
                        <div className="p-6 flex items-center justify-between border-b dark:border-white/10 bg-white/50 dark:bg-black/40 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className={`size-12 rounded-2xl bg-gradient-to-br ${selectedItem.gradient} flex items-center justify-center text-white shadow-xl ring-2 ring-white/20`}>
                                    {(() => {
                                        const IconComponent = ICON_MAP[selectedItem.iconName] || FileText;
                                        return <IconComponent size={24} />;
                                    })()}
                                </div>
                                <div><h3 className="text-xl font-black dark:text-white leading-tight">{selectedItem.title}</h3><p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{selectedItem.subject}</p></div>
                            </div>
                            <button onClick={() => setIsPdfModalOpen(false)} className="size-12 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"><HiOutlineX size={28} /></button>
                        </div>
                        <div className={`flex-1 overflow-hidden relative select-none print:hidden`}
                            onMouseLeave={(e) => {
                                const isProtected = selectedItem?.price > 0 && !selectedItem?.is_mine && !selectedItem?.already_purchased;
                                if (isProtected) {
                                    const overlay = e.currentTarget.querySelector('.security-overlay');
                                    if (overlay) overlay.classList.remove('hidden');
                                }
                            }}
                            onMouseEnter={(e) => {
                                const overlay = e.currentTarget.querySelector('.security-overlay');
                                if (overlay) overlay.classList.add('hidden');
                            }}>
                            {/* Watermark Overlay - Only for Paid & Unpurchased */}
                            {selectedItem?.price > 0 && !selectedItem?.is_mine && !selectedItem?.already_purchased && (
                                <div className="absolute inset-0 z-20 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-[0.08] select-none uppercase font-black text-gray-500 text-4xl overflow-hidden rotate-[-15deg] scale-125">
                                    {[...Array(9)].map((_, i) => (
                                        <div key={i} className="flex items-center justify-center whitespace-nowrap">APM AI SECURITY</div>
                                    ))}
                                </div>
                            )}

                            {/* Blackout Overlay on switch - Only for Paid & Unpurchased */}
                            {selectedItem?.price > 0 && !selectedItem?.is_mine && !selectedItem?.already_purchased && (
                                <div className="security-overlay hidden absolute inset-0 z-30 bg-black flex flex-col items-center justify-center text-white text-center gap-4 transition-all">
                                    <div className="p-5 rounded-full bg-red-500/20 text-red-500"><HiOutlineEye size={48} /></div>
                                    <h4 className="text-xl font-black">Content Hidden for Security</h4>
                                    <p className="text-xs text-gray-400">ขยับเมาส์กลับเข้ามาดูสรุปต่อนะครับเพื่อน 🌷</p>
                                </div>
                            )}

                            {/* Google Docs Viewer → แก้ปัญหา Supabase X-Frame-Options + สีถูกต้องทุกกรณี */}
                            <iframe
                                src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedItem.pdfUrl)}&embedded=true`}
                                className={`w-full h-full border-none ${(selectedItem?.price > 0 && !selectedItem?.is_mine && !selectedItem?.already_purchased) ? 'pointer-events-none' : ''}`}
                                title="PDF Viewer"
                                allow="autoplay"
                            />
                        </div>
                        <div className="p-6 bg-white dark:bg-gray-900 border-t dark:border-white/10 flex justify-between items-center px-10">
                            <div className="flex flex-col"><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{selectedItem.category}</span><span className="text-emerald-500 font-black text-sm tracking-tighter">FREE DOCUMENT</span></div>
                            <div className="flex gap-4">
                                <button onClick={() => handleAIGenerate(selectedItem)} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-sm flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-pink-500/20"><HiOutlineSparkles size={20} /> AI สรุปให้</button>
                                <button
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = selectedItem.pdfUrl;
                                        link.download = `${selectedItem.title}.pdf`;
                                        link.click();
                                    }}
                                    disabled={!selectedItem.already_purchased && !selectedItem.is_mine && selectedItem.price > 0}
                                    className={`px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 transition-all shadow-xl ${(selectedItem.already_purchased || selectedItem.is_mine || selectedItem.price === 0)
                                        ? 'bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/20 cursor-pointer'
                                        : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed opacity-50'
                                        }`}
                                >
                                    <HiOutlineDownload size={20} />
                                    {(selectedItem.already_purchased || selectedItem.is_mine || selectedItem.price === 0) ? 'DOWNLOAD' : 'ซื้อเพื่อดาวน์โหลด'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isUploadModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-[48px] w-full max-w-xl max-h-[92vh] overflow-y-auto p-10 relative border border-white dark:border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300 custom-scrollbar">

                        {/* Modal Header */}
                        <div className="flex items-center gap-5 mb-10">
                            <div className="size-16 rounded-[24px] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                                <FileText size={36} className="drop-shadow-md" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">แชร์สรุปใหม่ ✨</h3>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Community Knowledge Base</p>
                            </div>
                            <button
                                onClick={() => setIsUploadModalOpen(false)}
                                className="ml-auto size-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-all active:scale-90"
                            >
                                <HiOutlineX size={28} />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Input Group: Title */}
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">ชื่อชีทสรุปที่เพื่อนๆ จะชอบ</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                        <BookText size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="เช่น สรุป Midterm Physics 1 สุดปัง..."
                                        className="w-full pl-14 pr-6 py-5 rounded-[22px] bg-gray-50/50 dark:bg-white/5 outline-none dark:text-white border border-gray-100 dark:border-white/5 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg placeholder:text-gray-300 shadow-inner"
                                        value={uploadForm.title}
                                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Input Group: Price & Visibility */}
                            <div className="grid grid-cols-2 gap-5 items-center">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">ราคา (ถ้าจะขาย)</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500">
                                            <Coins size={20} />
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            className="w-full pl-14 pr-6 py-5 rounded-[22px] bg-gray-50/50 dark:bg-white/5 outline-none dark:text-white border border-gray-100 dark:border-white/5 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-black text-xl shadow-inner"
                                            value={uploadForm.price}
                                            onChange={(e) => setUploadForm({ ...uploadForm, price: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">ความเป็นส่วนตัว</label>
                                    <div className="grid grid-cols-2 gap-3 p-1.5 rounded-[22px] bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-inner">
                                        <button
                                            type="button"
                                            onClick={() => setUploadForm({ ...uploadForm, is_public: false })}
                                            className={`flex-1 py-4 rounded-[18px] flex flex-col items-center justify-center gap-1.5 transition-all ${!uploadForm.is_public ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                                        >
                                            <div className={`size-8 rounded-xl flex items-center justify-center ${!uploadForm.is_public ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-bold' : 'text-inherit'}`}>
                                                <Lock />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-widest">Private</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUploadForm({ ...uploadForm, is_public: true })}
                                            className={`flex-1 py-4 rounded-[18px] flex flex-col items-center justify-center gap-1.5 transition-all ${uploadForm.is_public ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                                        >
                                            <div className={`size-8 rounded-xl flex items-center justify-center ${uploadForm.is_public ? 'bg-white/20 text-white font-bold' : 'text-inherit'}`}>
                                                <Unlock />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-widest">Public</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Dropzone */}
                            <label className={`block w-full cursor-pointer py-12 border-4 border-dashed rounded-[40px] text-center transition-all group relative overflow-hidden ${selectedFile ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-500/5 dark:border-emerald-500/20' : 'bg-gray-50/50 border-gray-100 dark:bg-white/5 dark:border-white/5 hover:bg-primary/5 hover:border-primary/20'}`}>
                                <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                                <div className={`size-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500 shadow-inner ${selectedFile ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600' : 'bg-white dark:bg-white/10 text-gray-300 group-hover:scale-110 group-hover:rotate-6 group-hover:text-primary'}`}>
                                    <Upload size={36} />
                                </div>
                                <span className={`font-black block text-lg transition-colors ${selectedFile ? 'text-emerald-600' : 'text-gray-400 group-hover:text-primary'}`}>
                                    {selectedFile ? selectedFile.name : "เลือกไฟล์สรุป PDF"}
                                </span>
                                <p className="text-[10px] font-black text-gray-300 mt-1 uppercase tracking-[0.2em] px-10">ขนาดไม่เกิน 20MB นะครับเพื่อน</p>

                                {selectedFile && (
                                    <div className="absolute top-4 right-6 text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                                        <div className="size-1.5 rounded-full bg-emerald-500" />
                                        FILE SELECTED
                                    </div>
                                )}
                            </label>

                            {/* Submit Button */}
                            <button
                                onClick={handleUploadSubmit}
                                disabled={isLoadingSheets}
                                className="w-full py-6 rounded-[28px] bg-gradient-to-r from-primary via-indigo-600 to-primary bg-[length:200%_auto] text-white font-black text-xl shadow-2xl shadow-primary/30 hover:bg-right active:scale-[0.98] transition-all duration-500 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 group"
                            >
                                {isLoadingSheets ? (
                                    <div className="size-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        อัปโหลดชีทเลยครับเพื่อน ✨
                                        <HiOutlineSparkles size={24} className="group-hover:rotate-12 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default Summaries