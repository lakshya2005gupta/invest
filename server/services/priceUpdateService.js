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
    this.lastUpdateTime = null;
    this.updateInterval = 60 * 60 * 1000; // 1 hour
    this.forceUpdateRequests = new Set();
    this.updateStats = {
      totalUpdates: 0,
      successfulUpdates: 0,
      failedUpdates: 0,
      lastError: null
    };
  }

  // Helper function to simulate price fluctuations
  simulatePriceChange(currentPrice, volatility = 0.02) {
    const change = (Math.random() - 0.5) * 2 * volatility;
    return Math.round((currentPrice * (1 + change)) * 100) / 100;
  }

  // Function to fetch real stock prices from Yahoo Finance
  async fetchRealStockPrice(symbol) {
    try {
      const quote = await yahooFinance.quote(symbol, {
        fields: ['regularMarketPrice', 'regularMarketChange', 'regularMarketChangePercent']
      });
      
      return {
        price: quote.regularMarketPrice || quote.price,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0
      };
    } catch (error) {
      console.error(`Error fetching real price for ${symbol}:`, error.message);
      return null;
    }
  }

  async updateStockPrices() {
    console.log('Updating stock prices...');
    const cacheKey = 'stocks_data';
    
    // Check if we have cached data and should use it
    const cachedStocks = cacheService.get(cacheKey);
    if (cachedStocks && !this.shouldForceUpdate()) {
      console.log(`Using cached stock data (${cacheService.getCacheAge(cacheKey)} minutes old)`);
      return cachedStocks;
    }

    const stocks = stocksData.getStocks();
    const updatedStocks = [];
    let successCount = 0;
    let failCount = 0;

    for (let stock of stocks) {
      try {
        // Try to get real data first
        const realData = await this.fetchRealStockPrice(stock.symbol);
        
        if (realData && realData.price) {
          const updatedStock = {
            ...stock,
            price: realData.price,
            change: realData.change,
            changePercent: `${realData.changePercent >= 0 ? '+' : ''}${realData.changePercent.toFixed(2)}%`,
            lastUpdated: new Date()
          };
          stocksData.updateStock(stock.id, updatedStock);
          updatedStocks.push(updatedStock);
          successCount++;
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
          failCount++;
        }
      } catch (error) {
        console.error(`Error updating stock ${stock.symbol}:`, error.message);
        updatedStocks.push(stock);
        failCount++;
      }
    }

    console.log(`Stock update complete: ${successCount} real prices, ${failCount} simulated`);
    
    // Cache the updated data
    cacheService.set(cacheKey, updatedStocks);
    return updatedStocks;
  }

  async updateMutualFundNAVs() {
    console.log('Updating mutual fund NAVs...');
    const cacheKey = 'mutual_funds_data';
    
    // Check if we have cached data and should use it
    const cachedFunds = cacheService.get(cacheKey);
    if (cachedFunds && !this.shouldForceUpdate()) {
      console.log(`Using cached mutual fund data (${cacheService.getCacheAge(cacheKey)} minutes old)`);
      return cachedFunds;
    }

    try {
      const currentFunds = mutualFundsData.getMutualFunds();
      console.log(`Updating NAVs for ${currentFunds.length} mutual funds...`);
      
      const updatedFunds = await amfiService.updateAllFundsNAV(currentFunds);
      
      // Update each fund individually
      updatedFunds.forEach(fund => {
        mutualFundsData.updateMutualFund(fund.id, fund);
      });
      
      // Cache the updated data
      cacheService.set(cacheKey, updatedFunds);
      console.log('Successfully updated mutual fund NAVs from AMFI');
      
      this.updateStats.successfulUpdates++;
      return updatedFunds;
      
    } catch (error) {
      console.error('Error updating mutual fund NAVs:', error.message);
      this.updateStats.failedUpdates++;
      this.updateStats.lastError = error.message;
      
      // Fallback to simulation if AMFI fails
      console.log('Falling back to simulated NAV updates...');
      const simulatedFunds = mutualFundsData.getMutualFunds().map(fund => {
        const oldNav = fund.nav;
        const newNav = this.simulatePriceChange(fund.nav, 0.005);
        const change = Math.round((newNav - oldNav) * 100) / 100;
        
        const updatedFund = {
          ...fund,
          nav: newNav,
          change: change,
          changePercent: `${change >= 0 ? '+' : ''}${((change / oldNav) * 100).toFixed(2)}%`,
          lastUpdated: new Date(),
          navDate: new Date().toISOString().split('T')[0]
        };
        
        mutualFundsData.updateMutualFund(fund.id, updatedFund);
        return updatedFund;
      });

      cacheService.set(cacheKey, simulatedFunds);
      return simulatedFunds;
    }
  }

  updateETFPrices() {
    console.log('Updating ETF prices...');
    const cacheKey = 'etfs_data';
    
    // Check if we have cached data
    const cachedETFs = cacheService.get(cacheKey);
    if (cachedETFs && !this.shouldForceUpdate()) {
      console.log(`Using cached ETF data (${cacheService.getCacheAge(cacheKey)} minutes old)`);
      return cachedETFs;
    }

    const updatedETFs = etfsData.getETFs().map(etf => {
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
      
      etfsData.updateETF(etf.id, updatedETF);
      return updatedETF;
    });

    cacheService.set(cacheKey, updatedETFs);
    return updatedETFs;
  }

  updatePreIPOPrices() {
    console.log('Updating Pre-IPO token prices...');
    const cacheKey = 'preipo_data';
    
    // Check if we have cached data
    const cachedPreIPO = cacheService.get(cacheKey);
    if (cachedPreIPO && !this.shouldForceUpdate()) {
      console.log(`Using cached Pre-IPO data (${cacheService.getCacheAge(cacheKey)} minutes old)`);
      return cachedPreIPO;
    }

    const updatedCompanies = preIPOData.getPreIPOCompanies().map(company => {
      const updatedCompany = {
        ...company,
        tokenPrice: this.simulatePriceChange(company.tokenPrice, 0.015),
        lastUpdated: new Date()
      };
      
      preIPOData.updatePreIPO(company.id, updatedCompany);
      return updatedCompany;
    });

    cacheService.set(cacheKey, updatedCompanies);
    return updatedCompanies;
  }

  updateMarketIndices() {
    console.log('Updating market indices...');
    const cacheKey = 'market_indices_data';
    
    // Check if we have cached data
    const cachedIndices = cacheService.get(cacheKey);
    if (cachedIndices && !this.shouldForceUpdate()) {
      console.log(`Using cached market indices data (${cacheService.getCacheAge(cacheKey)} minutes old)`);
      return cachedIndices;
    }

    const indices = marketData.getMarketIndices();
    
    const updatedIndices = indices.map(index => {
      // Handle different value formats
      let oldValue;
      if (typeof index.value === 'string') {
        oldValue = parseFloat(index.value.replace(/[,$]/g, ''));
      } else {
        oldValue = index.value;
      }
      
      const newValue = this.simulatePriceChange(oldValue, 0.005);
      const change = newValue - oldValue;
      const changePercent = (change / oldValue) * 100;
      
      return {
        ...index,
        value: index.name.includes('APT') || index.name.includes('USD') 
          ? `$${newValue.toFixed(2)}`
          : newValue.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
        change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}`,
        percent: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
        positive: change >= 0
      };
    });

    marketData.updateMarketIndices(updatedIndices);
    cacheService.set(cacheKey, updatedIndices);
    return updatedIndices;
  }

  // Check if we should force update (user refresh or cache expired)
  shouldForceUpdate() {
    return this.forceUpdateRequests.size > 0;
  }

  // Request force update (called when user refreshes)
  requestForceUpdate(clientId = 'default') {
    this.forceUpdateRequests.add(clientId);
    console.log(`Force update requested by client: ${clientId}`);
  }

  // Clear force update requests
  clearForceUpdateRequests() {
    this.forceUpdateRequests.clear();
  }

  async performFullUpdate(forceUpdate = false) {
    if (this.isUpdating && !forceUpdate) {
      console.log('Update already in progress, skipping...');
      return;
    }

    // Check if we need to update based on time
    const now = Date.now();
    if (!forceUpdate && this.lastUpdateTime && (now - this.lastUpdateTime) < this.updateInterval) {
      const minutesLeft = Math.ceil((this.updateInterval - (now - this.lastUpdateTime)) / (1000 * 60));
      console.log(`Skipping update, next scheduled update in ${minutesLeft} minutes`);
      return;
    }

    this.isUpdating = true;
    this.updateStats.totalUpdates++;
    console.log(`Starting ${forceUpdate ? 'forced' : 'scheduled'} price update at:`, new Date().toISOString());

    try {
      const updatePromises = [
        this.updateStockPrices(),
        this.updateMutualFundNAVs(),
        this.updateETFPrices(),
        this.updatePreIPOPrices(),
        this.updateMarketIndices()
      ];

      await Promise.allSettled(updatePromises);
      
      this.lastUpdateTime = now;
      this.clearForceUpdateRequests();
      
      console.log('Full price update completed successfully');
      console.log('Update stats:', this.updateStats);
      
    } catch (error) {
      console.error('Error during price update:', error.message);
      this.updateStats.failedUpdates++;
      this.updateStats.lastError = error.message;
    } finally {
      this.isUpdating = false;
    }
  }

  startPriceUpdates() {
    console.log('Starting smart caching price update service...');
    
    // Initial update
    this.performFullUpdate(true);
    
    // Schedule updates every hour
    cron.schedule('0 * * * *', () => {
      console.log('Scheduled hourly update triggered');
      this.performFullUpdate();
    });

    // Schedule AMFI data refresh every 2 hours
    cron.schedule('0 */2 * * *', async () => {
      try {
        console.log('Refreshing AMFI data cache...');
        await amfiService.forceRefresh();
      } catch (error) {
        console.error('Error refreshing AMFI data:', error.message);
      }
    });

    // Schedule daily cache cleanup at midnight
    cron.schedule('0 0 * * *', () => {
      console.log('Performing daily cache cleanup...');
      cacheService.clear();
    });

    console.log('Smart caching enabled - updates every hour or on user refresh');
    console.log('AMFI data refreshes every 2 hours');
    console.log('Cache cleanup runs daily at midnight');
  }

  // Get service statistics
  getServiceStats() {
    return {
      ...this.updateStats,
      isUpdating: this.isUpdating,
      lastUpdateTime: this.lastUpdateTime,
      nextUpdateTime: this.lastUpdateTime ? this.lastUpdateTime + this.updateInterval : null,
      forceUpdateRequests: this.forceUpdateRequests.size,
      amfiStats: amfiService.getCacheStats(),
      cacheStats: cacheService.getStats()
    };
  }

  // Get cache statistics
  getCacheStats() {
    return cacheService.getStats();
  }
}

module.exports = new PriceUpdateService();