import React, { useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useMarketIndices } from '../hooks/useApi';

const MarketIndices = () => {
  const { data: indices, loading, error, cached, refresh } = useMarketIndices();

  // Auto-refresh on component mount (simulates page refresh)
  useEffect(() => {
    // Check if data is older than 5 minutes and refresh
    const shouldRefresh = !cached || (cached && Math.random() > 0.7); // 30% chance to refresh on load
    if (shouldRefresh) {
      refresh();
    }
  }, []);

  const handleManualRefresh = () => {
    refresh();
  };

  if (loading) {
    return (
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500">Market Indices</div>
            <div className="animate-spin">
              <RefreshCw className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 min-w-[200px] animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="text-red-600 text-center">Error loading market data</div>
            <button
              onClick={handleManualRefresh}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-500">Market Indices</div>
            {cached && (
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Cached</span>
              </div>
            )}
          </div>
          <button
            onClick={handleManualRefresh}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-sm transition-colors"
            title="Refresh market data"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
        <div className="flex items-center space-x-8 overflow-x-auto scrollbar-hide">
          {indices?.map((index: any, i: number) => (
            <div key={i} className="flex-shrink-0 min-w-[200px]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-600">{index.name}</div>
                  <div className="text-lg font-semibold text-gray-900">{index.value}</div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    index.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {index.positive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{index.change}</span>
                  </div>
                  <div className={`text-sm ${
                    index.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {index.percent}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketIndices;