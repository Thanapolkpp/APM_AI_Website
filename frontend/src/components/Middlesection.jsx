import React from "react"

const Middlesection = () => {
    return (
        <div className="w-full flex flex-col items-center">
            <section className="w-full max-w-5xl py-14 px-6 md:px-10 bg-white/60 dark:bg-white/5 rounded-[3rem] border border-white/60 dark:border-gray-800 backdrop-blur-md shadow-[0_20px_80px_-30px_rgba(0,0,0,0.25)] relative overflow-hidden">

                {/* cute glow blobs */}
                <div className="absolute -top-20 -left-20 size-56 bg-pink-300/30 blur-3xl rounded-full" />
                <div className="absolute -bottom-20 -right-20 size-56 bg-blue-300/30 blur-3xl rounded-full" />

                {/* Header */}
                <div className="text-center mb-12 relative z-10">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-extrabold tracking-widest uppercase text-[11px]">
                        ✨ APM AI MODES
                    </span>

                    <h2 className="text-3xl md:text-4xl font-extrabold mt-4 leading-tight">
                        APM คือ{" "}
                        <span className="bg-gradient-to-r from-primary via-pink-500 to-blue-500 bg-clip-text text-transparent">
                            Assistant for Personal Motivation
                        </span>{" "}
                        💖
                    </h2>

                    <p className="mt-3 text-sm md:text-base text-gray-500 dark:text-gray-400">
                        เพื่อนช่วยนิสิตในทุกสถานการณ์ — เครียดก็ปลอบ งานเยอะก็ช่วยจัด เวลาไม่พอก็ช่วยวางแผน ✨
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    <FeatureItem
                        icon="self_improvement"
                        color="text-pink-700"
                        bgColor="bg-pink-200/70"
                        title="Calm Mode"
                        desc="ช่วยให้หายเครียด คุยระบายได้เต็มที่ ไม่ตัดสิน ไม่กดดัน อยู่ข้าง ๆ เสมอ"
                        badge="ลดความเครียด 🌷"
                    />

                    <FeatureItem
                        icon="event_note"
                        color="text-blue-700"
                        bgColor="bg-blue-200/70"
                        title="Schedule Mode"
                        desc="AI สรุปตารางเวลา แบ่งเวลาจากตารางเรียน ช่วยจัด To-do และเตือนงานแบบเป็นระบบ"
                        badge="จัดเวลาให้เป๊ะ 📅"
                    />

                    <FeatureItem
                        icon="school"
                        color="text-emerald-700"
                        bgColor="bg-emerald-200/70"
                        title="Grade Plan Mode"
                        desc="เมื่อรู้คะแนนกลางภาคแล้ว AI ช่วยวางแผนเกรด คำนวณความเป็นไปได้ และช่วยตัดสินใจง่ายขึ้น"
                        badge="แพลนเกรด 📊"
                    />
                </div>

                {/* CTA */}
                <div className="mt-12 flex justify-center relative z-10">
                    <button className="group px-7 py-3 rounded-full bg-gradient-to-r from-primary to-pink-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition">
                        เริ่มใช้ APM AI ตอนนี้เลย 🚀
                        <span className="ml-2 inline-block group-hover:translate-x-1 transition">
                            →
                        </span>
                    </button>
                </div>
            </section>

            {/* mini stats */}
            <div className="mt-16 flex flex-col items-center gap-4 mb-10">

                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold text-center">
                    Powered by APM AI • Assistant for Personal Motivation 💖
                </div>
            </div>
        </div>
    )
}

const FeatureItem = ({ icon, color, bgColor, title, desc, badge }) => (
    <div className="group flex flex-col items-center text-center px-5 py-8 rounded-[2.2rem] bg-white/60 dark:bg-white/5 border border-white/60 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className={`size-16 rounded-3xl ${bgColor} flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition`}>
            <span className={`material-symbols-outlined text-3xl ${color}`}>
                {icon}
            </span>
        </div>

        <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 mb-3">
            {badge}
        </span>

        <h4 className="text-xl font-extrabold mb-3">{title}</h4>

        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {desc}
        </p>
    </div>
)

export default Middlesection
