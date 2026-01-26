import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLightBulb, HiOutlineUserGroup, HiOutlineShieldCheck } from "react-icons/hi";
import Footer from "../components/footer";


const About = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <HiOutlineLightBulb />,
            title: "Smart Learning",
            description: "AI ที่ช่วยสรุปบทเรียนและตอบข้อสงสัยทางการเรียนของคุณได้ทันที"
        },
        {
            icon: <HiOutlineUserGroup />,
            title: "Diverse Personalities",
            description: "เลือกคุยกับ AI หลายบุคลิก ไม่ว่าจะเป็นสายชิลล์ (Bro) หรือสายเนิร์ด (Nerd)"
        },
        {
            icon: <HiOutlineShieldCheck />,
            title: "Student Privacy",
            description: "ข้อมูลของคุณปลอดภัยและเน้นการใช้งานเพื่อพัฒนาการเรียนโดยเฉพาะ"
        }
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10" />

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="max-w-4xl w-full">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest">
                        About UniBuddy AI
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-gray-800 dark:text-white mb-8 leading-tight">
                        The AI Companion for <br />
                        <span className="text-primary">Next-Gen Students</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        UniBuddy AI ถูกสร้างขึ้นมาเพื่อเปลี่ยนประสบการณ์การเรียนของนิสิตให้ง่ายขึ้น
                        เราผสานเทคโนโลยี AI ล้ำสมัยเข้ากับบุคลิกที่เข้าใจนักศึกษา เพื่อเป็นเพื่อนคู่คิดในทุกก้าวย่างของชีวิตมหาวิทยาลัย
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-left">
                        {features.map((f, i) => (
                            <div key={i} className="p-8 bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/20 dark:border-white/5 hover:scale-105 transition-all duration-300">
                                <div className="text-3xl text-primary mb-4">{f.icon}</div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{f.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => navigate("/")}
                        className="px-10 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:brightness-110 active:scale-95 transition-all"
                    >
                        Go Back Home
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;