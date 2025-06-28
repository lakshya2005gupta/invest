const express = require('express');
const router = express.Router();
const stocksData = require('../data/stocksData');
const priceUpdateService = require('../services/priceUpdateService');

// Get all stocks with smart caching
router.get('/', async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    
    let stocks;
    if (forceRefresh) {
      console.log('Force refresh requested for stocks');
      stocks = await priceUpdateService.updateStockPrices(true);
    } else {
      stocks = await priceUpdateService.getCachedData('stocks');
    }

    res.json({
      success: true,
      data: stocks,
      cached: !forceRefresh,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stocks',
      error: error.message
    });
  }
});

// Get stock by ID
router.get('/:id', (req, res) => {
  try {
    const stock = stocksData.getStockById(req.params.id);
    if (!stock) {
      return res.status(404).json({ 
        success: false, 
        message: 'Stock not found' 
      });
    }
    res.json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stock',
      error: error.message
    });
  }
});

// Force refresh stocks
router.post('/refresh', async (req, res) => {
  try {
    console.log('Manual stock refresh triggered');
    const stocks = await priceUpdateService.updateStockPrices(true);
    
    res.json({
      success: true,
      data: stocks,
      message: 'Stocks data refreshed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error refreshing stocks',
      error: error.message
    });
  }
});

module.exports = router;