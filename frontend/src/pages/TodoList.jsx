import React, { useState, useEffect, useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Trophy, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Layout/Navbar"
import Footer from "../components/Layout/footer"
import CoinBadge from "../components/UI/CoinBadge"
import { useCoins } from "../hooks/useCoins"
import { 
    fetchTodos, createTodo, toggleTodo, deleteTodo, updateExp,
    getUserProfile, fetchOwnedAvatars, fetchOwnedRooms,
    uploadTodoProof, verifyTodo, fetchPendingTodos
} from "../services/aiService"
import { ASSETS, mapModelPath, mapImagePath, getAvatarIcon } from "../config/assets"
import RankInfoModal from "../components/UI/RankInfoModal"
import { formatDocUrl, API_BASE_URL } from "../utils/url"

// Modular Components
import LevelBar, { LEVEL_THRESHOLDS } from "../components/TodoList/LevelBar"
import AvatarCompanion from "../components/TodoList/AvatarCompanion"
import AdminVerification from "../components/TodoList/AdminVerification"
import TaskItem from "../components/TodoList/TaskItem"

const Logo = ASSETS.BRANDING.LOGO;

const TodoList = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { addCoins } = useCoins()
    
    const [isRankModalOpen, setIsRankModalOpen] = useState(false)
    const [tasks, setTasks] = useState([])
    const [newTask, setNewTask] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [userProfile, setUserProfile] = useState(null)
    
    const [equippedAvatar, setEquippedAvatar] = useState(null)
    const [equippedRoom, setEquippedRoom] = useState(null)
    const [profileImage, setProfileImage] = useState(Logo)
    const [isAdminView, setIsAdminView] = useState(false)
    const [pendingTasks, setPendingTasks] = useState([])
    const [proofPhotos, setProofPhotos] = useState({})
    const [isAIPlanning, setIsAIPlanning] = useState(false)

    const refreshProfileImage = useCallback(() => {
        const savedAvatar = localStorage.getItem("avatar");
        setProfileImage(getAvatarIcon(savedAvatar));
    }, []);

    useEffect(() => {
        refreshProfileImage();
        window.addEventListener("avatarUpdated", refreshProfileImage);
        return () => window.removeEventListener("avatarUpdated", refreshProfileImage);
    }, [refreshProfileImage]);

    // Logic for proof photo mapping
    useEffect(() => {
        const photos = {}
        tasks.forEach(todo => {
            if (todo.proof_image) photos[todo.id] = formatDocUrl(todo.proof_image)
        })
        pendingTasks.forEach(todo => {
            if (todo.proof_image) photos[todo.id] = formatDocUrl(todo.proof_image)
        })
        setProofPhotos(photos)
    }, [tasks, pendingTasks])
    
    // Load Initial Data
    const loadInitialData = useCallback(async () => {
        const token = localStorage.getItem("token")
        if (!token) { navigate("/login"); return }

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
    }, [navigate]);

    useEffect(() => { loadInitialData() }, [loadInitialData]);

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
            const profile = await getUserProfile();
            setUserProfile(profile);
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

    const handleAIPlan = async () => {
        if (!newTask.trim()) return;
        setIsAIPlanning(true);
        try {
            const { generateTodoPlan } = await import("../services/aiService");
            const savedAvatar = localStorage.getItem("avatar") || "bro";
            const mode = savedAvatar.includes("girl") ? "girl" : (savedAvatar.includes("nerd") ? "nerd" : "bro");
            
            const tasks = await generateTodoPlan(newTask.trim(), mode);
            if (tasks && tasks.length > 0) {
                // เพิ่มทุกงานที่ AI แนะนำลงไป
                for (const t of tasks) {
                    const created = await createTodo(t);
                    setTasks(prev => [...prev, created]);
                }
                setNewTask("");
            } else {
                alert("AI ไม่สามารถวางแผนให้ได้ในขณะนี้");
            }
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาดในการเรียก AI");
        } finally {
            setIsAIPlanning(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            const updated = await toggleTodo(id)
            setTasks(prev => prev.map(t => t.id === id ? { ...t, is_completed: updated.is_completed } : t))
            
            if (updated.is_completed) {
                let currentLevel = 1;
                const currentExp = userProfile?.exp || 0;
                for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
                    if (currentExp >= LEVEL_THRESHOLDS[i]) {
                        currentLevel = i + 1;
                    } else {
                        break;
                    }
                }

                const bonusMap = { 3: 0.5, 4: 1.0, 5: 1.2, 6: 1.5, 7: 2.0 };
                const bonusFactor = bonusMap[currentLevel] || 0;
                const finalCoins = Math.floor(1 * (1 + bonusFactor));
                const finalExp = Math.floor(5 * (1 + bonusFactor));

                await addCoins(finalCoins)
                await updateExp(finalExp)
                
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

    const handleUploadProof = async (id, file) => {
        try {
            const res = await uploadTodoProof(id, file);
            alert("ส่งหลักฐานสำเร็จ! รอพี่ Admin ตรวจสอบนะจ๊ะ ✨");
            if (res.image) {
                setProofPhotos(prev => ({ ...prev, [id]: `${API_BASE_URL}${res.image}` }));
            }
            const updated = await fetchTodos();
            setTasks(updated);
        } catch (err) {
            alert("อัปโหลดหลักฐานไม่สำเร็จ");
        }
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col transition-colors duration-300">
            <header className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/60 dark:bg-black/20 backdrop-blur-xl transition-all">
                <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
                        <div className="relative size-12 rounded-2xl bg-white shadow-xl ring-2 ring-pink-100 flex items-center justify-center overflow-hidden">
                            <img src={profileImage || Logo} alt="Logo" className="size-8 object-contain transition duration-500 hover:scale-110" />
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
                    <div className="hidden lg:flex flex-1 justify-center px-4"><Navbar /></div>
                    <div className="flex justify-end items-center gap-3 sm:gap-4 shrink-0">
                        <div className="hidden sm:block"><CoinBadge className="scale-90" /></div>
                        {userProfile && (
                             <img 
                                src={mapImagePath(equippedAvatar?.model_path || "bro")} 
                                className="size-10 rounded-2xl border-2 border-white dark:border-white/10 shadow-lg bg-white/20 object-cover cursor-pointer hover:scale-110 transition-transform" 
                                alt="Avatar"
                                onClick={() => navigate("/account")}
                             />
                        )}
                        <div className="lg:hidden"><Navbar /></div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-12 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 md:gap-12">
                <div className="space-y-10">
                    {isAdminView ? (
                        <AdminVerification 
                            pendingTasks={pendingTasks} 
                            proofPhotos={proofPhotos} 
                            onVerify={handleVerify} 
                            onExit={() => setIsAdminView(false)} 
                        />
                    ) : (
                        <div className="space-y-10">
                            <div className="flex items-center justify-between mb-4 md:mb-8">
                                <div>
                                    <h2 className="text-xl md:text-4xl font-black text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                        {t("todo.checklists")} <Trophy className="text-yellow-500 size-6 md:size-8" />
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">{t("todo.quests_desc")}</p>
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

                            <form onSubmit={addTask} className="relative group mb-6">
                                <input
                                    type="text"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    placeholder={t("todo.add_task")}
                                    className="w-full bg-white/40 dark:bg-white/5 backdrop-blur-xl border-2 border-white/60 dark:border-white/10 rounded-[22px] md:rounded-[32px] px-5 md:px-8 py-3 md:py-6 text-sm md:text-lg font-bold focus:outline-none focus:border-primary transition-all pr-20 md:pr-24 shadow-xl"
                                />
                                <button 
                                    type="button" 
                                    onClick={handleAIPlan}
                                    disabled={isAIPlanning}
                                    className="absolute right-24 md:right-32 top-2 md:top-3 bottom-2 md:bottom-3 px-3 md:px-4 rounded-xl md:rounded-2xl bg-purple-500 text-white font-black text-xs md:text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
                                    title="AI ช่วยวางแผน"
                                >
                                    {isAIPlanning ? "..." : <Sparkles size={18} />}
                                </button>
                                <button type="submit" className="absolute right-2 md:right-3 top-2 md:top-3 bottom-2 md:bottom-3 px-4 md:px-6 rounded-xl md:rounded-2xl bg-primary text-white font-black text-xs md:text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                                    {t("todo.add_btn")}
                                </button>
                            </form>

                            <div className="space-y-4">
                                {tasks.length === 0 && !isLoading && (
                                    <div className="py-20 text-center bg-white/20 dark:bg-white/5 rounded-[48px] border-4 border-dashed border-gray-100 dark:border-white/5">
                                        <p className="text-gray-400 font-black text-xl">{t("todo.no_tasks")}</p>
                                    </div>
                                )}
                                {tasks.map(task => (
                                    <TaskItem 
                                        key={task.id} 
                                        task={task} 
                                        proofPhoto={proofPhotos[task.id]} 
                                        onToggle={handleToggle} 
                                        onDelete={handleDelete} 
                                        onUploadProof={handleUploadProof} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <AvatarCompanion 
                    userProfile={userProfile} 
                    equippedAvatar={equippedAvatar} 
                    equippedRoom={equippedRoom} 
                    tasksDone={tasks.filter(t => t.is_completed).length} 
                    onInfoClick={() => setIsRankModalOpen(true)} 
                    onReadingClick={() => navigate("/reading")} 
                />
            </main>

            <Footer />
            <RankInfoModal isOpen={isRankModalOpen} onClose={() => setIsRankModalOpen(false)} />
        </div>
    )
}

export default TodoList;
