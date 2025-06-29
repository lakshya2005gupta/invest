// In-memory Pre-IPO database with reduced prices for affordability
let preIPODB = [
  {
    id: 1,
    name: 'ByteDance',
    sector: 'Technology',
    valuation: '$140B',
    minInvestment: '$10', // Reduced from $1,000 to $10
    expectedIPO: 'Q2 2024',
    description: 'Parent company of TikTok and other social media platforms',
    tokenPrice: 0.50, // Reduced from 50 to 0.50
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
    minInvestment: '$25', // Reduced from $2,500 to $25
    expectedIPO: 'Q4 2024',
    description: 'Private space exploration and satellite internet company',
    tokenPrice: 1.25, // Reduced from 125 to 1.25
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
    minInvestment: '$5', // Reduced from $500 to $5
    expectedIPO: 'Q1 2024',
    description: 'Online payment processing platform for businesses',
    tokenPrice: 0.75, // Reduced from 75 to 0.75
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
    minInvestment: '$2.50', // Reduced from $250 to $2.50
    expectedIPO: 'Q3 2024',
    description: 'Voice, video and text communication service for communities',
    tokenPrice: 0.25, // Reduced from 25 to 0.25
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
    minInvestment: '$3', // Reduced from $300 to $3
    expectedIPO: 'Q2 2024',
    description: 'Online graphic design platform with drag-and-drop interface',
    tokenPrice: 0.35, // Reduced from 35 to 0.35
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
    minInvestment: '$10', // Reduced from $1,000 to $10
    expectedIPO: 'Q1 2024',
    description: 'Data analytics platform for big data and machine learning',
    tokenPrice: 0.85, // Reduced from 85 to 0.85
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

module.exports = {
  getPreIPOCompanies: () => preIPODB,
  getPreIPOById: (id) => preIPODB.find(c => c.id === parseInt(id)),
  updatePreIPO: (id, updates) => {
    const index = preIPODB.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
      preIPODB[index] = { ...preIPODB[index], ...updates };
      return preIPODB[index];
    }
    return null;
  },
  updateAllPreIPO: (updateFn) => {
    preIPODB = preIPODB.map(updateFn);
  }
};
