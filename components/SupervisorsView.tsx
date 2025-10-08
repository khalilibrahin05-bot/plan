import React, { useState, useRef, useCallback, lazy, Suspense } from 'react';
import { PlanItem } from '../types';
import { MONTHS } from '../constants';
import { PrintIcon, TrashIcon, UserGroupIcon, TableIcon, DocumentReportIcon } from './Icons';
import SupervisorPlanTable from './SupervisorPlanTable';
import SupervisorReportView from './SupervisorReportView';
import LoadingSpinner from './LoadingSpinner';

const EditModal = lazy(() => import('./EditModal'));

// XLSX type declaration
declare const XLSX: any;

// Helper to parse the uploaded Excel file
const parseSupervisorPlan = (data: any[]): PlanItem[] => {
  return data.map((row, index) => {
    const schedule = MONTHS.map(month => {
      const val = row[month];
      return (val !== undefined && val !== null && val !== '') ? Number(val) : null;
    });

    const planned = schedule.reduce((sum, val) => sum + (val || 0), 0);
    const executed = row['المنفذ'] || 0; // Keep existing executed if available
    const weeklyExecution = row['المنفذ'] ? [executed, null, null, null] : [null, null, null, null]; // Simple distribution for existing data

    return {
      id: String(row['id'] || crypto.randomUUID()),
      domain: row['المجال'] || 'غير محدد',
      objective: row['الهدف'] || 'غير محدد',
      indicator: row['المؤشر'] || 'غير محدد',
      evidence: row['الشاهد'] || row['الشواهد والأدلة'] || 'غير محدد',
      activity: row['النشاط'] || 'غير محدد',
      planned: planned,
      schedule: schedule,
      executed: executed,
      indicatorCount: row['عدد المؤشرات'] || null,
      weeklyExecution: weeklyExecution,
    };
  });
};

// Main view component
interface SupervisorsViewProps {
  plans: { [key: string]: PlanItem[] };
  onUpdatePlans: (newPlans: { [key: string]: PlanItem[] }) => void;
  selectedMonthIndex: number;
  onUpdateSupervisorPlan: (supervisorName: string, updatedPlan: PlanItem[]) => void;
}

