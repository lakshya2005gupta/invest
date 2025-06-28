const express = require('express');
const router = express.Router();
const stocksData = require('../data/stocksData');

// Get all stocks
router.get('/', (req, res) => {
  try {
    const stocks = stocksData.getStocks();
    res.json({
      success: true,
      data: stocks,
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

module.exports = router;