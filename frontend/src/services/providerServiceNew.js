import ProviderApi from './ProviderApi';

// ============================================
// PROVIDER SERVICE - Backend API Calls
// ============================================

const providerService = {
  
  // ========== DASHBOARD APIs ==========
  
  /**
   * Dashboard stats fetch karna
   * Backend Route: GET /api/provider/dashboard
   * Returns: { totalOrders, activeCustomers, revenue, pendingOrders }
   */
  getDashboardStats: async () => {
    try {
      const response = await ProviderApi.get('/provider/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Kitchen status toggle karna (Open/Close)
   * Backend Route: PATCH /api/provider/kitchen-status
   */
  toggleKitchenStatus: async () => {
    try {
      const response = await ProviderApi.patch('/provider/kitchen-status');
      return response.data;
    } catch (error) {
      console.error('Error toggling kitchen status:', error);
      throw error;
    }
  },

  // ========== MENU APIs ==========
  
  /**
   * Aaj ka menu fetch karna
   * Backend Route: GET /api/provider-menu/today
   */
  getTodaysMenu: async () => {
    try {
      const response = await ProviderApi.get('/provider-menu/today');
      return response.data;
    } catch (error) {
      console.error('Error fetching today menu:', error);
      throw error;
    }
  },

  /**
   * Menu create ya update karna
   * Backend Route: POST /api/provider-menu
   * Data: { name, price, description, category, isAvailable }
   */
  createOrUpdateMenu: async (menuData) => {
    try {
      const response = await ProviderApi.post('/provider-menu', menuData);
      return response.data;
    } catch (error) {
      console.error('Error creating/updating menu:', error);
      throw error;
    }
  },

  /**
   * Menu publish karna
   * Backend Route: PUT /api/provider-menu/publish/:id
   */
  publishMenu: async (menuId) => {
    try {
      const response = await ProviderApi.put(`/provider-menu/publish/${menuId}`);
      return response.data;
    } catch (error) {
      console.error('Error publishing menu:', error);
      throw error;
    }
  },

  // ========== SUBSCRIPTIONS APIs ==========
  
  /**
   * Active customers/subscriptions fetch karna
   * Backend Route: GET /api/provider/subscriptions
   */
  getActiveCustomers: async () => {
    try {
      const response = await ProviderApi.get('/provider/subscriptions');
      return response.data;
    } catch (error) {
      console.error('Error fetching active customers:', error);
      throw error;
    }
  },

  // ========== STORE PROFILE APIs ==========
  
  /**
   * Store profile fetch karna
   * Backend Route: GET /api/provider/store-profile
   */
  getStoreProfile: async () => {
    try {
      const response = await ProviderApi.get('/provider/store-profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching store profile:', error);
      throw error;
    }
  },

  /**
   * Store profile update karna
   * Backend Route: PUT /api/provider/store-profile
   */
  updateStoreProfile: async (profileData) => {
    try {
      const response = await ProviderApi.put('/provider/store-profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating store profile:', error);
      throw error;
    }
  },

  // ========== WALLET APIs ==========
  
  /**
   * Wallet details fetch karna
   * Backend Route: GET /api/provider/wallet
   */
  getWallet: async () => {
    try {
      const response = await ProviderApi.get('/provider/wallet');
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet:', error);
      throw error;
    }
  },

  // ========== KDS (Kitchen Display System) APIs ==========
  
  /**
   * Kitchen orders fetch karna
   * Backend Route: GET /api/provider/kds
   */
  getKDSOrders: async () => {
    try {
      const response = await ProviderApi.get('/provider/kds');
      return response.data;
    } catch (error) {
      console.error('Error fetching KDS orders:', error);
      throw error;
    }
  },

  // ========== REVIEWS APIs ==========
  
  /**
   * Customer reviews fetch karna
   * Backend Route: GET /api/provider/reviews
   */
  getReviews: async () => {
    try {
      const response = await ProviderApi.get('/provider/reviews');
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },
};

export default providerService;