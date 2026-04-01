import { useState, useEffect } from "react";

export const useCoins = () => {
    const [coins, setCoins] = useState(() => Number(localStorage.getItem("user_coins") || 0));

    useEffect(() => {
        const handleStorage = () => {
            setCoins(Number(localStorage.getItem("user_coins") || 0));
        };

        window.addEventListener("storage", handleStorage);
        // Custom event for same-tab updates
        window.addEventListener("coinsUpdated", handleStorage);

        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("coinsUpdated", handleStorage);
        };
    }, []);

    const addCoins = (amount) => {
        const current = Number(localStorage.getItem("user_coins") || 0);
        const next = current + amount;
        localStorage.setItem("user_coins", next.toString());
        setCoins(next);
        window.dispatchEvent(new Event("coinsUpdated"));
    };

    const spendCoins = (amount) => {
        const current = Number(localStorage.getItem("user_coins") || 0);
        if (current < amount) return false;
        const next = current - amount;
        localStorage.setItem("user_coins", next.toString());
        setCoins(next);
        window.dispatchEvent(new Event("coinsUpdated"));
        return true;
    };

    return { coins, addCoins, spendCoins };
};
