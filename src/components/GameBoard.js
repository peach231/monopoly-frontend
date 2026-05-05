import React, { useState, useMemo, useEffect, useRef } from 'react';
import PlayerPanel from './PlayerPanel';
import CardModal from './Modals/CardModal';
import TradeModal from './Modals/TradeModal';
import AuctionModal from './Modals/AuctionModal';
import PropertyModal from './Modals/PropertyModal';

const BOARD_TILES = [
  { id: 0, name: "START", type: "corner" },
  { id: 1, name: "Rio de Janeiro", type: "property", colorGroup: "brown", price: 60 },
  { id: 2, name: "Treasure", type: "chest" },
  { id: 3, name: "Sao Paulo", type: "property", colorGroup: "brown", price: 60 },
  { id: 4, name: "Earnings Tax", type: "tax", price: 200 },
  { id: 5, name: "YYZ Airport", type: "railroad", price: 200 },
  { id: 6, name: "Montreal", type: "property", colorGroup: "lightblue", price: 100 },
  { id: 7, name: "Surprise", type: "chance" },
  { id: 8, name: "Vancouver", type: "property", colorGroup: "lightblue", price: 100 },
  { id: 9, name: "Toronto", type: "property", colorGroup: "lightblue", price: 120 },
  { id: 10, name: "Prison", type: "corner" },
  { id: 11, name: "Venice", type: "property", colorGroup: "pink", price: 140 },
  { id: 12, name: "Electric Co", type: "utility", price: 150 },
  { id: 13, name: "Milan", type: "property", colorGroup: "pink", price: 140 },
  { id: 14, name: "Rome", type: "property", colorGroup: "pink", price: 160 },
  { id: 15, name: "CDG Airport", type: "railroad", price: 200 },
  { id: 16, name: "Nice", type: "property", colorGroup: "orange", price: 180 },
  { id: 17, name: "Treasure", type: "chest" },
  { id: 18, name: "Lyon", type: "property", colorGroup: "orange", price: 180 },
  { id: 19, name: "Paris", type: "property", colorGroup: "orange", price: 200 },
  { id: 20, name: "Vacation", type: "corner" },
  { id: 21, name: "Manchester", type: "property", colorGroup: "red", price: 220 },
  { id: 22, name: "Surprise", type: "chance" },
  { id: 23, name: "Birmingham", type: "property", colorGroup: "red", price: 220 },
  { id: 24, name: "London", type: "property", colorGroup: "red", price: 240 },
  { id: 25, name: "HND Airport", type: "railroad", price: 200 },
  { id: 26, name: "Kyoto", type: "property", colorGroup: "yellow", price: 260 },
  { id: 27, name: "Osaka", type: "property", colorGroup: "yellow", price: 260 },
  { id: 28, name: "Water Works", type: "utility", price: 150 },
  { id: 29, name: "Tokyo", type: "property", colorGroup: "yellow", price: 280 },
  { id: 30, name: "Go To Prison", type: "corner" },
  { id: 31, name: "Chongqing", type: "property", colorGroup: "green", price: 300 },
  { id: 32, name: "Shanghai", type: "property", colorGroup: "green", price: 300 },
  { id: 33, name: "Treasure", type: "chest" },
  { id: 34, name: "Beijing", type: "property", colorGroup: "green", price: 320 },
  { id: 35, name: "JFK Airport", type: "railroad", price: 200 },
  { id: 36, name: "Surprise", type: "chance" },
  { id: 37, name: "Chicago", type: "property", colorGroup: "darkblue", price: 350 },
  { id: 38, name: "Premium Tax", type: "tax", price: 100 },
  { id: 39, name: "New York", type: "property", colorGroup: "darkblue", price: 400 }
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

// Country flag emojis for property tiles
const FLAG_EMOJI = {
  1: '🇧🇷', 3: '🇧🇷',
  6: '🇨🇦', 8: '🇨🇦', 9: '🇨🇦',
  11: '🇮🇹', 13: '🇮🇹', 14: '🇮🇹',
  16: '🇫🇷', 18: '🇫🇷', 19: '🇫🇷',
  21: '🇬🇧', 23: '🇬🇧', 24: '🇬🇧',
  26: '🇯🇵', 27: '🇯🇵', 29: '🇯🇵',
  31: '🇨🇳', 32: '🇨🇳', 34: '🇨🇳',
  37: '🇺🇸', 39: '🇺🇸'
};

const TOKEN_EMOJI = {
  backpack: '🎒',
  textbooks: '📚',
  'graduation-hat': '🎓',
  pencil: '✏️'
};

// Helper function to get character-count based class
function getCharClass(name) {
  const chars = name.replace(/\s/g, '').length;
  if (chars <= 4) return 'chars-1-4';
  if (chars <= 7) return 'chars-5-7';
  if (chars <= 10) return 'chars-8-10';
  if (chars <= 14) return 'chars-11-14';
  return 'chars-15-plus';
}

function getGridPos(tileId) {
  if (tileId >= 20 && tileId <= 30) {
    return { gridRow: 1, gridColumn: tileId - 19 };
  }
  if (tileId >= 31 && tileId <= 39) {
    return { gridRow: tileId - 29, gridColumn: 11 };
  }
  if (tileId >= 0 && tileId <= 10) {
    return { gridRow: 11, gridColumn: 11 - tileId };
  }
  if (tileId >= 11 && tileId <= 19) {
    return { gridRow: 21 - tileId, gridColumn: 1 };
  }
  return { gridRow: 1, gridColumn: 1 };
}

function getTileSide(tileId) {
  if (tileId >= 1 && tileId <= 9) return 'bottom';
  if (tileId >= 11 && tileId <= 19) return 'left';
  if (tileId >= 21 && tileId <= 29) return 'top';
  if (tileId >= 31 && tileId <= 39) return 'right';
  return null;
}

/* ============================================
   SVG ICONS for non-property tiles
   ============================================ */

const AirplaneIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="tile-svg">
    <path d="M50 10 L60 35 L95 45 L95 55 L60 50 L55 90 L45 90 L42 50 L10 55 L10 45 L42 35 Z" 
          fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
    <rect x="48" y="35" width="4" height="30" fill="#555" rx="1"/>
    <path d="M35 55 L50 65 L65 55" fill="none" stroke="#888" strokeWidth="1.5"/>
  </svg>
);

const BulbIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="tile-svg">
    <g stroke="#FFB300" strokeWidth="4" strokeLinecap="round">
      <line x1="50" y1="3" x2="50" y2="13" />
      <line x1="18" y1="20" x2="25" y2="27" />
      <line x1="82" y1="20" x2="75" y2="27" />
      <line x1="5" y1="50" x2="15" y2="50" />
      <line x1="85" y1="50" x2="95" y2="50" />
    </g>
    <ellipse cx="50" cy="50" rx="24" ry="28" fill="#FFE082" stroke="#1a1a1a" strokeWidth="2.5" />
    <path d="M 42 48 Q 50 56 58 48" stroke="#FF6F00" strokeWidth="2" fill="none" />
    <line x1="42" y1="48" x2="42" y2="40" stroke="#1a1a1a" strokeWidth="1.5" />
    <line x1="58" y1="48" x2="58" y2="40" stroke="#1a1a1a" strokeWidth="1.5" />
    <rect x="38" y="76" width="24" height="5" fill="#888" stroke="#1a1a1a" strokeWidth="1" />
    <rect x="40" y="81" width="20" height="4" fill="#888" stroke="#1a1a1a" strokeWidth="1" />
    <rect x="42" y="85" width="16" height="4" fill="#666" stroke="#1a1a1a" strokeWidth="1" />
  </svg>
);

const FaucetIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="tile-svg">
    <circle cx="40" cy="18" r="9" fill="#666" stroke="#1a1a1a" strokeWidth="2" />
    <line x1="32" y1="18" x2="48" y2="18" stroke="#1a1a1a" strokeWidth="2" />
    <line x1="40" y1="10" x2="40" y2="26" stroke="#1a1a1a" strokeWidth="2" />
    <rect x="36" y="26" width="8" height="14" fill="#888" stroke="#1a1a1a" strokeWidth="1.5" />
    <rect x="20" y="40" width="50" height="14" fill="#888" stroke="#1a1a1a" strokeWidth="1.5" />
    <rect x="62" y="54" width="10" height="10" fill="#666" stroke="#1a1a1a" strokeWidth="1.5" />
    <rect x="65" y="64" width="4" height="14" fill="#3FA9F5" />
    <ellipse cx="67" cy="86" rx="4" ry="6" fill="#3FA9F5" stroke="#1976D2" strokeWidth="1" />
    <ellipse cx="56" cy="92" rx="3" ry="4" fill="#3FA9F5" stroke="#1976D2" strokeWidth="1" />
    <ellipse cx="78" cy="93" rx="2.5" ry="3.5" fill="#3FA9F5" stroke="#1976D2" strokeWidth="1" />
  </svg>
);

const ChanceIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="tile-svg">
    <text x="50" y="78" textAnchor="middle" fontSize="92" fontWeight="900"
          fill="#F7941D" fontFamily="Fredoka, Arial Black, sans-serif"
          stroke="#1a1a1a" strokeWidth="2">?</text>
  </svg>
);

const ChestIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="tile-svg">
    <rect x="12" y="50" width="76" height="34" fill="#8B4513" stroke="#1a1a1a" strokeWidth="2" />
    <path d="M 12 50 Q 50 22 88 50 Z" fill="#A0522D" stroke="#1a1a1a" strokeWidth="2" />
    <line x1="12" y1="64" x2="88" y2="64" stroke="#1a1a1a" strokeWidth="2" />
    <line x1="30" y1="36" x2="30" y2="84" stroke="#1a1a1a" strokeWidth="1.5" />
    <line x1="70" y1="36" x2="70" y2="84" stroke="#1a1a1a" strokeWidth="1.5" />
    <rect x="44" y="58" width="12" height="14" fill="#FFD700" stroke="#1a1a1a" strokeWidth="1.5" />
    <circle cx="50" cy="64" r="2" fill="#1a1a1a" />
    <circle cx="78" cy="44" r="4" fill="#FFD700" stroke="#1a1a1a" strokeWidth="1" />
    <circle cx="22" cy="44" r="3" fill="#FFD700" stroke="#1a1a1a" strokeWidth="1" />
  </svg>
);

const DiamondRingIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="tile-svg">
    <ellipse cx="50" cy="68" rx="28" ry="22" fill="none" stroke="#FFD700" strokeWidth="6" />
    <ellipse cx="50" cy="68" rx="28" ry="22" fill="none" stroke="#1a1a1a" strokeWidth="1" />
    <polygon points="50,15 38,32 50,50 62,32" fill="#B0E0E6" stroke="#1a1a1a" strokeWidth="2" />
    <polygon points="50,15 44,24 50,32 56,24" fill="#fff" />
    <line x1="38" y1="32" x2="62" y2="32" stroke="#1a1a1a" strokeWidth="1.5" />
  </svg>
);

const TaxIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="tile-svg">
    <text x="50" y="68" textAnchor="middle" fontSize="62" fontWeight="900"
          fill="#1FB25A" fontFamily="Fredoka, Arial Black, sans-serif"
          stroke="#1a1a1a" strokeWidth="2">$</text>
  </svg>
);

const PalmTreeIcon = () => (
  <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" className="corner-svg">
    {/* Trunk */}
    <path d="M58 45 Q55 65 52 85 L60 88 L68 85 Q65 65 62 45 Z" fill="#8B4513" stroke="#1a1a1a" strokeWidth="1.5"/>
    {/* Curved trunk detail */}
    <path d="M58 45 Q52 55 54 70" fill="none" stroke="#654321" strokeWidth="2"/>
    {/* Palm fronds */}
    <ellipse cx="60" cy="38" rx="35" ry="12" fill="#228B22" stroke="#1a1a1a" strokeWidth="1.5" transform="rotate(-15 60 38)"/>
    <ellipse cx="60" cy="38" rx="32" ry="10" fill="#32CD32" stroke="#1a1a1a" strokeWidth="1" transform="rotate(10 60 38)"/>
    <ellipse cx="60" cy="38" rx="28" ry="9" fill="#228B22" stroke="#1a1a1a" strokeWidth="1" transform="rotate(35 60 38)"/>
    <ellipse cx="60" cy="38" rx="30" ry="10" fill="#32CD32" stroke="#1a1a1a" strokeWidth="1" transform="rotate(-40 60 38)"/>
    {/* Coconuts */}
    <circle cx="55" cy="48" r="4" fill="#8B4513" stroke="#1a1a1a" strokeWidth="1"/>
    <circle cx="63" cy="50" r="3.5" fill="#8B4513" stroke="#1a1a1a" strokeWidth="1"/>
    <circle cx="59" cy="53" r="3" fill="#8B4513" stroke="#1a1a1a" strokeWidth="1"/>
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="corner-svg">
    <path d="M 20 30 L 70 30 L 70 15 L 92 50 L 70 85 L 70 70 L 20 70 Z"
          fill="#C5392A" stroke="#1a1a1a" strokeWidth="2.5" />
  </svg>
);

