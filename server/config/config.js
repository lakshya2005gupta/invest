require('dotenv').config();

module.exports = {
  development: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    
    // Database
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      name: process.env.DB_NAME || 'invest360',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password'
    },

    // External APIs
    apis: {
      yahooFinance: process.env.YAHOO_FINANCE_API_KEY,
      alphaVantage: process.env.ALPHA_VANTAGE_API_KEY,
      amfiBaseUrl: process.env.AMFI_BASE_URL || 'https://www.amfiindia.com/spages/NAVAll.txt',
      nseApiUrl: process.env.NSE_API_URL || 'https://www.nseindia.com/api',
      bseApiUrl: process.env.BSE_API_URL || 'https://api.bseindia.com'
    },

    // JWT
    jwt: {
      secret: process.env.JWT_SECRET || 'fallback_secret_key',
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },

    // Rate Limiting
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    },

    // Cache
    cache: {
      ttl: parseInt(process.env.CACHE_TTL) || 300000 // 5 minutes
    },

    // Blockchain
    blockchain: {
      aptosNetwork: process.env.APTOS_NETWORK || 'testnet',
      aptosNodeUrl: process.env.APTOS_NODE_URL || 'https://fullnode.testnet.aptoslabs.com/v1',
      aptosPrivateKey: process.env.APTOS_PRIVATE_KEY
    },

    // Security
    security: {
      bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
      sessionSecret: process.env.SESSION_SECRET || 'fallback_session_secret'
    },

    // Email
    email: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },

    // File Upload
    upload: {
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
      uploadPath: process.env.UPLOAD_PATH || 'uploads/'
    },

    // Logging
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      file: process.env.LOG_FILE || 'logs/app.log'
    }
  },

  production: {
    port: process.env.PORT || 5000,
    nodeEnv: 'production',
    corsOrigin: process.env.CORS_ORIGIN,
    
    // Production configurations would go here
    // Similar structure but with production-specific values
  }
};