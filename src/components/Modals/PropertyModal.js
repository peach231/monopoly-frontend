import React from 'react';

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

export default function PropertyModal({ tileId, tile, propertyState, owner, isMine, isMyTurn, onClose, onBuild, onSell, onMortgage, onUnmortgage }) {
  if (!tile) return null;

  const isProperty = tile.type === 'property';
  const isRailroad = tile.type === 'railroad';
  const isUtility = tile.type === 'utility';
  const isCorner = tile.type === 'corner';
  const isTax = tile.type === 'tax';
  const isChance = tile.type === 'chance';
  const isChest = tile.type === 'chest';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal property-modal" onClick={(e) => e.stopPropagation()}>
        <div
          className="property-header"
          style={{ backgroundColor: tile.colorGroup ? COLOR_MAP[tile.colorGroup] : '#555' }}
        >
          <h3>{tile.name}</h3>
          {tile.price && <span className="property-price">${tile.price}</span>}
        </div>

        <div className="property-body">
          {isCorner && (
            <div className="tile-info-desc corner-info">
              {tile.id === 0 && <><div className="corner-info-icon">🚀</div><div>Collect <strong>$200</strong> every time you pass or land here!</div></>}
              {tile.id === 10 && <><div className="corner-info-icon">🚔</div><div>Just Visiting! If you're IN JAIL, you must roll doubles or pay $50 to get out.</div></>}
              {tile.id === 20 && <><div className="corner-info-icon">🌴</div><div>Free Vacation! Collect any taxes paid into the Vacation Fund.</div></>}
              {tile.id === 30 && <><div className="corner-info-icon">🚔</div><div>Go directly to Prison! Do not pass START, do not collect $200.</div></>}
            </div>
          )}

          {isTax && (
            <div className="tile-info-desc">
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{tile.id === 4 ? '💼' : '💎'}</div>
              <div>Pay <strong>${tile.price}</strong> when you land here.</div>
              <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#888' }}>This money goes to the Free Vacation Fund!</div>
            </div>
          )}

          {isChance && (
            <div className="tile-info-desc">
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>❓</div>
              <div>Draw a <strong>Surprise</strong> card!</div>
              <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#888' }}>Follow the instructions on the card immediately.</div>
            </div>
          )}

          {isChest && (
            <div className="tile-info-desc">
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📦</div>
              <div>Draw a <strong>Treasure</strong> card!</div>
              <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#888' }}>Follow the instructions on the card immediately.</div>
            </div>
          )}

          {/* Owner info visible to ALL players */}
          {propertyState?.ownerId ? (
            <div className="property-owner">
              Owner: <span style={{ color: owner?.color }}>{owner?.name || 'Unknown'}</span>
              {propertyState.isMortgaged && <span className="mortgaged-badge">🔒 Mortgaged</span>}
            </div>
          ) : (
            <div className="property-owner">
              <span style={{ color: '#888' }}>Unowned — Available for purchase</span>
            </div>
          )}

          {/* Property rent table — visible to ALL players */}
          {isProperty && tile.rent && (
            <div className="rent-table">
              <div className="rent-row rent-total"><span>Base Rent</span><span>${tile.rent[0]}</span></div>
              <div className="rent-row"><span>With Monopoly</span><span>${tile.rent[0] * 2}</span></div>
              <div className="rent-row"><span>1 House</span><span>${tile.rent[1]}</span></div>
              <div className="rent-row"><span>2 Houses</span><span>${tile.rent[2]}</span></div>
              <div className="rent-row"><span>3 Houses</span><span>${tile.rent[3]}</span></div>
              <div className="rent-row"><span>4 Houses</span><span>${tile.rent[4]}</span></div>
              <div className="rent-row"><span>Hotel</span><span>${tile.rent[5]}</span></div>
              <div className="rent-row rent-total">
                <span>House Cost</span><span>${tile.houseCost} each</span>
              </div>
              <div className="rent-row">
                <span>Mortgage Value</span><span>${tile.mortgageValue}</span>
              </div>
              <div className="rent-row">
                <span>Unmortgage Cost</span><span>${Math.ceil(tile.mortgageValue * 1.1)}</span>
              </div>
            </div>
          )}

          {/* Railroad rent table — visible to ALL players */}
          {isRailroad && (
            <div className="rent-table">
              <div className="rent-row"><span>1 Airport</span><span>$25</span></div>
              <div className="rent-row"><span>2 Airports</span><span>$50</span></div>
              <div className="rent-row"><span>3 Airports</span><span>$100</span></div>
              <div className="rent-row"><span>4 Airports</span><span>$200</span></div>
              <div className="rent-row"><span>Mortgage Value</span><span>${tile.mortgageValue}</span></div>
              <div className="rent-row">
                <span>Unmortgage Cost</span><span>${Math.ceil(tile.mortgageValue * 1.1)}</span>
              </div>
            </div>
          )}

          {/* Utility rent table — visible to ALL players */}
          {isUtility && (
            <div className="rent-table">
              <div className="rent-row"><span>1 Utility</span><span>4x dice roll</span></div>
              <div className="rent-row"><span>2 Utilities</span><span>10x dice roll</span></div>
              <div className="rent-row"><span>Mortgage Value</span><span>${tile.mortgageValue}</span></div>
              <div className="rent-row">
                <span>Unmortgage Cost</span><span>${Math.ceil(tile.mortgageValue * 1.1)}</span>
              </div>
            </div>
          )}

          {propertyState?.houses > 0 && (
            <div className="houses-display">
              Houses: {Array(propertyState.houses).fill('🏠').join('')}
            </div>
          )}
          {propertyState?.hotel && (
            <div className="hotel-display">🏨 Hotel Built</div>
          )}
        </div>

        {/* Action buttons ONLY for owner */}
        {isMine && (
          <div className="property-actions">
            {isProperty && !propertyState.isMortgaged && (
              <>
                <button className="btn-action" onClick={onBuild}>🏗️ Build House/Hotel</button>
                {(propertyState.houses > 0 || propertyState.hotel) && (
                  <button className="btn-action btn-sell" onClick={onSell}>💰 Sell House</button>
                )}
              </>
            )}
            {!propertyState.isMortgaged && !propertyState.houses && !propertyState.hotel && (
              <button className="btn-action btn-mortgage" onClick={onMortgage}>🔒 Mortgage</button>
            )}
            {propertyState.isMortgaged && (
              <button className="btn-action btn-unmortgage" onClick={onUnmortgage}>🔓 Unmortgage (${Math.ceil(tile.mortgageValue * 1.1)})</button>
            )}
          </div>
        )}

        <button className="btn-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
