import axios from "axios";

const RAW_URL = import.meta.env.VITE_API_URL || "https://apm-ai-website.onrender.com";
const BASE_URL = RAW_URL.endsWith('/') ? RAW_URL.slice(0, -1) : RAW_URL;

// สร้าง Axios Instance เพื่อจัดการ Config ในที่เดียว
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
});

// Interceptor สำหรับใส่ Token ในทุก Request โดยอัตโนมัติ
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor สำหรับดักจับ Error ทั่วโลก (เช่น Token หมดอายุ)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token หมดอายุ หรือไม่ถูกต้อง
            console.warn("Session expired. Logging out...");
            localStorage.clear();
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login?expired=true";
            }
        }
        return Promise.reject(error);
    }
);

// ---------- Auth ----------
export const login = async (identifier, password) => {
    const response = await api.post(`/api/v1/user/login`, {
        username: identifier.includes("@") ? "" : identifier,
        email: identifier.includes("@") ? identifier : "",
        password,
    });
    return response.data;
};

export const register = async (username, email, password) => {
    const response = await api.post(`/api/v1/user/register`, {
        username, email, password,
    });
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post(`/api/v1/user/forgot-password`, { email });
    return response.data;
};

// ✅ FIX: แก้ไข URL ให้ถูกต้องตาม Backend (เพิ่ม /v1/user)
export const resetPassword = async (token, new_password) => {
    const response = await api.post(`/api/v1/user/reset-password`, { token, new_password });
    return response.data;
};

// ---------- AI ----------
export const sendMessageToAI = async (message, mode, sheet_ids = [], context_history_id = null, conversation_history = null) => {
    const payload = { message, mode, sheet_ids };
    if (context_history_id) payload.context_history_id = context_history_id;
    if (conversation_history) payload.conversation_history = conversation_history;
    
    const response = await api.post("/api/v1/chat/", payload);
    return String(response.data?.reply ?? "");
};

/**
 * Streaming Chat 
 */
export const sendMessageToAIStreaming = async (message, mode, sheet_ids = [], conversation_history = null, onChunk) => {
    const payload = { message, mode, sheet_ids, conversation_history };
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const response = await fetch(`${BASE_URL}/api/v1/chat/stream`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
    });

    if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/login?expired=true";
        return;
    }

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Network response was not ok");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
            const chunk = decoder.decode(value, { stream: true });
            onChunk(chunk);
        }
    }
};

export const sendMessageToAIWithImage = async (prompt, mode, imageFile, context_history_id = null, conversation_history = null) => {
    const formData = new FormData();
    formData.append("prompt", prompt || "");
    formData.append("mode", mode || "nerd");
    formData.append("file", imageFile);
    if (context_history_id) formData.append("context_history_id", context_history_id);
    if (conversation_history) formData.append("conversation_history", JSON.stringify(conversation_history));

    const response = await api.post("/api/v1/ai/chat-with-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 90000 
    });
    return String(response.data?.reply ?? response.data?.response ?? "");
};

export const sendMessageToAIWithImageStreaming = async (prompt, mode, imageFile, onChunk) => {
    const formData = new FormData();
    formData.append("prompt", prompt || "");
    formData.append("mode", mode || "nerd");
    if (imageFile) formData.append("file", imageFile);

    const token = localStorage.getItem("token");
    const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const response = await fetch(`${BASE_URL}/api/v1/ai/chat-with-image/stream`, {
        method: "POST",
        headers,
        body: formData
    });

    if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/login?expired=true";
        return;
    }

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Network response was not ok");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
            const chunk = decoder.decode(value, { stream: true });
            onChunk(chunk);
        }
    }
};

