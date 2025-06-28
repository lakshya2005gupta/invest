const express = require('express');
const router = express.Router();
const cacheService = require('../services/cacheService');
const priceUpdateService = require('../services/priceUpdateService');

// Get cache statistics
router.get('/stats', (req, res) => {
  try {
    const stats = cacheService.getStats();
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cache stats',
      error: error.message
    });
  }
});

// Force refresh cache
router.post('/refresh', async (req, res) => {
  try {
    const { clientId } = req.body;
    
    // Request force update
    priceUpdateService.requestForceUpdate(clientId || req.ip);
    
    // Trigger immediate update
    await priceUpdateService.performFullUpdate(true);
    
    res.json({
      success: true,
      message: 'Cache refreshed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error refreshing cache',
      error: error.message
    });
  }
});

// Clear specific cache
router.delete('/:key', (req, res) => {
  try {
    const { key } = req.params;
    cacheService.delete(key);
    
    res.json({
      success: true,
      message: `Cache key '${key}' cleared successfully`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cache',
      error: error.message
    });
  }
});

// Clear all cache
router.delete('/', (req, res) => {
  try {
    cacheService.clear();
    
    res.json({
      success: true,
      message: 'All cache cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing all cache',
      error: error.message
    });
  }
});

module.exports = router;