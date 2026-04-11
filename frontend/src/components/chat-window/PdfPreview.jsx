import React from "react"

const PdfPreview = ({ selectedFile, onRemove, isReading }) => {
    if (!selectedFile) return null

    // Format file size
    const formatFileSize = (bytes) => {
        if (!bytes) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className="px-4 pb-3 bg-white/80 backdrop-blur-md border-t border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-4 p-3 bg-gray-50/50 rounded-2xl border border-gray-100/50 hover:bg-white transition-all shadow-sm group">
                <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shadow-inner group-hover:scale-105 transition-transform duration-300">
                    {isReading ? (
                        <div className="size-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
                    )}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600 uppercase tracking-wider">PDF</span>
                        <div className="text-sm font-bold text-gray-800 truncate">{selectedFile.name}</div>
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium mt-0.5">
                        {isReading ? (
                            <span className="flex items-center gap-1">
                                <span className="animate-pulse">กำลังอ่านข้อมูลไฟล์...</span>
                            </span>
                        ) : (
                            <>{formatFileSize(selectedFile.size)} • พร้อมสำหรับการอ่าน</>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onRemove}
                    className="size-10 rounded-xl bg-gray-100/50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center group/btn active:scale-90"
                    title="ยกเลิกการอ่านไฟล์"
                >
                    <span className="material-symbols-outlined text-xl group-hover/btn:rotate-90 transition-transform duration-300">close</span>
                </button>
            </div>
        </div>
    )
}

export default PdfPreview
