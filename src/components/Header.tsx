import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, X, TrendingUp, PieChart, BarChart3, Wallet, Building2, Coins, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';
import WalletButton from './WalletButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: TrendingUp },
    { name: 'Stocks', href: '/stocks', icon: BarChart3 },
    { name: 'Mutual Funds', href: '/mutual-funds', icon: PieChart },
    { name: 'Bank Deposits', href: '/bank-deposits', icon: Building2 },
    { name: 'Pre-IPO', href: '/pre-ipo', icon: Coins },
    { name: 'Portfolio', href: '/portfolio', icon: Wallet },
    { name: 'Token Portfolio', href: '/token-portfolio', icon: Coins },
  ];

  // Load cache stats on component mount
  useEffect(() => {
    loadCacheStats();
  }, []);

  const loadCacheStats = async () => {
    try {
      const response = await apiService.getCacheStats();
      setCacheStats(response.data);
    } catch (error) {
      console.error('Error loading cache stats:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await apiService.refreshCache();
      await loadCacheStats();
      // Reload current page data
      window.location.reload();
    } catch (error) {
      console.error('Error refreshing cache:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Invest 360</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors text-sm"
              title={`Refresh data${cacheStats ? ` (${cacheStats.totalEntries} cached items)` : ''}`}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Wallet Connect Button */}
            <WalletButton />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
              >
                <User className="h-5 w-5 text-gray-600" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/portfolio"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Portfolio
                  </Link>
                  <Link
                    to="/token-portfolio"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Token Portfolio
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </Link>
                  {cacheStats && (
                    <div className="px-4 py-2 text-xs text-gray-500 border-t">
                      Cache: {cacheStats.totalEntries} items
                    </div>
                  )}
                  <hr className="my-1" />
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 w-full"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;