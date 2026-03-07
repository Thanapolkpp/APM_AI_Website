import React from "react"

const ModeCard = ({ title, icon, description, buttonIcon, colors, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`group cursor-pointer rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg active:scale-95 border-2 border-transparent ${colors.bg} ${colors.hoverBorder} ${colors.shadow}`}
        >
            <div
                className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner ${colors.iconBg}`}
            >
                {typeof icon === "string" && icon.length <= 4 ? (
                    <span>{icon}</span>
                ) : (
                    <img
                        src={icon}
                        alt={title}
                        className="w-20 h-20 rounded-full object-cover drop-shadow-sm"
                    />
                )}
            </div>

            <h3 className="text-2xl font-bold mb-3">{title}</h3>

            <p className={`text-sm leading-relaxed mb-8 font-medium ${colors.text}`}>
                {description}
            </p>

            <div className="mt-auto w-full">
                <button
                    className={`w-full py-4 rounded-xl font-bold shadow-sm transition-colors flex items-center justify-center gap-2 pointer-events-none ${colors.button}`}
                >
                    <span>Start Chat</span>
                    <span className="material-symbols-outlined text-lg">{buttonIcon}</span>
                </button>
            </div>
        </div>
    )
}

export default ModeCard
