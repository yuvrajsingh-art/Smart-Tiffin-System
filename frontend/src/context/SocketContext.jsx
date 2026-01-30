import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Connect to Socket.io server using stable options
        const newSocket = io('http://localhost:5000', {
            withCredentials: true,
            transports: ['websocket'], // Stick to websocket if possible
            reconnectionAttempts: 5,
            timeout: 10000
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('✅ Connected to Socket.io Server:', newSocket.id);
        });

        newSocket.on('connect_error', (err) => {
            console.error('❌ Socket Connection Error:', err);
        });

        // Cleanup on unmount
        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
