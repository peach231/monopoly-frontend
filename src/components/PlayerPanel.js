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

const TOKEN_EMOJI = {
  backpack: '🎒',
  textbooks: '📚',
  'graduation-hat': '🎓',
  pencil: '✏️'
};

const BOARD_TILES = [
  { id: 0, name: "Go", type: "corner" },
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

export default function PlayerPanel({ players, properties, currentPlayerId, myId, onPropertyClick }) {
  return (
    <div className="player-panel">
      <h4>Players</h4>
      {players.map(player => {
        const isMe = player.id === myId;
        const isCurrent = player.id === currentPlayerId;
        const playerProps = properties.filter(p => p.ownerId === player.id);

        return (
          <div
            key={player.id}
            className={`player-card ${isCurrent ? 'current' : ''} ${isMe ? 'me' : ''} ${player.isBankrupt ? 'bankrupt' : ''}`}
          >
            <div className="player-header">
              <span className="player-token" style={{ backgroundColor: player.color }}>
                {TOKEN_EMOJI[player.token] || '●'}
              </span>
              <div className="player-info">
                <span className="player-name">
                  {player.name} {isMe && '(You)'}
                  {player.isBankrupt && ' 💀'}
                  {!player.isConnected && ' ⚠️'}
                </span>
                <span className="player-money">${player.money}</span>
              </div>
              {isCurrent && <span className="turn-badge">▶</span>}
            </div>

            {player.inJail && <div className="jail-badge">🔒 In Jail</div>}
            {player.jailCards > 0 && <div className="jail-card-badge">🎫 x{player.jailCards}</div>}

            <div className="player-properties">
              {playerProps.map(prop => {
                const tile = BOARD_TILES[prop.id];
                return (
                  <div
                    key={prop.id}
                    className="prop-chip"
                    style={{
                      backgroundColor: tile?.colorGroup ? COLOR_MAP[tile.colorGroup] : '#666',
                      opacity: prop.isMortgaged ? 0.5 : 1
                    }}
                    onClick={() => onPropertyClick && onPropertyClick(prop.id)}
                    title={tile?.name}
                  >
                    {prop.hotel ? '🏨' : prop.houses > 0 ? `${prop.houses}🏠` : ''}
                    {prop.isMortgaged && ' 🔒'}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
