import React, { useState } from 'react';
import { PlanItem } from '../types';
import { MONTHS } from '../constants';
import { getDomainColor } from '../colors';
import { ChevronDownIcon } from './Icons';

interface SemesterReportViewProps {
  data: PlanItem[];
  selectedMonthIndex: number;
}

const SemesterReportView: React.FC<SemesterReportViewProps> = ({ data, selectedMonthIndex }) => {
  const [collapsedDomains, setCollapsedDomains] = useState<Set<string>>(new Set());

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

  const semesterIndices = [
    selectedMonthIndex,
    (selectedMonthIndex + 1) % 12,
    (selectedMonthIndex + 2) % 12,
  ];
  const semesterMonthNames = semesterIndices.map(i => MONTHS[i]);

  const semesterData = semesterIndices.map(monthIndex => {
    const filtered = data.filter(item => {
      const scheduleValue = item.schedule[monthIndex];
      return typeof scheduleValue === 'number' && scheduleValue > 0;
    });
    const grouped = filtered.reduce((acc, item) => {
      (acc[item.domain] = acc[item.domain] || []).push(item);
      return acc;
    }, {} as Record<string, PlanItem[]>);
    return {
      monthIndex,
      monthName: MONTHS[monthIndex],
      groupedData: grouped,
      totalActivities: filtered.length,
    };
  });

  const totalSemesterActivities = semesterData.reduce((acc, month) => acc + month.totalActivities, 0);
  
  const totalSemesterTasks = semesterData.reduce((acc, month) => {
    const monthTotal = (Object.values(month.groupedData).flat() as PlanItem[]).reduce((sum, item) => sum + (item.schedule[month.monthIndex] || 0), 0);
    return acc + monthTotal;
  }, 0);


  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="report-view" className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
       <div className="no-print flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">
          التقرير الفصلي: <span className="text-primary">{semesterMonthNames.join(', ')}</span>
        </h2>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center space-x-2 space-x-reverse"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
          </svg>
          <span>طباعة</span>
        </button>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-2 print:block hidden">
          التقرير الفصلي
      </h2>
       <p className="text-lg text-gray-600 text-center mb-6 print:block hidden">
        ( {semesterMonthNames.join(' - ')} )
      </p>

      {/* Semester Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 break-inside-avoid">
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h4 className="font-bold text-gray-700 mb-2">ملخص الفصل الدراسي</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">إجمالي الأنشطة المخططة:</span>
              <span className="font-bold text-xl text-primary">{totalSemesterActivities}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">إجمالي المهام المخططة:</span>
              <span className="font-bold text-xl text-green-600">{totalSemesterTasks}</span>
            </div>
          </div>
        </div>
         <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h4 className="font-bold text-gray-700 mb-2">ملاحظات</h4>
          <textarea
            className="w-full h-24 p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="أضف ملاحظاتك هنا للطباعة..."
          ></textarea>
        </div>
      </div>
      
      {/* Monthly Breakdowns */}
      <div className="space-y-10">
        {semesterData.map(month => (
          <div key={month.monthIndex} className="break-inside-avoid">
            <h3 className="text-2xl font-bold text-center text-gray-800 bg-gray-200 p-2 rounded-md mb-6">{month.monthName}</h3>
            {month.totalActivities === 0 ? (
              <p className="text-center text-gray-500 py-4">لا توجد أنشطة لهذا الشهر.</p>
            ) : (
               Object.keys(month.groupedData).map(domain => {
                const colors = getDomainColor(domain);
                const isCollapsed = collapsedDomains.has(domain);
                return (
                  <section key={domain} className="mb-6 break-inside-avoid">
                    <h4 className={`text-lg font-bold p-0 ${isCollapsed ? 'rounded-lg' : 'rounded-t-lg'} ${colors.bg} ${colors.text} border-b-2 ${colors.border}`}>
                      <button
                        onClick={() => toggleDomain(domain)}
                        aria-expanded={!isCollapsed}
                        aria-controls={`domain-content-sem-${domain.replace(/\s+/g, '-')}-${month.monthIndex}`}
                        className="w-full flex justify-between items-center text-right p-2"
                      >
                          <span>{domain}</span>
                          <ChevronDownIcon className={`w-5 h-5 transform transition-transform duration-200 ${!isCollapsed ? 'rotate-180' : ''}`} />
                      </button>
                    </h4>
                    {!isCollapsed && (
                        <div id={`domain-content-sem-${domain.replace(/\s+/g, '-')}-${month.monthIndex}`} className="border border-t-0 rounded-b-lg p-4 animate-fade-in">
                        {month.groupedData[domain].map(item => (
                            <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-1 py-2 border-b last:border-0">
                                <p className="md:col-span-3 font-semibold text-primary/80">{item.activity}</p>
                                <div className="md:col-span-3 grid grid-cols-2 gap-x-4">
                                <p><span className="font-semibold text-gray-500">عدد المؤشر:</span> {item.indicatorCount ?? '-'}</p>
                                <p><span className="font-semibold text-gray-500">العدد للشهر:</span> <span className="font-bold text-green-600">{item.schedule[month.monthIndex]}</span></p>
                                </div>
                            </div>
                        ))}
                        </div>
                    )}
                  </section>
                );
              })
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemesterReportView;