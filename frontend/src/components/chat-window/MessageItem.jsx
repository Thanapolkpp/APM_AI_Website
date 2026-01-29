import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const MessageItem = ({ message }) => {
    const isUser = message.sender === "user"

    // safeText logic moved inside or passed down (but handled here for simplicity as component logic)
    const safeText = (value) => {
        if (typeof value === "string") return value
        if (value === null || value === undefined) return ""
        try {
            return JSON.stringify(value, null, 2)
        } catch (e) {
            return String(value)
        }
    }

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-sm transition-all ${isUser
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                    }`}
            >
                {/* User image preview inside chat */}
                {isUser && message.imagePreview && (
                    <img
                        src={message.imagePreview}
                        alt="uploaded"
                        className="w-48 h-48 object-cover rounded-xl mb-2 border border-white/30"
                    />
                )}

                {message.sender === "ai" ? (
                    <div
                        className="markdown-content prose prose-sm max-w-none 
                  prose-table:border-collapse prose-table:w-full prose-table:my-2
                  prose-th:border prose-th:border-gray-300 prose-th:p-2 prose-th:bg-gray-50
                  prose-td:border prose-td:border-gray-300 prose-td:p-2
                  prose-ul:list-disc prose-ul:ml-4
                  prose-strong:font-bold prose-strong:text-current"
                    >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
