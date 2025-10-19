import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PlanItem } from '../types';
import { MONTHS, HIJRI_TO_GREGORIAN_MAP } from '../constants';
import { eventsData } from '../events';
import { getDomainColor } from '../colors';
import { EditIcon, PrintIcon, PlusIcon, ChevronDownIcon } from './Icons';

interface CalendarViewProps {
  mainPlan: PlanItem[];
  supervisorsPlans: { [key: string]: PlanItem[] };
  selectedMonthIndex: number;
  onEdit: (item: PlanItem, planName: string) => void;
  onAdd: (domain: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ mainPlan, supervisorsPlans, selectedMonthIndex, onEdit, onAdd }) => {
  const gregorianMap = HIJRI_TO_GREGORIAN_MAP[selectedMonthIndex];
  const year = gregorianMap.year;
  const month = gregorianMap.month - 1; // JS months are 0-indexed

  const [selectedPlanName, setSelectedPlanName] = useState<string>('main_plan');
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);
  const addDropdownRef = useRef<HTMLDivElement>(null);

  const uniqueDomains = useMemo(() => {
      const domains = new Set(mainPlan.map(item => item.domain));
      return Array.from(domains);
  }, [mainPlan]);

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (addDropdownRef.current && !addDropdownRef.current.contains(event.target as Node)) {
              setIsAddDropdownOpen(false);
          }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleAddClick = (domain: string) => {
    onAdd(domain);
    setIsAddDropdownOpen(false);
  };

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ key: `empty-${i}`, day: null });
  }
  // Add cells for each day of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ key: `day-${i}`, day: i });
  }

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const currentDay = today.getDate();

  const daysOfWeek = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  
  const currentPlanData = useMemo(() => {
    if (selectedPlanName === 'main_plan') {
        return mainPlan;
    }
    return supervisorsPlans[selectedPlanName] || [];
  }, [selectedPlanName, mainPlan, supervisorsPlans]);

  const activitiesForMonth = currentPlanData.filter(item => item.schedule[selectedMonthIndex] && item.schedule[selectedMonthIndex]! > 0);
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="report-view" className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 animate-fade-in">
      <div className="no-print flex flex-col md:flex-row justify-between items-center mb-6 pb-4 border-b dark:border-gray-700 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            تقويم شهر {MONTHS[selectedMonthIndex]} {year}م
        </h2>
        <div className="flex items-center gap-4 flex-wrap justify-center">
             <select
                value={selectedPlanName}
                onChange={(e) => setSelectedPlanName(e.target.value)}
                className="block w-full md:w-56 px-3 py-2 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
             >
                <option value="main_plan">خطة القسم الرئيسية</option>
                {Object.keys(supervisorsPlans).map(name => (
                    <option key={name} value={name}>{name}</option>
                ))}
            </select>
            <div className="relative" ref={addDropdownRef}>
                <button
                    onClick={() => setIsAddDropdownOpen(prev => !prev)}
                    disabled={selectedPlanName !== 'main_plan'}
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    title={selectedPlanName !== 'main_plan' ? 'يمكن إضافة الأنشطة للخطة الرئيسية فقط' : 'إضافة نشاط'}
                >
                    <PlusIcon />
                    <span>إضافة نشاط</span>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${isAddDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isAddDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-700 ring-opacity-5 z-10 max-h-60 overflow-y-auto">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                            {uniqueDomains.map(domain => (
                                <button
                                    key={domain}
                                    onClick={() => handleAddClick(domain)}
                                    className="w-full text-right block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    role="menuitem"
                                >
                                    {domain}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <button
                onClick={handlePrint}
                className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 flex items-center gap-2"
            >
                <PrintIcon />
                <span>طباعة</span>
            </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center mb-6 print:block hidden">
        تقويم شهر {MONTHS[selectedMonthIndex]} {year}م
      </h2>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm break-inside-avoid">
        {daysOfWeek.map(day => (
          <div key={day} className="font-bold text-gray-600 dark:text-gray-300 py-2">{day}</div>
        ))}
        {calendarDays.map(({ key, day }) => {
          if (!day) {
            return <div key={key} className="border rounded-md dark:border-gray-700/50"></div>;
          }
          const isToday = isCurrentMonth && day === currentDay;
          const dayEvents = eventsData.filter(e => e.month === gregorianMap.month && e.day === day);

          return (
            <div key={key} className={`border rounded-md dark:border-gray-700/50 min-h-[100px] p-2 flex flex-col relative transition-colors ${isToday ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-400' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
              <div className={`font-bold ${isToday ? 'text-blue-700 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300'}`}>{day}</div>
              <div className="mt-1 space-y-1 overflow-y-auto text-xs flex-grow">
                {dayEvents.map(event => (
                  <div key={event.name} title={event.description} className="p-1 rounded bg-yellow-100 text-yellow-800 border border-yellow-300 text-right">
                    🔔 {event.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Activities List */}
      <div className="mt-8 pt-6 border-t dark:border-gray-700 break-before-page">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            الأنشطة المخططة لشهر {MONTHS[selectedMonthIndex]} ({selectedPlanName === 'main_plan' ? 'خطة القسم' : selectedPlanName})
        </h3>
        {activitiesForMonth.length > 0 ? (
          <div className="space-y-4">
            {activitiesForMonth.map(item => {
              const colors = getDomainColor(item.domain);
              return (
                <div key={item.id} className={`p-4 rounded-lg flex items-center justify-between gap-4 border-r-4 ${colors.border} ${colors.bg} break-inside-avoid`}>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-100">{item.activity}</p>
                    <p className={`text-sm font-semibold ${colors.text}`}>{item.domain}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">المخطط</p>
                      <p className="font-bold text-lg text-primary">{item.schedule[selectedMonthIndex]}</p>
                    </div>
                    <button
                      onClick={() => onEdit(item, selectedPlanName)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors no-print"
                      aria-label={`تعديل ${item.activity}`}
                    >
                      <EditIcon />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">لا توجد أنشطة مخططة لهذه الخطة في هذا الشهر.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;