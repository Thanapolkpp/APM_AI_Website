import React from 'react';

const Footer = () => {
    return (
        <div className="w-full flex flex-col items-center">
            <section className="w-full max-w-5xl py-12 px-6 bg-white/40 dark:bg-white/5 rounded-[3rem] border border-white dark:border-gray-800 backdrop-blur-sm">
                <div className="text-center mb-12">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs">Features</span>
                    <h2 className="text-3xl font-extrabold mt-2">Why UniBuddy? <span className="text-primary">🌈</span></h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <FeatureItem
                        icon="bedtime"
                        color="text-teal-600"
                        bgColor="bg-benefit-mint"
                        title="24/7 Support"
                        desc="Cramming at 3 AM? We're wide awake and ready to help you finish that essay."
                    />
                    <FeatureItem
                        icon="thumb_up"
                        color="text-yellow-600"
                        bgColor="bg-benefit-yellow"
                        title="Judgment-Free"
                        desc="No question is too 'dumb.' Ask us anything, we're just happy to be here with you!"
                    />
                    <FeatureItem
                        icon="psychology_alt"
                        color="text-orange-600"
                        bgColor="bg-benefit-peach"
                        title="Tailored Learning"
                        desc="We learn how you learn. Whether you need a simple summary or a deep dive, we got you."
                    />
                </div>
            </section>

            <div className="mt-20 flex flex-col items-center gap-4 mb-10">
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex -space-x-2">
                        <div className="size-6 rounded-full border-2 border-white bg-primary"></div>
                        <div className="size-6 rounded-full border-2 border-white bg-blue-400"></div>
                        <div className="size-6 rounded-full border-2 border-white bg-pink-400"></div>
                    </div>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                        3,402 students studying right now ☁️
                    </p>
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                    Powered by UniBuddy AI • Your personal academic companion
                </div>
            </div>
        </div>
    );
};
const FeatureItem = ({ icon, color, bgColor, title, desc }) => (
    <div className="flex flex-col items-center text-center px-4">
        <div className={`size-16 rounded-3xl ${bgColor} flex items-center justify-center mb-6 shadow-sm`}>
            <span className={`material-symbols-outlined text-3xl ${color}`}>{icon}</span>
        </div>
        <h4 className="text-xl font-bold mb-3">{title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {desc}
        </p>
    </div>
);

export default Footer;