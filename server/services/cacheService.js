class CacheService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 60 * 60 * 1000; // 1 hour in milliseconds
    this.lastUpdate = new Map();
    this.updateInProgress = new Set();
  }

  // Set cache with timestamp
  set(key, data) {
    this.cache.set(key, data);
    this.lastUpdate.set(key, Date.now());
    console.log(`Cache updated for ${key} at ${new Date().toISOString()}`);
  }

  // Get cache data
  get(key) {
    return this.cache.get(key);
  }

  // Check if cache is expired
  isExpired(key) {
    const lastUpdateTime = this.lastUpdate.get(key);
    if (!lastUpdateTime) return true;
    
    return (Date.now() - lastUpdateTime) > this.cacheExpiry;
  }

  // Check if cache exists and is valid
  isValid(key) {
    return this.cache.has(key) && !this.isExpired(key);
  }

  // Get cache age in minutes
  getCacheAge(key) {
    const lastUpdateTime = this.lastUpdate.get(key);
    if (!lastUpdateTime) return null;
    
    return Math.floor((Date.now() - lastUpdateTime) / (1000 * 60));
  }

  // Force refresh cache
  invalidate(key) {
    this.cache.delete(key);
    this.lastUpdate.delete(key);
    this.updateInProgress.delete(key);
    console.log(`Cache invalidated for ${key}`);
  }

  // Check if update is in progress
  isUpdating(key) {
    return this.updateInProgress.has(key);
  }

  // Mark update as in progress
  setUpdating(key, status = true) {
    if (status) {
      this.updateInProgress.add(key);
    } else {
      this.updateInProgress.delete(key);
    }
  }

  // Get all cache stats
  getStats() {
    const stats = {};
    for (const [key] of this.cache) {
      stats[key] = {
        exists: true,
        expired: this.isExpired(key),
        ageMinutes: this.getCacheAge(key),
        updating: this.isUpdating(key)
      };
    }
    return stats;
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    this.lastUpdate.clear();
    this.updateInProgress.clear();
    console.log('All cache cleared');
  }
}

module.exports = new CacheService();