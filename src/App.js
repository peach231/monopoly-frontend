import React, { useState, useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import './styles/game.css';

function App() {
  const { connected, gameState, emit } = useSocket();
  const [view, setView] = useState('lobby'); // lobby | game
  const [playerId, setPlayerId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Parse URL for room code (for direct joins via share link)
    const params = new URLSearchParams(window.location.search);
    const roomFromUrl = params.get('room');
    const savedRoom = sessionStorage.getItem('roomCode');
    const savedPlayerId = sessionStorage.getItem('playerId');

    if (roomFromUrl && !savedRoom) {
      sessionStorage.setItem('roomCode', roomFromUrl);
    }
    if (savedPlayerId) {
      setPlayerId(savedPlayerId);
    }
  }, []);

  useEffect(() => {
    if (gameState?.status === 'playing' || gameState?.status === 'waiting') {
      setView('game');
    }
  }, [gameState]);

  const handleCreateRoom = async (playerName) => {
    setError('');
    const res = await emit('createRoom', { playerName });
    if (res.success) {
      sessionStorage.setItem('roomCode', res.roomCode);
      sessionStorage.setItem('playerId', res.playerId);
      sessionStorage.setItem('playerName', playerName);
      setPlayerId(res.playerId);
      setView('game');
    } else {
      setError(res.message || 'Failed to create room');
    }
  };

  const handleJoinRoom = async (roomCode, playerName) => {
    setError('');
    const savedId = sessionStorage.getItem('playerId');
    const res = await emit('joinRoom', { roomCode, playerName, playerId: savedId });
    if (res.success) {
      sessionStorage.setItem('roomCode', roomCode);
      sessionStorage.setItem('playerId', res.playerId);
      sessionStorage.setItem('playerName', playerName);
      setPlayerId(res.playerId);
      setView('game');
    } else {
      setError(res.message || 'Failed to join room');
    }
  };

  const handleStartGame = async () => {
    const roomCode = sessionStorage.getItem('roomCode');
    await emit('startGame', { roomCode });
  };

 const getShareLink = () => {
    const roomCode = sessionStorage.getItem('roomCode');
    const parentUrl = process.env.REACT_APP_PARENT_URL;

    // Use the exact URL you set in Vercel first
    if (parentUrl) {
      return `${parentUrl}${parentUrl.includes('?') ? '&' : '?'}room=${roomCode}`;
    }

    // Fallback if the environment variable is missing
    return `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
  };

  if (!connected) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Connecting to game server...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {view === 'lobby' && (
        <Lobby
          onCreate={handleCreateRoom}
          onJoin={handleJoinRoom}
          error={error}
        />
      )}
      {view === 'game' && gameState && (
        <GameBoard
          gameState={gameState}
          playerId={playerId}
          emit={emit}
          connected={connected}
          onStartGame={handleStartGame}
          getShareLink={getShareLink}
        />
      )}
    </div>
  );
}

export default App;
