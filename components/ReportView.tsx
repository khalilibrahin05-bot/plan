import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PlanItem, ReportInfoData, ExtraActivity, ProblemSolution, StrengthImpact, Recommendation } from '../types';
import { MONTHS } from '../constants';
import { getDomainColor } from '../colors';
import GroupedBarChart from './GroupedBarChart';
import WeeklyTracker from './WeeklyTracker';
import AIAnalyst from './AIAnalyst';
import { ExcelIcon, PlusIcon, TrashIcon } from './Icons';

// Declare XLSX to avoid TypeScript errors for the global variable from CDN
declare const XLSX: any;

interface ReportItemCardProps {
  item: PlanItem;
  selectedMonthIndex: number;
  monthName: string;
  printingItemId: number | null;
  onWeeklyExecutionChange: (itemId: number, newWeeklyValues: (number | null)[]) => void;
  onPrintSingleItem: (itemId: number) => void;
}

const ReportItemCard = React.memo<ReportItemCardProps>(({
  item,
  selectedMonthIndex,
  monthName,
  printingItemId,
  onWeeklyExecutionChange,
  onPrintSingleItem
}) => {
  return (
    <div className={`printable-item border-b last:border-b-0 pb-4 ${printingItemId === item.id ? 'is-printing' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-lg text-blue-800">{item.activity}</p>
        <p className="text-sm text-gray-600 flex-shrink-0 ml-4">
            المخطط: <span className="font-bold text-xl text-green-700">{item.schedule[selectedMonthIndex]}</span>
        </p>
      </div>
      
      <WeeklyTracker 
          item={item}
          monthIndex={selectedMonthIndex}
          monthName={monthName}
          onExecutionChange={(newValues) => onWeeklyExecutionChange(item.id, newValues)}
          onPrint={() => onPrintSingleItem(item.id)}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 mt-3 px-2">
        <p><span className="font-semibold text-gray-800">الهدف:</span> {item.objective}</p>
        <p><span className="font-semibold text-gray-800">المؤشر:</span> {item.indicator}</p>
        <p><span className="font-semibold text-gray-800">عدد المؤشرات:</span> {item.indicatorCount ?? 'غير محدد'}</p>
        <p><span className="font-semibold text-gray-800">الشواهد:</span> {item.evidence}</p>
      </div>
    </div>
  );
});

interface ReportViewProps {
  data: PlanItem[];
  selectedMonthIndex: number;
  onWeeklyExecutionChange: (itemId: number, newWeeklyValues: (number | null)[]) => void;
}

const ReportView: React.FC<ReportViewProps> = ({ data, selectedMonthIndex, onWeeklyExecutionChange }) => {
  const [printingItemId, setPrintingItemId] = useState<number | null>(null);
  const monthName = MONTHS[selectedMonthIndex];
  const reportContainerRef = useRef<HTMLDivElement>(null);

  const REPORT_INFO_KEY_PREFIX = 'educationalPlanReportInfo';
  const getReportInfoStorageKey = (monthIndex: number) => `${REPORT_INFO_KEY_PREFIX}_${monthIndex}`;

  const [reportInfo, setReportInfo] = useState<ReportInfoData>({
      extraActivities: [],
      problems: [],
      strengths: [],
      recommendations: [],
  });

  // Load data from localStorage when month changes
  useEffect(() => {
      try {
          const key = getReportInfoStorageKey(selectedMonthIndex);
          const savedData = localStorage.getItem(key);
          if (savedData) {
              const parsedData = JSON.parse(savedData);
              if (parsedData.extraActivities && parsedData.problems && parsedData.strengths && parsedData.recommendations) {
                   setReportInfo(parsedData);
              } else {
                  throw new Error("Invalid data structure");
              }
          } else {
              setReportInfo({ extraActivities: [], problems: [], strengths: [], recommendations: [] });
          }
      } catch (error) {
          console.error("Failed to load report info data from localStorage", error);
          setReportInfo({ extraActivities: [], problems: [], strengths: [], recommendations: [] });
      }
  }, [selectedMonthIndex]);

  // Save data to localStorage when it changes
  useEffect(() => {
      try {
          const key = getReportInfoStorageKey(selectedMonthIndex);
          localStorage.setItem(key, JSON.stringify(reportInfo));
      } catch (error) {
          console.error("Failed to save report info data to localStorage", error);
      }
  }, [reportInfo, selectedMonthIndex]);

  // Auto-resize textareas when data loads
  useEffect(() => {
    if (reportContainerRef.current) {
        const textareas = reportContainerRef.current.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            if (textarea.value) {
                textarea.style.height = 'auto'; // Reset height to shrink if needed
                textarea.style.height = `${textarea.scrollHeight}px`;
            }
        });
    }
  }, [reportInfo]);


  const handleInfoChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>,
      tableName: keyof ReportInfoData,
      index: number,
      field: string
  ) => {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
      const value = e.target.value;

      setReportInfo(prev => {
          const newTable = [...prev[tableName] as any[]];
          newTable[index] = { ...newTable[index], [field]: value };
          return { ...prev, [tableName]: newTable };
      });
  };

  const handleAddRow = (tableName: keyof ReportInfoData) => {
      let newRow: any;
      const id = crypto.randomUUID();
      switch (tableName) {
          case 'extraActivities': newRow = { id, domain: '', justification: '', assignedBy: '' }; break;
          case 'problems': newRow = { id, problem: '', solution: '' }; break;
          case 'strengths': newRow = { id, strength: '', currentImpact: '', futureImpact: '' }; break;
          case 'recommendations': newRow = { id, recommendation: '', justification: '' }; break;
      }
      setReportInfo(prev => ({ ...prev, [tableName]: [...prev[tableName] as any[], newRow] }));
  };

  const handleDeleteRow = (tableName: keyof ReportInfoData, id: string) => {
      setReportInfo(prev => ({
          ...prev,
          [tableName]: (prev[tableName] as any[]).filter(row => row.id !== id)
      }));
  };
  
  const filteredData = data.filter(item => {
    const scheduleValue = item.schedule[selectedMonthIndex];
    return typeof scheduleValue === 'number' && scheduleValue > 0;
  });

  const groupedData = filteredData.reduce((acc, item) => {
    (acc[item.domain] = acc[item.domain] || []).push(item);
    return acc;
  }, {} as Record<string, PlanItem[]>);

  const totalActivities = filteredData.length;
  const totalPlannedTasks = filteredData.reduce((acc, item) => acc + (item.schedule[selectedMonthIndex] || 0), 0);
  const totalExecutedTasks = filteredData.reduce((acc, item) => acc + (item.executed || 0), 0);
  
  const chartData = Object.keys(groupedData).map(domain => {
    const domainItems = groupedData[domain];
    const planned = domainItems.reduce((acc, item) => acc + (item.schedule[selectedMonthIndex] || 0), 0);
    const executed = domainItems.reduce((acc, item) => acc + (item.executed || 0), 0);
    return { label: domain, value1: planned, value2: executed };
  });

  const handlePrintFullReport = () => {
    if (printingItemId) setPrintingItemId(null);
    window.print();
  };

  const handlePrintSingleItem = useCallback((itemId: number) => {
    setPrintingItemId(itemId);
    setTimeout(() => {
        window.print();
        setPrintingItemId(null);
    }, 100);
  }, []);

  const handleExportExcel = () => {
    if (typeof XLSX === 'undefined') {
      console.error('XLSX library is not loaded.');
      alert('لا يمكن تصدير الملف. يرجى المحاولة مرة أخرى.');
      return;
    }

    const dataToExport = filteredData.map(item => ({
      'المجال': item.domain,
      'الهدف': item.objective,
      'المؤشر': item.indicator,
      'الشواهد': item.evidence,
      'النشاط': item.activity,
      'المخطط للشهر': item.schedule[selectedMonthIndex] ?? 0,
      'المنفذ الأسبوع ١': item.weeklyExecution[0] ?? 0,
      'المنفذ الأسبوع ٢': item.weeklyExecution[1] ?? 0,
      'المنفذ الأسبوع ٣': item.weeklyExecution[2] ?? 0,
      'المنفذ الأسبوع ٤': item.weeklyExecution[3] ?? 0,
      'إجمالي المنفذ': item.weeklyExecution.reduce((acc, val) => acc + (val || 0), 0)
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "تقرير الأنشطة");

    const columnWidths = [
      { wch: 30 }, { wch: 40 }, { wch: 40 }, { wch: 30 }, { wch: 40 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
    ];
    worksheet['!cols'] = columnWidths;

    XLSX.writeFile(workbook, `تقرير-شهر-${monthName}.xlsx`);
  };
  
  const reportViewClasses = [
    "bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg",
    printingItemId ? 'printing-active' : ''
  ].join(' ');


  return (
    <div id="report-view" className={reportViewClasses} ref={reportContainerRef}>
      <div className="no-print flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">
          تقرير الأنشطة لشهر: <span className="text-blue-600">{monthName}</span>
        </h2>
        <div className="flex items-center gap-2">
            <button
            onClick={handlePrintFullReport}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center space-x-2 space-x-reverse"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            <span>طباعة التقرير</span>
            </button>
            <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center space-x-2 space-x-reverse"
            >
            <ExcelIcon />
            <span>تصدير Excel</span>
            </button>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 print:block hidden no-print-when-item-printing">
          تقرير الأنشطة لشهر: {monthName}
      </h2>

       {totalActivities > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 break-inside-avoid no-print-when-item-printing">
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                 <h4 className="font-bold text-gray-700 mb-3 text-center">ملخص الأداء الشهري</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center bg-white p-2 rounded-md">
                    <span className="text-gray-600">عدد الأنشطة المخططة:</span>
                    <span className="font-bold text-xl text-blue-600">{totalActivities}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded-md">
                    <span className="text-gray-600">إجمالي المهام المخططة:</span>
                    <span className="font-bold text-xl text-green-600">{totalPlannedTasks}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded-md">
                    <span className="text-gray-600">إجمالي المهام المنفذة:</span>
                    <span className="font-bold text-xl text-orange-600">{totalExecutedTasks}</span>
                    </div>
                </div>
            </div>
            <div className="break-inside-avoid">
                <GroupedBarChart data={chartData} title="مقارنة المخطط بالمنفذ حسب المجال" />
            </div>
        </div>
       )}

       {totalActivities > 0 && (
          <div className="my-8 break-inside-avoid no-print-when-item-printing">
              <AIAnalyst data={filteredData} monthName={monthName} />
          </div>
        )}

      {totalActivities === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">لا توجد أنشطة مخططة لهذا الشهر.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedData).map(domain => {
            const colors = getDomainColor(domain);
            return (
              <section key={domain} className="break-inside-avoid">
                <h3 className={`text-xl font-bold p-3 rounded-t-lg ${colors.bg} ${colors.text} border-b-2 ${colors.border} no-print-when-item-printing`}>
                  {domain}
                </h3>
                <div className="space-y-6 border border-t-0 rounded-b-lg p-4">
                  {groupedData[domain].map(item => (
                     <ReportItemCard
                        key={item.id}
                        item={item}
                        selectedMonthIndex={selectedMonthIndex}
                        monthName={monthName}
                        printingItemId={printingItemId}
                        onWeeklyExecutionChange={onWeeklyExecutionChange}
                        onPrintSingleItem={handlePrintSingleItem}
                     />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Report Information Section */}
      <div className="mt-10 pt-6 border-t-2 border-dashed no-print-when-item-printing break-before-page">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            معلومات التقرير
        </h2>

        {/* Extra Activities Table */}
        <section className="mt-8 break-inside-avoid">
            <h3 className="text-xl font-bold p-3 rounded-t-lg bg-gray-200 text-gray-800 border-b-2 border-gray-300 flex justify-between items-center">
                <span>أنشطة خارج الخطة</span>
                <button onClick={() => handleAddRow('extraActivities')} className="p-1 bg-white rounded-full hover:bg-gray-100" title="إضافة صف جديد">
                    <PlusIcon />
                </button>
            </h3>
            <div className="overflow-x-auto border border-t-0 rounded-b-lg">
                <table className="w-full text-sm text-right text-gray-600 min-w-[600px]">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                    <th className="px-4 py-2 w-1/4">المجال</th>
                    <th className="px-4 py-2 w-2/4">مبررات تنفيذ النشاط</th>
                    <th className="px-4 py-2 w-1/4">جهة التكليف</th>
                    <th className="px-4 py-2 w-12"></th>
                    </tr>
                </thead>
                <tbody>
                    {reportInfo.extraActivities.map((row, index) => (
                    <tr key={row.id} className="border-b hover:bg-gray-50">
                        <td className="p-1"><textarea value={row.domain} onChange={e => handleInfoChange(e, 'extraActivities', index, 'domain')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td>
                        <td className="p-1"><textarea value={row.justification} onChange={e => handleInfoChange(e, 'extraActivities', index, 'justification')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td>
                        <td className="p-1"><textarea value={row.assignedBy} onChange={e => handleInfoChange(e, 'extraActivities', index, 'assignedBy')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td>
                        <td className="p-1 text-center"><button onClick={() => handleDeleteRow('extraActivities', row.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50" title="حذف الصف"><TrashIcon /></button></td>
                    </tr>
                    ))}
                </tbody>
                </table>
                {reportInfo.extraActivities.length === 0 && <p className="text-center text-gray-500 p-4">لا توجد بيانات. انقر على '+' لإضافة صف جديد.</p>}
            </div>
        </section>

        {/* Problems and Solutions Table */}
        <section className="mt-8 break-inside-avoid">
            <h3 className="text-xl font-bold p-3 rounded-t-lg bg-gray-200 text-gray-800 border-b-2 border-gray-300 flex justify-between items-center">
                <span>أبرز المشكلات وآليات التغلب عليها</span>
                <button onClick={() => handleAddRow('problems')} className="p-1 bg-white rounded-full hover:bg-gray-100" title="إضافة صف جديد">
                    <PlusIcon />
                </button>
            </h3>
            <div className="overflow-x-auto border border-t-0 rounded-b-lg">
                <table className="w-full text-sm text-right text-gray-600 min-w-[600px]">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                    <th className="px-4 py-2 w-1/2">أبرز المشكلات</th>
                    <th className="px-4 py-2 w-1/2">آلية التعامل ومقترحات الحل</th>
                    <th className="px-4 py-2 w-12"></th>
                    </tr>
                </thead>
                <tbody>
                    {reportInfo.problems.map((row, index) => (
                    <tr key={row.id} className="border-b hover:bg-gray-50">
                        <td className="p-1"><textarea value={row.problem} onChange={e => handleInfoChange(e, 'problems', index, 'problem')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td>
                        <td className="p-1"><textarea value={row.solution} onChange={e => handleInfoChange(e, 'problems', index, 'solution')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td>
                        <td className="p-1 text-center"><button onClick={() => handleDeleteRow('problems', row.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50" title="حذف الصف"><TrashIcon /></button></td>
                    </tr>
                    ))}
                </tbody>
                </table>
                {reportInfo.problems.length === 0 && <p className="text-center text-gray-500 p-4">لا توجد بيانات. انقر على '+' لإضافة صف جديد.</p>}
            </div>
        </section>

        {/* Strengths Table */}
        <section className="mt-8 break-inside-avoid">
            <h3 className="text-xl font-bold p-3 rounded-t-lg bg-gray-200 text-gray-800 border-b-2 border-gray-300 flex justify-between items-center">
                <span>نقاط القوة وأثرها</span>
                <button onClick={() => handleAddRow('strengths')} className="p-1 bg-white rounded-full hover:bg-gray-100" title="إضافة صف جديد">
                    <PlusIcon />
                </button>
            </h3>
            <div className="overflow-x-auto border border-t-0 rounded-b-lg">
                <table className="w-full text-sm text-right text-gray-600 min-w-[600px]">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                    <th className="px-4 py-2 w-1/3">نقاط القوة</th>
                    <th className="px-4 py-2 w-1/3">أثرها الحالي</th>
                    <th className="px-4 py-2 w-1/3">أثرها المستقبلي</th>
                    <th className="px-4 py-2 w-12"></th>
                    </tr>
                </thead>
                <tbody>
                    {reportInfo.strengths.map((row, index) => (
                    <tr key={row.id} className="border-b hover:bg-gray-50">
                        <td className="p-1"><textarea value={row.strength} onChange={e => handleInfoChange(e, 'strengths', index, 'strength')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td>
                        <td className="p-1"><textarea value={row.currentImpact} onChange={e => handleInfoChange(e, 'strengths', index, 'currentImpact')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td>
                        <td className="p-1"><textarea value={row.futureImpact} onChange={e => handleInfoChange(e, 'strengths', index, 'futureImpact')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td>
                        <td className="p-1 text-center"><button onClick={() => handleDeleteRow('strengths', row.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50" title="حذف الصف"><TrashIcon /></button></td>
                    </tr>
                    ))}
                </tbody>
                </table>
                {reportInfo.strengths.length === 0 && <p className="text-center text-gray-500 p-4">لا توجد بيانات. انقر على '+' لإضافة صف جديد.</p>}
            </div>
        </section>

        {/* Recommendations Table */}
        <section className="mt-8 break-inside-avoid">
            <h3 className="text-xl font-bold p-3 rounded-t-lg bg-gray-200 text-gray-800 border-b-2 border-gray-300 flex justify-between items-center">
                <span>التوصيات والمقترحات</span>
                <button onClick={() => handleAddRow('recommendations')} className="p-1 bg-white rounded-full hover:bg-gray-100" title="إضافة صف جديد">
                    <PlusIcon />
                </button>
            </h3>
            <div className="overflow-x-auto border border-t-0 rounded-b-lg">
                <table className="w-full text-sm text-right text-gray-600 min-w-[600px]">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                    <th className="px-4 py-2 w-1/2">التوصيات والمقترحات</th>
                    <th className="px-4 py-2 w-1/2">مبررات التوصية</th>
                    <th className="px-4 py-2 w-12"></th>
                    </tr>
                </thead>
                <tbody>
                    {reportInfo.recommendations.map((row, index) => (
                    <tr key={row.id} className="border-b hover:bg-gray-50">
                        <td className="p-1"><textarea value={row.recommendation} onChange={e => handleInfoChange(e, 'recommendations', index, 'recommendation')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td>
                        <td className="p-1"><textarea value={row.justification} onChange={e => handleInfoChange(e, 'recommendations', index, 'justification')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td>
                        <td className="p-1 text-center"><button onClick={() => handleDeleteRow('recommendations', row.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50" title="حذف الصف"><TrashIcon /></button></td>
                    </tr>
                    ))}
                </tbody>
                </table>
                {reportInfo.recommendations.length === 0 && <p className="text-center text-gray-500 p-4">لا توجد بيانات. انقر على '+' لإضافة صف جديد.</p>}
            </div>
        </section>

      </div>
    </div>
  );
};

export default ReportView;