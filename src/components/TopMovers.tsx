import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TopMoversProps {
  title: string;
  type: 'gainers' | 'losers';
}

const TopMovers: React.FC<TopMoversProps> = ({ title, type }) => {
  const stocks = type === 'gainers' ? [
    { name: 'Reliance Industries', symbol: 'RELIANCE', price: '2,845.60', change: '+8.45%', value: '+220.30' },
    { name: 'TCS', symbol: 'TCS', price: '4,125.80', change: '+6.20%', value: '+240.50' },
    { name: 'HDFC Bank', symbol: 'HDFCBANK', price: '1,680.95', change: '+4.85%', value: '+77.80' },
    { name: 'Infosys', symbol: 'INFY', price: '1,920.45', change: '+3.92%', value: '+72.45' },
    { name: 'ITC', symbol: 'ITC', price: '485.30', change: '+3.15%', value: '+14.80' },
  ] : [
    { name: 'Adani Enterprises', symbol: 'ADANIENT', price: '2,340.20', change: '-5.45%', value: '-135.20' },
    { name: 'ONGC', symbol: 'ONGC', price: '245.80', change: '-4.20%', value: '-10.75' },
    { name: 'Tata Steel', symbol: 'TATASTEEL', price: '145.60', change: '-3.85%', value: '-5.85' },
    { name: 'JSW Steel', symbol: 'JSWSTEEL', price: '920.45', change: '-3.25%', value: '-30.95' },
    { name: 'Coal India', symbol: 'COALINDIA', price: '385.30', change: '-2.95%', value: '-11.70' },
  ];

  const isPositive = type === 'gainers';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            <span>{title}</span>
          </h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {stocks.map((stock, index) => (
            <div key={index} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{stock.name}</div>
                <div className="text-sm text-gray-500">{stock.symbol}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">₹{stock.price}</div>
                <div className={`text-sm font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stock.value} ({stock.change})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopMovers;