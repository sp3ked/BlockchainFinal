import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import Layout from '../components/layout/Layout';
import { Clock, Users, DollarSign, Activity, ArrowLeft } from 'lucide-react';
import { getPriceData, getHistoricalData } from '../utils/coingeckoService';
import { toast } from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { parseEther } from 'ethers';

const DOGE_ID = 'dogecoin';
const SHIB_ID = 'shiba-inu';

export default function BettingPage() {
  const navigate = useNavigate();
  const { account, contract } = useWeb3();
  
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);
  
  const [prices, setPrices] = useState({
    doge: { usd: 0, usd_24h_change: 0 },
    shib: { usd: 0, usd_24h_change: 0 },
    lastUpdate: new Date().toLocaleTimeString()
  });

  const [chartData, setChartData] = useState([]);

  // Fetch historical data on mount
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const [dogeData, shibData] = await Promise.all([
          getHistoricalData(DOGE_ID),
          getHistoricalData(SHIB_ID)
        ]);

        // Combine and format data
        const formattedData = dogeData.map((doge, index) => ({
          time: new Date(doge.timestamp).toLocaleTimeString(),
          DOGE: doge.price,
          SHIB: shibData[index]?.price || 0
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching historical data:', error);
        toast.error('Error loading chart data');
      }
    };

    fetchHistoricalData();
  }, []);

  // Fetch live prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getPriceData([DOGE_ID, SHIB_ID]);
        setPrices({
          doge: {
            usd: data[DOGE_ID].usd,
            usd_24h_change: data[DOGE_ID].usd_24h_change
          },
          shib: {
            usd: data[SHIB_ID].usd,
            usd_24h_change: data[SHIB_ID].usd_24h_change
          },
          lastUpdate: new Date().toLocaleTimeString()
        });

        // Update chart with new price point
        setChartData(prev => {
          const newPoint = {
            time: new Date().toLocaleTimeString(),
            DOGE: data[DOGE_ID].usd,
            SHIB: data[SHIB_ID].usd
          };
          const updatedData = [...prev.slice(1), newPoint];
          return updatedData;
        });
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 15000);
    return () => clearInterval(interval);
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 3600);
    }, 1000);
    return () => clearInterval(timer);
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

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 0
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#fff' }
      },
      tooltip: {
        intersect: false,
        mode: 'index',
        backgroundColor: '#1C2631'
      }
    },
    scales: {
      y: {
        ticks: { color: '#9CA3AF' },
        grid: { color: '#374151' }
      },
      x: {
        ticks: { color: '#9CA3AF' },
        grid: { color: '#374151' }
      }
    }
  };

  return (
    <Layout>
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 mb-6 px-4 py-2 text-gray-400 hover:text-white hover:bg-[#1C2631] rounded-lg transition-all"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Markets</span>
      </button>

      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1C2631] rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <DollarSign className="h-4 w-4" />
            <span>DOGE Price</span>
          </div>
          <p className="text-white font-semibold">${prices.doge.usd.toFixed(6)}</p>
          <p className={`text-sm ${prices.doge.usd_24h_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {prices.doge.usd_24h_change.toFixed(2)}%
          </p>
        </div>

        <div className="bg-[#1C2631] rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <DollarSign className="h-4 w-4" />
            <span>SHIB Price</span>
          </div>
          <p className="text-white font-semibold">${prices.shib.usd.toFixed(8)}</p>
          <p className={`text-sm ${prices.shib.usd_24h_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {prices.shib.usd_24h_change.toFixed(2)}%
          </p>
        </div>

        <div className="bg-[#1C2631] rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Clock className="h-4 w-4" />
            <span>Time Left</span>
          </div>
          <p className="text-white font-semibold">{formatTime(timeLeft)}</p>
        </div>

        <div className="bg-[#1C2631] rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Activity className="h-4 w-4" />
            <span>Last Update</span>
          </div>
          <p className="text-white font-semibold">{prices.lastUpdate}</p>
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-[#1C2631] rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Price Chart</h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{ background: '#1C2631', border: 'none' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="DOGE" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="SHIB" 
                stroke="#7c3aed" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Betting Interface */}
      <div className="bg-[#1C2631] rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Place Your Bet</h2>
        <div className="grid gap-6">
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
              <div className="text-sm mt-1">${prices.doge.usd.toFixed(6)}</div>
              <div className={`text-xs mt-1 ${prices.doge.usd_24h_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {prices.doge.usd_24h_change.toFixed(2)}%
              </div>
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
              <div className="text-sm mt-1">${prices.shib.usd.toFixed(8)}</div>
              <div className={`text-xs mt-1 ${prices.shib.usd_24h_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {prices.shib.usd_24h_change.toFixed(2)}%
              </div>
            </button>
          </div>

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

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Potential Return</span>
              <span className="text-white">{betAmount ? (Number(betAmount) * 1.9).toFixed(4) : '0.0'} ETH</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Time Left</span>
              <span className="text-white">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <button
            onClick={handleBet}
            disabled={!account || !selectedCoin || !betAmount || isPlacingBet || timeLeft === 0}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 
                     disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
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
    </Layout>
  );
}