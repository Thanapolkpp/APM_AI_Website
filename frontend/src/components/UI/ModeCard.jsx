import React from "react"

const ModeCard = ({ title, icon, description, buttonIcon, colors, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`group cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl active:scale-95 border-2 border-transparent 
                md:${colors.bg} md:${colors.hoverBorder} md:${colors.shadow}
                rounded-[2rem] md:rounded-2xl p-2.5 md:p-8 flex flex-col items-center text-center
                relative overflow-hidden
                bg-white/60 dark:bg-black/20 backdrop-blur-3xl shadow-lg md:shadow-none
            `}
        >
            {/* Mobile-only background accent */}
            <div className={`md:hidden absolute inset-0 opacity-10 bg-gradient-to-br ${colors.bg.replace('bg-', 'from-')}`} />

            <div
                className={`w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center text-3xl md:text-5xl md:mb-6 shadow-inner transition-all duration-500 group-hover:scale-110 relative z-10
                    md:${colors.iconBg} bg-white/80 dark:bg-white/10 ring-2 ring-white/20
                `}
            >
                {typeof icon === "string" && icon.length <= 4 ? (
                    <span>{icon}</span>
                ) : (
                    <img
                        src={icon}
                        alt={title}
                        className="w-12 h-12 md:w-20 md:h-20 rounded-full object-cover drop-shadow-sm"
                    />
                )}
            </div>

            <div className="hidden md:block">
                <h3 className="text-2xl font-black mb-3">{title}</h3>
                <p className={`text-sm leading-relaxed mb-8 font-medium ${colors.text}`}>
                    {description}
                </p>
                <div className="mt-auto w-full">
                    <div
                        className={`w-full py-4 rounded-xl font-black shadow-sm transition-all flex items-center justify-center gap-2 ${colors.button} hover:px-8`}
                    >
                        <span>Start Chat</span>
                        <span className="material-symbols-outlined text-lg">{buttonIcon}</span>
                    </div>
                </div>
            </div>
            
            {/* Mobile Icon Label - Clean & Subtle */}
            <div className="md:hidden mt-3 relative z-10">
                <span className={`text-[10px] font-black uppercase tracking-widest ${colors.text} opacity-60 group-hover:opacity-100 transition-opacity`}>
                    {title.split(' ')[0]} {/* e.g. "Bro" or "Cute" */}
                </span>
            </div>
        </div>
    )
}

export default ModeCard
