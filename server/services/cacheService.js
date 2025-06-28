class CacheService {
  constructor() {
    this.cache = new Map();
    this.cacheTimestamps = new Map();
    this.defaultTTL = 60 * 60 * 1000; // 1 hour in milliseconds
    this.subscribers = new Map(); // For real-time updates
  }

  // Set cache with TTL
  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, value);
    this.cacheTimestamps.set(key, {
      timestamp: Date.now(),
      ttl: ttl
    });
    
    // Notify subscribers of data update
    this.notifySubscribers(key, value);
  }

  // Get cache with TTL check
  get(key) {
    const cacheInfo = this.cacheTimestamps.get(key);
    
    if (!cacheInfo) {
      return null;
    }

    const now = Date.now();
    const isExpired = (now - cacheInfo.timestamp) > cacheInfo.ttl;

    if (isExpired) {
      this.delete(key);
      return null;
    }

    return this.cache.get(key);
  }

  // Check if cache exists and is valid
  has(key) {
    return this.get(key) !== null;
  }

  // Delete cache entry
  delete(key) {
    this.cache.delete(key);
    this.cacheTimestamps.delete(key);
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    this.cacheTimestamps.clear();
  }

  // Get cache age in minutes
  getCacheAge(key) {
    const cacheInfo = this.cacheTimestamps.get(key);
    if (!cacheInfo) return null;
    
    return Math.floor((Date.now() - cacheInfo.timestamp) / (1000 * 60));
  }

  // Subscribe to cache updates
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);
  }

  // Unsubscribe from cache updates
  unsubscribe(key, callback) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).delete(callback);
    }
  }

  // Notify subscribers of updates
  notifySubscribers(key, value) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).forEach(callback => {
        try {
          callback(value);
        } catch (error) {
          console.error('Error in cache subscriber:', error);
        }
      });
    }
  }

  // Get cache statistics
  getStats() {
    const stats = {
      totalEntries: this.cache.size,
      entries: []
    };

    for (const [key, timestamp] of this.cacheTimestamps.entries()) {
      stats.entries.push({
        key,
        age: this.getCacheAge(key),
        size: JSON.stringify(this.cache.get(key)).length
      });
    }

    return stats;
  }
}

module.exports = new CacheService();