import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

export function useSocket() {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      console.log('Socket connected:', socket.id);

      // Try to rejoin if we have a room and playerId
      const roomCode = sessionStorage.getItem('roomCode');
      const playerId = sessionStorage.getItem('playerId');
      if (roomCode && playerId) {
        socket.emit('joinRoom', { roomCode, playerId, playerName: sessionStorage.getItem('playerName') || 'Player' },
          (res) => {
            if (!res.success) {
              sessionStorage.removeItem('roomCode');
              sessionStorage.removeItem('playerId');
            }
          }
        );
      }
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('Socket disconnected');
    });

    socket.on('gameState', (state) => {
      setGameState(state);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const emit = useCallback((event, data) => {
    return new Promise((resolve) => {
      if (!socketRef.current?.connected) {
        resolve({ success: false, message: 'Not connected to server' });
        return;
      }
      socketRef.current.emit(event, data, (response) => {
        resolve(response || { success: false, message: 'No response' });
      });
    });
  }, []);

  return { socket: socketRef.current, connected, gameState, emit };
}
