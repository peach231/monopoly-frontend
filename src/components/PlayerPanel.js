import React from 'react';

const COLOR_MAP = {
  brown: '#955436',
  lightblue: '#AAE0FA',
  pink: '#D93A96',
  orange: '#F7941D',
  red: '#ED1B24',
  yellow: '#FEF200',
  green: '#1FB25A',
  darkblue: '#0072BB',
  airport: '#333333'
};

// Country code for each property tile — airports removed
const TILE_COUNTRY = {
  1: 'BR', 3: 'BR',
  6: 'CA', 8: 'CA', 9: 'CA',
  11: 'IT', 13: 'IT', 14: 'IT',
  16: 'FR', 18: 'FR', 19: 'FR',
  21: 'GB', 23: 'GB', 24: 'GB',
  26: 'JP', 27: 'JP', 29: 'JP',
  31: 'CN', 32: 'CN', 34: 'CN',
  37: 'US', 39: 'US'
};

function getFlagUrl(countryCode) {
  return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
}

const TOKEN_EMOJI = {
  backpack: '🎒',
  textbooks: '📚',
  'graduation-hat': '🎓',
  pencil: '✏️',
  compass: '🧭',
  suitcase: '🧳'
};

const BOARD_TILES = [
  { id: 0, name: "START" },
  { id: 1, name: "Rio de Janeiro", colorGroup: "brown" },
  { id: 2, name: "Treasure" },
  { id: 3, name: "Sao Paulo", colorGroup: "brown" },
  { id: 4, name: "Earnings Tax" },
  { id: 5, name: "YYZ Airport", type: "airport", colorGroup: "airport" },
  { id: 6, name: "Montreal", colorGroup: "lightblue" },
  { id: 7, name: "Surprise" },
  { id: 8, name: "Vancouver", colorGroup: "lightblue" },
  { id: 9, name: "Toronto", colorGroup: "lightblue" },
  { id: 10, name: "Prison" },
  { id: 11, name: "Venice", colorGroup: "pink" },
  { id: 12, name: "Electric Co", type: "utility" },
  { id: 13, name: "Milan", colorGroup: "pink" },
  { id: 14, name: "Rome", colorGroup: "pink" },
  { id: 15, name: "CDG Airport", type: "airport", colorGroup: "airport" },
  { id: 16, name: "Nice", colorGroup: "orange" },
  { id: 17, name: "Treasure" },
  { id: 18, name: "Lyon", colorGroup: "orange" },
  { id: 19, name: "Paris", colorGroup: "orange" },
  { id: 20, name: "Vacation" },
  { id: 21, name: "Manchester", colorGroup: "red" },
  { id: 22, name: "Surprise" },
  { id: 23, name: "Birmingham", colorGroup: "red" },
  { id: 24, name: "London", colorGroup: "red" },
  { id: 25, name: "HND Airport", type: "airport", colorGroup: "airport" },
  { id: 26, name: "Kyoto", colorGroup: "yellow" },
  { id: 27, name: "Osaka", colorGroup: "yellow" },
  { id: 28, name: "Water Works", type: "utility" },
  { id: 29, name: "Tokyo", colorGroup: "yellow" },
  { id: 30, name: "Go to Prison" },
  { id: 31, name: "Chongqing", colorGroup: "green" },
  { id: 32, name: "Shanghai", colorGroup: "green" },
  { id: 33, name: "Treasure" },
  { id: 34, name: "Beijing", colorGroup: "green" },
  { id: 35, name: "JFK Airport", type: "airport", colorGroup: "airport" },
  { id: 36, name: "Surprise" },
  { id: 37, name: "Chicago", colorGroup: "darkblue" },
  { id: 38, name: "Premium Tax" },
  { id: 39, name: "New York", colorGroup: "darkblue" }
];

export default function PlayerPanel({ players, properties, currentPlayerId, myId, onPropertyClick, onPlayerClick }) {
  return (
    <div className="player-panel">
      <h4>Players</h4>
      {players.map(player => {
        const isMe = player.id === myId;
        const isCurrent = player.id === currentPlayerId;
        const playerProps = properties.filter(p => p.ownerId === player.id);
        const inDebt = player.inDebt && !player.isBankrupt;

        return (
          <div
            key={player.id}
            className={`player-card ${isCurrent ? 'current' : ''} ${isMe ? 'me' : ''} ${player.isBankrupt ? 'bankrupt' : ''} ${inDebt ? 'in-debt' : ''}`}
            onClick={() => onPlayerClick && onPlayerClick(player.id)}
            style={{ cursor: 'pointer' }}
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
                <span className={`player-money ${player.money < 0 ? 'negative' : ''}`}>
                  ${player.money}
                </span>
                {inDebt && (
                  <span className="debt-badge" title={`Owes $${player.debtAmount}`}>
                    ⚠️ OWES ${player.debtAmount}
                  </span>
                )}
              </div>
              {isCurrent && <span className="turn-badge">▶</span>}
            </div>

            {player.inJail && <div className="jail-badge">🔒 In Jail</div>}
            {player.jailCards > 0 && <div className="jail-card-badge">🎫 x{player.jailCards}</div>}

            <div className="player-properties">
              {playerProps.map(prop => {
                const tile = BOARD_TILES[prop.id];
                const countryCode = TILE_COUNTRY[prop.id];
                return (
                  <div
                    key={prop.id}
                    className="prop-chip"
                    style={{
                      backgroundColor: tile?.type === 'airport' ? '#e8e3da' : (countryCode ? 'transparent' : (tile?.colorGroup ? COLOR_MAP[tile.colorGroup] : '#666')),
                      opacity: prop.isMortgaged ? 0.5 : 1,
                      border: 'none',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPropertyClick && onPropertyClick(prop.id);
                    }}
                    title={`${tile?.type === 'airport' ? '✈️ ' : ''}${tile?.name}`}
                  >
                    {tile?.type === 'airport' ? (
                      <span style={{ fontSize: '10px' }}>✈️</span>
                    ) : countryCode ? (
                      <img 
                        src={getFlagUrl(countryCode)} 
                        alt="" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <>
                        {prop.hotel ? '🏨' : prop.houses > 0 ? `${prop.houses}🏠` : ''}
                        {prop.isMortgaged && ' 🔒'}
                      </>
                    )}
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
