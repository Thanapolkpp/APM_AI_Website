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

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-6 px-4`}>
            <div
                className={`
                    max-w-[85%] px-6 py-4 rounded-[2rem]
                    transition-all duration-200 shadow-sm
                    ${isUser
                        ? "bg-blue-600 text-white rounded-tr-none shadow-blue-200"
                        : "bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-gray-100"
                    }
                `}
            >
                {/* Image preview */}
                {isUser && message.imagePreview && (
                    <div className="mb-4 rounded-2xl overflow-hidden border border-white/20 shadow-inner bg-black/5">
                        <img
                            src={message.imagePreview}
                            alt="uploaded"
                            className="w-full max-h-64 object-contain"
                        />
                    </div>
                )}

                {!isUser && (
                    <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-xs font-black text-blue-600 uppercase tracking-wider">
                           {mode || "BRO"} :
                        </span>
                    </div>
                )}

                {message.sender === "ai" ? (
                    <div className="markdown-content text-[15px] leading-relaxed font-medium">
                        <ReactMarkdown
// ... (rest of the ReactMarkdown props)
                            remarkPlugins={[remarkGfm]}
                            components={{

                                /* ---------- TABLE ---------- */

                                table: ({ node, ...props }) => (
                                    <div className="overflow-x-auto my-6 rounded-xl border border-gray-200 shadow-sm">
                                        <table
                                            className="w-full text-sm text-left border-collapse bg-white"
                                            {...props}
                                        />
                                    </div>
                                ),

                                thead: ({ node, ...props }) => (
                                    <thead
                                        className="bg-blue-600 text-white text-xs uppercase tracking-wide"
                                        {...props}
                                    />
                                ),

                                th: ({ node, ...props }) => (
                                    <th className="px-6 py-4 font-semibold" {...props} />
                                ),

                                tbody: ({ node, ...props }) => (
                                    <tbody
                                        className="divide-y divide-gray-100"
                                        {...props}
                                    />
                                ),

                                tr: ({ node, ...props }) => (
                                    <tr
                                        className="
                                            even:bg-gray-50
                                            hover:bg-blue-50
                                            transition-colors duration-150
                                        "
                                        {...props}
                                    />
                                ),

                                td: ({ node, ...props }) => (
                                    <td
                                        className="px-6 py-4 align-top leading-relaxed text-gray-700"
                                        {...props}
                                    />
                                ),

                                /* ---------- TEXT ---------- */

                                p: ({ node, ...props }) => (
                                    <p className="mb-3 last:mb-0 leading-relaxed" {...props} />
                                ),

                                ul: ({ node, ...props }) => (
                                    <ul className="list-disc pl-6 mb-3 space-y-1" {...props} />
                                ),

                                ol: ({ node, ...props }) => (
                                    <ol className="list-decimal pl-6 mb-3 space-y-1" {...props} />
                                ),

                                li: ({ node, ...props }) => (
                                    <li className="leading-relaxed" {...props} />
                                ),

                                strong: ({ node, ...props }) => (
                                    <strong className="font-semibold text-gray-900" {...props} />
                                )
                            }}
                        >
                            {safeText(message.text)}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">
                        {safeText(message.text)}
                    </p>
                )}
            </div>
        </div>
    )
}

export default MessageItem