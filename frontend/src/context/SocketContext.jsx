import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

// Backend URL configuration - change this if backend runs on different port
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        // Prevent multiple connections
        if (socketRef.current) {
            return;
        }

        // Connect to Socket.io server with robust options
        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['polling', 'websocket'], // Start with polling, upgrade to websocket
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            autoConnect: true,
            forceNew: false  // Reuse existing connection if possible
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        newSocket.on('connect', () => {
            setIsConnected(true);
            console.log('✅ Connected to Socket.io Server:', newSocket.id);
            console.log('📡 Transport:', newSocket.io.engine.transport.name);
        });

        newSocket.on('disconnect', (reason) => {
            setIsConnected(false);
            console.log('🔌 Socket Disconnected:', reason);
            // Auto reconnect if server disconnects
            if (reason === 'io server disconnect') {
                newSocket.connect();
            }
        });

        newSocket.on('connect_error', (err) => {
            console.warn('⚠️ Socket Connection Error:', err.message);
        });

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
