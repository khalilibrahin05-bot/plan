import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { PlanItem } from '../types';
import { MONTHS } from '../constants';
import { SparklesIcon } from './Icons';

interface AIAnalystProps {
    data: PlanItem[];
    monthName: string;
}

const AIAnalyst: React.FC<AIAnalystProps> = ({ data, monthName }) => {
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const formatDataForPrompt = (): string => {
        if (data.length === 0) {
            return "لا توجد أنشطة مخطط لها لهذا الشهر.";
        }
        
        const monthIndex = MONTHS.indexOf(monthName);
        if (monthIndex === -1) {
            return "شهر غير صالح."
        }
        
        const summary = data.map(item => {
            const planned = item.schedule[monthIndex] ?? 0;
            const executed = item.weeklyExecution.reduce((sum, val) => sum + (val || 0), 0);
            return `- المجال: ${item.domain}, النشاط: ${item.activity}, المخطط: ${planned}, المنفذ: ${executed}`;
        }).join('\n');

        const totalPlanned = data.reduce((sum, item) => sum + (item.schedule[monthIndex] || 0), 0);
        const totalExecuted = data.reduce((sum, item) => sum + item.weeklyExecution.reduce((s, v) => s + (v || 0), 0), 0);
        
        return `
            ملخص الأداء لشهر ${monthName}:
            إجمالي المخطط: ${totalPlanned}
            إجمالي المنفذ: ${totalExecuted}

            تفاصيل الأنشطة:
            ${summary}
        `;
    };

    const handleAnalyze = async () => {
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
            
            const dataSummary = formatDataForPrompt();
            const prompt = `
                أنت خبير في الإشراف التربوي وتحليل الأداء. قمت بمراجعة تقرير الأداء الشهري التالي لخطة إشراف تربوي.

                البيانات:
                ${dataSummary}

                المطلوب منك تقديم تحليل موجز ومركز باللغة العربية. يجب أن يتضمن التحليل النقاط التالية بوضوح:
                1.  **نقاط القوة:** أبرز الإيجابيات والمجالات التي تم فيها تحقيق الأهداف أو تجاوزها.
                2.  **نقاط للتحسين:** حدد المجالات أو الأنشطة التي يوجد بها ضعف أو تأخر في التنفيذ.
                3.  **توصيات:** قدم توصيات عملية ومحددة لتحسين الأداء في الشهر القادم.

                يرجى تنسيق ردك باستخدام Markdown البسيط كالتالي، مع التأكد من أن كل عنصر في القائمة يبدأ بـ '* ':
                ### نقاط القوة
                * نقطة قوة 1.
                * نقطة قوة 2.

                ### نقاط للتحسين
                * نقطة تحسين 1.
                * نقطة تحسين 2.

                ### توصيات
                * توصية 1.
                * توصية 2.
            `;
            
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
            });

            setAnalysis(response.text);

        } catch (err) {
            console.error(err);
            setError("حدث خطأ أثناء تحليل البيانات. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsLoading(false);
        }
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
                    html += '<ul class="list-disc list-inside space-y-1 text-gray-700">';
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

        if (inList) {
            html += '</ul>';
        }
        
        return { __html: html };
    };

    return (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-inner border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                    <span className="text-yellow-500"><SparklesIcon /></span>
                    <h3 className="text-xl font-bold text-gray-800">محلل الأداء الذكي</h3>
                </div>
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center space-x-2 space-x-reverse disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    <SparklesIcon />
                    <span>{isLoading ? 'جاري التحليل...' : 'تحليل الأداء بالذكاء الاصطناعي'}</span>
                </button>
            </div>

            {isLoading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">يقوم الذكاء الاصطناعي بتحليل بياناتك...</p>
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {analysis && !isLoading && (
                <div className="mt-6 prose prose-sm max-w-none bg-white p-4 rounded-md border" dangerouslySetInnerHTML={renderMarkdown(analysis)} />
            )}
        </div>
    );
};

export default AIAnalyst;
