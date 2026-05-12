import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

export function useSocket() {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const keepaliveRef = useRef(null);
  const lastGameStateRef = useRef(null);

  const getIdentity = useCallback(() => ({
    roomCode: sessionStorage.getItem('roomCode'),
    playerId: sessionStorage.getItem('playerId'),
    playerName: sessionStorage.getItem('playerName') || 'Player'
  }), []);

  useEffect(() => {
    let socket;

    const connect = () => {
      if (socketRef.current?.connected) return;

      socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 15000,
        timeout: 15000,
        withCredentials: true,
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        setConnected(true);
        setConnectionError(null);

        if (keepaliveRef.current) clearInterval(keepaliveRef.current);
        keepaliveRef.current = setInterval(() => {
          if (socket.connected) socket.emit('clientPing');
        }, 20000);

        const { roomCode, playerId, playerName } = getIdentity();
        if (roomCode && playerId) {
          console.log('Attempting rejoin:', roomCode, playerId);
          socket.emit('rejoinRoom', { roomCode, playerId, playerName }, (res) => {
            if (!res?.success) {
              console.error('Rejoin failed:', res?.message);
              setConnectionError(res?.message || 'Failed to rejoin game');
            } else {
              console.log('Rejoin successful');
            }
          });
        }
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setConnected(false);
        if (keepaliveRef.current) clearInterval(keepaliveRef.current);

        if (reason === 'io server disconnect') {
          setConnectionError('Server closed connection. Refresh to reconnect.');
        }
      });

      socket.on('connect_error', (err) => {
        console.error('Connection error:', err.message);
        setConnectionError(`Connection failed: ${err.message}`);
      });

      socket.on('gameState', (state) => {
        if (!state || typeof state !== 'object') return;
        const currentSeq = lastGameStateRef.current?.turnSequence || 0;
        const newSeq = state.turnSequence || 0;
        if (newSeq >= currentSeq || newSeq === 0) {
          setGameState(state);
          lastGameStateRef.current = state;
        }
      });

      socket.on('forceRefresh', (data) => {
        alert(data?.message || 'Game server updated. Please refresh.');
        window.location.reload();
      });
    };

    connect();

    return () => {
      if (keepaliveRef.current) clearInterval(keepaliveRef.current);
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }
      socketRef.current = null;
    };
  }, [getIdentity]); // FIXED: removed gameState

  const emit = useCallback((event, data, timeoutMs = 10000) => {
    return new Promise((resolve) => {
      const socket = socketRef.current;
      if (!socket?.connected) {
        resolve({ success: false, message: 'Not connected to server. Please wait or refresh.' });
        return;
      }

      let resolved = false;
      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.warn(`Emit timeout: ${event}`);
          resolve({ success: false, message: 'Server did not respond. Please try again.' });
        }
      }, timeoutMs);

      socket.emit(event, data, (response) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          resolve(response || { success: false, message: 'Empty response from server' });
        }
      });
    });
  }, []);

  const reconnect = useCallback(() => {
    window.location.reload();
  }, []);

  return { socket: socketRef.current, connected, gameState, emit, connectionError, reconnect };
}
