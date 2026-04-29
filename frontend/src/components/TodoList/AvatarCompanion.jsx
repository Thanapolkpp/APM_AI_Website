import React, { Suspense, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Html, useProgress } from "@react-three/drei"
import { Star, Layout, Heart } from "lucide-react"
import { useTranslation } from "react-i18next"
import LevelBar from "./LevelBar"

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

const AvatarModel = ({ modelPath, rotation = [0, -Math.PI / 2, 0] }) => {
    const { scene } = useGLTF(modelPath);
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    return <primitive object={clonedScene} position={[0, -2.5, 0]} scale={9} rotation={rotation} />;
};

const AvatarCompanion = ({ userProfile, equippedAvatar, equippedRoom, tasksDone, onInfoClick, onReadingClick }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[40px] md:rounded-[64px] border border-white/60 dark:border-white/10 shadow-2xl p-6 md:p-8 flex flex-col h-[400px] md:h-[700px] sticky top-32 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-2xl text-gray-800 dark:text-white flex items-center gap-2">
                    <Star className="text-primary fill-primary" size={24}/> {t("todo.companion")}
                </h3>
                <button onClick={onReadingClick} className="p-3 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-primary transition-all">
                    <Layout size={20}/>
                </button>
            </div>

            {/* 3D Preview Box */}
            <div className="relative flex-1 rounded-[48px] overflow-hidden border-4 border-white shadow-inner mb-8 bg-gray-900 group">
                {equippedRoom?.image && (
                    <img src={equippedRoom.image} className="absolute inset-0 w-full h-full object-cover" alt="room"/>
                )}
                <div className="absolute inset-0 bg-black/10 z-10" />
                
                <div className="absolute inset-x-0 bottom-8 z-50 text-center px-6 drop-shadow-2xl">
                    <p className="text-white font-black text-2xl mb-1 tracking-tight">{equippedAvatar?.name || "Buddy"}</p>
                    <p className="text-white/80 text-[10px] font-black uppercase tracking-[.4em] font-mono bg-black/30 backdrop-blur-sm inline-block px-3 py-1 rounded-full">{t("todo.status_waiting")}</p>
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
                
                <div className="absolute top-6 right-6 z-30 size-12 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center animate-bounce-slow">
                   <Heart size={20} className="text-white fill-white"/>
                </div>
            </div>

            {/* Level Info */}
            <div className="bg-white/20 dark:bg-white/5 rounded-[32px] p-8 border border-white/60 dark:border-white/10 space-y-6">
                <LevelBar exp={userProfile?.exp || 0} onInfoClick={onInfoClick} />
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-[24px] bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t("todo.coins_earned")}</p>
                        <p className="text-xl font-black text-gray-800 dark:text-white">{userProfile?.coins || 0}</p>
                    </div>
                    <div className="p-4 rounded-[24px] bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t("todo.tasks_done")}</p>
                        <p className="text-xl font-black text-gray-800 dark:text-white">{tasksDone}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvatarCompanion;
