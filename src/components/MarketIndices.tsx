import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useMarketIndices } from '../hooks/useApi';

const MarketIndices = () => {
  const { data: indices, loading, error } = useMarketIndices();

  if (loading) {
    return (
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="text-red-600 text-center">Error loading market data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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