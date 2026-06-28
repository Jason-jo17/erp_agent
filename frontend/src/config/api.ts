export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8006";

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('access_token');
    
    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    
    const newOptions: RequestInit = {
        ...options,
        headers,
    };
    
    const response = await fetch(url, newOptions);
    
    if (response.status === 401) {
        // Optional: Handle token expiration globally (e.g. redirect to login)
        console.error("Unauthorized: Please log in again.");
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        window.location.href = '/login';
    }
    
    return response;
};
