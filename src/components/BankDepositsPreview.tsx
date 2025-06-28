import React from 'react';
import { Building2, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BankDepositsPreview = () => {
  const topRates = [
    { bank: 'IndusInd Bank', type: 'FD', rate: '7.50%', tenure: '1-5 years' },
    { bank: 'Kotak Mahindra', type: 'FD', rate: '7.40%', tenure: '1-5 years' },
    { bank: 'IndusInd Bank', type: 'RD', rate: '7.00%', tenure: '1-10 years' },
  ];

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Bank Deposits</h2>
        <Link 
          to="/bank-deposits"
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium"
        >
          <span>View All Rates</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Building2 className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Fixed Deposits</h3>
                  <p className="text-sm text-gray-500">Guaranteed returns up to 7.50%</p>
                </div>
              </div>
              <div className="space-y-3">
                {topRates.filter(rate => rate.type === 'FD').map((rate, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{rate.bank}</div>
                      <div className="text-sm text-gray-500">{rate.tenure}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{rate.rate}</div>
                      <div className="text-xs text-gray-500">per annum</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Recurring Deposits</h3>
                  <p className="text-sm text-gray-500">Start SIP from ₹100/month</p>
                </div>
              </div>
              <div className="space-y-3">
                {topRates.filter(rate => rate.type === 'RD').map((rate, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{rate.bank}</div>
                      <div className="text-sm text-gray-500">{rate.tenure}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{rate.rate}</div>
                      <div className="text-xs text-gray-500">per annum</div>
                    </div>
                  </div>
                ))}
                <div className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="text-sm text-orange-800 font-medium">💡 Pro Tip</div>
                  <div className="text-xs text-orange-700">RDs help build discipline in saving with guaranteed returns</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BankDepositsPreview;