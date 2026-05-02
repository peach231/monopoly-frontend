import React, { useState } from 'react';

export default function Lobby({ onCreate, onJoin, error }) {
  const [mode, setMode] = useState('menu'); // menu | create | join
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (name.trim()) onCreate(name.trim());
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (name.trim() && roomCode.trim()) {
      onJoin(roomCode.trim().toUpperCase(), name.trim());
    }
  };

  return (
    <div className="lobby">
      <div className="lobby-card">
        <h1>🏫 Schoolopoly</h1>
        <p className="subtitle">A Monopoly-style game for students</p>

        {error && <div className="error-banner">{error}</div>}

        {mode === 'menu' && (
          <div className="menu-buttons">
            <button className="btn-primary" onClick={() => setMode('create')}>
              Create Room
            </button>
            <button className="btn-secondary" onClick={() => setMode('join')}>
              Join Room
            </button>
          </div>
        )}

        {mode === 'create' && (
          <form onSubmit={handleCreate}>
            <label>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              autoFocus
            />
            <button type="submit" className="btn-primary" disabled={!name.trim()}>
              Create Room
            </button>
            <button type="button" className="btn-text" onClick={() => setMode('menu')}>
              ← Back
            </button>
          </form>
        )}

        {mode === 'join' && (
          <form onSubmit={handleJoin}>
            <label>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              autoFocus
            />
            <label>Room Code</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit code"
              maxLength={6}
            />
            <button type="submit" className="btn-primary" disabled={!name.trim() || !roomCode.trim()}>
              Join Room
            </button>
            <button type="button" className="btn-text" onClick={() => setMode('menu')}>
              ← Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
