const API_BASE_URL = 'https://invest360-wjmn.onrender.com/api';

// API service class with smart caching support
class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options?.headers,
      };

      // Add cache control header for force refresh
      if (this.shouldForceRefresh()) {
        headers['Cache-Control'] = 'no-cache';
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers,
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

  // Check if we should force refresh (e.g., user manually refreshed)
  private shouldForceRefresh(): boolean {
    // Check if page was refreshed recently (within last 5 seconds)
    const lastRefresh = sessionStorage.getItem('lastRefresh');
    const now = Date.now();
    
    if (lastRefresh && (now - parseInt(lastRefresh)) < 5000) {
      return true;
    }
    
    return false;
  }

  // Mark page as refreshed
  markPageRefresh(): void {
    sessionStorage.setItem('lastRefresh', Date.now().toString());
  }

  // Stocks API
  async getStocks() {
    return this.request('/stocks');
  }

  async getStock(id: number) {
    return this.request(`/stocks/${id}`);
  }

  // Mutual Funds API
  async getMutualFunds() {
    return this.request('/mutual-funds');
  }

  async getMutualFund(id: number) {
    return this.request(`/mutual-funds/${id}`);
  }

  // ETFs API
  async getETFs() {
    return this.request('/etfs');
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

  // Pre-IPO API
  async getPreIPOCompanies() {
    return this.request('/pre-ipo');
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

  // Market Indices API
  async getMarketIndices() {
    return this.request('/market-indices');
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

  // Cache API
  async getCacheStats() {
    return this.request('/cache/stats');
  }

  async refreshCache() {
    return this.request('/cache/refresh', {
      method: 'POST',
      body: JSON.stringify({ clientId: this.getClientId() }),
    });
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

  // Get unique client ID
  private getClientId(): string {
    let clientId = sessionStorage.getItem('clientId');
    if (!clientId) {
      clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('clientId', clientId);
    }
    return clientId;
  }
}

export const apiService = new ApiService();

// Mark page refresh on load
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    apiService.markPageRefresh();
  });
}

export default apiService;
