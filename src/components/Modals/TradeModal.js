import React, { useState, useMemo } from 'react';

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
  const me = players.find(p => p.id === myId);
  const otherPlayers = players.filter(p => p.id !== myId && !p.isBankrupt);
  
  const [targetId, setTargetId] = useState(otherPlayers[0]?.id || '');
  const [offerMoney, setOfferMoney] = useState(0);
  const [requestMoney, setRequestMoney] = useState(0);
  const [selectedOfferProps, setSelectedOfferProps] = useState(new Set());
  const [selectedRequestProps, setSelectedRequestProps] = useState(new Set());

  const targetPlayer = players.find(p => p.id === targetId);
  
  const targetProperties = useMemo(() => {
    if (!targetPlayer) return [];
    return allProperties
      .filter(p => p.ownerId === targetPlayer.id)
      .map(p => ({ ...p, tile: boardTiles[p.id] }))
      .sort((a, b) => a.id - b.id);
  }, [allProperties, targetPlayer, boardTiles]);

  const myPropsWithTiles = useMemo(() => {
    return myProperties
      .map(p => ({ ...p, tile: boardTiles[p.id] }))
      .sort((a, b) => a.id - b.id);
  }, [myProperties, boardTiles]);

  const toggleOfferProp = (propId) => {
    setSelectedOfferProps(prev => {
      const next = new Set(prev);
      if (next.has(propId)) next.delete(propId);
      else next.add(propId);
      return next;
    });
  };

  const toggleRequestProp = (propId) => {
    setSelectedRequestProps(prev => {
      const next = new Set(prev);
      if (next.has(propId)) next.delete(propId);
      else next.add(propId);
      return next;
    });
  };

  const handlePropose = () => {
    if (!targetId) return;
    const offerProps = Array.from(selectedOfferProps);
    const requestProps = Array.from(selectedRequestProps);
    
    // Validate: can't offer more than we have
    if (offerMoney > me.money) return;
    if (requestMoney > targetPlayer.money) return;
    
    onPropose({
      toId: targetId,
      offerProps,
      offerMoney: parseInt(offerMoney) || 0,
      requestProps,
      requestMoney: parseInt(requestMoney) || 0
    });
  };

  const isValid = targetId && (
    selectedOfferProps.size > 0 || 
    selectedRequestProps.size > 0 || 
    parseInt(offerMoney) > 0 || 
    parseInt(requestMoney) > 0
  );

  if (!me || otherPlayers.length === 0) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal trade-modal" onClick={e => e.stopPropagation()}>
          <h3>Trade</h3>
          <p>No available players to trade with.</p>
          <button className="btn-close" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal trade-modal" onClick={e => e.stopPropagation()}>
        <h3>🤝 Propose Trade</h3>
        
        <div className="trade-section">
          <label>Trade with:</label>
          <select value={targetId} onChange={e => setTargetId(e.target.value)}>
            {otherPlayers.map(p => (
              <option key={p.id} value={p.id}>{p.name} (${p.money})</option>
            ))}
          </select>
        </div>

        <div className="trade-columns">
          {/* MY OFFER */}
          <div className="trade-col">
            <h4>You Give</h4>
            
            <div className="trade-money-row">
              <label>Cash:</label>
              <input 
                type="number" 
                min="0" 
                max={me.money}
                value={offerMoney} 
                onChange={e => setOfferMoney(Math.min(parseInt(e.target.value) || 0, me.money))}
              />
            </div>

            <label>Properties:</label>
            <div className="prop-list">
              {myPropsWithTiles.length === 0 ? (
                <div className="prop-item empty">No properties</div>
              ) : (
                myPropsWithTiles.map(prop => (
                  <div
                    key={prop.id}
                    className={`prop-item ${selectedOfferProps.has(prop.id) ? 'selected' : ''} ${prop.isMortgaged ? 'mortgaged' : ''}`}
                    onClick={() => toggleOfferProp(prop.id)}
                    style={{ borderLeft: `4px solid ${COLOR_MAP[prop.tile.colorGroup] || '#888'}` }}
                  >
                    {prop.tile.name}
                    {prop.isMortgaged && ' 🔒'}
                    {prop.hotel ? ' 🏨' : prop.houses > 0 ? ` ${prop.houses}🏠` : ''}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* MY REQUEST */}
          <div className="trade-col">
            <h4>You Receive</h4>
            
            <div className="trade-money-row">
              <label>Cash:</label>
              <input 
                type="number" 
                min="0"
                max={targetPlayer?.money || 0}
                value={requestMoney} 
                onChange={e => setRequestMoney(Math.min(parseInt(e.target.value) || 0, targetPlayer?.money || 0))}
              />
            </div>

            <label>Properties:</label>
            <div className="prop-list">
              {targetProperties.length === 0 ? (
                <div className="prop-item empty">No properties</div>
              ) : (
                targetProperties.map(prop => (
                  <div
                    key={prop.id}
                    className={`prop-item ${selectedRequestProps.has(prop.id) ? 'selected' : ''} ${prop.isMortgaged ? 'mortgaged' : ''}`}
                    onClick={() => toggleRequestProp(prop.id)}
                    style={{ borderLeft: `4px solid ${COLOR_MAP[prop.tile.colorGroup] || '#888'}` }}
                  >
                    {prop.tile.name}
                    {prop.isMortgaged && ' 🔒'}
                    {prop.hotel ? ' 🏨' : prop.houses > 0 ? ` ${prop.houses}🏠` : ''}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="trade-summary">
          <div className="trade-summary-item">
            <strong>You give:</strong> ${offerMoney} + {selectedOfferProps.size} properties
          </div>
          <div className="trade-summary-item">
            <strong>You get:</strong> ${requestMoney} + {selectedRequestProps.size} properties
          </div>
        </div>

        <div className="modal-buttons">
          <button className="btn-primary" onClick={handlePropose} disabled={!isValid}>
            📨 Propose Trade
          </button>
          <button className="btn-close" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
