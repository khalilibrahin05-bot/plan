import React, { useState, useEffect } from 'react';
import { PlanItem } from '../types';
import { MONTHS } from '../constants';
import { CloseIcon } from './Icons';

interface EditModalProps {
  item: PlanItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PlanItem) => void;
}

const EditModal: React.FC<EditModalProps> = ({ item, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<PlanItem>(item);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleScheduleChange = (index: number, value: string) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = value === '' ? null : Number(value);
    setFormData(prev => ({ ...prev, schedule: newSchedule }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">تعديل النشاط</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <CloseIcon />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} id="edit-form" className="flex-grow overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">النشاط</label>
            <input type="text" name="activity" value={formData.activity} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">المؤشرات</label>
            <textarea name="indicator" value={formData.indicator} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">المخطط</label>
              <input type="number" name="planned" value={formData.planned ?? ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">عدد المؤشرات</label>
              <input type="number" name="indicatorCount" value={formData.indicatorCount ?? ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الجدول الشهري</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {MONTHS.map((month, index) => (
                <div key={index}>
                  <label htmlFor={`month-${index}`} className="block text-xs text-gray-600">{month}</label>
                  <input
                    id={`month-${index}`}
                    type="number"
                    value={formData.schedule[index] ?? ''}
                    onChange={(e) => handleScheduleChange(index, e.target.value)}
                    className="mt-1 block w-full text-center rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="flex justify-end items-center p-4 border-t bg-gray-50 rounded-b-lg">
          <button type="button" onClick={onClose} className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            إلغاء
          </button>
          <button type="submit" form="edit-form" onClick={handleSubmit} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;