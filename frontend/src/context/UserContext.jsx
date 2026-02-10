import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const UserContext = createContext();

export const useAuth = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isLoading, setIsLoading] = useState(true);

    // ================= AXIOS INTERCEPTORS =================
    useEffect(() => {
        // Request interceptor to add token
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const currentToken = localStorage.getItem('token');
                if (currentToken) {
                    config.headers.Authorization = `Bearer ${currentToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor to handle 401s
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                // If unauthorized and not already on login page
                if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
                    console.warn("Unauthorized access detected. Redirecting to login...");
                    logout();
                    toast.error("Session expired. Please login again.");
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []); // Run only once on mount, using localStorage in interceptor for latest value

    // ================= SESSION VERIFICATION =================
    // App load hote hi check karein ki user authenticated hai ya nahi
    useEffect(() => {
        const verifySession = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                // Humne interceptor lagaya hai to token header mein khud jayega
                const { data } = await axios.get('/api/auth/profile');
                setUser(data.user);
            } catch (error) {
                console.error("Session verification failed:", error);
                // Clear invalid token
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, [token]);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });

            if (data.token) {
                localStorage.setItem('token', data.token);
                // We shouldn't store name/role in localStorage as per user request
                // The user object in state will be the source of truth
                setToken(data.token);
                setUser(data.user);

                toast.success(`Welcome back, ${data.user.name || 'User'}!`);
                return data.user.role;
            }
        } catch (error) {
            console.error("Login Error Details:", error.response || error);
            let errorMessage = "Login failed. Please try again.";

            if (error.response) {
                errorMessage = error.response.data?.message || `Error: ${error.response.statusText}`;
            } else if (error.request) {
                errorMessage = "No response from server. Check backend.";
            } else {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        toast.success("Logged out successfully");
        // Use relative path to avoid full reload if not needed, 
        // but window.location ensures clean state
        window.location.href = '/login';
    };

    return (
        <UserContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};