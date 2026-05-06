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

const COLOR_GROUP_TOTALS = {
  brown: 2,
  lightblue: 3,
  pink: 3,
  orange: 3,
  red: 3,
  yellow: 3,
  green: 3,
  darkblue: 2
};

const TOKEN_EMOJI = {
  backpack: '🎒',
  textbooks: '📚',
  'graduation-hat': '🎓',
  pencil: '✏️'
};

export default function PlayerProfileModal({ playerId, players, properties, boardTiles, calculateRent, onClose }) {
  const player = players.find(p => p.id === playerId);
  if (!player) return null;

  const playerProps = properties
    .filter(p => p.ownerId === playerId)
    .map(p => ({ ...p, tile: boardTiles[p.id] }))
    .sort((a, b) => {
      if (a.tile.colorGroup && b.tile.colorGroup) {
        return a.tile.colorGroup.localeCompare(b.tile.colorGroup);
      }
      return a.id - b.id;
    });

  const currentTile = boardTiles[player.position];

  const colorGroupStats = {};
  playerProps.forEach(p => {
    if (p.tile.colorGroup) {
      colorGroupStats[p.tile.colorGroup] = (colorGroupStats[p.tile.colorGroup] || 0) + 1;
    }
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal player-profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="player-profile-header" style={{ backgroundColor: player.color }}>
          <span className="player-profile-token">{TOKEN_EMOJI[player.token] || '●'}</span>
          <div>
            <h3>{player.name}</h3>
            <span className="player-profile-money">${player.money}</span>
          </div>
        </div>

        <div className="player-profile-body">
          <div className="profile-section">
            <strong>Current Position:</strong> {currentTile?.name || 'Unknown'}
          </div>

          {player.inJail && (
            <div className="profile-section jail-section">
              🔒 In Jail (Turn {player.jailTurns + 1}/3)
            </div>
          )}

          {player.jailCards > 0 && (
            <div className="profile-section">
              🎫 Get Out of Jail Cards: {player.jailCards}
            </div>
          )}

          <div className="profile-section">
            <strong>Properties ({playerProps.length}):</strong>
            {playerProps.length === 0 ? (
              <p className="no-properties">No properties owned</p>
            ) : (
              <div className="profile-properties-list">
                {playerProps.map(prop => {
                  // FIX: Calculate actual rent using the passed calculateRent function
                  const rentValue = calculateRent ? calculateRent(prop.id) : 0;

                  return (
                    <div 
                      key={prop.id} 
                      className="profile-property-item"
                      style={{ 
                        borderLeft: `4px solid ${prop.tile.colorGroup ? COLOR_MAP[prop.tile.colorGroup] : '#888'}`,
                        opacity: prop.isMortgaged ? 0.6 : 1
                      }}
                    >
                      <div className="profile-prop-name">
                        {prop.tile.name}
                        {prop.isMortgaged && <span className="mortgaged-label"> 🔒 Mortgaged</span>}
                      </div>
                      <div className="profile-prop-details">
                        {prop.hotel ? '🏨 Hotel' : prop.houses > 0 ? `${prop.houses} 🏠` : 'No houses'}
                        {' · '}
                        {prop.isMortgaged 
                          ? 'Rent: $0 (Mortgaged)' 
                          : `Rent: $${rentValue}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="profile-section">
            <strong>Monopoly Tracker:</strong>
            {Object.entries(colorGroupStats).length === 0 ? (
              <span> None</span>
            ) : (
              <div className="monopoly-tracker">
                {Object.entries(colorGroupStats).map(([color, count]) => {
                  const total = COLOR_GROUP_TOTALS[color] || 3;
                  const isComplete = count === total;
                  return (
                    <div key={color} className="monopoly-tracker-item">
                      <span 
                        className="monopoly-chip"
                        style={{ backgroundColor: COLOR_MAP[color] || '#888' }}
                      >
                        {isComplete ? '💰' : count}
                      </span>
                      <span className="monopoly-tracker-label">
                        {isComplete 
                          ? `${color.charAt(0).toUpperCase() + color.slice(1)} Monopoly!` 
                          : `${color.charAt(0).toUpperCase() + color.slice(1)}: ${count}/${total}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <button className="btn-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
