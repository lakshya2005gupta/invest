const cron = require('node-cron');
const yahooFinance = require('yahoo-finance2').default;
const stocksData = require('../data/stocksData');
const mutualFundsData = require('../data/mutualFundsData');
const etfsData = require('../data/etfsData');
const preIPOData = require('../data/preIPOData');
const marketData = require('../data/marketData');
const amfiService = require('./amfiService');
const cacheService = require('./cacheService');

class PriceUpdateService {
  constructor() {
    this.isUpdating = false;
    this.lastFullUpdate = null;
    this.updateInterval = 60 * 60 * 1000; // 1 hour
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

  async updateStockPrices(forceUpdate = false) {
    const cacheKey = 'stocks';
    
    // Check if we need to update
    if (!forceUpdate && cacheService.isValid(cacheKey)) {
      console.log(`Stocks cache is valid (${cacheService.getCacheAge(cacheKey)} minutes old), skipping update`);
      return cacheService.get(cacheKey);
    }

    if (cacheService.isUpdating(cacheKey)) {
      console.log('Stocks update already in progress, returning cached data');
      return cacheService.get(cacheKey) || stocksData.getStocks();
    }

    console.log('Updating stock prices...');
    cacheService.setUpdating(cacheKey, true);

    try {
      const stocks = stocksData.getStocks();
      const updatedStocks = [];

      for (let stock of stocks) {
        try {
          const realData = await this.fetchRealStockPrice(stock.symbol);
          if (realData) {
            const updatedStock = {
              ...stock,
              price: realData.price,
              change: realData.change,
              changePercent: `${realData.changePercent >= 0 ? '+' : ''}${realData.changePercent.toFixed(2)}%`,
              lastUpdated: new Date()
            };
            stocksData.updateStock(stock.id, updatedStock);
            updatedStocks.push(updatedStock);
          } else {
            // Fallback to simulation
            const oldPrice = stock.price;
            const newPrice = this.simulatePriceChange(stock.price, 0.01);
            const change = Math.round((newPrice - oldPrice) * 100) / 100;
            
            const updatedStock = {
              ...stock,
              price: newPrice,
              change: change,
              changePercent: `${change >= 0 ? '+' : ''}${((change / oldPrice) * 100).toFixed(2)}%`,
              lastUpdated: new Date()
            };
            stocksData.updateStock(stock.id, updatedStock);
            updatedStocks.push(updatedStock);
          }
        } catch (error) {
          console.error(`Error updating stock ${stock.symbol}:`, error.message);
          updatedStocks.push(stock); // Keep original data if update fails
        }
      }

      cacheService.set(cacheKey, updatedStocks);
      return updatedStocks;
    } finally {
      cacheService.setUpdating(cacheKey, false);
    }
  }

  async updateMutualFundNAVs(forceUpdate = false) {
    const cacheKey = 'mutualFunds';
    
    if (!forceUpdate && cacheService.isValid(cacheKey)) {
      console.log(`Mutual funds cache is valid (${cacheService.getCacheAge(cacheKey)} minutes old), skipping update`);
      return cacheService.get(cacheKey);
    }

    if (cacheService.isUpdating(cacheKey)) {
      console.log('Mutual funds update already in progress, returning cached data');
      return cacheService.get(cacheKey) || mutualFundsData.getMutualFunds();
    }

    console.log('Updating mutual fund NAVs from AMFI...');
    cacheService.setUpdating(cacheKey, true);

    try {
      const currentFunds = mutualFundsData.getMutualFunds();
      const updatedFunds = await amfiService.updateAllFundsNAV(currentFunds);
      
      // Update each fund individually
      updatedFunds.forEach(fund => {
        mutualFundsData.updateMutualFund(fund.id, fund);
      });
      
      cacheService.set(cacheKey, updatedFunds);
      console.log('Successfully updated mutual fund NAVs');
      return updatedFunds;
    } catch (error) {
      console.error('Error updating mutual fund NAVs:', error.message);
      
      // Fallback to simulation if AMFI fails
      console.log('Falling back to simulated NAV updates...');
      const simulatedFunds = [];
      mutualFundsData.updateAllMutualFunds(fund => {
        const oldNav = fund.nav;
        const newNav = this.simulatePriceChange(fund.nav, 0.005);
        const change = Math.round((newNav - oldNav) * 100) / 100;
        
        const updatedFund = {
          ...fund,
          nav: newNav,
          change: change,
          changePercent: `${change >= 0 ? '+' : ''}${((change / oldNav) * 100).toFixed(2)}%`,
          lastUpdated: new Date()
        };
        simulatedFunds.push(updatedFund);
        return updatedFund;
      });
      
      cacheService.set(cacheKey, simulatedFunds);
      return simulatedFunds;
    } finally {
      cacheService.setUpdating(cacheKey, false);
    }
  }

  updateETFPrices(forceUpdate = false) {
    const cacheKey = 'etfs';
    
    if (!forceUpdate && cacheService.isValid(cacheKey)) {
      console.log(`ETFs cache is valid (${cacheService.getCacheAge(cacheKey)} minutes old), skipping update`);
      return cacheService.get(cacheKey);
    }

    console.log('Updating ETF prices...');
    const updatedETFs = [];
    
    etfsData.updateAllETFs(etf => {
      const oldPrice = etf.price;
      const newPrice = this.simulatePriceChange(etf.price, 0.008);
      const change = Math.round((newPrice - oldPrice) * 100) / 100;
      
      const updatedETF = {
        ...etf,
        price: newPrice,
        change: change,
        changePercent: `${change >= 0 ? '+' : ''}${((change / oldPrice) * 100).toFixed(2)}%`,
        lastUpdated: new Date()
      };
      updatedETFs.push(updatedETF);
      return updatedETF;
    });

    cacheService.set(cacheKey, updatedETFs);
    return updatedETFs;
  }

  updatePreIPOPrices(forceUpdate = false) {
    const cacheKey = 'preIPO';
    
    if (!forceUpdate && cacheService.isValid(cacheKey)) {
      console.log(`Pre-IPO cache is valid (${cacheService.getCacheAge(cacheKey)} minutes old), skipping update`);
      return cacheService.get(cacheKey);
    }

    console.log('Updating Pre-IPO token prices...');
    const updatedCompanies = [];
    
    preIPOData.updateAllPreIPO(company => {
      const updatedCompany = {
        ...company,
        tokenPrice: this.simulatePriceChange(company.tokenPrice, 0.015),
        lastUpdated: new Date()
      };
      updatedCompanies.push(updatedCompany);
      return updatedCompany;
    });

    cacheService.set(cacheKey, updatedCompanies);
    return updatedCompanies;
  }

  updateMarketIndices(forceUpdate = false) {
    const cacheKey = 'marketIndices';
    
    if (!forceUpdate && cacheService.isValid(cacheKey)) {
      console.log(`Market indices cache is valid (${cacheService.getCacheAge(cacheKey)} minutes old), skipping update`);
      return cacheService.get(cacheKey);
    }

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
    cacheService.set(cacheKey, updatedIndices);
    return updatedIndices;
  }

  async performFullUpdate(forceUpdate = false) {
    if (this.isUpdating && !forceUpdate) {
      console.log('Update already in progress, skipping...');
      return;
    }

    this.isUpdating = true;
    const startTime = Date.now();
    console.log(`Starting ${forceUpdate ? 'forced' : 'scheduled'} price update at:`, new Date().toISOString());

    try {
      await Promise.all([
        this.updateStockPrices(forceUpdate),
        this.updateMutualFundNAVs(forceUpdate),
        this.updateETFPrices(forceUpdate),
        this.updatePreIPOPrices(forceUpdate),
        this.updateMarketIndices(forceUpdate)
      ]);
      
      this.lastFullUpdate = new Date();
      const duration = Date.now() - startTime;
      console.log(`Full price update completed successfully in ${duration}ms`);
    } catch (error) {
      console.error('Error during price update:', error.message);
    } finally {
      this.isUpdating = false;
    }
  }

  // Force refresh all data (called on page refresh)
  async forceRefresh() {
    console.log('Force refresh requested - invalidating all caches');
    cacheService.clear();
    return await this.performFullUpdate(true);
  }

  // Get cached data or fetch if needed
  async getCachedData(dataType) {
    switch (dataType) {
      case 'stocks':
        return await this.updateStockPrices();
      case 'mutualFunds':
        return await this.updateMutualFundNAVs();
      case 'etfs':
        return this.updateETFPrices();
      case 'preIPO':
        return this.updatePreIPOPrices();
      case 'marketIndices':
        return this.updateMarketIndices();
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }
  }

  startPriceUpdates() {
    console.log('Starting smart price update service...');
    
    // Initial update
    this.performFullUpdate(true);
    
    // Schedule updates every hour
    cron.schedule('0 * * * *', () => {
      console.log('Hourly scheduled update triggered');
      this.performFullUpdate();
    });

    // Schedule AMFI data refresh every 2 hours
    cron.schedule('0 */2 * * *', async () => {
      try {
        console.log('Refreshing AMFI data cache...');
        await amfiService.fetchAMFIData();
      } catch (error) {
        console.error('Error refreshing AMFI data:', error.message);
      }
    });

    console.log('✅ Smart caching enabled:');
    console.log('   📊 Auto-update: Every 1 hour');
    console.log('   🔄 Manual refresh: On page reload');
    console.log('   💾 Cache duration: 1 hour');
  }

  // Get service status
  getStatus() {
    return {
      isUpdating: this.isUpdating,
      lastFullUpdate: this.lastFullUpdate,
      cacheStats: cacheService.getStats(),
      nextScheduledUpdate: this.lastFullUpdate ? 
        new Date(this.lastFullUpdate.getTime() + this.updateInterval) : null
    };
  }
}

module.exports = new PriceUpdateService();