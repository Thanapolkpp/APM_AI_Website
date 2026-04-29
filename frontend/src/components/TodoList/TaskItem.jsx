import React from "react"
import { Trash2, CheckCircle2, Circle, Sparkles } from "lucide-react"

const TaskItem = ({ task, proofPhoto, onToggle, onDelete, onUploadProof }) => {
    return (
        <div className={`group flex items-center gap-3 md:gap-5 p-3.5 md:p-6 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[24px] md:rounded-[32px] transition-all hover:shadow-xl ${task.is_completed ? 'opacity-60' : ''}`}>
            <button onClick={() => onToggle(task.id)} className={`shrink-0 text-primary transition-all hover:scale-110`}>
                {task.is_completed ? <CheckCircle2 className="size-6 md:size-8 fill-primary text-white" /> : <Circle className="size-6 md:size-8 text-gray-300 group-hover:text-primary" />}
            </button>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    {task.status === "pending" && <span className="px-1.5 py-0.5 bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 text-[6px] md:text-[8px] font-black uppercase rounded-full">Pending</span>}
                    {task.status === "accepted" && <span className="px-1.5 py-0.5 bg-green-400/20 text-green-600 dark:text-green-400 text-[6px] md:text-[8px] font-black uppercase rounded-full">Verified</span>}
                    {task.status === "rejected" && <span className="px-1.5 py-0.5 bg-red-400/20 text-red-600 dark:text-red-400 text-[6px] md:text-[8px] font-black uppercase rounded-full">Rejected</span>}
                </div>
                <span className={`text-sm md:text-xl font-bold dark:text-white line-clamp-1 ${task.is_completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.task_text}
                </span>
            </div>
            
            <div className="flex items-center gap-3">
                {proofPhoto && (
                    <div className="relative size-12 rounded-xl overflow-hidden bg-gray-100 border border-white/40 cursor-pointer hover:scale-110 transition-transform shadow-lg group-hover:shadow-2xl">
                        <img 
                            src={proofPhoto} 
                            className="w-full h-full object-cover" 
                            alt="proof" 
                            onClick={() => window.open(proofPhoto, '_blank')}
                        />
                    </div>
                )}
                {/* Upload Button */}
                <label className="cursor-pointer p-3 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-primary transition-all">
                    <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) onUploadProof(task.id, file);
                        }}
                    />
                    <Sparkles size={20} />
                </label>

                <button onClick={() => onDelete(task.id)} className="p-3 text-gray-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={24} />
                </button>
            </div>
        </div>
    );
};

export default React.memo(TaskItem);
