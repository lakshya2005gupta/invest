const express = require('express');
const router = express.Router();
const marketData = require('../data/marketData');
const priceUpdateService = require('../services/priceUpdateService');

// Get market indices with smart caching
router.get('/', async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    
    let indices;
    if (forceRefresh) {
      console.log('Force refresh requested for market indices');
      indices = priceUpdateService.updateMarketIndices(true);
    } else {
      indices = priceUpdateService.getCachedData('marketIndices');
    }

    res.json({
      success: true,
      data: indices,
      cached: !forceRefresh,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching market indices',
      error: error.message
    });
  }
});

// Get specific market index
router.get('/:name', (req, res) => {
  try {
    const indices = marketData.getMarketIndices();
    const index = indices.find(idx => 
      idx.name.toLowerCase().replace(/\s+/g, '') === req.params.name.toLowerCase().replace(/\s+/g, '')
    );
    
    if (!index) {
      return res.status(404).json({
        success: false,
        message: 'Market index not found'
      });
    }

    res.json({
      success: true,
      data: index,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching market index',
      error: error.message
    });
  }
});

// Force refresh market indices
router.post('/refresh', async (req, res) => {
  try {
    console.log('Manual market indices refresh triggered');
    const indices = priceUpdateService.updateMarketIndices(true);
    
    res.json({
      success: true,
      data: indices,
      message: 'Market indices refreshed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error refreshing market indices',
      error: error.message
    });
  }
});

// Get cache status
router.get('/status/cache', (req, res) => {
  try {
    const status = priceUpdateService.getStatus();
    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cache status',
      error: error.message
    });
  }
});

module.exports = router;