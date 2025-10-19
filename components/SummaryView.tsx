import React, { useMemo } from 'react';
import { PlanItem } from '../types';
import { PrintIcon, DocumentTextIcon } from './Icons';
import BarChart from './BarChart';

interface SummaryViewProps {
  planData: PlanItem[];
  supervisorsPlans: { [key: string]: PlanItem[] };
}

const SummaryView: React.FC<SummaryViewProps> = ({ planData, supervisorsPlans }) => {

  const departmentSummary = useMemo(() => {
    const totalActivities = planData.length;
    const totalPlannedTasks = planData.reduce((sum, item) => sum + (item.planned || 0), 0);
    const domains = new Set(planData.map(item => item.domain));
    const objectives = new Set(planData.map(item => item.objective));
    return { totalActivities, totalPlannedTasks, totalDomains: domains.size, totalObjectives: objectives.size };
  }, [planData]);

  const supervisorsSummary = useMemo(() => {
    const supervisorNames = Object.keys(supervisorsPlans);
    if (supervisorNames.length === 0) return null;

    const summaryBySupervisor = supervisorNames.map(name => {
      const plan = supervisorsPlans[name];
      const totalActivities = plan.length;
      const totalPlannedTasks = plan.reduce((sum, item) => sum + (item.planned || 0), 0);
      return { name, totalActivities, totalPlannedTasks };
    });

    const grandTotalActivities = summaryBySupervisor.reduce((sum, s) => sum + s.totalActivities, 0);
    const grandTotalPlannedTasks = summaryBySupervisor.reduce((sum, s) => sum + s.totalPlannedTasks, 0);

    const supervisorColors = ['#60a5fa', '#f87171', '#4ade80', '#fb923c', '#c084fc', '#2dd4bf'];

    const chartData = summaryBySupervisor.map((s, index) => ({
      label: s.name,
      value: s.totalPlannedTasks,
      color: supervisorColors[index % supervisorColors.length],
    }));

    return { summaryBySupervisor, grandTotalActivities, grandTotalPlannedTasks, chartData };
  }, [supervisorsPlans]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="report-view" className="bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg space-y-10">
      <div className="no-print flex justify-between items-center pb-4 border-b dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
            <DocumentTextIcon />
            <span>خلاصة التقارير</span>
        </h2>
        <button onClick={handlePrint} className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 flex items-center gap-2">
          <PrintIcon /> <span>طباعة</span>
        </button>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center mb-6 print:block hidden">خلاصة التقارير</h2>

      {/* Department Plan Summary */}
      <section className="break-inside-avoid">
        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b-2 border-gray-200 dark:border-gray-700">ملخص خطة القسم</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg shadow-sm text-center">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">إجمالي المجالات</h4>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">{departmentSummary.totalDomains}</p>
            </div>
             <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg shadow-sm text-center">
                <h4 className="font-medium text-green-800 dark:text-green-200">إجمالي الأهداف</h4>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-1">{departmentSummary.totalObjectives}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg shadow-sm text-center">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">إجمالي الأنشطة</h4>
                <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 mt-1">{departmentSummary.totalActivities}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg shadow-sm text-center">
                <h4 className="font-medium text-purple-800 dark:text-purple-200">إجمالي المهام المخططة</h4>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">{departmentSummary.totalPlannedTasks}</p>
            </div>
        </div>
      </section>

      {/* Supervisors' Plans Summary */}
      <section className="break-inside-avoid">
        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b-2 border-gray-200 dark:border-gray-700">ملخص خطط المشرفين</h3>
        {!supervisorsSummary ? (
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">لم يتم استيراد أي خطط للمشرفين بعد.</p>
            </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-x-auto border dark:border-gray-700 rounded-lg">
                <table className="w-full text-sm text-right text-gray-600 dark:text-gray-300">
                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-3">اسم المشرف</th>
                            <th className="px-4 py-3 text-center">عدد الأنشطة</th>
                            <th className="px-4 py-3 text-center">إجمالي المهام المخططة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {supervisorsSummary.summaryBySupervisor.map(s => (
                            <tr key={s.name} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100">{s.name}</td>
                                <td className="px-4 py-3 text-center font-bold text-lg">{s.totalActivities}</td>
                                <td className="px-4 py-3 text-center font-bold text-lg">{s.totalPlannedTasks}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-200 dark:bg-gray-600 font-bold text-gray-800 dark:text-gray-100">
                        <tr>
                            <td className="px-4 py-3">الإجمالي</td>
                            <td className="px-4 py-3 text-center text-lg">{supervisorsSummary.grandTotalActivities}</td>
                            <td className="px-4 py-3 text-center text-lg">{supervisorsSummary.grandTotalPlannedTasks}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div className="break-inside-avoid">
                <BarChart data={supervisorsSummary.chartData} title="مقارنة المهام المخططة بين المشرفين" />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SummaryView;