import React from "react"

const ChatInput = ({
    input,
    setInput,
    isLoading,
    handleSend,
    handlePickImage,
    fileInputRef,
    handleImageChange,
    headerTheme,
}) => {
    return (
        <form onSubmit={handleSend} className="flex gap-2 p-4 bg-white border-t border-gray-100">
            {/* hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
            />

            {/* attach image button */}
            <button
                type="button"
                onClick={handlePickImage}
                disabled={isLoading}
                className="size-12 rounded-2xl flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-all"
                title="แนบรูปภาพ"
            >
                <span className="material-symbols-outlined text-gray-700">image</span>
            </button>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`flex-1 rounded-2xl px-5 py-3 bg-gray-100 outline-none transition-all text-gray-700 focus:ring-2 ${headerTheme.focus}`}
                placeholder={headerTheme.placeholder}
                disabled={isLoading}
            />

            <button
                type="submit"
                className={`size-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg transition-all active:scale-90 ${isLoading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 hover:rotate-12"
                    }`}
                disabled={isLoading}
            >
                <span className="material-symbols-outlined">send</span>
            </button>
        </form>
    )
}

export default ChatInput
