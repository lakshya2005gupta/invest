const config = require('../config/config');
const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logLevel = config.development.logging.level;
    this.logFile = config.development.logging.file;
    
    // Ensure logs directory exists
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta
    };

    // Console output
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, meta);

    // File output
    try {
      fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  info(message, meta = {}) {
    this.log('info', message, meta);
  }

  error(message, meta = {}) {
    this.log('error', message, meta);
  }

  warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  debug(message, meta = {}) {
    if (this.logLevel === 'debug') {
      this.log('debug', message, meta);
    }
  }
}

module.exports = new Logger();