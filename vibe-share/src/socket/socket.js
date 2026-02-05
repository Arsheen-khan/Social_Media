import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || '';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    const connectUrl = SOCKET_URL || undefined;
    socket = io(connectUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const sendMessage = (receiver, message) => {
  const sock = getSocket();
  sock.emit('message', { receiver, message });
};

export const onMessage = (callback) => {
  const sock = getSocket();
  sock.on('message', callback);
  return () => sock.off('message', callback);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default socket;
