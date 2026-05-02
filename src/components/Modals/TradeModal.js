import React, { useState } from 'react';
 
const BOARD_TILES = [
  { id: 0, name: "Go" },
  { id: 1, name: "Mediterranean Ave", colorGroup: "brown" },
  { id: 2, name: "Community Chest" },
  { id: 3, name: "Baltic Ave", colorGroup: "brown" },
  { id: 4, name: "Income Tax" },
  { id: 5, name: "Reading Railroad" },
  { id: 6, name: "Oriental Ave", colorGroup: "lightblue" },
  { id: 7, name: "Chance" },
  { id: 8, name: "Vermont Ave", colorGroup: "lightblue" },
  { id: 9, name: "Connecticut Ave", colorGroup: "lightblue" },
  { id: 10, name: "Jail" },
  { id: 11, name: "St. Charles Place", colorGroup: "pink" },
  { id: 12, name: "Electric Co" },
  { id: 13, name: "States Ave", colorGroup: "pink" },
  { id: 14, name: "Virginia Ave", colorGroup: "pink" },
  { id: 15, name: "Penn Railroad" },
  { id: 16, name: "St. James Place", colorGroup: "orange" },
  { id: 17, name: "Community Chest" },
  { id: 18, name: "Tennessee Ave", colorGroup: "orange" },
  { id: 19, name: "New York Ave", colorGroup: "orange" },
  { id: 20, name: "Free Parking" },
  { id: 21, name: "Kentucky Ave", colorGroup: "red" },
  { id: 22, name: "Chance" },
  { id: 23, name: "Indiana Ave", colorGroup: "red" },
  { id: 24, name: "Illinois Ave", colorGroup: "red" },
  { id: 25, name: "B&O Railroad" },
  { id: 26, name: "Atlantic Ave", colorGroup: "yellow" },
  { id: 27, name: "Ventnor Ave", colorGroup: "yellow" },
  { id: 28, name: "Water Works" },
  { id: 29, name: "Marvin Gardens", colorGroup: "yellow" },
  { id: 30, name: "Go To Jail" },
  { id: 31, name: "Pacific Ave", colorGroup: "green" },
  { id: 32, name: "N.C. Ave", colorGroup: "green" },
  { id: 33, name: "Community Chest" },
  { id: 34, name: "Penn Ave", colorGroup: "green" },
  { id: 35, name: "Short Line" },
  { id: 36, name: "Chance" },
  { id: 37, name: "Park Place", colorGroup: "darkblue" },
  { id: 38, name: "Luxury Tax" },
  { id: 39, name: "Boardwalk", colorGroup: "darkblue" }
];
 
const COLOR_MAP = {
  brown: '#955436',
  lightblue: '#AAE0FA',
  pink: '#D93A96',
  orange: '#F7941D',
  red: '#ED1B24',
  yellow: '#FEF200',
  green: '#1FB25A',
  darkblue: '#0072BB'
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
