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

const TOKEN_EMOJI = {
  backpack: '🎒',
  textbooks: '📚',
  'graduation-hat': '🎓',
  pencil: '✏️'
};

export default function PlayerProfileModal({ playerId, players, properties, boardTiles, onClose }) {
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
                {playerProps.map(prop => (
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
                      {prop.hotel ? '🏨 Hotel' : prop.houses > 0 ? `${prop.houses} 🏠` : 'Base rent'}
                      {' · '}${prop.tile.price || '-'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="profile-section">
            <strong>Monopolies:</strong>
            {Object.entries(colorGroupStats).length === 0 ? (
              <span> None</span>
            ) : (
              <div className="monopoly-chips">
                {Object.entries(colorGroupStats).map(([color, count]) => (
                  <span 
                    key={color} 
                    className="monopoly-chip"
                    style={{ backgroundColor: COLOR_MAP[color] || '#888' }}
                  >
                    {count}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <button className="btn-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
