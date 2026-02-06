import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000', // Hardcoded for now based on server.js
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to attach the token
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        // Note: The key used in verify_subscription was 'token', 
        // need to ensure frontend uses 'token' or 'authToken'. 
        // Looking at subscriptionService.js it uses 'token'.
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
