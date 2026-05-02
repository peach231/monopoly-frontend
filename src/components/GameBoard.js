import React, { useState, useMemo } from 'react';
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

export default function GameBoard({ gameState, playerId, emit, onStartGame, getShareLink }) {
  const [showTrade, setShowTrade] = useState(false);
  const [showProperty, setShowProperty] = useState(null);
  const [copied, setCopied] = useState(false);
  const [bidAmount, setBidAmount] = useState('');

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

              return (
                <div
                  key={tile.id}
                  className={`tile tile-${tile.type} ${isCorner ? 'tile-corner' : ''}`}
                  style={{
                    gridRow: pos.gridRow,
                    gridColumn: pos.gridColumn,
                    ...(tile.colorGroup ? { borderTop: `4px solid ${COLOR_MAP[tile.colorGroup]}` } : {})
                  }}
                  onClick={() => {
                    if (tile.type === 'property' || tile.type === 'railroad' || tile.type === 'utility') {
                      setShowProperty(tile.id);
                    }
                  }}
                >
                  <div className="tile-content">
                    <span className="tile-name">{tile.name}</span>
                    {tile.price && <span className="tile-price">${tile.price}</span>}
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
                  </div>
                  <div className="tile-tokens">
                    {playersHere.map((p, i) => (
                      <span
                        key={p.id}
                        className="token"
                        style={{
                          backgroundColor: p.color,
                          transform: `translate(${(i % 2) * 12 - 6}px, ${Math.floor(i / 2) * 12 - 6}px)`
                        }}
                        title={p.name}
                      >
                        {TOKEN_EMOJI[p.token] || '●'}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Center Area */}
            <div className="board-center">
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
