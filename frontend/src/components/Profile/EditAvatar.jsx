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
import { ASSETS, mapModelPath, mapImagePath } from "../../config/assets";

const Logo = ASSETS.BRANDING.LOGO;

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
const AvatarModel = ({ modelPath, yOffset = -3.5, rotation = [0, -Math.PI / 2, 0] }) => {
    const { scene } = useGLTF(modelPath);
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    const ref = useRef();
    return <primitive ref={ref} object={clonedScene} position={[0, -0.8, 0]} scale={9} rotation={rotation} />;
};

/* ================= Page ================= */
const EditAvatar = () => {
    const navigate = useNavigate();
    const { coins, spendCoins } = useCoins();

    const [avatarCatalog, setAvatarCatalog] = useState([]);
    const [roomCatalog, setRoomCatalog] = useState([]);
    const [ownedIds, setOwnedIds] = useState([]);
    const [ownedSceneIds, setOwnedSceneIds] = useState([]);

    // Descriptions/Metadata map for UI enrichment
    const metaMap = {
        "bro": { glow: "from-sky-400 to-blue-600 shadow-sky-400/40", desc: "สบายๆ เหมือนเป็นเพื่อนคนนึง ชิลล์ๆ" },
        "girl": { glow: "from-pink-400 to-rose-500 shadow-pink-400/40", desc: "ใส่ใจเก่งเหมือนเพื่อนสาวสุดซี้ ✨" },
        "bestie": { glow: "from-pink-400 to-rose-500 shadow-pink-400/40", desc: "ใส่ใจเก่งเหมือนเพื่อนสาวสุดซี้ ✨" },
        "nerd": { glow: "from-emerald-400 to-teal-600 shadow-emerald-400/40", desc: "อัจฉริยะด้านข้อมูล แม่นยำมือโปร 🤓" },
        "genius": { glow: "from-emerald-400 to-teal-600 shadow-emerald-400/40", desc: "อัจฉริยะด้านข้อมูล แม่นยำมือโปร 🤓" },
        "nerdroom": { color: "#111827", desc: "สตูดิโอส่วนตัวสไตล์ Nerd ตกแต่งครบชุด! 💻📚" },
        "rock studio": { color: "#1f2937", desc: "สตูดิโอสไตล์ร็อค เท่ๆ ดิบๆ ปลุกพลัง! 🎸🔥" },
        "christmas night": { color: "#166534", desc: "ฉลองคริสต์มาสในห้องแสนอบอุ่น 🎄✨" }
    };

    const visualAvatars = useMemo(() => {
        if (!avatarCatalog.length) return [];
        return avatarCatalog.map(a => {
            const nameKey = a.name.toLowerCase();
            const meta = metaMap[nameKey] || { glow: "from-gray-400 to-gray-600", desc: "เพื่อนคนใหม่" };
            return {
                id: a.id,
                name: a.name,
                model: mapModelPath(a.model_path),
                image: mapImagePath(a.model_path),
                price: a.price,
                glow: meta.glow,
                description: meta.desc
            };
        });
    }, [avatarCatalog]);

    const visualScenes = useMemo(() => {
        if (!roomCatalog.length) return [];
        return roomCatalog.map(r => {
            const nameKey = r.name.toLowerCase();
            const meta = metaMap[nameKey] || { color: "#333", desc: "ห้องใหม่" };
            return {
                id: r.id,
                name: r.name,
                image: mapImagePath(r.image_path),
                model: mapModelPath(r.model_path),
                yOffset: -3.0,
                color: meta.color,
                price: r.price,
                description: meta.desc
            };
        });
    }, [roomCatalog]);

    const [currentTab, setCurrentTab] = useState("avatar");
    const [selectedId, setSelectedId] = useState(null);
    const [selectedSceneId, setSelectedSceneId] = useState(null);

    const [customAlert, setCustomAlert] = useState({ isOpen: false, message: "", type: "info" });
    const showCustomAlert = (message, type = "info") => setCustomAlert({ isOpen: true, message, type });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const syncInventory = async () => {
            try {
                const [ownedAvatars, ownedRooms, allAvatars, allRooms] = await Promise.all([
                    fetchOwnedAvatars(), fetchOwnedRooms(), fetchAvatarCatalog(), fetchRoomCatalog()
                ]);

                setAvatarCatalog(allAvatars);
                setRoomCatalog(allRooms);

                const ownIds = ownedAvatars.map(a => a.id);
                const ownRoomIds = ownedRooms.map(r => r.id);

                setOwnedIds(ownIds);
                setOwnedSceneIds(ownRoomIds);

                // Set initial selection
                const equippedAvatar = ownedAvatars.find(a => a.is_equipped);
                if (equippedAvatar) setSelectedId(equippedAvatar.id);
                else if (allAvatars.length) setSelectedId(allAvatars[0].id);

                const equippedRoom = ownedRooms.find(r => r.is_equipped);
                if (equippedRoom) setSelectedSceneId(equippedRoom.id);
                else if (allRooms.length) setSelectedSceneId(allRooms[0].id);

            } catch (err) { console.error("Sync error:", err); }
        };
        syncInventory();
    }, []);

    const isOwned = (id) => currentTab === "avatar" ? ownedIds.includes(id) : ownedSceneIds.includes(id);

    const handleBuy = async (item) => {
        try {
            if (currentTab === "avatar") {
                const result = await buyAvatarApi(item.id);
                localStorage.setItem("user_coins", String(result.coins_remaining));
                setOwnedIds(prev => [...new Set([...prev, item.id])]);
            } else {
                const result = await buyRoomApi(item.id);
                localStorage.setItem("user_coins", String(result.coins_remaining));
                setOwnedSceneIds(prev => [...new Set([...prev, item.id])]);
            }
            showCustomAlert(`ปลดล็อก ${item.name} สำเร็จแล้ว ✨`, "success");
            window.dispatchEvent(new Event("coinsUpdated"));
        } catch (err) { showCustomAlert(err.response?.data?.detail || "เกิดข้อผิดพลาด", "error"); }
    };

    const handleSave = async () => {
        try {
            if (currentTab === "avatar") {
                if (selectedId) {
                    await equipAvatarApi(selectedId);
                    localStorage.setItem("equipped_avatar_id", selectedId);
                }
                showCustomAlert("บันทึกตัวละครแล้วจ้า! 🌷", "success");
            } else {
                if (selectedSceneId) {
                    await equipRoomApi(selectedSceneId);
                    localStorage.setItem("equipped_room_id", selectedSceneId);
                }
                showCustomAlert("เปลี่ยนฉากเสร็จแล้วนะเพื่อน! 🌸", "success");
            }
            window.dispatchEvent(new Event("avatarUpdated"));
        } catch (err) { showCustomAlert("บันทึกไม่สำเร็จ", "error"); }
    };

    const handleResetToDefault = () => {
        if (currentTab === "avatar") {
            const defaultAvatar = visualAvatars.find(a => a.price === 0) || visualAvatars[0];
            if (defaultAvatar) setSelectedId(defaultAvatar.id);
        } else {
            const defaultRoom = visualScenes.find(s => s.price === 0) || visualScenes[0];
            if (defaultRoom) setSelectedSceneId(defaultRoom.id);
        }
    };

    const activeAvatar = visualAvatars.find(a => a.id === selectedId) || visualAvatars[0] || {};
    const activeScene = visualScenes.find(s => s.id === selectedSceneId) || visualScenes[0] || {};
    const currentItem = currentTab === 'avatar' ? activeAvatar : activeScene;

    if (!visualAvatars.length && !visualScenes.length) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black">LOADING MALL...</div>;
    }

    return (
        <div className="min-h-screen w-full bg-background-light dark:bg-background-dark font-display flex flex-col transition-colors duration-300 relative overflow-x-hidden">
            <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-xl">
                <div className="w-full flex items-center justify-between px-4 py-4 sm:px-10">
                    <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => navigate("/")}>
                        <ArrowLeft className="text-gray-400 mr-2" />
                        <div className="relative size-11 shrink-0 overflow-hidden rounded-2xl bg-white/20 ring-2 ring-pink-300/50 shadow-md">
                            <img src={Logo} alt="Logo" className="h-full w-full object-cover" />
                        </div>
                        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white hidden sm:block">APM Mall</h1>
                    </div>

                    <div className="hidden lg:flex flex-1 justify-center px-4">
                        <Navbar />
                    </div>

                    <div className="flex justify-end gap-3 items-center shrink-0">
                        <div className="flex bg-white/40 dark:bg-white/10 p-1 rounded-xl border border-white/60 dark:border-white/10">
                            <button onClick={() => setCurrentTab("avatar")} className={`px-4 md:px-8 py-2 rounded-xl font-black text-xs md:text-sm transition-all flex items-center gap-2 ${currentTab === 'avatar' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}>
                                <User size={18} /> <span className="hidden xs:inline">Avatars</span>
                            </button>
                            <button onClick={() => setCurrentTab("scene")} className={`px-4 md:px-8 py-2 rounded-xl font-black text-xs md:text-sm transition-all flex items-center gap-2 ${currentTab === 'scene' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}>
                                <ImageIcon size={18} /> <span className="hidden xs:inline">Scenes</span>
                            </button>
                        </div>
                        <div className="hidden sm:block">
                            <CoinBadge />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col gap-6 md:gap-10 w-full px-4 md:px-10 py-6 md:py-10 relative z-10">
                {/* Preview Section - Full Width top */}
                <div className="relative flex flex-col items-center justify-center min-h-[400px] md:min-h-[650px] rounded-[40px] md:rounded-[64px] border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden transition-all duration-700 bg-white/5" style={{ backgroundColor: activeScene.color }}>
                    <div className="absolute inset-0">
                        {activeScene.image && <img src={activeScene.image} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="background" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <Canvas camera={{ position: [0, 0, 11], fov: 45 }} className="z-10 absolute inset-0 cursor-grab active:cursor-grabbing">
                            <ambientLight intensity={1.5} />
                            <pointLight position={[10, 10, 10]} intensity={1.5} />
                            <directionalLight position={[0, 10, 5]} intensity={2} />
                            <Suspense fallback={<Loader />}>
                                {currentTab === 'avatar' && (
                                    <AvatarModel
                                        key={activeAvatar.id}
                                        modelPath={activeAvatar.model}
                                        yOffset={activeScene.yOffset || -4.5}
                                    />
                                )}
                            </Suspense>
                            <OrbitControls autoRotate={false} enableZoom={true} enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={3} maxDistance={12} />
                        </Canvas>
                    </div>

                    <div className="mt-auto p-6 md:p-12 z-20 text-center w-full">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-3 md:mb-4">
                            {currentTab === 'avatar' ? 'Character Preview' : 'Scene Preview'}
                        </span>
                        <h2 className="text-2xl md:text-5xl font-black text-white drop-shadow-lg mb-1 md:mb-3">{currentItem.name}</h2>
                        <p className="text-white/80 font-bold mb-6 md:mb-10 italic drop-shadow-md text-sm md:text-xl max-w-2xl mx-auto">{currentItem.description}</p>
                        <div className="flex gap-3 md:gap-6 justify-center">
                            {isOwned(currentItem.id) ? (
                                <button onClick={handleSave} className="px-10 py-3.5 md:px-16 md:py-6 rounded-[22px] md:rounded-[32px] bg-white text-gray-900 font-black text-sm md:text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 md:border-4 border-transparent hover:border-white/50 flex items-center gap-3">
                                    <CheckCircle2 size={24} className="text-emerald-500" /> {currentTab === 'avatar' ? 'สวมใส่ ✨' : 'ใช้ฉากนี้ 🌸'}
                                </button>
                            ) : (
                                <button onClick={() => handleBuy(currentItem)} className="px-10 py-3.5 md:px-16 md:py-6 rounded-[22px] md:rounded-[32px] bg-yellow-400 text-yellow-900 font-black text-sm md:text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 md:border-4 border-yellow-200/50 flex items-center gap-3">
                                    <ShoppingCart size={24} /> {currentItem.price} Coins 🪙
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Catalog Section - Horizontal Full Width at bottom */}
                <div className="w-full">
                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[32px] md:rounded-[48px] p-5 md:p-8 border border-white/60 dark:border-white/10 shadow-xl flex flex-col">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <h3 className="font-black text-lg md:text-2xl text-gray-800 dark:text-white flex items-center gap-3">
                                <Sparkles className="text-primary" size={24} /> {currentTab === 'avatar' ? 'Characters Library' : 'Scenes Collection'}
                            </h3>
                            <button onClick={handleResetToDefault} className="p-2 md:p-3 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-red-500 transition-all active:scale-90 shadow-sm border border-transparent hover:border-red-200">
                                <Trash2 size={20} />
                            </button>
                        </div>
                        
                        <div className="flex flex-row gap-4 md:gap-6 overflow-x-auto pb-4 custom-scrollbar-horizontal scroll-smooth snap-x touch-pan-x">
                            {(currentTab === 'avatar' ? visualAvatars : visualScenes).map(item => {
                                const active = currentTab === 'avatar' ? item.id === selectedId : item.id === selectedSceneId;
                                const owned = isOwned(item.id);
                                return (
                                    <button 
                                        key={item.id} 
                                        onClick={() => currentTab === 'avatar' ? setSelectedId(item.id) : setSelectedSceneId(item.id)} 
                                        className={`flex-shrink-0 w-28 md:w-44 snap-start group relative flex flex-col items-center gap-3 p-3 md:p-5 rounded-[24px] md:rounded-[36px] border-2 transition-all duration-300
                                            ${active 
                                                ? 'bg-white dark:bg-white/10 border-primary shadow-2xl ring-4 ring-primary/10 scale-[1.05] z-10' 
                                                : 'bg-white/20 hover:bg-white/40 border-transparent hover:scale-[1.02]'}
                                        `}
                                    >
                                        <div className="relative size-14 md:size-24 shrink-0">
                                            {item.image ? (
                                                <img src={item.image} className={`w-full h-full shadow-lg transition-transform duration-500 group-hover:rotate-3 ${currentTab === 'avatar' ? 'rounded-full' : 'rounded-2xl object-cover'}`} alt={item.name} />
                                            ) : (
                                                <div className="w-full h-full rounded-2xl" style={{ backgroundColor: item.color }} />
                                            )}
                                            {!owned && (
                                                <div className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center ${currentTab === 'avatar' ? 'rounded-full' : 'rounded-2xl'}`}>
                                                    <Lock size={20} className="text-white drop-shadow-md" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col items-center text-center w-full min-w-0">
                                            <span className={`font-black text-[10px] md:text-base truncate w-full ${active ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                                                {item.name.split(' - ')[0]}
                                            </span>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                {owned ? (
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 text-[8px] md:text-[10px] font-black uppercase">
                                                       <CheckCircle2 size={12} /> Owned
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-[9px] md:text-[12px] font-black">
                                                        <Coins size={12} /> {item.price}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>

            {customAlert.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl p-8 flex flex-col items-center text-center">
                        <div className={`size-20 rounded-full mb-6 flex items-center justify-center ${customAlert.type === 'success' ? 'bg-emerald-100 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                            {customAlert.type === 'success' ? <CheckCircle2 size={40} /> : <Sparkles size={40} />}
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{customAlert.type === 'success' ? 'Success!' : 'Info'}</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">{customAlert.message}</p>
                        <button onClick={() => setCustomAlert({ ...customAlert, isOpen: false })} className="w-full py-4 rounded-2xl bg-primary text-white font-black text-lg">Get it!</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditAvatar;