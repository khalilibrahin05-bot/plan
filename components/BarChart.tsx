import React from 'react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: ChartData[];
  title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value), 0);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="p-4 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <h4 className="text-lg font-semibold text-center text-gray-700 dark:text-gray-200 mb-4">{title}</h4>
      <div className="flex justify-around items-end h-64 space-x-2 space-x-reverse pt-6">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 min-w-0">
            <div className="relative w-full h-full flex items-end justify-center">
              <div
                className="w-3/4 max-w-[50px] transition-all duration-300 rounded-t-md hover:opacity-80"
                style={{ 
                    height: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '0%',
                    backgroundColor: item.color || 'var(--color-primary-action)' 
                }}
                title={`${item.label}: ${item.value}`}
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-700 dark:text-gray-200">
                  {item.value}
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs text-center text-gray-600 dark:text-gray-400 break-words w-full h-8">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;