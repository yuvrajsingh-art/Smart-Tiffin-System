import api from '../config/api.js';

class MenuService {
  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // Get customer menus
  async getCustomerMenus() {
    try {
      const response = await fetch(api.menus.customer, {
        headers: this.getAuthHeaders(),
      });
      
      const data = await response.json();
      return response.ok ? { success: true, data } : { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  // Get provider menus
  async getProviderMenus() {
    try {
      const response = await fetch(api.menus.provider, {
        headers: this.getAuthHeaders(),
      });
      
      const data = await response.json();
      return response.ok ? { success: true, data } : { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  // Create provider menu
  async createProviderMenu(menuData) {
    try {
      const response = await fetch(api.menus.provider, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(menuData),
      });
      
      const data = await response.json();
      return response.ok ? { success: true, data } : { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }
}

export default new MenuService();