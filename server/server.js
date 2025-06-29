const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

// Import configuration
const config = require('./config/environment');

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
const cacheRoutes = require('./routes/cache');

// Import services
const priceUpdateService = require('./services/priceUpdateService');
const cacheService = require('./services/cacheService');

const app = express();
const PORT = config.port;

// Middleware
// app.use(cors({
//   origin: config.corsOrigins,
//   credentials: true
// }));
app.use(cors()) 
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Cache refresh middleware for user requests
app.use((req, res, next) => {
  // Check if this is a data request that might need fresh data
  const dataRoutes = ['/api/stocks', '/api/mutual-funds', '/api/etfs', '/api/pre-ipo', '/api/market-indices'];
  const isDataRequest = dataRoutes.some(route => req.path.startsWith(route));
  
  if (isDataRequest && req.headers['cache-control'] === 'no-cache') {
    // User refreshed the page, request force update
    priceUpdateService.requestForceUpdate(req.ip);
  }
  
  next();
});

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
app.use('/api/cache', cacheRoutes);

// Health check with cache info
app.get('/api/health', (req, res) => {
  const cacheStats = cacheService.getStats();
  
  res.json({
    success: true,
    message: 'Invest 360 API is running with smart caching',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.nodeEnv,
    cache: {
      enabled: true,
      entries: cacheStats.totalEntries,
      updateInterval: '1 hour'
    },
    endpoints: {
      stocks: '/api/stocks',
      mutualFunds: '/api/mutual-funds',
      etfs: '/api/etfs',
      bankDeposits: '/api/bank-deposits',
      preIPO: '/api/pre-ipo',
      portfolio: '/api/portfolio/:pan',
      search: '/api/search?q=query',
      analytics: '/api/analytics/overview',
      cache: '/api/cache/stats'
    }
  });
});

// Start smart caching price update service
priceUpdateService.startPriceUpdates();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: config.nodeEnv === 'development' ? err.message : 'Internal server error'
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
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`⚡ Smart Caching: Enabled (1 hour intervals)`);
  console.log(`📊 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`💰 Stocks API: http://localhost:${PORT}/api/stocks`);
  console.log(`📈 Mutual Funds API: http://localhost:${PORT}/api/mutual-funds`);
  console.log(`🏦 Bank Deposits API: http://localhost:${PORT}/api/bank-deposits`);
  console.log(`🚀 Pre-IPO API: http://localhost:${PORT}/api/pre-ipo`);
  console.log(`📱 Portfolio API: http://localhost:${PORT}/api/portfolio/DEMO123456`);
  console.log(`🔍 Search API: http://localhost:${PORT}/api/search?q=reliance`);
  console.log(`📊 Analytics API: http://localhost:${PORT}/api/analytics/overview`);
  console.log(`🗄️ Cache Stats: http://localhost:${PORT}/api/cache/stats`);
});
