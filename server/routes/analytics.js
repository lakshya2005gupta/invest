const express = require('express');
const router = express.Router();
const stocksData = require('../data/stocksData');
const mutualFundsData = require('../data/mutualFundsData');
const etfsData = require('../data/etfsData');
const preIPOData = require('../data/preIPOData');
const marketData = require('../data/marketData');

// Get analytics overview
router.get('/overview', (req, res) => {
  try {
    const stocks = stocksData.getStocks();
    const mutualFunds = mutualFundsData.getMutualFunds();
    const etfs = etfsData.getETFs();
    const preIPOCompanies = preIPOData.getPreIPOCompanies();
    const marketIndices = marketData.getMarketIndices();

    // Calculate market statistics
    const totalStocks = stocks.length;
    const gainers = stocks.filter(stock => stock.change > 0).length;
    const losers = stocks.filter(stock => stock.change < 0).length;
    
    const avgStockChange = stocks.reduce((sum, stock) => sum + stock.change, 0) / totalStocks;
    
    // Top performing stocks
    const topGainers = stocks
      .filter(stock => stock.change > 0)
      .sort((a, b) => b.change - a.change)
      .slice(0, 5);
    
    const topLosers = stocks
      .filter(stock => stock.change < 0)
      .sort((a, b) => a.change - b.change)
      .slice(0, 5);

    // Mutual fund statistics
    const avgMFReturns = mutualFunds.reduce((sum, fund) => {
      const returns = parseFloat(fund.returns1y.replace('%', ''));
      return sum + returns;
    }, 0) / mutualFunds.length;

    // Sector analysis
    const sectorPerformance = {};
    stocks.forEach(stock => {
      if (!sectorPerformance[stock.sector]) {
        sectorPerformance[stock.sector] = {
          count: 0,
          totalChange: 0,
          avgChange: 0
        };
      }
      sectorPerformance[stock.sector].count++;
      sectorPerformance[stock.sector].totalChange += stock.change;
    });

    Object.keys(sectorPerformance).forEach(sector => {
      sectorPerformance[sector].avgChange = 
        sectorPerformance[sector].totalChange / sectorPerformance[sector].count;
    });

    const analytics = {
      marketOverview: {
        totalStocks,
        gainers,
        losers,
        avgChange: Math.round(avgStockChange * 100) / 100,
        marketSentiment: avgStockChange > 0 ? 'Bullish' : 'Bearish'
      },
      topPerformers: {
        gainers: topGainers,
        losers: topLosers
      },
      mutualFunds: {
        totalFunds: mutualFunds.length,
        avgReturns: Math.round(avgMFReturns * 100) / 100
      },
      etfs: {
        totalETFs: etfs.length,
        categories: [...new Set(etfs.map(etf => etf.type))]
      },
      preIPO: {
        totalCompanies: preIPOCompanies.length,
        sectors: [...new Set(preIPOCompanies.map(company => company.sector))]
      },
      sectorPerformance: Object.entries(sectorPerformance)
        .map(([sector, data]) => ({
          sector,
          ...data,
          avgChange: Math.round(data.avgChange * 100) / 100
        }))
        .sort((a, b) => b.avgChange - a.avgChange),
      marketIndices: marketIndices.map(index => ({
        name: index.name,
        value: index.value,
        change: index.change,
        positive: index.positive
      }))
    };

    res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
});

// Get sector analysis
router.get('/sectors', (req, res) => {
  try {
    const stocks = stocksData.getStocks();
    
    const sectorData = {};
    stocks.forEach(stock => {
      if (!sectorData[stock.sector]) {
        sectorData[stock.sector] = {
          sector: stock.sector,
          stocks: [],
          totalMarketCap: 0,
          avgChange: 0,
          count: 0
        };
      }
      
      sectorData[stock.sector].stocks.push({
        name: stock.name,
        symbol: stock.symbol,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent
      });
      
      sectorData[stock.sector].count++;
      sectorData[stock.sector].avgChange += stock.change;
    });

    // Calculate averages
    Object.keys(sectorData).forEach(sector => {
      sectorData[sector].avgChange = 
        Math.round((sectorData[sector].avgChange / sectorData[sector].count) * 100) / 100;
    });

    const sectors = Object.values(sectorData).sort((a, b) => b.avgChange - a.avgChange);

    res.json({
      success: true,
      data: sectors,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sector analysis',
      error: error.message
    });
  }
});

module.exports = router;