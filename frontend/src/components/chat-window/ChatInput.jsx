import React from "react"

const ChatInput = ({
    input,
    setInput,
    isLoading,
    handleSend,
    handlePickImage,
    fileInputRef,
    handleImageChange,
    pdfInputRef,
    handlePickPdf,
    handlePdfChange,
    headerTheme,
    disabled = false,
}) => {
    return (
        <form onSubmit={handleSend} className={`flex items-center gap-3 p-4 bg-white ${disabled ? "opacity-60" : ""}`}>
            {/* hidden file inputs */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
            />
            <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                className="hidden"
            />

            {/* action buttons */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={handlePickImage}
                    disabled={isLoading || disabled}
                    className="size-12 rounded-2xl flex items-center justify-center bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all text-gray-500 shadow-sm"
                    title="แนบรูปภาพ"
                >
                    <span className="material-symbols-outlined text-2xl">image</span>
                </button>
                <button
                    type="button"
                    onClick={handlePickPdf}
                    disabled={isLoading || disabled}
                    className="size-12 rounded-2xl flex items-center justify-center bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all text-gray-500 shadow-sm"
                    title="แนบไฟล์ PDF"
                >
                    <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                </button>
            </div>

            <div className="flex-1 relative">
                <textarea
                    rows="1"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value)
                        e.target.style.height = "auto"
                        e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px"
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSend(e)
                            e.target.style.height = "auto"
                        }
                    }}
                    className="w-full rounded-2xl px-6 py-3.5 bg-gray-50 border border-gray-100 outline-none transition-all text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 text-sm font-medium resize-none max-h-32 custom-scrollbar"
                    placeholder={disabled ? "คุณใช้งานครบ 5 ครั้งแล้ว กรุณาเข้าสู่ระบบ..." : headerTheme.placeholder}
                    disabled={isLoading || disabled}
                />
            </div>

            <button
                type="submit"
                className={`size-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl transition-all active:scale-95 ${isLoading || disabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/40"
                    }`}
                disabled={isLoading || disabled}
            >
                <span className="material-symbols-outlined text-2xl">send</span>
            </button>
        </form>
    )
}

export default ChatInput
