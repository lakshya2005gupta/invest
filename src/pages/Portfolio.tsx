import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';

const Portfolio = () => {
  const portfolioData = [
    { month: 'Jan', value: 100000 },
    { month: 'Feb', value: 105000 },
    { month: 'Mar', value: 98000 },
    { month: 'Apr', value: 112000 },
    { month: 'May', value: 125000 },
    { month: 'Jun', value: 118000 },
    { month: 'Jul', value: 135000 },
  ];

  const allocationData = [
    { name: 'Stocks', value: 45, color: '#3B82F6' },
    { name: 'Mutual Funds', value: 25, color: '#10B981' },
    { name: 'Bank Deposits', value: 15, color: '#F59E0B' },
    { name: 'Pre-IPO', value: 10, color: '#8B5CF6' },
    { name: 'Cash', value: 5, color: '#6B7280' },
  ];

  const holdings = [
    { name: 'Reliance Industries', type: 'Stock', quantity: 50, avgPrice: '2,650', currentPrice: '2,845', value: '1,42,250', gain: '+7.36%', positive: true },
    { name: 'HDFC Bank', type: 'Stock', quantity: 25, avgPrice: '1,580', currentPrice: '1,680', value: '42,000', gain: '+6.33%', positive: true },
    { name: 'Axis Bluechip Fund', type: 'Mutual Fund', units: '1,250.5', nav: '65.48', value: '81,865', gain: '+12.5%', positive: true },
    { name: 'HDFC Bank FD', type: 'Bank Deposit', amount: '50,000', rate: '7.25%', value: '52,500', gain: '+5.0%', positive: true },
    { name: 'ByteDance Tokens', type: 'Pre-IPO', tokens: '100', price: '$50', value: '₹4,15,000', gain: '+25%', positive: true },
  ];

  const stats = [
    { label: 'Total Investment', value: '₹5,25,000', icon: DollarSign, color: 'blue' },
    { label: 'Current Value', value: '₹6,33,615', icon: TrendingUp, color: 'green' },
    { label: 'Total Gains', value: '₹1,08,615', icon: Activity, color: 'green' },
    { label: 'Returns', value: '+20.69%', icon: TrendingUp, color: 'green' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Portfolio</h1>
        <p className="text-gray-600">Track your investments across all asset classes</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${
                    stat.color === 'green' ? 'text-green-600' : 
                    stat.color === 'red' ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${
                  stat.color === 'green' ? 'bg-green-100' : 
                  stat.color === 'red' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    stat.color === 'green' ? 'text-green-600' : 
                    stat.color === 'red' ? 'text-red-600' : 'text-blue-600'
                  }`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Portfolio Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Portfolio Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={portfolioData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Portfolio Value']}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Asset Allocation */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Asset Allocation</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                dataKey="value"
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {allocationData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Holdings</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Investment</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Quantity</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Avg Price</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Current Value</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Gain/Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {holdings.map((holding, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm ${
                        holding.type === 'Stock' ? 'bg-blue-500' : 
                        holding.type === 'Mutual Fund' ? 'bg-green-500' :
                        holding.type === 'Bank Deposit' ? 'bg-orange-500' :
                        'bg-purple-500'
                      }`}>
                        {holding.type === 'Stock' ? 'S' : 
                         holding.type === 'Mutual Fund' ? 'MF' :
                         holding.type === 'Bank Deposit' ? 'FD' : 'PI'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{holding.name}</div>
                        <div className="text-sm text-gray-500">{holding.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-gray-900">
                      {holding.quantity || holding.units || holding.amount || holding.tokens}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-gray-900">
                      {holding.avgPrice || holding.nav || holding.rate || holding.price}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-semibold text-gray-900">{holding.value}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`flex items-center justify-end space-x-1 font-medium ${
                      holding.positive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {holding.positive ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span>{holding.gain}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;