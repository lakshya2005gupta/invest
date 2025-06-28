const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

// Import route modules
const stockRoutes = require('./routes/stocks');
const mutualFundRoutes = require('./routes/mutualFunds');
const etfRoutes = require('./routes/etfs');
const bankDepositRoutes = require('./routes/bankDeposits');
const preIPORoutes = require('./routes/preIPO');
const portfolioRoutes = require('./routes/portfolio');
const marketRoutes = require('./routes/market');
const calculatorRoutes = require('./routes/calculators');
const searchRoutes = require('./routes/search');
const analyticsRoutes = require('./routes/analytics');

// Import services
const priceUpdateService = require('./services/priceUpdateService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stocks', stockRoutes);
app.use('/api/mutual-funds', mutualFundRoutes);
app.use('/api/etfs', etfRoutes);
app.use('/api/bank-deposits', bankDepositRoutes);
app.use('/api/pre-ipo', preIPORoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/market-indices', marketRoutes);
app.use('/api/calculate', calculatorRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/analytics', analyticsRoutes);

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

// Start price update service
priceUpdateService.startPriceUpdates();

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