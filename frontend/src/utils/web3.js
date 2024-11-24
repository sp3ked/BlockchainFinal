import { parseEther, formatEther } from 'ethers';

// Helper function to format eth amounts
export const formatEthAmount = (wei) => {
  if (!wei) return '0';
  return formatEther(wei);
};

// Helper function to parse eth amounts
export const parseEthAmount = (eth) => {
  if (!eth) return '0';
  return parseEther(eth.toString());
};