import React, { useState, useEffect, useRef } from 'react';

export default function AuctionModal({ auction, players, myId, bidAmount, setBidAmount, onBid, onEnd }) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [lastBid, setLastBid] = useState(auction.highestBid);
  const timerRef = useRef(null);
  const tileNames = [
    "START","Rio de Janeiro","Treasure","Sao Paulo","Earnings Tax",
    "YYZ Airport","Montreal","Surprise","Vancouver","Toronto",
    "Prison","Venice","Electric Co","Milan","Rome",
    "CDG Airport","Nice","Treasure","Lyon","Paris",
    "Vacation","Manchester","Surprise","Birmingham","London",
    "HND Airport","Kyoto","Osaka","Water Works","Tokyo",
    "Go to Prison","Chongqing","Shanghai","Treasure","Beijing",
    "JFK Airport","Surprise","Chicago","Premium Tax","New York"
  ];

  const highestBidder = players.find(p => p.id === auction.highestBidder);
  const canBid = auction.activeBidders.includes(myId);
  const me = players.find(p => p.id === myId);

  // Reset timer when highest bid changes
  useEffect(() => {
    if (auction.highestBid !== lastBid) {
      setLastBid(auction.highestBid);
      setTimeLeft(10);
    }
  }, [auction.highestBid, lastBid]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft]);

  // Quick bid with fixed increments
  const handleQuickBid = (increment) => {
    const newAmount = auction.highestBid + increment;
    setBidAmount(newAmount.toString());
  };

  // Handle manual bid submission
  const handleBid = () => {
    const amount = parseInt(bidAmount);
    if (!amount || amount <= auction.highestBid) return;
    onBid();
    setBidAmount('');
  };

  // Validate manual input
  const isValidBid = () => {
    const amount = parseInt(bidAmount);
    return amount && amount > auction.highestBid && amount <= (me?.money || 0);
  };

  return (
    <div className="auction-bar">
      <div className="auction-info">
        <span>📢 Auction: {tileNames[auction.propertyId]}</span>
        <span className="auction-bid">
          Highest: ${auction.highestBid} {highestBidder ? `by ${highestBidder.name}` : '(No bids)'}
        </span>
        {/* Countdown Timer */}
        <div className={`auction-timer ${timeLeft <= 3 ? 'timer-warning' : ''}`}>
          ⏱️ {timeLeft}s
        </div>
      </div>

      {canBid && (
        <div className="auction-controls">
          {/* Quick Bid Buttons */}
          <div className="quick-bid-buttons">
            <button
              className="btn-quick-bid"
              onClick={() => handleQuickBid(1)}
              disabled={auction.highestBid + 1 > me?.money}
            >
              +$1
            </button>
            <button
              className="btn-quick-bid"
              onClick={() => handleQuickBid(10)}
              disabled={auction.highestBid + 10 > me?.money}
            >
              +$10
            </button>
            <button
              className="btn-quick-bid"
              onClick={() => handleQuickBid(100)}
              disabled={auction.highestBid + 100 > me?.money}
            >
              +$100
            </button>
          </div>

          {/* Manual Bid Input */}
          <div className="manual-bid-input">
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Min $${auction.highestBid + 1}`}
              min={auction.highestBid + 1}
              max={me?.money || 0}
            />
            <button
              className="btn-control"
              onClick={handleBid}
              disabled={!isValidBid()}
            >
              Bid
            </button>
          </div>
        </div>
      )}

      <button className="btn-control btn-end" onClick={onEnd}>
        End Auction
      </button>
    </div>
  );
}
