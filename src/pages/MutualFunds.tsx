import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Star, Target, Plus } from 'lucide-react';
import { useMutualFunds } from '../hooks/useApi';
import InvestmentModal from '../components/InvestmentModal';

const MutualFunds = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFund, setSelectedFund] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: mutualFunds, loading, error } = useMutualFunds();

  const categories = [
    { id: 'all', name: 'All Funds' },
    { id: 'equity', name: 'Equity' },
    { id: 'debt', name: 'Debt' },
    { id: 'hybrid', name: 'Hybrid' },
    { id: 'index', name: 'Index' },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const handleInvestClick = (fund: any) => {
    setSelectedFund({
      name: fund.name,
      type: 'mutual-fund' as const,
      nav: fund.nav,
      minSip: fund.minSip || 100
    });
    setIsModalOpen(true);
  };

  const filteredFunds = mutualFunds?.filter((fund: any) => 
    fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fund.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">
          <p>Error loading mutual funds data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Mutual Funds</h1>
        <p className="text-gray-600">
          Start SIP with as little as ₹100. Zero commission on direct mutual funds.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <Target className="h-8 w-8" />
            <div>
              <div className="text-2xl font-bold">₹100</div>
              <div className="text-green-100">Minimum SIP Amount</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8" />
            <div>
              <div className="text-2xl font-bold">0%</div>
              <div className="text-blue-100">Commission Fees</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <Star className="h-8 w-8" />
            <div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-purple-100">Fund Options</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search mutual funds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
        </button>
      </div>

      {/* Categories */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Mutual Funds Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Fund Name</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">NAV</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">1Y Returns</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">3Y Returns</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Rating</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">AUM</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFunds.map((fund: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                        MF
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{fund.name}</div>
                        <div className="text-sm text-gray-500">{fund.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-semibold text-gray-900">₹{fund.nav}</div>
                    <div className={`text-sm ${fund.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fund.changePercent}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-green-600 font-semibold">{fund.returns1y}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-green-600 font-semibold">{fund.returns3y}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      {renderStars(fund.rating)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-gray-600">{fund.aum}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => handleInvestClick(fund)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-1"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Start SIP</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Investment Modal */}
      {selectedFund && (
        <InvestmentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedFund(null);
          }}
          investment={selectedFund}
        />
      )}
    </div>
  );
};

export default MutualFunds;