import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { PlanItem } from '../types';
import { getDomainColor } from '../colors';
import { PrintIcon, SparklesIcon, CloseIcon } from './Icons';
import { GoogleGenAI } from '@google/genai';


interface GlossaryViewProps {
  data: PlanItem[];
}

const GlossaryView: React.FC<GlossaryViewProps> = ({ data }) => {
  const [selectedTerm, setSelectedTerm] = useState<{ term: string; type: string } | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const analysisRef = useRef<HTMLDivElement>(null);

  const glossaryData = useMemo(() => {
    const domains = new Map<
      string,
      {
        objectives: Set<string>;
        indicators: Set<string>;
        activities: Set<string>;
      }
    >();

    data.forEach(item => {
      if (!domains.has(item.domain)) {
        domains.set(item.domain, {
          objectives: new Set(),
          indicators: new Set(),
          activities: new Set(),
        });
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
  }, [data]);

  useEffect(() => {
    if (selectedTerm && !isLoading && analysisRef.current) {
        analysisRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedTerm, isLoading]);


  const handlePrint = () => {
    window.print();
  };
  
  const handleGenerateAnalysis = useCallback(async (term: string, type: string) => {
    setIsLoading(true);
    setError('');
    setAnalysis('');

    if (!process.env.API_KEY) {
        setError("مفتاح الواجهة البرمجية (API Key) غير موجود. يرجى التأكد من إعداده.");
        setIsLoading(false);
        return;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
            أنت خبير في الإشراف التربوي ومنهجيات التخطيط التعليمي. سأعطيك مصطلحًا وهو '${term}' ونوعه هو '${type}'. أريد منك أن تقدم شرحًا أكاديميًا وعمليًا مفصلاً عنه باللغة العربية. يجب أن يتضمن الشرح ما يلي:

            1.  **التعريف والسياق**: شرح أكاديمي للمصطلح ودوره ضمن خطة الإشراف التربوي.
            2.  **أفضل الممارسات للتطبيق**: كيف يمكن تطبيق هذا الـ ${type} بفعالية؟ اذكر خطوات عملية كنقاط.
            3.  **مقترحات للتطوير**: ما هي المقترحات لتحسين أو تطوير هذا الجانب في المستقبل؟ اذكرها كنقاط.

            يرجى تنسيق ردك باستخدام Markdown البسيط والعناوين التالية، مع التأكد من أن كل عنصر في القائمة يبدأ بـ '* ':
            ### التعريف والسياق

            ### أفضل الممارسات للتطبيق

            ### مقترحات للتطوير
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        setAnalysis(response.text);

    } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء توليد التحليل. يرجى المحاولة مرة أخرى.");
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleTermClick = (term: string, type: string) => {
    // If the same term is clicked again, do nothing to avoid re-fetching
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
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            html += `<h3 class="text-lg font-bold text-gray-800 mt-4 mb-2">${line.substring(4)}</h3>`;
        } else if (line.startsWith('* ')) {
            if (!inList) {
                html += '<ul class="list-disc list-inside space-y-2 text-gray-700">';
                inList = true;
            }
            html += `<li>${line.substring(2)}</li>`;
        } else {
             if (inList) {
                html += '</ul>';
                inList = false;
            }
            html += `<p class="text-gray-700">${line}</p>`;
        }
    }
    if (inList) html += '</ul>';
    return { __html: html };
  };


  return (
    <div id="report-view" className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
      <div className="no-print flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">
          شرح مصطلحات الخطة (من واقع الجدول)
        </h2>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center space-x-2 space-x-reverse"
        >
          <PrintIcon />
          <span>طباعة</span>
        </button>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 print:block hidden">
        شرح مصطلحات الخطة
      </h2>

      <div className="space-y-8">
        {glossaryData.map(({ domain, objectives, indicators, activities }) => {
          const colors = getDomainColor(domain);
          return (
            <section key={domain} className="break-inside-avoid">
              <h3
                className={`text-xl font-bold p-3 rounded-t-lg ${colors.bg} ${colors.text} border-b-2 ${colors.border}`}
              >
                {domain}
              </h3>
              <div className="border border-t-0 rounded-b-lg p-4 space-y-4">
                
                {objectives.length > 0 && (
                    <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">الأهداف:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {objectives.map((text, i) => (
                                <li key={`obj-${i}`}>
                                    <button onClick={() => handleTermClick(text, 'الهدف')} className={`text-right w-full p-1 rounded-md text-gray-700 hover:bg-blue-100 flex items-center justify-between ${selectedTerm?.term === text ? 'bg-blue-100 font-bold' : ''}`}>
                                        <span>{text}</span>
                                        <span className="text-yellow-500 opacity-75 mr-2 flex-shrink-0"><SparklesIcon /></span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {indicators.length > 0 && (
                    <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">المؤشرات:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                           {indicators.map((text, i) => (
                                <li key={`ind-${i}`}>
                                    <button onClick={() => handleTermClick(text, 'المؤشر')} className={`text-right w-full p-1 rounded-md text-gray-700 hover:bg-blue-100 flex items-center justify-between ${selectedTerm?.term === text ? 'bg-blue-100 font-bold' : ''}`}>
                                        <span>{text}</span>
                                        <span className="text-yellow-500 opacity-75 mr-2 flex-shrink-0"><SparklesIcon /></span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {activities.length > 0 && (
                     <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">الأنشطة:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {activities.map((text, i) => (
                                <li key={`act-${i}`}>
                                    <button onClick={() => handleTermClick(text, 'النشاط')} className={`text-right w-full p-1 rounded-md text-gray-700 hover:bg-blue-100 flex items-center justify-between ${selectedTerm?.term === text ? 'bg-blue-100 font-bold' : ''}`}>
                                        <span>{text}</span>
                                        <span className="text-yellow-500 opacity-75 mr-2 flex-shrink-0"><SparklesIcon /></span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

              </div>
            </section>
          );
        })}
      </div>

       {selectedTerm && (
            <section ref={analysisRef} className="mt-10 pt-6 border-t-2 border-gray-200 animate-fade-in">
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-inner border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">
                            تحليل المصطلح: <span className="text-blue-600">{selectedTerm.term}</span>
                        </h3>
                        <button onClick={handleCloseAnalysis} className="p-1 rounded-full hover:bg-gray-200" aria-label="إغلاق التحليل">
                            <CloseIcon />
                        </button>
                    </div>

                    {isLoading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">يقوم الذكاء الاصطناعي بتوليد الشرح...</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    {analysis && !isLoading && (
                        <div className="prose prose-sm max-w-none bg-white p-4 rounded-md border" dangerouslySetInnerHTML={renderMarkdown(analysis)} />
                    )}
                </div>
            </section>
        )}

    </div>
  );
};

export default GlossaryView;