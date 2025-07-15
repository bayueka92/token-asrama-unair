import React from 'react';

interface LineChartProps {
  data: { month: string; purchases: number; revenue: number }[];
  type: 'purchases' | 'revenue';
}

const LineChart: React.FC<LineChartProps> = ({ data, type }) => {
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
        
        {/* Line path */}
        <polyline
          points={data.map((item, index) => {
            const x = 40 + (index * 320) / (data.length - 1);
            const value = type === 'purchases' ? item.purchases : item.revenue;
            const y = 40 + (128 * (1 - value / maxValue));
            return `${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const x = 40 + (index * 320) / (data.length - 1);
          const value = type === 'purchases' ? item.purchases : item.revenue;
          const y = 40 + (128 * (1 - value / maxValue));
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#3b82f6"
              className="hover:r-6 transition-all"
            />
          );
        })}
        
        {/* X-axis labels */}
        {data.map((item, index) => {
          const x = 40 + (index * 320) / (data.length - 1);
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
              {item.month}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default LineChart;