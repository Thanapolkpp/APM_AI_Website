import React from "react"
import MessageItem from "./MessageItem"

const MessageList = ({ messages, isLoading, messagesEndRef }) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50 backdrop-blur-sm custom-scrollbar">
            {messages.map((msg, i) => (
                <MessageItem key={i} message={msg} />
            ))}

            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-2xl text-xs text-gray-400 animate-bounce">
                        AI is typing...
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    )
}

export default MessageList
