import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/v1/ai/chat";

export const sendMessageToAI = async (message, mode) => {
    try {
        // ดึง token สำหรับกรณีที่คุณเปิดใช้งานระบบ Auth ในอนาคต
        const token = localStorage.getItem("access_token");

        const response = await axios.post(
            API_URL,
            {
                message: message,
                mode: mode // ส่งโหมด (bro, girl, nerd) ไปให้ Backend
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    // ถ้ายังไม่ได้ทำระบบ Login จริงๆ บรรทัดนี้อาจจะส่งค่า null ไปก่อน ซึ่งไม่เป็นไรครับ
                    Authorization: token ? `Bearer ${token}` : ""
                }
            }
        );

        // ตรวจสอบโครงสร้างข้อมูลที่ส่งกลับมาจาก FastAPI (ต้องตรงกับ {"reply": ...})
        return response.data.reply;

    } catch (error) {
        console.error("AI Service Error:", error.response?.data || error.message);

        // จัดการ Error ตามสถานะที่ตอบกลับมา
        if (error.response?.status === 401) {
            throw new Error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
        }
        if (error.response?.status === 404) {
            throw new Error("ไม่พบ Endpoint ของ AI กรุณาตรวจสอบการรัน Backend");
        }

        throw new Error("ฟีลแบบระบบขิตชั่วคราว ลองใหม่นะแก");
    }
};