const GoArrowIcon = () => (
  <svg viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg" className="go-arrow-svg">
    <path d="M 5 15 L 18 5 L 18 12 L 95 12 L 95 18 L 18 18 L 18 25 Z"
          fill="#C5392A" stroke="#1a1a1a" strokeWidth="1.5" />
  </svg>
);

const DIE_DOTS = {
  1: [5],
  2: [1, 9],
  3: [1, 5, 9],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9]
};

function DieFace({ value }) {
  const active = DIE_DOTS[value] || [];
  return (
    <div className="die-face">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(pos => (
        <div key={pos} className={`die-dot ${active.includes(pos) ? '' : 'hidden'}`} />
      ))}
    </div>
  );
}

function TileIcon({ tile }) {
  if (tile.type === 'railroad') return <AirplaneIcon />;
  if (tile.type === 'utility') {
    return tile.id === 12 ? <BulbIcon /> : <FaucetIcon />;
  }
  if (tile.type === 'chance') return <ChanceIcon />;
  if (tile.type === 'chest') return <ChestIcon />;
  if (tile.type === 'tax') {
    return tile.id === 38 ? <DiamondRingIcon /> : <TaxIcon />;
  }
  return null;
}

function CornerTile({ tile }) {
  if (tile.id === 0) {
    return (
      <div className="corner-inner corner-go">
        <div className="corner-go-arrow"><GoArrowIcon /></div>
        <div className="corner-go-text">START</div>
        <div className="corner-go-collect">COLLECT $200 SALARY AS YOU PASS</div>
      </div>
    );
  }
  if (tile.id === 10) {
    return (
      <div className="corner-inner corner-jail">
        <div className="jail-cell">
          <div className="jail-bars-grid">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
        <div className="jail-in-label">IN PRISON</div>
        <div className="jail-just-label">JUST</div>
        <div className="jail-visiting-label">VISITING</div>
        <div className="jail-diagonal"></div>
      </div>
    );
  }
  if (tile.id === 20) {
    return (
      <div className="corner-inner corner-parking">
        <div className="corner-parking-top">FREE</div>
        <div className="corner-parking-icon"><PalmTreeIcon /></div>
        <div className="corner-parking-bottom">VACATION</div>
      </div>
    );
  }
  if (tile.id === 30) {
    return (
      <div className="corner-inner corner-gotojail">
        <div className="corner-gotojail-top">GO TO</div>
        <div className="corner-gotojail-icon"><ArrowIcon /></div>
        <div className="corner-gotojail-bottom">PRISON</div>
      </div>
    );
  }
  return <div className="corner-inner">{tile.name}</div>;
}

