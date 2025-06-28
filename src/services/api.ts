const API_BASE_URL = 'http://localhost:5000/api';

// API service class
class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Stocks API with caching
  async getStocks(forceRefresh = false) {
    const endpoint = forceRefresh ? '/stocks?refresh=true' : '/stocks';
    return this.request(endpoint);
  }

  async getStock(id: number) {
    return this.request(`/stocks/${id}`);
  }

  async refreshStocks() {
    return this.request('/stocks/refresh', { method: 'POST' });
  }

  // Mutual Funds API with caching
  async getMutualFunds(forceRefresh = false) {
    const endpoint = forceRefresh ? '/mutual-funds?refresh=true' : '/mutual-funds';
    return this.request(endpoint);
  }

  async getMutualFund(id: number) {
    return this.request(`/mutual-funds/${id}`);
  }

  async refreshMutualFunds() {
    return this.request('/mutual-funds/refresh', { method: 'POST' });
  }

  // ETFs API
  async getETFs(forceRefresh = false) {
    const endpoint = forceRefresh ? '/etfs?refresh=true' : '/etfs';
    return this.request(endpoint);
  }

  // Bank Deposits API
  async getBankDeposits() {
    return this.request('/bank-deposits');
  }

  async getFDs() {
    return this.request('/bank-deposits/fd');
  }

  async getRDs() {
    return this.request('/bank-deposits/rd');
  }

  // Pre-IPO API with caching
  async getPreIPOCompanies(forceRefresh = false) {
    const endpoint = forceRefresh ? '/pre-ipo?refresh=true' : '/pre-ipo';
    return this.request(endpoint);
  }

  async getPreIPOCompany(id: number) {
    return this.request(`/pre-ipo/${id}`);
  }

  async investInPreIPO(companyId: number, tokens: number, walletAddress: string) {
    return this.request('/pre-ipo/invest', {
      method: 'POST',
      body: JSON.stringify({ companyId, tokens, walletAddress }),
    });
  }

  // Market Indices API with caching
  async getMarketIndices(forceRefresh = false) {
    const endpoint = forceRefresh ? '/market-indices?refresh=true' : '/market-indices';
    return this.request(endpoint);
  }

  async refreshMarketIndices() {
    return this.request('/market-indices/refresh', { method: 'POST' });
  }

  // Cache status
  async getCacheStatus() {
    return this.request('/market-indices/status/cache');
  }

  // Portfolio API
  async getPortfolio(pan: string) {
    return this.request(`/portfolio/${pan}`);
  }

  // Search API
  async search(query: string) {
    return this.request(`/search?q=${encodeURIComponent(query)}`);
  }

  // Analytics API
  async getAnalyticsOverview() {
    return this.request('/analytics/overview');
  }

  // Calculators API
  async calculateFDMaturity(principal: number, rate: number, tenure: number) {
    return this.request('/calculate/fd-maturity', {
      method: 'POST',
      body: JSON.stringify({ principal, rate, tenure }),
    });
  }

  async calculateRDMaturity(monthlyDeposit: number, rate: number, tenure: number) {
    return this.request('/calculate/rd-maturity', {
      method: 'POST',
      body: JSON.stringify({ monthlyDeposit, rate, tenure }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;