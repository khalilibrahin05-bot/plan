import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PlanItem, ReportInfoData, ExtraActivity, ProblemSolution, StrengthImpact, Recommendation } from '../types';
import { MONTHS } from '../constants';
import { getDomainColor } from '../colors';
import GroupedBarChart from './GroupedBarChart';
import WeeklyTracker from './WeeklyTracker';
import AIAnalyst from './AIAnalyst';
import { ExcelIcon, PlusIcon, TrashIcon, ChevronDownIcon } from './Icons';

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
        <p className="font-semibold text-lg text-primary">{item.activity}</p>
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

interface SupervisorReportViewProps {
  supervisorName: string;
  plan: PlanItem[];
  selectedMonthIndex: number;
  onWeeklyExecutionChange: (itemId: number, newWeeklyValues: (number | null)[]) => void;
}

const SupervisorReportView: React.FC<SupervisorReportViewProps> = ({ supervisorName, plan, selectedMonthIndex, onWeeklyExecutionChange }) => {
  const [printingItemId, setPrintingItemId] = useState<number | null>(null);
  const [collapsedDomains, setCollapsedDomains] = useState<Set<string>>(new Set());
  const monthName = MONTHS[selectedMonthIndex];
  const reportContainerRef = useRef<HTMLDivElement>(null);

  const REPORT_INFO_KEY_PREFIX = 'supervisorReportInfo';
  const getReportInfoStorageKey = (supervisor: string, monthIndex: number) => `${REPORT_INFO_KEY_PREFIX}_${supervisor}_${monthIndex}`;

  const [reportInfo, setReportInfo] = useState<ReportInfoData>({
      extraActivities: [],
      problems: [],
      strengths: [],
      recommendations: [],
  });

  // Load data from localStorage when supervisor or month changes
  useEffect(() => {
      try {
          const key = getReportInfoStorageKey(supervisorName, selectedMonthIndex);
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
          console.error("Failed to load supervisor report info from localStorage", error);
          setReportInfo({ extraActivities: [], problems: [], strengths: [], recommendations: [] });
      }
  }, [supervisorName, selectedMonthIndex]);

  // Save data to localStorage when it changes
  useEffect(() => {
      try {
          const key = getReportInfoStorageKey(supervisorName, selectedMonthIndex);
          localStorage.setItem(key, JSON.stringify(reportInfo));
      } catch (error) {
          console.error("Failed to save supervisor report info to localStorage", error);
      }
  }, [reportInfo, supervisorName, selectedMonthIndex]);

  useEffect(() => {
    if (reportContainerRef.current) {
        const textareas = reportContainerRef.current.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            if (textarea.value) {
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
            }
        });
    }
  }, [reportInfo]);

  const handleInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement>, tableName: keyof ReportInfoData, index: number, field: string) => {
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
      setReportInfo(prev => ({ ...prev, [tableName]: (prev[tableName] as any[]).filter(row => row.id !== id) }));
  };
  
  const toggleDomain = (domain: string) => {
    setCollapsedDomains(prev => {
      const newSet = new Set(prev);
      if (newSet.has(domain)) {
        newSet.delete(domain);
      } else {
        newSet.add(domain);
      }
      return newSet;
    });
  };

  const filteredData = plan.filter(item => {
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

  const handlePrintSingleItem = useCallback((itemId: number) => {
    setPrintingItemId(itemId);
    setTimeout(() => {
        window.print();
        setPrintingItemId(null);
    }, 100);
  }, []);

  const handleExportExcel = () => {
    if (typeof XLSX === 'undefined') {
      alert('لا يمكن تصدير الملف. يرجى المحاولة مرة أخرى.');
      return;
    }

    const dataToExport = filteredData.map(item => ({
      'المجال': item.domain, 'الهدف': item.objective, 'المؤشر': item.indicator, 'الشواهد': item.evidence, 'النشاط': item.activity,
      'المخطط للشهر': item.schedule[selectedMonthIndex] ?? 0, 'المنفذ الأسبوع ١': item.weeklyExecution[0] ?? 0, 'المنفذ الأسبوع ٢': item.weeklyExecution[1] ?? 0,
      'المنفذ الأسبوع ٣': item.weeklyExecution[2] ?? 0, 'المنفذ الأسبوع ٤': item.weeklyExecution[3] ?? 0, 'إجمالي المنفذ': item.weeklyExecution.reduce((acc, val) => acc + (val || 0), 0)
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(XLSX.utils.book_new(), worksheet, "تقرير الأنشطة");
    worksheet['!cols'] = [ { wch: 30 }, { wch: 40 }, { wch: 40 }, { wch: 30 }, { wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 } ];
    XLSX.writeFile(XLSX.utils.book_new(), `تقرير-${supervisorName}-شهر-${monthName}.xlsx`);
  };
  
  const reportViewClasses = [ "bg-white rounded-lg", printingItemId ? 'printing-active' : '' ].join(' ');

  return (
    <div id="supervisor-report" className={reportViewClasses} ref={reportContainerRef}>
      <div className="no-print flex justify-end items-center mb-4">
          <button onClick={handleExportExcel} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 flex items-center space-x-2 space-x-reverse">
            <ExcelIcon />
            <span>تصدير Excel</span>
          </button>
      </div>
       <h3 className="text-xl font-bold text-gray-800 text-center mb-4 print:block hidden no-print-when-item-printing">
          تقرير الأنشطة لشهر: {monthName}
      </h3>

       {totalActivities > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 break-inside-avoid no-print-when-item-printing">
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                 <h4 className="font-bold text-gray-700 mb-3 text-center">ملخص الأداء الشهري</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center bg-white p-2 rounded-md"><span className="text-gray-600">عدد الأنشطة المخططة:</span><span className="font-bold text-xl text-primary">{totalActivities}</span></div>
                    <div className="flex justify-between items-center bg-white p-2 rounded-md"><span className="text-gray-600">إجمالي المهام المخططة:</span><span className="font-bold text-xl text-green-600">{totalPlannedTasks}</span></div>
                    <div className="flex justify-between items-center bg-white p-2 rounded-md"><span className="text-gray-600">إجمالي المهام المنفذة:</span><span className="font-bold text-xl text-orange-600">{totalExecutedTasks}</span></div>
                </div>
            </div>
            <div className="break-inside-avoid"><GroupedBarChart data={chartData} title="مقارنة المخطط بالمنفذ حسب المجال" /></div>
        </div>
       )}

       {totalActivities > 0 && (
          <div className="my-8 break-inside-avoid no-print-when-item-printing"><AIAnalyst data={filteredData} monthName={monthName} /></div>
        )}

      {totalActivities === 0 ? (
        <div className="text-center py-12"><p className="text-lg text-gray-500">لا توجد أنشطة مخططة لهذا المشرف في هذا الشهر.</p></div>
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedData).map(domain => {
            const colors = getDomainColor(domain);
            const isCollapsed = collapsedDomains.has(domain);
            return (
              <section key={domain} className="break-inside-avoid">
                 <h3 className={`text-xl font-bold p-0 ${isCollapsed ? 'rounded-lg' : 'rounded-t-lg'} ${colors.bg} ${colors.text} border-b-2 ${colors.border} no-print-when-item-printing`}>
                    <button
                        onClick={() => toggleDomain(domain)}
                        aria-expanded={!isCollapsed}
                        aria-controls={`domain-content-sv-${domain.replace(/\s+/g, '-')}`}
                        className="w-full flex justify-between items-center text-right p-3"
                    >
                        <span>{domain}</span>
                        <ChevronDownIcon className={`w-6 h-6 transform transition-transform duration-200 ${!isCollapsed ? 'rotate-180' : ''}`} />
                    </button>
                </h3>
                {!isCollapsed && (
                    <div id={`domain-content-sv-${domain.replace(/\s+/g, '-')}`} className="space-y-6 border border-t-0 rounded-b-lg p-4 animate-fade-in">
                        {groupedData[domain].map(item => (<ReportItemCard key={item.id} item={item} selectedMonthIndex={selectedMonthIndex} monthName={monthName} printingItemId={printingItemId} onWeeklyExecutionChange={onWeeklyExecutionChange} onPrintSingleItem={handlePrintSingleItem} />))}
                    </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {/* Report Information Section */}
      <div className="mt-10 pt-6 border-t-2 border-dashed no-print-when-item-printing break-before-page">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">معلومات التقرير للمشرف: {supervisorName}</h2>
        <section className="mt-8 break-inside-avoid">
            <h3 className="text-xl font-bold p-3 rounded-t-lg bg-gray-200 text-gray-800 border-b-2 border-gray-300 flex justify-between items-center"><span>أنشطة خارج الخطة</span><button onClick={() => handleAddRow('extraActivities')} className="p-1 bg-white rounded-full hover:bg-gray-100"><PlusIcon /></button></h3>
            <div className="overflow-x-auto border border-t-0 rounded-b-lg">
                <table className="w-full text-sm text-right text-gray-600 min-w-[600px]">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100"><tr><th className="px-4 py-2 w-1/4">المجال</th><th className="px-4 py-2 w-2/4">مبررات التنفيذ</th><th className="px-4 py-2 w-1/4">جهة التكليف</th><th className="px-4 py-2 w-12"></th></tr></thead>
                    <tbody>{reportInfo.extraActivities.map((row, index) => (<tr key={row.id} className="border-b hover:bg-gray-50"><td className="p-1"><textarea value={row.domain} onChange={e => handleInfoChange(e, 'extraActivities', index, 'domain')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td><td className="p-1"><textarea value={row.justification} onChange={e => handleInfoChange(e, 'extraActivities', index, 'justification')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td><td className="p-1"><textarea value={row.assignedBy} onChange={e => handleInfoChange(e, 'extraActivities', index, 'assignedBy')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td><td className="p-1 text-center"><button onClick={() => handleDeleteRow('extraActivities', row.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"><TrashIcon /></button></td></tr>))}</tbody>
                </table>
                {reportInfo.extraActivities.length === 0 && <p className="text-center text-gray-500 p-4">لا توجد بيانات. انقر على '+' لإضافة صف.</p>}
            </div>
        </section>
        <section className="mt-8 break-inside-avoid">
            <h3 className="text-xl font-bold p-3 rounded-t-lg bg-gray-200 text-gray-800 border-b-2 border-gray-300 flex justify-between items-center"><span>أبرز المشكلات</span><button onClick={() => handleAddRow('problems')} className="p-1 bg-white rounded-full hover:bg-gray-100"><PlusIcon /></button></h3>
            <div className="overflow-x-auto border border-t-0 rounded-b-lg">
                <table className="w-full text-sm text-right text-gray-600 min-w-[600px]">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100"><tr><th className="px-4 py-2 w-1/2">المشكلة</th><th className="px-4 py-2 w-1/2">مقترحات الحل</th><th className="px-4 py-2 w-12"></th></tr></thead>
                    <tbody>{reportInfo.problems.map((row, index) => (<tr key={row.id} className="border-b hover:bg-gray-50"><td className="p-1"><textarea value={row.problem} onChange={e => handleInfoChange(e, 'problems', index, 'problem')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td><td className="p-1"><textarea value={row.solution} onChange={e => handleInfoChange(e, 'problems', index, 'solution')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td><td className="p-1 text-center"><button onClick={() => handleDeleteRow('problems', row.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"><TrashIcon /></button></td></tr>))}</tbody>
                </table>
                {reportInfo.problems.length === 0 && <p className="text-center text-gray-500 p-4">لا توجد بيانات. انقر على '+' لإضافة صف.</p>}
            </div>
        </section>
        <section className="mt-8 break-inside-avoid">
            <h3 className="text-xl font-bold p-3 rounded-t-lg bg-gray-200 text-gray-800 border-b-2 border-gray-300 flex justify-between items-center"><span>نقاط القوة</span><button onClick={() => handleAddRow('strengths')} className="p-1 bg-white rounded-full hover:bg-gray-100"><PlusIcon /></button></h3>
            <div className="overflow-x-auto border border-t-0 rounded-b-lg">
                <table className="w-full text-sm text-right text-gray-600 min-w-[600px]">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100"><tr><th className="px-4 py-2 w-1/3">نقطة القوة</th><th className="px-4 py-2 w-1/3">أثرها الحالي</th><th className="px-4 py-2 w-1/3">أثرها المستقبلي</th><th className="px-4 py-2 w-12"></th></tr></thead>
                    <tbody>{reportInfo.strengths.map((row, index) => (<tr key={row.id} className="border-b hover:bg-gray-50"><td className="p-1"><textarea value={row.strength} onChange={e => handleInfoChange(e, 'strengths', index, 'strength')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td><td className="p-1"><textarea value={row.currentImpact} onChange={e => handleInfoChange(e, 'strengths', index, 'currentImpact')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td><td className="p-1"><textarea value={row.futureImpact} onChange={e => handleInfoChange(e, 'strengths', index, 'futureImpact')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td><td className="p-1 text-center"><button onClick={() => handleDeleteRow('strengths', row.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"><TrashIcon /></button></td></tr>))}</tbody>
                </table>
                {reportInfo.strengths.length === 0 && <p className="text-center text-gray-500 p-4">لا توجد بيانات. انقر على '+' لإضافة صف.</p>}
            </div>
        </section>
        <section className="mt-8 break-inside-avoid">
            <h3 className="text-xl font-bold p-3 rounded-t-lg bg-gray-200 text-gray-800 border-b-2 border-gray-300 flex justify-between items-center"><span>التوصيات</span><button onClick={() => handleAddRow('recommendations')} className="p-1 bg-white rounded-full hover:bg-gray-100"><PlusIcon /></button></h3>
            <div className="overflow-x-auto border border-t-0 rounded-b-lg">
                <table className="w-full text-sm text-right text-gray-600 min-w-[600px]">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100"><tr><th className="px-4 py-2 w-1/2">التوصية</th><th className="px-4 py-2 w-1/2">المبررات</th><th className="px-4 py-2 w-12"></th></tr></thead>
                    <tbody>{reportInfo.recommendations.map((row, index) => (<tr key={row.id} className="border-b hover:bg-gray-50"><td className="p-1"><textarea value={row.recommendation} onChange={e => handleInfoChange(e, 'recommendations', index, 'recommendation')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td><td className="p-1"><textarea value={row.justification} onChange={e => handleInfoChange(e, 'recommendations', index, 'justification')} className="w-full p-2 border rounded-md min-h-[40px] resize-y" rows={1}></textarea></td><td className="p-1 text-center"><button onClick={() => handleDeleteRow('recommendations', row.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"><TrashIcon /></button></td></tr>))}</tbody>
                </table>
                {reportInfo.recommendations.length === 0 && <p className="text-center text-gray-500 p-4">لا توجد بيانات. انقر على '+' لإضافة صف.</p>}
            </div>
        </section>
      </div>
    </div>
  );
};

export default SupervisorReportView;