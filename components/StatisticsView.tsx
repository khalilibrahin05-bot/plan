import React, { useMemo } from 'react';
import { PlanItem } from '../types';
import { MONTHS } from '../constants';
import BarChart from './BarChart';
import DonutChart from './DonutChart';
import { PrintIcon, ChartPieIcon } from './Icons';
import { getDomainColor } from '../colors';

interface StatisticsViewProps {
  data: PlanItem[];
}

const StatisticsView: React.FC<StatisticsViewProps> = ({ data }) => {

    const stats = useMemo(() => {
        if (data.length === 0) {
            return null;
        }

        const domains = new Set(data.map(item => item.domain));
        const objectives = new Set(data.map(item => item.objective));
        const totalActivities = data.length;
        const totalPlannedTasks = data.reduce((sum, item) => sum + (item.planned || 0), 0);

        const activitiesByDomain = data.reduce((acc, item) => {
            acc[item.domain] = (acc[item.domain] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const plannedTasksByDomain = data.reduce((acc, item) => {
            acc[item.domain] = (acc[item.domain] || 0) + (item.planned || 0);
            return acc;
        }, {} as Record<string, number>);

        const plannedTasksByMonth = MONTHS.map((month, index) => {
            const monthlyTotal = data.reduce((sum, item) => sum + (item.schedule[index] || 0), 0);
            return { label: month, value: monthlyTotal };
        });
        
        const monthColors = ['#38bdf8', '#818cf8', '#f472b6', '#fb923c', '#a78bfa', '#34d399', '#facc15', '#fb7185', '#4f46e5', '#db2777', '#9333ea', '#16a34a'];

        const activitiesByDomainChartData = Object.entries(activitiesByDomain).map(([label, value]) => ({
            label,
            value,
            color: getDomainColor(label).hex,
        }));

        const plannedTasksByDomainChartData = Object.entries(plannedTasksByDomain).map(([label, value]) => ({
            label,
            value,
            color: getDomainColor(label).hex,
        }));
        
        const plannedTasksByMonthChartData = plannedTasksByMonth.map((item, index) => ({
            ...item,
            color: monthColors[index % monthColors.length]
        }));

        return {
            totalDomains: domains.size,
            totalObjectives: objectives.size,
            totalActivities,
            totalPlannedTasks,
            activitiesByDomainChart: activitiesByDomainChartData,
            plannedTasksByDomainChart: plannedTasksByDomainChartData,
            plannedTasksByMonthChart: plannedTasksByMonthChartData,
            domainSummary: Object.keys(activitiesByDomain).map(domain => ({
                domain,
                activities: activitiesByDomain[domain] || 0,
                tasks: plannedTasksByDomain[domain] || 0,
            }))
        };
    }, [data]);

    const handlePrint = () => {
        window.print();
    };

    const donutChartData = useMemo(() => {
        if (!stats) return [];
        return stats.activitiesByDomainChart.map(item => ({
            label: item.label,
            value: item.value,
            color: item.color || '#6b7280',
        }));
    }, [stats]);


    if (!stats) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="flex justify-center items-center gap-3 text-2xl font-bold text-gray-800">
                    <ChartPieIcon />
                    <span>إحصائيات الخطة</span>
                </div>
                <p className="mt-4 text-gray-500">لا توجد بيانات لعرض الإحصائيات. قد يكون ذلك بسبب عدم تطابق أي عنصر مع معايير البحث الحالية.</p>
            </div>
        );
    }
    
    return (
        <div id="report-view" className="bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
            <div className="no-print flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
                    <ChartPieIcon />
                    <span>إحصائيات الخطة</span>
                </h2>
                <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 flex items-center gap-2"
                >
                    <PrintIcon />
                    <span>طباعة</span>
                </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center mb-6 print:block hidden">
                إحصائيات الخطة
            </h2>
            
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 break-inside-avoid">
                <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">إجمالي المجالات</h3>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">{stats.totalDomains}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">إجمالي الأهداف</h3>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-1">{stats.totalObjectives}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">إجمالي الأنشطة</h3>
                    <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 mt-1">{stats.totalActivities}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/30 border-l-4 border-purple-500 p-4 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">إجمالي المهام المخططة</h3>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">{stats.totalPlannedTasks}</p>
                </div>
            </section>
            
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 break-inside-avoid">
                <DonutChart data={donutChartData} title="توزيع الأنشطة على المجالات" />
                <BarChart data={stats.plannedTasksByDomainChart} title="توزيع المهام المخططة على المجالات" />
            </section>
            
            <section className="mb-8 break-inside-avoid">
                <BarChart data={stats.plannedTasksByMonthChart} title="المهام المخططة شهريًا" />
            </section>

            <section className="break-inside-avoid">
                 <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">ملخص المجالات</h3>
                 <div className="overflow-x-auto border dark:border-gray-700 rounded-lg">
                    <table className="w-full text-sm text-right text-gray-600 dark:text-gray-300">
                        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3">المجال</th>
                                <th className="px-4 py-3 text-center">عدد الأنشطة</th>
                                <th className="px-4 py-3 text-center">إجمالي المهام المخططة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.domainSummary.map(({ domain, activities, tasks }) => {
                                const colors = getDomainColor(domain);
                                return (
                                <tr key={domain} className={`border-b dark:border-gray-700 ${colors.bg} hover:bg-opacity-50`}>
                                    <td className={`px-4 py-3 font-semibold ${colors.text}`}>{domain}</td>
                                    <td className="px-4 py-3 text-center font-bold text-lg">{activities}</td>
                                    <td className="px-4 py-3 text-center font-bold text-lg">{tasks}</td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                 </div>
            </section>
        </div>
    );
};
export default StatisticsView;