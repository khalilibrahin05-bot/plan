
import React from 'react';

interface DonutChartData {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutChartData[];
  title: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, title }) => {
  const size = 180;
  const strokeWidth = 25;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((acc, item) => acc + item.value, 0);

  let accumulatedPercentage = 0;

  if (total === 0) {
    return (
       <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border h-full">
         <h4 className="text-lg font-semibold text-gray-700 mb-2">{title}</h4>
         <p className="text-gray-500">لا توجد بيانات لعرضها</p>
       </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg border h-full">
      <h4 className="text-lg font-semibold text-gray-700 mb-4">{title}</h4>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#e5e7eb" // gray-200
            strokeWidth={strokeWidth}
          />
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const offset = circumference - (accumulatedPercentage / 100) * circumference;
            const dasharray = `${(percentage / 100) * circumference} ${circumference}`;
            accumulatedPercentage += percentage;

            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={dasharray}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-800">{total}</span>
            <span className="text-sm text-gray-500">نشاط</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((item, index) => (
          <div key={index} className="flex items-center text-sm">
            <span className="w-3 h-3 rounded-full ml-2" style={{ backgroundColor: item.color }}></span>
            <span className="text-gray-600">{item.label}:</span>
            <span className="font-semibold text-gray-800 mr-1">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;