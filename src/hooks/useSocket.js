import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

export function useSocket() {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState(null);
  const keepaliveRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      randomizationFactor: 0.5,
      timeout: 30000,
      withCredentials: true,
      autoConnect: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      console.log('Socket connected:', socket.id);

      const roomCode = sessionStorage.getItem('roomCode');
      const playerId = sessionStorage.getItem('playerId');
      if (roomCode && playerId) {
        socket.emit('joinRoom', {
          roomCode,
          playerId,
          playerName: sessionStorage.getItem('playerName') || 'Player'
        }, (res) => {
          if (!res.success) {
            sessionStorage.removeItem('roomCode');
            sessionStorage.removeItem('playerId');
          }
        });
      }
    });

    socket.on('disconnect', (reason) => {
      setConnected(false);
      console.log('Socket disconnected:', reason);
    });

    socket.on('gameState', (state) => {
      setGameState(state);
    });

    // Keepalive to prevent mobile browsers / proxies from dropping idle sockets
    keepaliveRef.current = setInterval(() => {
      if (socket.connected) {
        socket.emit('clientPing');
      }
    }, 15000);

    return () => {
      if (keepaliveRef.current) clearInterval(keepaliveRef.current);
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
