import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Stocks from './pages/Stocks';
import MutualFunds from './pages/MutualFunds';
import Portfolio from './pages/Portfolio';
import BankDeposits from './pages/BankDeposits';
import PreIPO from './pages/PreIPO';
import TokenPortfolio from './pages/TokenPortfolio';
import { WalletProvider } from './contexts/WalletContext';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/mutual-funds" element={<MutualFunds />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/bank-deposits" element={<BankDeposits />} />
            <Route path="/pre-ipo" element={<PreIPO />} />
            <Route path="/token-portfolio" element={<TokenPortfolio />} />
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;