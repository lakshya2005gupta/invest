const express = require('express');
const router = express.Router();
const stocksData = require('../data/stocksData');
const mutualFundsData = require('../data/mutualFundsData');
const etfsData = require('../data/etfsData');
const preIPOData = require('../data/preIPOData');

// Universal search endpoint
router.get('/', (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchTerm = query.toLowerCase().trim();
    const results = {
      stocks: [],
      mutualFunds: [],
      etfs: [],
      preIPO: []
    };

    // Search stocks
    const stocks = stocksData.getStocks();
    results.stocks = stocks.filter(stock => 
      stock.name.toLowerCase().includes(searchTerm) ||
      stock.symbol.toLowerCase().includes(searchTerm) ||
      stock.sector.toLowerCase().includes(searchTerm)
    ).slice(0, 5);

    // Search mutual funds
    const mutualFunds = mutualFundsData.getMutualFunds();
    results.mutualFunds = mutualFunds.filter(fund => 
      fund.name.toLowerCase().includes(searchTerm) ||
      fund.category.toLowerCase().includes(searchTerm) ||
      fund.fundHouse.toLowerCase().includes(searchTerm)
    ).slice(0, 5);

    // Search ETFs
    const etfs = etfsData.getETFs();
    results.etfs = etfs.filter(etf => 
      etf.name.toLowerCase().includes(searchTerm) ||
      etf.symbol.toLowerCase().includes(searchTerm) ||
      etf.type.toLowerCase().includes(searchTerm)
    ).slice(0, 5);

    // Search Pre-IPO companies
    const preIPOCompanies = preIPOData.getPreIPOCompanies();
    results.preIPO = preIPOCompanies.filter(company => 
      company.name.toLowerCase().includes(searchTerm) ||
      company.sector.toLowerCase().includes(searchTerm) ||
      company.description.toLowerCase().includes(searchTerm)
    ).slice(0, 5);

    const totalResults = results.stocks.length + results.mutualFunds.length + 
                        results.etfs.length + results.preIPO.length;

    res.json({
      success: true,
      data: results,
      totalResults,
      query: searchTerm,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error performing search',
      error: error.message
    });
  }
});

// Search by category
router.get('/:category', (req, res) => {
  try {
    const { category } = req.params;
    const { q: query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchTerm = query.toLowerCase().trim();
    let results = [];

    switch (category.toLowerCase()) {
      case 'stocks':
        const stocks = stocksData.getStocks();
        results = stocks.filter(stock => 
          stock.name.toLowerCase().includes(searchTerm) ||
          stock.symbol.toLowerCase().includes(searchTerm) ||
          stock.sector.toLowerCase().includes(searchTerm)
        );
        break;

      case 'mutual-funds':
        const mutualFunds = mutualFundsData.getMutualFunds();
        results = mutualFunds.filter(fund => 
          fund.name.toLowerCase().includes(searchTerm) ||
          fund.category.toLowerCase().includes(searchTerm) ||
          fund.fundHouse.toLowerCase().includes(searchTerm)
        );
        break;

      case 'etfs':
        const etfs = etfsData.getETFs();
        results = etfs.filter(etf => 
          etf.name.toLowerCase().includes(searchTerm) ||
          etf.symbol.toLowerCase().includes(searchTerm) ||
          etf.type.toLowerCase().includes(searchTerm)
        );
        break;

      case 'pre-ipo':
        const preIPOCompanies = preIPOData.getPreIPOCompanies();
        results = preIPOCompanies.filter(company => 
          company.name.toLowerCase().includes(searchTerm) ||
          company.sector.toLowerCase().includes(searchTerm) ||
          company.description.toLowerCase().includes(searchTerm)
        );
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid category. Use: stocks, mutual-funds, etfs, or pre-ipo'
        });
    }

    res.json({
      success: true,
      data: results,
      category,
      query: searchTerm,
      totalResults: results.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error performing category search',
      error: error.message
    });
  }
});

module.exports = router;