import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { PlanItem } from '../types';
import { getDomainColor } from '../colors';
import { PrintIcon, SparklesIcon, CloseIcon, SearchIcon, BookOpenIcon, GlobeAltIcon, ChatAltIcon } from './Icons';
import { GoogleGenAI } from '@google/genai';
import { pedagogicalTermsData, Term as PedagogicalTerm, TermDomain as PedagogicalTermDomain } from '../pedagogicalTerms';
import { gccGlossaryData, Term as GccTerm, TermDomain as GccTermDomain } from '../gccGlossaryData';

const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
        return <span>{text}</span>;
    }
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <span>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <mark key={i} className="bg-yellow-200 px-1 rounded">{part}</mark>
                ) : (
                    part
                )
            )}
        </span>
    );
};

// --- Sub-component for Plan Terms Tab (from GlossaryView) ---
const PlanTermsTab: React.FC<{ data: PlanItem[], searchTerm: string }> = ({ data, searchTerm }) => {
  const [selectedTerm, setSelectedTerm] = useState<{ term: string; type: string } | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const analysisRef = useRef<HTMLDivElement>(null);

  const glossaryData = useMemo(() => {
    const sourceData = !searchTerm.trim()
      ? data
      : data.filter(item =>
          item.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.indicator.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.activity.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const domains = new Map<string, { objectives: Set<string>; indicators: Set<string>; activities: Set<string>; }>();
    sourceData.forEach(item => {
      if (!domains.has(item.domain)) {
        domains.set(item.domain, { objectives: new Set(), indicators: new Set(), activities: new Set() });
      }
      const domainEntry = domains.get(item.domain)!;
      domainEntry.objectives.add(item.objective);
      domainEntry.indicators.add(item.indicator);
      domainEntry.activities.add(item.activity);
    });
    return Array.from(domains.entries()).map(([domain, terms]) => ({
      domain,
      objectives: Array.from(terms.objectives),
      indicators: Array.from(terms.indicators),
      activities: Array.from(terms.activities),
    }));
  }, [data, searchTerm]);

  useEffect(() => {
    if (selectedTerm && !isLoading && analysisRef.current) {
      analysisRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedTerm, isLoading]);

  const handleGenerateAnalysis = useCallback(async (term: string, type: string) => {
    setIsLoading(true);
    setError('');
    setAnalysis('');
    if (!process.env.API_KEY) {
      setError("مفتاح الواجهة البرمجية (API Key) غير موجود.");
      setIsLoading(false);
      return;
    }
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `أنت خبير في الإشراف التربوي ومنهجيات التخطيط التعليمي. سأعطيك مصطلحًا وهو '${term}' ونوعه هو '${type}'. أريد منك أن تقدم شرحًا أكاديميًا وعمليًا مفصلاً عنه باللغة العربية. يجب أن يتضمن الشرح ما يلي:\n1. **التعريف والسياق**: شرح أكاديمي للمصطلح ودوره ضمن خطة الإشراف التربوي.\n2. **أفضل الممارسات للتطبيق**: كيف يمكن تطبيق هذا الـ ${type} بفعالية؟ اذكر خطوات عملية كنقاط.\n3. **مقترحات للتطوير**: ما هي المقترحات لتحسين أو تطوير هذا الجانب في المستقبل؟ اذكرها كنقاط.\n\nيرجى تنسيق ردك باستخدام Markdown البسيط والعناوين التالية، مع التأكد من أن كل عنصر في القائمة يبدأ بـ '* ':\n### التعريف والسياق\n\n### أفضل الممارسات للتطبيق\n\n### مقترحات للتطوير`;
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      setAnalysis(response.text);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء توليد التحليل.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleTermClick = (term: string, type: string) => {
    if (selectedTerm?.term === term) return;
    setSelectedTerm({ term, type });
    handleGenerateAnalysis(term, type);
  };

  const handleCloseAnalysis = () => {
    setSelectedTerm(null);
    setAnalysis('');
    setError('');
  };
  
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    let html = '';
    let inList = false;
    for (const line of lines) {
        if (line.startsWith('### ')) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<h3 class="text-lg font-bold text-gray-800 mt-4 mb-2">${line.substring(4)}</h3>`;
        } else if (line.startsWith('* ')) {
            if (!inList) { html += '<ul class="list-disc list-inside space-y-2 text-gray-700">'; inList = true; }
            html += `<li>${line.substring(2)}</li>`;
        } else {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<p class="text-gray-700">${line}</p>`;
        }
    }
    if (inList) html += '</ul>';
    return { __html: html };
  };

  return (
    <div className="space-y-8">
      {glossaryData.length === 0 ? (
        <div className="text-center py-12"><p className="text-lg text-gray-500">لم يتم العثور على مصطلحات تطابق بحثك.</p></div>
      ) : (
        glossaryData.map(({ domain, objectives, indicators, activities }) => {
          const colors = getDomainColor(domain);
          return (
            <section key={domain} className="break-inside-avoid">
              <h3 className={`text-xl font-bold p-3 rounded-t-lg ${colors.bg} ${colors.text} border-b-2 ${colors.border}`}>{highlightText(domain, searchTerm)}</h3>
              <div className="border border-t-0 rounded-b-lg p-4 space-y-4">
                {objectives.length > 0 && <div><h4 className="text-lg font-semibold text-gray-700 mb-2">الأهداف:</h4><ul className="list-disc list-inside space-y-1 text-gray-600">{objectives.map((text, i) => (<li key={`obj-${i}`}><button onClick={() => handleTermClick(text, 'الهدف')} className={`text-right w-full p-1 rounded-md text-gray-700 hover:bg-blue-100 flex items-center justify-between ${selectedTerm?.term === text ? 'bg-blue-100 font-bold' : ''}`}><span>{highlightText(text, searchTerm)}</span><span className="text-yellow-500 opacity-75 mr-2 flex-shrink-0"><SparklesIcon /></span></button></li>))}</ul></div>}
                {indicators.length > 0 && <div><h4 className="text-lg font-semibold text-gray-700 mb-2">المؤشرات:</h4><ul className="list-disc list-inside space-y-1 text-gray-600">{indicators.map((text, i) => (<li key={`ind-${i}`}><button onClick={() => handleTermClick(text, 'المؤشر')} className={`text-right w-full p-1 rounded-md text-gray-700 hover:bg-blue-100 flex items-center justify-between ${selectedTerm?.term === text ? 'bg-blue-100 font-bold' : ''}`}><span>{highlightText(text, searchTerm)}</span><span className="text-yellow-500 opacity-75 mr-2 flex-shrink-0"><SparklesIcon /></span></button></li>))}</ul></div>}
                {activities.length > 0 && <div><h4 className="text-lg font-semibold text-gray-700 mb-2">الأنشطة:</h4><ul className="list-disc list-inside space-y-1 text-gray-600">{activities.map((text, i) => (<li key={`act-${i}`}><button onClick={() => handleTermClick(text, 'النشاط')} className={`text-right w-full p-1 rounded-md text-gray-700 hover:bg-blue-100 flex items-center justify-between ${selectedTerm?.term === text ? 'bg-blue-100 font-bold' : ''}`}><span>{highlightText(text, searchTerm)}</span><span className="text-yellow-500 opacity-75 mr-2 flex-shrink-0"><SparklesIcon /></span></button></li>))}</ul></div>}
              </div>
            </section>
          );
        })
      )}
      {selectedTerm && (
        <section ref={analysisRef} className="mt-10 pt-6 border-t-2 border-gray-200 animate-fade-in">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-inner border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">تحليل المصطلح: <span className="text-blue-600">{selectedTerm.term}</span></h3>
              <button onClick={handleCloseAnalysis} className="p-1 rounded-full hover:bg-gray-200" aria-label="إغلاق التحليل"><CloseIcon /></button>
            </div>
            {isLoading && <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div><p className="mt-2 text-gray-600">يقوم الذكاء الاصطناعي بتوليد الشرح...</p></div>}
            {error && <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>}
            {analysis && !isLoading && <div className="prose prose-sm max-w-none bg-white p-4 rounded-md border" dangerouslySetInnerHTML={renderMarkdown(analysis)} />}
          </div>
        </section>
      )}
    </div>
  );
};

// --- Sub-component for Pedagogical Terms Tab ---
const PedagogicalTermsTab: React.FC<{
  searchTerm: string;
  onTermClick: (term: PedagogicalTerm) => void;
  selectedTermName: string | null;
}> = ({ searchTerm, onTermClick, selectedTermName }) => {
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return pedagogicalTermsData;
    const lowercasedQuery = searchTerm.toLowerCase();
    const result: PedagogicalTermDomain[] = [];
    pedagogicalTermsData.forEach(domain => {
      const matchingTerms = domain.terms.filter(term => term.name.toLowerCase().includes(lowercasedQuery) || term.definition.toLowerCase().includes(lowercasedQuery));
      if (domain.domain.toLowerCase().includes(lowercasedQuery) || matchingTerms.length > 0) {
        result.push({ ...domain, terms: domain.domain.toLowerCase().includes(lowercasedQuery) ? domain.terms : matchingTerms });
      }
    });
    return result;
  }, [searchTerm]);

  return (
    <>
      {filteredData.length === 0 ? (
        <div className="text-center py-12"><p className="text-lg text-gray-500">لم يتم العثور على مصطلحات تطابق بحثك.</p></div>
      ) : (
        <div className="space-y-8">
          {filteredData.map(domain => (
            <section key={domain.domain} className="break-inside-avoid">
              <h3 className="text-xl font-bold text-blue-800 bg-blue-100 p-3 rounded-t-lg border-b-2 border-blue-300">{highlightText(domain.domain, searchTerm)}</h3>
              <div className="border border-t-0 rounded-b-lg p-4">
                <p className="text-gray-600 mb-4 italic">{highlightText(domain.description, searchTerm)}</p>
                 <div className="space-y-4">
                  {domain.terms.map(term => (
                    <div key={term.name} className={`p-3 rounded-md border-r-4 transition-colors ${selectedTermName === term.name ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex justify-between items-center gap-2">
                        <h4 className="font-bold text-gray-800">{highlightText(term.name, searchTerm)}</h4>
                        <button
                          onClick={() => onTermClick(term)}
                          className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${selectedTermName === term.name ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'}`}
                        >
                          <SparklesIcon className="h-4 w-4" />
                          <span>تحليل ذكي</span>
                        </button>
                      </div>
                      <p className="mt-1 text-gray-700">{highlightText(term.definition, searchTerm)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
};

// --- Sub-component for GCC Terms Tab ---
const GccTermsTab: React.FC<{
  searchTerm: string;
  onTermClick: (term: GccTerm) => void;
  selectedTermName: string | null;
}> = ({ searchTerm, onTermClick, selectedTermName }) => {
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return gccGlossaryData;
    const lowercasedQuery = searchTerm.toLowerCase();
    const result: GccTermDomain[] = [];
    gccGlossaryData.forEach(domain => {
      const matchingTerms = domain.terms.filter(term => term.name.toLowerCase().includes(lowercasedQuery) || term.definition.toLowerCase().includes(lowercasedQuery));
      if (domain.domain.toLowerCase().includes(lowercasedQuery) || matchingTerms.length > 0) {
        result.push({ ...domain, terms: domain.domain.toLowerCase().includes(lowercasedQuery) ? domain.terms : matchingTerms });
      }
    });
    return result;
  }, [searchTerm]);

  return (
    <>
      {filteredData.length === 0 ? (
        <div className="text-center py-12"><p className="text-lg text-gray-500">لم يتم العثور على مصطلحات تطابق بحثك.</p></div>
      ) : (
        <div className="space-y-8">
          {filteredData.map(domain => (
            <section key={domain.domain} className="break-inside-avoid">
              <h3 className="text-xl font-bold text-green-800 bg-green-100 p-3 rounded-t-lg border-b-2 border-green-300">{highlightText(domain.domain, searchTerm)}</h3>
              <div className="border border-t-0 rounded-b-lg p-4">
                <p className="text-gray-600 mb-4 italic">{highlightText(domain.description, searchTerm)}</p>
                 <div className="space-y-4">
                  {domain.terms.map(term => (
                     <div key={term.name} className={`p-3 rounded-md border-r-4 transition-colors ${selectedTermName === term.name ? 'bg-green-100 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex justify-between items-center gap-2">
                        <h4 className="font-bold text-gray-800">{highlightText(term.name, searchTerm)}</h4>
                        <button
                          onClick={() => onTermClick(term)}
                          className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${selectedTermName === term.name ? 'bg-green-600 text-white' : 'bg-white text-green-600 hover:bg-green-50 border border-green-200'}`}
                        >
                          <SparklesIcon className="h-4 w-4" />
                          <span>تحليل ذكي</span>
                        </button>
                      </div>
                      <p className="mt-1 text-gray-700">{highlightText(term.definition, searchTerm)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
};

// --- Container for Academic Glossaries ---
const AcademicGlossaryContainer: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
    const [activeSubTab, setActiveSubTab] = useState('pedagogical');
    const [selectedTerm, setSelectedTerm] = useState<{ name: string; definition: string } | null>(null);
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const analysisRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (selectedTerm && !isLoading && analysisRef.current) {
          analysisRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [selectedTerm, isLoading, analysis]);

    const handleGenerateAcademicAnalysis = useCallback(async (term: { name: string; definition: string }) => {
        setIsLoading(true);
        setError('');
        setAnalysis('');

        if (!process.env.API_KEY) {
            setError("مفتاح الواجهة البرمجية (API Key) غير موجود.");
            setIsLoading(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `أنت خبير في أصول التربية والمصطلحات التعليمية، مع التركيز على معايير العالم العربي ودول مجلس التعاون الخليجي. سأقدم لك مصطلحًا أكاديميًا وتعريفه القياسي.\n\nمهمتك هي التوسع في هذا التعريف بالتفصيل باللغة العربية. يجب أن يتضمن شرحك ما يلي:\n1.  **السياق والأهمية**: اشرح أهمية هذا المصطلح في النظم التعليمية الحديثة.\n2.  **أمثلة تطبيقية**: قدم أمثلة ملموسة لكيفية تطبيق هذا المفهوم في بيئة مدرسية أو صفية.\n3.  **الارتباط بمفاهيم أخرى**: كيف يرتبط هذا المصطلح بمفاهيم تعليمية هامة أخرى؟\n\nيرجى تنسيق ردك باستخدام Markdown البسيط مع العناوين التالية:\n### السياق والأهمية\n### أمثلة تطبيقية\n### الارتباط بمفاهيم أخرى\n\nالمصطلح: "${term.name}"\nالتعريف: "${term.definition}"`;

            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setAnalysis(response.text);
        } catch (err) {
            console.error(err);
            setError("حدث خطأ أثناء توليد التحليل.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleTermClick = useCallback((term: { name: string; definition: string }) => {
        if (selectedTerm?.name === term.name) {
            if(analysisRef.current) analysisRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        setSelectedTerm(term);
        handleGenerateAcademicAnalysis(term);
    }, [selectedTerm, handleGenerateAcademicAnalysis]);

    const handleCloseAnalysis = useCallback(() => {
        setSelectedTerm(null);
        setAnalysis('');
        setError('');
    }, []);

    const renderMarkdown = (text: string) => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        let html = '';
        let inList = false;
        for (const line of lines) {
            if (line.startsWith('### ')) {
                if (inList) { html += '</ul>'; inList = false; }
                html += `<h4 class="text-lg font-bold text-gray-800 mt-4 mb-2">${line.substring(4)}</h4>`;
            } else if (line.startsWith('* ')) {
                if (!inList) { html += '<ul class="list-disc list-inside space-y-2 text-gray-700">'; inList = true; }
                html += `<li>${line.substring(2)}</li>`;
            } else {
                if (inList) { html += '</ul>'; inList = false; }
                html += `<p class="text-gray-700">${line}</p>`;
            }
        }
        if (inList) html += '</ul>';
        return { __html: html };
    };

    const subTabs = [
        { id: 'pedagogical', title: 'المصطلحات التربوية', icon: <BookOpenIcon className="h-5 w-5" /> },
        { id: 'gcc', title: 'مصطلحات مكتب التربية الخليجي', icon: <GlobeAltIcon className="h-5 w-5" /> },
    ];

    return (
        <div className="animate-fade-in">
            <div className="no-print flex flex-col md:flex-row gap-4 items-center mb-4">
                <div className="flex border border-gray-200 rounded-lg p-1 space-x-1 space-x-reverse bg-gray-100">
                    {subTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSubTab(tab.id)}
                            className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeSubTab === tab.id ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-white/60 hover:text-gray-800'}`}
                        >
                            {tab.icon}
                            <span>{tab.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-2">
                <div className={activeSubTab === 'pedagogical' ? '' : 'hidden'}>
                    <PedagogicalTermsTab searchTerm={searchTerm} onTermClick={handleTermClick} selectedTermName={selectedTerm?.name || null} />
                </div>
                <div className={activeSubTab === 'gcc' ? '' : 'hidden'}>
                    <GccTermsTab searchTerm={searchTerm} onTermClick={handleTermClick} selectedTermName={selectedTerm?.name || null} />
                </div>
            </div>
            
            {selectedTerm && (
                <section ref={analysisRef} className="mt-10 pt-6 border-t-2 border-gray-200 animate-fade-in">
                    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-inner border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">
                                تحليل المصطلح: <span className="text-blue-600">{selectedTerm.name}</span>
                            </h3>
                            <button onClick={handleCloseAnalysis} className="p-1 rounded-full hover:bg-gray-200" aria-label="إغلاق الشرح">
                                <CloseIcon />
                            </button>
                        </div>
                        
                        {isLoading && <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div><p className="mt-2 text-gray-600">يقوم الذكاء الاصطناعي بتوليد شرح موسع...</p></div>}
                        {error && <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>}
                        
                        {analysis && !isLoading && (
                             <div className="prose prose-sm max-w-none bg-white p-4 rounded-md border" dangerouslySetInnerHTML={renderMarkdown(analysis)} />
                        )}
                    </div>
                </section>
            )}
        </div>
    );
};


// --- Main Unified Component ---
const UnifiedGlossaryView: React.FC<{ data: PlanItem[] }> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('plan');
  const [unifiedSearchTerm, setUnifiedSearchTerm] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const tabs = [
    { id: 'plan', title: 'مصطلحات الخطة', icon: <ChatAltIcon className="h-5 w-5" /> },
    { id: 'academic', title: 'المعجم الأكاديمي', icon: <BookOpenIcon className="h-5 w-5" /> },
  ];

  const getPrintTitle = () => {
    if (activeTab === 'plan') {
        return 'مصطلحات الخطة';
    } else {
        return 'المعجم الأكاديمي';
    }
  }

  return (
    <div id="report-view" className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
      <div className="no-print flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b gap-4">
        <h2 className="text-2xl font-bold text-gray-800">القواميس والمعاجم</h2>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center space-x-2 space-x-reverse"
        >
          <PrintIcon />
          <span>طباعة</span>
        </button>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 print:block hidden">
        {getPrintTitle()}
      </h2>

      {/* Unified Search Bar */}
      <div className="relative w-full sm:w-96 mb-4 no-print">
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><SearchIcon /></div>
          <input
              type="text"
              value={unifiedSearchTerm}
              onChange={(e) => setUnifiedSearchTerm(e.target.value)}
              placeholder="ابحث في جميع القواميس..."
              className="block w-full py-2 pl-3 pr-10 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search all glossaries"
          />
      </div>

      <div className="no-print">
        <div className="flex border-b mb-4 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); }}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              {tab.icon}
              <span>{tab.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2">
        <div className={activeTab === 'plan' ? '' : 'hidden'}><PlanTermsTab data={data} searchTerm={unifiedSearchTerm} /></div>
        <div className={activeTab === 'academic' ? '' : 'hidden'}><AcademicGlossaryContainer searchTerm={unifiedSearchTerm} /></div>
      </div>
    </div>
  );
};

export default UnifiedGlossaryView;