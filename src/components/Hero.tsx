import React from 'react';
import { ArrowRight, TrendingUp, Shield, Zap, Coins } from 'lucide-react';

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Invest 360°
              <br />
              <span className="text-yellow-300">Complete Investment</span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
              Your all-in-one investment platform. Stocks, Mutual Funds, Bank Deposits, 
              and Pre-IPO tokenization on Aptos blockchain. Start your wealth journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                <span>Start Investing</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200">
                Connect Wallet
              </button>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 p-2 rounded-full">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Zero Fees</div>
                  <div className="text-blue-200 text-sm">No hidden charges</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 p-2 rounded-full">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Blockchain Secure</div>
                  <div className="text-blue-200 text-sm">Aptos powered</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Real-time</div>
                  <div className="text-blue-200 text-sm">Live market data</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 p-2 rounded-full">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Pre-IPO Access</div>
                  <div className="text-blue-200 text-sm">Tokenized shares</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-4">Market Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>NIFTY 50</span>
                  <div className="text-right">
                    <div className="font-semibold">23,850.60</div>
                    <div className="text-green-300 text-sm">+245.30 (+1.04%)</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>SENSEX</span>
                  <div className="text-right">
                    <div className="font-semibold">78,540.20</div>
                    <div className="text-green-300 text-sm">+820.45 (+1.06%)</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>APT/USD</span>
                  <div className="text-right">
                    <div className="font-semibold">$12.45</div>
                    <div className="text-green-300 text-sm">+0.85 (+7.32%)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;