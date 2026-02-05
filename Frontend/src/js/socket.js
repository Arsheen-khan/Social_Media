// Socket.io configuration
let socket = null;

function initSocket() {
    if (socket) return socket;

    socket = io('http://localhost:5000', {
        withCredentials: true,
        autoConnect: true,
    });

    socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });

    return socket;
}

function getSocket() {
    if (!socket) {
        initSocket();
    }
    return socket;
}

function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

export { initSocket, getSocket, disconnectSocket };
