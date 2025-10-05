import React, { useState, useRef, useCallback } from 'react';
import { PlanItem } from '../types';
import { MONTHS } from '../constants';
import { getDomainColor } from '../colors';
import { PrintIcon, TrashIcon, UserGroupIcon } from './Icons';

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

    return {
      id: row['id'] || Date.now() + index,
      domain: row['المجال'] || 'غير محدد',
      objective: row['الهدف'] || 'غير محدد',
      indicator: row['المؤشر'] || 'غير محدد',
      evidence: row['الشاهد'] || row['الشواهد والأدلة'] || 'غير محدد',
      activity: row['النشاط'] || 'غير محدد',
      planned: planned,
      schedule: schedule,
      executed: row['المنفذ'] || 0,
      indicatorCount: row['عدد المؤشرات'] || null,
      weeklyExecution: [null, null, null, null], // Default value, not from supervisor plan
    };
  });
};

// Component to display a single supervisor's plan
const SupervisorPlanTable: React.FC<{ supervisorName: string; plan: PlanItem[] }> = ({ supervisorName, plan }) => {
  const groupedData = plan.reduce((acc, item) => {
    (acc[item.domain] = acc[item.domain] || []).push(item);
    return acc;
  }, {} as Record<string, PlanItem[]>);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
      <h3 className="text-xl font-bold p-4 bg-gray-100">{`خطة المشرف: ${supervisorName}`}</h3>
      <table className="w-full min-w-[1600px] text-sm text-right text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th scope="col" className="px-2 py-2 min-w-[180px]">المجال</th>
            <th scope="col" className="px-2 py-2 min-w-[250px]">الأهداف</th>
            <th scope="col" className="px-2 py-2 min-w-[250px]">الأنشطة</th>
            {MONTHS.map((month) => (
              <th key={month} scope="col" className="px-1 py-2 text-center">{month}</th>
            ))}
            <th scope="col" className="px-1 py-2">المخطط</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedData).map((domain) => (
            <React.Fragment key={domain}>
              {groupedData[domain].map((item, itemIndex) => {
                const colors = getDomainColor(domain);
                return (
                  <tr key={item.id} className={`border-b ${colors.bg}`}>
                    {itemIndex === 0 && (
                      <td rowSpan={groupedData[domain].length} className={`px-2 py-2 font-semibold align-top border-l ${colors.text} ${colors.border}`}>
                        {domain}
                      </td>
                    )}
                    <td className="px-2 py-2">{item.objective}</td>
                    <td className="px-2 py-2 font-medium">{item.activity}</td>
                    {item.schedule.map((value, index) => (
                      <td key={index} className="px-1 py-2 text-center font-mono">{value || ''}</td>
                    ))}
                    <td className="px-1 py-2 text-center font-bold">{item.planned || '-'}</td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main view component
interface SupervisorsViewProps {
  plans: { [key: string]: PlanItem[] };
  onUpdatePlans: (newPlans: { [key: string]: PlanItem[] }) => void;
}

const SupervisorsView: React.FC<SupervisorsViewProps> = ({ plans, onUpdatePlans }) => {
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
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
        
        // Use filename without extension as supervisor name
        const supervisorName = file.name.replace(/\.[^/.]+$/, "");

        const newPlans = { ...plans, [supervisorName]: parsedPlan };
        onUpdatePlans(newPlans);
        setSelectedSupervisor(supervisorName);

      } catch (err) {
        console.error("Error parsing Excel file:", err);
        setError('فشل في تحليل ملف Excel. يرجى التأكد من أن الملف بالتنسيق الصحيح.');
      } finally {
        setIsLoading(false);
        // Reset file input to allow re-uploading the same file
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

  const handleSelectSupervisor = (name: string) => {
    setSelectedSupervisor(name);
  };

  const handleDeleteSupervisor = (name: string) => {
    const newPlans = { ...plans };
    delete newPlans[name];
    onUpdatePlans(newPlans);
    if (selectedSupervisor === name) {
      setSelectedSupervisor(null);
    }
  };

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
                <span>طباعة خطة المشرف</span>
            </button>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 print:block hidden">
            {selectedSupervisor ? `خطة المشرف: ${selectedSupervisor}` : 'خطط المشرفين التربويين'}
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 no-print">
            <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-bold text-lg mb-3">قائمة المشرفين</h3>
                 <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".xlsx, .xls"
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
                           onClick={() => handleSelectSupervisor(name)}
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
          
          {/* Main Content */}
          <main className="flex-1">
            {selectedSupervisor ? (
              <div className="printable-content">
                 <SupervisorPlanTable supervisorName={selectedSupervisor} plan={plans[selectedSupervisor]} />
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
        }
      `}</style>
    </div>
  );
};

export default SupervisorsView;