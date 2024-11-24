import React from 'react';
import BettingCard from './BettingCard';

export default function TrendingBets() {
  const bettingMarkets = [
    {
      title: "DOGE vs SHIB",
      options: [
        { name: "DOGE", percentage: 56 },
        { name: "SHIB", percentage: 44 }
      ],
      volume: "125K",
      timeLeft: "58m",
      link: "/bet/doge-vs-shib"
    },
    // Add more markets here
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bettingMarkets.map((market, index) => (
        <BettingCard key={index} {...market} />
      ))}
    </div>
  );
}