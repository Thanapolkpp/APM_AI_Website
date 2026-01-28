import axios from "axios";

const API_TEXT_URL = "http://127.0.0.1:8000/api/v1/ai/chat";
const API_IMAGE_URL = "http://127.0.0.1:8000/api/v1/ai/chat-with-image";

export const sendMessageToAI = async (message, mode) => {
    const response = await axios.post(API_TEXT_URL, { message, mode });
    return String(response.data?.reply ?? "");
};

export const sendMessageToAIWithImage = async (prompt, mode, imageFile) => {
    const formData = new FormData();
    formData.append("prompt", prompt || "");
    formData.append("mode", mode || "bro");
    formData.append("file", imageFile);

    const response = await axios.post(API_IMAGE_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return String(response.data?.reply ?? response.data?.response ?? "");
};
