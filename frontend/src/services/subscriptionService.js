import api from '../config/api.js';

class SubscriptionService {
  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // Create subscription
  async createSubscription(subscriptionData) {
    try {
      const response = await fetch(api.subscriptions.create, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(subscriptionData),
      });
      
      const data = await response.json();
      return response.ok ? { success: true, data } : { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  // Get all subscriptions
  async getSubscriptions() {
    try {
      const response = await fetch(api.subscriptions.getAll, {
        headers: this.getAuthHeaders(),
      });
      
      const data = await response.json();
      return response.ok ? { success: true, data } : { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  // Get subscription by ID
  async getSubscriptionById(id) {
    try {
      const response = await fetch(api.subscriptions.getById(id), {
        headers: this.getAuthHeaders(),
      });
      
      const data = await response.json();
      return response.ok ? { success: true, data } : { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  // Update subscription
  async updateSubscription(id, updateData) {
    try {
      const response = await fetch(api.subscriptions.update(id), {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      return response.ok ? { success: true, data } : { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  // Delete subscription
  async deleteSubscription(id) {
    try {
      const response = await fetch(api.subscriptions.delete(id), {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      const data = await response.json();
      return response.ok ? { success: true, data } : { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }
}

export default new SubscriptionService();