import { ethers } from 'ethers';

export const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatAmount = (amount, decimals = 4) => {
  if (!amount) return '0';
  return Number(amount).toFixed(decimals);
};

export const formatEther = (wei) => {
  if (!wei) return '0';
  return ethers.utils.formatEther(wei);
};

export const parseEther = (eth) => {
  if (!eth) return '0';
  return ethers.utils.parseEther(eth.toString());
};

export const calculateTimeLeft = (deadline) => {
  const difference = +new Date(deadline) - +new Date();
  if (difference <= 0) return { minutes: '00', seconds: '00' };

  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return {
    minutes: minutes < 10 ? `0${minutes}` : minutes,
    seconds: seconds < 10 ? `0${seconds}` : seconds,
  };
};

export const calculatePriceChange = (oldPrice, newPrice) => {
  if (!oldPrice || !newPrice) return '0';
  const change = ((newPrice - oldPrice) / oldPrice) * 100;
  return change.toFixed(2);
};

export const formatVolume = (volume) => {
  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(2)}M`;
  }
  if (volume >= 1000) {
    return `$${(volume / 1000).toFixed(2)}K`;
  }
  return `$${volume}`;
};