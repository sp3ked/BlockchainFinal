const BASE_URL = 'https://api.coingecko.com/api/v3';

export const getPriceData = async (coinIds) => {
  try {
    const response = await fetch(
      `${BASE_URL}/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd&include_24hr_change=true`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching price data:', error);
    throw error;
  }
};

export const getHistoricalData = async (coinId, days = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=hourly`
    );
    const data = await response.json();
    return data.prices.map(([timestamp, price]) => ({
      timestamp,
      price
    }));
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};