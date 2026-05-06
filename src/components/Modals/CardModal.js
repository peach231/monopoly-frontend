import React from 'react';

export default function CardModal({ card, onResolve }) {
  const isChance = card.deck === 'chance';
  return (
    <div className="modal-overlay card-flip-overlay">
      <div className={`modal card-modal card-flip ${isChance ? 'chance' : 'chest'}`}>
        <div className="card-header">
          {isChance ? '🎲 Surprise' : '📦 Treasure'}
        </div>
        <div className="card-body">
          <p>{card.text}</p>
        </div>
        <button className="btn-primary" onClick={onResolve}>
          OK
        </button>
      </div>
    </div>
  );
}
