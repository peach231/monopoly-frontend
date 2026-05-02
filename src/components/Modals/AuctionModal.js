import React from 'react';

export default function AuctionModal({ auction, players, myId, bidAmount, setBidAmount, onBid, onEnd }) {
  const tileNames = [
    "Go","Mediterranean Ave","Community Chest","Baltic Ave","Income Tax",
    "Reading Railroad","Oriental Ave","Chance","Vermont Ave","Connecticut Ave",
    "Jail","St. Charles Place","Electric Co","States Ave","Virginia Ave",
    "Penn Railroad","St. James Place","Community Chest","Tennessee Ave","New York Ave",
    "Free Parking","Kentucky Ave","Chance","Indiana Ave","Illinois Ave",
    "B&O Railroad","Atlantic Ave","Ventnor Ave","Water Works","Marvin Gardens",
    "Go To Jail","Pacific Ave","N.C. Ave","Community Chest","Penn Ave",
    "Short Line","Chance","Park Place","Luxury Tax","Boardwalk"
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
