import React, { useState } from 'react';
import { X, Building2, Calculator, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface BankDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  deposit: {
    bank: string;
    type: 'FD' | 'RD';
    rate: string;
    minAmount: string;
    tenure: string;
    rating: string;
    features: string[];
  };
}

const BankDepositModal: React.FC<BankDepositModalProps> = ({ isOpen, onClose, deposit }) => {
  const [amount, setAmount] = useState('');
  const [tenure, setTenure] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [calculatedMaturity, setCalculatedMaturity] = useState<any>(null);

  if (!isOpen) return null;

  const rate = parseFloat(deposit.rate.replace('%', ''));
  const minAmount = parseFloat(deposit.minAmount.replace(/[₹,]/g, ''));

  const calculateMaturity = () => {
    const principal = parseFloat(amount);
    const years = parseFloat(tenure);
    
    if (principal && years && rate) {
      if (deposit.type === 'FD') {
        // Compound interest for FD
        const maturityAmount = principal * Math.pow(1 + (rate / 100), years);
        const interest = maturityAmount - principal;
        
        setCalculatedMaturity({
          principal,
          maturityAmount: Math.round(maturityAmount),
          interest: Math.round(interest),
          tenure: years,
        });
      } else {
        // RD calculation
        const months = years * 12;
        const monthlyRate = rate / (12 * 100);
        const maturityAmount = principal * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
        const totalDeposits = principal * months;
        const interest = maturityAmount - totalDeposits;
        
        setCalculatedMaturity({
          monthlyDeposit: principal,
          totalDeposits: Math.round(totalDeposits),
          maturityAmount: Math.round(maturityAmount),
          interest: Math.round(interest),
          tenure: years,
        });
      }
    }
  };

  const handleBooking = async () => {
    setIsProcessing(true);
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    // Auto close after success
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Successful!</h3>
          <p className="text-gray-600 mb-4">
            Your {deposit.type} with {deposit.bank} has been booked successfully.
          </p>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-800">
              Amount: ₹{amount}
              <br />
              Tenure: {tenure} year{parseFloat(tenure) > 1 ? 's' : ''}
              <br />
              Reference: {deposit.type}{Date.now().toString().slice(-6)}
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
            <h2 className="text-xl font-semibold text-gray-900">Book {deposit.type}</h2>
            <p className="text-sm text-gray-500">{deposit.bank}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Deposit Details */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Interest Rate</span>
              <div className="font-semibold text-lg text-green-600">{deposit.rate}</div>
            </div>
            <div>
              <span className="text-gray-500">Rating</span>
              <div className="font-semibold">{deposit.rating}</div>
            </div>
            <div>
              <span className="text-gray-500">Min Amount</span>
              <div className="font-semibold">{deposit.minAmount}</div>
            </div>
            <div>
              <span className="text-gray-500">Tenure</span>
              <div className="font-semibold">{deposit.tenure}</div>
            </div>
          </div>
          
          <div className="mt-4">
            <span className="text-gray-500 text-sm">Features</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {deposit.features.map((feature, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {deposit.type === 'FD' ? 'Investment Amount' : 'Monthly Deposit Amount'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Min ₹${minAmount.toLocaleString()}`}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tenure (Years)
              </label>
              <select
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5].map(year => (
                  <option key={year} value={year.toString()}>{year} Year{year > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[minAmount, minAmount * 5, minAmount * 10].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className="py-2 px-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  ₹{quickAmount.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateMaturity}
              disabled={!amount || parseFloat(amount) < minAmount}
              className="w-full bg-blue-100 text-blue-700 py-2 rounded-lg font-medium hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <Calculator className="h-4 w-4" />
              <span>Calculate Maturity</span>
            </button>

            {/* Maturity Calculation Results */}
            {calculatedMaturity && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Maturity Calculation</h4>
                <div className="space-y-1 text-sm text-green-700">
                  {deposit.type === 'FD' ? (
                    <>
                      <div className="flex justify-between">
                        <span>Principal Amount:</span>
                        <span>₹{calculatedMaturity.principal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maturity Amount:</span>
                        <span className="font-semibold">₹{calculatedMaturity.maturityAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interest Earned:</span>
                        <span className="font-semibold">₹{calculatedMaturity.interest.toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>Monthly Deposit:</span>
                        <span>₹{calculatedMaturity.monthlyDeposit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Deposits:</span>
                        <span>₹{calculatedMaturity.totalDeposits.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maturity Amount:</span>
                        <span className="font-semibold">₹{calculatedMaturity.maturityAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interest Earned:</span>
                        <span className="font-semibold">₹{calculatedMaturity.interest.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={!amount || parseFloat(amount) < minAmount || isProcessing}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4" />
                  <span>Book {deposit.type}</span>
                </>
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Important Information</p>
                <ul className="space-y-1 text-xs">
                  <li>• Interest rates are subject to change</li>
                  <li>• Premature withdrawal may attract penalty</li>
                  <li>• TDS applicable as per income tax rules</li>
                  <li>• DICGC insurance up to ₹5 lakhs per bank</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Risk Warning */}
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Terms & Conditions</p>
                <p className="text-xs mt-1">
                  This is a demo booking. In production, you would be redirected to the bank's official website 
                  or partner platform to complete the actual investment process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDepositModal;