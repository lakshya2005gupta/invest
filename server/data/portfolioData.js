// Portfolio data management
let portfolioData = {
  'DEMO123456': {
    pan: 'DEMO123456',
    name: 'Demo User',
    totalValue: 633000,
    totalInvestment: 500000,
    totalGains: 133000,
    totalReturns: 26.6,
    holdings: [
      {
        id: 1,
        name: 'Reliance Industries',
        type: 'Stock',
        symbol: 'RELIANCE.NS',
        quantity: 50,
        avgPrice: 2650,
        currentPrice: 2845,
        value: 142250,
        gain: 9750,
        gainPercent: 7.36,
        positive: true
      },
      {
        id: 2,
        name: 'HDFC Bank',
        type: 'Stock',
        symbol: 'HDFCBANK.NS',
        quantity: 25,
        avgPrice: 1580,
        currentPrice: 1680,
        value: 42000,
        gain: 2500,
        gainPercent: 6.33,
        positive: true
      },
      {
        id: 3,
        name: 'Axis Bluechip Fund',
        type: 'Mutual Fund',
        schemeCode: '120503',
        units: 1250.5,
        nav: 65.48,
        value: 81865,
        gain: 9115,
        gainPercent: 12.5,
        positive: true
      },
      {
        id: 4,
        name: 'HDFC Bank FD',
        type: 'Bank Deposit',
        amount: 50000,
        rate: 7.25,
        maturityDate: '2025-12-31',
        value: 52500,
        gain: 2500,
        gainPercent: 5.0,
        positive: true
      },
      {
        id: 5,
        name: 'ByteDance Tokens',
        type: 'Pre-IPO',
        tokens: 100,
        price: 50,
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
        value: 5000,
        gain: 1000,
        gainPercent: 25.0,
        positive: true
      }
    ],
    transactions: [
      {
        id: 1,
        date: '2024-01-15',
        type: 'BUY',
        instrument: 'Reliance Industries',
        quantity: 50,
        price: 2650,
        amount: 132500,
        status: 'COMPLETED'
      },
      {
        id: 2,
        date: '2024-02-10',
        type: 'SIP',
        instrument: 'Axis Bluechip Fund',
        amount: 5000,
        nav: 62.30,
        units: 80.26,
        status: 'COMPLETED'
      }
    ]
  }
};

module.exports = {
  getPortfolio: (pan) => portfolioData[pan] || null,
  updatePortfolio: (pan, updates) => {
    if (portfolioData[pan]) {
      portfolioData[pan] = { ...portfolioData[pan], ...updates };
      return portfolioData[pan];
    }
    return null;
  },
  addHolding: (pan, holding) => {
    if (portfolioData[pan]) {
      portfolioData[pan].holdings.push({
        ...holding,
        id: portfolioData[pan].holdings.length + 1
      });
      return portfolioData[pan];
    }
    return null;
  },
  addTransaction: (pan, transaction) => {
    if (portfolioData[pan]) {
      portfolioData[pan].transactions.push({
        ...transaction,
        id: portfolioData[pan].transactions.length + 1,
        date: new Date().toISOString().split('T')[0]
      });
      return portfolioData[pan];
    }
    return null;
  }
};