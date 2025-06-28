import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, ExternalLink, RefreshCw, Eye, ArrowUpRight } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { aptosService } from '../services/aptosService';

interface TokenBalance {
  companyId: number;
  companyName: string;
  tokens: number;
  currentValue: number;
  contractAddress: string;
}

interface Investment {
  companyId: number;
  companyName: string;
  tokens: number;
  tokenPrice: number;
  totalAmount: number;
  transactionHash: string;
  timestamp: string;
  contractAddress: string;
}

const TokenPortfolio = () => {
  const { wallet } = useWallet();
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (wallet.connected) {
      loadPortfolioData();
    }
  }, [wallet.connected]);

  const loadPortfolioData = async () => {
    if (!wallet.address) return;

    try {
      setLoading(true);
      const [balances, history] = await Promise.all([
        aptosService.getTokenBalances(wallet.address),
        aptosService.getInvestmentHistory(wallet.address),
      ]);

      setTokenBalances(balances);
      setInvestments(history);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPortfolioData();
    setRefreshing(false);
  };

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalCurrentValue = tokenBalances.reduce((sum, balance) => sum + balance.currentValue, 0);
  const totalGains = totalCurrentValue - totalInvestment;
  const totalReturns = totalInvestment > 0 ? ((totalGains / totalInvestment) * 100) : 0;

  if (!wallet.connected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Coins className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">
            Connect your Aptos wallet to view your Pre-IPO token portfolio
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Token Portfolio</h1>
          <p className="text-gray-600">Your Pre-IPO investments on Aptos blockchain</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Portfolio Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Investment</p>
              <p className="text-2xl font-bold text-gray-900">${totalInvestment.toFixed(2)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Coins className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalCurrentValue.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Returns</p>
              <p className={`text-2xl font-bold ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalReturns >= 0 ? '+' : ''}{totalReturns.toFixed(2)}%
              </p>
              <p className={`text-sm ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totalGains.toFixed(2)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${totalReturns >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <ArrowUpRight className={`h-6 w-6 ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Token Holdings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Token Holdings</h3>
        </div>

        {tokenBalances.length === 0 ? (
          <div className="p-8 text-center">
            <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Token Holdings</h3>
            <p className="text-gray-600">You haven't invested in any Pre-IPO tokens yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Company</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Tokens</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Current Value</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Contract</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tokenBalances.map((balance, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                          {balance.companyName.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{balance.companyName}</div>
                          <div className="text-sm text-gray-500">Pre-IPO Token</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-gray-900">{balance.tokens.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-gray-900">${balance.currentValue.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => window.open(`https://explorer.aptoslabs.com/account/${balance.contractAddress}?network=testnet`, '_blank')}
                        className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 mx-auto"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Investment History */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Investment History</h3>
        </div>

        {investments.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-500">No investment history available</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Company</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Tokens</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Amount</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Transaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {investments.map((investment, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {new Date(investment.timestamp).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{investment.companyName}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-gray-900">{investment.tokens.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-gray-900">${investment.totalAmount.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => window.open(`https://explorer.aptoslabs.com/txn/${investment.transactionHash}?network=testnet`, '_blank')}
                        className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 mx-auto"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="text-sm font-mono">{investment.transactionHash.slice(0, 8)}...</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenPortfolio;