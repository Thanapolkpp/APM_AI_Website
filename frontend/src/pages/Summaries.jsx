import React, { useState, useMemo, useEffect, useCallback } from "react"
import { HiOutlineDownload, HiOutlineEye, HiOutlineSparkles, HiOutlineX } from "react-icons/hi"
import { BookText, FileText, Code2, Calculator, Atom, Palette, PlusCircle, Search, Filter, Upload, Coins } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Layout/Navbar"
import Footer from "../components/Layout/footer"
import CoinBadge from "../components/UI/CoinBadge"
import Logo from "../assets/logo.png"
import BroIcon from "../assets/Bro.png"
import NerdIcon from "../assets/Nerd.1.2.png"
import CuteGirlIcon from "../assets/Girl.png"
import { jsPDF } from "jspdf"
import { fetchMySheets, fetchMarketSheets, uploadSheet, buySheet, fetchPurchasedSheets, toggleSheetPublish, updateSheetPrice } from "../services/aiService"

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

// 1. Marketplace Data defined as a constant to avoid identity issues in state
const SUMMARIES_DATA = [
    {
        id: 1,
        title: "สรุป Computer Architecture (Midterm)",
        subject: "Computer Engineering",
        category: "สรุปสอบ",
        price: "Free",
        rating: 4.9,
        views: "1.2k",
        iconName: "Code2",
        gradient: "from-blue-500 to-indigo-600",
        fullContent: "หน่วยประมวลผลกลาง (CPU) ประกอบด้วย Register, ALU และ Control Unit...",
        pdfUrl: "https://pdfobject.com/pdf/sample.pdf"
    },
    {
        id: 2,
        title: "สรุปสูตรฟิสิกส์ 1 ครบทุกบท",
        subject: "Science",
        category: "บทเรียน",
        price: "Free",
        rating: 4.7,
        views: "850",
        iconName: "Atom",
        gradient: "from-rose-500 to-pink-600",
        fullContent: "กฎของนิวตัน: F=ma...",
        pdfUrl: "https://pdfobject.com/pdf/sample.pdf"
    },
    {
        id: 5,
        title: "Advanced Algorithm Design",
        subject: "Computer Engineering",
        category: "บทเรียน",
        price: "Paid",
        rating: 4.9,
        views: "3.2k",
        iconName: "Code2",
        gradient: "from-orange-500 to-red-600",
        fullContent: "Dynamic Programming, Greedy Algorithms...",
        pdfUrl: "https://pdfobject.com/pdf/sample.pdf"
    }
]

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
        return SUMMARIES_DATA.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === "ทั้งหมด" || item.category === selectedCategory
            const matchesPrice = selectedPrice === "ทั้งหมด" || item.price === selectedPrice
            const matchesSubject = selectedSubject === "ทั้งหมด" || item.subject === selectedSubject
            return matchesSearch && matchesCategory && matchesPrice && matchesSubject
        })
    }, [searchQuery, selectedCategory, selectedPrice, selectedSubject])

    // UI States
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [summaryText, setSummaryText] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)

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

        setTimeout(() => {
            const aiSummary = `✨ สรุปโดย APM AI ✨\n\nหัวข้อ: ${item.title}\n[ประเด็นสำคัญ]\n1. สรุปเนื้อหาเน้นทฤษฎีพื้นฐาน\n2. สูตรและจุดที่ควรระวังในข้อสอบ\n\n${item.fullContent}`
            setSummaryText(aiSummary)
            setIsGenerating(false)
        }, 1500)
    }

    const downloadPDF = () => {
        if (!selectedItem) return
        const doc = new jsPDF()
        doc.text("Summary Report: " + selectedItem.title, 10, 10)
        doc.text(summaryText, 10, 20, { maxWidth: 180 })
        doc.save(`${selectedItem.title}.pdf`)
    }

    const handleAddMySheet = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        if (!uploadForm.title.trim()) { alert("กรุณาใส่ชื่อชีทด้วยนะครับ"); return }
        try {
            await uploadSheet(uploadForm.title, uploadForm.price, uploadForm.is_public, file)
            await loadSheets()
            setIsUploadModalOpen(false)
            setUploadForm({ title: "", price: 0, is_public: false })
            alert("เย้! ชีทของคุณขึ้นระบบแล้วครับ ✨")
        } catch {
            alert("อัปโหลดไม่สำเร็จ กรุณาลองใหม่")
        }
    }

    const handleCollectSheet = async (item) => {
        if (!checkAuth()) return
        try {
            await buySheet(item.id)
            await loadSheets()
            alert(`เย้! ซื้อสรุป "${item.title}" สำเร็จแล้วครับ 🌷`)
        } catch (err) {
            alert(err?.response?.data?.detail || "ซื้อไม่สำเร็จ กรุณาลองใหม่")
        }

        const nextMySummaries = [item, ...mySummaries]
        setMySummaries(nextMySummaries)
        localStorage.setItem("my_summaries", JSON.stringify(nextMySummaries))
        alert(`เย้! เพิ่มสรุป "${item.title}" เข้าคลังแล้วครับ 🌷`)
    }

    const [profileImage] = useState(() => {
        const token = localStorage.getItem("token")
        if (!token) return Logo
        const savedAvatar = localStorage.getItem("avatar") || "bro"
        const map = { girl: CuteGirlIcon, nerd: NerdIcon, bro: BroIcon }
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
                        <div className="relative size-10 rounded-xl bg-white shadow-xl ring-2 ring-pink-100 overflow-hidden">
                            <img src={Logo} alt="Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-gray-900 dark:text-white leading-tight">APM AI</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">คลังสรุปสุดชิค 🌷</p>
                        </div>
                    </div>
                    <div className="hidden lg:flex flex-1 justify-center"><Navbar /></div>
                    <div className="flex items-center gap-4">
                        <CoinBadge className="scale-90" />
                        <div
                            className="size-10 rounded-2xl border-2 border-white dark:border-white/10 cursor-pointer bg-white bg-cover bg-center shadow-lg hover:scale-110 transition-all"
                            style={{ backgroundImage: `url("${profileImage}")` }}
                            onClick={() => navigate("/account")}
                        />
                        <div className="lg:hidden"><Navbar /></div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto py-12 px-6 relative z-10">
                {/* Header View Options */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                    <div className="space-y-2 text-center md:text-left transition-all">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                            {currentView === 'market' ? 'Community Store 🍦' : currentView === 'my-sheets' ? 'Private Collection ✨' : 'Purchased 🛍️'}
                        </span>
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                            {currentView === 'market' ? 'คลังสรุป 🌷' : currentView === 'my-sheets' ? 'ชีทของฉัน ✨' : 'ที่ซื้อมา 🛍️'}
                        </h2>
                    </div>

                    <div className="flex bg-gray-100 dark:bg-white/5 p-1.5 rounded-[24px] border border-gray-200 dark:border-white/10 shadow-inner">
                        <button
                            onClick={() => setCurrentView("market")}
                            className={`px-8 py-3 rounded-[20px] font-black text-sm transition-all duration-300 ${currentView === 'market' ? 'bg-white dark:bg-primary text-gray-900 dark:text-white shadow-xl scale-[1.02]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                        >
                            Marketplace
                        </button>
                        <button
                            onClick={() => setCurrentView("my-sheets")}
                            className={`px-8 py-3 rounded-[20px] font-black text-sm transition-all duration-300 ${currentView === 'my-sheets' ? 'bg-white dark:bg-primary text-gray-900 dark:text-white shadow-xl scale-[1.02]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                        >
                            ชีทของฉัน
                        </button>
                        <button
                            onClick={() => setCurrentView("purchased")}
                            className={`px-8 py-3 rounded-[20px] font-black text-sm transition-all duration-300 ${currentView === 'purchased' ? 'bg-white dark:bg-primary text-gray-900 dark:text-white shadow-xl scale-[1.02]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                        >
                            ที่ซื้อมา
                        </button>
                    </div>
                </div>

                {currentView === 'market' ? (
                    /* --- Marketplace Section --- */
                    <div className="space-y-12 animate-in fade-in duration-700">
                        {/* Improved Search & Filters Area */}
                        <div className="space-y-8 bg-white/40 dark:bg-white/5 p-8 rounded-[40px] border border-white/60 shadow-sm backdrop-blur-md">
                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={24} />
                                <input
                                    type="text"
                                    placeholder="ค้นหาชีทสรุปที่ต้องการ..."
                                    className="w-full pl-16 pr-8 py-5 rounded-[24px] bg-white border border-gray-100 dark:bg-black/20 dark:border-white/10 outline-none font-bold text-lg dark:text-white focus:ring-4 focus:ring-primary/10 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2 px-1.5 py-1.5 rounded-2xl bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-white/5">
                                    <div className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:block">วิชา:</div>
                                    {subjects.map(s => (
                                        <button key={s} onClick={() => setSelectedSubject(s)} className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${selectedSubject === s ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}>{s}</button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 px-1.5 py-1.5 rounded-2xl bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-white/5">
                                    <div className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden lg:block">ประเภท:</div>
                                    {categories.map(c => (
                                        <button key={c} onClick={() => setSelectedCategory(c)} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${selectedCategory === c ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}>{c}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Marketplace Grid */}
                        {isLoadingSheets && (
                            <div className="text-center py-8 text-gray-400 font-bold">กำลังโหลดชีทจากตลาด...</div>
                        )}
                        {marketSheets.length > 0 && (
                            <div className="mb-4 px-2 text-sm font-black text-primary">📦 ชีทจาก Community ({marketSheets.length} รายการ)</div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredSummaries.map((item) => (
                                <div key={item.id} className="group relative bg-white dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-[480px]">
                                    {/* Preview Top */}
                                    <div
                                        className={`h-48 w-full bg-gradient-to-br ${item.gradient} flex items-center justify-center relative cursor-pointer overflow-hidden`}
                                        onClick={() => { if (checkAuth()) { setSelectedItem(item); setIsPdfModalOpen(true); } }}
                                    >
                                        <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors duration-500" />
                                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 text-[10px] font-black uppercase tracking-widest z-10">{item.views} VIEWS</div>

                                        <div className="p-6 rounded-[32px] bg-white/20 backdrop-blur-xl border border-white/40 text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 relative z-10">
                                            {(() => {
                                                const IconComponent = ICON_MAP[item.iconName] || FileText;
                                                return <IconComponent size={48} />;
                                            })()}
                                        </div>
                                    </div>

                                    {/* Content Bottom */}
                                    <div className="flex-1 p-8 flex flex-col relative bg-white dark:bg-gray-900/40">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-black px-2.5 py-1 rounded-lg border border-primary/20 bg-primary/5 text-primary uppercase tracking-tighter shadow-sm">{item.category}</span>
                                            <div className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-widest">{item.price}</div>
                                        </div>

                                        <h3 className="text-xl font-black text-gray-900 dark:text-white line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-6">{item.subject}</p>

                                        <div className="mt-auto grid grid-cols-1 gap-3">
                                            <button
                                                onClick={() => handleAIGenerate(item)}
                                                className="w-full py-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-black text-xs flex items-center justify-center gap-2 hover:bg-primary/10 hover:text-primary transition-all border border-gray-100 dark:border-white/5 active:scale-95"
                                            >
                                                <HiOutlineSparkles size={16} /> AI สรุปบทเรียน
                                            </button>
                                            <button
                                                onClick={() => handleCollectSheet(item)}
                                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-primary text-white font-black shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 hover:scale-[1.02] hover:brightness-110 active:scale-95 transition-all text-sm uppercase tracking-tighter"
                                            >
                                                รับชีทนี้
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
                    <div className="space-y-12 animate-in fade-in duration-700">
                        {/* User Performance Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { label: "ชีทสรุปทั้งหมด", value: mySummaries.length, icon: BookText, color: "bg-blue-600" },
                                { label: "ยอดดาวน์โหลด", value: "0", icon: HiOutlineDownload, color: "bg-purple-600" },
                                { label: "เหรียญสะสม", value: "0", icon: Coins, color: "bg-amber-500" }
                            ].map((stat, i) => (
                                <div key={i} className="p-8 rounded-[40px] bg-white border border-gray-100 dark:bg-white/5 dark:border-white/10 flex items-center gap-6 shadow-sm hover:shadow-xl transition-all group">
                                    <div className={`size-16 rounded-[24px] ${stat.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform`}>
                                        {React.createElement(stat.icon, { size: 28 })}
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                                        <p className="text-4xl font-black text-gray-900 dark:text-white leading-tight">{stat.value}</p>
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
                                <div key={item.id} className="group h-[320px] bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-white/10 rounded-[48px] overflow-hidden flex shadow-xl hover:-translate-y-2 transition-all duration-500">
                                    <div className={`w-1/3 bg-gradient-to-br ${item.gradient} flex items-center justify-center relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="p-4 rounded-2xl bg-white/20 border border-white/40 backdrop-blur-xl text-white shadow-2xl group-hover:rotate-12 transition-transform">
                                            {(() => {
                                                const IconComponent = ICON_MAP[item.iconName] || FileText;
                                                return <IconComponent size={32} />;
                                            })()}
                                        </div>
                                    </div>
                                    <div className="flex-1 p-8 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-black/40 text-gray-500 dark:text-gray-400 uppercase tracking-widest border border-gray-200 dark:border-white/5">{item.category}</span>
                                            <button
                                                onClick={() => {
                                                    if (confirm('ต้องการลบชีทสรุปนี้ใช่ไหมครับเพื่อน? 🌷')) {
                                                        const fresh = mySummaries.filter(s => s.id !== item.id);
                                                        setMySummaries(fresh);
                                                        localStorage.setItem('my_summaries', JSON.stringify(fresh));
                                                    }
                                                }}
                                                className="size-9 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white shadow-sm transition-all active:scale-90"
                                            >
                                                <HiOutlineX size={18} />
                                            </button>
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white line-clamp-2 leading-tight mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
                                        <div className="mt-auto border-t border-gray-100 dark:border-white/5 pt-5 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="block text-[9px] font-black text-gray-400 uppercase mb-0.5">Price</span>
                                                    {editingPriceId === item.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={editingPriceValue}
                                                                onChange={(e) => setEditingPriceValue(Number(e.target.value))}
                                                                className="w-16 px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/10 text-sm font-black outline-none border border-primary/30"
                                                            />
                                                            <button
                                                                onClick={() => handleUpdatePrice(item.id)}
                                                                className="px-2 py-1 rounded-lg bg-primary text-white font-black text-[10px]"
                                                            >
                                                                ✓
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingPriceId(null)}
                                                                className="px-2 py-1 rounded-lg bg-gray-200 dark:bg-white/10 font-black text-[10px]"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => { setEditingPriceId(item.id); setEditingPriceValue(item.price ?? 0); }}
                                                            className="text-lg font-black text-emerald-500 hover:underline"
                                                        >
                                                            {item.price ?? 0} 🪙
                                                        </button>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => { setSelectedItem(item); setIsPdfModalOpen(true); }}
                                                    className="px-4 py-2 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-xs hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                                                >
                                                    เปิดอ่าน
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleTogglePublish(item.id)}
                                                className={`w-full py-2 rounded-xl font-black text-xs transition-all ${item.is_public ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-500' : 'bg-gray-100 dark:bg-white/5 text-gray-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:text-emerald-600'}`}
                                            >
                                                {item.is_public ? '🟢 ขายอยู่ — กดเพื่อหยุดขาย' : '⚪ ไม่ได้ขาย — กดเพื่อวางขาย'}
                                            </button>
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
                                                onClick={() => { setSelectedItem({ ...item, pdfUrl: item.file_path || "" }); setIsPdfModalOpen(true); }}
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
                                <div className="flex flex-col items-center justify-center h-full py-12 space-y-6">
                                    <div className="relative">
                                        <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center text-primary text-xs font-black">AI</div>
                                    </div>
                                    <p className="font-black text-xl animate-pulse">กำลังติวเข้มให้เพื่อนอยู่... 🧠✨</p>
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
                        <div className="flex-1 bg-gray-100 dark:bg-black/60 overflow-hidden">
                            <iframe src={selectedItem.pdfUrl} className="w-full h-full border-none" title="PDF Viewer" />
                        </div>
                        <div className="p-6 bg-white dark:bg-gray-900 border-t dark:border-white/10 flex justify-between items-center px-10">
                            <div className="flex flex-col"><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{selectedItem.category}</span><span className="text-emerald-500 font-black text-sm tracking-tighter">FREE DOCUMENT</span></div>
                            <div className="flex gap-4">
                                <button onClick={() => handleAIGenerate(selectedItem)} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-sm flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-pink-500/20"><HiOutlineSparkles size={20} /> AI สรุปให้</button>
                                <button onClick={() => { const link = document.createElement('a'); link.href = selectedItem.pdfUrl; link.download = `${selectedItem.title}.pdf`; link.click(); }} className="px-8 py-4 rounded-2xl bg-primary text-white font-black text-sm flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"><HiOutlineDownload size={20} /> DOWNLOAD</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isUploadModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-900 rounded-[48px] w-full max-w-lg p-10 relative border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="size-14 rounded-[20px] bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 shadow-inner">
                                <FileText size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black dark:text-white">แชร์สรุปใหม่ 🪙</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">ร่วมกันสร้างคลังความรู้</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">ชื่อชีทสรุป</label>
                                <input type="text" placeholder="สรุป Midterm Physics 1..." className="w-full p-5 rounded-[20px] bg-gray-50/50 dark:bg-white/5 outline-none dark:text-white border border-gray-100 dark:border-white/10 focus:border-primary transition-all font-bold text-lg" value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">วิชา</label>
                                    <select className="w-full p-5 rounded-[20px] bg-gray-50/50 dark:bg-white/5 dark:text-white font-bold outline-none border border-gray-100 dark:border-white/10 appearance-none" onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}>{subjects.filter(s => s !== "ทั้งหมด").map(s => <option key={s} value={s}>{s}</option>)}</select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">ประเภท</label>
                                    <select className="w-full p-5 rounded-[20px] bg-gray-50/50 dark:bg-white/5 dark:text-white font-bold outline-none border border-gray-100 dark:border-white/10 appearance-none" onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}>{categories.filter(c => c !== "ทั้งหมด").map(c => <option key={c} value={c}>{c}</option>)}</select>
                                </div>
                            </div>
                            <label className="block w-full cursor-pointer py-12 border-4 border-dashed border-gray-100 dark:border-white/5 rounded-[40px] text-center hover:bg-primary/5 hover:border-primary/20 transition-all group relative overflow-hidden">
                                <input type="file" accept="application/pdf" className="hidden" onChange={handleAddMySheet} />
                                <div className="size-20 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                                    <Upload size={36} className="text-gray-300 group-hover:text-primary transition-colors" />
                                </div>
                                <span className="font-black text-gray-400 group-hover:text-primary transition-colors block text-lg">เลือกไฟล์ PDF</span>
                                <p className="text-[10px] font-black text-gray-300 mt-1 uppercase tracking-widest px-10">ขนาดไม่เกิน 20MB</p>
                            </label>
                        </div>
                        <button onClick={() => setIsUploadModalOpen(false)} className="absolute top-8 right-8 size-10 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"><HiOutlineX size={24} /></button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default Summaries