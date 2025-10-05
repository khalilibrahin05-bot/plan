import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PlanItem } from '../types';
import { SaveIcon, PrintIcon, ShareIcon } from './Icons';
import { HIJRI_TO_GREGORIAN_MAP } from '../constants';
import { eventsData, CalendarEvent } from '../events';

interface WeeklyTrackerProps {
  item: PlanItem;
  monthIndex: number;
  monthName: string;
  onExecutionChange: (newWeeklyValues: (number | null)[]) => void;
  onPrint: () => void;
}

const WeeklyTracker: React.FC<WeeklyTrackerProps> = ({ item, monthIndex, monthName, onExecutionChange, onPrint }) => {
  const [weeklyPlan, setWeeklyPlan] = useState<number[]>([]);
  const [weeklyExec, setWeeklyExec] = useState<(number | null)[]>(item.weeklyExecution);
  const [isSaving, setIsSaving] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const draggedItemIndex = useRef<number | null>(null);
  
  useEffect(() => {
    const plannedForMonth = item.schedule[monthIndex] || 0;
    const basePlan = Math.floor(plannedForMonth / 4);
    const remainder = plannedForMonth % 4;
    const newDistributedPlan = [basePlan, basePlan, basePlan, basePlan];
    for (let i = 0; i < remainder; i++) {
        newDistributedPlan[i]++;
    }
    setWeeklyPlan(newDistributedPlan);
  }, [item.schedule, monthIndex]);

  useEffect(() => {
    setWeeklyExec(item.weeklyExecution);
  }, [item.weeklyExecution]);

  const weeklyEvents = useMemo(() => {
    const gregorianDate = HIJRI_TO_GREGORIAN_MAP[monthIndex];
    if (!gregorianDate) return [];

    const monthEvents = eventsData.filter(e => e.month === gregorianDate.month);
    
    const eventsPerWeek: CalendarEvent[][] = [[], [], [], []];

    monthEvents.forEach(event => {
        if (event.day >= 1 && event.day <= 7) {
            eventsPerWeek[0].push(event);
        } else if (event.day >= 8 && event.day <= 14) {
            eventsPerWeek[1].push(event);
        } else if (event.day >= 15 && event.day <= 21) {
            eventsPerWeek[2].push(event);
        } else if (event.day >= 22 && event.day <= 31) {
            eventsPerWeek[3].push(event);
        }
    });

    return eventsPerWeek;
  }, [monthIndex]);


  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (weeklyPlan[index] > 0) {
        draggedItemIndex.current = index;
        e.dataTransfer.effectAllowed = 'move';
    } else {
        e.preventDefault();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (index !== draggedItemIndex.current) {
        setDragOverIndex(index);
    }
  };
  
  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    const sourceIndex = draggedItemIndex.current;
    if (sourceIndex !== null && sourceIndex !== targetIndex) {
        setWeeklyPlan(currentPlan => {
            const newPlan = [...currentPlan];
            if (newPlan[sourceIndex] > 0) {
                newPlan[sourceIndex]--;
                newPlan[targetIndex]++;
            }
            return newPlan;
        });
    }
    draggedItemIndex.current = null;
  };

  const handleInputChange = (weekIndex: number, value: string) => {
    const newWeeklyValues = [...weeklyExec];
    const numValue = value === '' ? null : parseInt(value, 10);
    
    if (numValue === null || (!isNaN(numValue) && numValue >= 0)) {
       newWeeklyValues[weekIndex] = numValue;
       setWeeklyExec(newWeeklyValues);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    onExecutionChange(weeklyExec);
    setTimeout(() => setIsSaving(false), 1000);
  };
  
  const handleShare = async () => {
      const totalExecuted = weeklyExec.reduce((acc, val) => acc + (val || 0), 0);
      const plannedForMonth = item.schedule[monthIndex] || 0;
      const executionPercentage = plannedForMonth > 0 ? (totalExecuted / plannedForMonth) * 100 : 0;
      const shareText = `تقرير أداء النشاط: ${item.activity}\nالشهر: ${monthName}\nنسبة الإنجاز: ${executionPercentage.toFixed(0)}% (${totalExecuted}/${plannedForMonth})`;
      
      if (navigator.share) {
          try {
              await navigator.share({
                  title: 'تقرير أداء النشاط',
                  text: shareText,
              });
          } catch (error) {
              console.error('Error sharing:', error);
          }
      } else {
          try {
              await navigator.clipboard.writeText(shareText);
              alert('تم نسخ التقرير إلى الحافظة!');
          } catch (err) {
              console.error('Failed to copy: ', err);
          }
      }
  };

  const totalExecuted = weeklyExec.reduce((acc, val) => acc + (val || 0), 0);
  const plannedForMonth = item.schedule[monthIndex] || 0;
  const executionPercentage = plannedForMonth > 0 ? (totalExecuted / plannedForMonth) * 100 : 0;

  return (
    <div className="bg-gray-50 p-4 rounded-lg border shadow-sm">
      <div className="grid grid-cols-4 gap-2 text-center text-lg">
        {[1, 2, 3, 4].map(week => (
          <div key={`header-${week}`} className="text-sm font-bold text-gray-600 mb-2">الأسبوع {week}</div>
        ))}

        {weeklyPlan.map((plan, index) => (
          <div 
            key={`plan-${index}`} 
            className={`p-3 rounded-md transition-colors ${dragOverIndex === index ? 'bg-blue-200' : 'bg-green-100'}`}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className="text-xs text-gray-500">المخطط</div>
            <div 
              className={`font-bold text-2xl text-gray-800 ${plan > 0 ? 'cursor-move' : ''}`}
              draggable={plan > 0}
              onDragStart={(e) => handleDragStart(e, index)}
             >
                {plan}
             </div>
          </div>
        ))}

        {weeklyExec.map((exec, index) => (
          <div key={`exec-${index}`}>
             <label htmlFor={`exec-input-${item.id}-${index}`} className="text-xs text-gray-500 sr-only">المنفذ للأسبوع {index + 1}</label>
             <input
                id={`exec-input-${item.id}-${index}`}
                type="number"
                min="0"
                value={exec ?? ''}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-full h-full p-3 text-center font-bold text-2xl border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="-"
             />
          </div>
        ))}
        {[0, 1, 2, 3].map(index => (
            <div key={`events-${index}`} className="mt-1 min-h-[3rem] space-y-1">
                {weeklyEvents[index]?.map(event => (
                    <div 
                        key={event.name}
                        title={`${event.day}/${event.month}`}
                        className="text-xs p-1 rounded bg-yellow-100 text-yellow-800 border border-yellow-300 animate-pulse-slow"
                    >
                        🔔 {event.name}
                    </div>
                ))}
            </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t flex justify-between items-center">
         <div className="flex items-center gap-2">
            <button onClick={handleSave} className={`p-2 rounded-full transition-colors ${isSaving ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`} aria-label="حفظ التنفيذ">
                <SaveIcon />
            </button>
             <button onClick={onPrint} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" aria-label="طباعة النشاط">
                <PrintIcon />
            </button>
             <button onClick={handleShare} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" aria-label="مشاركة النشاط">
                <ShareIcon />
            </button>
         </div>
         <div className="text-sm font-semibold text-gray-700">
            نسبة الإنجاز: 
            <span className={`font-bold text-xl ml-2 ${executionPercentage >= 80 ? 'text-green-600' : executionPercentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {executionPercentage.toFixed(0)}%
            </span>
            <span className="text-xs text-gray-500">({totalExecuted}/{plannedForMonth})</span>
         </div>
      </div>
    </div>
  );
};

export default WeeklyTracker;