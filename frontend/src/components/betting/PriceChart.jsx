import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PriceChart() {
  const data = [
    { time: '1H', DOGE: 0.08, SHIB: 0.000008 },
    // Add more data points
  ];

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip
            contentStyle={{ background: '#1C2631', border: 'none' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend />
          <Line type="monotone" dataKey="DOGE" stroke="#2563eb" dot={false} />
          <Line type="monotone" dataKey="SHIB" stroke="#7c3aed" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}