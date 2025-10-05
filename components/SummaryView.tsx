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

    const chartData = summaryBySupervisor.map(s => ({ label: s.name, value: s.totalPlannedTasks }));

    return { summaryBySupervisor, grandTotalActivities, grandTotalPlannedTasks, chartData };
  }, [supervisorsPlans]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="report-view" className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg space-y-10">
      <div className="no-print flex justify-between items-center pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <DocumentTextIcon />
            <span>خلاصة التقارير</span>
        </h2>
        <button onClick={handlePrint} className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 flex items-center gap-2">
          <PrintIcon /> <span>طباعة</span>
        </button>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 print:block hidden">خلاصة التقارير</h2>

      {/* Department Plan Summary */}
      <section className="break-inside-avoid">
        <h3 className="text-xl font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">ملخص خطة القسم</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm text-center">
                <h4 className="font-medium text-blue-800">إجمالي المجالات</h4>
                <p className="text-3xl font-bold text-blue-900 mt-1">{departmentSummary.totalDomains}</p>
            </div>
             <div className="bg-green-50 p-4 rounded-lg shadow-sm text-center">
                <h4 className="font-medium text-green-800">إجمالي الأهداف</h4>
                <p className="text-3xl font-bold text-green-900 mt-1">{departmentSummary.totalObjectives}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg shadow-sm text-center">
                <h4 className="font-medium text-yellow-800">إجمالي الأنشطة</h4>
                <p className="text-3xl font-bold text-yellow-900 mt-1">{departmentSummary.totalActivities}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg shadow-sm text-center">
                <h4 className="font-medium text-purple-800">إجمالي المهام المخططة</h4>
                <p className="text-3xl font-bold text-purple-900 mt-1">{departmentSummary.totalPlannedTasks}</p>
            </div>
        </div>
      </section>

      {/* Supervisors' Plans Summary */}
      <section className="break-inside-avoid">
        <h3 className="text-xl font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">ملخص خطط المشرفين</h3>
        {!supervisorsSummary ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">لم يتم استيراد أي خطط للمشرفين بعد.</p>
            </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm text-right text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th className="px-4 py-3">اسم المشرف</th>
                            <th className="px-4 py-3 text-center">عدد الأنشطة</th>
                            <th className="px-4 py-3 text-center">إجمالي المهام المخططة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {supervisorsSummary.summaryBySupervisor.map(s => (
                            <tr key={s.name} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 font-semibold text-gray-800">{s.name}</td>
                                <td className="px-4 py-3 text-center font-bold text-lg">{s.totalActivities}</td>
                                <td className="px-4 py-3 text-center font-bold text-lg">{s.totalPlannedTasks}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-200 font-bold text-gray-800">
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