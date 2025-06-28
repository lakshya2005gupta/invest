import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(apiCall: () => Promise<any>, dependencies: any[] = []) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const response = await apiCall();
        
        if (isMounted) {
          setState({
            data: response.data,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'An error occurred',
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return state;
}

// Specific hooks for different data types
export function useStocks() {
  return useApi(() => apiService.getStocks());
}

export function useMutualFunds() {
  return useApi(() => apiService.getMutualFunds());
}

export function useETFs() {
  return useApi(() => apiService.getETFs());
}

export function useBankDeposits() {
  return useApi(() => apiService.getBankDeposits());
}

export function usePreIPO() {
  return useApi(() => apiService.getPreIPOCompanies());
}

export function useMarketIndices() {
  return useApi(() => apiService.getMarketIndices());
}

export function usePortfolio(pan: string) {
  return useApi(() => apiService.getPortfolio(pan), [pan]);
}

export function useAnalytics() {
  return useApi(() => apiService.getAnalyticsOverview());
}