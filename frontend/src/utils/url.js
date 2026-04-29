export const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://apm-ai-website.onrender.com").replace(/\/$/, "");

export const formatDocUrl = (path) => {
    if (!path) return "";

    // If path is already a full URL, return it
    if (path.startsWith("http")) {
        // Fix localhost/127.0.0.1 in case they leaked from dev
        if (path.includes("localhost:8000") || path.includes("127.0.0.1:8000")) {
            return path.replace(/^https?:\/\/[^/]+/, API_BASE_URL);
        }
        return path;
    }

    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

    // Check if it's already an uploads path
    if (normalizedPath.startsWith('uploads/')) {
        return `${API_BASE_URL}/${normalizedPath}`;
    }
    
    // Default to sheets upload path
    return `${API_BASE_URL}/uploads/sheets/${normalizedPath}`;
};
