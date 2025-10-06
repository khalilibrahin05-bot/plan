import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { PlanItem } from '../types';
import { SparklesIcon, LightbulbIcon } from './Icons';

interface AIProgrammingAssistantProps {
    activities: PlanItem[];
}

const AIProgrammingAssistant: React.FC<AIProgrammingAssistantProps> = ({ activities }) => {
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = useCallback(async () => {
        if (activities.length === 0) {
            setError('لا توجد أنشطة غير مبرمجة لتقديم توصيات بشأنها.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult('');

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
            
            const activityList = activities.slice(0, 15).map(a => `- ${a.activity} (المجال: ${a.domain})`).join('\n');

            const prompt = `
                أنت خبير في الإشراف التربوي والتخطيط الأكاديمي. أمامك قائمة بالأنشطة التي لم تتم برمجتها بعد في الخطة السنوية.

                الأنشطة غير المبرمجة:
                ${activityList}

                مهمتك هي اقتراح جدول زمني منطقي لـ 5 من هذه الأنشطة (أو أقل إذا كان العدد أقل). يجب أن تستند توصياتك إلى طبيعة النشاط والتسلسل الزمني المنطقي للعمليات الإشرافية خلال العام الدراسي (١٢ شهراً، من محرم إلى ذو الحجة).

                قدم توصياتك على شكل قائمة، مع ذكر اسم النشاط، والشهر/الأشهر المقترحة، وتبرير مختصر للمقترح.
                استخدم التنسيق التالي:
                ### توصيات الجدولة
                * **النشاط:** اسم النشاط
                  * **الشهر المقترح:** اسم الشهر
                  * **التبرير:** شرح مختصر
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setResult(response.text);

        } catch (err) {
            console.error(err);
            setError("حدث خطأ أثناء توليد التوصيات. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsLoading(false);
        }
    }, [activities]);

    const renderResult = (text: string) => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        return lines.map((line, index) => {
            if (line.trim().startsWith('### ')) {
                return <h4 key={index} className="text-lg font-bold text-gray-800 mt-4 mb-2">{line.replace('### ','')}</h4>
            }
            if (line.trim().startsWith('* **')) {
                 const parts = line.split(':**');
                 return <p key={index} className="mb-1 mt-3"><strong className="font-bold text-gray-900">{parts[0].replace('* **','')}</strong>: {parts[1]}</p>;
            }
            if (line.trim().startsWith('*')) {
                const parts = line.split(':**');
                if (parts.length > 1) {
                    return <p key={index} className="mr-4 mb-1"><strong className="font-semibold text-gray-700">{parts[0].replace('*','')}</strong>: {parts[1]}</p>;
                }
                return <li key={index} className="mr-4">{line.substring(2)}</li>;
            }
            return <p key={index} className="mb-2">{line}</p>;
        });
    };

    return (
        <div className="bg-blue-50 p-4 sm:p-6 rounded-lg shadow-inner border border-blue-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                    <span className="text-blue-500"><LightbulbIcon /></span>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">مساعد البرمجة الذكي</h3>
                        <p className="text-sm text-gray-600">احصل على توصيات مدعومة بالذكاء الاصطناعي لجدولة أنشطتك غير المبرمجة.</p>
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || activities.length === 0}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center space-x-2 space-x-reverse disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    <SparklesIcon />
                    <span>{isLoading ? 'جاري التحليل...' : 'اقتراح جدولة'}</span>
                </button>
            </div>

            {isLoading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">يقوم الذكاء الاصطناعي بإعداد التوصيات...</p>
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {result && !isLoading && (
                <div className="mt-6 prose prose-sm max-w-none bg-white p-4 rounded-md border">
                    {renderResult(result)}
                </div>
            )}
        </div>
    );
};

export default AIProgrammingAssistant;
