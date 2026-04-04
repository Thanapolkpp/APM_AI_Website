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
import Private_room from "../../assets/NERD_ROOM.png";
import rock_room from "../../assets/Rock_Room.png";
import Chirtmas_room from "../../assets/Chirtmas_room.png";
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

    const avatars = useMemo(() => [
        {
            id: "bro",
            name: "Bro - The Chill Friend",
            model: "/models/bro.glb",
            image: broImg,
            price: 15,
            glow: "from-sky-400 to-blue-600 shadow-[0_0_25px_rgba(56,189,248,0.4)]",
            description: "สบายๆ เหมือนเป็นเพื่อนคนนึง คุยได้ทุกเรื่องแบบแมนๆ ชิลล์ๆ"
        },
        {
            id: "girl",
            name: "Bestie - The Motivator",
            model: "/models/girl.glb",
            image: girlImg,
            price: 15,
            glow: "from-pink-400 to-rose-500 shadow-[0_0_25px_rgba(244,114,182,0.4)]",
            description: "ใส่ใจทุกรายละเอียด ให้กำลังใจเก่งเหมือนเพื่อนสาวสุดซี้ ✨"
        },
        {
            id: "nerd",
            name: "Genius - The Specialist",
            model: "/models/nerd.glb",
            image: nerdImg,
            price: 15,
            glow: "from-emerald-400 to-teal-600 shadow-[0_0_25px_rgba(52,211,153,0.4)]",
            description: "อัจฉริยะด้านข้อมูล แม่นยำ และช่วยวางแผนการเรียนแบบมือโปร 🤓"
        }
    ], []);

    const scenes = useMemo(() => [
        {
            id: "nerdroom",
            name: "Nerd - Private Studio",
            image: Private_room,
            dbPath: "NERD_ROOM.png",
            yOffset: -3.0,
            color: "#111827",
            price: 15,
            description: "สตูดิโอส่วนตัวสไตล์ Nerd ตกแต่งครบชุด เพิ่มไฟการเรียน! 💻📚"
        },
        {
            id: "rock",
            name: "Rock Studio",
            image: rock_room,
            dbPath: "Rock_Room.png",
            yOffset: -2.5,
            color: "#1f2937",
            price: 15,
            description: "สตูดิโอสไตล์ร็อค เท่ๆ ดิบๆ ปลุกพลังในตัวคุณ! 🎸🔥"
        },
        {
            id: "christmas",
            name: "Christmas Night",
            image: Chirtmas_room,
            dbPath: "Chirtmas_room.png",
            yOffset: -2.7,
            color: "#166534",
            price: 15,
            description: "ฉลองคริสต์มาสในห้องแสนอบอุ่น พร้อมต้นสนและของขวัญ 🎄✨"
        }
    ], []);

    const [currentTab, setCurrentTab] = useState("avatar");
    const [selectedId, setSelectedId] = useState("bro");
    const [selectedSceneId, setSelectedSceneId] = useState("nerdroom");

    const [ownedIds, setOwnedIds] = useState(() => JSON.parse(localStorage.getItem("owned_avatars") || '["nerd"]'));
    const [ownedSceneIds, setOwnedSceneIds] = useState(() => JSON.parse(localStorage.getItem("owned_scenes") || '["nerdroom"]'));

    const [customAlert, setCustomAlert] = useState({ isOpen: false, message: "", type: "info" });
    const showCustomAlert = (message, type = "info") => setCustomAlert({ isOpen: true, message, type });

    const normalize = (p) => {
        if (!p || typeof p !== 'string' || p.startsWith('data:')) return "unknown_" + Math.random();
        const parts = p.split(/[/\\]/);
        const filename = parts[parts.length - 1];
        return filename.split('-')[0].split('.')[0].toLowerCase();
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const syncInventory = async () => {
            try {
                const [avatarsData, roomsData, allAvatarsData, allRoomsData] = await Promise.all([
                    fetchOwnedAvatars(), fetchOwnedRooms(), fetchAvatarCatalog(), fetchRoomCatalog()
                ]);
                setAvatarCatalog(allAvatarsData);
                setRoomCatalog(allRoomsData);

                const dbAvatarIds = avatarsData.map(a => {
                    const match = avatars.find(fe => normalize(fe.model) === normalize(a.model_path));
                    return match?.id;
                }).filter(Boolean);

                const dbSceneIds = roomsData.map(r => {
                    const match = scenes.find(fe => (fe.dbPath && normalize(fe.dbPath) === normalize(r.image_path)) || (fe.model && normalize(fe.model) === normalize(r.image_path)));
                    return match?.id;
                }).filter(Boolean);

                const finalAvatars = dbAvatarIds.length ? dbAvatarIds : ["nerd"];
                const finalScenes = dbSceneIds.length ? dbSceneIds : ["nerdroom"];
                setOwnedIds(finalAvatars);
                setOwnedSceneIds(finalScenes);
                localStorage.setItem("owned_avatars", JSON.stringify(finalAvatars));
                localStorage.setItem("owned_scenes", JSON.stringify(finalScenes));

                const equippedAvatar = avatarsData.find(a => a.is_equipped);
                if (equippedAvatar) {
                    const match = avatars.find(fe => normalize(fe.model) === normalize(equippedAvatar.model_path));
                    if (match) setSelectedId(match.id);
                }

                const equippedRoom = roomsData.find(r => r.is_equipped);
                if (equippedRoom) {
                    const match = scenes.find(fe => (fe.dbPath && normalize(fe.dbPath) === normalize(equippedRoom.image_path)) || (fe.model && normalize(fe.model) === normalize(equippedRoom.image_path)));
                    if (match) setSelectedSceneId(match.id);
                }
            } catch (err) { console.error("Sync error:", err); }
        };
        syncInventory();
    }, [avatars, scenes]);

    const isOwned = (id) => currentTab === "avatar" ? ownedIds.includes(id) : ownedSceneIds.includes(id);

    const handleBuy = async (item) => {
        try {
            if (currentTab === "avatar") {
                const catalogItem = avatarCatalog.find(a => normalize(a.model_path) === normalize(item.model));
                if (!catalogItem) return showCustomAlert("ไม่พบ Avatar ในระบบ", "error");
                const result = await buyAvatarApi(catalogItem.id);
                localStorage.setItem("user_coins", String(result.coins_remaining));
                setOwnedIds(prev => [...new Set([...prev, item.id])]);
            } else {
                const catalogItem = roomCatalog.find(r => (r.image_path && (normalize(r.image_path) === normalize(item.dbPath) || normalize(r.image_path) === normalize(item.model))));
                if (!catalogItem) return showCustomAlert("ไม่พบ Room ในระบบ กรุณาลองใหม่ (Seed DB?)", "error");
                const result = await buyRoomApi(catalogItem.id);
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
                localStorage.setItem("avatar", selectedId);
                const catalogItem = avatarCatalog.find(a => normalize(a.model_path) === normalize(activeAvatar.model));
                if (catalogItem) await equipAvatarApi(catalogItem.id);
                showCustomAlert("บันทึกตัวละครแล้วจ้า! 🌷", "success");
            } else {
                localStorage.setItem("current_scene", selectedSceneId);
                const catalogItem = roomCatalog.find(r => (r.image_path && (normalize(r.image_path) === normalize(activeScene.dbPath) || normalize(r.image_path) === normalize(activeScene.model))));
                if (catalogItem) await equipRoomApi(catalogItem.id);
                showCustomAlert("เปลี่ยนฉากเสร็จแล้วนะเพื่อน! 🌸", "success");
            }
            window.dispatchEvent(new Event("avatarUpdated"));
        } catch (err) { showCustomAlert("บันทึกไม่สำเร็จ", "error"); }
    };

    const handleResetToDefault = () => {
        if (currentTab === "avatar") setSelectedId("nerd");
        else setSelectedSceneId("nerdroom");
    };

    const activeAvatar = avatars.find(a => a.id === selectedId) || avatars[0];
    const activeScene = scenes.find(s => s.id === selectedSceneId) || scenes[0];
    const currentItem = currentTab === 'avatar' ? activeAvatar : activeScene;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col transition-colors duration-300 relative">
            <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-xl">
                <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-4 py-4 sm:px-6">
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
                            <button onClick={() => setCurrentTab("avatar")} className={`px-6 py-2 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${currentTab === 'avatar' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}>
                                <User size={18} /> Avatars
                            </button>
                            <button onClick={() => setCurrentTab("scene")} className={`px-6 py-2 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${currentTab === 'scene' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}>
                                <ImageIcon size={18} /> Scenes
                            </button>
                        </div>
                        <CoinBadge />
                    </div>
                </div>
            </header>

            <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 max-w-7xl w-full mx-auto px-6 py-10 relative z-10">
                <div className="relative flex flex-col items-center justify-center min-h-[550px] rounded-[64px] border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden transition-all duration-700" style={{ backgroundColor: activeScene.color }}>
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

                    <div className="mt-auto p-12 z-20 text-center w-full">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            {currentTab === 'avatar' ? 'Character Preview' : 'Scene Preview'}
                        </span>
                        <h2 className="text-4xl font-black text-white drop-shadow-lg mb-2">{currentItem.name}</h2>
                        <p className="text-white/80 font-bold mb-8 italic drop-shadow-md text-lg">{currentItem.description}</p>
                        <div className="flex gap-4 justify-center">
                            {isOwned(currentItem.id) ? (
                                <button onClick={handleSave} className="px-12 py-5 rounded-[28px] bg-white text-gray-900 font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-transparent hover:border-white/50">
                                    <CheckCircle2 size={24} className="text-emerald-500" /> {currentTab === 'avatar' ? 'สวมใส่ตัวละคร ✨' : 'ใช้ฉากนี้จ้า 🌸'}
                                </button>
                            ) : (
                                <button onClick={() => handleBuy(currentItem)} className="px-12 py-5 rounded-[28px] bg-yellow-400 text-yellow-900 font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-yellow-200/50">
                                    <ShoppingCart size={24} /> ปลดล็อก {currentItem.price} Coins 🪙
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[48px] p-10 border border-white/60 dark:border-white/10 shadow-xl flex flex-col h-[550px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-2xl text-gray-800 dark:text-white flex items-center gap-2">
                                <Sparkles className="text-primary" size={28} /> {currentTab === 'avatar' ? 'Character Mall' : 'Scene Mall'}
                            </h3>
                            <button onClick={handleResetToDefault} className="p-3 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-red-500 group">
                                <Trash2 size={20} className="group-hover:animate-bounce" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                            {(currentTab === 'avatar' ? avatars : scenes).map(item => {
                                const active = currentTab === 'avatar' ? item.id === selectedId : item.id === selectedSceneId;
                                const owned = isOwned(item.id);
                                return (
                                    <button key={item.id} onClick={() => currentTab === 'avatar' ? setSelectedId(item.id) : setSelectedSceneId(item.id)} className={`w-full group relative flex items-center gap-5 p-5 rounded-[32px] border-2 transition-all ${active ? 'bg-white dark:bg-white/10 border-primary shadow-xl scale-[1.02]' : 'bg-white/20 hover:bg-white/40 border-transparent hover:scale-[1.01]'}`}>
                                        <div className="relative shrink-0">
                                            {item.image ? <img src={item.image} className={`w-16 h-16 shadow-lg ${currentTab === 'avatar' ? 'rounded-full' : 'rounded-2xl object-cover'}`} alt={item.name} /> : <div className="w-16 h-16 rounded-2xl" style={{ backgroundColor: item.color }} />}
                                            {!owned && <div className={`absolute inset-0 bg-black/60 flex items-center justify-center ${currentTab === 'avatar' ? 'rounded-full' : 'rounded-2xl'}`}><Lock size={20} className="text-white" /></div>}
                                        </div>
                                        <div className="flex flex-col items-start text-left">
                                            <span className="font-black text-gray-900 dark:text-white text-lg">{item.name.split(' - ')[0]}</span>
                                            <div className="text-xs font-bold uppercase tracking-widest mt-1">
                                                {owned ? (
                                                    <span className="text-emerald-500 flex items-center gap-1.5"><CheckCircle2 size={14} /> Owned</span>
                                                ) : (
                                                    <span className="text-yellow-600 dark:text-yellow-400 flex items-center gap-1.5"><Coins size={14} /> {item.price} Coins</span>
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