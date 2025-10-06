import React, { useState, useEffect } from 'react';
import { User, UserPermissions } from '../types';
import { PlusIcon, TrashIcon, ShieldCheckIcon, SaveIcon, CheckIcon } from './Icons';

const USERS_STORAGE_KEY = 'educationalPlanUsers';

const defaultPermissions: UserPermissions = {
  canEditPlan: false,
  canPrintReports: true,
  canAccessAITools: false,
  canManageUsers: false,
};

const permissionLabels: Record<keyof UserPermissions, string> = {
  canEditPlan: 'تعديل الخطة',
  canPrintReports: 'طباعة التقارير',
  canAccessAITools: 'أدوات الذكاء الاصطناعي',
  canManageUsers: 'إدارة المستخدمين',
};

const ControlPanelView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserName, setNewUserName] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      } else {
        // Add a default admin user if none exist
        setUsers([{ id: 'admin-001', name: 'المدير العام', permissions: { canEditPlan: true, canPrintReports: true, canAccessAITools: true, canManageUsers: true } }]);
      }
    } catch (error) {
      console.error("Failed to load users from localStorage", error);
    }
  }, []);
  
  const saveUsers = (updatedUsers: User[]) => {
    setSaveStatus('saving');
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setTimeout(() => {
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 1500);
      }, 500);
    } catch (error) {
        console.error("Failed to save users to localStorage", error);
        setSaveStatus('idle');
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName.trim() === '') return;
    const newUser: User = {
      id: crypto.randomUUID(),
      name: newUserName.trim(),
      permissions: defaultPermissions,
    };
    saveUsers([...users, newUser]);
    setNewUserName('');
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === 'admin-001') {
        alert('لا يمكن حذف حساب المدير العام.');
        return;
    }
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا المستخدم؟")) {
      saveUsers(users.filter(user => user.id !== userId));
    }
  };

  const handlePermissionChange = (userId: string, permission: keyof UserPermissions, value: boolean) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        // Prevent admin from losing user management permissions
        if (user.id === 'admin-001' && permission === 'canManageUsers' && !value) {
            alert('لا يمكن إزالة صلاحية إدارة المستخدمين من المدير العام.');
            return user;
        }
        return { ...user, permissions: { ...user.permissions, [permission]: value } };
      }
      return user;
    });
    setUsers(updatedUsers); // Immediate UI update
  };
  
  const handleSaveAllChanges = () => {
    saveUsers(users);
  };

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <ShieldCheckIcon />
          <span>لوحة التحكم: إدارة المستخدمين والصلاحيات</span>
        </h2>
        <button
            onClick={handleSaveAllChanges}
            disabled={saveStatus !== 'idle'}
            className={`px-4 py-2 font-semibold rounded-md flex items-center gap-2 transition-colors ${saveStatus === 'saved' ? 'bg-green-600 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}
        >
             {saveStatus === 'idle' && <><SaveIcon /><span>حفظ التغييرات</span></>}
             {saveStatus === 'saving' && <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin"></div>}
             {saveStatus === 'saved' && <><CheckIcon /><span>تم الحفظ</span></>}
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-right text-gray-600 min-w-[800px]">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-4 py-3">اسم المستخدم</th>
              {Object.values(permissionLabels).map(label => <th key={label} className="px-4 py-3 text-center">{label}</th>)}
              <th className="px-4 py-3 text-center">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-800">{user.name}</td>
                {(Object.keys(permissionLabels) as (keyof UserPermissions)[]).map(key => (
                  <td key={key} className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={user.permissions[key]}
                      onChange={(e) => handlePermissionChange(user.id, key, e.target.checked)}
                      className="form-checkbox h-5 w-5 text-primary rounded"
                      aria-label={`${permissionLabels[key]} for ${user.name}`}
                    />
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                    disabled={user.id === 'admin-001'}
                    title={user.id === 'admin-001' ? 'لا يمكن حذف المدير' : 'حذف المستخدم'}
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleAddUser} className="mt-6 p-4 bg-gray-50 rounded-lg border flex items-center gap-4">
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          placeholder="اسم المستخدم الجديد"
          className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
          required
        />
        <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 flex items-center gap-2">
          <PlusIcon />
          <span>إضافة مستخدم</span>
        </button>
      </form>
    </div>
  );
};

export default ControlPanelView;
