import React, { useState } from 'react';
import { Search, Filter, Coins, TrendingUp, Users, Calendar, Shield, Zap, Plus } from 'lucide-react';
import { usePreIPO } from '../hooks/useApi';
import InvestmentModal from '../components/InvestmentModal';

const PreIPO = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: preIPOCompanies, loading, error } = usePreIPO();

  const sectors = [
    { id: 'all', name: 'All Sectors' },
    { id: 'technology', name: 'Technology' },
    { id: 'fintech', name: 'Fintech' },
    { id: 'aerospace', name: 'Aerospace' },
    { id: 'healthcare', name: 'Healthcare' },
  ];

  const handleInvestClick = (company: any) => {
    setSelectedCompany({
      name: company.name,
      type: 'pre-ipo' as const,
      tokenPrice: company.tokenPrice,
      minInvestment: parseFloat(company.minInvestment.replace(/[$,]/g, ''))
    });
    setIsModalOpen(true);
  };

  const filteredCompanies = preIPOCompanies?.filter((company: any) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || 
                         company.sector.toLowerCase() === selectedSector.toLowerCase();
    return matchesSearch && matchesSector;
  }) || [];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
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
          <p>Error loading Pre-IPO data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Pre-IPO Investments</h1>
        <p className="text-gray-600">
          Invest in promising companies before they go public. Tokenized shares on Aptos blockchain.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <Coins className="h-8 w-8" />
            <div>
              <div className="text-2xl font-bold">{filteredCompanies.length}</div>
              <div className="text-purple-100">Available Companies</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8" />
            <div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-blue-100">Blockchain Secured</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8" />
            <div>
              <div className="text-2xl font-bold">+28%</div>
              <div className="text-green-100">Avg. Growth</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8" />
            <div>
              <div className="text-2xl font-bold">84K+</div>
              <div className="text-orange-100">Total Investors</div>
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
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {sectors.map(sector => (
            <option key={sector.id} value={sector.id}>{sector.name}</option>
          ))}
        </select>
      </div>

      {/* Companies Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredCompanies.map((company: any, index: number) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {company.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{company.name}</h3>
                    <p className="text-sm text-gray-500">{company.sector}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                  {company.growth}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">{company.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Valuation</span>
                  <span className="font-semibold">{company.valuation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Token Price</span>
                  <span className="font-semibold text-purple-600">${company.tokenPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Min Investment</span>
                  <span className="font-semibold">{company.minInvestment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Expected IPO</span>
                  <span className="font-semibold">{company.expectedIPO}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{company.investors.toLocaleString()} investors</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Coins className="h-4 w-4" />
                  <span>{company.availableTokens} available</span>
                </div>
              </div>

              <button 
                onClick={() => handleInvestClick(company)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Invest Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* How it Works */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How Pre-IPO Tokenization Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">1. Choose Company</h3>
            <p className="text-gray-600 text-sm">Browse and select from vetted pre-IPO companies</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coins className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">2. Buy Tokens</h3>
            <p className="text-gray-600 text-sm">Purchase tokenized shares on Aptos blockchain</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">3. Secure Ownership</h3>
            <p className="text-gray-600 text-sm">Your ownership is secured on the blockchain</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">4. IPO Benefits</h3>
            <p className="text-gray-600 text-sm">Enjoy potential gains when company goes public</p>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {selectedCompany && (
        <InvestmentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCompany(null);
          }}
          investment={selectedCompany}
        />
      )}
    </div>
  );
};

export default PreIPO;