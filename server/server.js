const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const yahooFinance = require('yahoo-finance2').default;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with actual database in production)
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

let mutualFundsDB = [
  {
    id: 1,
    name: 'Axis Bluechip Fund',
    category: 'Large Cap',
    nav: 65.48,
    change: 1.2,
    changePercent: '+1.2%',
    returns1y: '18.5%',
    returns3y: '15.2%',
    returns5y: '12.8%',
    rating: 5,
    aum: '15,420 Cr',
    expenseRatio: 1.8,
    minSip: 100,
    exitLoad: '1% if redeemed within 1 year',
    lastUpdated: new Date()
  },
  {
    id: 2,
    name: 'Mirae Asset Large Cap Fund',
    category: 'Large Cap',
    nav: 112.85,
    change: 0.8,
    changePercent: '+0.8%',
    returns1y: '16.8%',
    returns3y: '14.5%',
    returns5y: '11.9%',
    rating: 4,
    aum: '12,850 Cr',
    expenseRatio: 1.5,
    minSip: 100,
    exitLoad: '1% if redeemed within 1 year',
    lastUpdated: new Date()
  },
  {
    id: 3,
    name: 'SBI Small Cap Fund',
    category: 'Small Cap',
    nav: 185.62,
    change: 2.1,
    changePercent: '+2.1%',
    returns1y: '25.4%',
    returns3y: '22.8%',
    returns5y: '18.5%',
    rating: 5,
    aum: '8,640 Cr',
    expenseRatio: 2.1,
    minSip: 500,
    exitLoad: '1% if redeemed within 1 year',
    lastUpdated: new Date()
  },
  {
    id: 4,
    name: 'HDFC Mid-Cap Opportunities',
    category: 'Mid Cap',
    nav: 148.96,
    change: 1.5,
    changePercent: '+1.5%',
    returns1y: '21.2%',
    returns3y: '18.6%',
    returns5y: '15.4%',
    rating: 4,
    aum: '18,520 Cr',
    expenseRatio: 1.9,
    minSip: 100,
    exitLoad: '1% if redeemed within 1 year',
    lastUpdated: new Date()
  },
  {
    id: 5,
    name: 'Parag Parikh Flexi Cap',
    category: 'Flexi Cap',
    nav: 78.42,
    change: 0.9,
    changePercent: '+0.9%',
    returns1y: '19.8%',
    returns3y: '16.9%',
    returns5y: '14.2%',
    rating: 5,
    aum: '22,140 Cr',
    expenseRatio: 1.6,
    minSip: 1000,
    exitLoad: '1% if redeemed within 1 year',
    lastUpdated: new Date()
  },
  {
    id: 6,
    name: 'UTI Nifty Index Fund',
    category: 'Index',
    nav: 24.85,
    change: 1.0,
    changePercent: '+1.0%',
    returns1y: '17.2%',
    returns3y: '14.8%',
    returns5y: '12.1%',
    rating: 4,
    aum: '9,850 Cr',
    expenseRatio: 0.1,
    minSip: 100,
    exitLoad: 'Nil',
    lastUpdated: new Date()
  }
];

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

