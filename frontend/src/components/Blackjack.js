import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BlackjackABI from '../contracts/BlackjackABI';

const BLACKJACK_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function Blackjack() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        toast.error("Please install MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const blackjackContract = new ethers.Contract(
        BLACKJACK_ADDRESS,
        BlackjackABI,
        signer
      );

      setContract(blackjackContract);
      setAccount(accounts[0]);
      
      // Listen for card dealt events
      blackjackContract.on("CardDealt", (player, card, isPlayer) => {
        if (player.toLowerCase() === accounts[0].toLowerCase()) {
          if (isPlayer) {
            setPlayerCards(prev => [...prev, Number(card)]);
          } else {
            setDealerCards(prev => [...prev, Number(card)]);
          }
        }
      });

      // Listen for game events
      blackjackContract.on("GameStarted", (player) => {
        if (player.toLowerCase() === accounts[0].toLowerCase()) {
          setGameInProgress(true);
          toast.success("Game started!");
        }
      });

      blackjackContract.on("GameEnded", (player, result) => {
        if (player.toLowerCase() === accounts[0].toLowerCase()) {
          setGameInProgress(false);
          toast.info(result);
        }
      });

    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Error connecting wallet");
    }
  };

  const startGame = async () => {
    try {
      setLoading(true);
      const tx = await contract.startGame();
      await tx.wait();
      setPlayerCards([]);
      setDealerCards([]);
    } catch (error) {
      console.error("Error starting game:", error);
      toast.error("Error starting game");
    } finally {
      setLoading(false);
    }
  };

  const hit = async () => {
    try {
      setLoading(true);
      const tx = await contract.hit();
      await tx.wait();
    } catch (error) {
      console.error("Error hitting:", error);
      toast.error("Error hitting");
    } finally {
      setLoading(false);
    }
  };

  const stand = async () => {
    try {
      setLoading(true);
      const tx = await contract.stand();
      await tx.wait();
    } catch (error) {
      console.error("Error standing:", error);
      toast.error("Error standing");
    } finally {
      setLoading(false);
    }
  };

  const getCardDisplay = (card) => {
    if (!card) return "🂠";
    const value = card;
    if (value === 1) return "A";
    if (value === 11) return "J";
    if (value === 12) return "Q";
    if (value === 13) return "K";
    return value.toString();
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <ToastContainer />
      
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">Blackjack</h1>
        {account ? (
          <p className="text-sm text-gray-600">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
        ) : (
          <button 
            onClick={connectWallet}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {account && (
        <div>
          {!gameInProgress ? (
            <button
              onClick={startGame}
              disabled={loading}
              className="bg-green-500 text-white px-6 py-2 rounded disabled:bg-gray-400"
            >
              {loading ? "Starting..." : "Start Game"}
            </button>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-800 p-4 rounded-lg">
                <h2 className="text-white mb-2">Dealer's Cards</h2>
                <div className="flex space-x-2">
                  {dealerCards.map((card, index) => (
                    <div key={index} className="bg-white p-4 rounded text-2xl">
                      {getCardDisplay(card)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-800 p-4 rounded-lg">
                <h2 className="text-white mb-2">Your Cards</h2>
                <div className="flex space-x-2">
                  {playerCards.map((card, index) => (
                    <div key={index} className="bg-white p-4 rounded text-2xl">
                      {getCardDisplay(card)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={hit}
                  disabled={loading}
                  className="bg-blue-500 text-white px-6 py-2 rounded disabled:bg-gray-400"
                >
                  {loading ? "Hitting..." : "Hit"}
                </button>
                <button
                  onClick={stand}
                  disabled={loading}
                  className="bg-red-500 text-white px-6 py-2 rounded disabled:bg-gray-400"
                >
                  {loading ? "Standing..." : "Stand"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Blackjack;