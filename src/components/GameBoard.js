import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import PlayerPanel from './PlayerPanel';
import CardModal from './Modals/CardModal';
import TradeModal from './Modals/TradeModal';
import AuctionModal from './Modals/AuctionModal';
import PropertyModal from './Modals/PropertyModal';
import PlayerProfileModal from './Modals/PlayerProfileModal';

const BOARD_TILES = [
  { id: 0, name: "START", type: "corner" },
  { id: 1, name: "Rio de Janeiro", type: "property", colorGroup: "brown", price: 60, country: "BR", rent: [2, 10, 30, 90, 160, 250], houseCost: 50, mortgageValue: 30 },
  { id: 2, name: "Treasure", type: "chest" },
  { id: 3, name: "Sao Paulo", type: "property", colorGroup: "brown", price: 60, country: "BR", rent: [4, 20, 60, 180, 320, 450], houseCost: 50, mortgageValue: 30 },
  { id: 4, name: "Earnings Tax", type: "tax", price: 200, amount: 200 },
  { id: 5, name: "YYZ Airport", type: "railroad", price: 200, country: "CA", mortgageValue: 100 },
  { id: 6, name: "Montreal", type: "property", colorGroup: "lightblue", price: 100, country: "CA", rent: [6, 30, 90, 270, 400, 550], houseCost: 50, mortgageValue: 50 },
  { id: 7, name: "Surprise", type: "chance" },
  { id: 8, name: "Vancouver", type: "property", colorGroup: "lightblue", price: 100, country: "CA", rent: [6, 30, 90, 270, 400, 550], houseCost: 50, mortgageValue: 50 },
  { id: 9, name: "Toronto", type: "property", colorGroup: "lightblue", price: 120, country: "CA", rent: [8, 40, 100, 300, 450, 600], houseCost: 50, mortgageValue: 60 },
  { id: 10, name: "Prison", type: "corner" },
  { id: 11, name: "Venice", type: "property", colorGroup: "pink", price: 140, country: "IT", rent: [10, 50, 150, 450, 625, 750], houseCost: 100, mortgageValue: 70 },
  { id: 12, name: "Electric Co", type: "utility", price: 150, mortgageValue: 75 },
  { id: 13, name: "Milan", type: "property", colorGroup: "pink", price: 140, country: "IT", rent: [10, 50, 150, 450, 625, 750], houseCost: 100, mortgageValue: 70 },
  { id: 14, name: "Rome", type: "property", colorGroup: "pink", price: 160, country: "IT", rent: [12, 60, 180, 500, 700, 900], houseCost: 100, mortgageValue: 80 },
  { id: 15, name: "CDG Airport", type: "railroad", price: 200, country: "FR", mortgageValue: 100 },
  { id: 16, name: "Nice", type: "property", colorGroup: "orange", price: 180, country: "FR", rent: [14, 70, 200, 550, 750, 950], houseCost: 100, mortgageValue: 90 },
  { id: 17, name: "Treasure", type: "chest" },
  { id: 18, name: "Lyon", type: "property", colorGroup: "orange", price: 180, country: "FR", rent: [14, 70, 200, 550, 750, 950], houseCost: 100, mortgageValue: 90 },
  { id: 19, name: "Paris", type: "property", colorGroup: "orange", price: 200, country: "FR", rent: [16, 80, 220, 600, 800, 1000], houseCost: 100, mortgageValue: 100 },
  { id: 20, name: "Vacation", type: "corner" },
  { id: 21, name: "Manchester", type: "property", colorGroup: "red", price: 220, country: "GB", rent: [18, 90, 250, 700, 875, 1050], houseCost: 150, mortgageValue: 110 },
  { id: 22, name: "Surprise", type: "chance" },
  { id: 23, name: "Birmingham", type: "property", colorGroup: "red", price: 220, country: "GB", rent: [18, 90, 250, 700, 875, 1050], houseCost: 150, mortgageValue: 110 },
  { id: 24, name: "London", type: "property", colorGroup: "red", price: 240, country: "GB", rent: [20, 100, 300, 750, 925, 1100], houseCost: 150, mortgageValue: 120 },
  { id: 25, name: "HND Airport", type: "railroad", price: 200, country: "JP", mortgageValue: 100 },
  { id: 26, name: "Kyoto", type: "property", colorGroup: "yellow", price: 260, country: "JP", rent: [22, 110, 330, 800, 975, 1150], houseCost: 150, mortgageValue: 130 },
  { id: 27, name: "Osaka", type: "property", colorGroup: "yellow", price: 260, country: "JP", rent: [22, 110, 330, 800, 975, 1150], houseCost: 150, mortgageValue: 130 },
  { id: 28, name: "Water Works", type: "utility", price: 150, mortgageValue: 75 },
  { id: 29, name: "Tokyo", type: "property", colorGroup: "yellow", price: 280, country: "JP", rent: [24, 120, 360, 850, 1025, 1200], houseCost: 150, mortgageValue: 140 },
  { id: 30, name: "Go To Prison", type: "corner" },
  { id: 31, name: "Chongqing", type: "property", colorGroup: "green", price: 300, country: "CN", rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200, mortgageValue: 150 },
  { id: 32, name: "Shanghai", type: "property", colorGroup: "green", price: 300, country: "CN", rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200, mortgageValue: 150 },
  { id: 33, name: "Treasure", type: "chest" },
  { id: 34, name: "Beijing", type: "property", colorGroup: "green", price: 320, country: "CN", rent: [28, 150, 450, 1000, 1200, 1400], houseCost: 200, mortgageValue: 160 },
  { id: 35, name: "JFK Airport", type: "railroad", price: 200, country: "US", mortgageValue: 100 },
  { id: 36, name: "Surprise", type: "chance" },
  { id: 37, name: "Chicago", type: "property", colorGroup: "darkblue", price: 350, country: "US", rent: [35, 175, 500, 1100, 1300, 1500], houseCost: 200, mortgageValue: 175 },
  { id: 38, name: "Premium Tax", type: "tax", price: 100, amount: 100 },
  { id: 39, name: "New York", type: "property", colorGroup: "darkblue", price: 400, country: "US", rent: [50, 200, 600, 1400, 1700, 2000], houseCost: 200, mortgageValue: 200 }
];

const COLOR_MAP = {
  brown: '#955436', lightblue: '#AAE0FA', pink: '#D93A96', orange: '#F7941D',
  red: '#ED1B24', yellow: '#FEF200', green: '#1FB25A', darkblue: '#0072BB'
};

const COLOR_GROUPS = {
  brown: [1, 3], lightblue: [6, 8, 9], pink: [11, 13, 14], orange: [16, 18, 19],
  red: [21, 23, 24], yellow: [26, 27, 29], green: [31, 32, 34], darkblue: [37, 39]
};

