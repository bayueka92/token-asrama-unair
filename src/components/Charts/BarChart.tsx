import React from 'react';

interface BarChartProps {
  data: { day: string; purchases: number; revenue: number }[];
  type: 'purchases' | 'revenue';
}

const BarChart: React.FC<BarChartProps> = ({ data, type }) => {
  const maxValue = Math.max(...data.map(item => type === 'purchases' ? item.purchases : item.revenue));
  
  return (
    <div className="w-full h-64 relative">
      <svg className="w-full h-full" viewBox="0 0 400 200">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1="40"
            y1={40 + i * 32}
            x2="360"
            y2={40 + i * 32}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        
        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map(i => (
          <text
            key={i}
            x="35"
            y={45 + i * 32}
            textAnchor="end"
            fontSize="10"
            fill="#6b7280"
            className="dark:fill-gray-400"
          >
            {Math.round(maxValue - (i * maxValue / 4))}
          </text>
        ))}
        
        {/* Bars */}
        {data.map((item, index) => {
          const x = 40 + (index * 320) / data.length;
          const value = type === 'purchases' ? item.purchases : item.revenue;
          const height = (128 * value) / maxValue;
          const y = 168 - height;
          const barWidth = 320 / data.length - 10;
          
          return (
            <rect
              key={index}
              x={x + 5}
              y={y}
              width={barWidth}
              height={height}
              fill="#10b981"
              className="hover:opacity-80 transition-opacity"
              rx="2"
            />
          );
        })}
        
        {/* X-axis labels */}
        {data.map((item, index) => {
          const x = 40 + (index * 320) / data.length + (320 / data.length) / 2;
          return (
            <text
              key={index}
              x={x}
              y="185"
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
              className="dark:fill-gray-400"
            >
              {item.day}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default BarChart;