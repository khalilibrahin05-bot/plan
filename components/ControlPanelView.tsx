import React, { useState, useEffect } from 'react';
import { User, UserPermissions } from '../types';
import { PlusIcon, TrashIcon, ShieldCheckIcon, SaveIcon, CheckIcon, KeyIcon } from './Icons';

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

// Generates a simple, random password for one-time use
const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

const ControlPanelView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserName, setNewUserName] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [passwordsToPrint, setPasswordsToPrint] = useState<Record<string, string> | null>(null);

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
  
  // Effect to trigger print dialog after state update
  useEffect(() => {
    if (passwordsToPrint) {
      // Timeout allows React to re-render the DOM with the passwords before printing
      setTimeout(() => {
        window.print();
        setPasswordsToPrint(null); // Reset after printing
      }, 100);
    }
  }, [passwordsToPrint]);

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
        if (user.id === 'admin-001' && permission === 'canManageUsers' && !value) {
            alert('لا يمكن إزالة صلاحية إدارة المستخدمين من المدير العام.');
            return user;
        }
        return { ...user, permissions: { ...user.permissions, [permission]: value } };
      }
      return user;
    });
    setUsers(updatedUsers);
  };
  
  const handleSaveAllChanges = () => {
    saveUsers(users);
  };
  
  const handlePrintCredentials = () => {
    if (window.confirm("سيتم إنشاء كلمات مرور جديدة ومؤقتة لجميع المستخدمين لغرض الطباعة فقط. هل تريد المتابعة؟")) {
        const newPasswords: Record<string, string> = {};
        users.forEach(user => {
            newPasswords[user.id] = generatePassword();
        });
        setPasswordsToPrint(newPasswords);
    }
  };


  return (
    <div id="control-panel-view">
        <div className="non-printable">
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b gap-4">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <ShieldCheckIcon />
                    <span>لوحة التحكم: إدارة المستخدمين والصلاحيات</span>
                    </h2>
                    <div className="flex items-center gap-2">
                         <button
                            onClick={handlePrintCredentials}
                            className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 flex items-center gap-2"
                        >
                            <KeyIcon /><span>طباعة كلمات المرور</span>
                        </button>
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
        </div>

        {passwordsToPrint && (
            <div className="printable-only">
                <h2 className="report-title">كلمات المرور المؤقتة للمستخدمين</h2>
                <p className="report-subtitle">هذه الكلمات للاستخدام الأولي فقط ويجب تغييرها عند أول تسجيل دخول.</p>
                <table className="credentials-table">
                    <thead>
                        <tr>
                            <th>اسم المستخدم</th>
                            <th>كلمة المرور المؤقتة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td className="password-cell">{passwordsToPrint[user.id]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        <style>{`
            .printable-only { display: none; }
            @media print {
                body > #root > div > .no-print { display: none !important; }
                #control-panel-view .non-printable { display: none !important; }
                #control-panel-view .printable-only { display: block !important; }
                
                .report-title {
                    font-size: 20pt;
                    text-align: center;
                    margin-bottom: 1rem;
                    font-weight: bold;
                }
                .report-subtitle {
                    font-size: 11pt;
                    text-align: center;
                    margin-bottom: 1.5rem;
                    color: #555;
                }
                .credentials-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 12pt;
                }
                .credentials-table th, .credentials-table td {
                    border: 1px solid #ccc;
                    padding: 10px;
                    text-align: right;
                }
                .credentials-table th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                }
                 .password-cell {
                    text-align: center;
                    font-family: monospace, sans-serif;
                    font-size: 14pt;
                    font-weight: bold;
                    letter-spacing: 1px;
                }
            }
        `}</style>

    </div>
  );
};

export default ControlPanelView;