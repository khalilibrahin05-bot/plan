import React, { useState, useMemo } from 'react';
import { frameworkData, FrameworkDomain } from '../frameworkData';
import { PrintIcon, SearchIcon, LibraryIcon } from './Icons';

const FrameworkView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDomains, setExpandedDomains] = useState<string[]>([]);

  const toggleDomain = (domainId: string) => {
    setExpandedDomains(prev =>
      prev.includes(domainId)
        ? prev.filter(id => id !== domainId)
        : [...prev, domainId]
    );
  };

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return frameworkData;
    }
    const lowercasedQuery = searchTerm.toLowerCase();
    const result: FrameworkDomain[] = [];

    frameworkData.forEach(domain => {
      const matchingStandards = domain.standards.map(standard => {
        const matchingIndicators = standard.indicators.filter(indicator =>
          indicator.text.toLowerCase().includes(lowercasedQuery)
        );
        if (standard.text.toLowerCase().includes(lowercasedQuery) || matchingIndicators.length > 0) {
          return { ...standard, indicators: matchingIndicators.length > 0 ? matchingIndicators : standard.indicators };
        }
        return null;
      }).filter(Boolean);

      if (domain.title.toLowerCase().includes(lowercasedQuery) || matchingStandards.length > 0) {
        result.push({
          ...domain,
          standards: matchingStandards as any, // We've filtered out nulls
        });
      }
    });

    return result;
  }, [searchTerm]);
  
  // Auto-expand domains if a search term is active
  React.useEffect(() => {
      if (searchTerm.trim()) {
          setExpandedDomains(filteredData.map(d => d.id));
      } else {
          setExpandedDomains([]);
      }
  }, [searchTerm, filteredData]);


  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200">{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  const handlePrint = () => {
    // Expand all before printing for full content
    setExpandedDomains(frameworkData.map(d => d.id));
    setTimeout(() => {
        window.print();
    }, 100);
  };

  return (
    <div id="report-view" className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
      <div className="no-print flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b gap-4">
        <div className="flex items-center gap-3">
          <LibraryIcon />
          <h2 className="text-2xl font-bold text-gray-800">
            الإطار المرجعي للإشراف التربوي
          </h2>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث في الإطار المرجعي..."
              className="block w-full py-2 pl-3 pr-10 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search framework"
            />
          </div>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center space-x-2 space-x-reverse"
          >
            <PrintIcon />
            <span>طباعة</span>
          </button>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 print:block hidden">
        الإطار المرجعي للإشراف التربوي - اليمن
      </h2>

      {filteredData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">لم يتم العثور على نتائج تطابق بحثك.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredData.map(domain => (
            <div key={domain.id} className="border rounded-lg break-inside-avoid">
              <button
                onClick={() => toggleDomain(domain.id)}
                className="w-full flex justify-between items-center text-right p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none"
              >
                <h3 className="text-lg font-bold text-blue-800">{highlightText(domain.title, searchTerm)}</h3>
                 <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
                    expandedDomains.includes(domain.id) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedDomains.includes(domain.id) && (
                <div className="p-4 space-y-4">
                  {domain.standards.map(standard => (
                    <div key={standard.id} className="p-3 bg-gray-50 rounded-md border-r-4 border-blue-200">
                      <h4 className="font-semibold text-gray-800">{highlightText(standard.text, searchTerm)}</h4>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-gray-700">
                        {standard.indicators.map(indicator => (
                          <li key={indicator.id}>{highlightText(indicator.text, searchTerm)}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FrameworkView;