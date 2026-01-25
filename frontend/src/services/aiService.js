import axios from "axios";

const API_URL = "http://localhost:8000/api/chat";

export const sendMessageToAI = async (message, mode) => {
    try {
        const response = await axios.post(API_URL, {
            message,
            mode
        });

        return response.data.reply;
    } catch (error) {
        console.error("Failed to communicate with AI:", error);
        throw new Error("AI service is unavailable");
    }
};
