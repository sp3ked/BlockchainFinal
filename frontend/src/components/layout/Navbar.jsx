import React, { useState } from 'react';
import { Wallet, Bell} from 'lucide-react';
import { useNavigate} from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';

export default function Navbar() {
  const [balance] = useState("0.00");
  const navigate = useNavigate();
  const { connectWallet, account } = useWeb3();

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-[#1C2631] border-b border-gray-800">
      <div className="flex items-center space-x-8">
        <h1 
          className="text-xl font-bold text-white cursor-pointer" 
          onClick={() => navigate('/')}
        >
          MEME battles
        </h1>
      </div>

      <div className="flex items-center space-x-6">
        <Bell className="h-5 w-5 text-gray-400 cursor-pointer hover:text-white" />
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-400">Portfolio</p>
            <p className="text-white">${balance}</p>
          </div>
          
          <button
                onClick={connectWallet}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            ><Wallet className="h-4 w-4" />
                {account ? `Connected: ${account.slice(0, 6)}...` : 'Connect Wallet'}
            </button>
        </div>
      </div>
    </nav>
  );
}