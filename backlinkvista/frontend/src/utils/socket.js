import { io } from 'socket.io-client';

// Create socket instance with proper error handling
const socket = io('http://localhost:3000', {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

// Socket event handlers
socket.on('connect', () => {
  console.log('Socket connected');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

export { socket };
