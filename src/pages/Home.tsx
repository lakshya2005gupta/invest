import React from 'react';
import Hero from '../components/Hero';
import MarketIndices from '../components/MarketIndices';
import ProductsTools from '../components/ProductsTools';
import TopMovers from '../components/TopMovers';
import TopSectors from '../components/TopSectors';
import MarketCapTable from '../components/MarketCapTable';
import BankDepositsPreview from '../components/BankDepositsPreview';
import PreIPOPreview from '../components/PreIPOPreview';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <MarketIndices />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductsTools />
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <TopMovers title="Top Gainers" type="gainers" />
          <TopMovers title="Top Losers" type="losers" />
        </div>
        <TopSectors />
        <BankDepositsPreview />
        <PreIPOPreview />
        <MarketCapTable />
      </div>
    </div>
  );
};

export default Home;