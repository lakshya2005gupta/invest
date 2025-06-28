// In-memory mutual funds database with AMFI scheme codes
let mutualFundsDB = [
  {
    id: 1,
    name: 'Axis Bluechip Fund',
    schemeCode: '120503', // AMFI scheme code
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
    fundHouse: 'Axis Mutual Fund',
    lastUpdated: new Date()
  },
  {
    id: 2,
    name: 'Mirae Asset Large Cap Fund',
    schemeCode: '125497',
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
    fundHouse: 'Mirae Asset Mutual Fund',
    lastUpdated: new Date()
  },
  {
    id: 3,
    name: 'SBI Small Cap Fund',
    schemeCode: '122639',
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
    fundHouse: 'SBI Mutual Fund',
    lastUpdated: new Date()
  },
  {
    id: 4,
    name: 'HDFC Mid-Cap Opportunities Fund',
    schemeCode: '118989',
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
    fundHouse: 'HDFC Mutual Fund',
    lastUpdated: new Date()
  },
  {
    id: 5,
    name: 'Parag Parikh Flexi Cap Fund',
    schemeCode: '122639',
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
    fundHouse: 'Parag Parikh Mutual Fund',
    lastUpdated: new Date()
  },
  {
    id: 6,
    name: 'UTI Nifty Index Fund',
    schemeCode: '120716',
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
    fundHouse: 'UTI Mutual Fund',
    lastUpdated: new Date()
  }
];

module.exports = {
  getMutualFunds: () => mutualFundsDB,
  getMutualFundById: (id) => mutualFundsDB.find(f => f.id === parseInt(id)),
  getMutualFundBySchemeCode: (schemeCode) => mutualFundsDB.find(f => f.schemeCode === schemeCode),
  updateMutualFund: (id, updates) => {
    const index = mutualFundsDB.findIndex(f => f.id === parseInt(id));
    if (index !== -1) {
      mutualFundsDB[index] = { ...mutualFundsDB[index], ...updates };
      return mutualFundsDB[index];
    }
    return null;
  },
  updateAllMutualFunds: (updateFn) => {
    mutualFundsDB = mutualFundsDB.map(updateFn);
  }
};