import React, { useEffect, useState, Suspense, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, useProgress } from "@react-three/drei";
import { ShoppingCart, CheckCircle2, Lock, Coins, ArrowLeft, Sparkles, Image as ImageIcon, User, Trash2 } from "lucide-react";
import { useCoins } from "../../hooks/useCoins";
import CoinBadge from "../UI/CoinBadge";
import {
    fetchOwnedAvatars, fetchOwnedRooms,
    fetchAvatarCatalog, fetchRoomCatalog,
    buyAvatarApi, buyRoomApi,
    equipAvatarApi, equipRoomApi,
} from "../../services/aiService";

import broImg from "../../assets/Bro.png";
import girlImg from "../../assets/Girl.png";
import nerdImg from "../../assets/Nerd.1.2.png";
import Logo from "../../assets/logo.png";

/* ================= Loader ================= */
const Loader = () => {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center gap-4 w-64 text-center">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                    <div
                        className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"
                        style={{ animationDuration: '0.8s' }}
                    ></div>
                </div>
                <div className="space-y-1">
                    <p className="text-white font-black text-lg drop-shadow-md">กำลังเรียกเพื่อนมา... ✨</p>
                    <p className="text-white/70 font-bold text-sm tracking-widest">{Math.round(progress)}% LOADED</p>
                </div>
            </div>
        </Html>
    );
};

/* ================= Avatar Model ================= */
const AvatarModel = ({ modelPath }) => {
    const { scene } = useGLTF(modelPath);
    // Clone the scene to ensure it can be reused safely
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    const ref = useRef();

    return <primitive ref={ref} object={clonedScene} position={[0, -0.5, 0]} scale={6} />;
};

/* ================= Scene Model ================= */
const SceneModel = ({ modelPath }) => {
    const { scene } = useGLTF(modelPath);
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    const ref = useRef();

    return <primitive ref={ref} object={clonedScene} position={[0, -1, 0]} scale={1.8} />;
};

