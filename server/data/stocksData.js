// In-memory stocks database
let stocksDB = [
  {
    id: 1,
    name: 'Reliance Industries',
    symbol: 'RELIANCE.NS',
    sector: 'Energy',
    price: 2845.60,
    change: 8.45,
    changePercent: '+8.45%',
    volume: '1.2M',
    marketCap: '19.2L Cr',
    high52Week: 3024.90,
    low52Week: 2220.30,
    pe: 28.5,
    lastUpdated: new Date()
  },
  {
    id: 2,
    name: 'TCS',
    symbol: 'TCS.NS',
    sector: 'IT',
    price: 4125.80,
    change: 6.20,
    changePercent: '+6.20%',
    volume: '890K',
    marketCap: '15.1L Cr',
    high52Week: 4592.25,
    low52Week: 3311.00,
    pe: 32.1,
    lastUpdated: new Date()
  },
  {
    id: 3,
    name: 'HDFC Bank',
    symbol: 'HDFCBANK.NS',
    sector: 'Banking',
    price: 1680.95,
    change: 4.85,
    changePercent: '+4.85%',
    volume: '2.1M',
    marketCap: '12.8L Cr',
    high52Week: 1794.90,
    low52Week: 1363.55,
    pe: 19.8,
    lastUpdated: new Date()
  },
  {
    id: 4,
    name: 'Infosys',
    symbol: 'INFY.NS',
    sector: 'IT',
    price: 1920.45,
    change: 3.92,
    changePercent: '+3.92%',
    volume: '1.5M',
    marketCap: '8.2L Cr',
    high52Week: 1953.90,
    low52Week: 1351.65,
    pe: 29.4,
    lastUpdated: new Date()
  },
  {
    id: 5,
    name: 'ITC',
    symbol: 'ITC.NS',
    sector: 'FMCG',
    price: 485.30,
    change: 3.15,
    changePercent: '+3.15%',
    volume: '5.8M',
    marketCap: '6.2L Cr',
    high52Week: 502.75,
    low52Week: 398.40,
    pe: 31.2,
    lastUpdated: new Date()
  },
  {
    id: 6,
    name: 'ICICI Bank',
    symbol: 'ICICIBANK.NS',
    sector: 'Banking',
    price: 1245.80,
    change: 2.15,
    changePercent: '+2.15%',
    volume: '1.8M',
    marketCap: '8.7L Cr',
    high52Week: 1257.65,
    low52Week: 951.00,
    pe: 17.5,
    lastUpdated: new Date()
  },
  {
    id: 7,
    name: 'State Bank of India',
    symbol: 'SBIN.NS',
    sector: 'Banking',
    price: 825.40,
    change: 3.45,
    changePercent: '+3.45%',
    volume: '3.2M',
    marketCap: '7.4L Cr',
    high52Week: 912.10,
    low52Week: 543.20,
    pe: 12.8,
    lastUpdated: new Date()
  },
  {
    id: 8,
    name: 'Bharti Airtel',
    symbol: 'BHARTIARTL.NS',
    sector: 'Telecom',
    price: 1580.95,
    change: -0.85,
    changePercent: '-0.85%',
    volume: '1.1M',
    marketCap: '9.1L Cr',
    high52Week: 1619.00,
    low52Week: 900.05,
    pe: 68.2,
    lastUpdated: new Date()
  }
];

module.exports = {
  getStocks: () => stocksDB,
  getStockById: (id) => stocksDB.find(s => s.id === parseInt(id)),
  updateStock: (id, updates) => {
    const index = stocksDB.findIndex(s => s.id === parseInt(id));
    if (index !== -1) {
      stocksDB[index] = { ...stocksDB[index], ...updates };
      return stocksDB[index];
    }
    return null;
  },
  updateAllStocks: (updateFn) => {
    stocksDB = stocksDB.map(updateFn);
  }
};