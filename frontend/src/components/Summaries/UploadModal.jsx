import React from "react";
import { HiOutlineX } from "react-icons/hi";
import { FileText } from "lucide-react";

const UploadModal = ({ isOpen, onClose, uploadForm, setUploadForm, selectedFile, onFileChange, onSubmit, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-[48px] w-full max-w-xl max-h-[92vh] overflow-y-auto p-10 relative border border-white dark:border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300 custom-scrollbar">
                
                <div className="flex items-center gap-5 mb-10">
                    <div className="size-16 rounded-[24px] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                        <FileText size={36} className="drop-shadow-md" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">แชร์สรุปใหม่ ✨</h3>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Community Knowledge Base</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-auto size-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-all active:scale-90"
                    >
                        <HiOutlineX size={28} />
                    </button>
                </div>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ชื่อสรุป / หัวข้อ</label>
                        <input
                            type="text"
                            placeholder="เช่น สรุปฟิสิกส์ ม.6 เทอม 1"
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 outline-none font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/10 transition-all"
                            value={uploadForm.title}
                            onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ราคา (เหรียญ)</label>
                            <input
                                type="number"
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 outline-none font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/10 transition-all"
                                value={uploadForm.price}
                                onChange={(e) => setUploadForm({ ...uploadForm, price: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-3 flex flex-col justify-center">
                            <label className="flex items-center gap-3 cursor-pointer group mt-6">
                                <div className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${uploadForm.is_public ? 'bg-primary border-primary' : 'border-gray-200 dark:border-white/20'}`}>
                                    {uploadForm.is_public && <div className="size-2 bg-white rounded-full" />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={uploadForm.is_public}
                                    onChange={(e) => setUploadForm({ ...uploadForm, is_public: e.target.checked })}
                                />
                                <span className="font-bold text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors">เปิดเป็นสาธารณะ</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ไฟล์สรุป (PDF)</label>
                        <div className="relative group">
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={onFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className={`w-full py-10 rounded-3xl border-4 border-dashed transition-all flex flex-col items-center justify-center gap-4 ${selectedFile ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5' : 'border-gray-100 dark:border-white/5 group-hover:border-primary/40 group-hover:bg-primary/5'}`}>
                                <div className={`size-16 rounded-2xl flex items-center justify-center transition-all ${selectedFile ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400 group-hover:scale-110'}`}>
                                    <FileText size={32} />
                                </div>
                                <div className="text-center">
                                    <p className={`font-black ${selectedFile ? 'text-emerald-600' : 'text-gray-400'}`}>{selectedFile ? selectedFile.name : 'คลิกหรือลากไฟล์ PDF มาวางตรงนี้'}</p>
                                    {!selectedFile && <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">Maximum size: 10MB</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onSubmit}
                        disabled={isLoading}
                        className={`w-full py-5 rounded-[28px] font-black text-xl text-white shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isLoading ? 'bg-gray-400 cursor-wait' : 'bg-gradient-to-r from-primary to-indigo-600 hover:brightness-110 shadow-primary/30'}`}
                    >
                        {isLoading ? (
                            <>
                                <div className="size-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                กำลังอัปโหลด...
                            </>
                        ) : 'อัปโหลดและแชร์ทันที 🚀'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
