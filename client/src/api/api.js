import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach JTW token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('taxipoa_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 - token expired, redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401) {
            localStorage.removeItem('taxipoa_token');
            localStorage.removeItem('taxipoa_user');    
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;