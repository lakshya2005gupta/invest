const express = require('express');
const router = express.Router();
const mutualFundsData = require('../data/mutualFundsData');
const amfiService = require('../services/amfiService');
const priceUpdateService = require('../services/priceUpdateService');

// Get all mutual funds with smart caching
router.get('/', async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    
    let funds;
    if (forceRefresh) {
      console.log('Force refresh requested for mutual funds');
      funds = await priceUpdateService.updateMutualFundNAVs(true);
    } else {
      funds = await priceUpdateService.getCachedData('mutualFunds');
    }

    res.json({
      success: true,
      data: funds,
      cached: !forceRefresh,
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

// Force refresh mutual funds
router.post('/refresh', async (req, res) => {
  try {
    console.log('Manual mutual funds refresh triggered');
    const funds = await priceUpdateService.updateMutualFundNAVs(true);
    
    res.json({
      success: true,
      data: funds,
      message: 'Mutual funds data refreshed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error refreshing mutual funds',
      error: error.message
    });
  }
});

module.exports = router;