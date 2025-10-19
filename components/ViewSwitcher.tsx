import React, { useState, useRef, useEffect } from 'react';
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
    ShieldCheckIcon,
    ChevronDownIcon,
    KeyIcon
} from './Icons';
import { View } from '../App';


interface ViewSwitcherProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const allViews = [
    { view: 'table', icon: <TableIcon />, title: 'القائمة الرئيسية' },
    { view: 'report', icon: <DocumentReportIcon />, title: 'التقرير الشهري' },
    { view: 'semester', icon: <CalendarReportIcon />, title: 'التقرير الفصلي' },
    { view: 'summary', icon: <DocumentTextIcon />, title: 'خلاصة التقارير' },
    { view: 'statistics', icon: <ChartPieIcon />, title: 'الإحصائيات' },
    { view: 'follow-up', icon: <ChecklistIcon />, title: 'متابعة البرمجة' },
    { view: 'supervisors', icon: <UserGroupIcon />, title: 'خطط المشرفين' },
    { view: 'strategic-plan', icon: <KeyIcon />, title: 'الخطة الاستراتيجية' },
    { view: 'framework', icon: <LibraryIcon />, title: 'الإطار المرجعي للإشراف' },
    { view: 'unified-glossary', icon: <BookOpenIcon />, title: 'القواميس' },
    { view: 'ai-tools', icon: <SparklesIcon />, title: 'أدوات الذكاء الاصطناعي' },
    { view: 'events', icon: <CalendarIcon />, title: 'المناسبات' },
    { view: 'tools', icon: <WrenchScrewdriverIcon />, title: 'أهم الأدوات' },
    { view: 'control-panel', icon: <ShieldCheckIcon />, title: 'لوحة التحكم' },
];

const primaryViews = ['table', 'report', 'summary', 'statistics'];
const primaryViewData = allViews.filter(v => primaryViews.includes(v.view));
const secondaryViewData = allViews.filter(v => !primaryViews.includes(v.view));


const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);
  
  return (
    <div className="flex items-center space-x-1 space-x-reverse rounded-md bg-gray-200 p-1 flex-wrap justify-center">
      {primaryViewData.map(({ view, icon, title }) => {
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
      
      {/* Dropdown for secondary views */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(prev => !prev)}
          className="flex items-center gap-1 p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary bg-white text-gray-600 hover:bg-gray-100 hover:text-primary"
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
        >
          <span>المزيد</span>
          <ChevronDownIcon className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    {secondaryViewData.map(({ view, icon, title }) => (
                        <button
                            key={view}
                            onClick={() => {
                                onViewChange(view as View);
                                setIsDropdownOpen(false);
                            }}
                            className={`w-full text-right flex items-center gap-3 px-4 py-2 text-sm ${currentView === view ? 'bg-gray-100 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                            role="menuitem"
                        >
                            {React.cloneElement(icon, { className: "h-5 w-5" })}
                            <span>{title}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}
      </div>

    </div>
  );
};

export default ViewSwitcher;