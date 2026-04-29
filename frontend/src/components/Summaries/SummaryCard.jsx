import React, { memo } from "react";
import { FileText } from "lucide-react";
import { Document, Page } from 'react-pdf';
import { formatDocUrl } from "../../utils/url";

const ICON_MAP = {
    // Add icons as needed, mapping from string names
};

const SummaryCard = ({ item, onRead, onCollect, checkAuth }) => {
    return (
        <div className="group relative bg-white dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-[260px] md:h-[420px]">
            {/* Preview Top */}
            <div
                className="h-24 md:h-40 w-full bg-gray-100 dark:bg-black/40 flex items-center justify-center relative cursor-pointer overflow-hidden"
                onClick={() => onRead(item)}
            >
                {item.file_path ? (
                    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-center justify-center p-2 bg-gray-50/50">
                        <Document
                            file={formatDocUrl(item.file_path)}
                            loading={<div className="size-4 border-2 border-primary/40 border-t-transparent rounded-full animate-spin" />}
                        >
                            <Page 
                                pageNumber={1} 
                                renderTextLayer={false} 
                                renderAnnotationLayer={false}
                                scale={0.5} 
                                width={300}
                                className="shadow-md rounded-md overflow-hidden"
                            />
                        </Document>
                    </div>
                ) : (
                    <>
                        <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors duration-500" />
                        <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-xl border border-white/40 text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 relative z-10">
                            <FileText size={24} className="md:size-32" />
                        </div>
                    </>
                )}
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 text-[6px] md:text-[8px] font-black uppercase tracking-widest z-10">{item.views} V</div>
            </div>

            {/* Content Bottom */}
            <div className="flex-1 p-2.5 md:p-6 flex flex-col relative bg-white dark:bg-gray-900/40 min-w-0">
                <div className="flex justify-between items-start mb-1.5 md:mb-3">
                    <span className="text-[6px] md:text-[8px] font-black px-1.5 py-0.5 rounded bg-primary/5 text-primary uppercase truncate max-w-[50px] md:max-w-none">{item.category}</span>
                    <div className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-[7px] md:text-[10px] uppercase">{item.price === 0 ? 'FREE' : item.price}</div>
                </div>

                <h3 className="text-[10px] md:text-base font-black text-gray-900 dark:text-white line-clamp-2 leading-tight mb-0.5 md:mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="hidden md:block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-4">{item.subject}</p>

                <div className="mt-auto grid grid-cols-1 gap-1.5">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onCollect(item);
                        }}
                        disabled={item.already_purchased || item.is_mine}
                        className={`w-full py-1.5 md:py-3 rounded-lg md:rounded-xl font-black shadow-md flex items-center justify-center gap-1.5 transition-all text-[8px] md:text-[11px] uppercase tracking-tighter ${(item.already_purchased || item.is_mine)
                            ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 to-primary text-white active:scale-95'
                            }`}
                    >
                        {item.is_mine ? 'MY SHEET' : (item.already_purchased || item.price === 0) ? 'OWNED' : 'GET'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(SummaryCard);