let bankDepositsDB = [
  {
    id: 1,
    bank: 'HDFC Bank',
    type: 'FD',
    rate: 7.25,
    minAmount: 10000,
    tenure: '1-5 years',
    rating: 'AAA',
    features: ['Auto-renewal', 'Loan against FD', 'Premature withdrawal'],
    compounding: 'Quarterly',
    taxSaving: false,
    lastUpdated: new Date()
  },
  {
    id: 2,
    bank: 'ICICI Bank',
    type: 'FD',
    rate: 7.15,
    minAmount: 10000,
    tenure: '1-5 years',
    rating: 'AAA',
    features: ['Flexible tenure', 'Online booking', 'Mobile banking'],
    compounding: 'Quarterly',
    taxSaving: false,
    lastUpdated: new Date()
  },
  {
    id: 3,
    bank: 'SBI',
    type: 'FD',
    rate: 6.80,
    minAmount: 1000,
    tenure: '1-10 years',
    rating: 'AAA',
    features: ['Senior citizen benefits', 'Tax saving', 'Branch network'],
    compounding: 'Quarterly',
    taxSaving: true,
    lastUpdated: new Date()
  },
  {
    id: 4,
    bank: 'Axis Bank',
    type: 'FD',
    rate: 7.35,
    minAmount: 10000,
    tenure: '1-5 years',
    rating: 'AA+',
    features: ['High returns', 'Quick processing', 'Digital FD'],
    compounding: 'Quarterly',
    taxSaving: false,
    lastUpdated: new Date()
  },
  {
    id: 5,
    bank: 'Kotak Mahindra Bank',
    type: 'FD',
    rate: 7.40,
    minAmount: 25000,
    tenure: '1-5 years',
    rating: 'AA+',
    features: ['Premium rates', 'Digital FD', 'Wealth management'],
    compounding: 'Quarterly',
    taxSaving: false,
    lastUpdated: new Date()
  },
  {
    id: 6,
    bank: 'IndusInd Bank',
    type: 'FD',
    rate: 7.50,
    minAmount: 10000,
    tenure: '1-5 years',
    rating: 'AA',
    features: ['Highest rates', 'Flexible options', 'Premium banking'],
    compounding: 'Quarterly',
    taxSaving: false,
    lastUpdated: new Date()
  },
  {
    id: 7,
    bank: 'HDFC Bank',
    type: 'RD',
    rate: 6.75,
    minAmount: 100,
    tenure: '1-10 years',
    rating: 'AAA',
    features: ['Monthly deposits', 'Auto-debit', 'Flexible tenure'],
    compounding: 'Quarterly',
    taxSaving: false,
    lastUpdated: new Date()
  },
  {
    id: 8,
    bank: 'ICICI Bank',
    type: 'RD',
    rate: 6.65,
    minAmount: 100,
    tenure: '1-10 years',
    rating: 'AAA',
    features: ['Flexible deposits', 'Online management', 'Mobile alerts'],
    compounding: 'Quarterly',
    taxSaving: false,
    lastUpdated: new Date()
  },
  {
    id: 9,
    bank: 'SBI',
    type: 'RD',
    rate: 6.30,
    minAmount: 10,
    tenure: '1-20 years',
    rating: 'AAA',
    features: ['Low minimum', 'Long tenure', 'Branch support'],
    compounding: 'Quarterly',
    taxSaving: false,
    lastUpdated: new Date()
  },
  {
    id: 10,
    bank: 'IndusInd Bank',
    type: 'RD',
    rate: 7.00,
    minAmount: 100,
    tenure: '1-10 years',
    rating: 'AA',
    features: ['Best rates', 'Flexible tenure', 'Premium service'],
    compounding: 'Quarterly',
    taxSaving: false,
    lastUpdated: new Date()
  }
];

let preIPODB = [
  {
    id: 1,
    name: 'ByteDance',
    sector: 'Technology',
    valuation: '$140B',
    minInvestment: '$1,000',
    expectedIPO: 'Q2 2024',
    description: 'Parent company of TikTok and other social media platforms',
    tokenPrice: 50,
    totalTokens: '2.8B',
    availableTokens: '50M',
    investors: 15420,
    growth: '+25%',
    logo: 'BD',
    riskLevel: 'High',
    lockInPeriod: '12 months',
    aptosContractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    lastUpdated: new Date()
  },
  {
    id: 2,
    name: 'SpaceX',
    sector: 'Aerospace',
    valuation: '$180B',
    minInvestment: '$2,500',
    expectedIPO: 'Q4 2024',
    description: 'Private space exploration and satellite internet company',
    tokenPrice: 125,
    totalTokens: '1.44B',
    availableTokens: '20M',
    investors: 8750,
    growth: '+45%',
    logo: 'SX',
    riskLevel: 'High',
    lockInPeriod: '18 months',
    aptosContractAddress: '0x2345678901bcdef12345678901bcdef123456789',
    lastUpdated: new Date()
  },
  {
    id: 3,
    name: 'Stripe',
    sector: 'Fintech',
    valuation: '$95B',
    minInvestment: '$500',
    expectedIPO: 'Q1 2024',
    description: 'Online payment processing platform for businesses',
    tokenPrice: 75,
    totalTokens: '1.27B',
    availableTokens: '30M',
    investors: 12300,
    growth: '+18%',
    logo: 'ST',
    riskLevel: 'Medium',
    lockInPeriod: '12 months',
    aptosContractAddress: '0x3456789012cdef123456789012cdef1234567890',
    lastUpdated: new Date()
  },
  {
    id: 4,
    name: 'Discord',
    sector: 'Technology',
    valuation: '$15B',
    minInvestment: '$250',
    expectedIPO: 'Q3 2024',
    description: 'Voice, video and text communication service for communities',
    tokenPrice: 25,
    totalTokens: '600M',
    availableTokens: '40M',
    investors: 22100,
    growth: '+32%',
    logo: 'DC',
    riskLevel: 'Medium',
    lockInPeriod: '12 months',
    aptosContractAddress: '0x456789013def12345678913def12345678901a',
    lastUpdated: new Date()
  },
  {
    id: 5,
    name: 'Canva',
    sector: 'Technology',
    valuation: '$40B',
    minInvestment: '$300',
    expectedIPO: 'Q2 2024',
    description: 'Online graphic design platform with drag-and-drop interface',
    tokenPrice: 35,
    totalTokens: '1.14B',
    availableTokens: '25M',
    investors: 18600,
    growth: '+28%',
    logo: 'CV',
    riskLevel: 'Medium',
    lockInPeriod: '12 months',
    aptosContractAddress: '0x56789014ef123456789014ef123456789012b',
    lastUpdated: new Date()
  },
  {
    id: 6,
    name: 'Databricks',
    sector: 'Technology',
    valuation: '$43B',
    minInvestment: '$1,000',
    expectedIPO: 'Q1 2024',
    description: 'Data analytics platform for big data and machine learning',
    tokenPrice: 85,
    totalTokens: '506M',
    availableTokens: '15M',
    investors: 6800,
    growth: '+22%',
    logo: 'DB',
    riskLevel: 'High',
    lockInPeriod: '18 months',
    aptosContractAddress: '0x6789015f123456789015f123456789012c',
    lastUpdated: new Date()
  }
];

