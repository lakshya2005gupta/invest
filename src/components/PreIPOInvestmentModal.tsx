import React, { useState } from 'react';
import { X, Coins, Shield, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { aptosService } from '../services/aptosService';

interface PreIPOInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: {
    id: number;
    name: string;
    tokenPrice: number;
    minInvestment: string;
    aptosContractAddress: string;
    sector: string;
    valuation: string;
  };
}

const PreIPOInvestmentModal: React.FC<PreIPOInvestmentModalProps> = ({ isOpen, onClose, company }) => {
  const { wallet, connectWallet } = useWallet();
  const [tokens, setTokens] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);
  const [investmentSuccess, setInvestmentSuccess] = useState<any>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const tokenAmount = parseInt(tokens) || 0;
  const totalCost = tokenAmount * company.tokenPrice;
  const minTokens = Math.ceil(parseFloat(company.minInvestment.replace(/[$,]/g, '')) / company.tokenPrice);

  const handleInvest = async () => {
    if (!wallet.connected) {
      try {
        await connectWallet();
      } catch (error) {
        setError('Please connect your wallet to continue');
        return;
      }
    }

    if (tokenAmount < minTokens) {
      setError(`Minimum investment is ${minTokens} tokens`);
      return;
    }

    if (totalCost > wallet.balance) {
      setError('Insufficient balance');
      return;
    }

    setIsInvesting(true);
    setError('');

    try {
      const investment = await aptosService.investInPreIPO(
        wallet.address!,
        company.id,
        company.name,
        tokenAmount,
        company.tokenPrice,
        company.aptosContractAddress
      );

      setInvestmentSuccess(investment);
    } catch (error) {
      setError('Investment failed. Please try again.');
      console.error('Investment error:', error);
    } finally {
      setIsInvesting(false);
    }
  };

  const handleClose = () => {
    setTokens('');
    setError('');
    setInvestmentSuccess(null);
    onClose();
  };

  if (investmentSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Investment Successful!</h3>
          <p className="text-gray-600 mb-6">
            You've successfully invested in {company.name} tokens on Aptos blockchain.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tokens Purchased:</span>
              <span className="font-medium">{investmentSuccess.tokens}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium">${investmentSuccess.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction Hash:</span>
              <button
                onClick={() => window.open(`https://explorer.aptoslabs.com/txn/${investmentSuccess.transactionHash}?network=testnet`, '_blank')}
                className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span className="font-mono text-xs">{investmentSuccess.transactionHash.slice(0, 8)}...</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Portfolio
          </button>
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
            <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
            <p className="text-sm text-gray-500">{company.sector} • Pre-IPO Investment</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Company Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Token Price</span>
              <div className="font-semibold text-lg">${company.tokenPrice.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-gray-500">Valuation</span>
              <div className="font-semibold text-lg">{company.valuation}</div>
            </div>
            <div>
              <span className="text-gray-500">Min Investment</span>
              <div className="font-semibold">{company.minInvestment}</div>
            </div>
            <div>
              <span className="text-gray-500">Min Tokens</span>
              <div className="font-semibold">{minTokens}</div>
            </div>
          </div>
        </div>

        {/* Wallet Status */}
        {!wallet.connected ? (
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="font-medium text-yellow-800">Wallet Not Connected</div>
                <div className="text-sm text-yellow-700">Connect your Aptos wallet to continue</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-green-800">Wallet Connected</div>
                <div className="text-sm text-green-700">
                  Balance: {wallet.balance.toFixed(4)} APT
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Investment Form */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Tokens
              </label>
              <input
                type="number"
                value={tokens}
                onChange={(e) => setTokens(e.target.value)}
                placeholder={`Min ${minTokens} tokens`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {tokens && (
                <p className="text-sm text-gray-500 mt-1">
                  Total cost: ${totalCost.toFixed(2)}
                </p>
              )}
            </div>

            {/* Quick Amount Buttons - Updated for new prices */}
            <div className="grid grid-cols-3 gap-2">
              {[minTokens, minTokens * 5, minTokens * 10].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTokens(amount.toString())}
                  className="py-2 px-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  {amount} tokens
                </button>
              ))}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={wallet.connected ? handleInvest : connectWallet}
              disabled={isInvesting || (wallet.connected && (!tokens || tokenAmount < minTokens))}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isInvesting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : wallet.connected ? (
                <>
                  <Coins className="h-4 w-4" />
                  <span>Invest ${totalCost.toFixed(2)}</span>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Connect Wallet</span>
                </>
              )}
            </button>
          </div>

          {/* Blockchain Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Coins className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Aptos Blockchain Security</p>
                <ul className="space-y-1 text-xs">
                  <li>• Tokens minted on Aptos testnet</li>
                  <li>• Smart contract verified and audited</li>
                  <li>• Transparent ownership tracking</li>
                  <li>• Instant settlement and confirmation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Affordability Notice */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm text-green-800">
              <p className="font-medium">💡 Affordable Investment</p>
              <p className="text-xs mt-1">
                Start investing in Pre-IPO companies with as little as {company.minInvestment}. 
                Build your portfolio gradually with small, affordable investments.
              </p>
            </div>
          </div>

          {/* Contract Address */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Contract Address</div>
            <div className="font-mono text-xs text-gray-700 break-all">
              {company.aptosContractAddress}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreIPOInvestmentModal;
