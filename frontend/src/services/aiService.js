import axios from "axios";

const RAW_URL = import.meta.env.VITE_API_URL || "https://apm-ai-website.onrender.com";
const BASE_URL = RAW_URL.endsWith('/') ? RAW_URL.slice(0, -1) : RAW_URL;
const API_TEXT_URL = `${BASE_URL}/api/v1/chat/`;
const API_IMAGE_URL = `${BASE_URL}/api/v1/ai/chat-with-image`;
const API_USER_URL = `${BASE_URL}/api/v1/user`;
const API_TODOS_URL = `${BASE_URL}/api/v1/todos`;
const API_SHEETS_URL = `${BASE_URL}/api/v1/study-sheets`;
const API_INVENTORY_URL = `${BASE_URL}/api/v1/inventory`;
const API_NOTIFICATIONS_URL = `${BASE_URL}/api/v1/notifications`;
const API_PDF_URL = `${BASE_URL}/api/v1/ai/chat-with-pdf`;

// Helper สำหรับดึง Token และจัดการ Header
// ถ้าไม่มี token (Guest) จะไม่ส่ง Authorization header เพื่อให้แชทได้โดยไม่ต้อง Login
const authHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---------- Auth ----------
export const login = async (identifier, password) => {
    const response = await axios.post(`${BASE_URL}/api/v1/user/login`, {
        username: identifier.includes("@") ? "" : identifier,
        email: identifier.includes("@") ? identifier : "",
        password,
    });
    return response.data; // { access_token, token_type, username, email }
};

export const register = async (username, email, password) => {
    const response = await axios.post(`${BASE_URL}/api/v1/user/register`, {
        username, email, password,
    });
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await axios.post(`${BASE_URL}/api/v1/user/forgot-password`, { email });
    return response.data;
};

export const resetPassword = async (token, new_password) => {
    const response = await axios.post(`${BASE_URL}/api/reset-password`, { token, new_password });
    return response.data;
};

// ---------- AI ----------
export const sendMessageToAI = async (message, mode, sheet_ids = [], context_history_id = null, conversation_history = null) => {
    // ... (Keep existing Axios implementation as fallback)
    const payload = { message, mode, sheet_ids };
    if (context_history_id) payload.context_history_id = context_history_id;
    if (conversation_history) payload.conversation_history = conversation_history;
    
    const response = await axios.post(API_TEXT_URL, payload, { headers: authHeader(), timeout: 60000 });
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

export const sendMessageToAIWithImage = async (prompt, mode, imageFile, context_history_id = null, conversation_history = null) => {
    const formData = new FormData();
    formData.append("prompt", prompt || "");
    formData.append("mode", mode || "bro");
    formData.append("file", imageFile);
    if (context_history_id) {
        formData.append("context_history_id", context_history_id);
    }
    if (conversation_history) {
        formData.append("conversation_history", JSON.stringify(conversation_history));
    }

    const response = await axios.post(API_IMAGE_URL, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            ...authHeader()
        },
        timeout: 90000 // 90 seconds timeout for images
    });
    return String(response.data?.reply ?? response.data?.response ?? "");
};

/**
 * Chat with PDF content
 * @param {string} prompt - User message or summary instruction
 * @param {string} mode - AI personality (bro, nerd, etc.)
 * @param {File|Blob} pdfFile - PDF file or Blob data
 * @returns {Promise<string>} AI reply
 */
export const sendMessageToAIWithPDF = async (prompt, mode, pdfFile) => {
    const formData = new FormData();
    formData.append("prompt", prompt || "");
    formData.append("mode", mode || "bro");
    formData.append("file", pdfFile);

    // Guest สามารถใช้ฟีเจอร์ PDF ได้เช่นกัน
    const response = await axios.post(API_PDF_URL, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            ...authHeader()
        },
    });
    return String(response.data?.reply ?? "");
};

// ---------- User ----------
export const getUserProfile = async () => {
    const response = await axios.get(`${API_USER_URL}/me`, { headers: authHeader() });
    return response.data;
};

export const updateCoins = async (amount) => {
    const response = await axios.patch(
        `${API_USER_URL}/coins`,
        { amount },
        { headers: authHeader() }
    );
    return response.data;
};

// ---------- Inventory ----------
export const fetchOwnedAvatars = async () => {
    const response = await axios.get(`${API_INVENTORY_URL}/avatars`, { headers: authHeader() });
    return response.data;
};

export const fetchOwnedRooms = async () => {
    const response = await axios.get(`${API_INVENTORY_URL}/rooms`, { headers: authHeader() });
    return response.data;
};

export const fetchAvatarCatalog = async () => {
    const response = await axios.get(`${API_INVENTORY_URL}/all-avatars`, { headers: authHeader() });
    return response.data;
};

export const fetchRoomCatalog = async () => {
    const response = await axios.get(`${API_INVENTORY_URL}/all-rooms`, { headers: authHeader() });
    return response.data;
};

