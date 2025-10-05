import React, { useState, useMemo } from 'react';
import { gccGlossaryData, TermDomain } from '../gccGlossaryData';
import { PrintIcon, SearchIcon, GlobeAltIcon } from './Icons';

const GccGlossaryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return gccGlossaryData;
    }
    const lowercasedQuery = searchTerm.toLowerCase();
    const result: TermDomain[] = [];

    gccGlossaryData.forEach(domain => {
      const matchingTerms = domain.terms.filter(term => 
        term.name.toLowerCase().includes(lowercasedQuery) || 
        term.definition.toLowerCase().includes(lowercasedQuery)
      );

      if (domain.domain.toLowerCase().includes(lowercasedQuery) || matchingTerms.length > 0) {
        result.push({
          ...domain,
          terms: domain.domain.toLowerCase().includes(lowercasedQuery) ? domain.terms : matchingTerms,
        });
      }
    });

    return result;
  }, [searchTerm]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="report-view" className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
      <div className="no-print flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b gap-4">
        <div className="flex items-center gap-3">
            <GlobeAltIcon />
            <h2 className="text-2xl font-bold text-gray-800">
              قاموس مكتب التربية العربي لدول الخليج
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
                    placeholder="ابحث عن مصطلح..."
                    className="block w-full py-2 pl-3 pr-10 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Search terms"
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
        قاموس مصطلحات مكتب التربية العربي لدول الخليج
      </h2>

      {filteredData.length === 0 ? (
         <div className="text-center py-12">
          <p className="text-lg text-gray-500">لم يتم العثور على مصطلحات تطابق بحثك.</p>
        </div>
      ) : (
        <div className="space-y-8">
            {filteredData.map(domain => (
            <section key={domain.domain} className="break-inside-avoid">
                <h3 className="text-xl font-bold text-green-800 bg-green-100 p-3 rounded-t-lg border-b-2 border-green-300">
                {domain.domain}
                </h3>
                <div className="border border-t-0 rounded-b-lg p-4">
                <p className="text-gray-600 mb-4 italic">{domain.description}</p>
                <dl className="space-y-4">
                    {domain.terms.map(term => (
                    <div key={term.name} className="p-3 bg-gray-50 rounded-md border-r-4 border-gray-200">
                        <dt className="font-bold text-gray-800">{term.name}</dt>
                        <dd className="mt-1 text-gray-700">{term.definition}</dd>
                    </div>
                    ))}
                </dl>
                </div>
            </section>
            ))}
        </div>
      )}
    </div>
  );
};

export default GccGlossaryView;