// Portfolio data for demo
let portfolioData = {
  'DEMO123456': {
    totalValue: 633615,
    totalInvestment: 525000,
    totalGains: 108615,
    returns: '+20.69%',
    holdings: [
      {
        id: 1,
        name: 'Reliance Industries',
        type: 'Stock',
        quantity: 50,
        avgPrice: 2650,
        currentPrice: 2845,
        value: 142250,
        gain: '+7.36%',
        positive: true
      },
      {
        id: 2,
        name: 'HDFC Bank',
        type: 'Stock',
        quantity: 25,
        avgPrice: 1580,
        currentPrice: 1680,
        value: 42000,
        gain: '+6.33%',
        positive: true
      },
      {
        id: 3,
        name: 'Axis Bluechip Fund',
        type: 'Mutual Fund',
        units: 1250.5,
        nav: 65.48,
        value: 81865,
        gain: '+12.5%',
        positive: true
      },
      {
        id: 4,
        name: 'HDFC Bank FD',
        type: 'Bank Deposit',
        amount: 50000,
        rate: '7.25%',
        value: 52500,
        gain: '+5.0%',
        positive: true
      },
      {
        id: 5,
        name: 'ByteDance Tokens',
        type: 'Pre-IPO',
        tokens: 100,
        price: '$50',
        value: 415000,
        gain: '+25%',
        positive: true
      }
    ]
  }
};

// Market indices data
let marketIndices = [
  { name: 'NIFTY 50', value: '23,850.60', change: '+245.30', percent: '+1.04%', positive: true },
  { name: 'SENSEX', value: '78,540.20', change: '+820.45', percent: '+1.06%', positive: true },
  { name: 'BANK NIFTY', value: '52,140.80', change: '-125.40', percent: '-0.24%', positive: false },
  { name: 'NIFTY IT', value: '42,680.95', change: '+312.50', percent: '+0.74%', positive: true },
  { name: 'APT/USD', value: '$12.45', change: '+0.85', percent: '+7.32%', positive: true },
  { name: 'NIFTY PHARMA', value: '18,920.45', change: '+156.80', percent: '+0.84%', positive: true }
];

// Helper function to simulate price fluctuations
function simulatePriceChange(currentPrice, volatility = 0.02) {
  const change = (Math.random() - 0.5) * 2 * volatility;
  return Math.round((currentPrice * (1 + change)) * 100) / 100;
}

// Function to fetch real stock prices from Yahoo Finance
async function fetchRealStockPrice(symbol) {
  try {
    const quote = await yahooFinance.quote(symbol);
    return {
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent
    };
  } catch (error) {
    console.error(`Error fetching real price for ${symbol}:`, error.message);
    return null;
  }
}

