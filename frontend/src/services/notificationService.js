import axios from "axios";

const RAW_URL = import.meta.env.VITE_API_BASE_URL || "https://apm-ai-website.onrender.com";
const BASE_URL = RAW_URL.endsWith('/') ? RAW_URL.slice(0, -1) : RAW_URL;
const API_URL = `${BASE_URL}/api/v1/notifications`;

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchNotifications = async () => {
    const response = await axios.get(`${API_URL}/`, { headers: authHeader() });
    return response.data;
};

export const fetchUnreadCount = async () => {
    const response = await axios.get(`${API_URL}/unread-count`, { headers: authHeader() });
    return response.data.unread_count;
};

export const markNotificationRead = async (id) => {
    const response = await axios.patch(`${API_URL}/${id}/read`, {}, { headers: authHeader() });
    return response.data;
};

export const markAllNotificationsRead = async () => {
    const response = await axios.patch(`${API_URL}/read-all`, {}, { headers: authHeader() });
    return response.data;
};
