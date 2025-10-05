import React from 'react';

interface FontOption {
    name: string;
    value: string;
}

interface FontControlsProps {
  onFontSizeChange: (direction: 'increase' | 'decrease') => void;
  onFontFamilyChange: (font: string) => void;
  currentFont: string;
  fontFamilies: FontOption[];
}

const FontControls: React.FC<FontControlsProps> = ({ onFontSizeChange, onFontFamilyChange, currentFont, fontFamilies }) => {
  return (
    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
      <div className="flex items-center border-l border-gray-300 pl-2">
         <span className="text-xs font-semibold text-gray-600 ml-2">حجم الخط</span>
        <button
          onClick={() => onFontSizeChange('decrease')}
          className="px-3 py-1 bg-white border border-gray-300 rounded-r-md hover:bg-gray-200"
          aria-label="Decrease font size"
        >
          -
        </button>
        <button
          onClick={() => onFontSizeChange('increase')}
          className="px-3 py-1 bg-white border-t border-b border-r border-gray-300 rounded-l-md hover:bg-gray-200"
          aria-label="Increase font size"
        >
          +
        </button>
      </div>

      <div className="flex items-center">
        <label htmlFor="font-family-select" className="text-xs font-semibold text-gray-600 ml-2">نوع الخط</label>
        <select
          id="font-family-select"
          value={currentFont}
          onChange={(e) => onFontFamilyChange(e.target.value)}
          className="block w-full md:w-32 px-2 py-1 text-xs leading-5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {fontFamilies.map((font) => (
            <option key={font.value} value={font.value}>
              {font.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FontControls;