export const buyAvatarApi = async (avatar_id) => {
    const response = await axios.post(`${API_INVENTORY_URL}/buy-avatar`, { avatar_id }, { headers: authHeader() });
    return response.data;
};

export const buyRoomApi = async (room_id) => {
    const response = await axios.post(`${API_INVENTORY_URL}/buy-room`, { room_id }, { headers: authHeader() });
    return response.data;
};

export const equipAvatarApi = async (avatar_id) => {
    const response = await axios.post(`${API_INVENTORY_URL}/equip-avatar`, { avatar_id }, { headers: authHeader() });
    return response.data;
};

export const equipRoomApi = async (room_id) => {
    const response = await axios.post(`${API_INVENTORY_URL}/equip-room`, { room_id }, { headers: authHeader() });
    return response.data;
};

export const updateExp = async (amount) => {
    const response = await axios.patch(`${API_USER_URL}/exp`, { amount }, { headers: authHeader() });
    return response.data;
};

// ---------- Chat History ----------
export const fetchChatHistory = async () => {
    const response = await axios.get(`${BASE_URL}/api/v1/chat/history`, { headers: authHeader() });
    return response.data;
};

// ---------- Todos ----------
export const fetchTodos = async () => {
    const response = await axios.get(API_TODOS_URL + "/", { headers: authHeader() });
    return response.data;
};

export const createTodo = async (task_text) => {
    const response = await axios.post(
        API_TODOS_URL + "/",
        { task_text },
        { headers: authHeader() }
    );
    return response.data;
};

export const toggleTodo = async (id) => {
    const response = await axios.put(
        `${API_TODOS_URL}/${id}/toggle`,
        {},
        { headers: authHeader() }
    );
    return response.data;
};

export const deleteTodo = async (id) => {
    await axios.delete(`${API_TODOS_URL}/${id}`, { headers: authHeader() });
};

export const uploadTodoProof = async (id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${API_TODOS_URL}/${id}/proof`, formData, {
        headers: { "Content-Type": "multipart/form-data", ...authHeader() },
    });
    return response.data;
};

export const verifyTodo = async (id, status) => {
    const response = await axios.patch(`${API_TODOS_URL}/${id}/verify`, { status }, { headers: authHeader() });
    return response.data;
};

export const fetchPendingTodos = async () => {
    const response = await axios.get(`${API_TODOS_URL}/admin/all`, { headers: authHeader() });
    return response.data;
};

// ---------- Study Sheets ----------
export const fetchMySheets = async () => {
    const response = await axios.get(API_SHEETS_URL + "/", { headers: authHeader() });
    return response.data;
};

export const fetchMarketSheets = async () => {
    const response = await axios.get(`${API_SHEETS_URL}/market`, { headers: authHeader() });
    return response.data;
};

export const uploadSheet = async (title, price, is_public, file) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("is_public", is_public);
    formData.append("file", file);

    const response = await axios.post(`${API_SHEETS_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data", ...authHeader() },
    });
    return response.data;
};

export const buySheet = async (sheet_id) => {
    const response = await axios.post(
        `${API_SHEETS_URL}/${sheet_id}/buy`,
        {},
        { headers: authHeader() }
    );
    return response.data;
};

export const fetchPurchasedSheets = async () => {
    const response = await axios.get(`${API_SHEETS_URL}/my-purchased`, { headers: authHeader() });
    return response.data;
};

export const toggleSheetPublish = async (sheet_id) => {
    const response = await axios.patch(
        `${API_SHEETS_URL}/${sheet_id}/publish`,
        {},
        { headers: authHeader() }
    );
    return response.data;
};

export const updateSheetPrice = async (sheet_id, price) => {
    const response = await axios.patch(
        `${API_SHEETS_URL}/${sheet_id}/price`,
        { price },
        { headers: authHeader() }
    );
    return response.data;
};

export const deleteSheet = async (sheet_id) => {
    const response = await axios.delete(
        `${API_SHEETS_URL}/${sheet_id}`,
        { headers: authHeader() }
    );
    return response.data;
};

// ---------- Notifications ----------
export const fetchNotifications = async () => {
    const response = await axios.get(API_NOTIFICATIONS_URL + "/", { headers: authHeader() });
    return response.data;
};

export const fetchUnreadNotificationCount = async () => {
    const response = await axios.get(`${API_NOTIFICATIONS_URL}/unread-count`, { headers: authHeader() });
    return response.data.unread_count;
};

export const markAllNotificationsRead = async () => {
    const response = await axios.patch(`${API_NOTIFICATIONS_URL}/read-all`, {}, { headers: authHeader() });
    return response.data;
};

export const markNotificationRead = async (id) => {
    const response = await axios.patch(`${API_NOTIFICATIONS_URL}/${id}/read`, {}, { headers: authHeader() });
    return response.data;
};