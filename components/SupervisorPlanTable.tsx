import React from 'react';
import { PlanItem } from '../types';
import { MONTHS } from '../constants';
import { getDomainColor } from '../colors';
import { EditIcon, TrashIcon, PlusIcon } from './Icons';

interface SupervisorPlanTableProps {
  supervisorName: string;
  plan: PlanItem[];
  selectedMonthIndex: number;
  onAdd: () => void;
  onEdit: (item: PlanItem) => void;
  onDelete: (itemId: string) => void;
}

const SupervisorPlanTable: React.FC<SupervisorPlanTableProps> = ({ supervisorName, plan, selectedMonthIndex, onAdd, onEdit, onDelete }) => {
  const filteredPlan = plan.filter(item => 
    item.schedule[selectedMonthIndex] != null && item.schedule[selectedMonthIndex] > 0
  );

  const groupedData = filteredPlan.reduce((acc, item) => {
    (acc[item.domain] = acc[item.domain] || []).push(item);
    return acc;
  }, {} as Record<string, PlanItem[]>);

  const totalColumns = 6;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
      <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg">
        <h3 className="text-xl font-bold">{`خطة المشرف: ${supervisorName}`}</h3>
        <button
          onClick={onAdd}
          className="px-3 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 flex items-center gap-2"
        >
          <PlusIcon />
          <span>إضافة نشاط</span>
        </button>
      </div>
      <table className="w-full text-sm text-right text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th scope="col" className="px-2 py-2 w-[180px]">المجال</th>
            <th scope="col" className="px-2 py-2 w-[250px]">الأهداف</th>
            <th scope="col" className="px-2 py-2 w-[250px]">الأنشطة</th>
            <th scope="col" className="px-1 py-2 text-center bg-blue-200 text-blue-800">{MONTHS[selectedMonthIndex]}</th>
            <th scope="col" className="px-1 py-2">المخطط (الإجمالي)</th>
            <th scope="col" className="px-2 py-2">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {plan.length === 0 ? (
            <tr><td colSpan={totalColumns} className="text-center py-12 text-gray-500">لا توجد أنشطة في خطة هذا المشرف.</td></tr>
          ) : filteredPlan.length === 0 ? (
            <tr><td colSpan={totalColumns} className="text-center py-12 text-gray-500">لا توجد أنشطة مخططة لهذا الشهر.</td></tr>
          ) : (
            Object.keys(groupedData).map((domain) => (
              <React.Fragment key={domain}>
                {groupedData[domain].map((item, itemIndex) => {
                  const colors = getDomainColor(domain);
                  return (
                    <tr key={item.id} className={`border-b ${colors.bg} hover:bg-opacity-70`}>
                      {itemIndex === 0 && (
                        <td rowSpan={groupedData[domain].length} className={`px-2 py-2 font-semibold align-top border-l ${colors.text} ${colors.border}`}>
                          {domain}
                        </td>
                      )}
                      <td className="px-2 py-2">{item.objective}</td>
                      <td className="px-2 py-2 font-medium">{item.activity}</td>
                      <td className="px-1 py-2 text-center font-mono font-bold text-blue-700 bg-blue-100/50">
                        {item.schedule[selectedMonthIndex] || '-'}
                      </td>
                      <td className="px-1 py-2 text-center font-bold">{item.planned || '-'}</td>
                      <td className="px-2 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => onEdit(item)} className="text-primary hover:text-primary/80" title="تعديل النشاط">
                            <EditIcon />
                          </button>
                          <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700" title="حذف النشاط">
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SupervisorPlanTable;