import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";
const API_TEXT_URL = `${BASE_URL}/api/v1/chat/`;
const API_IMAGE_URL = `${BASE_URL}/api/v1/ai/chat-with-image`;
const API_USER_URL = `${BASE_URL}/api/v1/user`;
const API_TODOS_URL = `${BASE_URL}/api/v1/todos`;
const API_SHEETS_URL = `${BASE_URL}/api/v1/study-sheets`;
const API_INVENTORY_URL = `${BASE_URL}/api/v1/inventory`;

// Helper สำหรับดึง Token และจัดการ Header
const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

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
export const sendMessageToAI = async (message, mode, sheet_ids = []) => {
    const response = await axios.post(
        API_TEXT_URL,
        { message, mode, sheet_ids },
        { headers: authHeader() }
    );
    return String(response.data?.reply ?? "");
};

export const sendMessageToAIWithImage = async (prompt, mode, imageFile) => {
    const formData = new FormData();
    formData.append("prompt", prompt || "");
    formData.append("mode", mode || "bro");
    formData.append("file", imageFile);

    const response = await axios.post(API_IMAGE_URL, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            ...authHeader()
        },
    });
    return String(response.data?.reply ?? response.data?.response ?? "");
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