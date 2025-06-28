const express = require('express');
const router = express.Router();
const etfsData = require('../data/etfsData');

// Get all ETFs
router.get('/', (req, res) => {
  try {
    const etfs = etfsData.getETFs();
    res.json({
      success: true,
      data: etfs,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ETFs',
      error: error.message
    });
  }
});

// Get ETF by ID
router.get('/:id', (req, res) => {
  try {
    const etf = etfsData.getETFById(req.params.id);
    if (!etf) {
      return res.status(404).json({ 
        success: false, 
        message: 'ETF not found' 
      });
    }
    res.json({ success: true, data: etf });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ETF',
      error: error.message
    });
  }
});

// Get ETFs by type
router.get('/type/:type', (req, res) => {
  try {
    const etfs = etfsData.getETFs();
    const filteredETFs = etfs.filter(etf => 
      etf.type.toLowerCase() === req.params.type.toLowerCase()
    );
    
    res.json({
      success: true,
      data: filteredETFs,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ETFs by type',
      error: error.message
    });
  }
});

module.exports = router;