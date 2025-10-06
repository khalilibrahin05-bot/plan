import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon, DocumentReportIcon } from './Icons';

const AIToolsView: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = useCallback(async () => {
        if (!inputText.trim()) {
            setError('الرجاء إدخال النص المطلوب لتحليله.');
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
            const prompt = `
                بصفتك خبيرًا في الإشراف التربوي وتحليل البيانات النوعية، مهمتك هي قراءة النص التالي واستخلاص الأفكار الرئيسية وتنظيمها.
                
                قم بتحليل النص التالي واستخرج منه ما يلي:
                1.  أبرز نقاط القوة.
                2.  أبرز المشكلات أو التحديات.
                3.  أهم التوصيات والمقترحات.
                
                بعد ذلك، قدم ملخصًا تنفيذيًا موجزًا للنقاط الرئيسية.

                يرجى تنسيق ردك باستخدام Markdown البسيط والعناوين التالية:
                ### أبرز نقاط القوة
                ### أبرز المشكلات والتحديات
                ### أهم التوصيات والمقترحات
                ### ملخص تنفيذي

                النص هو: "${inputText}"
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setResult(response.text);
        } catch (err) {
            console.error(err);
            setError("حدث خطأ أثناء التواصل مع الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsLoading(false);
        }
    }, [inputText]);

    const renderResult = (text: string) => {
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
            } else if (line.startsWith('* ') || line.startsWith('- ')) {
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
        <div id="ai-tools-view">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">محلل التقارير الإشرافية</h2>
                <p className="text-gray-600 mt-2">استخدم الذكاء الاصطناعي لتلخيص وتحليل تقاريرك وملاحظاتك.</p>
            </div>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center space-x-3 space-x-reverse mb-4">
                        <span className="text-blue-500"><DocumentReportIcon /></span>
                        <h3 className="text-xl font-bold text-gray-800">تحليل وتلخيص النصوص الإشرافية</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                        أدخل نص التقرير، الملاحظات، أو مجموعة من التوصيات والمقترحات ونقاط القوة والمشكلات لتحليلها وتلخيصها في نقاط منظمة.
                    </p>
                    
                    <div className="space-y-4">
                        <label htmlFor="input-text-analysis" className="block text-sm font-medium text-gray-700">النص المراد تحليله:</label>
                        <textarea
                            id="input-text-analysis"
                            rows={8}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="اكتب أو الصق النص هنا..."
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <SparklesIcon />
                            )}
                            <span>{isLoading ? 'جاري التحليل...' : 'تحليل وتلخيص'}</span>
                        </button>
                    </div>
                    
                    {error && <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
                    
                    {result && (
                        <div className="mt-6 p-4 bg-gray-50 border rounded-md">
                            <h4 className="font-bold text-gray-700 mb-2">النتيجة:</h4>
                            <div className="text-gray-700 space-y-2 prose prose-sm max-w-none" dangerouslySetInnerHTML={renderResult(result)} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIToolsView;
