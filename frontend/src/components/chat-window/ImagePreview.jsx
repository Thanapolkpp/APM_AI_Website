import React from "react"

const ImagePreview = ({ selectedImage, imagePreviewUrl, onRemove }) => {
    if (!selectedImage || !imagePreviewUrl) return null

    return (
        <div className="px-4 pb-2 bg-white border-t border-gray-100">
            <div className="flex items-center gap-3">
                <img
                    src={imagePreviewUrl}
                    alt="preview"
                    className="w-16 h-16 rounded-xl object-cover border"
                />
                <div className="flex-1 text-sm text-gray-600">
                    <div className="font-semibold">แนบรูปแล้ว</div>
                    <div className="truncate">{selectedImage.name}</div>
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    className="px-3 py-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                >
                    ลบ
                </button>
            </div>
        </div>
    )
}

export default ImagePreview