// Update prices every 30 seconds (simulate real-time data)
cron.schedule('*/30 * * * * *', async () => {
  console.log('Updating prices at:', new Date().toISOString());

  // Update stock prices with real data where possible
  for (let stock of stocksDB) {
    try {
      const realData = await fetchRealStockPrice(stock.symbol);
      if (realData) {
        stock.price = realData.price;
        stock.change = realData.change;
        stock.changePercent = `${realData.changePercent >= 0 ? '+' : ''}${realData.changePercent.toFixed(2)}%`;
      } else {
        // Fallback to simulation
        const oldPrice = stock.price;
        stock.price = simulatePriceChange(stock.price, 0.01);
        stock.change = Math.round((stock.price - oldPrice) * 100) / 100;
        stock.changePercent = `${stock.change >= 0 ? '+' : ''}${((stock.change / oldPrice) * 100).toFixed(2)}%`;
      }
      stock.lastUpdated = new Date();
    } catch (error) {
      console.error(`Error updating stock ${stock.symbol}:`, error.message);
    }
  }

  // Update mutual fund NAVs
  mutualFundsDB.forEach(fund => {
    const oldNav = fund.nav;
    fund.nav = simulatePriceChange(fund.nav, 0.005);
    fund.change = Math.round((fund.nav - oldNav) * 100) / 100;
    fund.changePercent = `${fund.change >= 0 ? '+' : ''}${((fund.change / oldNav) * 100).toFixed(2)}%`;
    fund.lastUpdated = new Date();
  });

  // Update ETF prices
  etfsDB.forEach(etf => {
    const oldPrice = etf.price;
    etf.price = simulatePriceChange(etf.price, 0.008);
    etf.change = Math.round((etf.price - oldPrice) * 100) / 100;
    etf.changePercent = `${etf.change >= 0 ? '+' : ''}${((etf.change / oldPrice) * 100).toFixed(2)}%`;
    etf.lastUpdated = new Date();
  });

  // Update Pre-IPO token prices
  preIPODB.forEach(company => {
    company.tokenPrice = simulatePriceChange(company.tokenPrice, 0.015);
    company.lastUpdated = new Date();
  });

  // Update market indices
  marketIndices.forEach(index => {
    const oldValue = parseFloat(index.value.replace(/[,$]/g, ''));
    const newValue = simulatePriceChange(oldValue, 0.005);
    const change = newValue - oldValue;
    const changePercent = (change / oldValue) * 100;
    
    index.value = newValue.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    index.change = `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
    index.percent = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
    index.positive = change >= 0;
  });
});

// API Routes

// Get all stocks
app.get('/api/stocks', (req, res) => {
  res.json({
    success: true,
    data: stocksDB,
    timestamp: new Date().toISOString()
  });
});

// Get stock by ID
app.get('/api/stocks/:id', (req, res) => {
  const stock = stocksDB.find(s => s.id === parseInt(req.params.id));
  if (!stock) {
    return res.status(404).json({ success: false, message: 'Stock not found' });
  }
  res.json({ success: true, data: stock });
});

// Get all mutual funds
app.get('/api/mutual-funds', (req, res) => {
  res.json({
    success: true,
    data: mutualFundsDB,
    timestamp: new Date().toISOString()
  });
});

// Get mutual fund by ID
app.get('/api/mutual-funds/:id', (req, res) => {
  const fund = mutualFundsDB.find(f => f.id === parseInt(req.params.id));
  if (!fund) {
    return res.status(404).json({ success: false, message: 'Mutual fund not found' });
  }
  res.json({ success: true, data: fund });
});

// Get all ETFs
app.get('/api/etfs', (req, res) => {
  res.json({
    success: true,
    data: etfsDB,
    timestamp: new Date().toISOString()
  });
});

// Get all bank deposits
app.get('/api/bank-deposits', (req, res) => {
  res.json({
    success: true,
    data: bankDepositsDB,
    timestamp: new Date().toISOString()
  });
});

// Get FDs only
app.get('/api/bank-deposits/fd', (req, res) => {
  const fds = bankDepositsDB.filter(deposit => deposit.type === 'FD');
  res.json({
    success: true,
    data: fds,
    timestamp: new Date().toISOString()
  });
});

// Get RDs only
app.get('/api/bank-deposits/rd', (req, res) => {
  const rds = bankDepositsDB.filter(deposit => deposit.type === 'RD');
  res.json({
    success: true,
    data: rds,
    timestamp: new Date().toISOString()
  });
});

// Get all Pre-IPO companies
app.get('/api/pre-ipo', (req, res) => {
  res.json({
    success: true,
    data: preIPODB,
    timestamp: new Date().toISOString()
  });
});

// Get Pre-IPO company by ID
app.get('/api/pre-ipo/:id', (req, res) => {
  const company = preIPODB.find(c => c.id === parseInt(req.params.id));
  if (!company) {
    return res.status(404).json({ success: false, message: 'Pre-IPO company not found' });
  }
  res.json({ success: true, data: company });
});

// Get market indices
app.get('/api/market-indices', (req, res) => {
  res.json({
    success: true,
    data: marketIndices,
    timestamp: new Date().toISOString()
  });
});

// Get portfolio
app.get('/api/portfolio/:pan', (req, res) => {
  const pan = req.params.pan.toUpperCase();
  const portfolio = portfolioData[pan];
  
  if (!portfolio) {
    return res.status(404).json({ success: false, message: 'Portfolio not found' });
  }

  // Update portfolio with current prices
  portfolio.holdings.forEach(holding => {
    if (holding.type === 'Stock') {
      const stock = stocksDB.find(s => s.name === holding.name);
      if (stock) {
        holding.currentPrice = stock.price;
        holding.value = holding.quantity * stock.price;
      }
    } else if (holding.type === 'Mutual Fund') {
      const fund = mutualFundsDB.find(f => f.name === holding.name);
      if (fund) {
        holding.nav = fund.nav;
        holding.value = holding.units * fund.nav;
      }
    } else if (holding.type === 'Pre-IPO') {
      const company = preIPODB.find(c => c.name.includes(holding.name.split(' ')[0]));
      if (company) {
        holding.tokenPrice = company.tokenPrice;
        holding.value = holding.tokens * company.tokenPrice * 83; // Convert USD to INR
      }
    }
  });

  // Recalculate totals
  portfolio.totalValue = portfolio.holdings.reduce((sum, holding) => sum + holding.value, 0);
  portfolio.totalGains = portfolio.totalValue - portfolio.totalInvestment;
  portfolio.returns = `${portfolio.totalGains >= 0 ? '+' : ''}${((portfolio.totalGains / portfolio.totalInvestment) * 100).toFixed(2)}%`;

  res.json({
    success: true,
    data: portfolio,
    timestamp: new Date().toISOString()
  });
});

// Search endpoint
app.get('/api/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  
  if (!query) {
    return res.json({ success: true, data: [] });
  }

  const results = [];

  // Search stocks
  stocksDB.forEach(stock => {
    if (stock.name.toLowerCase().includes(query) || stock.symbol.toLowerCase().includes(query)) {
      results.push({ ...stock, type: 'stock' });
    }
  });

  // Search mutual funds
  mutualFundsDB.forEach(fund => {
    if (fund.name.toLowerCase().includes(query) || fund.category.toLowerCase().includes(query)) {
      results.push({ ...fund, type: 'mutual-fund' });
    }
  });

  // Search ETFs
  etfsDB.forEach(etf => {
    if (etf.name.toLowerCase().includes(query) || etf.type.toLowerCase().includes(query)) {
      results.push({ ...etf, type: 'etf' });
    }
  });

  // Search Pre-IPO
  preIPODB.forEach(company => {
    if (company.name.toLowerCase().includes(query) || company.sector.toLowerCase().includes(query)) {
      results.push({ ...company, type: 'pre-ipo' });
    }
  });

  res.json({
    success: true,
    data: results.slice(0, 10), // Limit to 10 results
    timestamp: new Date().toISOString()
  });
});

// Calculate FD maturity
app.post('/api/calculate/fd-maturity', (req, res) => {
  const { principal, rate, tenure } = req.body;
  
  if (!principal || !rate || !tenure) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  const maturityAmount = principal * Math.pow(1 + (rate / 100), tenure);
  const interest = maturityAmount - principal;

  res.json({
    success: true,
    data: {
      principal,
      rate,
      tenure,
      maturityAmount: Math.round(maturityAmount),
      interest: Math.round(interest)
    }
  });
});

// Calculate RD maturity
app.post('/api/calculate/rd-maturity', (req, res) => {
  const { monthlyDeposit, rate, tenure } = req.body;
  
  if (!monthlyDeposit || !rate || !tenure) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  const months = tenure * 12;
  const monthlyRate = rate / (12 * 100);
  const maturityAmount = monthlyDeposit * (((Math.pow(1 + monthlyRate, months)) - 1) / monthlyRate);
  const totalDeposits = monthlyDeposit * months;
  const interest = maturityAmount - totalDeposits;

  res.json({
    success: true,
    data: {
      monthlyDeposit,
      rate,
      tenure,
      totalDeposits: Math.round(totalDeposits),
      maturityAmount: Math.round(maturityAmount),
      interest: Math.round(interest)
    }
  });
});

// Pre-IPO investment endpoint (Aptos integration ready)
app.post('/api/pre-ipo/invest', (req, res) => {
  const { companyId, tokens, walletAddress } = req.body;
  
  if (!companyId || !tokens || !walletAddress) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  const company = preIPODB.find(c => c.id === parseInt(companyId));
  if (!company) {
    return res.status(404).json({ success: false, message: 'Company not found' });
  }

  const totalCost = tokens * company.tokenPrice;
  const transactionId = uuidv4();

  // Here you would integrate with Aptos blockchain
  // For now, we'll simulate the transaction
  
  res.json({
    success: true,
    data: {
      transactionId,
      companyName: company.name,
      tokens,
      tokenPrice: company.tokenPrice,
      totalCost,
      contractAddress: company.aptosContractAddress,
      status: 'pending',
      message: 'Investment transaction initiated. Please confirm in your Aptos wallet.'
    }
  });
});

// Get investment analytics
app.get('/api/analytics/overview', (req, res) => {
  const totalStocks = stocksDB.length;
  const totalMutualFunds = mutualFundsDB.length;
  const totalETFs = etfsDB.length;
  const totalBankDeposits = bankDepositsDB.length;
  const totalPreIPO = preIPODB.length;

  const avgStockReturn = stocksDB.reduce((sum, stock) => {
    const change = parseFloat(stock.changePercent.replace(/[+%]/g, ''));
    return sum + change;
  }, 0) / totalStocks;

  const avgMFReturn = mutualFundsDB.reduce((sum, fund) => {
    const return1y = parseFloat(fund.returns1y.replace('%', ''));
    return sum + return1y;
  }, 0) / totalMutualFunds;

  const bestFDRate = Math.max(...bankDepositsDB.filter(d => d.type === 'FD').map(d => d.rate));
  const bestRDRate = Math.max(...bankDepositsDB.filter(d => d.type === 'RD').map(d => d.rate));

  res.json({
    success: true,
    data: {
      totalInstruments: totalStocks + totalMutualFunds + totalETFs + totalBankDeposits + totalPreIPO,
      breakdown: {
        stocks: totalStocks,
        mutualFunds: totalMutualFunds,
        etfs: totalETFs,
        bankDeposits: totalBankDeposits,
        preIPO: totalPreIPO
      },
      performance: {
        avgStockReturn: `${avgStockReturn.toFixed(2)}%`,
        avgMutualFundReturn: `${avgMFReturn.toFixed(2)}%`,
        bestFDRate: `${bestFDRate}%`,
        bestRDRate: `${bestRDRate}%`
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Invest 360 API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      stocks: '/api/stocks',
      mutualFunds: '/api/mutual-funds',
      etfs: '/api/etfs',
      bankDeposits: '/api/bank-deposits',
      preIPO: '/api/pre-ipo',
      portfolio: '/api/portfolio/:pan',
      search: '/api/search?q=query',
      analytics: '/api/analytics/overview'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Invest 360 Server running on port ${PORT}`);
  console.log(`📊 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`💰 Stocks API: http://localhost:${PORT}/api/stocks`);
  console.log(`📈 Mutual Funds API: http://localhost:${PORT}/api/mutual-funds`);
  console.log(`🏦 Bank Deposits API: http://localhost:${PORT}/api/bank-deposits`);
  console.log(`🚀 Pre-IPO API: http://localhost:${PORT}/api/pre-ipo`);
  console.log(`📱 Portfolio API: http://localhost:${PORT}/api/portfolio/DEMO123456`);
  console.log(`🔍 Search API: http://localhost:${PORT}/api/search?q=reliance`);
  console.log(`📊 Analytics API: http://localhost:${PORT}/api/analytics/overview`);
});