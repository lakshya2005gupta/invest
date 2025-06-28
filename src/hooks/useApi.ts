import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  cached?: boolean;
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
            cached: response.cached
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

  const refresh = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiCall();
      setState({
        data: response.data,
        loading: false,
        error: null,
        cached: false
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  return { ...state, refresh };
}

// Specific hooks for different data types with refresh capability
export function useStocks(forceRefresh = false) {
  return useApi(() => apiService.getStocks(forceRefresh), [forceRefresh]);
}

export function useMutualFunds(forceRefresh = false) {
  return useApi(() => apiService.getMutualFunds(forceRefresh), [forceRefresh]);
}

export function useETFs(forceRefresh = false) {
  return useApi(() => apiService.getETFs(forceRefresh), [forceRefresh]);
}

export function useBankDeposits() {
  return useApi(() => apiService.getBankDeposits());
}

export function usePreIPO(forceRefresh = false) {
  return useApi(() => apiService.getPreIPOCompanies(forceRefresh), [forceRefresh]);
}

export function useMarketIndices(forceRefresh = false) {
  return useApi(() => apiService.getMarketIndices(forceRefresh), [forceRefresh]);
}

export function usePortfolio(pan: string) {
  return useApi(() => apiService.getPortfolio(pan), [pan]);
}

export function useAnalytics() {
  return useApi(() => apiService.getAnalyticsOverview());
}