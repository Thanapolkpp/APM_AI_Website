import { useState, useEffect } from "react";
import { getUserProfile, updateCoins as apiUpdateCoins } from "../services/aiService";

export const useCoins = () => {
    const [coins, setCoins] = useState(() => Number(localStorage.getItem("user_coins") || 0));

    // โหลด coins จาก backend ตอน mount (ถ้า login อยู่)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        getUserProfile()
            .then((data) => {
                localStorage.setItem("user_coins", String(data.coins));
                setCoins(data.coins);
                window.dispatchEvent(new Event("coinsUpdated"));
            })
            .catch(() => {
                // ถ้า API fail ให้ใช้ค่าจาก localStorage แทน
            });
    }, []);

    // ฟัง event update จาก tab อื่น
    useEffect(() => {
        const handleStorage = () => {
            setCoins(Number(localStorage.getItem("user_coins") || 0));
        };
        window.addEventListener("storage", handleStorage);
        window.addEventListener("coinsUpdated", handleStorage);
        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("coinsUpdated", handleStorage);
        };
    }, []);

    const addCoins = async (amount) => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const data = await apiUpdateCoins(amount);
                localStorage.setItem("user_coins", String(data.coins));
                setCoins(data.coins);
                window.dispatchEvent(new Event("coinsUpdated"));
            } catch {
                // fallback localStorage
                const next = Number(localStorage.getItem("user_coins") || 0) + amount;
                localStorage.setItem("user_coins", String(next));
                setCoins(next);
                window.dispatchEvent(new Event("coinsUpdated"));
            }
        } else {
            const next = Number(localStorage.getItem("user_coins") || 0) + amount;
            localStorage.setItem("user_coins", String(next));
            setCoins(next);
            window.dispatchEvent(new Event("coinsUpdated"));
        }
    };

    const spendCoins = async (amount) => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const data = await apiUpdateCoins(-amount);
                localStorage.setItem("user_coins", String(data.coins));
                setCoins(data.coins);
                window.dispatchEvent(new Event("coinsUpdated"));
                return true;
            } catch {
                return false; // เหรียญไม่พอ หรือ error
            }
        } else {
            const current = Number(localStorage.getItem("user_coins") || 0);
            if (current < amount) return false;
            const next = current - amount;
            localStorage.setItem("user_coins", String(next));
            setCoins(next);
            window.dispatchEvent(new Event("coinsUpdated"));
            return true;
        }
    };

    return { coins, addCoins, spendCoins };
};
