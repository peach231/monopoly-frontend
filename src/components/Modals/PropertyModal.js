import React from 'react';
 
const BOARD_TILES = [
  { id: 0, name: "Go" },
  { id: 1, name: "Mediterranean Ave", colorGroup: "brown", price: 60, rent: [2,10,30,90,160,250], houseCost: 50, mortgageValue: 30 },
  { id: 2, name: "Community Chest" },
  { id: 3, name: "Baltic Ave", colorGroup: "brown", price: 60, rent: [4,20,60,180,320,450], houseCost: 50, mortgageValue: 30 },
  { id: 4, name: "Income Tax" },
  { id: 5, name: "Reading Railroad", price: 200, mortgageValue: 100 },
  { id: 6, name: "Oriental Ave", colorGroup: "lightblue", price: 100, rent: [6,30,90,270,400,550], houseCost: 50, mortgageValue: 50 },
  { id: 7, name: "Chance" },
  { id: 8, name: "Vermont Ave", colorGroup: "lightblue", price: 100, rent: [6,30,90,270,400,550], houseCost: 50, mortgageValue: 50 },
  { id: 9, name: "Connecticut Ave", colorGroup: "lightblue", price: 120, rent: [8,40,100,300,450,600], houseCost: 50, mortgageValue: 60 },
  { id: 10, name: "Jail" },
  { id: 11, name: "St. Charles Place", colorGroup: "pink", price: 140, rent: [10,50,150,450,625,750], houseCost: 100, mortgageValue: 70 },
  { id: 12, name: "Electric Co", price: 150, mortgageValue: 75 },
  { id: 13, name: "States Ave", colorGroup: "pink", price: 140, rent: [10,50,150,450,625,750], houseCost: 100, mortgageValue: 70 },
  { id: 14, name: "Virginia Ave", colorGroup: "pink", price: 160, rent: [12,60,180,500,700,900], houseCost: 100, mortgageValue: 80 },
  { id: 15, name: "Penn Railroad", price: 200, mortgageValue: 100 },
  { id: 16, name: "St. James Place", colorGroup: "orange", price: 180, rent: [14,70,200,550,750,950], houseCost: 100, mortgageValue: 90 },
  { id: 17, name: "Community Chest" },
  { id: 18, name: "Tennessee Ave", colorGroup: "orange", price: 180, rent: [14,70,200,550,750,950], houseCost: 100, mortgageValue: 90 },
  { id: 19, name: "New York Ave", colorGroup: "orange", price: 200, rent: [16,80,220,600,800,1000], houseCost: 100, mortgageValue: 100 },
  { id: 20, name: "Free Parking" },
  { id: 21, name: "Kentucky Ave", colorGroup: "red", price: 220, rent: [18,90,250,700,875,1050], houseCost: 150, mortgageValue: 110 },
  { id: 22, name: "Chance" },
  { id: 23, name: "Indiana Ave", colorGroup: "red", price: 220, rent: [18,90,250,700,875,1050], houseCost: 150, mortgageValue: 110 },
  { id: 24, name: "Illinois Ave", colorGroup: "red", price: 240, rent: [20,100,300,750,925,1100], houseCost: 150, mortgageValue: 120 },
  { id: 25, name: "B&O Railroad", price: 200, mortgageValue: 100 },
  { id: 26, name: "Atlantic Ave", colorGroup: "yellow", price: 260, rent: [22,110,330,800,975,1150], houseCost: 150, mortgageValue: 130 },
  { id: 27, name: "Ventnor Ave", colorGroup: "yellow", price: 260, rent: [22,110,330,800,975,1150], houseCost: 150, mortgageValue: 130 },
  { id: 28, name: "Water Works", price: 150, mortgageValue: 75 },
  { id: 29, name: "Marvin Gardens", colorGroup: "yellow", price: 280, rent: [24,120,360,850,1025,1200], houseCost: 150, mortgageValue: 140 },
  { id: 30, name: "Go To Jail" },
  { id: 31, name: "Pacific Ave", colorGroup: "green", price: 300, rent: [26,130,390,900,1100,1275], houseCost: 200, mortgageValue: 150 },
  { id: 32, name: "N.C. Ave", colorGroup: "green", price: 300, rent: [26,130,390,900,1100,1275], houseCost: 200, mortgageValue: 150 },
  { id: 33, name: "Community Chest" },
  { id: 34, name: "Penn Ave", colorGroup: "green", price: 320, rent: [28,150,450,1000,1200,1400], houseCost: 200, mortgageValue: 160 },
  { id: 35, name: "Short Line", price: 200, mortgageValue: 100 },
  { id: 36, name: "Chance" },
  { id: 37, name: "Park Place", colorGroup: "darkblue", price: 350, rent: [35,175,500,1100,1300,1500], houseCost: 200, mortgageValue: 175 },
  { id: 38, name: "Luxury Tax" },
  { id: 39, name: "Boardwalk", colorGroup: "darkblue", price: 400, rent: [50,200,600,1400,1700,2000], houseCost: 200, mortgageValue: 200 }
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
 
export default function PropertyModal({ tileId, tile, propertyState, owner, isMine, isMyTurn, onClose, onBuild, onSell, onMortgage, onUnmortgage }) {
  if (!tile) return null;
 
  const isProperty = tile.type === 'property';
  const isRailroad = tile.type === 'railroad';
  const isUtility = tile.type === 'utility';
 
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal property-modal" onClick={(e) => e.stopPropagation()}>
        <div
          className="property-header"
          style={{ backgroundColor: tile.colorGroup ? COLOR_MAP[tile.colorGroup] : '#555' }}
        >
          <h3>{tile.name}</h3>
          {tile.price && <span className="property-price">${tile.price}</span>}
        </div>
 
        <div className="property-body">
          {propertyState?.ownerId && (
            <div className="property-owner">
              Owner: <span style={{ color: owner?.color }}>{owner?.name || 'Unknown'}</span>
              {propertyState.isMortgaged && <span className="mortgaged-badge">🔒 Mortgaged</span>}
            </div>
          )}
 
          {isProperty && tile.rent && (
            <div className="rent-table">
              <div className="rent-row"><span>Base Rent</span><span>${tile.rent[0]}</span></div>
              <div className="rent-row"><span>With Monopoly</span><span>${tile.rent[0] * 2}</span></div>
              <div className="rent-row"><span>1 House</span><span>${tile.rent[1]}</span></div>
              <div className="rent-row"><span>2 Houses</span><span>${tile.rent[2]}</span></div>
              <div className="rent-row"><span>3 Houses</span><span>${tile.rent[3]}</span></div>
              <div className="rent-row"><span>4 Houses</span><span>${tile.rent[4]}</span></div>
              <div className="rent-row"><span>Hotel</span><span>${tile.rent[5]}</span></div>
              <div className="rent-row rent-total">
                <span>House Cost</span><span>${tile.houseCost} each</span>
              </div>
              <div className="rent-row">
                <span>Mortgage Value</span><span>${tile.mortgageValue}</span>
              </div>
            </div>
          )}
 
          {isRailroad && (
            <div className="rent-table">
              <div className="rent-row"><span>1 Railroad</span><span>$25</span></div>
              <div className="rent-row"><span>2 Railroads</span><span>$50</span></div>
              <div className="rent-row"><span>3 Railroads</span><span>$100</span></div>
              <div className="rent-row"><span>4 Railroads</span><span>$200</span></div>
              <div className="rent-row"><span>Mortgage Value</span><span>${tile.mortgageValue}</span></div>
            </div>
          )}
 
          {isUtility && (
            <div className="rent-table">
              <div className="rent-row"><span>1 Utility</span><span>4x dice roll</span></div>
              <div className="rent-row"><span>2 Utilities</span><span>10x dice roll</span></div>
              <div className="rent-row"><span>Mortgage Value</span><span>${tile.mortgageValue}</span></div>
            </div>
          )}
 
          {propertyState?.houses > 0 && (
            <div className="houses-display">
              Houses: {Array(propertyState.houses).fill('🏠').join('')}
            </div>
          )}
          {propertyState?.hotel && (
            <div className="hotel-display">🏨 Hotel Built</div>
          )}
        </div>
 
        {isMine && (
          <div className="property-actions">
            {isProperty && !propertyState.isMortgaged && (
              <>
                <button className="btn-action" onClick={onBuild}>🏗️ Build House/Hotel</button>
                {(propertyState.houses > 0 || propertyState.hotel) && (
                  <button className="btn-action btn-sell" onClick={onSell}>💰 Sell House</button>
                )}
              </>
            )}
            {!propertyState.isMortgaged && !propertyState.houses && !propertyState.hotel && (
              <button className="btn-action btn-mortgage" onClick={onMortgage}>🔒 Mortgage</button>
            )}
            {propertyState.isMortgaged && (
              <button className="btn-action btn-unmortgage" onClick={onUnmortgage}>🔓 Unmortgage (${Math.ceil(tile.mortgageValue * 1.1)})</button>
            )}
          </div>
        )}
 
        <button className="btn-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
