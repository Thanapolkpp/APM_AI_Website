import React, { useEffect, useState, Suspense, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Layout/Navbar";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

import broImg from "../../assets/Bro.png";
import girlImg from "../../assets/Girl.png";
import nerdImg from "../../assets/Nerd.1.2.png";
import Logo from "../../assets/logo.png";


/* ================= Avatar Model ================= */

const AvatarModel = ({ modelPath }) => {

    const { scene } = useGLTF(modelPath);
    const ref = useRef();

    useFrame(({ clock }) => {

        const t = clock.getElapsedTime();

        ref.current.position.y = -0.3 + Math.sin(t * 1.5) * 0.05;
        ref.current.rotation.y = Math.PI + Math.sin(t * 0.4) * 0.2;

    });

    return (
        <primitive
            ref={ref}
            object={scene}
            scale={5}
        />
    );
};


/* ================= Page ================= */

const EditAvatar = () => {

    const navigate = useNavigate();

    const avatars = useMemo(() => [
        {
            id: "bro",
            name: "Bro",
            model: "/models/bro.glb",
            image: broImg,
            glow: "border-sky-300 shadow-[0_0_25px_rgba(56,189,248,0.4)]",
            bg: "bg-sky-50"
        },
        {
            id: "girl",
            name: "Girl",
            model: "/models/girl.glb",
            image: girlImg,
            glow: "border-pink-300 shadow-[0_0_25px_rgba(244,114,182,0.4)]",
            bg: "bg-pink-50"
        },
        {
            id: "nerd",
            name: "Nerd",
            model: "/models/nerd.glb",
            image: nerdImg,
            glow: "border-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.4)]",
            bg: "bg-emerald-50"
        }
    ], []);


    const [selectedAvatar, setSelectedAvatar] = useState("girl");
    const [activeTab, setActiveTab] = useState("ตัวละคร");


    useEffect(() => {

        const saved = localStorage.getItem("avatar");

        if (saved && avatars.some(a => a.id === saved)) {

            setSelectedAvatar(saved);

        }

    }, [avatars]);


    const handleSave = () => {

        localStorage.setItem("avatar", selectedAvatar);
        navigate("/account");

    };


    const activeAvatar = avatars.find(a => a.id === selectedAvatar);


    return (

        <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#fae8ff] to-[#fce7f3] font-display flex flex-col relative overflow-hidden">
            {/* Background Blobs for Glassmorphism */}
            <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-sky-300/30 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-pink-300/30 rounded-full blur-[150px] pointer-events-none z-0"></div>

            {/* Header (Glassmorphism) */}
            <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-xl">
                <div className="mx-auto grid w-full max-w-7xl grid-cols-2 items-center px-4 py-4 sm:px-6 md:grid-cols-3">

                    {/* left */}
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="relative size-11 sm:size-12 shrink-0 overflow-hidden rounded-2xl bg-white/20 ring-2 ring-pink-300/50 shadow-md">
                            <img src={Logo} alt="Logo" className="h-full w-full object-cover transition duration-300 hover:scale-110" />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-pink-200/30 via-transparent to-blue-200/20" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="truncate text-[15px] sm:text-xl font-extrabold tracking-tight leading-none text-black drop-shadow-sm">
                                <span className="sm:hidden">APM AI</span>
                                <span className="hidden sm:inline">APM AI</span>
                            </h1>
                            <p className="truncate text-[10px] sm:text-[11px] font-semibold text-black/70">
                                🌷 ผู้ช่วยที่เป็นเพื่อนที่ดีสำหรับคุณ
                            </p>
                        </div>
                    </div>

                    {/* center */}
                    <div className="hidden md:flex justify-center">
                        <div className="rounded-full border border-white/20 bg-white/15 px-6 py-2 shadow-sm">
                            <Navbar />
                        </div>
                    </div>

                    {/* right icons */}
                    <div className="flex justify-end gap-3 items-center">
                        <button className="relative size-9 sm:size-10 rounded-full flex items-center justify-center bg-white/90 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-105 active:scale-95">
                            <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-gray-700 dark:text-gray-200">
                                notifications
                            </span>
                        </button>

                        <button
                            onClick={() => navigate(localStorage.getItem("token") ? "/account" : "/login")}
                            className="size-9 sm:size-10 rounded-full bg-cover bg-center border-2 border-primary/70 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-sm"
                            style={{ backgroundImage: `url("${!localStorage.getItem("token") ? Logo : (localStorage.getItem('avatarImage') || (localStorage.getItem('avatar') === 'Bro' ? broImg : localStorage.getItem('avatar') === 'Nerd' ? nerdImg : girlImg))}")`, backgroundColor: "white" }}
                        />
                    </div>
                </div>
            </header>


            {/* ================= MAIN ================= */}
            <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 max-w-[1200px] w-full mx-auto px-6 py-10">


                {/* ================= CENTER ================= */}

                <div className="flex flex-col gap-8">

                    {/* 3D และตัวเลือกอวาตาร์ */}
                    <div className="relative flex flex-col items-center justify-center min-h-[500px]">

                        {/* 3D */}

                        <div className="absolute inset-0">

                            <Canvas camera={{ position: [0, 1.5, 7], fov: 42 }}>

                                <ambientLight intensity={1.4} />

                                <directionalLight position={[3, 8, 4]} intensity={2} />

                                <pointLight position={[-2, 3, 2]} intensity={1.3} color="#f9a8d4" />

                                <pointLight position={[2, 2, 3]} intensity={1} color="#93c5fd" />

                                <Suspense fallback={null}>

                                    <AvatarModel
                                        key={activeAvatar.id}
                                        modelPath={activeAvatar.model}
                                    />

                                </Suspense>

                                <OrbitControls
                                    enableZoom={false}
                                    enablePan={false}
                                    maxPolarAngle={Math.PI / 2}
                                    minPolarAngle={Math.PI / 2 - 0.2}
                                />

                            </Canvas>

                        </div>


                        {/* avatar selector */}

                        <div className="flex gap-6 mt-auto z-20">

                            {avatars.map(a => {

                                const selected = a.id === selectedAvatar;

                                return (

                                    <button
                                        key={a.id}
                                        onClick={() => setSelectedAvatar(a.id)}
                                        className={`flex flex-col items-center
                                        w-28 h-28 rounded-3xl
                                        transition-all duration-300
                                        ${selected
                                                ? `bg-white scale-110 ${a.glow}`
                                                : "bg-white/50 hover:scale-105"}
                                        `}
                                    >

                                        <img
                                            src={a.image}
                                            className="w-14 h-14 rounded-full mt-3"
                                            alt={a.name}
                                        />

                                        <span className="font-bold text-sm mt-1">

                                            {a.name}

                                        </span>

                                    </button>

                                );

                            })}

                        </div>


                        {/* Action Buttons */}
                        <div className="flex gap-8 mt-14 z-20">
                            <button
                                onClick={() => navigate("/account")}
                                className="px-10 py-4 rounded-2xl bg-white/70 hover:bg-white font-semibold shadow-sm"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                className="px-12 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold shadow-lg hover:scale-105 transition"
                            >

                                Save Avatar ✨

                            </button>

                        </div>

                    </div>

                    {/* ================= BOTTOM PANEL (ย้ายกลับมาไว้ข้างล่าง) ================= */}
                    <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 border border-white/60 w-full max-w-2xl mx-auto z-20">

                        <div className="flex justify-between border-b pb-2 mb-4">

                            {["ตัวละคร", "เสื้อผ้า", "ของตกแต่ง", "พื้นหลัง"].map(tab => (

                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-sm font-semibold
                                    ${activeTab === tab
                                            ? "text-pink-600 border-b-2 border-pink-500"
                                            : "text-gray-500"}
                                    `}
                                >

                                    {tab}

                                </button>

                            ))}

                        </div>

                        <div className="grid grid-cols-3 gap-4">

                            <div className="h-16 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xl cursor-pointer">

                                🧥

                            </div>

                            <div className="h-16 rounded-xl bg-white/60 flex items-center justify-center text-xl cursor-pointer hover:bg-white/80 transition">

                                🧢

                            </div>

                            <div className="h-16 rounded-xl bg-white/60 flex items-center justify-center text-xl cursor-pointer hover:bg-white/80 transition">

                                🖼️

                            </div>

                        </div>

                    </div>
                    {/* ================= END BOTTOM PANEL ================= */}

                </div>


                {/* ================= RIGHT PANEL ================= */}

                <div className="flex flex-col gap-6">

                    {/* Level Bar */}
                    <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-6 border border-white/70">
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <h3 className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                                    Lv. 12
                                </h3>
                                <p className="text-xs text-gray-500 font-medium mt-1">Explorer</p>
                            </div>
                            <span className="text-xs font-bold text-gray-600 mb-1">1,200 / 2,000 XP</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-4 w-full bg-white/60 rounded-full overflow-hidden shadow-inner border border-white/50 relative">
                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 w-[60%] rounded-full shadow-[0_0_10px_rgba(232,121,249,0.5)] transition-all duration-500"></div>
                        </div>
                    </div>

                    {/* coins */}
                    <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-6 border border-white/70 flex justify-between items-center">

                        <div>

                            <h3 className="font-bold text-lg text-gray-600">
                                A-Coin
                            </h3>

                            <p className="text-4xl font-black text-pink-400 mt-1">
                                20
                            </p>

                        </div>

                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg border-2 border-white">

                            A

                        </div>

                    </div>


                    {/* avatar list */}
                    <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 border border-white/60">

                        <h3 className="text-center font-bold mb-4 text-gray-600">

                            Avatar Candidates

                        </h3>

                        <div className="flex flex-col gap-4">

                            {avatars.map(a => (

                                <button
                                    key={a.id}
                                    onClick={() => navigate(`/chat/${a.id}`)}
                                    className={`flex items-center gap-4 p-3 rounded-full border-2 transition-all
                                    ${selectedAvatar === a.id
                                            ? `${a.glow} bg-white/60 scale-105`
                                            : "border-transparent hover:bg-white/70"}
                                    `}
                                >

                                    <img
                                        src={a.image}
                                        className="w-12 h-12 rounded-full shadow-sm"
                                        alt={a.name}
                                    />

                                    <span className="font-bold text-gray-700">

                                        {a.name}

                                    </span>

                                </button>

                            ))}

                        </div>

                    </div>

                </div>

            </main>

        </div>

    );

};

export default EditAvatar;