import { Contract } from 'ethers';

const DOGE_FEED_ADDRESS = "0x72d7b6C7f38e724f65b46513ac8092021B4365c3"; // Sepolia
const SHIB_FEED_ADDRESS = "0x8dBF1E14B44		or21e71F8589798B64FF0200B55bb4"; // Sepolia

const AGGREGATOR_ABI = [
  {
    "inputs": [],
    "name": "latestRoundData",
    "outputs": [
      { "name": "roundId", "type": "uint80" },
      { "name": "answer", "type": "int256" },
      { "name": "startedAt", "type": "uint256" },
      { "name": "updatedAt", "type": "uint256" },
      { "name": "answeredInRound", "type": "uint80" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const getPrices = async (provider) => {
  try {
    const dogeFeed = new Contract(DOGE_FEED_ADDRESS, AGGREGATOR_ABI, provider);
    const shibFeed = new Contract(SHIB_FEED_ADDRESS, AGGREGATOR_ABI, provider);

    const [dogeData, shibData] = await Promise.all([
      dogeFeed.latestRoundData(),
      shibFeed.latestRoundData()
    ]);

    return {
      doge: Number(dogeData.answer) / 1e8,
      shib: Number(shibData.answer) / 1e8,
      timestamp: Math.max(
        Number(dogeData.updatedAt),
        Number(shibData.updatedAt)
      )
    };
  } catch (error) {
    console.error("Error fetching prices:", error);
    throw error;
  }
};