import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import BettingInterface from '../components/betting/BettingInterface';
import { Clock, Users, DollarSign, Activity, ArrowLeft } from 'lucide-react';

export default function BettingPage() {
  const { pair } = useParams();
  const navigate = useNavigate();
  const [marketData] = useState({
    title: pair ? `${pair.split('-').join(' vs ')}` : "DOGE vs SHIB",
    description: `Will ${pair?.split('-')[0] || 'DOGE'} outperform ${pair?.split('-')[1] || 'SHIB'} in the next hour?`,
    totalVolume: "125,000",
    participants: "1,243",
    timeLeft: "58:32",
    priceChange: {
      DOGE: "+5.2%",
      SHIB: "+2.8%"
    }
  });

  return (
    <Layout>
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 mb-6 px-4 py-2 text-gray-400 hover:text-white hover:bg-[#2A3647] rounded-lg transition-all"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Markets</span>
      </button>
      {/* Market Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">{marketData.title}</h1>
        <p className="text-gray-400 mb-4">{marketData.description}</p>
        
        {/* Market Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#232D3F] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <DollarSign className="h-4 w-4" />
              <span>Volume</span>
            </div>
            <p className="text-white font-semibold">${marketData.totalVolume}</p>
          </div>
          
          <div className="bg-[#232D3F] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Users className="h-4 w-4" />
              <span>Participants</span>
            </div>
            <p className="text-white font-semibold">{marketData.participants}</p>
          </div>
          
          <div className="bg-[#232D3F] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Clock className="h-4 w-4" />
              <span>Time Left</span>
            </div>
            <p className="text-white font-semibold">{marketData.timeLeft}</p>
          </div>
          
          <div className="bg-[#232D3F] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Activity className="h-4 w-4" />
              <span>Price Change</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-green-400 text-sm">
                DOGE {marketData.priceChange.DOGE}
              </div>
              <div className="text-green-400 text-sm">
                SHIB {marketData.priceChange.SHIB}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Betting Interface */}
      <BettingInterface />

      {/* Recent Activity */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="bg-[#232D3F] rounded-lg p-4">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-sm">
                <th className="text-left py-2">User</th>
                <th className="text-left py-2">Position</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Time</th>
              </tr>
            </thead>
            <tbody className="text-white">
              <tr className="border-t border-gray-700">
                <td className="py-3">0x1234...5678</td>
                <td className="text-green-400">DOGE</td>
                <td>0.5 ETH</td>
                <td className="text-gray-400">2m ago</td>
              </tr>
              <tr className="border-t border-gray-700">
                <td className="py-3">0x8765...4321</td>
                <td className="text-purple-400">SHIB</td>
                <td>0.3 ETH</td>
                <td className="text-gray-400">5m ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}