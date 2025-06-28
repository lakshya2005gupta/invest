// Environment configuration
const config = {
  development: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    amfiUrl: process.env.AMFI_NAV_URL || 'https://www.amfiindia.com/spages/NAVAll.txt',
    yahooFinanceTimeout: parseInt(process.env.YAHOO_FINANCE_TIMEOUT) || 10000,
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000,
      max: parseInt(process.env.RATE_LIMIT_MAX) || 100
    },
    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:5173']
  },
  production: {
    port: process.env.PORT || 5000,
    nodeEnv: 'production',
    amfiUrl: process.env.AMFI_NAV_URL || 'https://www.amfiindia.com/spages/NAVAll.txt',
    yahooFinanceTimeout: parseInt(process.env.YAHOO_FINANCE_TIMEOUT) || 5000,
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000,
      max: parseInt(process.env.RATE_LIMIT_MAX) || 50
    },
    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : []
  }
};

const environment = process.env.NODE_ENV || 'development';

module.exports = config[environment];