function getFlagUrl(countryCode) {
  return `https://flagcdn.com/256x192/${countryCode.toLowerCase()}.png`;
}

const TOKEN_EMOJI = {
  backpack: '🎒', textbooks: '📚', 'graduation-hat': '🎓', pencil: '✏️',
  compass: '🧭', suitcase: '🧳'
};

function getCharClass(name) {
  const chars = name.replace(/\s/g, '').length;
  if (chars <= 4) return 'chars-1-4';
  if (chars <= 7) return 'chars-5-7';
  if (chars <= 10) return 'chars-8-10';
  if (chars <= 14) return 'chars-11-14';
  return 'chars-15-plus';
}

function getGridPos(tileId) {
  if (tileId >= 20 && tileId <= 30) return { gridRow: 1, gridColumn: tileId - 19 };
  if (tileId >= 31 && tileId <= 39) return { gridRow: tileId - 29, gridColumn: 11 };
  if (tileId >= 0  && tileId <= 10) return { gridRow: 11, gridColumn: 11 - tileId };
  if (tileId >= 11 && tileId <= 19) return { gridRow: 21 - tileId, gridColumn: 1 };
  return { gridRow: 1, gridColumn: 1 };
}

function getTileSide(tileId) {
  if (tileId >= 1  && tileId <= 9)  return 'bottom';
  if (tileId >= 11 && tileId <= 19) return 'left';
  if (tileId >= 21 && tileId <= 29) return 'top';
  if (tileId >= 31 && tileId <= 39) return 'right';
  return null;
}

function calculateRent(tileId, properties, diceSum = 7) {
  const tile = BOARD_TILES[tileId];
  const prop = properties.find(p => p.id === tileId);
  if (!tile || !prop || !prop.ownerId || prop.isMortgaged) return 0;
  if (tile.type === 'property' && tile.rent) {
    if (prop.hotel) return tile.rent[5];
    if (prop.houses > 0) return tile.rent[prop.houses];
    const group = COLOR_GROUPS[tile.colorGroup];
    if (group) {
      const ownsAll = group.every(id => { const p = properties.find(x => x.id === id); return p && p.ownerId === prop.ownerId; });
      return ownsAll ? tile.rent[0] * 2 : tile.rent[0];
    }
    return tile.rent[0];
  }
  if (tile.type === 'railroad') {
    const rr = [5,15,25,35].filter(id => { const p = properties.find(x => x.id === id); return p && p.ownerId === prop.ownerId; });
    return 25 * Math.pow(2, rr.length - 1);
  }
  if (tile.type === 'utility') {
    const ut = [12,28].filter(id => { const p = properties.find(x => x.id === id); return p && p.ownerId === prop.ownerId; });
    return ut.length === 2 ? diceSum * 10 : diceSum * 4;
  }
  return 0;
}

function getFloatDirection(tileId) {
  if (tileId >= 0  && tileId <= 10) return 'float-up';
  if (tileId >= 11 && tileId <= 19) return 'float-right';
  if (tileId >= 20 && tileId <= 30) return 'float-down';
  if (tileId >= 31 && tileId <= 39) return 'float-left';
  return 'float-up';
}

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
      <line x1="50" y1="3" x2="50" y2="13"/><line x1="18" y1="20" x2="25" y2="27"/>
      <line x1="82" y1="20" x2="75" y2="27"/><line x1="5" y1="50" x2="15" y2="50"/>
      <line x1="85" y1="50" x2="95" y2="50"/>
    </g>
    <ellipse cx="50" cy="50" rx="24" ry="28" fill="#FFE082" stroke="#1a1a1a" strokeWidth="2.5"/>
    <path d="M 42 48 Q 50 56 58 48" stroke="#FF6F00" strokeWidth="2" fill="none"/>
    <line x1="42" y1="48" x2="42" y2="40" stroke="#1a1a1a" strokeWidth="1.5"/>
    <line x1="58" y1="48" x2="58" y2="40" stroke="#1a1a1a" strokeWidth="1.5"/>
    <rect x="38" y="76" width="24" height="5" fill="#888" stroke="#1a1a1a" strokeWidth="1"/>
    <rect x="40" y="81" width="20" height="4" fill="#888" stroke="#1a1a1a" strokeWidth="1"/>
    <rect x="42" y="85" width="16" height="4" fill="#666" stroke="#1a1a1a" strokeWidth="1"/>
  </svg>
);
const FaucetIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="tile-svg">
    <circle cx="40" cy="18" r="9" fill="#666" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="32" y1="18" x2="48" y2="18" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="40" y1="10" x2="40" y2="26" stroke="#1a1a1a" strokeWidth="2"/>
    <rect x="36" y="26" width="8" height="14" fill="#888" stroke="#1a1a1a" strokeWidth="1.5"/>
    <rect x="20" y="40" width="50" height="14" fill="#888" stroke="#1a1a1a" strokeWidth="1.5"/>
    <rect x="62" y="54" width="10" height="10" fill="#666" stroke="#1a1a1a" strokeWidth="1.5"/>
    <rect x="65" y="64" width="4" height="14" fill="#3FA9F5"/>
    <ellipse cx="67" cy="86" rx="4" ry="6" fill="#3FA9F5" stroke="#1976D2" strokeWidth="1"/>
    <ellipse cx="56" cy="92" rx="3" ry="4" fill="#3FA9F5" stroke="#1976D2" strokeWidth="1"/>
    <ellipse cx="78" cy="93" rx="2.5" ry="3.5" fill="#3FA9F5" stroke="#1976D2" strokeWidth="1"/>
  </svg>
);
const ChanceIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="tile-svg">
    <text x="50" y="78" textAnchor="middle" fontSize="92" fontWeight="900"
          fill="#F7941D" fontFamily="Fredoka, Arial Black, sans-serif" stroke="#1a1a1a" strokeWidth="2">?</text>
  </svg>
);
const ChestIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="tile-svg">
    <rect x="12" y="50" width="76" height="34" fill="#8B4513" stroke="#1a1a1a" strokeWidth="2"/>
    <path d="M 12 50 Q 50 22 88 50 Z" fill="#A0522D" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="12" y1="64" x2="88" y2="64" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="30" y1="36" x2="30" y2="84" stroke="#1a1a1a" strokeWidth="1.5"/>
    <line x1="70" y1="36" x2="70" y2="84" stroke="#1a1a1a" strokeWidth="1.5"/>
    <rect x="44" y="58" width="12" height="14" fill="#FFD700" stroke="#1a1a1a" strokeWidth="1.5"/>
    <circle cx="50" cy="64" r="2" fill="#1a1a1a"/>
    <circle cx="78" cy="44" r="4" fill="#FFD700" stroke="#1a1a1a" strokeWidth="1"/>
    <circle cx="22" cy="44" r="3" fill="#FFD700" stroke="#1a1a1a" strokeWidth="1"/>
  </svg>
);
const DiamondRingIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="tile-svg">
    <ellipse cx="50" cy="68" rx="28" ry="22" fill="none" stroke="#FFD700" strokeWidth="6"/>
    <ellipse cx="50" cy="68" rx="28" ry="22" fill="none" stroke="#1a1a1a" strokeWidth="1"/>
    <polygon points="50,15 38,32 50,50 62,32" fill="#B0E0E6" stroke="#1a1a1a" strokeWidth="2"/>
    <polygon points="50,15 44,24 50,32 56,24" fill="#fff"/>
    <line x1="38" y1="32" x2="62" y2="32" stroke="#1a1a1a" strokeWidth="1.5"/>
  </svg>
);
const TaxIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="tile-svg">
    <text x="50" y="68" textAnchor="middle" fontSize="62" fontWeight="900"
          fill="#1FB25A" fontFamily="Fredoka, Arial Black, sans-serif" stroke="#1a1a1a" strokeWidth="2">$</text>
  </svg>
);
const PalmTreeIcon = () => (
  <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" className="corner-svg">
    <path d="M58 45 Q55 65 52 85 L60 88 L68 85 Q65 65 62 45 Z" fill="#8B4513" stroke="#1a1a1a" strokeWidth="1.5"/>
    <ellipse cx="60" cy="38" rx="35" ry="12" fill="#228B22" stroke="#1a1a1a" strokeWidth="1.5" transform="rotate(-15 60 38)"/>
    <ellipse cx="60" cy="38" rx="32" ry="10" fill="#32CD32" stroke="#1a1a1a" strokeWidth="1" transform="rotate(10 60 38)"/>
    <ellipse cx="60" cy="38" rx="28" ry="9" fill="#228B22" stroke="#1a1a1a" strokeWidth="1" transform="rotate(35 60 38)"/>
    <ellipse cx="60" cy="38" rx="30" ry="10" fill="#32CD32" stroke="#1a1a1a" strokeWidth="1" transform="rotate(-40 60 38)"/>
    <circle cx="55" cy="48" r="4" fill="#8B4513" stroke="#1a1a1a" strokeWidth="1"/>
    <circle cx="63" cy="50" r="3.5" fill="#8B4513" stroke="#1a1a1a" strokeWidth="1"/>
    <circle cx="59" cy="53" r="3" fill="#8B4513" stroke="#1a1a1a" strokeWidth="1"/>
  </svg>
);
const ArrowIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="corner-svg">
    <path d="M 20 30 L 70 30 L 70 15 L 92 50 L 70 85 L 70 70 L 20 70 Z" fill="#C5392A" stroke="#1a1a1a" strokeWidth="2.5"/>
  </svg>
);
const GoArrowIcon = () => (
  <svg viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg" className="go-arrow-svg">
    <path d="M 5 15 L 18 5 L 18 12 L 95 12 L 95 18 L 18 18 L 18 25 Z" fill="#C5392A" stroke="#1a1a1a" strokeWidth="1.5"/>
  </svg>
);

