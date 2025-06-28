import React from 'react';
import { Coins, TrendingUp, ArrowRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const PreIPOPreview = () => {
  const featuredCompanies = [
    { name: 'ByteDance', sector: 'Technology', valuation: '$140B', growth: '+25%', investors: 15420 },
    { name: 'SpaceX', sector: 'Aerospace', valuation: '$180B', growth: '+45%', investors: 8750 },
    { name: 'Stripe', sector: 'Fintech', valuation: '$95B', growth: '+18%', investors: 12300 },
  ];

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Pre-IPO Investments</h2>
        <Link 
          to="/pre-ipo"
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium"
        >
          <span>View All Companies</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Coins className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Tokenized Pre-IPO Shares</h3>
              <p className="text-sm text-gray-500">Invest in unicorns before they go public • Powered by Aptos</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {featuredCompanies.map((company, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium text-gray-900">{company.name}</div>
                    <div className="text-sm text-gray-500">{company.sector}</div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {company.growth}
                  </span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Valuation</span>
                    <span className="font-medium">{company.valuation}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Investors</span>
                    <span className="font-medium">{company.investors.toLocaleString()}</span>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
                  Invest Now
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <Coins className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">🚀 New: Blockchain-Secured Ownership</div>
                <div className="text-sm text-gray-600">Your pre-IPO investments are tokenized and secured on Aptos blockchain for transparent ownership</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreIPOPreview;