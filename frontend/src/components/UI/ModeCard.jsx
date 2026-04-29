import React from "react"

const ModeCard = ({ title, icon, description, buttonIcon, colors, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`group cursor-pointer transition-all duration-300 active:scale-95 border-4 border-toon-black shadow-toon-lg hover:-translate-x-1 hover:-translate-y-1 hover:shadow-toon-xl
                ${colors.bg} rounded-[2rem] md:rounded-3xl p-4 md:p-8 flex flex-col items-center text-center
                relative overflow-hidden
            `}
        >
            <div
                className={`w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-toon-black flex items-center justify-center text-3xl md:text-5xl md:mb-6 shadow-toon transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 relative z-10
                    ${colors.iconBg} bg-white
                `}
            >
                {typeof icon === "string" && icon.length <= 4 ? (
                    <span className="font-black">{icon}</span>
                ) : (
                    <img
                        src={icon}
                        alt={title}
                        className="w-14 h-14 md:w-24 md:h-24 rounded-full object-cover"
                    />
                )}
            </div>

            <div className="hidden md:block">
                <h3 className="text-3xl font-black mb-3 text-toon-black uppercase italic">{title}</h3>
                <p className={`text-base leading-relaxed mb-8 font-black text-toon-black/70`}>
                    {description}
                </p>
                <div className="mt-auto w-full">
                    <div
                        className={`w-full py-4 rounded-2xl border-4 border-toon-black font-black shadow-toon transition-all flex items-center justify-center gap-2 bg-white text-toon-black hover:-translate-y-1 hover:shadow-toon-lg active:translate-y-0 active:shadow-none`}
                    >
                        <span className="uppercase italic">Start Chat</span>
                        <span className="material-symbols-outlined font-black">{buttonIcon}</span>
                    </div>
                </div>
            </div>
            
            {/* Mobile Icon Label */}
            <div className="md:hidden mt-3 relative z-10">
                <span className={`text-xs font-black uppercase tracking-widest text-toon-black`}>
                    {title.split(' ')[0]}
                </span>
            </div>
        </div>
    )
}

export default ModeCard