/* ================= Page ================= */
const EditAvatar = () => {
    const navigate = useNavigate();
    const { coins, spendCoins } = useCoins();

    const avatars = useMemo(() => [
        {
            id: "bro",
            name: "Bro - The Chill Friend",
            model: "/models/bro.glb",
            image: broImg,
            price: 50,
            glow: "border-sky-300 shadow-[0_0_25px_rgba(56,189,248,0.4)]",
            description: "สบายๆ เหมือนเป็นเพื่อนคนนึง คุยได้ทุกเรื่องแบบแมนๆ ชิลล์ๆ"
        },
        {
            id: "girl",
            name: "Bestie - The Motivator",
            model: "/models/girl.glb",
            image: girlImg,
            price: 15,
            glow: "border-pink-300 shadow-[0_0_25px_rgba(244,114,182,0.4)]",
            description: "ใส่ใจทุกรายละเอียด ให้กำลังใจเก่งเหมือนเพื่อนสาวสุดซี้ ✨"
        },
        {
            id: "nerd",
            name: "Genius - The Specialist",
            model: "/models/nerd.glb",
            image: nerdImg,
            price: 0,
            glow: "border-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.4)]",
            description: "อัจฉริยะด้านข้อมูล แม่นยำ และช่วยวางแผนการเรียนแบบมือโปร 🤓"
        }
    ], []);

    const scenes = useMemo(() => [
        {
            id: "classic",
            name: "Classic White",
            color: "#ffffff",
            price: 0,
            description: "ความเรียบง่ายที่ช่วยให้มีสมาธิที่สุด 🤍"
        },
        {
            id: "sakura",
            name: "Sakura Night",
            color: "#ffe4e1",
            price: 20,
            description: "บรรยากาศใต้ต้นซากุระ ยามค่ำคืนที่แสนหวาน 🌸"
        },
        {
            id: "midnight",
            name: "Midnight Blue",
            color: "#1e3a8a",
            price: 40,
            description: "สีน้ำเงินเข้มลึกซึ้ง เหมาะสำหรับการอ่านหนังสือดึกๆ 🌑"
        },
        {
            id: "forest",
            name: "Deep Forest",
            color: "#064e3b",
            price: 60,
            description: "สีเขียวขจีเหมือนอยู่กลางป่า ช่วยพักสายตาได้ดี 🌿"
        },
        {
            id: "nerdroom",
            name: "Nerd - Private Studio",
            model: "/models/Nerdroom.glb",
            image: "/models/NERD_ROOM.png",
            color: "#111827", // Background fallback
            price: 0,
            description: "สตูดิโอส่วนตัวสไตล์ Nerd ตกแต่งครบชุด เพิ่มไฟการเรียน! 💻📚"
        }
    ], []);

    const [currentTab, setCurrentTab] = useState("avatar"); // avatar, scene
    const [selectedId, setSelectedId] = useState("bro");
    const [selectedSceneId, setSelectedSceneId] = useState("classic");

    const [ownedIds, setOwnedIds] = useState(() => {
        const saved = localStorage.getItem("owned_avatars");
        return saved ? JSON.parse(saved) : ["nerd"];
    });

    const [ownedSceneIds, setOwnedSceneIds] = useState(() => {
        const saved = localStorage.getItem("owned_scenes");
        return saved ? JSON.parse(saved) : ["classic"];
    });

    const [avatarCatalog, setAvatarCatalog] = useState([]);
    const [roomCatalog, setRoomCatalog] = useState([]);

    // Custom Alert State
    const [customAlert, setCustomAlert] = useState({ isOpen: false, message: "", type: "info" });
    const showCustomAlert = (message, type = "info") => {
        setCustomAlert({ isOpen: true, message, type });
    };

    useEffect(() => {
        const currentAvatar = localStorage.getItem("avatar") || "nerd";
        setSelectedId(currentAvatar);
        const currentScene = localStorage.getItem("current_scene") || "classic";
        setSelectedSceneId(currentScene);
    }, []);

    // Sync owned items from DB
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const MODEL_TO_AVATAR_ID = {
            "/models/bro.glb": "bro",
            "/models/girl.glb": "girl",
            "/models/nerd.glb": "nerd",
        };
        // ใช้ model_path จาก DB โดยตรง (ตอนนี้ Room table มี model_path แล้ว)
        const MODEL_TO_SCENE_ID = {
            "/models/Nerdroom.glb": "nerdroom",
        };

        const syncInventory = async () => {
            try {
                const [avatarsData, roomsData, allAvatarsData, allRoomsData] = await Promise.all([
                    fetchOwnedAvatars(),
                    fetchOwnedRooms(),
                    fetchAvatarCatalog(),
                    fetchRoomCatalog(),
                ]);

                setAvatarCatalog(allAvatarsData);
                setRoomCatalog(allRoomsData);

                const dbAvatarIds = avatarsData
                    .map(a => MODEL_TO_AVATAR_ID[a.model_path])
                    .filter(Boolean);

                // ใช้ model_path จาก DB (Room table มี column นี้แล้ว)
                const dbSceneIds = roomsData
                    .map(r => MODEL_TO_SCENE_ID[r.model_path])
                    .filter(Boolean);

                // Merge DB data with always-free defaults
                const allAvatars = [...new Set(["nerd", ...dbAvatarIds])];
                // Color-only scenes stay in localStorage; merge 3D rooms from DB
                const savedScenes = JSON.parse(localStorage.getItem("owned_scenes") || '["classic"]');
                const allScenes = [...new Set([...savedScenes, ...dbSceneIds])];

                setOwnedIds(allAvatars);
                setOwnedSceneIds(allScenes);
                localStorage.setItem("owned_avatars", JSON.stringify(allAvatars));
                localStorage.setItem("owned_scenes", JSON.stringify(allScenes));
            } catch {
                // silently fail — localStorage fallback already applied
            }
        };

        syncInventory();
    }, []);

    const isOwned = (id) => currentTab === "avatar" ? ownedIds.includes(id) : ownedSceneIds.includes(id);

    const handleBuy = async (item) => {
        if (coins < item.price) {
            showCustomAlert(`เหรียญไม่พอจ้า! ขาดอีก ${item.price - coins} เหรียญนะเพื่อน ✨`, "error");
            return;
        }
        try {
            if (currentTab === "avatar") {
                // Bug 2 fix: call buy-avatar API (handles coin deduction server-side)
                const catalogItem = avatarCatalog.find(a => a.model_path === item.model);
                if (!catalogItem) {
                    showCustomAlert("ไม่พบ Avatar นี้ในระบบ กรุณาลองใหม่", "error");
                    return;
                }
                const result = await buyAvatarApi(catalogItem.id);
                localStorage.setItem("user_coins", String(result.coins_remaining));
                window.dispatchEvent(new Event("coinsUpdated"));
                const nextOwned = [...ownedIds, item.id];
                setOwnedIds(nextOwned);
                localStorage.setItem("owned_avatars", JSON.stringify(nextOwned));
            } else if (item.model) {
                // Bug 2 fix: 3D room — call buy-room API
                const catalogItem = roomCatalog.find(r => r.image_path === item.image);
                if (!catalogItem) {
                    showCustomAlert("ไม่พบ Room นี้ในระบบ กรุณาลองใหม่", "error");
                    return;
                }
                const result = await buyRoomApi(catalogItem.id);
                localStorage.setItem("user_coins", String(result.coins_remaining));
                window.dispatchEvent(new Event("coinsUpdated"));
                const nextOwned = [...ownedSceneIds, item.id];
                setOwnedSceneIds(nextOwned);
                localStorage.setItem("owned_scenes", JSON.stringify(nextOwned));
            } else {
                // Color-only scene (no DB entry) — use spendCoins as before
                const success = await spendCoins(item.price);
                if (!success) {
                    showCustomAlert(`เหรียญไม่พอจ้า! ขาดอีก ${item.price - coins} เหรียญนะเพื่อน ✨`, "error");
                    return;
                }
                const nextOwned = [...ownedSceneIds, item.id];
                setOwnedSceneIds(nextOwned);
                localStorage.setItem("owned_scenes", JSON.stringify(nextOwned));
            }
            showCustomAlert(`ยินดีด้วย! ปลดล็อก ${item.name} สำเร็จแล้ว ✨`, "success");
        } catch (err) {
            const detail = err.response?.data?.detail || "เกิดข้อผิดพลาด กรุณาลองใหม่";
            showCustomAlert(detail, "error");
        }
    };

    const handleSave = async () => {
        if (currentTab === "avatar") {
            localStorage.setItem("avatar", selectedId);
            // Bug 3 fix: call equip-avatar API to persist equipped state in DB
            const catalogItem = avatarCatalog.find(a => a.model_path === activeAvatar.model);
            if (catalogItem) {
                try { await equipAvatarApi(catalogItem.id); } catch { /* silently fail */ }
            }
            showCustomAlert("บันทึกการเลือกตัวละครแล้วจ้า! 🌷", "success");
        } else {
            localStorage.setItem("current_scene", selectedSceneId);
            // Bug 3 fix: call equip-room API for 3D rooms
            if (activeScene.model) {
                const catalogItem = roomCatalog.find(r => r.image_path === activeScene.image);
                if (catalogItem) {
                    try { await equipRoomApi(catalogItem.id); } catch { /* silently fail */ }
                }
            }
            showCustomAlert("เปลี่ยนฉากหลังให้แล้วนะเพื่อน! 🌸", "success");
        }
    };

    const activeAvatar = avatars.find(a => a.id === selectedId) || avatars[0];
    const activeScene = scenes.find(s => s.id === selectedSceneId) || scenes[0];
    const currentItem = currentTab === "avatar" ? activeAvatar : activeScene;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col transition-colors duration-300 relative">
            <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-xl">
                <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-4 py-4 sm:px-6">
                    {/* Left: Logo & Title */}
                    <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => navigate("/")}>
                        <ArrowLeft className="text-gray-400 mr-2" />
                        <div className="relative size-11 shrink-0 overflow-hidden rounded-2xl bg-white/20 ring-2 ring-pink-300/50 shadow-md">
                            <img src={Logo} alt="Logo" className="h-full w-full object-cover" />
                        </div>
                        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white hidden sm:block">APM Mall</h1>
                    </div>

                    {/* Center: Navbar (Only desktop) */}
                    <div className="hidden lg:flex flex-1 justify-center px-4">
                        <Navbar />
                    </div>

                    {/* Right: Shop Tabs & Coins */}
                    <div className="flex justify-end gap-3 items-center shrink-0">
                        <div className="flex bg-white/40 dark:bg-white/10 p-1 rounded-xl border border-white/60 dark:border-white/10">
                            <button
                                onClick={() => setCurrentTab("avatar")}
                                className={`px-6 py-2 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${currentTab === 'avatar' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}
                            >
                                <User size={18} /> Avatars
                            </button>
                            <button
                                onClick={() => setCurrentTab("scene")}
                                className={`px-6 py-2 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${currentTab === 'scene' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}
                            >
                                <ImageIcon size={18} /> Scenes
                            </button>
                        </div>
                        <CoinBadge />
                    </div>
                </div>
            </header>

            <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 max-w-7xl w-full mx-auto px-6 py-10 relative z-10">
                {/* Preview Section */}
                <div
                    className="relative flex flex-col items-center justify-center min-h-[550px] rounded-[64px] border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden transition-all duration-700"
                    style={{ backgroundColor: activeScene.color }}
                >
                    {/* Animated Background Decorative Elements for Scenes */}
                    {currentTab === "scene" && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/20 rounded-full blur-[100px] animate-pulse" />
                            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-black/10 rounded-full blur-[100px] animate-pulse delay-700" />
                        </div>
                    )}

                    <div className="absolute inset-0">
                        {/* 2D Background Image */}
                        {activeScene.image && (
                            <img
                                src={activeScene.image}
                                className="absolute inset-0 w-full h-full object-cover opacity-80"
                                alt="background"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                        {/* 3D Character Layer */}
                        <Canvas camera={{ position: [0, 0, 10], fov: 38 }}>
                            <ambientLight intensity={1.5} />
                            <pointLight position={[10, 10, 10]} intensity={1.5} />
                            <pointLight position={[-10, 10, -5]} intensity={1} />
                            <directionalLight position={[0, 10, 5]} intensity={2} />
                            <Suspense fallback={<Loader />}>
                                {currentTab === 'avatar' && <AvatarModel key={activeAvatar.id} modelPath={activeAvatar.model} />}
                            </Suspense>
                            <OrbitControls
                                autoRotate={false}
                                enableZoom={true}
                                enablePan={false}
                                maxPolarAngle={Math.PI / 2}
                                minDistance={3}
                                maxDistance={12}
                            />
                        </Canvas>
                    </div>

                    <div className="mt-auto p-12 z-20 text-center bg-gradient-to-t from-black/20 to-transparent w-full">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            {currentTab === 'avatar' ? 'Character Preview' : 'Scene Preview'}
                        </span>
                        <h2 className="text-4xl font-black text-white drop-shadow-lg mb-2">{currentItem.name}</h2>
                        <p className="text-white/80 font-bold mb-8 italic drop-shadow-md text-lg">{currentItem.description}</p>

                        <div className="flex gap-4 justify-center">
                            {isOwned(currentItem.id) ? (
                                <button
                                    onClick={handleSave}
                                    className="px-12 py-5 rounded-[28px] bg-white text-gray-900 font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-4 border-transparent hover:border-white/50"
                                >
                                    <CheckCircle2 size={24} className="text-emerald-500" /> {currentTab === 'avatar' ? 'สวมใส่ตัวละคร ✨' : 'ใช้ฉากนี้จ้า 🌸'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleBuy(currentItem)}
                                    className="px-12 py-5 rounded-[28px] bg-yellow-400 text-yellow-900 font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-4 border-yellow-200/50"
                                >
                                    <ShoppingCart size={24} /> ปลดล็อก {currentItem.price} Coins 🪙
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Shopping List Container */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[48px] p-10 border border-white/60 dark:border-white/10 shadow-xl flex flex-col h-full max-h-[700px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-2xl text-gray-800 dark:text-white flex items-center gap-2">
                                <Sparkles className="text-primary" size={28} /> {currentTab === 'avatar' ? 'Character Mall' : 'Scene Mall'}
                            </h3>
                            <button className="p-3 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-4 pb-4">
                                {(currentTab === 'avatar' ? avatars : scenes).map(item => {
                                    const active = currentTab === 'avatar' ? item.id === selectedId : item.id === selectedSceneId;
                                    const owned = isOwned(item.id);
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => currentTab === 'avatar' ? setSelectedId(item.id) : setSelectedSceneId(item.id)}
                                            className={`flex items-center gap-6 p-6 rounded-[36px] border-2 transition-all relative overflow-hidden group
                                            ${active ? 'border-primary bg-white dark:bg-white/10 shadow-2xl scale-[1.02]' : 'border-transparent bg-white/40 dark:bg-white/5 opacity-80 hover:opacity-100 hover:bg-white dark:hover:bg-white/10 hover:shadow-lg'}
                                            `}
                                        >
                                            <div className="relative shrink-0">
                                                {currentTab === 'avatar' || item.image ? (
                                                    <img
                                                        src={item.image}
                                                        className={`w-20 h-20 shadow-xl border-2 border-white/60 ${currentTab === 'avatar' ? 'rounded-full' : 'rounded-2xl object-cover'}`}
                                                        alt={item.name}
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 rounded-3xl shadow-xl flex items-center justify-center border-2 border-white/60" style={{ backgroundColor: item.color }}>
                                                        <ImageIcon className="text-white" size={32} />
                                                    </div>
                                                )}
                                                {!owned && (
                                                    <div className={`absolute inset-0 bg-black/60 flex items-center justify-center ${currentTab === 'avatar' ? 'rounded-full' : 'rounded-2xl'}`}>
                                                        <Lock size={26} className="text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 text-left min-w-0">
                                                <div className="font-black text-gray-900 dark:text-white text-lg truncate">{item.name.split(' - ')[0]}</div>
                                                <div className="text-xs font-bold uppercase tracking-[0.15em] mt-1">
                                                    {owned ?
                                                        <span className="text-emerald-500 flex items-center gap-1.5"><CheckCircle2 size={14} /> Owned</span> :
                                                        <span className="text-yellow-600 dark:text-yellow-400 flex items-center gap-1.5"><Coins size={14} /> {item.price} Coins</span>
                                                    }
                                                </div>
                                            </div>
                                            {active && <div className="absolute right-6 w-3 h-3 rounded-full bg-primary animate-pulse" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10">
                            <button
                                onClick={() => navigate("/todo")}
                                className="w-full py-5 rounded-[28px] bg-gradient-to-br from-primary to-purple-600 text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 animate-shimmer"
                            >
                                <Coins size={22} /> EARN MORE COINS
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Custom Alert Modal */}
            {customAlert.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
                        <div className="p-8 flex flex-col items-center text-center">
                            <div className={`size-20 rounded-full mb-6 flex items-center justify-center ${customAlert.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                                {customAlert.type === 'success' ? <CheckCircle2 size={40} /> : <Sparkles size={40} />}
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                                {customAlert.type === 'success' ? 'Mall Notification' : 'Info'}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 font-bold leading-relaxed mb-8">
                                {customAlert.message}
                            </p>
                            <button
                                onClick={() => setCustomAlert({ ...customAlert, isOpen: false })}
                                className="w-full py-4 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95"
                            >
                                Get it!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Background Blobs */}
            <div className="fixed top-[20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="fixed bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-pink-300/10 rounded-full blur-[150px] pointer-events-none -z-10" />

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(153, 153, 153, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(153, 153, 153, 0.4);
                }
                @keyframes shimmer {
                    0% { opacity: 0.9; }
                    50% { opacity: 1; }
                    100% { opacity: 0.9; }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}} />
        </div>
    );
};

export default EditAvatar;