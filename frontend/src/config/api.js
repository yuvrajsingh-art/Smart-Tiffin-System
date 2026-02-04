const API_BASE_URL = 'http://localhost:5000/api';

const api = {
  // Auth endpoints
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    profile: `${API_BASE_URL}/auth/profile`,
  },

  // Subscription endpoints
  subscriptions: {
    create: `${API_BASE_URL}/subscriptions`,
    getAll: `${API_BASE_URL}/subscriptions`,
    getById: (id) => `${API_BASE_URL}/subscriptions/${id}`,
    update: (id) => `${API_BASE_URL}/subscriptions/${id}`,
    delete: (id) => `${API_BASE_URL}/subscriptions/${id}`,
  },

  // Menu endpoints
  menus: {
    customer: `${API_BASE_URL}/customer-menus`,
    provider: `${API_BASE_URL}/provider-menus`,
  },

  // Tiffin endpoints
  tiffins: {
    getAll: `${API_BASE_URL}/tiffins`,
    create: `${API_BASE_URL}/tiffins`,
    getById: (id) => `${API_BASE_URL}/tiffins/${id}`,
  },

  // Delivery endpoints
  delivery: {
    status: `${API_BASE_URL}/deliveriestatus`,
  },

  // Provider profile endpoints
  provider: {
    profile: `${API_BASE_URL}/providerprofiles`,
  },

  // Customer Feedback endpoints
  feedback: {
    data: `${API_BASE_URL}/customer/feedback/data`,
    submit: `${API_BASE_URL}/customer/feedback/submit`,
    history: `${API_BASE_URL}/customer/feedback/history`,
    tags: `${API_BASE_URL}/customer/feedback/tags`,
    update: (id) => `${API_BASE_URL}/customer/feedback/update/${id}`,
  }
};

export default api;