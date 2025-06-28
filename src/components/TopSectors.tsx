import React from 'react';

const TopSectors = () => {
  const sectors = [
    { name: 'Banking', count: 45, change: '+2.45%', positive: true },
    { name: 'IT', count: 32, change: '+1.85%', positive: true },
    { name: 'Auto', count: 28, change: '-0.75%', positive: false },
    { name: 'Pharma', count: 24, change: '+3.20%', positive: true },
    { name: 'FMCG', count: 18, change: '+0.95%', positive: true },
    { name: 'Energy', count: 15, change: '-1.25%', positive: false },
    { name: 'Metals', count: 12, change: '-2.10%', positive: false },
  ];

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Top Sectors</h2>
        <button className="text-blue-600 hover:text-blue-700 font-medium">
          View All Sectors
        </button>
      </div>
      
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {sectors.map((sector, index) => (
          <div
            key={index}
            className="flex-shrink-0 bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer min-w-[140px]"
          >
            <div className="font-semibold text-gray-900 mb-1">{sector.name}</div>
            <div className="text-sm text-gray-500 mb-2">{sector.count} stocks</div>
            <div className={`text-sm font-medium ${
              sector.positive ? 'text-green-600' : 'text-red-600'
            }`}>
              {sector.change}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopSectors;