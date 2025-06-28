import React from 'react';
import { Plus, Star } from 'lucide-react';

const MarketCapTable = () => {
  const stocks = [
    { name: 'Reliance Industries', symbol: 'RELIANCE', price: '2,845.60', change: '+8.45%', marketCap: '19.2L Cr', positive: true },
    { name: 'TCS', symbol: 'TCS', price: '4,125.80', change: '+6.20%', marketCap: '15.1L Cr', positive: true },
    { name: 'HDFC Bank', symbol: 'HDFCBANK', price: '1,680.95', change: '+4.85%', marketCap: '12.8L Cr', positive: true },
    { name: 'Infosys', symbol: 'INFY', price: '1,920.45', change: '+3.92%', marketCap: '8.2L Cr', positive: true },
    { name: 'Hindustan Unilever', symbol: 'HINDUNILVR', price: '2,650.30', change: '-1.25%', marketCap: '6.2L Cr', positive: false },
    { name: 'ICICI Bank', symbol: 'ICICIBANK', price: '1,245.80', change: '+2.15%', marketCap: '8.7L Cr', positive: true },
    { name: 'State Bank of India', symbol: 'SBIN', price: '825.40', change: '+3.45%', marketCap: '7.4L Cr', positive: true },
    { name: 'Bharti Airtel', symbol: 'BHARTIARTL', price: '1,580.95', change: '-0.85%', marketCap: '9.1L Cr', positive: false },
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Top Companies by Market Cap</h2>
        <button className="text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Company</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Price</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Change</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Market Cap</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stocks.map((stock, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{stock.name}</div>
                      <div className="text-sm text-gray-500">{stock.symbol}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-semibold text-gray-900">₹{stock.price}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-medium ${
                      stock.positive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.change}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-gray-900 font-medium">{stock.marketCap}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <Star className="h-4 w-4 text-gray-400 hover:text-yellow-500" />
                      </button>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1">
                        <Plus className="h-3 w-3" />
                        <span>Buy</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default MarketCapTable;