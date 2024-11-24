import React, { useState } from 'react';

export default function BettingForm() {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [amount, setAmount] = useState('');

  return (
    <div className="bg-[#232D3F] rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Place Your Bet</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedCoin('DOGE')}
            className={`p-4 rounded-lg text-center transition-all ${
              selectedCoin === 'DOGE'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            DOGE
          </button>
          <button
            onClick={() => setSelectedCoin('SHIB')}
            className={`p-4 rounded-lg text-center transition-all ${
              selectedCoin === 'SHIB'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            SHIB
          </button>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Amount (ETH)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.0"
          />
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Potential Return</span>
            <span className="text-white">{amount ? (Number(amount) * 1.9).toFixed(4) : '0.0'} ETH</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Time Left</span>
            <span className="text-white">59:59</span>
          </div>
        </div>

        <button
          disabled={!selectedCoin || !amount}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          Place Bet
        </button>
      </div>
    </div>
  );
}