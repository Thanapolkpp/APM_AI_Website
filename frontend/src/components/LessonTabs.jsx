import React, { useState } from "react"

const LessonTabs = () => {
    const [activeTab, setActiveTab] = useState("summary")

    const tabs = [
        {
            key: "summary",
            label: "สรุปบทเรียน 📚",
            desc: "ส่งเนื้อหา/ไฟล์มาได้เลย AI จะสรุปให้เป็นหัวข้อ เข้าใจง่าย พร้อมอ่านสอบทันที ✨",
        },
        {
            key: "homework",
            label: "ช่วยทำการบ้าน ✍️",
            desc: "ไม่ใช่แค่ตอบให้ แต่ช่วยอธิบายทีละขั้น พร้อมวิธีคิดแบบนิสิตทำเองได้ 💗",
        },
        {
            key: "exam",
            label: "ติวก่อนสอบ 🧠",
            desc: "ติวแบบเน้นจุดออกสอบ ทำโจทย์ไปด้วยกัน และช่วยวางแผนอ่านแบบไม่เครียด 🫶",
        },
    ]

    return (
        <div className="mt-6 relative z-10">
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-3">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key

                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-6 py-3 rounded-full border shadow-sm text-sm font-extrabold transition
                hover:scale-[1.02] active:scale-[0.98]
                ${isActive
                                    ? "bg-gradient-to-r from-primary to-pink-500 text-white border-white/40 shadow-md"
                                    : "bg-white/80 dark:bg-white/10 text-gray-700 dark:text-gray-200 border-white/70 dark:border-gray-700"
                                }`}
                        >
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Description */}
            <div className="mt-5 flex justify-center">
                <div className="max-w-2xl text-center px-6 py-4 rounded-3xl bg-white/70 dark:bg-white/5 border border-white/60 dark:border-gray-800 shadow-sm">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {tabs.find((t) => t.key === activeTab)?.desc}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LessonTabs
