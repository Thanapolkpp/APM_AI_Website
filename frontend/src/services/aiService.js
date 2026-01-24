import axios from 'axios';

// URL ของ Backend เรา (ปกติ FastAPI จะรันพอร์ต 8000)
const API_URL = 'http://localhost:8000/api/chat';

export const sendMessageToAI = async (userMessage) => {
    try {
        const response = await axios.post(API_URL, {
            message: userMessage
        });

        // ส่งข้อมูลส่วนที่เป็นคำตอบกลับไป
        return response.data.reply; cd
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการคุยกับ AI:", error);
        throw error;
    }
};