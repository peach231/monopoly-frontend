import React, { useState, useRef, useEffect, useCallback } from 'react';
import { chatReceive, chatSend } from '../audio';

const TOKEN_EMOJI = {
  backpack: '🎒', textbooks: '📚', 'graduation-hat': '🎓', pencil: '✏️',
  compass: '🧭', suitcase: '🧳'
};

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}


function formatExactTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export default function ChatPanel({ 
  messages, 
  players, 
  myId, 
  onSend, 
  onClose, 
  isOpen,
  hasNudged,
  soundEnabled,
  onToggleSound
}) {
  const [input, setInput] = useState('');


  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const prevMessagesLength = useRef(messages.length);

  const me = players.find(p => p.id === myId);

  // Never auto-scroll on any message — all players stay where they are
  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      const lastMsg = messages[messages.length - 1];
      const isFromMe = lastMsg && lastMsg.playerId === myId;

      // Play beep for new messages from others when sound is enabled
      if (soundEnabled && lastMsg && !isFromMe && lastMsg.type !== 'system') {
        chatReceive();
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages.length, soundEnabled, myId]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);



  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || trimmed.length > 200) return;
    if (soundEnabled) {
      chatSend();
    }
    onSend(trimmed);
    setInput('');
    // Don't force scroll on send — stay where user is typing
    // Only scroll to bottom when receiving messages from others
  }, [input, onSend, soundEnabled]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onlineCount = players.filter(p => p.isConnected && !p.isBankrupt).length;

  return (
    <div className={`chat-drawer ${isOpen ? 'open' : ''}`}>
      <div className="chat-header">
        <div className="chat-header-left">
          <span className="chat-icon">💬</span>
          <span className="chat-title">Room Chat</span>
          <span className="chat-online-count">{onlineCount} online</span>
        </div>
        <div className="chat-header-right">
          <button 
            className={`chat-sound-toggle ${soundEnabled ? 'on' : ''}`}
            onClick={onToggleSound}
            title={soundEnabled ? 'Sound on' : 'Sound off'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button className="chat-close" onClick={onClose} title="Close chat">✕</button>
        </div>
      </div>

      {hasNudged && messages.length === 0 && (
        <div className="chat-nudge">
          <span className="chat-nudge-icon">👋</span>
          <span>New messages will appear here</span>
        </div>
      )}

      <div 
        className="chat-messages" 
        ref={messagesContainerRef}
      >
        {messages.length === 0 ? (
          <div className="chat-empty">
            <div className="chat-empty-icon">💬</div>
            <p>No messages yet</p>
            <p className="chat-empty-sub">Say hello to your fellow players!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.playerId === myId;
            const isSystem = msg.type === 'system';
            const player = players.find(p => p.id === msg.playerId);
            const playerColor = player?.color || '#888';
            const playerToken = player?.token;

            if (isSystem) {
              return (
                <div key={msg.id} className="chat-message system">
                  <span className="chat-system-text">{msg.text}</span>
                  <span className="chat-timestamp" title={formatExactTime(msg.timestamp)}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              );
            }

            return (
              <div 
                key={msg.id} 
                className={`chat-message ${isMe ? 'me' : 'other'}`}
              >
                <div className="chat-message-inner">
                  {!isMe && (
                    <div className="chat-avatar" style={{ backgroundColor: playerColor }}>
                      {TOKEN_EMOJI[playerToken] || '●'}
                    </div>
                  )}
                  <div className="chat-bubble-wrapper">
                    {!isMe && (
                      <span className="chat-sender-name" style={{ color: playerColor }}>
                        {msg.playerName}
                      </span>
                    )}
                    <div 
                      className="chat-bubble"
                      style={{ 
                        borderLeft: isMe ? 'none' : `3px solid ${playerColor}`,
                        borderRight: isMe ? `3px solid ${playerColor}` : 'none',
                        background: isMe ? '#e8f4e8' : '#fff'
                      }}
                    >
                      <p className="chat-text">{msg.text}</p>
                    </div>
                    <span 
                      className="chat-timestamp" 
                      title={formatExactTime(msg.timestamp)}
                    >
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>



      <div className="chat-input-bar">
        <div className="chat-input-wrapper">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 200))}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            maxLength={200}
          />
          <span className="chat-char-count">{input.length}/200</span>
        </div>
        <button 
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
