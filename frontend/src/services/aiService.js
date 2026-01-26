import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/v1/ai/chat";

export const sendMessageToAI = async (message, mode) => {
    try {
        // ดึง token ที่เก็บไว้ (เช่นใน localStorage หลังจาก login สำเร็จ)
        const token = localStorage.getItem("access_token");

        const response = await axios.post(API_URL,
            { message, mode },
            {
                headers: {
                    Authorization: `Bearer ${token}` // ส่ง Token ไปให้ Backend ตรวจสอบ
                }
            }
        );

        return response.data.reply;
    } catch (error) {
        // ถ้า error 401 หมายความว่า Token หมดอายุหรือยังไม่ได้ Login
        console.error("Failed to communicate with AI:", error);
        throw new Error("AI service is unavailable");
    }
};