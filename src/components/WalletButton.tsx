import React, { useState } from 'react';
import { Wallet, LogOut, Copy, ExternalLink, AlertCircle, Plus, Zap, Shield, RefreshCw } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

const WalletButton = () => {
  const { 
    wallet, 
    connectWallet, 
    disconnectWallet, 
    getBalance, 
    fundAccount, 
    switchNetwork,
    getAvailableWallets,
    isWalletInstalled 
  } = useWallet();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [funding, setFunding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showWalletSelector, setShowWalletSelector] = useState(false);

  const availableWallets = getAvailableWallets();

  const walletInfo = {
    petra: { name: 'Petra Wallet', icon: '🪨', installUrl: 'https://petra.app/' },
    martian: { name: 'Martian Wallet', icon: '👽', installUrl: 'https://martianwallet.xyz/' },
    pontem: { name: 'Pontem Wallet', icon: '🌉', installUrl: 'https://pontem.network/wallet' },
    fewcha: { name: 'Fewcha Wallet', icon: '🦊', installUrl: 'https://fewcha.app/' },
  };

  const handleConnect = async (walletName?: string) => {
    try {
      if (availableWallets.length === 0) {
        setShowWalletSelector(true);
        return;
      }

      if (availableWallets.length > 1 && !walletName) {
        setShowWalletSelector(true);
        return;
      }

      await connectWallet(walletName);
      setShowWalletSelector(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setIsDropdownOpen(false);
  };

  const copyAddress = async () => {
    if (wallet.address) {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const refreshBalance = async () => {
    setRefreshing(true);
    try {
      await getBalance();
    } catch (error) {
      console.error('Error refreshing balance:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleFundAccount = async () => {
    if (wallet.network !== 'testnet') {
      alert('Faucet is only available on testnet');
      return;
    }

    setFunding(true);
    try {
      await fundAccount();
      alert('Account funded successfully! 1 APT added to your wallet.');
      await refreshBalance();
    } catch (error) {
      console.error('Funding error:', error);
      alert('Failed to fund account. Please try again later.');
    } finally {
      setFunding(false);
    }
  };

  const handleNetworkSwitch = async (network: string) => {
    try {
      await switchNetwork(network);
    } catch (error) {
      alert('Failed to switch network. Please try manually in your wallet.');
    }
  };

  const handleInstallWallet = (walletName: string) => {
    const wallet = walletInfo[walletName as keyof typeof walletInfo];
    if (wallet?.installUrl) {
      window.open(wallet.installUrl, '_blank');
    }
  };

  // Wallet Selector Modal
  if (showWalletSelector) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect Wallet</h3>
          
          {availableWallets.length > 0 ? (
            <div className="space-y-3 mb-4">
              <p className="text-sm text-gray-600">Choose a wallet to connect:</p>
              {availableWallets.map(walletName => (
                <button
                  key={walletName}
                  onClick={() => handleConnect(walletName)}
                  className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <span className="text-2xl">{walletInfo[walletName as keyof typeof walletInfo]?.icon}</span>
                  <span className="font-medium">{walletInfo[walletName as keyof typeof walletInfo]?.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3 mb-4">
              <p className="text-sm text-gray-600 mb-3">No Aptos wallet detected. Please install one:</p>
              {Object.entries(walletInfo).map(([walletName, info]) => (
                <button
                  key={walletName}
                  onClick={() => handleInstallWallet(walletName)}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{info.icon}</span>
                    <span className="font-medium">{info.name}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          )}
          
          <button
            onClick={() => setShowWalletSelector(false)}
            className="w-full mt-4 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (!wallet.connected) {
    return (
      <button
        onClick={() => handleConnect()}
        disabled={wallet.connecting}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm flex items-center space-x-2 disabled:opacity-50"
      >
        <Wallet className="h-4 w-4" />
        <span>{wallet.connecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium hover:bg-green-200 transition-colors text-sm flex items-center space-x-2"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>{formatAddress(wallet.address!)}</span>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Wallet Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{walletInfo[wallet.walletName as keyof typeof walletInfo]?.icon}</span>
                <span className="font-medium text-gray-900">
                  {walletInfo[wallet.walletName as keyof typeof walletInfo]?.name}
                </span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                wallet.network === 'mainnet' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {wallet.network}
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Wallet Address</span>
              <button
                onClick={copyAddress}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
              >
                <Copy className="h-3 w-3" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="font-mono text-sm text-gray-900 bg-gray-50 p-2 rounded break-all">
              {wallet.address}
            </div>
          </div>

          {/* Balance Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Balance</span>
              <div className="flex items-center space-x-2">
                {wallet.network === 'testnet' && (
                  <button
                    onClick={handleFundAccount}
                    disabled={funding}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1 disabled:opacity-50"
                  >
                    <Plus className="h-3 w-3" />
                    <span>{funding ? 'Funding...' : 'Fund'}</span>
                  </button>
                )}
                <button
                  onClick={refreshBalance}
                  disabled={refreshing}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                >
                  <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {wallet.balance.toFixed(4)} APT
            </div>
            <div className="text-sm text-gray-500">
              ≈ ${(wallet.balance * 12.45).toFixed(2)} USD
            </div>
          </div>

          {/* Network Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">Network</div>
            <div className="flex space-x-2">
              {['testnet', 'mainnet'].map(network => (
                <button
                  key={network}
                  onClick={() => handleNetworkSwitch(network)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    wallet.network === network
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {network.charAt(0).toUpperCase() + network.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Fast Transactions</span>
              </div>
            </div>
          </div>

          {/* Environment Warning */}
          {wallet.network === 'testnet' && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-orange-600 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Testnet Environment</span>
              </div>
              <p className="text-xs text-orange-600">
                You're on Aptos testnet. Transactions are for testing only and have no real value.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="p-4 space-y-2">
            <button
              onClick={() => window.open(`https://explorer.aptoslabs.com/account/${wallet.address}?network=${wallet.network}`, '_blank')}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View on Explorer</span>
            </button>
            <button
              onClick={handleDisconnect}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default WalletButton;
