import React from 'react';

export default function AuctionModal({ auction, players, myId, bidAmount, setBidAmount, onBid, onEnd }) {
  // This component is now primarily used for reference
  // The main auction UI has been moved inline to GameBoard.js controls bar
  // for better integration with the countdown timer
  
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

  return (
    <div className="auction-bar">
      <div className="auction-info">
        <span>📢 Auction: {tileNames[auction.propertyId]}</span>
        <span className="auction-bid">
          Highest: ${auction.highestBid} {highestBidder ? `by ${highestBidder.name}` : '(No bids)'}
        </span>
      </div>
      {canBid && (
        <div className="auction-controls">
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder={`Min $${auction.highestBid + 1}`}
            min={auction.highestBid + 1}
            max={me?.money || 0}
          />
          <button className="btn-control" onClick={onBid} disabled={!bidAmount || parseInt(bidAmount) <= auction.highestBid}>
            Bid
          </button>
        </div>
      )}
      <button className="btn-control btn-end" onClick={onEnd}>
        End Auction
      </button>
    </div>
  );
}
