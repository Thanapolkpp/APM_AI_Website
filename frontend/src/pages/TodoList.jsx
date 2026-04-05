import React, { useState, useEffect, Suspense, useMemo, useRef } from "react"
import { Trash2, CheckCircle2, Circle, Trophy, Sparkles, User, Heart, Star, Layout, X, Info } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Html, useProgress } from "@react-three/drei"
import Navbar from "../components/Layout/Navbar"
import Footer from "../components/Layout/footer"
import CoinBadge from "../components/UI/CoinBadge"
import { useCoins } from "../hooks/useCoins"
import { 
    fetchTodos, createTodo, toggleTodo, deleteTodo, updateExp,
    getUserProfile, fetchOwnedAvatars, fetchOwnedRooms,
    uploadTodoProof, verifyTodo, fetchPendingTodos
} from "../services/aiService"
import { ASSETS, mapModelPath, mapImagePath } from "../config/assets"

const Logo = ASSETS.BRANDING.LOGO;

/* ================= Loader ================= */
const Loader = () => {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center gap-2 w-32 text-center bg-black/20 backdrop-blur-md p-4 rounded-3xl">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white font-black text-[10px] tracking-widest">{Math.round(progress)}%</p>
            </div>
        </Html>
    );
};

/* ================= Avatar Model ================= */
const AvatarModel = ({ modelPath, rotation = [0, -Math.PI / 2, 0] }) => {
    const { scene } = useGLTF(modelPath);
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    // ปรับ Scale ให้พอดีขึ้น (จาก 9 เป็น 4.5)
    return <primitive object={clonedScene} position={[0, -2.5, 0]} scale={9} rotation={rotation} />;
};