const DIE_DOTS = { 1:[5], 2:[1,9], 3:[1,5,9], 4:[1,3,7,9], 5:[1,3,5,7,9], 6:[1,3,4,6,7,9] };
function DieFace({ value }) {
  const active = DIE_DOTS[value] || [];
  return (
    <div className="die-face">
      {[1,2,3,4,5,6,7,8,9].map(pos => (
        <div key={pos} className={`die-dot ${active.includes(pos) ? '' : 'hidden'}`}/>
      ))}
    </div>
  );
}
function TileIcon({ tile }) {
  if (tile.type === 'railroad') return <AirplaneIcon/>;
  if (tile.type === 'utility') return tile.id === 12 ? <BulbIcon/> : <FaucetIcon/>;
  if (tile.type === 'chance') return <ChanceIcon/>;
  if (tile.type === 'chest') return <ChestIcon/>;
  if (tile.type === 'tax') return tile.id === 38 ? <DiamondRingIcon/> : <TaxIcon/>;
  return null;
}

function CornerTile({ tile, jailedPlayers, visitingPlayers, hoppingTokens }) {
  if (tile.id === 0) {
    return (
      <div className="corner-inner corner-go">
        <div className="corner-go-arrow"><GoArrowIcon/></div>
        <div className="corner-go-text">START</div>
        <div className="corner-go-collect">COLLECT $200 SALARY AS YOU PASS</div>
      </div>
    );
  }
  if (tile.id === 10) {
    return (
      <div className="corner-inner corner-jail">
        <div className="jail-cell">
          <div className="jail-in-label">IN PRISON</div>
          <div className="jail-tokens-behind-bars">
            {(jailedPlayers || []).map(p => (
              <span key={p.id} className={`token ${hoppingTokens?.[p.id] ? 'hopping' : ''}`}
                    style={{ backgroundColor: p.color }} title={p.name}>
                {TOKEN_EMOJI[p.token] || '●'}
              </span>
            ))}
          </div>
          <div className="jail-bars-grid">
            <span/><span/><span/><span/><span/>
          </div>
        </div>
        <div className="jail-diagonal"/>
        <div className="jail-visiting-tokens">
          {(visitingPlayers || []).map(p => (
            <span key={p.id} className={`token ${hoppingTokens?.[p.id] ? 'hopping' : ''}`}
                  style={{ backgroundColor: p.color }} title={p.name}>
              {TOKEN_EMOJI[p.token] || '●'}
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (tile.id === 20) {
    return (
      <div className="corner-inner corner-parking">
        <div className="corner-parking-top">FREE</div>
        <div className="corner-parking-icon"><PalmTreeIcon/></div>
        <div className="corner-parking-bottom">VACATION</div>
      </div>
    );
  }
  if (tile.id === 30) {
    return (
      <div className="corner-inner corner-gotojail">
        <div className="corner-gotojail-top">GO TO</div>
        <div className="corner-gotojail-icon"><ArrowIcon/></div>
        <div className="corner-gotojail-bottom">PRISON</div>
      </div>
    );
  }
  return <div className="corner-inner">{tile.name}</div>;
}

export default function GameBoard({ gameState, playerId, emit, connected, onStartGame, getShareLink }) {
  const [showTrade, setShowTrade] = useState(false);
  const [showProperty, setShowProperty] = useState(null);
  const [showPlayerProfile, setShowPlayerProfile] = useState(null);
  const [copied, setCopied] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [hoppingTokens, setHoppingTokens] = useState({});
  const [animatedPositions, setAnimatedPositions] = useState({});
  const [diceAnim, setDiceAnim] = useState({ isRolling: false, values: [1, 1] });
  const [jailNotification, setJailNotification] = useState(null);
  const [auctionTimer, setAuctionTimer] = useState(10);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [displayCard, setDisplayCard] = useState(null);
  const [currentPlayerMoving, setCurrentPlayerMoving] = useState(false);

  const prevPositionsRef = useRef({});
  const diceIntervalRef = useRef(null);
  const movingPlayersRef = useRef(new Set());
  const timeoutsRef = useRef([]);
  const auctionTimerRef = useRef(null);
  const movingCurrentPlayerRef = useRef(null);
  const isCurrentPlayerRef = useRef(false);
  const prevLogLengthRef = useRef(null);
  const pendingFloatsRef = useRef([]);
  const currentPlayerMovingRef = useRef(false);

  const isCurrentPlayer = gameState?.currentPlayerId === playerId;
  const me = gameState?.players.find(p => p.id === playerId);
  const currentPlayer = gameState?.players.find(p => p.id === gameState?.currentPlayerId);

  isCurrentPlayerRef.current = isCurrentPlayer;
  currentPlayerMovingRef.current = currentPlayerMoving;

  const myProperties = useMemo(() => {
    if (!gameState || !me) return [];
    return gameState.properties.filter(p => p.ownerId === playerId);
  }, [gameState, playerId]);

  const showFloats = useCallback((floats) => {
    if (!floats.length) return;
    setFloatingTexts(prev => [...prev, ...floats]);
    const ids = new Set(floats.map(f => f.id));
    setTimeout(() => setFloatingTexts(prev => prev.filter(f => !ids.has(f.id))), 2200);
  }, []);

  useEffect(() => {
    if (gameState?.dice && !diceAnim.isRolling)
      setDiceAnim(prev => ({ ...prev, values: gameState.dice }));
  }, [gameState?.dice, diceAnim.isRolling]);

  useEffect(() => {
    if (gameState?.pendingCard) {
      setDisplayCard({ ...gameState.pendingCard, turnSequence: gameState.turnSequence });
    } else {
      setDisplayCard(null);
    }
  }, [gameState?.pendingCard, gameState?.turnSequence]);

  useEffect(() => {
    if (gameState?.turnPhase === 'auction' && gameState?.auction?.endTime) {
      if (auctionTimerRef.current) clearInterval(auctionTimerRef.current);
      auctionTimerRef.current = setInterval(() => {
        const remaining = Math.ceil((gameState.auction.endTime - Date.now()) / 1000);
        setAuctionTimer(Math.max(0, remaining));
        if (remaining <= 0) {
          clearInterval(auctionTimerRef.current);
          auctionTimerRef.current = null;
          if (isCurrentPlayerRef.current) {
            const roomCode = sessionStorage.getItem('roomCode');
            emit('endAuction', { roomCode, playerId });
          }
        }
      }, 200);
    } else {
      if (auctionTimerRef.current) { clearInterval(auctionTimerRef.current); auctionTimerRef.current = null; }
    }
    return () => { if (auctionTimerRef.current) clearInterval(auctionTimerRef.current); };
  }, [gameState?.turnPhase, gameState?.auction?.endTime]);

  useEffect(() => {
    if (!connected || !gameState) return;
    const t = setTimeout(() => {
      const animActive = movingPlayersRef.current.size > 0 || movingCurrentPlayerRef.current !== null;
      if (!animActive) {
        if (currentPlayerMovingRef.current) {
          setCurrentPlayerMoving(false);
          currentPlayerMovingRef.current = false;
        }
        if (diceIntervalRef.current) {
          clearInterval(diceIntervalRef.current);
          diceIntervalRef.current = null;
          setDiceAnim(prev => ({ ...prev, isRolling: false, values: gameState.dice || prev.values }));
        }
      }
    }, 700);
    return () => clearTimeout(t);
  }, [connected, gameState?.turnSequence, gameState?.currentPlayerId]);

  useEffect(() => {
    if (!gameState?.players || !gameState?.log) return;
    const latestLog = gameState.log[gameState.log.length - 1];
    if (!latestLog) return;
    const m = latestLog.match(/(.+?) (?:was sent to Jail!|rolled 3 doubles and was sent to Jail!)/);
    if (m) {
      const isMe = gameState.players.find(p => p.id === playerId)?.name === m[1];
      setJailNotification({ name: m[1], isMe });
      const t = setTimeout(() => setJailNotification(null), 3000);
      return () => clearTimeout(t);
    }
  }, [gameState?.log, gameState?.players, playerId]);

  useEffect(() => {
    if (!gameState?.log || !gameState?.players) return;
    const currentLength = gameState.log.length;
    if (prevLogLengthRef.current === null) { prevLogLengthRef.current = currentLength; return; }
    if (currentLength <= prevLogLengthRef.current) { prevLogLengthRef.current = currentLength; return; }
    const newEntries = gameState.log.slice(prevLogLengthRef.current);
    prevLogLengthRef.current = currentLength;

    const newFloats = [];
    const mkFloat = (id, text, color, tileId) => {
      const pos = getGridPos(tileId);
      return { id: `f${Date.now()}${Math.random()}${id}`, text, color, gridRow: pos.gridRow, gridColumn: pos.gridColumn, direction: getFloatDirection(tileId) };
    };

    newEntries.forEach(entry => {
      let m;
      m = entry.match(/^(.+?) paid \$(\d+) rent to (.+?)\.$/);
      if (m) {
        const amt = parseInt(m[2]);
        const payer = gameState.players.find(p => p.name === m[1]);
        if (payer) newFloats.push(mkFloat('p', `-$${amt}`, '#ff4444', payer.position));
        if (payer) newFloats.push(mkFloat('r', `+$${amt}`, '#44ee44', payer.position));
        return;
      }
      m = entry.match(/^(.+?) paid \$(\d+) in taxes\.$/);
      if (m) {
        const p = gameState.players.find(pl => pl.name === m[1]);
        if (p) newFloats.push(mkFloat('t', `-$${parseInt(m[2])}`, '#ff4444', p.position));
        return;
      }
      m = entry.match(/^(.+?) collected \$(\d+) from card\.$/);
      if (m) {
        const p = gameState.players.find(pl => pl.name === m[1]);
        if (p) newFloats.push(mkFloat('cc', `+$${parseInt(m[2])}`, '#44ee44', p.position));
        return;
      }
      m = entry.match(/^(.+?) paid \$(\d+) from card\.$/);
      if (m) {
        const p = gameState.players.find(pl => pl.name === m[1]);
        if (p) newFloats.push(mkFloat('cp', `-$${parseInt(m[2])}`, '#ff4444', p.position));
        return;
      }
      m = entry.match(/^(.+?) passed Go and collected \$(\d+)$/);
      if (m) {
        const p = gameState.players.find(pl => pl.name === m[1]);
        if (p) newFloats.push(mkFloat('g', `+$${parseInt(m[2])}`, '#44ee44', 0));
        return;
      }
      m = entry.match(/^(.+?) collected \$(\d+) from Free Vacation!$/);
      if (m) {
        const p = gameState.players.find(pl => pl.name === m[1]);
        if (p) newFloats.push(mkFloat('fv', `+$${parseInt(m[2])}`, '#44ee44', p.position));
        return;
      }
      m = entry.match(/^(.+?) paid \$(\d+) to each player\.$/);
      if (m) {
        const payer = gameState.players.find(pl => pl.name === m[1]);
        if (payer) {
          const others = gameState.players.filter(pl => !pl.isBankrupt && pl.id !== payer.id).length;
          newFloats.push(mkFloat('pe', `-$${parseInt(m[2]) * others}`, '#ff4444', payer.position));
        }
        return;
      }
      m = entry.match(/^(.+?) collected \$(\d+) from each player\.$/);
      if (m) {
        const recv = gameState.players.find(pl => pl.name === m[1]);
        if (recv) {
          const others = gameState.players.filter(pl => !pl.isBankrupt && pl.id !== recv.id).length;
          newFloats.push(mkFloat('ce', `+$${parseInt(m[2]) * others}`, '#44ee44', recv.position));
        }
        return;
      }
      m = entry.match(/^(.+?) paid \$(\d+) to leave Jail\.$/);
      if (m) {
        const p = gameState.players.find(pl => pl.name === m[1]);
        if (p) newFloats.push(mkFloat('jf', `-$${parseInt(m[2])}`, '#ff4444', p.position));
        return;
      }
      m = entry.match(/^(.+?) paid \$(\d+) for repairs\.$/);
      if (m) {
        const p = gameState.players.find(pl => pl.name === m[1]);
        if (p) newFloats.push(mkFloat('rp', `-$${parseInt(m[2])}`, '#ff4444', p.position));
        return;
      }
    });

    if (!newFloats.length) return;
    const delayedCheck = setTimeout(() => {
      if (movingPlayersRef.current.size > 0 || currentPlayerMovingRef.current) {
        pendingFloatsRef.current.push(...newFloats);
      } else {
        showFloats(newFloats);
      }
    }, 80);
    timeoutsRef.current.push(delayedCheck);
  }, [gameState?.log?.length, gameState?.players, showFloats]);

  useEffect(() => {
    if (!gameState?.players) return;
    gameState.players.forEach(player => {
      const prevPos = prevPositionsRef.current[player.id];
      const currPos = player.position;
      if (prevPos === undefined) { prevPositionsRef.current[player.id] = currPos; return; }
      if (prevPos === currPos || movingPlayersRef.current.has(player.id)) return;

      const isGoToJail = prevPos === 30 && currPos === 10;
      const wasSentToJail = currPos === 10 && player.inJail &&
        gameState.log?.some(log => log.includes(player.name) && log.includes('Jail'));

      if (isGoToJail || wasSentToJail) {
        prevPositionsRef.current[player.id] = currPos;
        setAnimatedPositions(prev => { const n = { ...prev }; delete n[player.id]; return n; });
        if (player.id === gameState?.currentPlayerId) {
          movingCurrentPlayerRef.current = player.id;
          setCurrentPlayerMoving(true); currentPlayerMovingRef.current = true;
          const t = setTimeout(() => {
            setCurrentPlayerMoving(false); currentPlayerMovingRef.current = false;
            movingCurrentPlayerRef.current = null;
            if (pendingFloatsRef.current.length > 0) {
              const s = [...pendingFloatsRef.current]; pendingFloatsRef.current = []; showFloats(s);
            }
          }, 350);
          timeoutsRef.current.push(t);
        }
        return;
      }

      movingPlayersRef.current.add(player.id);
      if (player.id === gameState?.currentPlayerId) {
        movingCurrentPlayerRef.current = player.id;
        setCurrentPlayerMoving(true); currentPlayerMovingRef.current = true;
      }

      const forwardSteps = (currPos - prevPos + 40) % 40;
      const backwardSteps = (prevPos - currPos + 40) % 40;
      const isMovingBackwards = backwardSteps < forwardSteps;

      if (isMovingBackwards) {
        setAnimatedPositions(prev => ({ ...prev, [player.id]: currPos }));
        const t = setTimeout(() => {
          movingPlayersRef.current.delete(player.id);
          setAnimatedPositions(prev => { const n = { ...prev }; delete n[player.id]; return n; });
          prevPositionsRef.current[player.id] = currPos;
          if (movingPlayersRef.current.size === 0 && movingCurrentPlayerRef.current === null) {
            const ft = setTimeout(() => {
              if (pendingFloatsRef.current.length > 0) {
                const toShow = [...pendingFloatsRef.current];
                pendingFloatsRef.current = [];
                showFloats(toShow);
              }
            }, 200);
            timeoutsRef.current.push(ft);
          }
          if (player.id === movingCurrentPlayerRef.current) {
            const st = setTimeout(() => {
              setCurrentPlayerMoving(false); currentPlayerMovingRef.current = false;
              movingCurrentPlayerRef.current = null;
              if (pendingFloatsRef.current.length > 0) {
                const s = [...pendingFloatsRef.current]; pendingFloatsRef.current = []; showFloats(s);
              }
            }, 150);
            timeoutsRef.current.push(st);
          }
        }, 300);
        timeoutsRef.current.push(t);
        return;
      }

      const path = [];
      let p = prevPos;
      while (p !== currPos) { p = (p + 1) % 40; path.push(p); }
      const stepDuration = 280;

      const animateStep = (step) => {
        if (step >= path.length) {
          movingPlayersRef.current.delete(player.id);
          setAnimatedPositions(prev => { const n = { ...prev }; delete n[player.id]; return n; });
          prevPositionsRef.current[player.id] = currPos;
          if (movingPlayersRef.current.size === 0 && movingCurrentPlayerRef.current === null) {
            const ft = setTimeout(() => {
              if (pendingFloatsRef.current.length > 0) {
                const toShow = [...pendingFloatsRef.current];
                pendingFloatsRef.current = [];
                showFloats(toShow);
              }
            }, 200);
            timeoutsRef.current.push(ft);
          }
          if (player.id === movingCurrentPlayerRef.current) {
            const st = setTimeout(() => {
              setCurrentPlayerMoving(false); currentPlayerMovingRef.current = false;
              movingCurrentPlayerRef.current = null;
              if (pendingFloatsRef.current.length > 0) {
                const s = [...pendingFloatsRef.current]; pendingFloatsRef.current = []; showFloats(s);
              }
            }, 150);
            timeoutsRef.current.push(st);
          }
          return;
        }
        setAnimatedPositions(prev => ({ ...prev, [player.id]: path[step] }));
        setHoppingTokens(prev => ({ ...prev, [player.id]: true }));
        const t1 = setTimeout(() => {
          setHoppingTokens(prev => { const n = { ...prev }; delete n[player.id]; return n; });
        }, 260);
        timeoutsRef.current.push(t1);
        const t2 = setTimeout(() => animateStep(step + 1), stepDuration);
        timeoutsRef.current.push(t2);
      };
      animateStep(0);
    });
  }, [gameState?.players, gameState?.turnSequence, showFloats]);

  useEffect(() => {
    return () => {
      if (diceIntervalRef.current) { clearInterval(diceIntervalRef.current); diceIntervalRef.current = null; }
      timeoutsRef.current.forEach(clearTimeout);
      if (auctionTimerRef.current) clearInterval(auctionTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (currentPlayerMoving && gameState?.currentPlayerId !== movingCurrentPlayerRef.current) {
      setCurrentPlayerMoving(false);
      currentPlayerMovingRef.current = false;
      movingCurrentPlayerRef.current = null;
      if (diceIntervalRef.current) { clearInterval(diceIntervalRef.current); diceIntervalRef.current = null; }
      if (pendingFloatsRef.current.length > 0) {
        const toShow = [...pendingFloatsRef.current];
        pendingFloatsRef.current = [];
        showFloats(toShow);
      }
    }
  }, [gameState?.currentPlayerId, currentPlayerMoving, showFloats]);

  // FIX: Auto-clear currentPlayerMoving when server advances turn phase
  useEffect(() => {
    if (!currentPlayerMoving) return;
    if (gameState?.turnPhase === 'end' || gameState?.turnPhase === 'buy' || gameState?.turnPhase === 'auction') {
      setCurrentPlayerMoving(false);
      currentPlayerMovingRef.current = false;
      movingCurrentPlayerRef.current = null;
      if (diceIntervalRef.current) { clearInterval(diceIntervalRef.current); diceIntervalRef.current = null; }
      if (pendingFloatsRef.current.length > 0) {
        const toShow = [...pendingFloatsRef.current];
        pendingFloatsRef.current = [];
        showFloats(toShow);
      }
    }
  }, [gameState?.turnPhase, currentPlayerMoving, showFloats]);

  // FIX: Hard safety timeout — never stay stuck longer than 4s
  useEffect(() => {
    if (!currentPlayerMoving) return;
    const t = setTimeout(() => {
      setCurrentPlayerMoving(false);
      currentPlayerMovingRef.current = false;
      movingCurrentPlayerRef.current = null;
      if (diceIntervalRef.current) { clearInterval(diceIntervalRef.current); diceIntervalRef.current = null; }
      if (pendingFloatsRef.current.length > 0) {
        const toShow = [...pendingFloatsRef.current];
        pendingFloatsRef.current = [];
        showFloats(toShow);
      }
    }, 4000);
    return () => clearTimeout(t);
  }, [currentPlayerMoving, showFloats]);

    const handleRoll = async () => {
    if (diceAnim.isRolling) return;
    const roomCode = sessionStorage.getItem('roomCode');
    if (diceIntervalRef.current) { clearInterval(diceIntervalRef.current); diceIntervalRef.current = null; }
    setDiceAnim({ isRolling: true, values: [1, 1] });
    diceIntervalRef.current = setInterval(() => {
      setDiceAnim(prev => ({ ...prev, values: [Math.floor(Math.random()*6)+1, Math.floor(Math.random()*6)+1] }));
    }, 120);
    const startTime = Date.now();
    try {
      await emit('rollDice', { roomCode, playerId });
    } catch (err) {
      console.error('Roll error:', err);
    }
    const remaining = Math.max(0, 1200 - (Date.now() - startTime));
    setTimeout(() => {
      if (diceIntervalRef.current) { clearInterval(diceIntervalRef.current); diceIntervalRef.current = null; }
      setDiceAnim(prev => ({ ...prev, isRolling: false, values: gameState?.dice || prev.values }));
    }, remaining);
  };

  const handleBuy        = async () => { const r = sessionStorage.getItem('roomCode'); await emit('buyProperty',    { roomCode: r, playerId }); };
  const handleAuction    = async () => { const r = sessionStorage.getItem('roomCode'); await emit('startAuction',  { roomCode: r, playerId }); };
  const handleEndTurn    = async () => { const r = sessionStorage.getItem('roomCode'); await emit('endTurn',       { roomCode: r, playerId }); };
  const handlePayJail    = async () => { const r = sessionStorage.getItem('roomCode'); await emit('payJailFine',   { roomCode: r, playerId }); };
  const handleUseJailCard= async () => { const r = sessionStorage.getItem('roomCode'); await emit('useJailCard',   { roomCode: r, playerId }); };
  const handleResolveCard= async () => { const r = sessionStorage.getItem('roomCode'); await emit('resolveCard',   { roomCode: r, playerId }); };

  const handleBidFixed = async (amount) => {
    const roomCode = sessionStorage.getItem('roomCode');
    const auction = gameState?.auction;
    if (!auction) return;
    const actualBid = Math.max(auction.highestBid + 1, auction.highestBid + amount);
    if (me?.money >= actualBid) await emit('placeBid', { roomCode, playerId, amount: actualBid });
  };
  const handleBid = async () => {
    const roomCode = sessionStorage.getItem('roomCode');
    const amount = parseInt(bidAmount);
    if (!amount || amount <= 0) return;
    await emit('placeBid', { roomCode, playerId, amount });
    setBidAmount('');
  };
  const copyLink = () => {
    navigator.clipboard.writeText(getShareLink()).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const getPlayersOnTile = (tileId) => gameState?.players.filter(p => {
    if (p.isBankrupt) return false;
    const disp = animatedPositions[p.id] !== undefined ? animatedPositions[p.id] : p.position;
    return disp === tileId;
  }) || [];

  const getPropertyState = (tileId) => gameState?.properties.find(p => p.id === tileId);

  return (
    <div className="game-container">
      {jailNotification && (
        <div className="jail-notification-overlay">
          <div className="jail-notification">
            <div className="jail-notification-icon">🚔</div>
            <div className="jail-notification-text">
              {jailNotification.isMe ? 'YOU ARE GOING TO JAIL' : `${jailNotification.name} IS GOING TO JAIL`}
            </div>
          </div>
        </div>
      )}

      <div className="top-bar">
        <div className="room-info">
          <span className="room-code">Room: {gameState?.roomCode}</span>
          <button className="btn-small" onClick={copyLink}>{copied ? 'Copied!' : 'Share Link'}</button>
        </div>
        <div className="game-status">
          {gameState?.status === 'waiting' && (
            <button className="btn-start" onClick={onStartGame}>Start Game ({gameState.players.length}/6)</button>
          )}
          {gameState?.status === 'playing' && (
            <span className="turn-indicator">{currentPlayer?.name}'s Turn</span>
          )}
        </div>
      </div>

      <div className="game-layout">
        <div className="board-wrapper">
          <div className="board">
            {BOARD_TILES.map(tile => {
              const pos        = getGridPos(tile.id);
              const propState  = getPropertyState(tile.id);
              const playersHere= getPlayersOnTile(tile.id);
              const isCorner   = tile.type === 'corner';
              const owner      = gameState?.players.find(p => p.id === propState?.ownerId);
              const side       = getTileSide(tile.id);
              const hasIcon    = ['railroad','utility','chance','chest','tax'].includes(tile.type);
              const charClass  = getCharClass(tile.name);

              if (isCorner) {
                if (tile.id === 10) {
                  const jailedHere   = playersHere.filter(p => p.inJail);
                  const visitingHere = playersHere.filter(p => !p.inJail);
                  return (
                    <div key={tile.id} className="tile tile-corner tile-corner-10"
                         style={{ gridRow: pos.gridRow, gridColumn: pos.gridColumn }}
                         onClick={() => setShowProperty(tile.id)}>
                      <CornerTile tile={tile} jailedPlayers={jailedHere}
                                  visitingPlayers={visitingHere} hoppingTokens={hoppingTokens}/>
                    </div>
                  );
                }
                return (
                  <div key={tile.id} className={`tile tile-corner tile-corner-${tile.id}`}
                       style={{ gridRow: pos.gridRow, gridColumn: pos.gridColumn }}
                       onClick={() => setShowProperty(tile.id)}>
                    <CornerTile tile={tile}/>
                    <div className="tile-tokens corner-tokens">
                      {playersHere.map(p => (
                        <span key={p.id} className={`token ${hoppingTokens[p.id] ? 'hopping' : ''}`}
                              style={{ backgroundColor: p.color }} title={p.name}>
                          {TOKEN_EMOJI[p.token] || '●'}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={tile.id} className={`tile tile-${tile.type}`}
                     data-side={side || undefined}
                     style={{ gridRow: pos.gridRow, gridColumn: pos.gridColumn }}
                     onClick={() => setShowProperty(tile.id)}>
                  {tile.country && (
                    <div className="color-bar">
                      <div className="color-bar-img" style={{ backgroundImage: `url(${getFlagUrl(tile.country)})` }}/>
                    </div>
                  )}
                  {tile.colorGroup && !tile.country && (
                    <div className="color-bar" style={{ backgroundColor: COLOR_MAP[tile.colorGroup] }}/>
                  )}
                  <div className="tile-content">
                    <div className="tile-name-wrap">
                      <span className={`tile-name ${charClass}`}>
                        {tile.name.split(' ').map((word, wi) => (
                          <span key={wi} className="tile-name-word">{word}</span>
                        ))}
                      </span>
                    </div>
                    {hasIcon && <div className="tile-icon-wrap"><TileIcon tile={tile}/></div>}
                    {propState?.ownerId && <div className="owner-dot" style={{ backgroundColor: owner?.color || '#999' }}/>}
                    {propState?.houses > 0 && <div className="houses-indicator">{Array(propState.houses).fill('🏠').join('')}</div>}
                    {propState?.hotel && <div className="hotel-indicator">🏨</div>}
                  </div>
                  <div className="tile-tokens">
                    {playersHere.map(p => (
                      <span key={p.id} className={`token ${hoppingTokens[p.id] ? 'hopping' : ''}`}
                            style={{ backgroundColor: p.color }} title={p.name}>
                        {TOKEN_EMOJI[p.token] || '●'}
                      </span>
                    ))}
                  </div>
                  {tile.price && <div className="tile-price-edge">${tile.price}</div>}
                </div>
              );
            })}

            {floatingTexts.map(float => (
              <div key={float.id} className={`floating-money ${float.direction}`}
                   style={{ gridRow: float.gridRow, gridColumn: float.gridColumn, color: float.color }}>
                {float.text}
              </div>
            ))}

            <div className="board-center">
              <span className="board-center-title">WORLD MONOPOLY</span>
              <div className="card-deck card-deck-chance">
                <div className="card-deck-stack">
                  <div className="card-back card-back-3"/>
                  <div className="card-back card-back-2"/>
                  <div className="card-back card-back-1">
                    <div className="card-back-label">SURPRISE</div>
                    <div className="card-back-icon">?</div>
                  </div>
                </div>
              </div>
              <div className="card-deck card-deck-chest">
                <div className="card-deck-stack">
                  <div className="card-back card-back-chest-3"/>
                  <div className="card-back card-back-chest-2"/>
                  <div className="card-back card-back-chest-1">
                    <div className="card-back-label-chest">TREASURE</div>
                    <div className="card-back-icon-chest"><ChestIcon/></div>
                  </div>
                </div>
              </div>
              <div className="dice-area">
                <div className="dice">
                  <div className={`die ${diceAnim.isRolling ? 'rolling' : ''}`}>
                    <span className="die-number-faded die-number-left">{diceAnim.values[0]}</span>
                    <DieFace value={diceAnim.values[0]}/>
                  </div>
                  <div className={`die ${diceAnim.isRolling ? 'rolling' : ''}`}>
                    <DieFace value={diceAnim.values[1]}/>
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
          <PlayerPanel players={gameState?.players || []} properties={gameState?.properties || []}
                       currentPlayerId={gameState?.currentPlayerId} myId={playerId}
                       onPropertyClick={setShowProperty} onPlayerClick={setShowPlayerProfile}/>
          <div className="game-log">
            <h4>Game Log</h4>
            <div className="log-entries">
              {gameState?.log?.map((entry, i) => <div key={i} className="log-entry">{entry}</div>)}
            </div>
          </div>
        </div>
      </div>

      <div className="controls-bar">
        {gameState?.status === 'playing' && isCurrentPlayer && !currentPlayerMoving && (
          <>
            {gameState.turnPhase === 'roll' && (
              <button className="btn-control btn-roll" onClick={handleRoll} disabled={diceAnim.isRolling}>
                {diceAnim.isRolling ? '🎲 Rolling...' : gameState?.extraRoll ? '🎲 Roll Again (Doubles!)' : '🎲 Roll Dice'}
              </button>
            )}

            {gameState.turnPhase === 'buy' && (
              <>
                <button className="btn-control btn-buy" onClick={handleBuy}>💰 Buy Property</button>
                <button className="btn-control btn-auction" onClick={handleAuction}>📢 Auction</button>
              </>
            )}

            {gameState.turnPhase === 'auction' && gameState.auction && (() => {
              const hb = gameState.auction.highestBidder;
              const hbName = hb ? gameState.players.find(p => p.id === hb)?.name : null;
              return (
                <div className="auction-bar">
                  <div className="auction-info">
                    <span>📢 Auction: {BOARD_TILES[gameState.auction.propertyId]?.name}</span>
                    <span className="auction-bid">Highest: ${gameState.auction.highestBid}{hbName ? ` by ${hbName}` : ' (No bids)'}</span>
                    <span className={`auction-timer ${auctionTimer <= 3 ? 'urgent' : ''}`}>⏱️ {auctionTimer}s</span>
                  </div>
                  {gameState.auction.activeBidders.includes(playerId) && (
                    <div className="auction-controls">
                      <button className="btn-bid" onClick={() => handleBidFixed(1)}>+$1</button>
                      <button className="btn-bid" onClick={() => handleBidFixed(10)}>+$10</button>
                      <button className="btn-bid" onClick={() => handleBidFixed(100)}>+$100</button>
                      <input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)}
                             placeholder={`Min $${gameState.auction.highestBid + 1}`}
                             min={gameState.auction.highestBid + 1} max={me?.money || 0} className="bid-input"/>
                      <button className="btn-control" onClick={handleBid}
                              disabled={!bidAmount || parseInt(bidAmount) <= gameState.auction.highestBid}>Bid</button>
                    </div>
                  )}
                </div>
              );
            })()}

            {displayCard && (
              <CardModal key={`${displayCard.id}-${displayCard.turnSequence}`}
                         card={displayCard} onResolve={handleResolveCard}/>
            )}

            {currentPlayer?.inJail && gameState.turnPhase === 'roll' && (
              <>
                <button className="btn-control" onClick={handlePayJail}>💵 Pay $50 Fine</button>
                {me?.jailCards > 0 && (
                  <button className="btn-control" onClick={handleUseJailCard}>
                    🎫 Use Jail Card ({me.jailCards})
                  </button>
                )}
              </>
            )}
          </>
        )}

        {gameState?.status === 'playing' && isCurrentPlayer && gameState.turnPhase === 'end' && (
          <>
            <button className="btn-control btn-end" onClick={handleEndTurn}>✅ End Turn</button>
            <button className="btn-control" onClick={() => setShowTrade(true)}>🤝 Trade</button>
          </>
        )}

        {/* REMOVED: Unlock Controls button block */}

        {gameState?.status === 'playing' && !isCurrentPlayer && gameState?.turnPhase === 'auction' && gameState?.auction && (() => {
          const hb = gameState.auction.highestBidder;
          const hbName = hb ? gameState.players.find(p => p.id === hb)?.name : null;
          return (
            <div className="auction-bar">
              <div className="auction-info">
                <span>📢 Auction: {BOARD_TILES[gameState.auction.propertyId]?.name}</span>
                <span className="auction-bid">Highest: ${gameState.auction.highestBid}{hbName ? ` by ${hbName}` : ' (No bids)'}</span>
                <span className={`auction-timer ${auctionTimer <= 3 ? 'urgent' : ''}`}>⏱️ {auctionTimer}s</span>
              </div>
              {gameState.auction.activeBidders.includes(playerId) && (
                <div className="auction-controls">
                  <button className="btn-bid" onClick={() => handleBidFixed(1)}>+$1</button>
                  <button className="btn-bid" onClick={() => handleBidFixed(10)}>+$10</button>
                  <button className="btn-bid" onClick={() => handleBidFixed(100)}>+$100</button>
                  <input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)}
                         placeholder={`Min $${gameState.auction.highestBid + 1}`}
                         min={gameState.auction.highestBid + 1} max={me?.money || 0} className="bid-input"/>
                  <button className="btn-control" onClick={handleBid}
                          disabled={!bidAmount || parseInt(bidAmount) <= gameState.auction.highestBid}>Bid</button>
                </div>
              )}
            </div>
          );
        })()}

        {gameState?.status === 'playing' && !isCurrentPlayer && gameState?.turnPhase !== 'auction' && (
          <div className="waiting-msg">Waiting for {currentPlayer?.name}...</div>
        )}

        {gameState?.status === 'ended' && (
          <div className="game-over">🎉 {gameState.players.find(p => !p.isBankrupt)?.name} Wins!</div>
        )}
      </div>

      {showTrade && (
        <TradeModal players={gameState?.players || []} myId={playerId} myProperties={myProperties}
                    allProperties={gameState?.properties || []} boardTiles={BOARD_TILES}
                    onClose={() => setShowTrade(false)}
                    onPropose={tradeData => {
                      const roomCode = sessionStorage.getItem('roomCode');
                      emit('proposeTrade', { roomCode, fromId: playerId, toId: tradeData.toId,
                        offerProps: tradeData.offerProps, offerMoney: tradeData.offerMoney,
                        requestProps: tradeData.requestProps, requestMoney: tradeData.requestMoney });
                      setShowTrade(false);
                    }}/>
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

      {showPlayerProfile && (
        <PlayerProfileModal playerId={showPlayerProfile} players={gameState?.players || []}
                            properties={gameState?.properties || []} boardTiles={BOARD_TILES}
                            calculateRent={(tileId, diceSum = 7) => calculateRent(tileId, gameState?.properties || [], diceSum)}
                            onClose={() => setShowPlayerProfile(null)}/>
      )}

      {showProperty !== null && (
        <PropertyModal tileId={showProperty} tile={BOARD_TILES[showProperty]}
                       propertyState={getPropertyState(showProperty)}
                       owner={gameState?.players.find(p => p.id === getPropertyState(showProperty)?.ownerId)}
                       isMine={getPropertyState(showProperty)?.ownerId === playerId}
                       isMyTurn={isCurrentPlayer}
                       onClose={() => setShowProperty(null)}
                       onBuild={async () => { const r = sessionStorage.getItem('roomCode'); await emit('buildHouse',       { roomCode: r, playerId, propertyId: showProperty }); }}
                       onSell={async ()  => { const r = sessionStorage.getItem('roomCode'); await emit('sellHouse',        { roomCode: r, playerId, propertyId: showProperty }); }}
                       onMortgage={async () => { const r = sessionStorage.getItem('roomCode'); await emit('mortgageProperty',  { roomCode: r, playerId, propertyId: showProperty }); }}
                       onUnmortgage={async () => { const r = sessionStorage.getItem('roomCode'); await emit('unmortgageProperty',{ roomCode: r, playerId, propertyId: showProperty }); }}/>
      )}
    </div>
  );
}
