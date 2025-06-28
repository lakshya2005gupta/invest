const express = require('express');
const router = express.Router();
const mutualFundsData = require('../data/mutualFundsData');
const amfiService = require('../services/amfiService');

// Get all mutual funds
router.get('/', (req, res) => {
  try {
    const funds = mutualFundsData.getMutualFunds();
    res.json({
      success: true,
      data: funds,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mutual funds',
      error: error.message
    });
  }
});

// Get mutual fund by ID
router.get('/:id', (req, res) => {
  try {
    const fund = mutualFundsData.getMutualFundById(req.params.id);
    if (!fund) {
      return res.status(404).json({ 
        success: false, 
        message: 'Mutual fund not found' 
      });
    }
    res.json({ success: true, data: fund });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mutual fund',
      error: error.message
    });
  }
});

// Search mutual funds by name using AMFI
router.get('/search/:name', async (req, res) => {
  try {
    const fundName = req.params.name;
    const results = await amfiService.searchFundByName(fundName);
    
    res.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching mutual funds',
      error: error.message
    });
  }
});

// Get NAV by scheme code from AMFI
router.get('/nav/:schemeCode', async (req, res) => {
  try {
    const schemeCode = req.params.schemeCode;
    const nav = await amfiService.getNAVBySchemeCode(schemeCode);
    
    if (nav === null) {
      return res.status(404).json({
        success: false,
        message: 'NAV not found for scheme code'
      });
    }

    res.json({
      success: true,
      data: { schemeCode, nav },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching NAV',
      error: error.message
    });
  }
});

module.exports = router;