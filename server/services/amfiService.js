const axios = require('axios');

class AMFIService {
  constructor() {
    this.baseURL = 'https://www.amfiindia.com/spages/NAVAll.txt';
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  async fetchAMFIData() {
    try {
      console.log('Fetching AMFI data...');
      const response = await axios.get(this.baseURL, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.data) {
        throw new Error('No data received from AMFI');
      }

      const lines = response.data.split('\n');
      const funds = new Map();

      for (const line of lines) {
        if (!line.trim() || line.startsWith('Scheme Code')) continue;
        
        const parts = line.split(';');
        if (parts.length < 5) continue;

        const schemeCode = parts[0]?.trim();
        const isinDivPayoutGrowth = parts[1]?.trim();
        const isinDivReinvestment = parts[2]?.trim();
        const schemeName = parts[3]?.trim();
        const navString = parts[4]?.trim();
        const date = parts[5]?.trim();

        if (!schemeCode || !schemeName || !navString || navString === 'N.A.') continue;

        const nav = parseFloat(navString);
        if (isNaN(nav)) continue;

        funds.set(schemeCode, {
          schemeCode,
          schemeName,
          nav,
          date,
          isinDivPayoutGrowth,
          isinDivReinvestment
        });
      }

      this.cache.set('amfiData', {
        data: funds,
        timestamp: Date.now()
      });

      console.log(`Successfully fetched ${funds.size} mutual fund NAVs from AMFI`);
      return funds;

    } catch (error) {
      console.error('Error fetching AMFI data:', error.message);
      
      // Return cached data if available
      const cached = this.cache.get('amfiData');
      if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry * 2) {
        console.log('Using cached AMFI data due to fetch error');
        return cached.data;
      }
      
      throw error;
    }
  }

  async getNAVBySchemeCode(schemeCode) {
    try {
      let amfiData = null;
      const cached = this.cache.get('amfiData');
      
      if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
        amfiData = cached.data;
      } else {
        amfiData = await this.fetchAMFIData();
      }

      const fund = amfiData.get(schemeCode);
      return fund ? fund.nav : null;

    } catch (error) {
      console.error(`Error getting NAV for scheme code ${schemeCode}:`, error.message);
      return null;
    }
  }

  async searchFundByName(fundName) {
    try {
      let amfiData = null;
      const cached = this.cache.get('amfiData');
      
      if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
        amfiData = cached.data;
      } else {
        amfiData = await this.fetchAMFIData();
      }

      const searchTerm = fundName.toLowerCase().trim();
      const results = [];

      for (const [schemeCode, fund] of amfiData) {
        if (fund.schemeName.toLowerCase().includes(searchTerm)) {
          results.push(fund);
        }
      }

      return results;

    } catch (error) {
      console.error(`Error searching fund by name ${fundName}:`, error.message);
      return [];
    }
  }

  async updateAllFundsNAV(mutualFunds) {
    try {
      let amfiData = null;
      const cached = this.cache.get('amfiData');
      
      if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
        amfiData = cached.data;
      } else {
        amfiData = await this.fetchAMFIData();
      }

      const updatedFunds = mutualFunds.map(fund => {
        const amfiFund = amfiData.get(fund.schemeCode);
        if (amfiFund) {
          const oldNav = fund.nav;
          const newNav = amfiFund.nav;
          const change = newNav - oldNav;
          const changePercent = oldNav > 0 ? ((change / oldNav) * 100).toFixed(2) : '0.00';

          return {
            ...fund,
            nav: newNav,
            change: parseFloat(change.toFixed(2)),
            changePercent: `${change >= 0 ? '+' : ''}${changePercent}%`,
            lastUpdated: new Date()
          };
        }
        return fund;
      });

      console.log('Updated mutual fund NAVs from AMFI data');
      return updatedFunds;

    } catch (error) {
      console.error('Error updating mutual fund NAVs:', error.message);
      return mutualFunds; // Return original data if update fails
    }
  }
}

module.exports = new AMFIService();