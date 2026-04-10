import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const MessageItem = ({ message, mode }) => {
    const isUser = message.sender === "user"

    const safeText = (value) => {
        if (typeof value === "string") return value
        if (value === null || value === undefined) return ""
        try {
            return JSON.stringify(value, null, 2)
        } catch {
            return String(value)
        }
    }

    // Skeleton Loader for premium waiting feel
    const Skeleton = () => (
        <div className="space-y-3 animate-pulse py-2">
            <div className="h-3 bg-gray-200 rounded-full w-48"></div>
            <div className="h-3 bg-gray-100 rounded-full w-32"></div>
            <div className="h-3 bg-gray-50 rounded-full w-40"></div>
        </div>
    )

    return (
        <div 
            className={`
                flex ${isUser ? "justify-end" : "justify-start"} 
                my-6 px-4 animate-in fade-in slide-in-from-bottom-2 duration-300
            `}
        >
            <div
                className={`
                    max-w-[85%] px-6 py-4 rounded-[2.2rem]
                    transition-all duration-300 shadow-sm
                    ${isUser
                        ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-tr-none shadow-blue-100"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-white/5 shadow-gray-100"
                    }
                    hover:scale-[1.01] transform-gpu
                `}
            >
                {/* Image preview */}
                {isUser && message.imagePreview && (
                    <div className="mb-4 rounded-3xl overflow-hidden border border-white/20 shadow-lg bg-black/5">
                        <img
                            src={message.imagePreview}
                            alt="uploaded"
                            className="w-full max-h-64 object-cover"
                        />
                    </div>
                )}

                {!isUser && (
                    <div className="flex items-center gap-1.5 mb-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-blue-600/70 uppercase tracking-[0.2em]">
                           {mode || "BRO"}
                        </span>
                    </div>
                )}

                {message.sender === "ai" ? (
                    <div className="markdown-content text-[15.5px] leading-relaxed font-medium">
                        {message.isStreaming && (!message.text || message.text === "...") ? (
                            <Skeleton />
                        ) : (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    /* ---------- TABLE ---------- */
                                    table: ({ node, ...props }) => (
                                        <div className="overflow-x-auto my-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                                            <table className="w-full text-sm text-left border-collapse bg-white dark:bg-gray-900" {...props} />
                                        </div>
                                    ),
                                    thead: ({ node, ...props }) => (
                                        <thead className="bg-blue-600 text-white text-xs uppercase tracking-wider" {...props} />
                                    ),
                                    th: ({ node, ...props }) => (
                                        <th className="px-6 py-4 font-bold" {...props} />
                                    ),
                                    td: ({ node, ...props }) => (
                                        <td className="px-6 py-4 align-top leading-relaxed text-gray-700 dark:text-gray-300 border-t border-gray-50 dark:border-white/5" {...props} />
                                    ),
                                    /* ---------- TEXT ---------- */
                                    p: ({ node, ...props }) => (
                                        <p className="mb-4 last:mb-0 leading-relaxed" {...props} />
                                    ),
                                    strong: ({ node, ...props }) => (
                                        <strong className="font-bold text-blue-700 dark:text-blue-400" {...props} />
                                    ),
                                    li: ({ node, ...props }) => (
                                        <li className="leading-relaxed mb-1.5" {...props} />
                                    )
                                }}
                            >
                                {safeText(message.text)}
                            </ReactMarkdown>
                        )}
                    </div>
                ) : (
                    <p className="whitespace-pre-wrap leading-relaxed text-[15.5px] font-medium">
                        {safeText(message.text)}
                    </p>
                )}
            </div>
        </div>
    )
}

export default MessageItem