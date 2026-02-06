import api from '../config/api.js';

class FeedbackService {
    // Get feedback stats and current meal for review
    async getFeedbackData() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(api.feedback.data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.data };
            }

            return { success: false, error: data.message };
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    }

    // Submit new feedback
    async submitFeedback(feedbackData) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(api.feedback.submit, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(feedbackData),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.data };
            }

            return { success: false, error: data.message };
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    }

    // Get feedback history with pagination
    async getFeedbackHistory(page = 1, limit = 10) {
        try {
            const token = localStorage.getItem('token');
            const url = `${api.feedback.history}?page=${page}&limit=${limit}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.data };
            }

            return { success: false, error: data.message };
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    }

    // Get available tags
    async getFeedbackTags() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(api.feedback.tags, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.data };
            }

            return { success: false, error: data.message };
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    }
}

export default new FeedbackService();