export default function GameBoard({ gameState, playerId, emit, onStartGame, getShareLink }) {
  const [showTrade, setShowTrade] = useState(false);
  const [showProperty, setShowProperty] = useState(null);
  const [copied, setCopied] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [hoppingTokens, setHoppingTokens] = useState({});
  const [animatedPositions, setAnimatedPositions] = useState({});
  const [diceAnim, setDiceAnim] = useState({ isRolling: false, values: [1, 1] });
  const prevPositionsRef = useRef({});
  const diceIntervalRef = useRef(null);
  const movingPlayersRef = useRef(new Set());
  const timeoutsRef = useRef([]);

  useEffect(() => {
    if (gameState?.dice) {
      if (!diceAnim.isRolling) {
        setDiceAnim(prev => ({ ...prev, values: gameState.dice }));
      }
    }
  }, [gameState?.dice, diceAnim.isRolling]);

  useEffect(() => {
    if (!gameState?.players) return;

    gameState.players.forEach(player => {
      const prevPos = prevPositionsRef.current[player.id];
      const currPos = player.position;

      if (prevPos === undefined) {
        prevPositionsRef.current[player.id] = currPos;
        return;
      }

      if (prevPos !== currPos && !movingPlayersRef.current.has(player.id)) {
        movingPlayersRef.current.add(player.id);

        const path = [];
        let p = prevPos;
        while (p !== currPos) {
          p = (p + 1) % 40;
          path.push(p);
        }

        const animateStep = (step) => {
          if (step >= path.length) {
            movingPlayersRef.current.delete(player.id);
            setAnimatedPositions(prev => {
              const next = { ...prev };
              delete next[player.id];
              return next;
            });
            prevPositionsRef.current[player.id] = currPos;
            return;
          }

          setAnimatedPositions(prev => ({ ...prev, [player.id]: path[step] }));
          setHoppingTokens(prev => ({ ...prev, [player.id]: true }));

          const t1 = setTimeout(() => {
            setHoppingTokens(prev => {
              const next = { ...prev };
              delete next[player.id];
              return next;
            });
          }, 260);
          timeoutsRef.current.push(t1);

          const t2 = setTimeout(() => animateStep(step + 1), 280);
          timeoutsRef.current.push(t2);
        };

        animateStep(0);
      }
    });
  }, [gameState?.players, gameState?.turnSequence]);

  useEffect(() => {
    return () => {
      if (diceIntervalRef.current) clearInterval(diceIntervalRef.current);
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const isCurrentPlayer = gameState?.currentPlayerId === playerId;
  const me = gameState?.players.find(p => p.id === playerId);
  const currentPlayer = gameState?.players.find(p => p.id === gameState?.currentPlayerId);

  const myProperties = useMemo(() => {
    if (!gameState || !me) return [];
    return gameState.properties.filter(p => p.ownerId === playerId);
  }, [gameState, playerId]);

  const handleRoll = async () => {
    const roomCode = sessionStorage.getItem('roomCode');

    setDiceAnim({ isRolling: true, values: [1, 1] });
    diceIntervalRef.current = setInterval(() => {
      setDiceAnim(prev => ({
        ...prev,
        values: [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]
      }));
    }, 120);

    const startTime = Date.now();
    await emit('rollDice', { roomCode, playerId, turnSequence: gameState.turnSequence });

    const elapsed = Date.now() - startTime;
    const minRoll = 1200;
    const remaining = Math.max(0, minRoll - elapsed);

    setTimeout(() => {
      if (diceIntervalRef.current) {
        clearInterval(diceIntervalRef.current);
        diceIntervalRef.current = null;
      }
      setDiceAnim(prev => ({
        ...prev,
        isRolling: false,
        values: gameState?.dice || prev.values
      }));
    }, remaining);
  };

  const handleBuy = async () => {
    const roomCode = sessionStorage.getItem('roomCode');
    await emit('buyProperty', { roomCode, playerId });
  };

  const handleAuction = async () => {
    const roomCode = sessionStorage.getItem('roomCode');
    await emit('startAuction', { roomCode, playerId });
  };

  const handleBid = async () => {
    const roomCode = sessionStorage.getItem('roomCode');
    const amount = parseInt(bidAmount);
    if (!amount || amount <= 0) return;
    await emit('placeBid', { roomCode, playerId, amount });
    setBidAmount('');
  };

  const handleEndAuction = async () => {
    const roomCode = sessionStorage.getItem('roomCode');
    await emit('endAuction', { roomCode, playerId });
  };

  const handleEndTurn = async () => {
    const roomCode = sessionStorage.getItem('roomCode');
    await emit('endTurn', { roomCode, playerId });
  };

  const handlePayJail = async () => {
    const roomCode = sessionStorage.getItem('roomCode');
    await emit('payJailFine', { roomCode, playerId });
  };

  const handleUseJailCard = async () => {
    const roomCode = sessionStorage.getItem('roomCode');
    await emit('useJailCard', { roomCode, playerId });
  };

  const handleResolveCard = async () => {
    const roomCode = sessionStorage.getItem('roomCode');
    await emit('resolveCard', { roomCode, playerId });
  };

  const copyLink = () => {
    const link = getShareLink();
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getPlayersOnTile = (tileId) => {
    return gameState?.players.filter(p => {
      if (p.isBankrupt) return false;
      const displayPos = animatedPositions[p.id] !== undefined ? animatedPositions[p.id] : p.position;
      return displayPos === tileId;
    }) || [];
  };

  const getPropertyState = (tileId) => {
    return gameState?.properties.find(p => p.id === tileId);
  };

  return (
    <div className="game-container">
      <div className="top-bar">
        <div className="room-info">
          <span className="room-code">Room: {gameState?.roomCode}</span>
          <button className="btn-small" onClick={copyLink}>
            {copied ? 'Copied!' : 'Share Link'}
          </button>
        </div>
        <div className="game-status">
          {gameState?.status === 'waiting' && (
            <button className="btn-start" onClick={onStartGame}>
              Start Game ({gameState.players.length}/4)
            </button>
          )}
          {gameState?.status === 'playing' && (
            <span className="turn-indicator">
              {currentPlayer?.name}'s Turn
            </span>
          )}
        </div>
      </div>

      <div className="game-layout">
        <div className="board-wrapper">
          <div className="board">
            {BOARD_TILES.map(tile => {
              const pos = getGridPos(tile.id);
              const propState = getPropertyState(tile.id);
              const playersHere = getPlayersOnTile(tile.id);
              const isCorner = tile.type === 'corner';
              const owner = gameState?.players.find(p => p.id === propState?.ownerId);
              const side = getTileSide(tile.id);
              const isProperty = tile.type === 'property';
              const hasIcon = ['railroad', 'utility', 'chance', 'chest', 'tax'].includes(tile.type);
              const charClass = getCharClass(tile.name);
              const flagEmoji = FLAG_EMOJI[tile.id];

              if (isCorner) {
                return (
                  <div
                    key={tile.id}
                    className={`tile tile-corner tile-corner-${tile.id}`}
                    style={{
                      gridRow: pos.gridRow,
                      gridColumn: pos.gridColumn,
                    }}
                  >
                    <CornerTile tile={tile} />
                    <div className="tile-tokens corner-tokens">
                      {playersHere.map((p, i) => (
                        <span
                          key={p.id}
                          className={`token ${hoppingTokens[p.id] ? 'hopping' : ''}`}
                          style={{ backgroundColor: p.color }}
                          title={p.name}
                        >
                          {TOKEN_EMOJI[p.token] || '●'}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={tile.id}
                  className={`tile tile-${tile.type}`}
                  data-side={side || undefined}
                  style={{
                    gridRow: pos.gridRow,
                    gridColumn: pos.gridColumn,
                  }}
                  onClick={() => {
                    if (tile.type === 'property' || tile.type === 'railroad' || tile.type === 'utility') {
                      setShowProperty(tile.id);
                    }
                  }}
                >
                  {flagEmoji && (
                    <div className="color-bar">
                      <span style={{ fontSize: 'clamp(14px, 3vmin, 24px)', lineHeight: 1 }}>
                        {flagEmoji}
                      </span>
                    </div>
                  )}
                  {tile.colorGroup && !flagEmoji && (
                    <div
                      className="color-bar"
                      style={{ backgroundColor: COLOR_MAP[tile.colorGroup] }}
                    />
                  )}

                  <div className="tile-content">
                    <div className="tile-name-wrap">
                      <span className={`tile-name ${charClass}`}>
                        {tile.name.split(' ').map((word, wi) => (
                          <span key={wi} className="tile-name-word">{word}</span>
                        ))}
                      </span>
                    </div>

                    {hasIcon && (
                      <div className="tile-icon-wrap">
                        <TileIcon tile={tile} />
                      </div>
                    )}

                    {propState?.ownerId && (
                      <div
                        className="owner-dot"
                        style={{ backgroundColor: owner?.color || '#999' }}
                      />
                    )}

                    {propState?.houses > 0 && (
                      <div className="houses-indicator">
                        {Array(propState.houses).fill('🏠').join('')}
                      </div>
                    )}
                    {propState?.hotel && <div className="hotel-indicator">🏨</div>}

                    <div className="tile-tokens">
                      {playersHere.map((p, i) => (
                        <span
                          key={p.id}
                          className={`token ${hoppingTokens[p.id] ? 'hopping' : ''}`}
                          style={{ backgroundColor: p.color }}
                          title={p.name}
                        >
                          {TOKEN_EMOJI[p.token] || '●'}
                        </span>
                      ))}
                    </div>
                  </div>

                  {tile.price && (
                    <div className="tile-price-edge">${tile.price}</div>
                  )}
                </div>
              );
            })}

            <div className="board-center">
              <span className="board-center-title">WORLD MONOPOLY</span>

              <div className="card-deck card-deck-chance">
                <div className="card-deck-stack">
                  <div className="card-back card-back-3"></div>
                  <div className="card-back card-back-2"></div>
                  <div className="card-back card-back-1">
                    <div className="card-back-label">SURPRISE</div>
                    <div className="card-back-icon">?</div>
                  </div>
                </div>
              </div>

              <div className="card-deck card-deck-chest">
                <div className="card-deck-stack">
                  <div className="card-back card-back-chest-3"></div>
                  <div className="card-back card-back-chest-2"></div>
                  <div className="card-back card-back-chest-1">
                    <div className="card-back-label-chest">TREASURE</div>
                    <div className="card-back-icon-chest">
                      <ChestIcon />
                    </div>
                  </div>
                </div>
              </div>

              <div className="dice-area">
                <div className="dice">
                  <div className={`die ${diceAnim.isRolling ? 'rolling' : ''}`}>
                    <span className="die-number-faded die-number-left">{diceAnim.values[0]}</span>
                    <DieFace value={diceAnim.values[0]} />
                  </div>
                  <div className={`die ${diceAnim.isRolling ? 'rolling' : ''}`}>
                    <DieFace value={diceAnim.values[1]} />
                    <span className="die-number-faded die-number-right">{diceAnim.values[1]}</span>
                  </div>
                </div>
              </div>
              <div className="free-parking">
                💰 Vacation Fund: ${gameState?.freeParkingMoney || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="side-panel">
          <PlayerPanel
            players={gameState?.players || []}
            properties={gameState?.properties || []}
            currentPlayerId={gameState?.currentPlayerId}
            myId={playerId}
            onPropertyClick={setShowProperty}
          />

          <div className="game-log">
            <h4>Game Log</h4>
            <div className="log-entries">
              {gameState?.log?.map((entry, i) => (
                <div key={i} className="log-entry">{entry}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="controls-bar">
        {gameState?.status === 'playing' && isCurrentPlayer && (
          <>
            {gameState.turnPhase === 'roll' && (
              <button className="btn-control btn-roll" onClick={handleRoll} disabled={diceAnim.isRolling}>
                {diceAnim.isRolling ? '🎲 Rolling...' : '🎲 Roll Dice'}
              </button>
            )}

            {gameState.turnPhase === 'buy' && (
              <>
                <button className="btn-control btn-buy" onClick={handleBuy}>
                  💰 Buy Property
                </button>
                <button className="btn-control btn-auction" onClick={handleAuction}>
                  📢 Auction
                </button>
              </>
            )}

            {gameState.turnPhase === 'auction' && gameState.auction && (
              <AuctionModal
                auction={gameState.auction}
                players={gameState.players}
                myId={playerId}
                bidAmount={bidAmount}
                setBidAmount={setBidAmount}
                onBid={handleBid}
                onEnd={handleEndAuction}
              />
            )}

            {gameState.pendingCard && (
              <CardModal
                card={gameState.pendingCard}
                onResolve={handleResolveCard}
              />
            )}

            {currentPlayer?.inJail && gameState.turnPhase === 'roll' && (
              <>
                <button className="btn-control" onClick={handlePayJail}>
                  💵 Pay $50 Fine
                </button>
                {me?.jailCards > 0 && (
                  <button className="btn-control" onClick={handleUseJailCard}>
                    🎫 Use Jail Card ({me.jailCards})
                  </button>
                )}
              </>
            )}

            {gameState.turnPhase === 'end' && (
              <>
                <button className="btn-control btn-end" onClick={handleEndTurn}>
                  ✅ End Turn
                </button>
                <button className="btn-control" onClick={() => setShowTrade(true)}>
                  🤝 Trade
                </button>
              </>
            )}
          </>
        )}

        {gameState?.status === 'playing' && !isCurrentPlayer && (
          <div className="waiting-msg">
            Waiting for {currentPlayer?.name}...
          </div>
        )}

        {gameState?.status === 'ended' && (
          <div className="game-over">
            🎉 {gameState.players.find(p => !p.isBankrupt)?.name} Wins!
          </div>
        )}
      </div>

      {showTrade && (
        <TradeModal
          players={gameState?.players || []}
          myId={playerId}
          myProperties={myProperties}
          allProperties={gameState?.properties || []}
          boardTiles={BOARD_TILES}
          onClose={() => setShowTrade(false)}
          onPropose={(tradeData) => {
            const roomCode = sessionStorage.getItem('roomCode');
            emit('proposeTrade', {
              roomCode,
              fromId: playerId,
              toId: tradeData.toId,
              offerProps: tradeData.offerProps,
              offerMoney: tradeData.offerMoney,
              requestProps: tradeData.requestProps,
              requestMoney: tradeData.requestMoney
            });
            setShowTrade(false);
          }}
        />
      )}

      {gameState?.pendingTrade?.isForMe && (
        <div className="modal-overlay">
          <div className="modal trade-pending">
            <h3>Trade Offer</h3>
            <p>{gameState.pendingTrade.fromName} wants to trade with you!</p>
            <div className="trade-preview">
              <div>
                <strong>You Give:</strong>
                <div>Money: ${gameState.pendingTrade.requestMoney}</div>
                <div>Properties: {gameState.pendingTrade.requestProps.map(id => BOARD_TILES[id]?.name).join(', ') || 'None'}</div>
              </div>
              <div>
                <strong>You Get:</strong>
                <div>Money: ${gameState.pendingTrade.offerMoney}</div>
                <div>Properties: {gameState.pendingTrade.offerProps.map(id => BOARD_TILES[id]?.name).join(', ') || 'None'}</div>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-accept" onClick={async () => {
                const roomCode = sessionStorage.getItem('roomCode');
                await emit('respondTrade', { roomCode, playerId, accept: true });
              }}>Accept</button>
              <button className="btn-decline" onClick={async () => {
                const roomCode = sessionStorage.getItem('roomCode');
                await emit('respondTrade', { roomCode, playerId, accept: false });
              }}>Decline</button>
            </div>
          </div>
        </div>
      )}

      {showProperty !== null && (
        <PropertyModal
          tileId={showProperty}
          tile={BOARD_TILES[showProperty]}
          propertyState={getPropertyState(showProperty)}
          owner={gameState?.players.find(p => p.id === getPropertyState(showProperty)?.ownerId)}
          isMine={getPropertyState(showProperty)?.ownerId === playerId}
          isMyTurn={isCurrentPlayer}
          onClose={() => setShowProperty(null)}
          onBuild={async () => {
            const roomCode = sessionStorage.getItem('roomCode');
            await emit('buildHouse', { roomCode, playerId, propertyId: showProperty });
          }}
          onSell={async () => {
            const roomCode = sessionStorage.getItem('roomCode');
            await emit('sellHouse', { roomCode, playerId, propertyId: showProperty });
          }}
          onMortgage={async () => {
            const roomCode = sessionStorage.getItem('roomCode');
            await emit('mortgageProperty', { roomCode, playerId, propertyId: showProperty });
          }}
          onUnmortgage={async () => {
            const roomCode = sessionStorage.getItem('roomCode');
            await emit('unmortgageProperty', { roomCode, playerId, propertyId: showProperty });
          }}
        />
      )}
    </div>
  );
}
