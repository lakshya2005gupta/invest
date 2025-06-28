const express = require('express');
const router = express.Router();
const marketData = require('../data/marketData');

// Get market indices
router.get('/', (req, res) => {
  try {
    const indices = marketData.getMarketIndices();
    res.json({
      success: true,
      data: indices,
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

module.exports = router;