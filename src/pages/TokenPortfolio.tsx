import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  TrendingUp, 
  ExternalLink, 
  RefreshCw, 
  Eye, 
  ArrowUpRight, 
  Send, 
  Gift,
  Shield,
  Zap,
  BarChart3
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { aptosService } from '../services/aptosService';

interface TokenBalance {
  companyId: number;
  companyName: string;
  tokens: number;
  currentValue: number;
  contractAddress: string;
  shareClass?: string;
  votingRights?: boolean;
  dividendRights?: boolean;
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

interface ShareToken {
  tokenId: string;
  companyId: number;
  companyName: string;
  shares: number;
  shareClass: string;
  votingRights: boolean;
  dividendRights: boolean;
  createdAt: string;
  lastTransfer: string;
}

interface DividendDistribution {
  companyId: number;
  totalAmount: number;
  perShareAmount: number;
  recordDate: string;
  paymentDate: string;
  isPaid: boolean;
}

const TokenPortfolio = () => {
  const { wallet } = useWallet();
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [shareTokens, setShareTokens] = useState<ShareToken[]>([]);
  const [dividends, setDividends] = useState<DividendDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'tokens' | 'shares' | 'dividends' | 'history'>('overview');

  useEffect(() => {
    if (wallet.connected) {
      loadPortfolioData();
    }
  }, [wallet.connected]);

  const loadPortfolioData = async () => {
    if (!wallet.address) return;

    try {
      setLoading(true);
      const [balances, history, shares, dividendData] = await Promise.all([
        aptosService.getTokenBalances(wallet.address),
        aptosService.getInvestmentHistory(wallet.address),
        aptosService.getShareTokens(wallet.address),
        Promise.all([1, 2, 3].map(id => aptosService.getDividendDistributions(id))).then(results => results.flat()),
      ]);

      setTokenBalances(balances);
      setInvestments(history);
      setShareTokens(shares);
      setDividends(dividendData);
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
  const totalDividends = dividends.filter(d => d.isPaid).reduce((sum, d) => sum + d.totalAmount, 0);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'tokens', name: 'Tokens', icon: Coins },
    { id: 'shares', name: 'Shares', icon: Shield },
    { id: 'dividends', name: 'Dividends', icon: Gift },
    { id: 'history', name: 'History', icon: Eye },
  ];

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
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
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
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
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

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Dividends Earned</p>
              <p className="text-2xl font-bold text-purple-600">${totalDividends.toFixed(2)}</p>
              <p className="text-sm text-gray-500">{dividends.filter(d => d.isPaid).length} payments</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Gift className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Token Holdings Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Distribution</h3>
            {tokenBalances.length === 0 ? (
              <div className="text-center py-8">
                <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No token holdings yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tokenBalances.map((balance, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                        {balance.companyName.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{balance.companyName}</div>
                        <div className="text-sm text-gray-500">{balance.tokens.toLocaleString()} tokens</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">${balance.currentValue.toFixed(2)}</div>
                      <div className="text-sm text-green-600">+15.2%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            {investments.length === 0 ? (
              <div className="text-center py-8">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {investments.slice(0, 5).map((investment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Coins className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Invested in {investment.companyName}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(investment.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">${investment.totalAmount.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">{investment.tokens} tokens</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'tokens' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Rights</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
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
                            <div className="text-sm text-gray-500">{balance.shareClass || 'Common'} Shares</div>
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
                        <div className="flex items-center justify-center space-x-2">
                          {balance.votingRights && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              Voting
                            </span>
                          )}
                          {balance.dividendRights && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Dividend
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => window.open(`https://explorer.aptoslabs.com/account/${balance.contractAddress}?network=testnet`, '_blank')}
                            className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="text-sm">View</span>
                          </button>
                          <button className="text-purple-600 hover:text-purple-700 flex items-center space-x-1">
                            <Send className="h-4 w-4" />
                            <span className="text-sm">Transfer</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'shares' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Share Tokens</h3>
          </div>

          {shareTokens.length === 0 ? (
            <div className="p-8 text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Share Tokens</h3>
              <p className="text-gray-600">Your tokenized shares will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Token ID</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Company</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Shares</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Class</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {shareTokens.map((token, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-gray-900">{token.tokenId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{token.companyName}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-gray-900">{token.shares.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                          {token.shareClass}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-gray-600">
                          {new Date(token.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'dividends' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Dividend History</h3>
          </div>

          {dividends.length === 0 ? (
            <div className="p-8 text-center">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Dividends</h3>
              <p className="text-gray-600">Dividend payments will appear here when available.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Company</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Total Amount</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Per Share</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Payment Date</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dividends.map((dividend, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">Company {dividend.companyId}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-gray-900">${dividend.totalAmount.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-gray-900">${dividend.perShareAmount.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-gray-600">
                          {new Date(dividend.paymentDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          dividend.isPaid 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {dividend.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
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
      )}

      {/* Blockchain Features */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Blockchain Security</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Your tokens are secured on Aptos blockchain with cryptographic proof of ownership</p>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Learn More →
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-500 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Instant Transfers</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Transfer tokens instantly to other wallets with low fees and fast confirmation</p>
          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
            Transfer Tokens →
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-500 p-2 rounded-lg">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Smart Dividends</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Receive dividend payments automatically through smart contracts</p>
          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            View Dividends →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenPortfolio;