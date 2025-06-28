// Market indices data
let marketIndices = [
  { name: 'NIFTY 50', value: '23,850.60', change: '+245.30', percent: '+1.04%', positive: true },
  { name: 'SENSEX', value: '78,540.20', change: '+820.45', percent: '+1.06%', positive: true },
  { name: 'BANK NIFTY', value: '52,140.80', change: '-125.40', percent: '-0.24%', positive: false },
  { name: 'NIFTY IT', value: '42,680.95', change: '+312.50', percent: '+0.74%', positive: true },
  { name: 'APT/USD', value: '$12.45', change: '+0.85', percent: '+7.32%', positive: true },
  { name: 'NIFTY PHARMA', value: '18,920.45', change: '+156.80', percent: '+0.84%', positive: true }
];

module.exports = {
  getMarketIndices: () => marketIndices,
  updateMarketIndices: (newIndices) => {
    marketIndices = newIndices;
  }
};