export const sendMessageToAIWithPDF = async (prompt, mode, pdfFile) => {
    const formData = new FormData();
    formData.append("prompt", prompt || "");
    formData.append("mode", mode || "nerd");
    formData.append("file", pdfFile);

    const response = await api.post("/api/v1/ai/chat-with-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return String(response.data?.reply ?? "");
};

export const sendMessageToAIWithPDFStreaming = async (prompt, mode, pdfFile, onChunk) => {
    const formData = new FormData();
    formData.append("prompt", prompt || "");
    formData.append("mode", mode || "nerd");
    formData.append("file", pdfFile);

    const token = localStorage.getItem("token");
    const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const response = await fetch(`${BASE_URL}/api/v1/ai/chat-with-pdf/stream`, {
        method: "POST",
        headers,
        body: formData
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
            const chunk = decoder.decode(value, { stream: true });
            onChunk(chunk);
        }
    }
};

// ---------- User ----------
export const getUserProfile = async () => {
    const response = await api.get(`/api/v1/user/me`);
    return response.data;
};

export const updateCoins = async (amount) => {
    const response = await api.patch(`/api/v1/user/coins`, { amount });
    return response.data;
};

// ---------- Inventory ----------
export const fetchOwnedAvatars = async () => {
    const response = await api.get(`/api/v1/inventory/avatars`);
    return response.data;
};

export const fetchOwnedRooms = async () => {
    const response = await api.get(`/api/v1/inventory/rooms`);
    return response.data;
};

export const fetchAvatarCatalog = async () => {
    const response = await api.get(`/api/v1/inventory/all-avatars`);
    return response.data;
};

export const fetchRoomCatalog = async () => {
    const response = await api.get(`/api/v1/inventory/all-rooms`);
    return response.data;
};

export const buyAvatarApi = async (avatar_id) => {
    const response = await api.post(`/api/v1/inventory/buy-avatar`, { avatar_id });
    return response.data;
};

export const buyRoomApi = async (room_id) => {
    const response = await api.post(`/api/v1/inventory/buy-room`, { room_id });
    return response.data;
};

export const equipAvatarApi = async (avatar_id) => {
    const response = await api.post(`/api/v1/inventory/equip-avatar`, { avatar_id });
    return response.data;
};

export const equipRoomApi = async (room_id) => {
    const response = await api.post(`/api/v1/inventory/equip-room`, { room_id });
    return response.data;
};

export const updateExp = async (amount) => {
    const response = await api.patch(`/api/v1/user/exp`, { amount });
    return response.data;
};

// ---------- Chat History ----------
export const fetchChatHistory = async () => {
    const response = await api.get(`/api/v1/chat/history`);
    return response.data;
};

export const deleteChatHistoryItem = async (history_id) => {
    const response = await api.delete(`/api/v1/chat/history/${history_id}`);
    return response.data;
};

export const clearAllChatHistory = async () => {
    const response = await api.delete(`/api/v1/chat/history/clear/all`);
    return response.data;
};

// ---------- Todos ----------
export const fetchTodos = async () => {
    const response = await api.get(`/api/v1/todos/`);
    return response.data;
};

export const createTodo = async (task_text) => {
    const response = await api.post(`/api/v1/todos/`, { task_text });
    return response.data;
};

export const toggleTodo = async (id) => {
    const response = await api.put(`/api/v1/todos/${id}/toggle`, {});
    return response.data;
};

export const deleteTodo = async (id) => {
    await api.delete(`/api/v1/todos/${id}`);
};

export const uploadTodoProof = async (id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/api/v1/todos/${id}/proof`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const verifyTodo = async (id, status) => {
    const response = await api.patch(`/api/v1/todos/${id}/verify`, { status });
    return response.data;
};

export const fetchPendingTodos = async () => {
    const response = await api.get(`/api/v1/todos/admin/all`);
    return response.data;
};

// ---------- Study Sheets ----------
export const fetchMySheets = async () => {
    const response = await api.get(`/api/v1/study-sheets/`);
    return response.data;
};

export const fetchMarketSheets = async () => {
    const response = await api.get(`/api/v1/study-sheets/market`);
    return response.data;
};

export const uploadSheet = async (title, price, is_public, file, extractedText = null) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("is_public", is_public);
    formData.append("file", file);
    if (extractedText) formData.append("extracted_text", extractedText);

    const response = await api.post(`/api/v1/study-sheets/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const buySheet = async (sheet_id) => {
    const response = await api.post(`/api/v1/study-sheets/${sheet_id}/buy`, {});
    return response.data;
};

export const fetchPurchasedSheets = async () => {
    const response = await api.get(`/api/v1/study-sheets/my-purchased`);
    return response.data;
};

export const toggleSheetPublish = async (sheet_id) => {
    const response = await api.patch(`/api/v1/study-sheets/${sheet_id}/publish`, {});
    return response.data;
};

export const updateSheetPrice = async (sheet_id, price) => {
    const response = await api.patch(`/api/v1/study-sheets/${sheet_id}/price`, { price });
    return response.data;
};

export const deleteSheet = async (sheet_id) => {
    const response = await api.delete(`/api/v1/study-sheets/${sheet_id}`);
    return response.data;
};

// ---------- Notifications ----------
export const fetchNotifications = async () => {
    const response = await api.get(`/api/v1/notifications/`);
    return response.data;
};

export const fetchUnreadNotificationCount = async () => {
    const response = await api.get(`/api/v1/notifications/unread-count`);
    return response.data.unread_count;
};

export const markAllNotificationsRead = async () => {
    const response = await api.patch(`/api/v1/notifications/read-all`, {});
    return response.data;
};

export const markNotificationRead = async (id) => {
    const response = await api.patch(`/api/v1/notifications/${id}/read`, {});
    return response.data;
};

// ---------- AI Summarize (Backend Prompt Mode) ----------
export const summarizeSheet = async (sheetId) => {
    const response = await api.post(`/api/v1/chat/summarize/${sheetId}`, {});
    return response.data;
};

export const summarizeSheetStreaming = async (sheetId, onChunk) => {
    const token = localStorage.getItem("token");
    const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };

    const response = await fetch(`${BASE_URL}/api/v1/chat/summarize/${sheetId}/stream`, {
        method: "POST",
        headers
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
            const chunk = decoder.decode(value, { stream: true });
            onChunk(chunk);
        }
    }
};

// ---------- Special Missions & Reading Time ----------
export const fetchSpecialMissions = async () => {
    const response = await api.get(`/api/v1/user/special-missions`);
    return response.data;
};

export const addReadingTime = async (minutes) => {
    const response = await api.post(`/api/v1/user/add-reading-time`, { minutes });
    return response.data;
};

export const claimSpecialMission = async (missionId) => {
    const response = await api.post(`/api/v1/user/claim-mission/${missionId}`, {});
    return response.data;
};

export const fetchLeaderboard = async () => {
    const response = await api.get(`/api/v1/user/leaderboard`);
    return response.data;
};

// ---------- AI Assistant Features ----------
export const getAiGreeting = async (mode = "bro") => {
    const response = await api.get(`/api/v1/ai-assistant/greeting`, { params: { mode } });
    return response.data.reply;
};

export const generateTodoPlan = async (goal, mode = "bro") => {
    const response = await api.get(`/api/v1/ai-assistant/todo-plan`, { params: { goal, mode } });
    return response.data.tasks;
};

export const fetchSheetQuiz = async (sheetId) => {
    const response = await api.get(`/api/v1/ai-assistant/study-sheets/${sheetId}/quiz`);
    return response.data.quiz;
};