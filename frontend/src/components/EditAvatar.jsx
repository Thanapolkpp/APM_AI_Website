import React, { useEffect, useState, Suspense, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import broImg from "../assets/Bro.png";
import girlImg from "../assets/Girl.png";
import nerdImg from "../assets/Nerd.1.2.png";
import Logo from "../assets/logo.png";

/* ================= Avatar ================= */

const AvatarModel = ({ modelPath }) => {
    const { scene } = useGLTF(modelPath);

    return (
        <primitive
            object={scene}
            scale={6.5}
            position={[0, -1.1, 0]}
            rotation={[0, Math.PI, 0]}
        />
    );
};

/* ================= Page ================= */

const EditAvatar = () => {
    const navigate = useNavigate();

    // 1. เพิ่ม property 'image' เข้าไปใน array (อย่าลืมเตรียมรูปภาพไว้ในโฟลเดอร์ public/images ด้วยนะครับ)
    const avatars = useMemo(() => [
        { id: "bro", name: "Bro", model: "/models/bro.glb", image: broImg },
        { id: "girl", name: "Girl", model: "/models/girl.glb", image: girlImg },
        { id: "nerd", name: "Nerd", model: "/models/nerd.glb", image: nerdImg },
    ], []);

    const [selectedAvatar, setSelectedAvatar] = useState(avatars[0].id);

    useEffect(() => {
        const savedAvatar = localStorage.getItem("avatar");
        if (savedAvatar && avatars.some(a => a.id === savedAvatar)) {
            setSelectedAvatar(savedAvatar);
        }
    }, [avatars]);

    const handleSave = () => {
        localStorage.setItem("avatar", selectedAvatar);
        navigate("/account");
    };

    const activeAvatar =
        avatars.find(a => a.id === selectedAvatar) || avatars[0];

    return (
        <div className="min-h-screen 
            bg-gradient-to-br 
            from-pink-100 via-purple-100 to-blue-100
            text-gray-700 font-display flex flex-col">

            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-xl">
                <div className="mx-auto grid w-full max-w-7xl grid-cols-2 items-center px-4 py-4 sm:px-6 md:grid-cols-3">
                    {/* ✅ Left */}
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="relative size-11 sm:size-12 shrink-0 overflow-hidden rounded-2xl bg-white/20 ring-2 ring-pink-300/50 shadow-md">
                            <img src={Logo} alt="Logo" className="h-full w-full object-cover transition duration-300 hover:scale-110" />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-pink-200/30 via-transparent to-blue-200/20" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="truncate text-[15px] sm:text-xl font-extrabold tracking-tight leading-none text-black drop-shadow-sm dark:text-white">
                                <span className="sm:hidden">APM AI</span>
                                <span className="hidden sm:inline">APM AI</span>
                            </h1>
                            <p className="truncate text-[10px] sm:text-[11px] font-semibold text-black/70 dark:text-white/70">
                                🌷 ผู้ช่วยที่เป็นเพื่อนที่ดีสำหรับคุณ
                            </p>
                        </div>
                    </div>

                    {/* ✅ Center (Desktop) */}
                    <div className="hidden md:flex justify-center">
                        <div className="rounded-full border border-white/20 bg-white/15 px-6 py-2 shadow-sm">
                            <Navbar />
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex justify-end items-center gap-3">
                        <button className="relative size-9 sm:size-10 rounded-full flex items-center justify-center bg-white/90 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-105 active:scale-95">
                            <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-gray-700 dark:text-gray-200">
                                notifications
                            </span>
                            <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="size-9 sm:size-10 rounded-full bg-cover bg-center border-2 border-primary/70 cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all"
                            style={{ backgroundImage: `url("${girlImg}")` }}
                            aria-label="Go to login"
                        />
                        <div className="md:hidden">
                            <Navbar />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black 
                        bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500
                        bg-clip-text text-transparent">
                        Choose Your Avatar
                    </h1>

                    <p className="text-gray-500 mt-4 text-lg">
                        เลือกตัวละครที่เป็นตัวคุณที่สุด ✨
                    </p>
                </div>

                {/* 3D Area */}
                <div className="w-full h-[500px] mb-20 relative">

                    {/* Glow พาสเทล */}
                    <div className="absolute inset-0 
                        bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.25),_rgba(192,132,252,0.15),_transparent_70%)]
                        blur-3xl">
                    </div>

                    <Canvas camera={{ position: [0, 1, 7], fov: 45 }}>
                        <ambientLight intensity={0.9} />
                        <directionalLight
                            position={[5, 8, 5]}
                            intensity={1.4}
                        />
                        <pointLight
                            position={[0, 3, 3]}
                            intensity={1.5}
                            color="#c084fc"
                        />

                        <Suspense fallback={null}>
                            <AvatarModel
                                key={activeAvatar.id}
                                modelPath={activeAvatar.model}
                            />
                        </Suspense>

                        <OrbitControls
                            enableZoom={false}
                            enablePan={false}
                            autoRotate
                            autoRotateSpeed={1.2}
                        />
                    </Canvas>
                </div>

                {/* Selector Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                    {avatars.map((a) => (
                        <button
                            key={a.id}
                            onClick={() => setSelectedAvatar(a.id)}
                            className={`p-8 rounded-3xl 
                                backdrop-blur-xl 
                                transition-all duration-300
                                ${selectedAvatar === a.id
                                    ? "bg-white shadow-xl scale-105 border-2 border-pink-400" // เพิ่มกรอบนิดหน่อยให้ดูชัดเจนตอนเลือก
                                    : "bg-white/60 hover:bg-white/80"
                                }`}
                        >
                            {/* 2. เปลี่ยนจากตัวอักษรเป็นแท็ก img และใส่ overflow-hidden */}
                            <div className="w-28 h-28 mx-auto rounded-full 
                                flex items-center justify-center 
                                mb-6 shadow-lg overflow-hidden
                                bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400">
                                <img
                                    src={a.image}
                                    alt={a.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <p className="text-2xl font-bold text-gray-700">
                                {a.name}
                            </p>

                            {selectedAvatar === a.id && (
                                <div className="mt-3 text-pink-500 font-semibold">
                                    Selected 💖
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Buttons */}
                <div className="mt-20 flex justify-center gap-8">
                    <button
                        onClick={() => navigate("/account")}
                        className="px-8 py-3 rounded-2xl 
                        bg-white/70 hover:bg-white 
                        transition shadow-sm">
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="px-12 py-4 rounded-2xl font-bold text-lg
                        bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500
                        text-white shadow-lg
                        hover:brightness-110 active:scale-95 transition">
                        Save Avatar ✨
                    </button>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default EditAvatar;