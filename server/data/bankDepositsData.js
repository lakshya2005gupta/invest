// Bank deposits data
let bankDepositsDB = {
  fixedDeposits: [
    {
      id: 1,
      bank: 'HDFC Bank',
      type: 'FD',
      rate: 7.25,
      minAmount: 10000,
      maxAmount: 10000000,
      tenure: '1-5 years',
      rating: 'AAA',
      features: ['Auto-renewal', 'Loan against FD', 'Premature withdrawal'],
      lastUpdated: new Date()
    },
    {
      id: 2,
      bank: 'ICICI Bank',
      type: 'FD',
      rate: 7.15,
      minAmount: 10000,
      maxAmount: 10000000,
      tenure: '1-5 years',
      rating: 'AAA',
      features: ['Flexible tenure', 'Online booking', 'Senior citizen benefits'],
      lastUpdated: new Date()
    },
    {
      id: 3,
      bank: 'SBI',
      type: 'FD',
      rate: 6.80,
      minAmount: 1000,
      maxAmount: 50000000,
      tenure: '1-10 years',
      rating: 'AAA',
      features: ['Senior citizen benefits', 'Tax saving', 'Low minimum amount'],
      lastUpdated: new Date()
    },
    {
      id: 4,
      bank: 'Axis Bank',
      type: 'FD',
      rate: 7.35,
      minAmount: 10000,
      maxAmount: 10000000,
      tenure: '1-5 years',
      rating: 'AA+',
      features: ['High returns', 'Quick processing', 'Digital FD'],
      lastUpdated: new Date()
    },
    {
      id: 5,
      bank: 'Kotak Mahindra Bank',
      type: 'FD',
      rate: 7.40,
      minAmount: 25000,
      maxAmount: 10000000,
      tenure: '1-5 years',
      rating: 'AA+',
      features: ['Premium rates', 'Digital FD', 'Instant booking'],
      lastUpdated: new Date()
    },
    {
      id: 6,
      bank: 'IndusInd Bank',
      type: 'FD',
      rate: 7.50,
      minAmount: 10000,
      maxAmount: 10000000,
      tenure: '1-5 years',
      rating: 'AA',
      features: ['Highest rates', 'Flexible options', 'Online management'],
      lastUpdated: new Date()
    }
  ],
  recurringDeposits: [
    {
      id: 1,
      bank: 'HDFC Bank',
      type: 'RD',
      rate: 6.75,
      minAmount: 100,
      maxAmount: 100000,
      tenure: '1-10 years',
      rating: 'AAA',
      features: ['Monthly deposits', 'Auto-debit', 'Flexible tenure'],
      lastUpdated: new Date()
    },
    {
      id: 2,
      bank: 'ICICI Bank',
      type: 'RD',
      rate: 6.65,
      minAmount: 100,
      maxAmount: 100000,
      tenure: '1-10 years',
      rating: 'AAA',
      features: ['Flexible deposits', 'Online management', 'Mobile banking'],
      lastUpdated: new Date()
    },
    {
      id: 3,
      bank: 'SBI',
      type: 'RD',
      rate: 6.30,
      minAmount: 10,
      maxAmount: 100000,
      tenure: '1-20 years',
      rating: 'AAA',
      features: ['Low minimum', 'Long tenure', 'Government backing'],
      lastUpdated: new Date()
    },
    {
      id: 4,
      bank: 'Axis Bank',
      type: 'RD',
      rate: 6.85,
      minAmount: 500,
      maxAmount: 100000,
      tenure: '1-10 years',
      rating: 'AA+',
      features: ['Good returns', 'Easy setup', 'Digital RD'],
      lastUpdated: new Date()
    },
    {
      id: 5,
      bank: 'Kotak Mahindra Bank',
      type: 'RD',
      rate: 6.90,
      minAmount: 100,
      maxAmount: 100000,
      tenure: '1-10 years',
      rating: 'AA+',
      features: ['Premium rates', 'Digital RD', 'Instant setup'],
      lastUpdated: new Date()
    },
    {
      id: 6,
      bank: 'IndusInd Bank',
      type: 'RD',
      rate: 7.00,
      minAmount: 100,
      maxAmount: 100000,
      tenure: '1-10 years',
      rating: 'AA',
      features: ['Best rates', 'Flexible tenure', 'Online booking'],
      lastUpdated: new Date()
    }
  ]
};

module.exports = {
  getAllDeposits: () => ({
    fixedDeposits: bankDepositsDB.fixedDeposits,
    recurringDeposits: bankDepositsDB.recurringDeposits
  }),
  getFDs: () => bankDepositsDB.fixedDeposits,
  getRDs: () => bankDepositsDB.recurringDeposits,
  getFDById: (id) => bankDepositsDB.fixedDeposits.find(fd => fd.id === parseInt(id)),
  getRDById: (id) => bankDepositsDB.recurringDeposits.find(rd => rd.id === parseInt(id)),
  updateFD: (id, updates) => {
    const index = bankDepositsDB.fixedDeposits.findIndex(fd => fd.id === parseInt(id));
    if (index !== -1) {
      bankDepositsDB.fixedDeposits[index] = { ...bankDepositsDB.fixedDeposits[index], ...updates };
      return bankDepositsDB.fixedDeposits[index];
    }
    return null;
  },
  updateRD: (id, updates) => {
    const index = bankDepositsDB.recurringDeposits.findIndex(rd => rd.id === parseInt(id));
    if (index !== -1) {
      bankDepositsDB.recurringDeposits[index] = { ...bankDepositsDB.recurringDeposits[index], ...updates };
      return bankDepositsDB.recurringDeposits[index];
    }
    return null;
  }
};