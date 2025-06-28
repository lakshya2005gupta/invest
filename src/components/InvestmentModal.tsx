import React, { useState } from 'react';
import { X, TrendingUp, Calculator, Info, AlertCircle, CheckCircle } from 'lucide-react';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  investment: {
    name: string;
    type: 'stock' | 'mutual-fund' | 'pre-ipo';
    price?: number;
    nav?: number;
    tokenPrice?: number;
    minSip?: number;
    symbol?: string;
  };
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ isOpen, onClose, investment }) => {
  const [investmentType, setInvestmentType] = useState<'lumpsum' | 'sip'>('lumpsum');
  const [amount, setAmount] = useState('');
  const [sipAmount, setSipAmount] = useState('');
  const [sipDate, setSipDate] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentPrice = investment.price || investment.nav || investment.tokenPrice || 0;
  const minAmount = investment.type === 'mutual-fund' ? (investment.minSip || 100) : 1;
  const quantity = amount ? Math.floor(parseFloat(amount) / currentPrice) : 0;

  const handleInvest = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    // Auto close after success
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  const handleStartSIP = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    // Auto close after success
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Investment Successful!</h3>
          <p className="text-gray-600 mb-4">
            Your {investmentType === 'sip' ? 'SIP' : 'investment'} in {investment.name} has been processed successfully.
          </p>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-800">
              Amount: ₹{investmentType === 'sip' ? sipAmount : amount}
              {investmentType === 'sip' && ' per month'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{investment.name}</h2>
            <p className="text-sm text-gray-500 capitalize">{investment.type.replace('-', ' ')}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Current Price */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {investment.type === 'stock' ? 'Current Price' : 
                 investment.type === 'mutual-fund' ? 'NAV' : 'Token Price'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{currentPrice.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+2.45%</span>
            </div>
          </div>
        </div>

        {/* Investment Type Tabs (for Mutual Funds) */}
        {investment.type === 'mutual-fund' && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setInvestmentType('lumpsum')}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                  investmentType === 'lumpsum'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                One Time
              </button>
              <button
                onClick={() => setInvestmentType('sip')}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                  investmentType === 'sip'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                SIP
              </button>
            </div>
          </div>
        )}

        {/* Investment Form */}
        <div className="p-6">
          {investmentType === 'lumpsum' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Min ₹${minAmount}`}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {amount && (
                  <p className="text-sm text-gray-500 mt-1">
                    You'll get approximately {quantity} {investment.type === 'stock' ? 'shares' : 'units'}
                  </p>
                )}
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[1000, 5000, 10000].map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    className="py-2 px-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    ₹{quickAmount.toLocaleString()}
                  </button>
                ))}
              </div>

              <button
                onClick={handleInvest}
                disabled={!amount || parseFloat(amount) < minAmount || isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Invest ₹{amount || '0'}</span>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly SIP Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={sipAmount}
                    onChange={(e) => setSipAmount(e.target.value)}
                    placeholder={`Min ₹${minAmount}`}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SIP Date
                </label>
                <select
                  value={sipDate}
                  onChange={(e) => setSipDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((date) => (
                    <option key={date} value={date.toString()}>
                      {date}{date === 1 ? 'st' : date === 2 ? 'nd' : date === 3 ? 'rd' : 'th'} of every month
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick SIP Amount Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[500, 1000, 2500].map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => setSipAmount(quickAmount.toString())}
                    className="py-2 px-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    ₹{quickAmount.toLocaleString()}
                  </button>
                ))}
              </div>

              <button
                onClick={handleStartSIP}
                disabled={!sipAmount || parseFloat(sipAmount) < minAmount || isProcessing}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Start SIP ₹{sipAmount || '0'}/month</span>
                )}
              </button>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Investment Details</p>
                <ul className="space-y-1 text-xs">
                  <li>• Zero commission on direct plans</li>
                  <li>• Instant order execution</li>
                  <li>• Free portfolio tracking</li>
                  {investment.type === 'mutual-fund' && (
                    <li>• SIP can be paused or stopped anytime</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Risk Warning */}
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Investment Risk</p>
                <p className="text-xs mt-1">
                  {investment.type === 'mutual-fund' 
                    ? 'Mutual fund investments are subject to market risks. Please read all scheme related documents carefully.'
                    : investment.type === 'stock'
                    ? 'Stock investments are subject to market risks. Past performance is not indicative of future results.'
                    : 'Pre-IPO investments are high-risk investments. Please invest only if you understand the risks involved.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;