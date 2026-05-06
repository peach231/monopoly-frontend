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
  // Guard clause: Only render when valid player data exists
  if (!players || players.length === 0) {
    return null;
  }

  const me = players.find(p => p.id === myId);
  if (!me) return null;

  // Other players available for trade (exclude self and bankrupt players)
  const otherPlayers = useMemo(() =>
    players.filter(p => p.id !== myId && !p.isBankrupt),
    [players, myId]
  );

  // State for trade proposal
  const [targetPlayerId, setTargetPlayerId] = useState(null);
  const [offerProps, setOfferProps] = useState([]); // property IDs I offer
  const [requestProps, setRequestProps] = useState([]); // property IDs I request
  const [offerMoney, setOfferMoney] = useState('');
  const [requestMoney, setRequestMoney] = useState('');

  // Get target player's properties (including mortgaged)
  const targetPlayer = useMemo(() =>
    targetPlayerId ? players.find(p => p.id === targetPlayerId) : null,
    [players, targetPlayerId]
  );

  const targetPlayerProps = useMemo(() => {
    if (!targetPlayerId) return [];
    return allProperties.filter(p => p.ownerId === targetPlayerId);
  }, [allProperties, targetPlayerId]);

  // Toggle property in offer list
  const toggleOfferProp = (propId) => {
    setOfferProps(prev =>
      prev.includes(propId)
        ? prev.filter(id => id !== propId)
        : [...prev, propId]
    );
  };

  // Toggle property in request list
  const toggleRequestProp = (propId) => {
    setRequestProps(prev =>
      prev.includes(propId)
        ? prev.filter(id => id !== propId)
        : [...prev, propId]
    );
  };

  // Handle proposal submission
  const handlePropose = () => {
    if (!targetPlayerId) return;

    onPropose({
      toId: targetPlayerId,
      offerProps,
      offerMoney: parseInt(offerMoney) || 0,
      requestProps,
      requestMoney: parseInt(requestMoney) || 0
    });
  };

  // Reset form when target player changes
  const handleTargetPlayerChange = (newTargetId) => {
    setTargetPlayerId(newTargetId);
    setOfferProps([]);
    setRequestProps([]);
    setOfferMoney('');
    setRequestMoney('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal trade-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Trade with Another Player</h3>

        {/* Step 1: Select Target Player */}
        <div className="trade-section">
          <label>Select Trading Partner:</label>
          <select
            value={targetPlayerId || ''}
            onChange={(e) => handleTargetPlayerChange(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">-- Select Player --</option>
            {otherPlayers.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} (${p.money})
              </option>
            ))}
          </select>
        </div>

        {/* Only show trade proposal UI when a target is selected */}
        {targetPlayer && (
          <>
            <div className="trade-columns">
              {/* My Offer Section */}
              <div className="trade-col">
                <label>
                  <span style={{ color: me.color }}>Your Offer</span>
                </label>

                {/* Cash input */}
                <div className="trade-cash-input">
                  <label>Cash:</label>
                  <input
                    type="number"
                    value={offerMoney}
                    onChange={(e) => setOfferMoney(e.target.value)}
                    placeholder="$0"
                    min="0"
                    max={me.money}
                  />
                </div>

                {/* Property selection (including mortgaged) */}
                <div className="prop-list">
                  {myProperties.length === 0 ? (
                    <div className="prop-item no-props">No properties to offer</div>
                  ) : (
                    myProperties.map(prop => {
                      const tile = boardTiles[prop.id];
                      return (
                        <div
                          key={prop.id}
                          className={`prop-item ${offerProps.includes(prop.id) ? 'selected' : ''}`}
                          onClick={() => toggleOfferProp(prop.id)}
                        >
                          <span
                            className="prop-color-dot"
                            style={{
                              backgroundColor: tile?.colorGroup ? COLOR_MAP[tile.colorGroup] : '#666',
                              opacity: prop.isMortgaged ? 0.5 : 1
                            }}
                          />
                          {tile?.name}
                          {prop.isMortgaged && ' 🔒'}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Their Request Section */}
              <div className="trade-col">
                <label>
                  <span style={{ color: targetPlayer.color }}>You Request</span>
                </label>

                {/* Cash input */}
                <div className="trade-cash-input">
                  <label>Cash:</label>
                  <input
                    type="number"
                    value={requestMoney}
                    onChange={(e) => setRequestMoney(e.target.value)}
                    placeholder="$0"
                    min="0"
                    max={targetPlayer.money}
                  />
                </div>

                {/* Property selection (including mortgaged) */}
                <div className="prop-list">
                  {targetPlayerProps.length === 0 ? (
                    <div className="prop-item no-props">No properties to request</div>
                  ) : (
                    targetPlayerProps.map(prop => {
                      const tile = boardTiles[prop.id];
                      return (
                        <div
                          key={prop.id}
                          className={`prop-item ${requestProps.includes(prop.id) ? 'selected' : ''}`}
                          onClick={() => toggleRequestProp(prop.id)}
                        >
                          <span
                            className="prop-color-dot"
                            style={{
                              backgroundColor: tile?.colorGroup ? COLOR_MAP[tile.colorGroup] : '#666',
                              opacity: prop.isMortgaged ? 0.5 : 1
                            }}
                          />
                          {tile?.name}
                          {prop.isMortgaged && ' 🔒'}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Trade Summary */}
            <div className="trade-summary">
              <div className="trade-summary-item">
                <strong>You give:</strong>
                {offerProps.length > 0 && <span> {offerProps.map(id => boardTiles[id]?.name).join(', ')}</span>}
                {parseInt(offerMoney) > 0 && <span> + ${parseInt(offerMoney)}</span>}
                {!offerProps.length && !parseInt(offerMoney) && <span> Nothing</span>}
              </div>
              <div className="trade-summary-item">
                <strong>You get:</strong>
                {requestProps.length > 0 && <span> {requestProps.map(id => boardTiles[id]?.name).join(', ')}</span>}
                {parseInt(requestMoney) > 0 && <span> + ${parseInt(requestMoney)}</span>}
                {!requestProps.length && !parseInt(requestMoney) && <span> Nothing</span>}
              </div>
            </div>

            {/* Propose Button */}
            <button
              className="btn-primary btn-propose"
              onClick={handlePropose}
              disabled={
                offerProps.length === 0 &&
                requestProps.length === 0 &&
                !parseInt(offerMoney) &&
                !parseInt(requestMoney)
              }
            >
              Send Proposal
            </button>
          </>
        )}

        <button className="btn-close" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
