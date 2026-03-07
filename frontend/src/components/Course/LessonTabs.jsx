import React, { useState } from "react"

const LessonTabs = () => {
    const [activeTab, setActiveTab] = useState("summary")

    const tabs = [
        {
            key: "summary",
            label: "เข้าใจความรู้สึกของนิสิต",
            desc: "ไม่ใช่แค่ AI สรุปให้ แต่ช่วยจัดเนื้อหาให้เป็นหัวข้อ เข้าใจง่าย อ่านสอบได้ทันที ✨",
        },
        {
            key: "homework",
            label: "ช่วยจัด plan",
            desc: "ไม่ใช่แค่ AI ตอบให้ แต่ช่วยอธิบายทีละขั้น พร้อมวิธีคิดแบบนิสิตทำเองได้ 💗",
        },
        {
            key: "exam",
            label: "วางแผนเกรด",
            desc: "ไม่ใช่แค่ AI ติวให้ แต่ช่วยเน้นจุดออกสอบ ทำโจทย์ไปด้วยกัน และวางแผนอ่านแบบไม่เครียด 🫶",
        },
    ]

    const activeDesc = tabs.find((t) => t.key === activeTab)?.desc

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
                            className={`px-6 py-3 rounded-full border text-sm font-extrabold transition-all duration-200
              hover:scale-[1.02] active:scale-[0.98]
              ${isActive
                                    ? "bg-gradient-to-r from-primary to-pink-500 text-white border-white/40 shadow-md hover:shadow-lg hover:brightness-110"
                                    : "bg-white/80 dark:bg-white/10 text-gray-700 dark:text-gray-200 border-white/70 dark:border-gray-700 shadow-sm hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 hover:text-gray-900 hover:border-pink-300 dark:hover:from-pink-500/20 dark:hover:to-purple-500/20"
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
                        {activeDesc}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LessonTabs
