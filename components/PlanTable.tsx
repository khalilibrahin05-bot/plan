import React, { useEffect, useCallback } from 'react';
import { PlanItem, PrintSettings } from '../types';
import { MONTHS } from '../constants';
import { EditIcon } from './Icons';
import { getDomainColor } from '../colors';

interface PlanTableRowProps {
  item: PlanItem;
  isFirstInDomain: boolean;
  domainRowCount: number;
  domain: string;
  selectedMonthIndex: number;
  onEdit: (item: PlanItem) => void;
}

const PlanTableRow: React.FC<PlanTableRowProps> = React.memo(({
  item,
  isFirstInDomain,
  domainRowCount,
  domain,
  selectedMonthIndex,
  onEdit,
}) => {
  const colors = getDomainColor(domain);
  return (
    <tr
      className={`border-b ${colors.bg} ${colors.hoverBg} transition-colors duration-150`}
    >
      {isFirstInDomain && (
        <td
          rowSpan={domainRowCount}
          className={`px-2 py-2 font-semibold align-top border-l ${colors.text} ${colors.border} min-w-[180px] max-w-[180px]`}
        >
          {domain}
        </td>
      )}
      <td className="px-2 py-2 col-objective">{item.objective}</td>
      <td className="px-2 py-2 col-indicator">{item.indicator}</td>
      <td className="px-1 py-2 text-center font-bold col-indicator-count">{item.indicatorCount ?? '-'}</td>
      <td className="px-2 py-2 col-evidence">{item.evidence}</td>
      <td className="px-2 py-2 font-medium col-activity">{item.activity}</td>
      <td className="px-1 py-2 text-center font-bold col-planned">{item.planned || '-'}</td>
      {item.schedule.map((value, index) => {
        const isFirstSemesterPart = index < 4;
        let cellClasses = 'col-schedule';
        if (index === selectedMonthIndex) {
          cellClasses += ' bg-blue-200/50 text-blue-900 font-bold';
        } else if (isFirstSemesterPart) {
          cellClasses += ' bg-green-50 text-green-900 font-bold';
        } else {
          cellClasses += ' bg-orange-50 text-orange-900 font-bold';
        }
        return (
          <td
            key={index}
            className={`px-1 py-2 text-center font-mono transition-colors duration-300 ${cellClasses}`}
          >
            {value || ''}
          </td>
        );
      })}
      <td className="px-1 py-2 text-center font-bold text-green-700 col-executed">
        {item.executed || '-'}
      </td>
      <td className="px-2 py-2 text-center no-print">
        <button
          onClick={() => onEdit(item)}
          className="text-primary hover:text-primary/80 transition-transform duration-200 hover:scale-110"
          aria-label={`تعديل ${item.activity}`}
        >
          <EditIcon />
        </button>
      </td>
    </tr>
  );
});


interface PlanTableProps {
  data: PlanItem[];
  selectedMonthIndex: number;
  onEdit: (item: PlanItem) => void;
  printSettings: PrintSettings;
  isPrinting: boolean;
  onPrintComplete: () => void;
}

const PlanTable: React.FC<PlanTableProps> = ({ data, selectedMonthIndex, onEdit, printSettings, isPrinting, onPrintComplete }) => {
  const groupedData = data.reduce((acc, item) => {
    (acc[item.domain] = acc[item.domain] || []).push(item);
    return acc;
  }, {} as Record<string, PlanItem[]>);

  const handlePrint = useCallback(() => {
    const { orientation, columns } = printSettings;
    
    const style = document.createElement('style');
    style.id = 'print-style-sheet';
    style.innerHTML = `
        @media print {
            @page {
                size: ${orientation};
                margin: 0.7cm;
            }
            html {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            body {
                background-color: #fff !important;
                font-size: 10pt;
            }
            .col-objective { display: ${columns.objective ? 'table-cell' : 'none'} !important; }
            .col-indicator { display: ${columns.indicator ? 'table-cell' : 'none'} !important; }
            .col-indicator-count { display: ${columns.indicatorCount ? 'table-cell' : 'none'} !important; }
            .col-evidence { display: ${columns.evidence ? 'table-cell' : 'none'} !important; }
            .col-activity { display: ${columns.activity ? 'table-cell' : 'none'} !important; }
            .col-planned { display: ${columns.planned ? 'table-cell' : 'none'} !important; }
            .col-schedule { display: ${columns.schedule ? 'table-cell' : 'none'} !important; }
            .col-executed { display: ${columns.executed ? 'table-cell' : 'none'} !important; }
        }
    `;

    document.head.appendChild(style);
    
    setTimeout(() => {
        window.print();
    }, 250);

  }, [printSettings]);
  
  useEffect(() => {
    const handleAfterPrint = () => {
        const styleSheet = document.getElementById('print-style-sheet');
        if (styleSheet) {
            styleSheet.remove();
        }
    };
    
    window.addEventListener('afterprint', handleAfterPrint);
    
    return () => {
        window.removeEventListener('afterprint', handleAfterPrint);
        handleAfterPrint(); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    if (isPrinting) {
      handlePrint();
      onPrintComplete();
    }
  }, [isPrinting, onPrintComplete, handlePrint]);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
      <table className="w-full min-w-[1800px] text-sm text-right text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200 sticky top-0 z-10">
          <tr>
            <th scope="col" className="px-2 py-2 min-w-[180px]">المجال</th>
            <th scope="col" className="px-2 py-2 min-w-[250px] col-objective">الأهداف</th>
            <th scope="col" className="px-2 py-2 min-w-[250px] col-indicator">المؤشرات</th>
            <th scope="col" className="px-1 py-2 col-indicator-count">عدد المؤشرات</th>
            <th scope="col" className="px-2 py-2 min-w-[250px] col-evidence">الشواهد والأدلة</th>
            <th scope="col" className="px-2 py-2 min-w-[250px] col-activity">الأنشطة</th>
            <th scope="col" className="px-1 py-2 col-planned">المخطط</th>
            {MONTHS.map((month, index) => {
               const isFirstSemesterPart = index < 4;
               let monthBgClass = '';
               if (index === selectedMonthIndex) {
                   monthBgClass = 'bg-blue-200 text-blue-800';
               } else if (isFirstSemesterPart) {
                   monthBgClass = 'bg-green-100';
               } else {
                   monthBgClass = 'bg-orange-100';
               }
              return (
                <th
                  key={month}
                  scope="col"
                  className={`px-1 py-2 text-center transition-colors duration-300 col-schedule ${monthBgClass}`}
                >
                  {month}
                </th>
              );
            })}
            <th scope="col" className="px-1 py-2 col-executed">المنفذ</th>
            <th scope="col" className="px-2 py-2 no-print">تعديل</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={21} className="text-center py-12 text-gray-500 text-lg">
                لا توجد أنشطة تطابق بحثك.
              </td>
            </tr>
          ) : (
            Object.keys(groupedData).map((domain) => (
              <React.Fragment key={domain}>
                {groupedData[domain].map((item, itemIndex) => (
                   <PlanTableRow
                    key={item.id}
                    item={item}
                    isFirstInDomain={itemIndex === 0}
                    domainRowCount={groupedData[domain].length}
                    domain={domain}
                    selectedMonthIndex={selectedMonthIndex}
                    onEdit={onEdit}
                  />
                ))}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PlanTable;