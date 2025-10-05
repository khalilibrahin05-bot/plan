
import React, { useMemo, useState } from 'react';
import { PlanItem } from '../types';
import { getDomainColor } from '../colors';
import { PrintIcon } from './Icons';
import { MONTHS } from '../constants';
import AIProgrammingAssistant from './AIProgrammingAssistant';
import DonutChart from './DonutChart';

interface FollowUpViewProps {
  data: PlanItem[];
}

interface ActivityStatus extends PlanItem {
  isProgrammed: boolean;
}

const MiniTimeline = ({ schedule }: { schedule: (number | null)[] }) => (
    <div className="flex gap-0.5" dir="ltr" title="الجدول السنوي للنشاط">
        {MONTHS.map((month, index) => (
            <div
                key={index}
                className={`w-3 h-5 rounded-sm transition-colors ${
                    schedule[index] ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                title={`${month}: ${schedule[index] ?? 'لا يوجد'}`}
            ></div>
        ))}
    </div>
);

const FollowUpView: React.FC<FollowUpViewProps> = ({ data }) => {
  const [filter, setFilter] = useState<'all' | 'programmed' | 'not-programmed'>('all');
  
  const processedData = useMemo(() => {
    const activitiesWithStatus: ActivityStatus[] = data.map(item => ({
      ...item,
      isProgrammed: item.schedule.some(s => s !== null && s > 0),
    }));
    
    const filteredActivities = activitiesWithStatus.filter(activity => {
        if (filter === 'all') return true;
        if (filter === 'programmed') return activity.isProgrammed;
        if (filter === 'not-programmed') return !activity.isProgrammed;
        return true;
    });

    const groupedByDomain = filteredActivities.reduce((acc, item) => {
      if (!acc[item.domain]) {
        acc[item.domain] = [];
      }
      acc[item.domain].push(item);
      return acc;
    }, {} as Record<string, ActivityStatus[]>);

    const structuredData = Object.entries(groupedByDomain).map(([domain, activities]) => {
      const groupedByObjective = activities.reduce((acc, item) => {
        if (!acc[item.objective]) {
          acc[item.objective] = [];
        }
        acc[item.objective].push(item);
        return acc;
      }, {} as Record<string, ActivityStatus[]>);

      return {
        domain,
        objectives: Object.entries(groupedByObjective).map(([objective, acts]) => ({
          objective,
          activities: acts,
        })),
      };
    });
    
    const totalActivities = data.length;
    const programmedActivities = activitiesWithStatus.filter(a => a.isProgrammed).length;
    const notProgrammedActivities = totalActivities - programmedActivities;
    const programmingPercentage = totalActivities > 0 ? (programmedActivities / totalActivities) * 100 : 0;
    const unprogrammedActivityItems = activitiesWithStatus.filter(a => !a.isProgrammed);

    return { structuredData, totalActivities, programmedActivities, notProgrammedActivities, programmingPercentage, unprogrammedActivityItems };
  }, [data, filter]);

  const { structuredData, totalActivities, programmedActivities, notProgrammedActivities, programmingPercentage, unprogrammedActivityItems } = processedData;

  const handlePrint = () => {
    window.print();
  };
  
  const filterButtons = [
    { key: 'all', label: 'الكل' },
    { key: 'programmed', label: 'مبرمجة' },
    { key: 'not-programmed', label: 'غير مبرمجة' },
  ];

    const chartData = useMemo(() => [
    { label: 'مبرمجة', value: programmedActivities, color: '#4ade80' }, // Tailwind green-400
    { label: 'غير مبرمجة', value: notProgrammedActivities, color: '#f87171' }, // Tailwind red-400
  ], [programmedActivities, notProgrammedActivities]);

  return (
    <div id="report-view" className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
      <div className="no-print flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">
          تقرير متابعة برمجة الأنشطة
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
        تقرير متابعة برمجة الأنشطة
      </h2>
      
      {/* Summary Section */}
      <section className="mb-8 break-inside-avoid">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border">
            <div>
                <DonutChart data={chartData} title="حالة برمجة الأنشطة" />
            </div>
            <div className="flex flex-col justify-center">
                <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">ملخص البرمجة</h3>
                <div className="space-y-4">
                    <div className="p-3 bg-green-100 rounded-md text-center">
                        <p className="text-sm text-green-800">أنشطة تمت برمجتها</p>
                        <p className="text-3xl font-bold text-green-900">{programmedActivities}</p>
                    </div>
                     <div className="p-3 bg-red-100 rounded-md text-center">
                        <p className="text-sm text-red-800">أنشطة لم تبرمج</p>
                        <p className="text-3xl font-bold text-red-900">{notProgrammedActivities}</p>
                    </div>
                </div>
                <div className="mt-6">
                    <p className="text-center text-gray-600 mb-2">نسبة الإنجاز في البرمجة</p>
                    <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full flex items-center justify-center transition-all duration-500" style={{ width: `${programmingPercentage}%` }}>
                           <span className="text-sm font-medium text-white px-2">
                             {programmingPercentage.toFixed(0)}%
                           </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

       {/* AI Assistant */}
       <section className="my-8 no-print">
         <AIProgrammingAssistant activities={unprogrammedActivityItems} />
       </section>
      
      {/* Filter controls */}
      <div className="flex justify-center items-center gap-2 my-6 p-2 bg-gray-100 rounded-lg no-print">
          {filterButtons.map(btn => (
              <button key={btn.key}
                  onClick={() => setFilter(btn.key as any)}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === btn.key ? 'bg-blue-600 text-white shadow' : 'bg-white hover:bg-blue-50 text-gray-700'}`}
              >
                  {btn.label}
              </button>
          ))}
      </div>

      {/* Detailed View */}
      <div className="space-y-8">
        {structuredData.length === 0 && (
             <div className="text-center py-12">
                <p className="text-lg text-gray-500">لا توجد أنشطة تطابق هذا الفلتر.</p>
            </div>
        )}
        {structuredData.map(({ domain, objectives }) => {
          const colors = getDomainColor(domain);
          return (
            <section key={domain} className="break-inside-avoid">
              <h3 className={`text-xl font-bold p-3 rounded-t-lg ${colors.bg} ${colors.text} border-b-2 ${colors.border}`}>
                {domain}
              </h3>
              <div className="border border-t-0 rounded-b-lg p-4 space-y-4">
                {objectives.map(({ objective, activities }) => (
                  <div key={objective}>
                    <h4 className="text-md font-semibold text-gray-700 mb-2 p-2 bg-gray-100 rounded-md">{objective}</h4>
                    <ul className="space-y-2">
                      {activities.map(activity => (
                        <li key={activity.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-2 rounded-md hover:bg-gray-50 gap-2">
                          <span className="text-gray-800 flex-grow">{activity.activity}</span>
                          <div className="flex items-center gap-4 flex-shrink-0">
                                <MiniTimeline schedule={activity.schedule} />
                                {activity.isProgrammed ? (
                                    <span className="text-xs font-medium w-24 text-center px-2 py-1 rounded-full bg-green-200 text-green-800">
                                    تمت برمجته
                                    </span>
                                ) : (
                                    <span className="text-xs font-medium w-24 text-center px-2 py-1 rounded-full bg-red-200 text-red-800">
                                    لم تتم برمجته
                                    </span>
                                )}
                            </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default FollowUpView;