import React from "react";
import { Coins } from "lucide-react";
import { useCoins } from "../../hooks/useCoins";

const CoinBadge = ({ className = "" }) => {
    const { coins } = useCoins();

    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl bg-yellow-400/20 border border-yellow-400/50 shadow-sm transition hover:scale-105 ${className}`}>
            <div className="relative">
                <Coins className="text-yellow-500 animate-bounce" size={20} />
                <div className="absolute inset-0 bg-yellow-400/30 blur-md rounded-full -z-10 animate-pulse" />
            </div>
            <span className="text-yellow-600 dark:text-yellow-400 font-black text-lg tabular-nums">
                {coins.toLocaleString()}
            </span>
        </div>
    );
};

export default CoinBadge;
