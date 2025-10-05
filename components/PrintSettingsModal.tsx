import React, { useState, useEffect, useMemo } from 'react';
import { PrintSettings, ColumnPrintSettings } from '../types';
import { CloseIcon } from './Icons';

interface PrintSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: PrintSettings) => void;
  currentSettings: PrintSettings;
}

const columnLabels: Record<keyof ColumnPrintSettings, string> = {
    objective: 'الأهداف',
    indicator: 'المؤشرات',
    indicatorCount: 'عدد المؤشرات',
    evidence: 'الشواهد والأدلة',
    activity: 'الأنشطة',
    planned: 'المخطط',
    schedule: 'الجدول الشهري',
    executed: 'المنفذ',
};

const PrintSettingsModal: React.FC<PrintSettingsModalProps> = ({ isOpen, onClose, onSave, currentSettings }) => {
  const [settings, setSettings] = useState<PrintSettings>(currentSettings);

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings, isOpen]);

  if (!isOpen) {
    return null;
  }
  
  const handleColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
        ...prev,
        columns: {
            ...prev.columns,
            [name]: checked
        }
    }));
  };

  const handleOrientationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
        ...prev,
        orientation: e.target.value as 'portrait' | 'landscape'
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
  };

  const columnKeys = useMemo(() => Object.keys(columnLabels) as (keyof ColumnPrintSettings)[], []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">إعدادات الطباعة</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <CloseIcon />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} id="print-settings-form" className="flex-grow overflow-y-auto p-6 space-y-6">
          
          {/* Orientation Settings */}
          <fieldset>
            <legend className="block text-lg font-medium text-gray-700 mb-2">اتجاه الصفحة</legend>
            <div className="flex items-center space-x-4 space-x-reverse">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="orientation"
                  value="landscape"
                  checked={settings.orientation === 'landscape'}
                  onChange={handleOrientationChange}
                  className="form-radio text-blue-600"
                />
                <span className="mr-2 text-gray-700">أفقي (Landscape)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="orientation"
                  value="portrait"
                  checked={settings.orientation === 'portrait'}
                  onChange={handleOrientationChange}
                  className="form-radio text-blue-600"
                />
                <span className="mr-2 text-gray-700">عمودي (Portrait)</span>
              </label>
            </div>
          </fieldset>

          {/* Column Visibility Settings */}
          <fieldset>
            <legend className="block text-lg font-medium text-gray-700 mb-2">الأعمدة المطلوب طباعتها</legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {columnKeys.map(key => (
                <label key={key} className="flex items-center p-2 bg-gray-50 rounded-md border">
                  <input
                    type="checkbox"
                    name={key}
                    checked={settings.columns[key]}
                    onChange={handleColumnChange}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                  />
                  <span className="mr-3 text-gray-800">{columnLabels[key]}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </form>

        <div className="flex justify-end items-center p-4 border-t bg-gray-50 rounded-b-lg">
          <button type="button" onClick={onClose} className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            إلغاء
          </button>
          <button type="submit" form="print-settings-form" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            حفظ الإعدادات
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintSettingsModal;
