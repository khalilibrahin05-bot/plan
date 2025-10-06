import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { toolsData, PlanTool } from '../toolsData';
import { PrintIcon, ClipboardListIcon, EyeIcon, ChartBarIcon, SparklesIcon, CloseIcon } from './Icons';

const CategoryDetails = {
  planning: {
    title: 'أدوات التخطيط',
    icon: <ClipboardListIcon />,
    color: 'border-blue-500',
    bg: 'bg-blue-50',
  },
  'follow-up': {
    title: 'أدوات المتابعة والتنفيذ',
    icon: <EyeIcon />,
    color: 'border-green-500',
    bg: 'bg-green-50',
  },
  evaluation: {
    title: 'أدوات التقويم والقياس',
    icon: <ChartBarIcon />,
    color: 'border-yellow-500',
    bg: 'bg-yellow-50',
  },
};

const ToolsView: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<PlanTool | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const analysisRef = useRef<HTMLDivElement>(null);

  const toolsByCategory = toolsData.reduce((acc, tool) => {
    (acc[tool.category] = acc[tool.category] || []).push(tool);
    return acc;
  }, {} as Record<string, PlanTool[]>);

  useEffect(() => {
    if (selectedTool && !isLoading && analysisRef.current) {
        analysisRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedTool, isLoading]);

  const handleGenerateAnalysis = useCallback(async (tool: PlanTool) => {
    setIsLoading(true);
    setError('');
    setAnalysis('');

    if (!navigator.onLine) {
        setError("هذه الميزة تتطلب اتصالاً بالإنترنت.");
        setIsLoading(false);
        return;
    }

    if (!process.env.API_KEY) {
        setError("مفتاح الواجهة البرمجية (API Key) غير موجود. يرجى التأكد من إعداده.");
        setIsLoading(false);
        return;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
            بصفتك خبيرًا في الإشراف التربوي، قدم دليلاً مفصلاً باللغة العربية حول الأداة التالية: '${tool.name}'.
            وصف الأداة هو: '${tool.description}'.

            يجب أن يتضمن الدليل ما يلي:
            1.  **تعريف مفصل**: اشرح الغرض من الأداة وأهميتها في العملية الإشرافية.
            2.  **المكونات الرئيسية**: ما هي الأقسام والعناصر الأساسية التي يجب أن تتضمنها هذه الأداة؟
            3.  **أفضل ممارسات الاستخدام**: كيف يمكن للمشرف التربوي استخدام هذه الأداة بفعالية لتحقيق أقصى استفادة؟
            4.  **نموذج مبسط**: قدم مثالاً أو نموذجًا بسيطًا ومنظمًا للأداة.

            يرجى تنسيق ردك باستخدام Markdown البسيط والعناوين التالية، مع التأكد من أن كل عنصر في القائمة يبدأ بـ '* ':
            ### تعريف الأداة وأهميتها
            ### المكونات الرئيسية
            ### أفضل ممارسات الاستخدام
            ### نموذج مبسط
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        setAnalysis(response.text);

    } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء توليد الشرح. يرجى المحاولة مرة أخرى.");
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleToolClick = (tool: PlanTool) => {
    if (selectedTool?.name === tool.name) {
      // If clicking the same tool, scroll to analysis if it exists
      if(analysisRef.current) analysisRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setSelectedTool(tool);
    handleGenerateAnalysis(tool);
  };

  const handleCloseAnalysis = () => {
    setSelectedTool(null);
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
            html += `<h4 class="text-lg font-bold text-gray-800 mt-4 mb-2">${line.substring(4)}</h4>`;
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
            html += `<p class="text-gray-700 mb-2">${line}</p>`;
        }
    }
    if (inList) html += '</ul>';
    return { __html: html };
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="report-view" className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
      <div className="no-print flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">أهم الأدوات اللازمة لتنفيذ الخطة</h2>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center space-x-2 space-x-reverse"
        >
          <PrintIcon />
          <span>طباعة</span>
        </button>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 print:block hidden">
        أهم الأدوات اللازمة لتنفيذ الخطة
      </h2>

      <div className="space-y-10">
        {Object.keys(toolsByCategory).map(categoryKey => {
          const category = CategoryDetails[categoryKey as keyof typeof CategoryDetails];
          const tools = toolsByCategory[categoryKey];
          return (
            <section key={categoryKey} className="break-inside-avoid">
              <div className={`flex items-center space-x-3 space-x-reverse mb-4 pb-2 border-b-2 ${category.color}`}>
                <span className={`text-gray-600`}>{category.icon}</span>
                <h3 className="text-xl font-bold text-gray-700">{category.title}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map(tool => (
                  <div key={tool.name} className={`flex flex-col justify-between rounded-lg shadow-sm border ${category.color} ${category.bg} hover:shadow-md transition-shadow`}>
                    <div className="p-4">
                        <h4 className="font-bold text-gray-800 mb-2">{tool.name}</h4>
                        <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                    <button
                      onClick={() => handleToolClick(tool)}
                      className={`w-full mt-2 text-sm font-semibold p-2 flex items-center justify-center gap-2 border-t ${category.color} rounded-b-lg transition-colors ${selectedTool?.name === tool.name ? (isLoading ? 'bg-yellow-500 text-white cursor-wait' : 'bg-blue-600 text-white') : 'text-blue-700 hover:bg-blue-100'}`}
                      disabled={isLoading && selectedTool?.name !== tool.name}
                    >
                      <SparklesIcon />
                      <span>
                        {selectedTool?.name === tool.name ? (isLoading ? 'جاري التحليل...' : 'عرض التحليل') : 'تحليل الأداة'}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

       {selectedTool && (
            <section ref={analysisRef} className="mt-10 pt-6 border-t-2 border-gray-200 animate-fade-in no-print">
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-inner border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">
                            تحليل الأداة: <span className="text-blue-600">{selectedTool.name}</span>
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

export default ToolsView;
