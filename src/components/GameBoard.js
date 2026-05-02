import React, { useState, useMemo, useEffect, useRef } from 'react';
import PlayerPanel from './PlayerPanel';
import CardModal from './Modals/CardModal';
import TradeModal from './Modals/TradeModal';
import AuctionModal from './Modals/AuctionModal';
import PropertyModal from './Modals/PropertyModal';
 
const BOARD_TILES = [
  { id: 0, name: "Go", type: "corner" },
  { id: 1, name: "Mediterranean Ave", type: "property", colorGroup: "brown", price: 60 },
  { id: 2, name: "Community Chest", type: "chest" },
  { id: 3, name: "Baltic Ave", type: "property", colorGroup: "brown", price: 60 },
  { id: 4, name: "Income Tax", type: "tax", price: 200 },
  { id: 5, name: "Reading Railroad", type: "railroad", price: 200 },
  { id: 6, name: "Oriental Ave", type: "property", colorGroup: "lightblue", price: 100 },
  { id: 7, name: "Chance", type: "chance" },
  { id: 8, name: "Vermont Ave", type: "property", colorGroup: "lightblue", price: 100 },
  { id: 9, name: "Connecticut Ave", type: "property", colorGroup: "lightblue", price: 120 },
  { id: 10, name: "Jail", type: "corner" },
  { id: 11, name: "St. Charles Place", type: "property", colorGroup: "pink", price: 140 },
  { id: 12, name: "Electric Co", type: "utility", price: 150 },
  { id: 13, name: "States Ave", type: "property", colorGroup: "pink", price: 140 },
  { id: 14, name: "Virginia Ave", type: "property", colorGroup: "pink", price: 160 },
  { id: 15, name: "Penn Railroad", type: "railroad", price: 200 },
  { id: 16, name: "St. James Place", type: "property", colorGroup: "orange", price: 180 },
  { id: 17, name: "Community Chest", type: "chest" },
  { id: 18, name: "Tennessee Ave", type: "property", colorGroup: "orange", price: 180 },
  { id: 19, name: "New York Ave", type: "property", colorGroup: "orange", price: 200 },
  { id: 20, name: "Free Parking", type: "corner" },
  { id: 21, name: "Kentucky Ave", type: "property", colorGroup: "red", price: 220 },
  { id: 22, name: "Chance", type: "chance" },
  { id: 23, name: "Indiana Ave", type: "property", colorGroup: "red", price: 220 },
  { id: 24, name: "Illinois Ave", type: "property", colorGroup: "red", price: 240 },
  { id: 25, name: "B&O Railroad", type: "railroad", price: 200 },
  { id: 26, name: "Atlantic Ave", type: "property", colorGroup: "yellow", price: 260 },
  { id: 27, name: "Ventnor Ave", type: "property", colorGroup: "yellow", price: 260 },
  { id: 28, name: "Water Works", type: "utility", price: 150 },
  { id: 29, name: "Marvin Gardens", type: "property", colorGroup: "yellow", price: 280 },
  { id: 30, name: "Go To Jail", type: "corner" },
  { id: 31, name: "Pacific Ave", type: "property", colorGroup: "green", price: 300 },
  { id: 32, name: "N.C. Ave", type: "property", colorGroup: "green", price: 300 },
  { id: 33, name: "Community Chest", type: "chest" },
  { id: 34, name: "Penn Ave", type: "property", colorGroup: "green", price: 320 },
  { id: 35, name: "Short Line", type: "railroad", price: 200 },
  { id: 36, name: "Chance", type: "chance" },
  { id: 37, name: "Park Place", type: "property", colorGroup: "darkblue", price: 350 },
  { id: 38, name: "Luxury Tax", type: "tax", price: 100 },
  { id: 39, name: "Boardwalk", type: "property", colorGroup: "darkblue", price: 400 }
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
 
const TOKEN_EMOJI = {
  dog: 'https://www.image2url.com/r2/default/files/1777748866437-8b4cadb2-e564-4319-ab5f-819c6830d3f2.png',
  hat: 'https://www.image2url.com/r2/default/images/1777748703721-72fa1fdf-851e-490d-a254-5b640f0310e1.png',
  car: 'https://www.image2url.com/r2/default/images/1777748903874-307a7256-cfe7-4e4c-9d30-e7914c9dc19a.png',
  ship: 'https://www.image2url.com/r2/default/images/1777748945449-a1af7a6c-d806-44ef-b5c5-d16f544d55fc.png'
};
 
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
  return null; // corners
}
 
