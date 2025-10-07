import React from 'react';
import { PlanItem } from '../types';
import { MONTHS } from '../constants';
import { getDomainColor } from '../colors';
import { EditIcon, TrashIcon, PlusIcon } from './Icons';

interface SupervisorPlanTableProps {
  supervisorName: string;
  plan: PlanItem[];
  onAdd: () => void;
  onEdit: (item: PlanItem) => void;
  onDelete: (itemId: number) => void;
}

const SupervisorPlanTable: React.FC<SupervisorPlanTableProps> = ({ supervisorName, plan, onAdd, onEdit, onDelete }) => {
  const groupedData = plan.reduce((acc, item) => {
    (acc[item.domain] = acc[item.domain] || []).push(item);
    return acc;
  }, {} as Record<string, PlanItem[]>);

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
            <th scope="col" className="px-2 py-2">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedData).map((domain) => (
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
                    {item.schedule.map((value, index) => (
                      <td key={index} className="px-1 py-2 text-center font-mono">{value || ''}</td>
                    ))}
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupervisorPlanTable;
