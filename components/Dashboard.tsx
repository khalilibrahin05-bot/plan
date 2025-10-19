import React from 'react';
import { 
    TableIcon, DocumentReportIcon, CalendarReportIcon, DocumentTextIcon,
    ChecklistIcon, BookOpenIcon, SparklesIcon, CalendarIcon,
    WrenchScrewdriverIcon, LibraryIcon, ChartPieIcon, UserGroupIcon, ShieldCheckIcon, KeyIcon
} from './Icons';
import { View } from '../App';

interface DashboardProps {
  onViewChange: (view: View) => void;
}

const views = [
    { view: 'table', icon: <TableIcon />, title: 'القائمة الرئيسية', description: 'عرض وتحرير الخطة السنوية الكاملة.' },
    { view: 'report', icon: <DocumentReportIcon />, title: 'التقرير الشهري', description: 'متابعة الأداء الأسبوعي وتعبئة تقرير الشهر.' },
    { view: 'semester', icon: <CalendarReportIcon />, title: 'التقرير الفصلي', description: 'عرض ملخص الأنشطة على مدى فصل دراسي.' },
    { view: 'summary', icon: <DocumentTextIcon />, title: 'خلاصة التقارير', description: 'مقارنة خطة القسم بخطط المشرفين المستوردة.' },
    { view: 'statistics', icon: <ChartPieIcon />, title: 'الإحصائيات', description: 'تحليلات ورسوم بيانية حول توزيع الخطة.' },
    { view: 'follow-up', icon: <ChecklistIcon />, title: 'متابعة البرمجة', description: 'تتبع الأنشطة المبرمجة وغير المبرمجة.' },
    { view: 'supervisors', icon: <UserGroupIcon />, title: 'خطط المشرفين', description: 'استيراد وعرض خطط المشرفين التربويين.' },
    { view: 'strategic-plan', icon: <KeyIcon />, title: 'الخطة الاستراتيجية', description: 'عرض وإدارة المبادرات والأهداف طويلة المدى.' },
    { view: 'framework', icon: <LibraryIcon />, title: 'الإطار المرجعي للإشراف', description: 'تصفح معايير ومؤشرات الإشراف التربوي.' },
    { view: 'unified-glossary', icon: <BookOpenIcon />, title: 'القواميس', description: 'شرح مصطلحات الخطة والمصطلحات التربوية.' },
    { view: 'ai-tools', icon: <SparklesIcon />, title: 'أدوات الذكاء الاصطناعي', description: 'استخدام AI لتحليل وتلخيص التقارير.' },
    { view: 'events', icon: <CalendarIcon />, title: 'المناسبات', description: 'تقويم الفعاليات والمناسبات الهامة.' },
    { view: 'tools', icon: <WrenchScrewdriverIcon />, title: 'أهم الأدوات', description: 'نماذج وأدوات لازمة لتنفيذ الخطة.' },
    { view: 'control-panel', icon: <ShieldCheckIcon />, title: 'لوحة التحكم', description: 'إدارة المستخدمين ومنح الصلاحيات.' },
];

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  return (
    <div className="animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {views.map(({ view, icon, title, description }) => (
                <button
                    key={view}
                    onClick={() => onViewChange(view as View)}
                    className="group flex flex-col items-center justify-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 border-b-4 border-transparent hover:border-primary transition-all duration-300"
                >
                    <div className="text-primary mb-4 transition-transform duration-300 group-hover:scale-110">
                        {React.cloneElement(icon, { className: "h-12 w-12" })}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                </button>
            ))}
        </div>
    </div>
  );
};

export default Dashboard;