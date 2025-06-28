import React, { useState } from 'react';
import { Wallet, LogOut, Copy, ExternalLink, AlertCircle } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

const WalletButton = () => {
  const { wallet, connectWallet, disconnectWallet, getBalance } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please make sure you have Petra or Martian wallet installed.');
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
    await getBalance();
  };

  if (!wallet.connected) {
    return (
      <button
        onClick={handleConnect}
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
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
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
            <div className="font-mono text-sm text-gray-900 bg-gray-50 p-2 rounded">
              {wallet.address}
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Balance</span>
              <button
                onClick={refreshBalance}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Refresh
              </button>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {wallet.balance.toFixed(4)} APT
            </div>
            <div className="text-sm text-gray-500">
              Network: {wallet.network}
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
              <AlertCircle className="h-4 w-4" />
              <span>Testnet Environment</span>
            </div>
            <p className="text-xs text-gray-500">
              You're connected to Aptos testnet. Transactions are for testing purposes only.
            </p>
          </div>

          <div className="p-4 space-y-2">
            <button
              onClick={() => window.open(`https://explorer.aptoslabs.com/account/${wallet.address}?network=testnet`, '_blank')}
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
    </div>
  );
};

export default WalletButton;