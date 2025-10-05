
import React from 'react';
import { MONTHS } from '../constants';

interface MonthSelectorProps {
  selectedIndex: number;
  onSelectMonth: (index: number) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ selectedIndex, onSelectMonth }) => {
  return (
    <div className="relative">
      <select
        value={selectedIndex}
        onChange={(e) => onSelectMonth(Number(e.target.value))}
        className="block w-full md:w-48 px-4 py-2 pr-8 text-base leading-6 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-150"
        aria-label="Select a month"
      >
        {MONTHS.map((month, index) => (
          <option key={index} value={index}>
            {month}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
};

export default MonthSelector;
