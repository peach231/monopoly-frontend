import React, { useState, useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import './styles/game.css';

function App() {
  const { connected, gameState, emit, connectionError, reconnect } = useSocket();
  const [view, setView] = useState('lobby');
  const [playerId, setPlayerId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
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
    if (parentUrl) {
      return `${parentUrl}${parentUrl.includes('?') ? '&' : '?'}room=${roomCode}`;
    }
    return `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
  };

  if (connectionError) {
    return (
      <div className="loading-screen">
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '20px' }}>
          <p style={{ color: '#c5392a', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '12px' }}>
            ⚠️ Connection Issue
          </p>
          <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
            {connectionError}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '20px' }}>
            The server may have restarted or your network changed.
            Your game progress is saved on the server.
          </p>
          <button className="btn-primary" onClick={reconnect}>
            🔄 Reconnect to Game
          </button>
          <button 
            className="btn-text" 
            onClick={() => {
              sessionStorage.clear();
              window.location.reload();
            }} 
            style={{ marginTop: '12px', display: 'block', margin: '12px auto 0' }}
          >
            Start Fresh (Leave Game)
          </button>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Connecting to game server...</p>
        <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '8px' }}>
          This may take a moment if the server was sleeping.
        </p>
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
