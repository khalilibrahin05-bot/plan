
import React, { useState, useEffect, useRef } from 'react';
import { User, UserPermissions } from '../types';
import { PlusIcon, TrashIcon, ShieldCheckIcon, SaveIcon, CheckIcon, KeyIcon, ImportIcon, StarIcon } from './Icons';

// XLSX type declaration for global script
declare const XLSX: any;

const USERS_STORAGE_KEY = 'educationalPlanUsers';
const LOGO_STORAGE_KEY = 'educationalPlanLogo';

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

const calculateAverageRating = (ratings: number[]): number => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return sum / ratings.length;
};

const ControlPanelView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserName, setNewUserName] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [passwordsToPrint, setPasswordsToPrint] = useState<{ passwords: Record<string, string>; logo: string | null } | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const importFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        // Ensure backward compatibility for users without a ratings field
        const usersWithRatings = parsedUsers.map((user: Omit<User, 'ratings'> & { ratings?: number[] }) => ({
            ...user,
            ratings: user.ratings || [],
        }));
        setUsers(usersWithRatings);
      } else {
        setUsers([{ id: 'admin-001', name: 'المدير العام', permissions: { canEditPlan: true, canPrintReports: true, canAccessAITools: true, canManageUsers: true }, ratings: [] }]);
      }
    } catch (error) {
      console.error("Failed to load users from localStorage", error);
    }
  }, []);
  
  useEffect(() => {
    if (passwordsToPrint) {
      setTimeout(() => {
        window.print();
        setPasswordsToPrint(null);
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
  
  const handleUserImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const existingNames = new Set(users.map(u => u.name.toLowerCase()));
        const newUsers: User[] = [];

        jsonData.forEach((row: any) => {
          const name = row['اسم المستخدم'] || row['Name'] || row['name'];
          if (name && typeof name === 'string' && name.trim() && !existingNames.has(name.trim().toLowerCase())) {
            const newUser: User = {
              id: crypto.randomUUID(),
              name: name.trim(),
              permissions: defaultPermissions,
              ratings: [],
            };
            newUsers.push(newUser);
            existingNames.add(name.trim().toLowerCase());
          }
        });
        
        if (newUsers.length > 0) {
            saveUsers([...users, ...newUsers]);
        } else {
            setImportError('لم يتم العثور على مستخدمين جدد في الملف أو أنهم موجودون بالفعل.');
        }

      } catch (err) {
        console.error("Error parsing Excel file:", err);
        setImportError('فشل في تحليل ملف Excel. تأكد من أن العمود الأول هو "اسم المستخدم".');
      } finally {
        setIsImporting(false);
        if (importFileRef.current) {
          importFileRef.current.value = '';
        }
      }
    };
    reader.onerror = () => {
        setImportError('فشل في قراءة الملف.');
        setIsImporting(false);
    }
    reader.readAsArrayBuffer(file);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName.trim() === '') return;
    const newUser: User = {
      id: crypto.randomUUID(),
      name: newUserName.trim(),
      permissions: defaultPermissions,
      ratings: [],
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
  
  const handleRateUser = (userId: string, rating: number) => {
    const updatedUsers = users.map(user => {
        if (user.id === userId) {
            return { ...user, ratings: [...user.ratings, rating] };
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
        const passwords: Record<string, string> = {};
        users.forEach(user => {
            passwords[user.id] = generatePassword();
        });
        const logo = localStorage.getItem(LOGO_STORAGE_KEY);
        setPasswordsToPrint({ passwords, logo });
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
                    <table className="w-full text-sm text-right text-gray-600 min-w-[900px]">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                        <th className="px-4 py-3">اسم المستخدم</th>
                        {Object.values(permissionLabels).map(label => <th key={label} className="px-4 py-3 text-center">{label}</th>)}
                        <th className="px-4 py-3 text-center min-w-[150px]">التقييم</th>
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
                            <td className="px-4 py-3">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center" title={`المتوسط: ${calculateAverageRating(user.ratings).toFixed(1)}`}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <StarIcon
                                            key={star}
                                            filled={star <= Math.round(calculateAverageRating(user.ratings))}
                                            className="w-4 h-4 text-yellow-400"
                                            />
                                        ))}
                                        <span className="text-xs text-gray-500 mr-1">({user.ratings.length})</span>
                                    </div>
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((starValue) => (
                                            <button key={starValue} onClick={() => handleRateUser(user.id, starValue)} className="text-gray-300 hover:text-yellow-400" title={`Rate ${starValue} stars`}>
                                            <StarIcon className="w-5 h-5" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </td>
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

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border flex flex-col sm:flex-row items-center gap-4">
                    <form onSubmit={handleAddUser} className="flex-grow flex items-center gap-4 w-full sm:w-auto">
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
                    <div className="w-full sm:w-auto">
                        <input
                            type="file"
                            ref={importFileRef}
                            className="hidden"
                            accept=".xlsx, .xls"
                            onChange={handleUserImport}
                        />
                        <button
                            onClick={() => importFileRef.current?.click()}
                            disabled={isImporting}
                            className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                        >
                            {isImporting ? (
                                <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <ImportIcon />
                            )}
                            <span>{isImporting ? 'جاري الاستيراد...' : 'استيراد مستخدمين (Excel)'}</span>
                        </button>
                    </div>
                </div>
                {importError && <p className="mt-2 text-red-500 text-sm text-center">{importError}</p>}
            </div>
        </div>

        {passwordsToPrint && (
            <div className="printable-only">
                <div className="report-header">
                    {passwordsToPrint.logo && <img src={passwordsToPrint.logo} alt="شعار المدرسة" className="logo"/>}
                    <h2 className="report-title">بيانات الدخول المؤقتة للمستخدمين</h2>
                </div>
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
                                <td className="password-cell">{passwordsToPrint.passwords[user.id]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 <div className="report-footer">
                    <p>يرجى تغيير كلمة المرور عند أول تسجيل دخول لضمان أمان الحساب.</p>
                </div>
            </div>
        )}

        <style>{`
            .printable-only { display: none; }
            @media print {
                body {
                  padding: 1rem;
                }
                body > #root > div > .no-print, #control-panel-view .non-printable { display: none !important; }
                #control-panel-view .printable-only { display: block !important; }
                
                .report-header {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-bottom: 1rem;
                  border-bottom: 2px solid #ccc;
                  padding-bottom: 1rem;
                }
                .logo {
                  max-height: 70px;
                  max-width: 70px;
                  object-fit: contain;
                  margin-left: 1.5rem;
                }
                .report-title {
                    font-size: 20pt;
                    font-weight: bold;
                    margin: 0;
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
                .report-footer {
                    margin-top: 2rem;
                    text-align: center;
                    font-size: 10pt;
                    color: #777;
                    border-top: 1px solid #eee;
                    padding-top: 1rem;
                }
            }
        `}</style>

    </div>
  );
};

export default ControlPanelView;
