// In-memory ETFs database
let etfsDB = [
  {
    id: 1,
    name: 'HDFC NIFTY 50 ETF',
    symbol: 'HDFCNIFETF.NS',
    type: 'Equity',
    price: 185.45,
    change: 1.2,
    changePercent: '+1.2%',
    aum: '5,420 Cr',
    expenseRatio: 0.05,
    trackingError: 0.02,
    lastUpdated: new Date()
  },
  {
    id: 2,
    name: 'SBI Gold ETF',
    symbol: 'GOLDSHARE.NS',
    type: 'Gold',
    price: 6250.80,
    change: 0.8,
    changePercent: '+0.8%',
    aum: '2,850 Cr',
    expenseRatio: 0.75,
    trackingError: 0.15,
    lastUpdated: new Date()
  },
  {
    id: 3,
    name: 'Nippon India ETF Bank BeES',
    symbol: 'BANKBEES.NS',
    type: 'Banking',
    price: 485.30,
    change: 2.1,
    changePercent: '+2.1%',
    aum: '3,640 Cr',
    expenseRatio: 0.15,
    trackingError: 0.05,
    lastUpdated: new Date()
  },
  {
    id: 4,
    name: 'HDFC Sensex ETF',
    symbol: 'HDFCSENSEX.NS',
    type: 'Equity',
    price: 785.20,
    change: 1.5,
    changePercent: '+1.5%',
    aum: '1,250 Cr',
    expenseRatio: 0.07,
    trackingError: 0.03,
    lastUpdated: new Date()
  }
];

module.exports = {
  getETFs: () => etfsDB,
  getETFById: (id) => etfsDB.find(e => e.id === parseInt(id)),
  updateETF: (id, updates) => {
    const index = etfsDB.findIndex(e => e.id === parseInt(id));
    if (index !== -1) {
      etfsDB[index] = { ...etfsDB[index], ...updates };
      return etfsDB[index];
    }
    return null;
  },
  updateAllETFs: (updateFn) => {
    etfsDB = etfsDB.map(updateFn);
  }
};