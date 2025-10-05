import React from 'react';
import { 
    TableIcon, 
    DocumentReportIcon, 
    CalendarReportIcon,
    ChecklistIcon, 
    BookOpenIcon,
    SparklesIcon,
    CalendarIcon,
    WrenchScrewdriverIcon,
    LibraryIcon,
    ChartPieIcon
} from './Icons';

type View = 'table' | 'report' | 'semester' | 'unified-glossary' | 'events' | 'tools' | 'follow-up' | 'ai-tools' | 'framework' | 'statistics';

interface ViewSwitcherProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const views = [
    { view: 'table', icon: <TableIcon />, title: 'القائمة الرئيسية' },
    { view: 'report', icon: <DocumentReportIcon />, title: 'التقرير الشهري' },
    { view: 'semester', icon: <CalendarReportIcon />, title: 'التقرير الفصلي' },
    { view: 'statistics', icon: <ChartPieIcon />, title: 'الإحصائيات' },
    { view: 'follow-up', icon: <ChecklistIcon />, title: 'متابعة البرمجة' },
    { view: 'framework', icon: <LibraryIcon />, title: 'الإطار المرجعي للإشراف' },
    { view: 'unified-glossary', icon: <BookOpenIcon />, title: 'القواميس' },
    { view: 'ai-tools', icon: <SparklesIcon />, title: 'أدوات الذكاء الاصطناعي' },
    { view: 'events', icon: <CalendarIcon />, title: 'المناسبات' },
    { view: 'tools', icon: <WrenchScrewdriverIcon />, title: 'أهم الأدوات' },
];

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  
  return (
    <div className="flex items-center space-x-1 space-x-reverse rounded-md bg-gray-200 p-1 flex-wrap justify-center">
      {views.map(({ view, icon, title }) => {
        const isActive = currentView === view;
        const baseClasses = "p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
        const activeClasses = "bg-blue-600 text-white shadow";
        const inactiveClasses = "bg-white text-gray-600 hover:bg-gray-100 hover:text-blue-600";
        
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