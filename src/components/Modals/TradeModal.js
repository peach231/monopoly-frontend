import React, { useState } from 'react';

const COLOR_MAP = {
  brown: '#8B4513',
  lightblue: '#87CEEB',
  pink: '#FF69B4',
  orange: '#FFA500',
  red: '#FF0000',
  yellow: '#FFD700',
  green: '#228B22',
  darkblue: '#00008B'
};

export default function TradeModal({ players, myId, myProperties, allProperties, boardTiles, onClose, onPropose }) {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [offerMoney, setOfferMoney] = useState(0);
  const [requestMoney, setRequestMoney] = useState(0);
  const [offerProps, setOfferProps] = useState([]);
  const [requestProps, setRequestProps] = useState([]);

  const otherPlayers = players.filter(p => p.id !== myId && !p.isBankrupt);
  const theirProperties = allProperties.filter(p => p.ownerId === selectedPlayer);

  const toggleOfferProp = (id) => {
    setOfferProps(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleRequestProp = (id) => {
    setRequestProps(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handlePropose = () => {
    if (!selectedPlayer) return;
    onPropose({
      toId: selectedPlayer,
      offerProps,
      offerMoney: parseInt(offerMoney) || 0,
      requestProps,
      requestMoney: parseInt(requestMoney) || 0
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal trade-modal">
        <h3>🤝 Propose Trade</h3>
        <div className="trade-section">
          <label>Trade with:</label>
          <select value={selectedPlayer} onChange={(e) => { setSelectedPlayer(e.target.value); setRequestProps([]); }}>
            <option value="">Select player...</option>
            {otherPlayers.map(p => (
              <option key={p.id} value={p.id}>{p.name} (${p.money})</option>
            ))}
          </select>
        </div>
        <div className="trade-columns">
          <div className="trade-col">
            <h4>You Give</h4>
            <label>Money: $<input type="number" value={offerMoney} onChange={(e) => setOfferMoney(e.target.value)} min="0" /></label>
            <div className="prop-list">
              {myProperties.map(prop => {
                const tile = boardTiles[prop.id];
                return (
                  <div
                    key={prop.id}
                    className={`prop-item ${offerProps.includes(prop.id) ? 'selected' : ''}`}
                    style={{ borderLeft: `4px solid ${tile?.colorGroup ? COLOR_MAP[tile.colorGroup] : '#666'}` }}
                    onClick={() => toggleOfferProp(prop.id)}
                  >
                    {tile?.name} {prop.isMortgaged && '(Mortgaged)'}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="trade-col">
            <h4>You Get</h4>
            <label>Money: $<input type="number" value={requestMoney} onChange={(e) => setRequestMoney(e.target.value)} min="0" /></label>
            <div className="prop-list">
              {theirProperties.map(prop => {
                const tile = boardTiles[prop.id];
                return (
                  <div
                    key={prop.id}
                    className={`prop-item ${requestProps.includes(prop.id) ? 'selected' : ''}`}
                    style={{ borderLeft: `4px solid ${tile?.colorGroup ? COLOR_MAP[tile.colorGroup] : '#666'}` }}
                    onClick={() => toggleRequestProp(prop.id)}
                  >
                    {tile?.name} {prop.isMortgaged && '(Mortgaged)'}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="modal-buttons">
          <button className="btn-primary" onClick={handlePropose} disabled={!selectedPlayer}>
            Propose Trade
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
