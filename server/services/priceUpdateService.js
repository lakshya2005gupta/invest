const cron = require('node-cron');
const yahooFinance = require('yahoo-finance2').default;
const stocksData = require('../data/stocksData');
const mutualFundsData = require('../data/mutualFundsData');
const etfsData = require('../data/etfsData');
const preIPOData = require('../data/preIPOData');
const marketData = require('../data/marketData');
const amfiService = require('./amfiService');

class PriceUpdateService {
  constructor() {
    this.isUpdating = false;
  }

  // Helper function to simulate price fluctuations
  simulatePriceChange(currentPrice, volatility = 0.02) {
    const change = (Math.random() - 0.5) * 2 * volatility;
    return Math.round((currentPrice * (1 + change)) * 100) / 100;
  }

  // Function to fetch real stock prices from Yahoo Finance
  async fetchRealStockPrice(symbol) {
    try {
      const quote = await yahooFinance.quote(symbol);
      return {
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent
      };
    } catch (error) {
      console.error(`Error fetching real price for ${symbol}:`, error.message);
      return null;
    }
  }

  async updateStockPrices() {
    console.log('Updating stock prices...');
    const stocks = stocksData.getStocks();

    for (let stock of stocks) {
      try {
        const realData = await this.fetchRealStockPrice(stock.symbol);
        if (realData) {
          stocksData.updateStock(stock.id, {
            price: realData.price,
            change: realData.change,
            changePercent: `${realData.changePercent >= 0 ? '+' : ''}${realData.changePercent.toFixed(2)}%`,
            lastUpdated: new Date()
          });
        } else {
          // Fallback to simulation
          const oldPrice = stock.price;
          const newPrice = this.simulatePriceChange(stock.price, 0.01);
          const change = Math.round((newPrice - oldPrice) * 100) / 100;
          
          stocksData.updateStock(stock.id, {
            price: newPrice,
            change: change,
            changePercent: `${change >= 0 ? '+' : ''}${((change / oldPrice) * 100).toFixed(2)}%`,
            lastUpdated: new Date()
          });
        }
      } catch (error) {
        console.error(`Error updating stock ${stock.symbol}:`, error.message);
      }
    }
  }

  async updateMutualFundNAVs() {
    console.log('Updating mutual fund NAVs from AMFI...');
    try {
      const currentFunds = mutualFundsData.getMutualFunds();
      const updatedFunds = await amfiService.updateAllFundsNAV(currentFunds);
      
      // Update each fund individually
      updatedFunds.forEach(fund => {
        mutualFundsData.updateMutualFund(fund.id, fund);
      });
      
      console.log('Successfully updated mutual fund NAVs');
    } catch (error) {
      console.error('Error updating mutual fund NAVs:', error.message);
      
      // Fallback to simulation if AMFI fails
      console.log('Falling back to simulated NAV updates...');
      mutualFundsData.updateAllMutualFunds(fund => {
        const oldNav = fund.nav;
        const newNav = this.simulatePriceChange(fund.nav, 0.005);
        const change = Math.round((newNav - oldNav) * 100) / 100;
        
        return {
          ...fund,
          nav: newNav,
          change: change,
          changePercent: `${change >= 0 ? '+' : ''}${((change / oldNav) * 100).toFixed(2)}%`,
          lastUpdated: new Date()
        };
      });
    }
  }

  updateETFPrices() {
    console.log('Updating ETF prices...');
    etfsData.updateAllETFs(etf => {
      const oldPrice = etf.price;
      const newPrice = this.simulatePriceChange(etf.price, 0.008);
      const change = Math.round((newPrice - oldPrice) * 100) / 100;
      
      return {
        ...etf,
        price: newPrice,
        change: change,
        changePercent: `${change >= 0 ? '+' : ''}${((change / oldPrice) * 100).toFixed(2)}%`,
        lastUpdated: new Date()
      };
    });
  }

  updatePreIPOPrices() {
    console.log('Updating Pre-IPO token prices...');
    preIPOData.updateAllPreIPO(company => ({
      ...company,
      tokenPrice: this.simulatePriceChange(company.tokenPrice, 0.015),
      lastUpdated: new Date()
    }));
  }

  updateMarketIndices() {
    console.log('Updating market indices...');
    const indices = marketData.getMarketIndices();
    
    const updatedIndices = indices.map(index => {
      const oldValue = parseFloat(index.value.replace(/[,$]/g, ''));
      const newValue = this.simulatePriceChange(oldValue, 0.005);
      const change = newValue - oldValue;
      const changePercent = (change / oldValue) * 100;
      
      return {
        ...index,
        value: newValue.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
        change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}`,
        percent: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
        positive: change >= 0
      };
    });

    marketData.updateMarketIndices(updatedIndices);
  }

  async performFullUpdate() {
    if (this.isUpdating) {
      console.log('Update already in progress, skipping...');
      return;
    }

    this.isUpdating = true;
    console.log('Starting full price update at:', new Date().toISOString());

    try {
      await Promise.all([
        this.updateStockPrices(),
        this.updateMutualFundNAVs(),
        this.updateETFPrices(),
        this.updatePreIPOPrices(),
        this.updateMarketIndices()
      ]);
      
      console.log('Full price update completed successfully');
    } catch (error) {
      console.error('Error during price update:', error.message);
    } finally {
      this.isUpdating = false;
    }
  }

  startPriceUpdates() {
    console.log('Starting price update service...');
    
    // Initial update
    this.performFullUpdate();
    
    // Schedule updates every 30 seconds
    cron.schedule('*/30 * * * * *', () => {
      this.performFullUpdate();
    });

    // Schedule AMFI data refresh every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      try {
        console.log('Refreshing AMFI data cache...');
        await amfiService.fetchAMFIData();
      } catch (error) {
        console.error('Error refreshing AMFI data:', error.message);
      }
    });
  }
}

module.exports = new PriceUpdateService();