const SupervisorsView: React.FC<SupervisorsViewProps> = ({ plans, onUpdatePlans, selectedMonthIndex, onUpdateSupervisorPlan }) => {
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(Object.keys(plans)[0] || null);
  const [editingItem, setEditingItem] = useState<PlanItem | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [localView, setLocalView] = useState<'table' | 'report'>('table');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const parsedPlan = parseSupervisorPlan(jsonData);
        
        const supervisorName = file.name.replace(/\.[^/.]+$/, "");

        const newPlans = { ...plans, [supervisorName]: parsedPlan };
        onUpdatePlans(newPlans);
        setSelectedSupervisor(supervisorName);

      } catch (err) {
        console.error("Error parsing Excel file:", err);
        setError('فشل في تحليل ملف Excel. يرجى التأكد من أن الملف بالتنسيق الصحيح.');
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.onerror = () => {
        setError('فشل في قراءة الملف.');
        setIsLoading(false);
    }
    reader.readAsArrayBuffer(file);
  };

  const handleDeleteSupervisor = (name: string) => {
    if (window.confirm(`هل أنت متأكد من حذف خطة المشرف: ${name}؟`)) {
        const newPlans = { ...plans };
        delete newPlans[name];
        onUpdatePlans(newPlans);
        if (selectedSupervisor === name) {
          const remainingSupervisors = Object.keys(newPlans);
          setSelectedSupervisor(remainingSupervisors.length > 0 ? remainingSupervisors[0] : null);
        }
    }
  };
  
  const handleAddItem = useCallback(() => {
    if (!selectedSupervisor) return;
    const currentPlan = plans[selectedSupervisor];
    const defaultDomain = currentPlan.length > 0 ? currentPlan[0].domain : 'غير محدد';
    const newItem: PlanItem = {
      id: crypto.randomUUID(),
      domain: defaultDomain,
      objective: '',
      indicator: '',
      evidence: '',
      activity: '',
      planned: 0,
      schedule: Array(12).fill(null),
      executed: 0,
      indicatorCount: null,
      weeklyExecution: [null, null, null, null],
    };
    setEditingItem(newItem);
  }, [selectedSupervisor, plans]);

  const handleEditItem = useCallback((item: PlanItem) => {
    setEditingItem(item);
  }, []);

  const handleDeleteItem = useCallback((itemId: string) => {
    if (!selectedSupervisor) return;
    if (window.confirm('هل أنت متأكد من حذف هذا النشاط؟')) {
      const newPlans = { ...plans };
      const currentPlan = newPlans[selectedSupervisor];
      newPlans[selectedSupervisor] = currentPlan.filter(item => item.id !== itemId);
      onUpdatePlans(newPlans);
    }
  }, [selectedSupervisor, plans, onUpdatePlans]);

  const handleCloseModal = useCallback(() => {
    setEditingItem(null);
  }, []);

  const handleSaveItem = useCallback((updatedItem: PlanItem) => {
    if (!selectedSupervisor) return;

    const newPlans = { ...plans };
    const currentPlan = newPlans[selectedSupervisor];
    const itemExists = currentPlan.some(item => item.id === updatedItem.id);

    if (itemExists) {
      newPlans[selectedSupervisor] = currentPlan.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      );
    } else {
      newPlans[selectedSupervisor] = [...currentPlan, updatedItem];
    }
    
    // Recalculate planned total from schedule
    newPlans[selectedSupervisor] = newPlans[selectedSupervisor].map(item => ({
        ...item,
        planned: item.schedule.reduce((sum, val) => sum + (val || 0), 0)
    }));

    onUpdatePlans(newPlans);
    setEditingItem(null);
  }, [selectedSupervisor, plans, onUpdatePlans]);

  const handleWeeklyExecutionChange = useCallback((itemId: string, newWeeklyValues: (number | null)[]) => {
      if (!selectedSupervisor) return;
      const updatedPlan = plans[selectedSupervisor].map(item =>
          item.id === itemId
              ? { ...item, weeklyExecution: newWeeklyValues, executed: newWeeklyValues.reduce((s, v) => s + (v || 0), 0) }
              : item
      );
      onUpdateSupervisorPlan(selectedSupervisor, updatedPlan);
  }, [selectedSupervisor, plans, onUpdateSupervisorPlan]);


  const handlePrint = () => {
    window.print();
  };
  
  const supervisorNames = Object.keys(plans);

  return (
    <div id="report-view">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
        <div className="no-print flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <UserGroupIcon />
            <span>خطط المشرفين التربويين</span>
          </h2>
          {selectedSupervisor && (
             <button
                onClick={handlePrint}
                className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 flex items-center gap-2"
            >
                <PrintIcon />
                <span>طباعة</span>
            </button>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 print:block hidden">
            {selectedSupervisor ? `خطة المشرف: ${selectedSupervisor}` : 'خطط المشرفين التربويين'}
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-1/4 no-print">
            <div className="p-4 bg-gray-50 rounded-lg border sticky top-40">
                <h3 className="font-bold text-lg mb-3">قائمة المشرفين</h3>
                 <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={handleFileImport}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="w-full mb-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                    {isLoading ? 'جاري الاستيراد...' : 'استيراد خطة جديدة (Excel)'}
                </button>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                
                <ul className="space-y-2">
                    {supervisorNames.length === 0 && <li className="text-gray-500 text-sm">لم يتم استيراد أي خطط.</li>}
                    {supervisorNames.map(name => (
                       <li key={name} className="flex items-center justify-between group">
                         <button
                           onClick={() => setSelectedSupervisor(name)}
                           className={`w-full text-right p-2 rounded-md transition-colors ${selectedSupervisor === name ? 'bg-primary text-white font-bold' : 'hover:bg-primary/10'}`}
                         >
                           {name}
                         </button>
                         <button onClick={() => handleDeleteSupervisor(name)} className="p-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity" title={`حذف خطة ${name}`}>
                            <TrashIcon />
                         </button>
                       </li>
                    ))}
                </ul>
            </div>
          </aside>
          
          <main className="flex-1">
            {selectedSupervisor ? (
              <div>
                <div className="no-print flex items-center justify-center p-1 bg-gray-200 rounded-lg mb-4">
                  <button onClick={() => setLocalView('table')} className={`w-1/2 flex items-center justify-center gap-2 p-2 rounded-md font-semibold transition-colors ${localView === 'table' ? 'bg-white shadow text-primary' : 'text-gray-600'}`}>
                    <TableIcon className="h-5 w-5"/>
                    <span>عرض الخطة</span>
                  </button>
                  <button onClick={() => setLocalView('report')} className={`w-1/2 flex items-center justify-center gap-2 p-2 rounded-md font-semibold transition-colors ${localView === 'report' ? 'bg-white shadow text-primary' : 'text-gray-600'}`}>
                    <DocumentReportIcon className="h-5 w-5" />
                    <span>التقرير الشهري</span>
                  </button>
                </div>
                <div className="printable-content">
                  {localView === 'table' ? (
                     <SupervisorPlanTable
                        supervisorName={selectedSupervisor}
                        plan={plans[selectedSupervisor]}
                        selectedMonthIndex={selectedMonthIndex}
                        onAdd={handleAddItem}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                     />
                  ) : (
                     <SupervisorReportView
                        supervisorName={selectedSupervisor}
                        plan={plans[selectedSupervisor]}
                        selectedMonthIndex={selectedMonthIndex}
                        onWeeklyExecutionChange={handleWeeklyExecutionChange}
                     />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed">
                <p className="text-gray-500">
                  {supervisorNames.length > 0 ? 'اختر مشرفًا لعرض خطته، أو قم باستيراد خطة جديدة.' : 'قم باستيراد خطة مشرف للبدء.'}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        {editingItem && (
            <EditModal
                item={editingItem}
                isOpen={!!editingItem}
                onClose={handleCloseModal}
                onSave={handleSaveItem}
            />
        )}
      </Suspense>

       <style>{`
        @media print {
            .no-print { display: none !important; }
            .printable-content { display: block !important; }
            main { padding: 0 !important; margin: 0 !important; }
            #report-view { box-shadow: none !important; border: none !important; }
            aside { display: none !important; }
            .flex, .grid {
                page-break-inside: avoid;
            }
             .printing-active .no-print-when-item-printing {
                display: none !important;
            }
            .printing-active .printable-item:not(.is-printing) {
                display: none !important;
            }
        }
      `}</style>
    </div>
  );
};

export default SupervisorsView;