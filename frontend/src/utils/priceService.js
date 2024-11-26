const API_URL = 'https://api.coingecko.com/api/v3';

const COINS = {
  DOGE: 'dogecoin',
  SHIB: 'shiba-inu'
};

export const getLatestPrices = async () => {
  try {
    const response = await fetch(
      `${API_URL}/simple/price?ids=${COINS.DOGE},${COINS.SHIB}&vs_currencies=usd&include_24h_change=true`,
      { cache: 'no-store' }
    );

    if (!response.ok) throw new Error('Price fetch failed');

    const data = await response.json();
    console.log('API Response:', data); // Debugging log to verify API response structure

    return {
      DOGE: {
        price: data[COINS.DOGE]?.usd || 0, // Fallback to 0 if price is undefined
        change: data[COINS.DOGE]?.usd_24h_change || 0 // Fallback to 0 if change is undefined
      },
      SHIB: {
        price: data[COINS.SHIB]?.usd || 0,
        change: data[COINS.SHIB]?.usd_24h_change || 0
      },
      lastUpdate: new Date().toLocaleTimeString()
    };
  } catch (error) {
    console.error('Price fetch error:', error); // Log error for debugging
    return {
      DOGE: { price: 0, change: null }, // Null indicates an error fetching data
      SHIB: { price: 0, change: null },
      lastUpdate: 'Error updating'
    };
  }
};
