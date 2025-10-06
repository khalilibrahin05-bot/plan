import React from 'react';
import { 
    TableIcon, 
    DocumentReportIcon, 
    CalendarReportIcon,
    DocumentTextIcon,
    ChecklistIcon, 
    BookOpenIcon,
    SparklesIcon,
    CalendarIcon,
    WrenchScrewdriverIcon,
    LibraryIcon,
    ChartPieIcon,
    UserGroupIcon,
    ShieldCheckIcon
} from './Icons';
import { View } from '../App';


interface ViewSwitcherProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const views = [
    { view: 'table', icon: <TableIcon />, title: 'القائمة الرئيسية' },
    { view: 'report', icon: <DocumentReportIcon />, title: 'التقرير الشهري' },
    { view: 'semester', icon: <CalendarReportIcon />, title: 'التقرير الفصلي' },
    { view: 'summary', icon: <DocumentTextIcon />, title: 'خلاصة التقارير' },
    { view: 'statistics', icon: <ChartPieIcon />, title: 'الإحصائيات' },
    { view: 'follow-up', icon: <ChecklistIcon />, title: 'متابعة البرمجة' },
    { view: 'supervisors', icon: <UserGroupIcon />, title: 'خطط المشرفين' },
    { view: 'framework', icon: <LibraryIcon />, title: 'الإطار المرجعي للإشراف' },
    { view: 'unified-glossary', icon: <BookOpenIcon />, title: 'القواميس' },
    { view: 'ai-tools', icon: <SparklesIcon />, title: 'أدوات الذكاء الاصطناعي' },
    { view: 'events', icon: <CalendarIcon />, title: 'المناسبات' },
    { view: 'tools', icon: <WrenchScrewdriverIcon />, title: 'أهم الأدوات' },
    { view: 'control-panel', icon: <ShieldCheckIcon />, title: 'لوحة التحكم' },
];

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  
  return (
    <div className="flex items-center space-x-1 space-x-reverse rounded-md bg-gray-200 p-1 flex-wrap justify-center">
      {views.map(({ view, icon, title }) => {
        const isActive = currentView === view;
        const baseClasses = "p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";
        const activeClasses = "bg-primary text-white shadow";
        const inactiveClasses = "bg-white text-gray-600 hover:bg-gray-100 hover:text-primary";
        
        return (
          <button
            key={view}
            title={title}
            onClick={() => onViewChange(view as View)}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            aria-pressed={isActive}
            aria-label={title}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
};

export default ViewSwitcher;