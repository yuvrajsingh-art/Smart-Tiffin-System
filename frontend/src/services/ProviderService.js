import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Provider Service
const providerService = {
  // Dashboard Stats
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/provider-deshbord/dashboard');
    return response.data;
  },

  // Kitchen Status Toggle
  toggleKitchenStatus: async () => {
    const response = await axiosInstance.patch('/provider-deshbord/kitchen-status');
    return response.data;
  },

  // Menu Management
  getTodaysMenu: async () => {
    const response = await axiosInstance.get('/provider-menus/today');
    return response.data;
  },

  getTodayMenu: async () => {
    const response = await axiosInstance.get('/provider-menus/today');
    return response;
  },

  createOrUpdateMenu: async (menuData) => {
    const response = await axiosInstance.post('/provider-menus', menuData);
    return response.data;
  },

  publishMenu: async (id) => {
    const response = await axiosInstance.put(`/provider-menus/publish/${id}`);
    return response.data;
  },

  deleteMenuItem: async (id) => {
    const response = await axiosInstance.delete(`/provider-menus/${id}`);
    return response.data;
  },

  toggleMenuAvailability: async (id) => {
    const response = await axiosInstance.patch(`/provider-menus/${id}/toggle`);
    return response.data;
  },

  // Store Profile
  getStoreProfile: async () => {
    const response = await axiosInstance.get('/provider-store/profile');
    return response.data;
  },

  updateStoreProfile: async (profileData) => {
    const response = await axiosInstance.put('/provider-store/profile', profileData);
    return response.data;
  },

  // Subscriptions
  getSubscriptions: async () => {
    const response = await axiosInstance.get('/provider-subscription');
    return response.data;
  },

  // Wallet
  getWallet: async () => {
    const response = await axiosInstance.get('/provider-wallet');
    return response.data;
  },

  // KDS (Kitchen Display System)
  getKDSOrders: async () => {
    const response = await axiosInstance.get('/provider-kds');
    return response.data;
  },

  // Reviews
  getReviews: async () => {
    const response = await axiosInstance.get('/provider-reviews');
    return response.data;
  },
};

export default providerService;
export const { getTodayMenu, deleteMenuItem, toggleMenuAvailability } = providerService;