import React from "react"
import { Sparkles, Info } from "lucide-react"
import { useTranslation } from "react-i18next"

const AdminVerification = ({ pendingTasks, proofPhotos, onVerify, onExit }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[48px] border border-white/60 dark:border-white/10 p-10 shadow-2xl">
            <div className="mb-10 flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        {t("todo.admin_verif")} <Sparkles className="text-primary" size={32}/>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs">{t("todo.admin_desc")}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-6 py-3 bg-primary/10 rounded-2xl border border-primary/20">
                        <span className="font-black text-primary">{pendingTasks.length} VERIFICATIONS</span>
                    </div>
                    <button 
                        onClick={onExit}
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
                                            onClick={() => onVerify(todo.id, "accepted")}
                                            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${todo.status === 'accepted' ? 'bg-green-600 scale-95 opacity-50 cursor-default' : 'bg-green-500 hover:scale-105 active:scale-95 shadow-green-500/20'}`}
                                            disabled={todo.status === 'accepted'}
                                        >
                                            ยืนยัน
                                        </button>
                                        <button 
                                            onClick={() => onVerify(todo.id, "rejected")}
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
    );
};

export default AdminVerification;
