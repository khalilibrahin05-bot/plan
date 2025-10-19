import React from 'react';

interface ChartData {
  label: string;
  value1: number;
  value2: number;
}

interface GroupedBarChartProps {
  data: ChartData[];
  title: string;
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({ data, title }) => {
  const maxValue = Math.max(...data.flatMap(d => [d.value1, d.value2]), 1);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="p-4 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm h-full flex flex-col">
      <h4 className="text-lg font-semibold text-center text-gray-700 dark:text-gray-200 mb-2">{title}</h4>
      <div className="flex-grow flex justify-around items-end h-64 space-x-2 space-x-reverse pt-6">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 min-w-0 h-full">
            <div className="relative w-full h-full flex items-end justify-center gap-1">
              {/* Bar 1: Planned */}
              <div
                className="w-1/2 bg-sky-400 hover:bg-sky-500 transition-all duration-300 rounded-t-sm"
                style={{ height: `${(item.value1 / maxValue) * 100}%` }}
                title={`المخطط: ${item.value1}`}
              >
                 <span className="absolute -top-5 left-1/4 -translate-x-1/2 text-xs font-bold text-gray-600 dark:text-gray-300">
                  {item.value1}
                </span>
              </div>
              {/* Bar 2: Executed */}
              <div
                className="w-1/2 bg-amber-400 hover:bg-amber-500 transition-all duration-300 rounded-t-sm"
                style={{ height: `${(item.value2 / maxValue) * 100}%` }}
                title={`المنفذ: ${item.value2}`}
              >
                 <span className="absolute -top-5 right-1/4 -translate-x-1/2 text-xs font-bold text-gray-600 dark:text-gray-300">
                  {item.value2}
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs text-center text-gray-600 dark:text-gray-400 break-words w-full h-8">
              {item.label}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center space-x-4 space-x-reverse mt-4 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center">
            <span className="w-4 h-4 bg-sky-400 rounded-sm ml-2"></span>
            <span>المخطط</span>
        </div>
        <div className="flex items-center">
            <span className="w-4 h-4 bg-amber-400 rounded-sm ml-2"></span>
            <span>المنفذ</span>
        </div>
      </div>
    </div>
  );
};

export default GroupedBarChart;