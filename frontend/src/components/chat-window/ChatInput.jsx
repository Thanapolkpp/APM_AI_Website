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
        <form onSubmit={handleSend} className={`flex gap-2 p-4 bg-white border-t border-gray-100 ${disabled ? "opacity-60" : ""}`}>
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
            <div className="flex gap-1">
                <button
                    type="button"
                    onClick={handlePickImage}
                    disabled={isLoading || disabled}
                    className="size-12 rounded-2xl flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-all text-gray-700"
                    title="แนบรูปภาพ"
                >
                    <span className="material-symbols-outlined">image</span>
                </button>
                <button
                    type="button"
                    onClick={handlePickPdf}
                    disabled={isLoading || disabled}
                    className="size-12 rounded-2xl flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-all text-gray-700"
                    title="แนบไฟล์ PDF"
                >
                    <span className="material-symbols-outlined">picture_as_pdf</span>
                </button>
            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`flex-1 rounded-2xl px-5 py-3 bg-gray-100 outline-none transition-all text-gray-700 focus:ring-2 ${headerTheme.focus}`}
                placeholder={disabled ? "คุณใช้งานครบ 5 ครั้งแล้ว กรุณาเข้าสู่ระบบ..." : headerTheme.placeholder}
                disabled={isLoading || disabled}
            />

            <button
                type="submit"
                className={`size-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg transition-all active:scale-90 ${isLoading || disabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:rotate-12"
                    }`}
                disabled={isLoading || disabled}
            >
                <span className="material-symbols-outlined">send</span>
            </button>
        </form>
    )
}

export default ChatInput
