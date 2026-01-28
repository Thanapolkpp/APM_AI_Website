import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/v1/ai/chat";

export const sendMessageToAI = async (message, mode) => {
    try {
        const token = localStorage.getItem("access_token");

        const response = await axios.post(
            API_URL,
            { message, mode },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
            }
        );

        // ✅ ป้องกัน reply หาย หรือ backend ส่งชื่อ key ไม่ตรง
        const reply = response.data?.reply ?? response.data?.response ?? "";
        return String(reply);

    } catch (error) {
        console.error("AI Service Error:", error.response?.data || error.message);

        if (error.response?.status === 401) {
            throw new Error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
        }
        if (error.response?.status === 404) {
            throw new Error("ไม่พบ Endpoint ของ AI กรุณาตรวจสอบการรัน Backend");
        }

        throw new Error("ฟีลแบบระบบขิตชั่วคราว ลองใหม่นะแก");
    }
};
