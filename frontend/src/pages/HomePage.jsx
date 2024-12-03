import React from 'react';
import Layout from '../components/layout/Layout';
import BettingCard from '../components/home/BettingCard';
import { TrendingUp, Activity, Clock, Filter } from 'lucide-react';

export default function HomePage() {
  const bettingMarkets = [
    {
      title: "DOGE vs SHIB (working)",
      options: [
        { name: "DOGE", percentage: 56.2 },
        { name: "SHIB", percentage: 43.8 }
      ],
      volume: "125K",
      timeLeft: "58m",
      link: "/bet/doge-vs-shib"
    },
    {
      title: "PEPE vs WOJAK (filler)",
      options: [
        { name: "PEPE", percentage: 62.5 },
        { name: "WOJAK", percentage: 37.5 }
      ],
      volume: "75K",
      timeLeft: "32m",
      link: "/bet/pepe-vs-wojak"
    },
    {
      title: "FLOKI vs BONK (filler)",
      options: [
        { name: "FLOKI", percentage: 48.3 },
        { name: "BONK", percentage: 51.7 }
      ],
      volume: "95K",
      timeLeft: "45m",
      link: "/bet/floki-vs-bonk"
    }
  ];

  return (
    <Layout>
      {/* Market Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search markets..."
              className="w-full bg-[#232D3F] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 bg-[#232D3F] rounded-lg hover:bg-[#2A3647] transition-all">
            <Filter className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Market Categories (filler)*/}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
            <TrendingUp className="h-4 w-4" />
            Trending
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#232D3F] text-gray-300 rounded-lg hover:bg-[#2A3647]">
            <Activity className="h-4 w-4" />
            New
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#232D3F] text-gray-300 rounded-lg hover:bg-[#2A3647]">
            <Clock className="h-4 w-4" />
            Ending Soon
          </button>
        </div>
      </div>

      {/* Markets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bettingMarkets.map((market, index) => (
          <BettingCard key={index} {...market} />
        ))}
      </div>
    </Layout>
  );
}