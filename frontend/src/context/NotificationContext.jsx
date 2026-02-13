import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './UserContext';
import axios from 'axios';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { socket, isConnected } = useSocket();
    const { user } = useAuth();

    // Fetch initial notifications
    useEffect(() => {
        if (user) {
            fetchNotifications();
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [user]);

    // Setup socket authentication and listeners
    useEffect(() => {
        if (socket && isConnected && user) {
            const userId = user._id || user.id;
            console.log('🔌 Socket connected, authenticating user:', userId);
            console.log('🔌 Full user object:', user);
            
            // Authenticate user with socket
            if (userId) {
                socket.emit('authenticate', userId);
            } else {
                console.error('❌ No user ID found in user object!');
            }

            // Listen for new notifications
            socket.on('notification', (notification) => {
                console.log('🔔 NEW NOTIFICATION RECEIVED:', notification);
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);
                
                // Show browser notification if permitted
                if (Notification.permission === 'granted') {
                    new Notification(notification.title, {
                        body: notification.message,
                        icon: '/favicon.ico'
                    });
                }
            });

            return () => {
                socket.off('notification');
            };
        } else {
            console.log('🔌 Socket status - Connected:', isConnected, 'User:', !!user);
        }
    }, [socket, isConnected, user]);

    // Request browser notification permission
    useEffect(() => {
        if (user && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            console.log('🔔 Fetching notifications for user:', user);
            console.log('🔔 User role:', user?.role);
            
            const endpoint = user?.role === 'provider' 
                ? '/api/notifications' 
                : '/api/customer/notifications';
            
            console.log('🔔 Endpoint:', endpoint);
            const { data } = await axios.get(endpoint);
            console.log('🔔 Response:', data);
            
            if (data.success) {
                const notifs = user?.role === 'provider' 
                    ? data.data 
                    : data.data?.notifications;
                
                console.log('🔔 Parsed notifications:', notifs);
                setNotifications(notifs || []);
                setUnreadCount(notifs?.filter(n => !n.isRead && !n.read).length || 0);
            }
        } catch (error) {
            console.error('❌ Failed to fetch notifications:', error);
            console.error('❌ Error response:', error.response?.data);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const endpoint = user?.role === 'provider'
                ? `/api/notifications/${notificationId}/read`
                : `/api/customer/notifications/${notificationId}/read`;
            
            await axios.put(endpoint);
            
            setNotifications(prev =>
                prev.map(n => n._id === notificationId ? { ...n, isRead: true, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const endpoint = user?.role === 'provider'
                ? '/api/notifications/mark-all-read'
                : '/api/customer/notifications/mark-all-read';
            
            await axios.put(endpoint);
            
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            refreshNotifications: fetchNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
