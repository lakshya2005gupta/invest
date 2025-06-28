const express = require('express');
const router = express.Router();
const portfolioData = require('../data/portfolioData');

// Get portfolio by PAN
router.get('/:pan', (req, res) => {
  try {
    const portfolio = portfolioData.getPortfolio(req.params.pan);
    if (!portfolio) {
      return res.status(404).json({ 
        success: false, 
        message: 'Portfolio not found' 
      });
    }
    res.json({ success: true, data: portfolio });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching portfolio',
      error: error.message
    });
  }
});

// Add holding to portfolio
router.post('/:pan/holdings', (req, res) => {
  try {
    const { pan } = req.params;
    const holding = req.body;
    
    const updatedPortfolio = portfolioData.addHolding(pan, holding);
    if (!updatedPortfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    res.json({
      success: true,
      data: updatedPortfolio,
      message: 'Holding added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding holding',
      error: error.message
    });
  }
});

// Add transaction to portfolio
router.post('/:pan/transactions', (req, res) => {
  try {
    const { pan } = req.params;
    const transaction = req.body;
    
    const updatedPortfolio = portfolioData.addTransaction(pan, transaction);
    if (!updatedPortfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    res.json({
      success: true,
      data: updatedPortfolio,
      message: 'Transaction added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding transaction',
      error: error.message
    });
  }
});

module.exports = router;