import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import Layout from '../components/layout/Layout';
import { Clock, ArrowLeft } from 'lucide-react';
import { getLatestPrices } from '../utils/priceService';
import { toast } from 'react-hot-toast';
import { parseEther } from 'ethers';

export default function BettingPage() {
  const navigate = useNavigate();
  const { account, contract } = useWeb3();

  const [selectedCoin, setSelectedCoin] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [prices, setPrices] = useState({
    DOGE: { price: 0, change: null },
    SHIB: { price: 0, change: null },
    lastUpdate: null
  });

  // Timer that resets every hour
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      return Math.floor((nextHour - now) / 1000);
    };

    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft());
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let intervalId;

    const fetchPrices = async () => {
      try {
        const newPrices = await getLatestPrices();
        setPrices(newPrices);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrices();
    intervalId = setInterval(fetchPrices, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBet = async () => {
    try {
      if (!contract || !account || !betAmount || !selectedCoin) {
        toast.error('Please connect wallet and select options');
        return;
      }

      setIsPlacingBet(true);
      const amount = parseEther(betAmount);

      const tx = await contract.placeBet(selectedCoin === 'DOGE', {
        value: amount
      });

      toast.loading('Placing bet...');
      await tx.wait();

      toast.success('Bet placed successfully!');
      setBetAmount('');
      setSelectedCoin(null);
    } catch (error) {
      console.error('Error placing bet:', error);
      toast.error('Failed to place bet');
    } finally {
      setIsPlacingBet(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-white text-xl">Loading price data...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 mb-6 px-4 py-2 text-gray-400 hover:text-white hover:bg-[#1C2631] rounded-lg transition-all"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Markets</span>
      </button>

      {/* Timer */}
      <div className="flex justify-center items-center mb-8">
        <div className="bg-[#1C2631] rounded-lg p-6 flex items-center gap-3">
          <Clock className="h-6 w-6 text-blue-400" />
          <span className="text-2xl font-bold text-white">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Price Display */}
      <div className="flex justify-center items-center space-x-8 mb-12">
        <div className={`text-center transition-all ${
          selectedCoin === 'DOGE' ? 'transform scale-110' : ''
        }`}>
          <div className="text-4xl font-bold mb-2">DOGE</div>
          <div className={`text-6xl font-bold mb-2 ${
            prices.DOGE.change !== null
              ? prices.DOGE.change >= 0 ? 'text-green-400' : 'text-red-400'
              : 'text-gray-500'
          }`}>
            {prices.DOGE.change !== null
              ? `${prices.DOGE.change >= 0 ? '↑' : '↓'} ${Math.abs(prices.DOGE.change).toFixed(2)}%`
              : 'N/A'}
          </div>
          <div className="text-2xl text-gray-400">
            ${prices.DOGE.price.toFixed(6)}
          </div>
        </div>

        <div className="text-6xl font-bold text-blue-500">VS</div>

        <div className={`text-center transition-all ${
          selectedCoin === 'SHIB' ? 'transform scale-110' : ''
        }`}>
          <div className="text-4xl font-bold mb-2">SHIB</div>
          <div className={`text-6xl font-bold mb-2 ${
            prices.SHIB.change !== null
              ? prices.SHIB.change >= 0 ? 'text-green-400' : 'text-red-400'
              : 'text-gray-500'
          }`}>
            {prices.SHIB.change !== null
              ? `${prices.SHIB.change >= 0 ? '↑' : '↓'} ${Math.abs(prices.SHIB.change).toFixed(2)}%`
              : 'N/A'}
          </div>
          <div className="text-2xl text-gray-400">
            ${prices.SHIB.price.toFixed(8)}
          </div>
        </div>
      </div>

      {/* Betting Interface */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#1C2631] rounded-lg p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedCoin('DOGE')}
                className={`p-6 rounded-lg text-center transition-all ${
                  selectedCoin === 'DOGE'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="text-2xl">BET ON DOGE</div>
              </button>

              <button
                onClick={() => setSelectedCoin('SHIB')}
                className={`p-6 rounded-lg text-center transition-all ${
                  selectedCoin === 'SHIB'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="text-2xl">BET ON SHIB</div>
              </button>
            </div>

            <div>
              <label className="block text-lg text-gray-400 mb-2">
                Bet Amount (ETH)
              </label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full p-4 bg-gray-700 rounded-lg text-white text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.0"
                step="0.01"
              />
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between text-lg mb-2">
                <span className="text-gray-400">Potential Return</span>
                <span className="text-white">
                  {betAmount ? (Number(betAmount) * 1.9).toFixed(4) : '0.0'} ETH
                </span>
              </div>
            </div>

            <button
              onClick={handleBet}
              disabled={!account || !selectedCoin || !betAmount || isPlacingBet || timeLeft === 0}
              className="w-full py-4 bg-blue-500 text-white text-xl rounded-lg font-semibold 
                       hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed 
                       transition-colors"
            >
              {!account 
                ? 'Connect Wallet to Bet'
                : isPlacingBet
                  ? 'Placing Bet...'
                  : timeLeft === 0
                    ? 'Betting Period Ended'
                    : 'Place Bet'
              }
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
