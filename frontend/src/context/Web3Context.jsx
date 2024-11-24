import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserProvider, Contract, formatEther, parseEther } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contracts';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, );

  useEffect(() => {
    if (window.ethereum) {
      // MetaMask uses .on and .removeAllListeners, not .removeListener
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());

      return () => {
        if (window.ethereum.removeAllListeners) {
          window.ethereum.removeAllListeners('accountsChanged');
          window.ethereum.removeAllListeners('chainChanged');
        }
      };
    }
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setError('Please install MetaMask');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await handleAccountsChanged(accounts);
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
      setError('Error connecting to wallet');
    }
  };

  const handleAccountsChanged = async (accounts) => {
    try {
      if (accounts.length === 0) {
        setAccount(null);
        setBalance('0');
        setContract(null);
        return;
      }

      const newAccount = accounts[0];
      setAccount(newAccount);
      
      const newProvider = new BrowserProvider(window.ethereum);
      setProvider(newProvider);

      const balance = await newProvider.getBalance(newAccount);
      setBalance(formatEther(balance));

      const signer = await newProvider.getSigner();
      const newContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(newContract);
    } catch (err) {
      console.error('Error handling account change:', err);
      setError('Error updating account information');
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      await handleAccountsChanged(accounts);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const placeBet = async (isBettingOnDoge, amount) => {
    try {
      if (!contract) throw new Error('Contract not initialized');
      
      const tx = await contract.placeBet(isBettingOnDoge, {
        value: parseEther(amount.toString())
      });
      
      await tx.wait();
      return tx.hash;
    } catch (err) {
      console.error('Error placing bet:', err);
      throw err;
    }
  };

  const value = {
    account,
    balance,
    isConnecting,
    error,
    connectWallet,
    placeBet,
    contract,
    provider
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}