/* ================= Level Bar Component ================= */
const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200];
const LEVEL_THEMES = {
    1: { from: "#92400e", to: "#d97706", name: "Bronze", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368522/Broze_xwm5gg.png" },
    2: { from: "#475569", to: "#cbd5e1", name: "Silver", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368517/Sliver_ea2lid.png" },
    3: { from: "#b45309", to: "#fbbf24", name: "Gold", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368525/Gold_bglivb.png" },
    4: { from: "#0f172a", to: "#94a3b8", name: "Platinum", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368536/Plat_rakik4.png" },
    5: { from: "#0e7490", to: "#67e8f9", name: "Diamond", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368517/Diamond_gjekkx.png" },
    6: { from: "#5b21b6", to: "#c084fc", name: "Master", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368537/Master_ypfzxo.png" },
    7: { from: "#7f1d1d", to: "#f87171", name: "Legend", img: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775368533/Legen_vts5jo.png" },
};

const LevelBar = ({ exp = 0, onInfoClick }) => {
    let level = 1;
    let nextThreshold = LEVEL_THRESHOLDS[1];
    let currentThreshold = 0;

    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
        if (exp >= LEVEL_THRESHOLDS[i]) {
            level = i + 1;
            currentThreshold = LEVEL_THRESHOLDS[i];
            nextThreshold = LEVEL_THRESHOLDS[i + 1] || null;
        } else {
            break;
        }
    }

    const expInLevel = exp - currentThreshold;
    const expNeeded = nextThreshold ? nextThreshold - currentThreshold : 1; 
    const percentage = nextThreshold ? Math.min((expInLevel / expNeeded) * 100, 100) : 100;
    const theme = LEVEL_THEMES[level] || LEVEL_THEMES[7];
    
    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                    <div 
                        className="bg-white/80 dark:bg-black/20 p-1 rounded-lg shadow-sm border border-white/50"
                    >
                        <img src={theme.img} alt={theme.name} className="size-5 object-contain" />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{theme.name} • LV. {level}</span>
                </div>
                <button 
                    onClick={onInfoClick}
                    className="flex items-center gap-1 text-[10px] font-black text-gray-400 hover:text-primary transition-colors uppercase tracking-widest"
                >
                    <Info size={12}/> Rank Info
                </button>
            </div>
            <div className="h-2.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden border border-white/50 dark:border-white/10 shadow-inner">
                <div 
                    className="h-full transition-all duration-1000" 
                    style={{ 
                        width: `${percentage}%`,
                        background: `linear-gradient(to right, ${theme.from}, ${theme.to})`,
                        boxShadow: `0 0 10px ${theme.from}66`
                    }}
                />
            </div>
            <div className="flex justify-end">
                <span className="text-[9px] font-black" style={{ color: theme.from }}>
                    {nextThreshold ? `${expInLevel}/${expNeeded} XP TO NEXT RANK` : "MAX RANK REACHED"}
                </span>
            </div>
        </div>
    );
};

/* ================= Rank Info Modal ================= */
const RankInfoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[48px] overflow-hidden shadow-2xl border border-white/20 p-10 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                        <Trophy className="text-yellow-500" size={32}/> Rank Progression
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-all">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>
                <div className="space-y-4 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(LEVEL_THEMES).map(([lvl, theme], idx) => (
                        <div key={lvl} className="flex items-center justify-between p-5 rounded-[28px] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 group hover:scale-[1.02] transition-all">
                            <div className="flex items-center gap-4">
                                <div 
                                    className="size-16 rounded-2xl flex items-center justify-center p-2 bg-white dark:bg-white/5 shadow-lg ring-4 ring-gray-50 dark:ring-white/5"
                                >
                                    <img src={theme.img} alt={theme.name} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <p className="font-black text-xl text-gray-800 dark:text-white">{theme.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 tracking-[.2em]">LEVEL {lvl}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-lg text-primary">{LEVEL_THRESHOLDS[idx] || 0} XP</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Required</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className="w-full mt-8 py-5 rounded-3xl bg-primary text-white font-black text-xl shadow-xl shadow-primary/30 active:scale-95 transition-all">
                    เข้าใจแล้วจ้า!
                </button>
            </div>
        </div>
    );
};

/* ================= Page ================= */
const TodoList = () => {
    
    const navigate = useNavigate()
    const { addCoins } = useCoins()
    
    const [isRankModalOpen, setIsRankModalOpen] = useState(false)
    const [tasks, setTasks] = useState([])
    const [newTask, setNewTask] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [userProfile, setUserProfile] = useState(null)
    
    const [equippedAvatar, setEquippedAvatar] = useState(null)
    const [equippedRoom, setEquippedRoom] = useState(null)
    
    // [Admin Feature]
    const [isAdminView, setIsAdminView] = useState(false)
    const [pendingTasks, setPendingTasks] = useState([])
    
    const [proofPhotos, setProofPhotos] = useState({})
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://apm-ai-website.onrender.com"

    // logic for proof photo mapping
    useEffect(() => {
        const photos = {}
        // map from tasks
        tasks.forEach(todo => {
            if (todo.proof_image) {
                photos[todo.id] = `${API_BASE_URL}${todo.proof_image}`
            }
        })
        // map from pendingTasks
        pendingTasks.forEach(todo => {
            if (todo.proof_image) {
                photos[todo.id] = `${API_BASE_URL}${todo.proof_image}`
            }
        })
        setProofPhotos(photos)
    }, [tasks, pendingTasks])
    
    // Load Initial Data
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) { navigate("/login"); return }

        const loadData = async () => {
            try {
                const [todos, profile, avatars, rooms] = await Promise.all([
                    fetchTodos(),
                    getUserProfile(),
                    fetchOwnedAvatars(),
                    fetchOwnedRooms()
                ]);
                
                setTasks(todos);
                setUserProfile(profile);
                
                const activeAvatar = avatars.find(a => a.is_equipped) || avatars[0];
                const activeRoom = rooms.find(r => r.is_equipped) || rooms[0];
                
                // Fallback: หากไม่มีข้อมูล ให้ใช้ค่า Default เพื่อให้เห็น Model เสมอ
                const displayAvatar = activeAvatar || { name: "Bro", model_path: "bro" };
                const displayRoom = activeRoom || { name: "Nerd Room", image_path: "nerd_room" };

                setEquippedAvatar({
                    ...displayAvatar,
                    model: mapModelPath(displayAvatar.model_path)
                });
                
                setEquippedRoom({
                    ...displayRoom,
                    image: mapImagePath(displayRoom.image_path)
                });

            } catch (err) {
                console.error("Load error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [navigate]);

    useEffect(() => {
        if (isAdminView) {
            fetchPendingTodos().then(setPendingTasks).catch(console.error);
        }
    }, [isAdminView]);

    const handleVerify = async (id, status) => {
        try {
            await verifyTodo(id, status);
            alert(`Verified as ${status}!`);
            const pending = await fetchPendingTodos();
            setPendingTasks(pending);
            // Also refresh profile in case rewards were granted
            const profile = await getUserProfile();
            setUserProfile(profile);
            // Also refresh task list
            const updated = await fetchTodos();
            setTasks(updated);
        } catch (err) { alert("เกิดข้อผิดพลาดในการตรวจสอบ"); }
    }

    const addTask = async (e) => {
        e.preventDefault()
        if (!newTask.trim()) return
        try {
            const created = await createTodo(newTask.trim())
            setTasks(prev => [...prev, created])
            setNewTask("")
        } catch { alert("ไม่สามารถเพิ่ม Todo ได้ในขณะนี้") }
    }

    const handleToggle = async (id) => {
        try {
            const updated = await toggleTodo(id)
            setTasks(prev => prev.map(t => t.id === id ? { ...t, is_completed: updated.is_completed } : t))
            
            if (updated.is_completed) {
                // Calculate current rank
                let currentLevel = 1;
                const currentExp = userProfile?.exp || 0;
                for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
                    if (currentExp >= LEVEL_THRESHOLDS[i]) {
                        currentLevel = i + 1;
                    } else {
                        break;
                    }
                }

                // Rank Bonus Mapping
                const bonusMap = {
                    3: 0.5, // Gold
                    4: 1.0, // Platinum
                    5: 1.2, // Diamond
                    6: 1.5, // Master
                    7: 2.0  // Legend
                };
                
                const bonusFactor = bonusMap[currentLevel] || 0;
                const baseCoins = 1;
                const baseExp = 5;
                
                // Final Rewards calculation
                const finalCoins = Math.floor(baseCoins * (1 + bonusFactor));
                const finalExp = Math.floor(baseExp * (1 + bonusFactor));

                await addCoins(finalCoins)
                await updateExp(finalExp)
                
                // Refresh profile to see new EXP/Coins
                const profile = await getUserProfile();
                setUserProfile(profile);
            }
        } catch (err) { 
            console.error("Toggle error:", err);
            alert("เกิดข้อผิดพลาด"); 
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteTodo(id)
            setTasks(prev => prev.filter(t => t.id !== id))
        } catch { alert("ไม่สามารถลบ Todo ได้") }
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col transition-colors duration-300">
            <header className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/60 dark:bg-black/20 backdrop-blur-xl transition-all">
                <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
                        <div className="relative size-12 rounded-2xl bg-white shadow-xl ring-2 ring-pink-100 flex items-center justify-center overflow-hidden">
                            <img src={Logo} alt="Logo" className="size-8 object-contain transition duration-500 hover:scale-110" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-black text-gray-900 dark:text-white leading-tight">APM Quest</h1>
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gamified Tasks 🏆</p>
                                {(userProfile?.is_admin || isAdminView) && (
                                    <button 
                                        onClick={() => setIsAdminView(!isAdminView)}
                                        className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase transition-all ${isAdminView ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                    >
                                        Admin {isAdminView ? 'ON' : 'OFF'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:flex flex-1 justify-center px-4">
                        <Navbar />
                    </div>
                    <div className="flex justify-end items-center gap-3 sm:gap-4 shrink-0">
                        <div className="hidden sm:block">
                            <CoinBadge className="scale-90" />
                        </div>
                        {userProfile && (
                             <img 
                                src={mapImagePath(equippedAvatar?.model_path || "bro")} 
                                className="size-10 rounded-2xl border-2 border-white dark:border-white/10 shadow-lg bg-white/20 object-cover cursor-pointer hover:scale-110 transition-transform" 
                                alt="Avatar"
                                onClick={() => navigate("/account")}
                             />
                        )}
                        <div className="lg:hidden">
                            <Navbar />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
                {/* Left Side: Tasks or Admin View */}
                <div className="space-y-10">
                    {isAdminView ? (
                        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[48px] border border-white/60 dark:border-white/10 p-10 shadow-2xl">
                            <div className="mb-10 flex justify-between items-center">
                                <div>
                                    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                                        Admin Verification <Sparkles className="text-primary" size={32}/>
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs">ตรวจสอบหลักฐานภารกิจและสถานะทั้งหมด</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="px-6 py-3 bg-primary/10 rounded-2xl border border-primary/20">
                                        <span className="font-black text-primary">{pendingTasks.length} VERIFICATIONS</span>
                                    </div>
                                    <button 
                                        onClick={() => setIsAdminView(false)}
                                        className="px-6 py-3 rounded-2xl bg-gray-100 dark:bg-white/10 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/20 transition-all flex items-center gap-2"
                                    >
                                        Exit Admin Mode
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-separate border-spacing-y-4">
                                    <thead>
                                        <tr className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">
                                            <th className="px-6 pb-2">User 👤</th>
                                            <th className="px-6 pb-2">Task 🎯</th>
                                            <th className="px-6 pb-2">Proof 📸</th>
                                            <th className="px-6 pb-2">Status 🚦</th>
                                            <th className="px-6 pb-2">Date 📅</th>
                                            <th className="px-6 pb-2 text-right">Actions ✨</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingTasks.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="py-20 text-center bg-gray-50 dark:bg-white/5 rounded-[48px] border-4 border-dashed border-gray-100 dark:border-white/5">
                                                     <p className="text-gray-400 font-black text-xl">ยังไม่มีภารกิจรอตรวจสอบจ้า!</p>
                                                </td>
                                            </tr>
                                        )}
                                        {pendingTasks.map(todo => (
                                            <tr key={todo.id} className={`group bg-white/60 dark:bg-white/10 hover:bg-white hover:scale-[1.01] transition-all duration-300 shadow-sm first-of-type:rounded-t-3xl ${todo.status !== 'pending' ? 'opacity-70' : ''}`}>
                                                <td className="px-6 py-6 rounded-l-[32px]">
                                                    <span className="font-black text-gray-800 dark:text-white">{todo.username}</span>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <span className="font-bold text-gray-600 dark:text-white/60">{todo.task_text}</span>
                                                </td>
                                                 <td className="px-6 py-6">
                                                     {proofPhotos[todo.id] ? (
                                                        <div className="relative size-16 rounded-2xl overflow-hidden bg-gray-200 cursor-pointer hover:scale-150 transition-transform z-10 hover:shadow-2xl">
                                                            <img 
                                                                src={proofPhotos[todo.id]} 
                                                                className="w-full h-full object-cover" 
                                                                alt="proof"
                                                                onClick={() => window.open(proofPhotos[todo.id], '_blank')}
                                                            />
                                                        </div>
                                                     ) : (
                                                        <div className="size-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-300">
                                                            <Info size={20}/>
                                                        </div>
                                                     )}
                                                 </td>
                                                <td className="px-6 py-6">
                                                    {todo.status === "pending" && <span className="px-3 py-1 bg-yellow-400/20 text-yellow-600 text-[10px] font-black uppercase rounded-full">Pending</span>}
                                                    {todo.status === "accepted" && <span className="px-3 py-1 bg-green-400/20 text-green-600 text-[10px] font-black uppercase rounded-full">Verified</span>}
                                                    {todo.status === "rejected" && <span className="px-3 py-1 bg-red-400/20 text-red-600 text-[10px] font-black uppercase rounded-full">Rejected</span>}
                                                </td>
                                                <td className="px-6 py-6">
                                                    <span className="text-[11px] font-black text-gray-400">{new Date(todo.created_at).toLocaleDateString()}</span>
                                                </td>
                                                <td className="px-6 py-6 rounded-r-[32px] text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleVerify(todo.id, "accepted")}
                                                            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${todo.status === 'accepted' ? 'bg-green-600 scale-95 opacity-50 cursor-default' : 'bg-green-500 hover:scale-105 active:scale-95 shadow-green-500/20'}`}
                                                            disabled={todo.status === 'accepted'}
                                                        >
                                                            ยืนยัน
                                                        </button>
                                                        <button 
                                                            onClick={() => handleVerify(todo.id, "rejected")}
                                                            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${todo.status === 'rejected' ? 'bg-red-600 scale-95 opacity-50 cursor-default' : 'bg-red-500 hover:scale-105 active:scale-95 shadow-red-500/20'}`}
                                                            disabled={todo.status === 'rejected'}
                                                        >
                                                            ปฏิเสธ
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                                        Checklists <Trophy className="text-yellow-500" size={32}/>
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px]">ทำเควสให้สำเร็จเพื่อรับ Coins และเพิ่มค่าความหนิท!</p>
                                </div>
                                
                                {userProfile?.is_admin && (
                                    <button 
                                        onClick={() => setIsAdminView(true)}
                                        className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-primary/10 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/10"
                                    >
                                        <Sparkles size={16} />
                                        Switch to Admin Mode
                                    </button>
                                )}
                            </div>

                    <form onSubmit={addTask} className="relative group">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="เพิ่มภารกิจใหม่..."
                            className="w-full bg-white/40 dark:bg-white/5 backdrop-blur-xl border-2 border-white/60 dark:border-white/10 rounded-[32px] px-8 py-6 text-lg font-bold focus:outline-none focus:border-primary transition-all pr-24 shadow-xl"
                        />
                        <button type="submit" className="absolute right-3 top-3 bottom-3 px-6 rounded-2xl bg-primary text-white font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                            เพิ่ม
                        </button>
                    </form>

                    <div className="space-y-4">
                        {tasks.length === 0 && !isLoading && (
                            <div className="py-20 text-center bg-white/20 dark:bg-white/5 rounded-[48px] border-4 border-dashed border-gray-100 dark:border-white/5">
                                <p className="text-gray-400 font-black text-xl">ยังไม่มีภารกิจเลยเพื่อน...</p>
                            </div>
                        )}
                        {tasks.map(task => (
                            <div key={task.id} className={`group flex items-center gap-5 p-6 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[32px] transition-all hover:shadow-xl hover:scale-[1.01] ${task.is_completed ? 'opacity-60' : ''}`}>
                                <button onClick={() => handleToggle(task.id)} className={`shrink-0 text-primary transition-all hover:scale-110`}>
                                    {task.is_completed ? <CheckCircle2 size={32} className="fill-primary text-white" /> : <Circle size={32} className="text-gray-300 group-hover:text-primary" />}
                                </button>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        {task.status === "pending" && <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 text-[8px] font-black uppercase rounded-full">Pending Verification</span>}
                                        {task.status === "accepted" && <span className="px-2 py-0.5 bg-green-400/20 text-green-600 dark:text-green-400 text-[8px] font-black uppercase rounded-full">Verified</span>}
                                        {task.status === "rejected" && <span className="px-2 py-0.5 bg-red-400/20 text-red-600 dark:text-red-400 text-[8px] font-black uppercase rounded-full">Rejected</span>}
                                    </div>
                                    <span className={`text-xl font-bold dark:text-white ${task.is_completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                        {task.task_text}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    {proofPhotos[task.id] && (
                                        <div className="relative size-12 rounded-xl overflow-hidden bg-gray-100 border border-white/40 cursor-pointer hover:scale-110 transition-transform shadow-lg group-hover:shadow-2xl">
                                            <img 
                                                src={proofPhotos[task.id]} 
                                                className="w-full h-full object-cover" 
                                                alt="proof" 
                                                onClick={() => window.open(proofPhotos[task.id], '_blank')}
                                            />
                                        </div>
                                    )}
                                    {/* Upload Button */}
                                    <label className="cursor-pointer p-3 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-primary transition-all">
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            onChangeCapture={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const res = await uploadTodoProof(task.id, file);
                                                    alert("ส่งหลักฐานสำเร็จ! รอพี่ Admin ตรวจสอบนะจ๊ะ ✨");
                                                    // Immediately update the local map for faster feedback
                                                    if (res.image) {
                                                        setProofPhotos(prev => ({ ...prev, [task.id]: `${API_BASE_URL}${res.image}` }));
                                                    }
                                                    const updated = await fetchTodos();
                                                    setTasks(updated);
                                                }
                                            }}
                                        />
                                        <Sparkles size={20} />
                                    </label>

                                    <button onClick={() => handleDelete(task.id)} className="p-3 text-gray-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                                        <Trash2 size={24} />
                                    </button>
                                </div>
                            </div>
                        ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Companion Sidebox */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[64px] border border-white/60 dark:border-white/10 shadow-2xl p-8 flex flex-col h-[700px] sticky top-32">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-2xl text-gray-800 dark:text-white flex items-center gap-2">
                                <Star className="text-primary fill-primary" size={24}/> Companion
                            </h3>
                            <button onClick={() => navigate("/reading")} className="p-3 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-primary transition-all">
                                <Layout size={20}/>
                            </button>
                        </div>

                        {/* 3D Preview Box with Background */}
                        <div className="relative flex-1 rounded-[48px] overflow-hidden border-4 border-white shadow-inner mb-8 bg-gray-900 group">
                            {equippedRoom?.image && (
                                <img src={equippedRoom.image} className="absolute inset-0 w-full h-full object-cover" alt="room"/>
                            )}
                            <div className="absolute inset-0 bg-black/10 z-10" />
                            
                            <div className="absolute inset-x-0 bottom-8 z-50 text-center px-6 drop-shadow-2xl">
                                <p className="text-white font-black text-2xl mb-1 tracking-tight">{equippedAvatar?.name || "Buddy"}</p>
                                <p className="text-white/80 text-[10px] font-black uppercase tracking-[.4em] font-mono bg-black/30 backdrop-blur-sm inline-block px-3 py-1 rounded-full">Status: Watching You</p>
                            </div>

                            <Canvas 
                                key={equippedAvatar?.model || "default"}
                                camera={{ position: [0, 0, 8], fov: 45 }} 
                                className="relative z-30 pointer-events-none"
                            >
                                <ambientLight intensity={3.5} />
                                <pointLight position={[10, 15, 10]} intensity={4.5} />
                                <directionalLight position={[0, 5, 10]} intensity={3.5} />
                                <spotLight position={[0, 10, 10]} angle={0.15} penumbra={1} intensity={3} />
                                <Suspense fallback={<Loader />}>
                                    {equippedAvatar?.model && (
                                        <AvatarModel modelPath={equippedAvatar.model} />
                                    )}
                                </Suspense>
                                <OrbitControls autoRotate={false} enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />
                            </Canvas>
                            
                            {/* Decorative Badge */}
                            <div className="absolute top-6 right-6 z-30 size-12 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center animate-bounce-slow">
                               <Heart size={20} className="text-white fill-white"/>
                            </div>
                        </div>

                        {/* Level Info */}
                        <div className="bg-white/20 dark:bg-white/5 rounded-[32px] p-8 border border-white/60 dark:border-white/10 space-y-6">
                            <LevelBar exp={userProfile?.exp || 0} onInfoClick={() => setIsRankModalOpen(true)} />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-[24px] bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Coins Earned</p>
                                    <p className="text-xl font-black text-gray-800 dark:text-white">{userProfile?.coins || 0}</p>
                                </div>
                                <div className="p-4 rounded-[24px] bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tasks Done</p>
                                    <p className="text-xl font-black text-gray-800 dark:text-white">{tasks.filter(t => t.is_completed).length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            
            <RankInfoModal 
                isOpen={isRankModalOpen} 
                onClose={() => setIsRankModalOpen(false)} 
            />
        </div>
    )
}

export default TodoList;
