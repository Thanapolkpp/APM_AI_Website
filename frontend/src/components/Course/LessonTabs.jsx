import { useState } from "react"
import { BookOpenText, CalendarDays, Trophy } from "lucide-react"

const tabs = [
    {
        key: "summary",
        Icon: BookOpenText,
        badge: "สรุปเนื้อหา",
        label: "เข้าใจความรู้สึกของนิสิต",
        title: "สรุปให้เข้าใจ ไม่ใช่แค่ copy",
        desc: "ไม่ใช่แค่ AI สรุปให้ แต่ช่วยจัดเนื้อหาให้เป็นหัวข้อ เข้าใจง่าย อ่านสอบได้ทันที ✨",
        gradient: "from-sky-400 to-indigo-400",
        activeBg: "bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-500/10 dark:to-indigo-500/10",
        activeBorder: "border-sky-300 dark:border-sky-300/40",
        iconBg: "bg-sky-50 dark:bg-sky-400/10",
        iconColor: "text-sky-500 dark:text-sky-200",
        titleColor: "text-sky-600 dark:text-sky-200",
        descColor: "text-sky-500 dark:text-sky-100",
        panelBorder: "border-sky-200 dark:border-sky-300/30",
        panelBg: "bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-500/10 dark:to-indigo-500/10",
        bar: "from-sky-400 to-indigo-400",
        dotColor: "bg-sky-400",
        labelActive: "text-sky-600 dark:text-sky-200",
        glowColor: "#7dd3fc",
    },
    {
        key: "homework",
        Icon: CalendarDays,
        badge: "แผนการเรียน",
        label: "ช่วยจัด plan",
        title: "คิดเป็น ไม่ใช่แค่รับคำตอบ",
        desc: "ไม่ใช่แค่ AI ตอบให้ แต่ช่วยอธิบายทีละขั้น พร้อมวิธีคิดแบบนิสิตทำเองได้ 💗",
        gradient: "from-pink-400 to-rose-400",
        activeBg: "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-500/10 dark:to-rose-500/10",
        activeBorder: "border-pink-300 dark:border-pink-300/40",
        iconBg: "bg-pink-50 dark:bg-pink-400/10",
        iconColor: "text-pink-500 dark:text-pink-200",
        titleColor: "text-pink-600 dark:text-pink-200",
        descColor: "text-pink-500 dark:text-pink-100",
        panelBorder: "border-pink-200 dark:border-pink-300/30",
        panelBg: "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-500/10 dark:to-rose-500/10",
        bar: "from-pink-400 to-rose-400",
        dotColor: "bg-pink-400",
        labelActive: "text-pink-600 dark:text-pink-200",
        glowColor: "#f9a8d4",
    },
    {
        key: "exam",
        Icon: Trophy,
        badge: "วางแผนเกรด",
        label: "วางแผนเกรด",
        title: "เน้นจุด ไม่เครียด ไม่ตกสอบ",
        desc: "ไม่ใช่แค่ AI ติวให้ แต่ช่วยเน้นจุดออกสอบ ทำโจทย์ไปด้วยกัน วางแผนอ่านแบบไม่เครียด 🫶",
        gradient: "from-cyan-400 to-sky-400",
        activeBg: "bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-500/10 dark:to-sky-500/10",
        activeBorder: "border-cyan-300 dark:border-cyan-300/40",
        iconBg: "bg-cyan-50 dark:bg-cyan-400/10",
        iconColor: "text-cyan-500 dark:text-cyan-200",
        titleColor: "text-cyan-600 dark:text-cyan-200",
        descColor: "text-cyan-500 dark:text-cyan-100",
        panelBorder: "border-cyan-200 dark:border-cyan-300/30",
        panelBg: "bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-500/10 dark:to-sky-500/10",
        bar: "from-cyan-400 to-sky-400",
        dotColor: "bg-cyan-400",
        labelActive: "text-cyan-600 dark:text-cyan-200",
        glowColor: "#67e8f9",
    },
]

export default function LessonTabs() {
    const [active, setActive] = useState("summary")
    const [popped, setPopped] = useState(null)

    const current = tabs.find((t) => t.key === active)

    const handleClick = (key) => {
        setActive(key)
        setPopped(key)
        setTimeout(() => setPopped(null), 250)
    }

    return (
        <div className="mt-8 px-1 relative max-w-6xl mx-auto w-full">
            <div className="grid grid-cols-3 gap-6 md:gap-8 mb-10">
                {tabs.map((tab) => {
                    const isActive = tab.key === active
                    const isPopped = tab.key === popped

                    return (
                        <button
                            key={tab.key}
                            onClick={() => handleClick(tab.key)}
                            className={`relative rounded-[2.5rem] border p-5 md:p-8 text-center overflow-hidden transition-all duration-500 ease-out ${isPopped ? "scale-95" : "hover:-translate-y-2 hover:shadow-2xl active:scale-95"
                                } ${isActive
                                    ? `${tab.activeBg} ${tab.activeBorder} shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] ring-2 ring-white/50`
                                    : "bg-white/60 dark:bg-white/5 border-white/60 dark:border-white/10 backdrop-blur-xl hover:bg-white/80"
                                }`}
                        >
                            {isActive && (
                                <div
                                    className="absolute -top-5 -left-5 w-24 h-24 rounded-full opacity-25 blur-2xl pointer-events-none"
                                    style={{ background: tab.glowColor }}
                                />
                            )}

                            {isActive && (
                                <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${tab.dotColor} animate-pulse`} />
                            )}

                            <div
                                className={`mx-auto mb-4 md:mb-6 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? `bg-gradient-to-br ${tab.gradient} shadow-xl scale-110` : tab.iconBg
                                    }`}
                            >
                                <tab.Icon
                                    size={32}
                                    strokeWidth={2.5}
                                    className={isActive ? "text-white" : tab.iconColor}
                                />
                            </div>

                            <p className={`hidden md:block text-[15px] font-black uppercase tracking-widest leading-snug transition-colors duration-300 mt-2 ${isActive ? tab.labelActive : "text-slate-500 dark:text-pink-100"
                                }`}>
                                {tab.label}
                            </p>
                        </button>
                    )
                })}
            </div>

            <div className={`rounded-[3rem] border px-8 md:px-12 py-8 md:py-10 backdrop-blur-3xl transition-all duration-500 shadow-2xl max-w-6xl mx-auto bg-white/40 relative overflow-hidden ${current.panelBg} ${current.panelBorder}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="flex items-center gap-4 mb-4 flex-wrap relative z-10">
                    <span className={`text-[12px] font-black px-4 py-1.5 rounded-full text-white shadow-lg bg-gradient-to-r ${current.gradient} uppercase tracking-wider`}>
                        {current.badge}
                    </span>
                    <span className={`text-2xl md:text-3xl font-black tracking-tight ${current.titleColor}`}>
                        {current.title}
                    </span>
                </div>
                <p className={`text-base md:text-lg font-medium leading-relaxed ${current.descColor} opacity-90 relative z-10`}>
                    {current.desc}
                </p>
            </div>

            <div className="flex gap-3 mt-5 max-w-6xl mx-auto">
                {tabs.map((tab) => (
                    <div key={tab.key} className="h-1 flex-1 rounded-full overflow-hidden bg-pink-100 dark:bg-pink-200/20">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${tab.key === active ? `bg-gradient-to-r ${tab.bar}` : ""
                                }`}
                            style={{ width: tab.key === active ? "100%" : "0%" }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
