import React, { useState } from 'react';
import { Search, Filter, Building2, Calculator, TrendingUp, Shield, Clock } from 'lucide-react';
import { useBankDeposits } from '../hooks/useApi';
import BankDepositModal from '../components/BankDepositModal';

const BankDeposits = () => {
  const [activeTab, setActiveTab] = useState('fd');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeposit, setSelectedDeposit] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: depositsData, loading, error } = useBankDeposits();

  const handleBookNow = (deposit: any) => {
    setSelectedDeposit(deposit);
    setIsModalOpen(true);
  };

  const tabs = [
    { id: 'fd', name: 'Fixed Deposits', icon: Building2 },
    { id: 'rd', name: 'Recurring Deposits', icon: TrendingUp },
  ];

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
          <p>Error loading bank deposits data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const currentRates = activeTab === 'fd' ? depositsData?.fixedDeposits || [] : depositsData?.recurringDeposits || [];
  const filteredRates = currentRates.filter((rate: any) => 
    rate.bank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Bank Deposits</h1>
        <p className="text-gray-600">
          Secure your money with guaranteed returns. Compare FD and RD rates from top banks.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8" />
            <div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-green-100">Guaranteed Returns</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8" />
            <div>
              <div className="text-2xl font-bold">₹5L</div>
              <div className="text-blue-100">DICGC Insured</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8" />
            <div>
              <div className="text-2xl font-bold">7.50%</div>
              <div className="text-purple-100">Best FD Rate</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8" />
            <div>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-orange-100">Online Booking</div>
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
            placeholder="Search banks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Calculator className="h-4 w-4" />
          <span>FD Calculator</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Rates Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Bank</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Interest Rate</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Min Amount</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Tenure</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Rating</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRates.map((rate: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                        {rate.bank.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{rate.bank}</div>
                        <div className="text-sm text-gray-500">{rate.features.join(', ')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-semibold text-green-600 text-lg">{rate.rate}</div>
                    <div className="text-sm text-gray-500">per annum</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-medium text-gray-900">{rate.minAmount}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-gray-900">{rate.tenure}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rate.rating === 'AAA' ? 'bg-green-100 text-green-800' :
                      rate.rating === 'AA+' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rate.rating}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleBookNow({
                        ...rate,
                        type: activeTab.toUpperCase() as 'FD' | 'RD'
                      })}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Book Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-12 grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Safe & Secure</h3>
          <p className="text-gray-600">All deposits are insured by DICGC up to ₹5 lakhs per bank</p>
        </div>
        <div className="text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Guaranteed Returns</h3>
          <p className="text-gray-600">Fixed interest rates ensure predictable returns on your investment</p>
        </div>
        <div className="text-center">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Booking</h3>
          <p className="text-gray-600">Book FDs and RDs online instantly with digital documentation</p>
        </div>
      </div>

      {/* Bank Deposit Modal */}
      {selectedDeposit && (
        <BankDepositModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDeposit(null);
          }}
          deposit={selectedDeposit}
        />
      )}
    </div>
  );
};

export default BankDeposits;