import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useWeb3 } from '../../context/Web3Context';
import { formatEther, parseEther } from 'ethers';
import { toast } from 'react-hot-toast';
import { Clock } from 'lucide-react';

export default function BettingInterface({ prices, onBetPlaced }) {
  const { account, contract } = useWeb3();
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'DOGE',
        data: [],
        borderColor: '#2563eb',
        tension: 0.4,
      },
      {
        label: 'SHIB',
        data: [],
        borderColor: '#7c3aed',
        tension: 0.4,
      }
    ]
  });

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          return 3600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Update chart data when prices change
  useEffect(() => {
    if (prices.doge && prices.shib) {
      const timestamp = new Date().toLocaleTimeString();
      setChartData(prev => ({
        labels: [...prev.labels, timestamp].slice(-20),
        datasets: [
          {
            ...prev.datasets[0],
            data: [...prev.datasets[0].data, prices.doge].slice(-20)
          },
          {
            ...prev.datasets[1],
            data: [...prev.datasets[1].data, prices.shib].slice(-20)
          }
        ]
      }));
    }
  }, [prices]);

  const handleBet = async () => {
    try {
      if (!contract || !account || !betAmount || !selectedCoin) {
        toast.error('Please connect wallet and select options');
        return;
      }

      const amount = parseEther(betAmount);
      const tx = await contract.placeBet(selectedCoin === 'DOGE', {
        value: amount
      });

      toast.loading('Placing bet...');
      await tx.wait();
      
      toast.success('Bet placed successfully!');
      setBetAmount('');
      setSelectedCoin(null);
      onBetPlaced?.();

    } catch (error) {
      console.error('Error placing bet:', error);
      toast.error('Failed to place bet');
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: '#9CA3AF' },
        grid: { color: '#374151' }
      },
      y: {
        ticks: { color: '#9CA3AF' },
        grid: { color: '#374151' }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#fff' }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1
      }
    },
    animation: {
      duration: 0
    }
  };

  return (
    <div className="space-y-6">
      {/* Price Chart */}
      <div className="bg-[#1F2937] rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Live Price Chart</h2>
        <div className="h-[400px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Betting Interface */}
      <div className="bg-[#1F2937] rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Place Your Bet</h2>
          <div className="flex items-center space-x-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Coin Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedCoin('DOGE')}
              className={`p-4 rounded-lg text-center transition-all ${
                selectedCoin === 'DOGE'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div>DOGE</div>
              <div className="text-sm mt-1">${prices.doge?.toFixed(6) || '0.00'}</div>
            </button>
            <button
              onClick={() => setSelectedCoin('SHIB')}
              className={`p-4 rounded-lg text-center transition-all ${
                selectedCoin === 'SHIB'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div>SHIB</div>
              <div className="text-sm mt-1">${prices.shib?.toFixed(8) || '0.00'}</div>
            </button>
          </div>

          {/* Bet Amount Input */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Bet Amount (ETH)</label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.0"
              step="0.01"
            />
          </div>

          {/* Potential Returns */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Potential Return</span>
              <span className="text-white">
                {betAmount ? (Number(betAmount) * 1.9).toFixed(4) : '0.0'} ETH
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Time Left</span>
              <span className="text-white">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Place Bet Button */}
          <button
            onClick={handleBet}
            disabled={!account || !selectedCoin || !betAmount || timeLeft === 0}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 
                     disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {!account 
              ? 'Connect Wallet to Bet'
              : timeLeft === 0
                ? 'Betting Period Ended'
                : 'Place Bet'
            }
          </button>
        </div>
      </div>
    </div>
  );
}