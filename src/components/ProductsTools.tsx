import React from 'react';
import { BarChart3, PieChart, TrendingUp, Calculator, Calendar, Shield, Building2, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductsTools = () => {
  const products = [
    {
      icon: BarChart3,
      title: 'Stocks',
      description: 'Invest in stocks with zero brokerage',
      color: 'bg-blue-500',
      link: '/stocks',
    },
    {
      icon: PieChart,
      title: 'Mutual Funds',
      description: 'SIP starting from ₹100',
      color: 'bg-green-500',
      link: '/mutual-funds',
    },
    {
      icon: Building2,
      title: 'Bank Deposits',
      description: 'FD & RD with best rates',
      color: 'bg-orange-500',
      link: '/bank-deposits',
    },
    {
      icon: Coins,
      title: 'Pre-IPO',
      description: 'Tokenized pre-IPO shares',
      color: 'bg-purple-500',
      link: '/pre-ipo',
    },
    {
      icon: TrendingUp,
      title: 'F&O Trading',
      description: 'Trade futures and options',
      color: 'bg-red-500',
      link: '/stocks',
    },
    {
      icon: Calendar,
      title: 'IPO',
      description: 'Apply for upcoming IPOs',
      color: 'bg-indigo-500',
      link: '/stocks',
    },
  ];

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Products & Tools</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product, index) => {
          const Icon = product.icon;
          return (
            <Link
              key={index}
              to={product.link}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className={`${product.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{product.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ProductsTools;