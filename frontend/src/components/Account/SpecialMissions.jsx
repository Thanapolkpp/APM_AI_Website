import { fetchSpecialMissions } from "../../services/aiService";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const SpecialMissions = () => {
    const { t } = useTranslation();
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSpecialMissions()
            .then(setMissions)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 mb-4 italic uppercase">
                <span className="material-symbols-outlined text-pink-500">military_tech</span> {t("missions.title")} <span className="text-pink-500 text-2xl font-black">!</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
                {missions.map((mission, index) => (
                    <motion.div
                        key={mission.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-5 rounded-[2rem] border border-white dark:border-gray-700 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-black text-gray-900 dark:text-white text-lg tracking-tight group-hover:text-pink-600 transition-colors">
                                    {mission.title}
                                </h4>
                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                    {mission.description}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-pink-500 bg-pink-50 dark:bg-pink-900/30 px-2 py-1 rounded-full uppercase tracking-widest">
                                    +{mission.reward_coins} 🪙
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="relative mt-4">
                            <div className="flex justify-between text-[10px] font-black text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-tighter">
                                <span>{t("missions.progress")}</span>
                                <span>{mission.current} / {mission.target} {mission.unit}</span>
                            </div>
                            
                            {/* The Bar */}
                            <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden border border-gray-50 dark:border-gray-600">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${mission.progress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`h-full rounded-full ${
                                        mission.progress >= 100 
                                        ? "bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]" 
                                        : "bg-gradient-to-r from-pink-400 to-purple-500"
                                    }`}
                                />
                            </div>

                            {/* Done Badge */}
                            {mission.progress >= 100 && (
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-6 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg"
                                >
                                    <span className="material-symbols-outlined text-[14px] font-black">done</span>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
            
            <p className="text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 italic mt-6">
                {t("missions.footer")}
            </p>
        </div>
    );
};

export default SpecialMissions;
