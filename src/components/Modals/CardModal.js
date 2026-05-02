import React from 'react';

export default function CardModal({ card, onResolve }) {
  const isChance = card.deck === 'chance';
  return (
    <div className="modal-overlay">
      <div className={`modal card-modal ${isChance ? 'chance' : 'chest'}`}>
        <div className="card-header">
          {isChance ? '🎲 Chance' : '📦 Community Chest'}
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
