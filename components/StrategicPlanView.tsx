import React from 'react';
import { PlanItem } from '../types';
import { MONTHS } from '../constants';
import { getDomainColor } from '../colors';
import { EditIcon, TrashIcon, PlusIcon, PrintIcon, KeyIcon } from './Icons';

interface StrategicPlanViewProps {
  data: PlanItem[];
  onAdd: () => void;
  onEdit: (item: PlanItem) => void;
  onDelete: (itemId: string) => void;
}

const StrategicPlanView: React.FC<StrategicPlanViewProps> = ({ data, onAdd, onEdit, onDelete }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="report-view" className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
        <div className="no-print flex justify-between items-center mb-6 pb-4 border-b">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <KeyIcon />
                <span>الخطة الاستراتيجية</span>
            </h2>
            <div className="flex items-center gap-2">
                 <button onClick={onAdd} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 flex items-center gap-2">
                    <PlusIcon /> <span>إضافة مبادرة</span>
                </button>
                <button onClick={handlePrint} className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 flex items-center gap-2">
                    <PrintIcon /> <span>طباعة</span>
                </button>
            </div>
        </div>
         <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 print:block hidden">
            الخطة الاستراتيجية
        </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[2000px] text-sm text-right text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th scope="col" className="px-2 py-3 w-[250px]">الهدف الاستراتيجي</th>
              <th scope="col" className="px-2 py-3 w-[150px]">المؤشر</th>
              <th scope="col" className="px-2 py-3 w-[250px]">المبادرة (النشاط)</th>
              {MONTHS.map(month => <th key={month} scope="col" className="px-1 py-3 text-center w-[50px]">{month}</th>)}
              <th scope="col" className="px-1 py-3 text-center w-[70px]">المخطط</th>
              <th scope="col" className="px-1 py-3 text-center w-[70px]">المنفذ</th>
              <th scope="col" className="px-2 py-3 w-[100px] no-print">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={17} className="text-center py-12 text-gray-500">
                  لا توجد مبادرات في الخطة الاستراتيجية.
                </td>
              </tr>
            ) : (
              data.map(item => {
                const colors = getDomainColor(item.domain);
                return (
                  <tr key={item.id} className={`border-b ${colors.bg} hover:bg-opacity-70`}>
                    <td className="px-2 py-2">{item.objective}</td>
                    <td className="px-2 py-2">{item.indicator}</td>
                    <td className="px-2 py-2 font-medium">{item.activity}</td>
                    {item.schedule.map((value, index) => (
                      <td key={index} className="px-1 py-2 text-center font-mono">
                        {value || ''}
                      </td>
                    ))}
                    <td className="px-1 py-2 text-center font-bold">{item.planned || '-'}</td>
                    <td className="px-1 py-2 text-center font-bold text-green-700">{item.executed || '-'}</td>
                    <td className="px-2 py-2 text-center no-print">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => onEdit(item)} className="text-primary hover:text-primary/80" title="تعديل المبادرة">
                          <EditIcon />
                        </button>
                        <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700" title="حذف المبادرة">
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StrategicPlanView;
