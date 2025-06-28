import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, Eye, Plus, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
    { name: 'Stocks', value: 45, color: '#3B82F6', amount: 285000 },
    { name: 'Mutual Funds', value: 25, color: '#10B981', amount: 158000 },
    { name: 'Bank Deposits', value: 15, color: '#F59E0B', amount: 95000 },
    { name: 'Pre-IPO', value: 10, color: '#8B5CF6', amount: 63000 },
    { name: 'Cash', value: 5, color: '#6B7280', amount: 32000 },
  ];

  const holdings = [
    { 
      id: 1, 
      name: 'Reliance Industries', 
      type: 'Stock', 
      quantity: 50, 
      avgPrice: 2650, 
      currentPrice: 2845, 
      value: 142250, 
      gain: 9750,
      gainPercent: 7.36,
      positive: true 
    },
    { 
      id: 2, 
      name: 'HDFC Bank', 
      type: 'Stock', 
      quantity: 25, 
      avgPrice: 1580, 
      currentPrice: 1680, 
      value: 42000, 
      gain: 2500,
      gainPercent: 6.33,
      positive: true 
    },
    { 
      id: 3, 
      name: 'Axis Bluechip Fund', 
      type: 'Mutual Fund', 
      units: 1250.5, 
      nav: 65.48, 
      value: 81865, 
      gain: 9115,
      gainPercent: 12.5,
      positive: true 
    },
    { 
      id: 4, 
      name: 'HDFC Bank FD', 
      type: 'Bank Deposit', 
      amount: 50000, 
      rate: 7.25, 
      value: 52500, 
      gain: 2500,
      gainPercent: 5.0,
      positive: true 
    },
    { 
      id: 5, 
      name: 'ByteDance Tokens', 
      type: 'Pre-IPO', 
      tokens: 100, 
      price: 50, 
      value: 415000, 
      gain: 83000,
      gainPercent: 25.0,
      positive: true 
    }
  ];

  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);
  const totalInvestment = holdings.reduce((sum, holding) => sum + (holding.value - holding.gain), 0);
  const totalGains = totalValue - totalInvestment;
  const totalReturns = ((totalGains / totalInvestment) * 100).toFixed(2);

  const stats = [
    { 
      label: 'Total Investment', 
      value: `₹${totalInvestment.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'blue' 
    },
    { 
      label: 'Current Value', 
      value: `₹${totalValue.toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'green' 
    },
    { 
      label: 'Total Gains', 
      value: `₹${totalGains.toLocaleString()}`, 
      icon: Activity, 
      color: 'green' 
    },
    { 
      label: 'Returns', 
      value: `+${totalReturns}%`, 
      icon: TrendingUp, 
      color: 'green' 
    },
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 5) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio</h1>
          <p className="text-gray-600">Track your investments across all asset classes</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Money</span>
          </button>
          <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            <Eye className="h-4 w-4" />
            <span>View Orders</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Portfolio Performance</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Last 7 months</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={portfolioData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Portfolio Value']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Asset Allocation */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Asset Allocation</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value}% (₹${props.payload.amount.toLocaleString()})`, 
                  name
                ]}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3 mt-4">
            {allocationData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{item.value}%</div>
                  <div className="text-xs text-gray-500">₹{item.amount.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Holdings</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
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
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Action</th>
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
                      ₹{holding.avgPrice || holding.nav || holding.rate || holding.price}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-semibold text-gray-900">₹{holding.value.toLocaleString()}</span>
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
                      <div className="text-right">
                        <div>₹{holding.gain.toLocaleString()}</div>
                        <div className="text-xs">({holding.gainPercent.toFixed(2)}%)</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm">
                      <ArrowUpRight className="h-4 w-4" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Start New SIP</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Begin systematic investment with mutual funds</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Explore Funds
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-500 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Buy Stocks</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Invest in individual stocks with zero brokerage</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            Browse Stocks
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-500 p-2 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Pre-IPO Tokens</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Get early access to unicorn companies</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
            View Opportunities
          </button>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;