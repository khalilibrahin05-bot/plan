import React from 'react';
import { SearchIcon } from './Icons';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, onQueryChange }) => {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <SearchIcon />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="ابحث في الأنشطة، الأهداف، المؤشرات..."
        className="block w-full py-2 pl-3 pr-10 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 dark:placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition ease-in-out duration-150"
        aria-label="Search activities"
      />
    </div>
  );
};

export default SearchBar;