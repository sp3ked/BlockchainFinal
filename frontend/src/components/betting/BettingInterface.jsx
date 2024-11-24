import React from 'react';
import PriceChart from './PriceChart';
import BettingForm from './BettingForm';

export default function BettingInterface() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-[#232D3F] rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">DOGE vs SHIB</h2>
          <PriceChart />
        </div>
      </div>
      <div className="lg:col-span-1">
        <BettingForm />
      </div>
    </div>
  );
}