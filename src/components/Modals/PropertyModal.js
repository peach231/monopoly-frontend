import React from 'react';

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

export default function PropertyModal({ tileId, tile, propertyState, owner, isMine, isMyTurn, onClose, onBuild, onSell, onMortgage, onUnmortgage }) {
  if (!tile) return null;

  const isProperty = tile.type === 'property';
  const isRailroad = tile.type === 'railroad';
  const isUtility = tile.type === 'utility';

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
          {propertyState?.ownerId && (
            <div className="property-owner">
              Owner: <span style={{ color: owner?.color }}>{owner?.name || 'Unknown'}</span>
              {propertyState.isMortgaged && <span className="mortgaged-badge">🔒 Mortgaged</span>}
            </div>
          )}

          {isProperty && tile.rent && (
            <div className="rent-table">
              <div className="rent-row"><span>Base Rent</span><span>${tile.rent[0]}</span></div>
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
            </div>
          )}

          {isRailroad && (
            <div className="rent-table">
              <div className="rent-row"><span>1 Railroad</span><span>$25</span></div>
              <div className="rent-row"><span>2 Railroads</span><span>$50</span></div>
              <div className="rent-row"><span>3 Railroads</span><span>$100</span></div>
              <div className="rent-row"><span>4 Railroads</span><span>$200</span></div>
              <div className="rent-row"><span>Mortgage Value</span><span>${tile.mortgageValue}</span></div>
            </div>
          )}

          {isUtility && (
            <div className="rent-table">
              <div className="rent-row"><span>1 Utility</span><span>4x dice roll</span></div>
              <div className="rent-row"><span>2 Utilities</span><span>10x dice roll</span></div>
              <div className="rent-row"><span>Mortgage Value</span><span>${tile.mortgageValue}</span></div>
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
