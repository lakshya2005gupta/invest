const rateLimit = require('express-rate-limit');
const config = require('../config/config');

const limiter = rateLimit({
  windowMs: config.development.rateLimit.windowMs,
  max: config.development.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(config.development.rateLimit.windowMs / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;