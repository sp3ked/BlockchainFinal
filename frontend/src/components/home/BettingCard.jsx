import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

export default function BettingCard({ 
  title, 
  options, 
  volume = "0", 
  timeLeft = "1h", 
  link = "/" 
}) {
  return (
    <Link to={link}>
      <div className="bg-[#232D3F] rounded-lg p-4 hover:bg-[#2A3647] transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <h3 className="font-semibold text-white">{title}</h3>
          </div>
          <span className="text-sm text-gray-400">{timeLeft}</span>
        </div>

        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-300">{option.name}</span>
              <span className={`text-sm ${
                option.percentage > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {option.percentage}%
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-400">Vol. ${volume}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">View Market</span>
          </div>
        </div>
      </div>
    </Link>
  );
}