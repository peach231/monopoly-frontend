import React, { useState, useEffect } from 'react';

export default function CardModal({ card, onResolve }) {
  const [isVisible, setIsVisible] = useState(false);
  const isChance = card.deck === 'chance';

  // Trigger animation on mount
  useEffect(() => {
    // Small delay to ensure the element is in the DOM before animating
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="modal-overlay card-flip-overlay" onClick={onResolve}>
      <div
        className={`modal card-modal card-scale-in ${isVisible ? 'visible' : ''} ${isChance ? 'chance' : 'chest'}`}
        onClick={(e) => e.stopPropagation()}
      >
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