/* ============================================
   SVG ICONS for non-property tiles
   ============================================ */
 
const TrainIcon = () => (
  <svg viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg" className="tile-svg">
    {/* Track */}
    <line x1="0" y1="62" x2="100" y2="62" stroke="#1a1a1a" strokeWidth="2" />
    {/* Body */}
    <rect x="14" y="26" width="56" height="24" fill="#1a1a1a" />
    {/* Cab */}
    <rect x="48" y="14" width="24" height="14" fill="#1a1a1a" />
    {/* Window */}
    <rect x="53" y="18" width="14" height="7" fill="#fff" />
    {/* Cowcatcher */}
    <polygon points="2,46 14,34 14,52" fill="#1a1a1a" />
    {/* Smokestack */}
    <rect x="22" y="8" width="7" height="20" fill="#1a1a1a" />
    <rect x="19" y="6" width="13" height="5" fill="#1a1a1a" />
    {/* Wheels */}
    <circle cx="22" cy="54" r="6" fill="#1a1a1a" stroke="#888" strokeWidth="1.5" />
    <circle cx="42" cy="54" r="6" fill="#1a1a1a" stroke="#888" strokeWidth="1.5" />
    <circle cx="62" cy="54" r="6" fill="#1a1a1a" stroke="#888" strokeWidth="1.5" />
    {/* Wheel hubs */}
    <circle cx="22" cy="54" r="2" fill="#fff" />
    <circle cx="42" cy="54" r="2" fill="#fff" />
    <circle cx="62" cy="54" r="2" fill="#fff" />
  </svg>
);
 
const BulbIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="tile-svg">
    {/* Rays */}
    <g stroke="#FFB300" strokeWidth="4" strokeLinecap="round">
      <line x1="50" y1="3" x2="50" y2="13" />
      <line x1="18" y1="20" x2="25" y2="27" />
      <line x1="82" y1="20" x2="75" y2="27" />
      <line x1="5" y1="50" x2="15" y2="50" />
      <line x1="85" y1="50" x2="95" y2="50" />
    </g>
    {/* Bulb */}
    <ellipse cx="50" cy="50" rx="24" ry="28" fill="#FFE082" stroke="#1a1a1a" strokeWidth="2.5" />
    {/* Filament */}
    <path d="M 42 48 Q 50 56 58 48" stroke="#FF6F00" strokeWidth="2" fill="none" />
    <line x1="42" y1="48" x2="42" y2="40" stroke="#1a1a1a" strokeWidth="1.5" />
    <line x1="58" y1="48" x2="58" y2="40" stroke="#1a1a1a" strokeWidth="1.5" />
    {/* Base */}
    <rect x="38" y="76" width="24" height="5" fill="#888" stroke="#1a1a1a" strokeWidth="1" />
    <rect x="40" y="81" width="20" height="4" fill="#888" stroke="#1a1a1a" strokeWidth="1" />
    <rect x="42" y="85" width="16" height="4" fill="#666" stroke="#1a1a1a" strokeWidth="1" />
  </svg>
);
 
const FaucetIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="tile-svg">
    {/* Handle top */}
    <circle cx="40" cy="18" r="9" fill="#666" stroke="#1a1a1a" strokeWidth="2" />
    <line x1="32" y1="18" x2="48" y2="18" stroke="#1a1a1a" strokeWidth="2" />
    <line x1="40" y1="10" x2="40" y2="26" stroke="#1a1a1a" strokeWidth="2" />
    {/* Vertical pipe */}
    <rect x="36" y="26" width="8" height="14" fill="#888" stroke="#1a1a1a" strokeWidth="1.5" />
    {/* Horizontal pipe */}
    <rect x="20" y="40" width="50" height="14" fill="#888" stroke="#1a1a1a" strokeWidth="1.5" />
    {/* Spout */}
    <rect x="62" y="54" width="10" height="10" fill="#666" stroke="#1a1a1a" strokeWidth="1.5" />
    {/* Water stream */}
    <rect x="65" y="64" width="4" height="14" fill="#3FA9F5" />
    {/* Water drops */}
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
    {/* Chest body */}
    <rect x="12" y="50" width="76" height="34" fill="#8B4513" stroke="#1a1a1a" strokeWidth="2" />
    {/* Chest lid */}
    <path d="M 12 50 Q 50 22 88 50 Z" fill="#A0522D" stroke="#1a1a1a" strokeWidth="2" />
    {/* Bands */}
    <line x1="12" y1="64" x2="88" y2="64" stroke="#1a1a1a" strokeWidth="2" />
    <line x1="30" y1="36" x2="30" y2="84" stroke="#1a1a1a" strokeWidth="1.5" />
    <line x1="70" y1="36" x2="70" y2="84" stroke="#1a1a1a" strokeWidth="1.5" />
    {/* Lock */}
    <rect x="44" y="58" width="12" height="14" fill="#FFD700" stroke="#1a1a1a" strokeWidth="1.5" />
    <circle cx="50" cy="64" r="2" fill="#1a1a1a" />
    {/* Coin glint */}
    <circle cx="78" cy="44" r="4" fill="#FFD700" stroke="#1a1a1a" strokeWidth="1" />
    <circle cx="22" cy="44" r="3" fill="#FFD700" stroke="#1a1a1a" strokeWidth="1" />
  </svg>
);
 
const DiamondRingIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="tile-svg">
    {/* Ring band */}
    <ellipse cx="50" cy="68" rx="28" ry="22" fill="none" stroke="#FFD700" strokeWidth="6" />
    <ellipse cx="50" cy="68" rx="28" ry="22" fill="none" stroke="#1a1a1a" strokeWidth="1" />
    {/* Diamond */}
    <polygon points="50,15 38,32 50,50 62,32" fill="#B0E0E6" stroke="#1a1a1a" strokeWidth="2" />
    <polygon points="50,15 44,24 50,32 56,24" fill="#fff" />
    <line x1="38" y1="32" x2="62" y2="32" stroke="#1a1a1a" strokeWidth="1.5" />
  </svg>
);
 
const TaxIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="tile-svg">
    {/* Money/dollar bag */}
    <text x="50" y="68" textAnchor="middle" fontSize="62" fontWeight="900"
          fill="#1FB25A" fontFamily="Fredoka, Arial Black, sans-serif"
          stroke="#1a1a1a" strokeWidth="2">$</text>
    {/* Arrow pointing in (to pay) */}
    <path d="M 20 88 L 80 88 L 75 80 M 80 88 L 75 96"
          stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);
 
const CarIcon = () => (
  <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" className="corner-svg">
    {/* Car body */}
    <path d="M 10 50 L 25 30 L 80 30 L 95 50 L 110 50 L 110 60 L 10 60 Z"
          fill="#C5392A" stroke="#1a1a1a" strokeWidth="2" />
    {/* Roof */}
    <path d="M 32 30 L 42 18 L 70 18 L 80 30 Z"
          fill="#C5392A" stroke="#1a1a1a" strokeWidth="2" />
    {/* Windows */}
    <path d="M 36 30 L 44 22 L 56 22 L 56 30 Z" fill="#AAE0FA" stroke="#1a1a1a" strokeWidth="1.5" />
    <path d="M 60 30 L 60 22 L 68 22 L 76 30 Z" fill="#AAE0FA" stroke="#1a1a1a" strokeWidth="1.5" />
    {/* Headlight */}
    <circle cx="98" cy="44" r="3" fill="#FFE082" stroke="#1a1a1a" strokeWidth="1" />
    {/* Wheels */}
    <circle cx="32" cy="62" r="10" fill="#1a1a1a" />
    <circle cx="32" cy="62" r="5" fill="#888" />
    <circle cx="88" cy="62" r="10" fill="#1a1a1a" />
    <circle cx="88" cy="62" r="5" fill="#888" />
  </svg>
);
 
const ArrowIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="corner-svg">
    {/* Big arrow pointing to jail (down-left in this case) */}
    <path d="M 20 30 L 70 30 L 70 15 L 92 50 L 70 85 L 70 70 L 20 70 Z"
          fill="#C5392A" stroke="#1a1a1a" strokeWidth="2.5" />
  </svg>
);
 
const GoArrowIcon = () => (
  <svg viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg" className="go-arrow-svg">
    {/* Long arrow pointing left (toward bottom row direction of play) */}
    <path d="M 5 15 L 18 5 L 18 12 L 95 12 L 95 18 L 18 18 L 18 25 Z"
          fill="#C5392A" stroke="#1a1a1a" strokeWidth="1.5" />
  </svg>
);
 
/* Render an SVG icon based on tile type */
function TileIcon({ tile }) {
  if (tile.type === 'railroad') return <TrainIcon />;
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
 
/* ============================================
   CORNER TILE RENDERING
   ============================================ */
 
function CornerTile({ tile }) {
  if (tile.id === 0) {
    // GO corner
    return (
      <div className="corner-inner corner-go">
        <div className="corner-go-arrow"><GoArrowIcon /></div>
        <div className="corner-go-text">GO</div>
        <div className="corner-go-collect">COLLECT $200 SALARY AS YOU PASS</div>
      </div>
    );
  }
  if (tile.id === 10) {
    // JAIL / Just Visiting — diagonal split, prisoner behind bars
    return (
      <div className="corner-inner corner-jail">
        {/* Outer "Just Visiting" label running along diagonal edge */}
        <div className="jail-just-visiting-label">JUST VISITING</div>
 
        {/* Inner jail cell occupies the inner-corner area (toward board center) */}
        <div className="jail-cell">
          {/* Prisoner SVG behind the bars */}
          <svg className="jail-prisoner" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Head */}
            <circle cx="50" cy="34" r="14" fill="#FFE0BD" stroke="#1a1a1a" strokeWidth="2" />
            {/* Hat brim */}
            <ellipse cx="50" cy="22" rx="18" ry="3" fill="#1a1a1a" />
            {/* Hat top */}
            <rect x="40" y="8" width="20" height="14" fill="#1a1a1a" />
            {/* Mustache */}
            <path d="M 42 38 Q 46 40 50 38 Q 54 40 58 38" stroke="#1a1a1a" strokeWidth="2" fill="none" />
            {/* Eyes */}
            <circle cx="45" cy="32" r="1.5" fill="#1a1a1a" />
            <circle cx="55" cy="32" r="1.5" fill="#1a1a1a" />
            {/* Body / suit */}
            <path d="M 30 50 L 30 95 L 70 95 L 70 50 Q 70 46 60 46 L 40 46 Q 30 46 30 50 Z"
                  fill="#1a1a1a" />
            {/* Shirt collar / white */}
            <polygon points="42,46 50,58 58,46" fill="#fff" stroke="#1a1a1a" strokeWidth="1" />
            {/* Bowtie */}
            <polygon points="46,52 50,55 54,52 54,58 50,55 46,58" fill="#C5392A" stroke="#1a1a1a" strokeWidth="0.5" />
            {/* Hands gripping bars (white gloves) */}
            <ellipse cx="22" cy="62" rx="6" ry="4" fill="#fff" stroke="#1a1a1a" strokeWidth="1.5" />
            <ellipse cx="78" cy="62" rx="6" ry="4" fill="#fff" stroke="#1a1a1a" strokeWidth="1.5" />
          </svg>
 
          {/* Vertical jail bars overlay */}
          <div className="jail-bars-grid">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
 
        {/* "IN JAIL" small label box, sits on top corner */}
        <div className="jail-in-label">IN JAIL</div>
 
        {/* Diagonal divider line */}
        <div className="jail-diagonal"></div>
      </div>
    );
  }
  if (tile.id === 20) {
    // FREE PARKING
    return (
      <div className="corner-inner corner-parking">
        <div className="corner-parking-top">FREE</div>
        <div className="corner-parking-icon"><CarIcon /></div>
        <div className="corner-parking-bottom">PARKING</div>
      </div>
    );
  }
  if (tile.id === 30) {
    // GO TO JAIL
    return (
      <div className="corner-inner corner-gotojail">
        <div className="corner-gotojail-top">GO TO</div>
        <div className="corner-gotojail-icon"><ArrowIcon /></div>
        <div className="corner-gotojail-bottom">JAIL</div>
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
  const prevPositionsRef = useRef({});
 
  // Track player position changes and trigger hop animation
  useEffect(() => {
    if (!gameState?.players) return;
    const prev = prevPositionsRef.current;
    const newHopping = {};
    
    gameState.players.forEach(player => {
      if (prev[player.id] !== undefined && prev[player.id] !== player.position) {
        newHopping[player.id] = true;
      }
    });
 
    if (Object.keys(newHopping).length > 0) {
      setHoppingTokens(newHopping);
      const timer = setTimeout(() => setHoppingTokens({}), 700);
      // Update prev positions after setting hopping
      const updated = {};
      gameState.players.forEach(p => { updated[p.id] = p.position; });
      prevPositionsRef.current = updated;
      return () => clearTimeout(timer);
    }
 
    // Update prev positions
    const updated = {};
    gameState.players.forEach(p => { updated[p.id] = p.position; });
    prevPositionsRef.current = updated;
  }, [gameState?.players]);
 
  const isCurrentPlayer = gameState?.currentPlayerId === playerId;
  const me = gameState?.players.find(p => p.id === playerId);
  const currentPlayer = gameState?.players.find(p => p.id === gameState?.currentPlayerId);
 
  const myProperties = useMemo(() => {
    if (!gameState || !me) return [];
    return gameState.properties.filter(p => p.ownerId === playerId);
  }, [gameState, playerId]);
 
  const handleRoll = async () => {
    const roomCode = sessionStorage.getItem('roomCode');
    await emit('rollDice', { roomCode, playerId, turnSequence: gameState.turnSequence });
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
    return gameState?.players.filter(p => p.position === tileId && !p.isBankrupt) || [];
  };
 
  const getPropertyState = (tileId) => {
    return gameState?.properties.find(p => p.id === tileId);
  };
 
  return (
    <div className="game-container">
      {/* Top Bar */}
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
        {/* Board */}
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
 
              // CORNER TILES (Go, Jail, Free Parking, Go To Jail)
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
 
              // REGULAR TILES (properties, railroads, utilities, chance, chest, tax)
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
                  {tile.colorGroup && (
                    <div
                      className="color-bar"
                      style={{ backgroundColor: COLOR_MAP[tile.colorGroup] }}
                    />
                  )}
 
                  <div className="tile-content">
                    {/* Property name - rotated to face inward based on side */}
                    <div className="tile-name-wrap">
                      <span className="tile-name">{tile.name}</span>
                    </div>
 
                    {/* Icon for non-property tiles (centered) */}
                    {hasIcon && (
                      <div className="tile-icon-wrap">
                        <TileIcon tile={tile} />
                      </div>
                    )}
 
                    {/* Owner indicator */}
                    {propState?.ownerId && (
                      <div
                        className="owner-dot"
                        style={{ backgroundColor: owner?.color || '#999' }}
                      />
                    )}
 
                    {/* Houses/hotel indicator */}
                    {propState?.houses > 0 && (
                      <div className="houses-indicator">
                        {Array(propState.houses).fill('🏠').join('')}
                      </div>
                    )}
                    {propState?.hotel && <div className="hotel-indicator">🏨</div>}
 
                    {/* Tokens (players on tile) */}
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
 
                  {/* Price - positioned at outer edge of tile (opposite of color bar) */}
                  {tile.price && (
                    <div className="tile-price-edge">${tile.price}</div>
                  )}
                </div>
              );
            })}
 
            {/* Center Area */}
            <div className="board-center">
              <span className="board-center-title">MONOPOLY</span>
 
              {/* Chance Deck (top-left of center, angled) */}
              <div className="card-deck card-deck-chance">
                <div className="card-deck-stack">
                  <div className="card-back card-back-3"></div>
                  <div className="card-back card-back-2"></div>
                  <div className="card-back card-back-1">
                    <div className="card-back-label">CHANCE</div>
                    <div className="card-back-icon">?</div>
                  </div>
                </div>
              </div>
 
              {/* Community Chest Deck (bottom-right of center, angled) */}
              <div className="card-deck card-deck-chest">
                <div className="card-deck-stack">
                  <div className="card-back card-back-chest-3"></div>
                  <div className="card-back card-back-chest-2"></div>
                  <div className="card-back card-back-chest-1">
                    <div className="card-back-label-chest">COMMUNITY CHEST</div>
                    <div className="card-back-icon-chest">
                      <ChestIcon />
                    </div>
                  </div>
                </div>
              </div>
 
              <div className="dice-area">
                {gameState?.dice && (
                  <div className="dice">
                    <span className="die">{gameState.dice[0]}</span>
                    <span className="die">{gameState.dice[1]}</span>
                  </div>
                )}
              </div>
              <div className="free-parking">
                💰 Free Parking: ${gameState?.freeParkingMoney || 0}
              </div>
            </div>
          </div>
        </div>
 
        {/* Side Panel */}
        <div className="side-panel">
          <PlayerPanel
            players={gameState?.players || []}
            properties={gameState?.properties || []}
            currentPlayerId={gameState?.currentPlayerId}
            myId={playerId}
            onPropertyClick={setShowProperty}
          />
 
          {/* Game Log */}
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
 
      {/* Controls */}
      <div className="controls-bar">
        {gameState?.status === 'playing' && isCurrentPlayer && (
          <>
            {gameState.turnPhase === 'roll' && (
              <button className="btn-control btn-roll" onClick={handleRoll}>
                🎲 Roll Dice
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
 
      {/* Modals */}
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
