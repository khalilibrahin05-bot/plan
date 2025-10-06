import React, { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import { PlanItem, PrintSettings } from './types';
import { initialPlanData } from './data';
import MonthSelector from './components/MonthSelector';
import ViewSwitcher from './components/ViewSwitcher';
import SearchBar from './components/SearchBar';
import FontControls from './components/FontControls';
import Footer from './components/Footer';
import ThemeSwitcher from './components/ThemeSwitcher';
import { themes } from './themes';
import { CogIcon, PrintIcon, SaveDataIcon, RefreshIcon, CheckIcon, SyncIcon, HomeIcon } from './components/Icons';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy-loaded components
const Dashboard = lazy(() => import('./components/Dashboard'));
const PlanTable = lazy(() => import('./components/PlanTable'));
const ReportView = lazy(() => import('./components/ReportView'));
const SemesterReportView = lazy(() => import('./components/SemesterReportView'));
const StatisticsView = lazy(() => import('./components/StatisticsView'));
const UnifiedGlossaryView = lazy(() => import('./components/UnifiedGlossaryView'));
const EventsView = lazy(() => import('./components/EventsView'));
const ToolsView = lazy(() => import('./components/ToolsView'));
const FollowUpView = lazy(() => import('./components/FollowUpView'));
const AIToolsView = lazy(() => import('./components/AIToolsView'));
const FrameworkView = lazy(() => import('./components/FrameworkView'));
const SupervisorsView = lazy(() => import('./components/SupervisorsView'));
const SummaryView = lazy(() => import('./components/SummaryView'));
const ControlPanelView = lazy(() => import('./components/ControlPanelView'));
const EditModal = lazy(() => import('./components/EditModal'));
const PrintSettingsModal = lazy(() => import('./components/PrintSettingsModal'));


export type View = 'table' | 'report' | 'semester' | 'summary' | 'unified-glossary' | 'events' | 'tools' | 'follow-up' | 'ai-tools' | 'framework' | 'statistics' | 'supervisors' | 'control-panel';
const LOCAL_STORAGE_KEY = 'educationalPlanData';
const FONT_SETTINGS_KEY = 'educationalPlanFontSettings';
const PRINT_SETTINGS_KEY = 'educationalPlanPrintSettings';
const THEME_KEY = 'educationalPlanTheme';
const SUPERVISORS_PLANS_KEY = 'educationalSupervisorsPlansData';

const fontSizes = ['text-sm', 'text-base', 'text-lg', 'text-xl'];
const fontFamilies = [
  { name: 'كايرو', value: 'font-cairo' },
  { name: 'تجوال', value: 'font-tajawal' },
  { name: 'نوتو كوفي', value: 'font-noto' },
];

const defaultPrintSettings: PrintSettings = {
    orientation: 'landscape',
    columns: {
        objective: true,
        indicator: true,
        indicatorCount: true,
        evidence: true,
        activity: true,
        planned: true,
        schedule: true,
        executed: true,
    },
};

const App: React.FC = () => {
  const [planData, setPlanData] = useState<PlanItem[]>(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error("Failed to parse plan data from localStorage", error);
    }
    return initialPlanData;
  });

  const [fontSettings, setFontSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem(FONT_SETTINGS_KEY);
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (error) {
       console.error("Failed to parse font settings from localStorage", error);
    }
    return { fontSizeIndex: 1, fontFamily: 'font-cairo' };
  });

  const [printSettings, setPrintSettings] = useState<PrintSettings>(() => {
    try {
      const savedSettings = localStorage.getItem(PRINT_SETTINGS_KEY);
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error("Failed to parse print settings from localStorage", error);
    }
    return defaultPrintSettings;
  });
  
  const [themeId, setThemeId] = useState<string>(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'blue';
    } catch (error) {
      console.error("Failed to get theme from localStorage", error);
      return 'blue';
    }
  });

  const [supervisorsPlans, setSupervisorsPlans] = useState<{[key: string]: PlanItem[]}> (() => {
      try {
          const savedData = localStorage.getItem(SUPERVISORS_PLANS_KEY);
          if (savedData) {
              return JSON.parse(savedData);
          }
      } catch (error) {
          console.error("Failed to parse supervisors' plans data from localStorage", error);
      }
      return {};
  });

  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(0);
  const [editingItem, setEditingItem] = useState<PlanItem | null>(null);
  const [viewMode, setViewMode] = useState<View | 'dashboard'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrintSettingsModalOpen, setIsPrintSettingsModalOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');


  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(planData));
    } catch (error) {
      console.error("Failed to save plan data to localStorage", error);
    }
  }, [planData]);

  useEffect(() => {
    try {
      localStorage.setItem(FONT_SETTINGS_KEY, JSON.stringify(fontSettings));
    } catch (error) {
      console.error("Failed to save font settings to localStorage", error);
    }
  }, [fontSettings]);
  
  useEffect(() => {
    try {
      localStorage.setItem(PRINT_SETTINGS_KEY, JSON.stringify(printSettings));
    } catch (error) {
      console.error("Failed to save print settings to localStorage", error);
    }
  }, [printSettings]);
  
  useEffect(() => {
    try {
      localStorage.setItem(SUPERVISORS_PLANS_KEY, JSON.stringify(supervisorsPlans));
    } catch (error) {
      console.error("Failed to save supervisors' plans data to localStorage", error);
    }
  }, [supervisorsPlans]);

  useEffect(() => {
    const applyTheme = (id: string) => {
        const theme = themes.find(t => t.id === id) || themes[0];
        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(key, value as string);
        });
        try {
            localStorage.setItem(THEME_KEY, id);
        } catch (error) {
            console.error("Failed to save theme to localStorage", error);
        }
    };

    applyTheme(themeId);
  }, [themeId]);
  
  const handleRefreshData = useCallback(() => {
    if (window.confirm("هل أنت متأكد من رغبتك في تحديث البيانات؟ سيتم فقدان جميع التغييرات والعودة إلى الخطة الأصلية.")) {
      setPlanData(initialPlanData);
      setSupervisorsPlans({});
      // This will trigger the useEffects to save the initial state back to localStorage
    }
  }, []);

  const handleManualSave = useCallback(() => {
    setSaveStatus('saving');
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(planData));
      localStorage.setItem(FONT_SETTINGS_KEY, JSON.stringify(fontSettings));
      localStorage.setItem(PRINT_SETTINGS_KEY, JSON.stringify(printSettings));
      localStorage.setItem(THEME_KEY, themeId);
      localStorage.setItem(SUPERVISORS_PLANS_KEY, JSON.stringify(supervisorsPlans));
      
      setTimeout(() => {
        setSaveStatus('saved');
        setTimeout(() => {
          setSaveStatus('idle');
        }, 1500); // Revert to idle after 1.5 seconds
      }, 500); // Show saving for 0.5 seconds
    } catch (error) {
      console.error("Failed to manually save data to localStorage", error);
      setSaveStatus('idle'); // Revert on error
    }
  }, [planData, fontSettings, printSettings, themeId, supervisorsPlans]);
  
  const handleSyncData = useCallback(() => {
    setSyncStatus('syncing');
    try {
      // Plan Data
      const savedPlanData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedPlanData) setPlanData(JSON.parse(savedPlanData));

      // Supervisors Plans
      const savedSupervisorsPlans = localStorage.getItem(SUPERVISORS_PLANS_KEY);
      if (savedSupervisorsPlans) setSupervisorsPlans(JSON.parse(savedSupervisorsPlans));

      // Font Settings
      const savedFontSettings = localStorage.getItem(FONT_SETTINGS_KEY);
      if (savedFontSettings) setFontSettings(JSON.parse(savedFontSettings));
      
      // Print Settings
      const savedPrintSettings = localStorage.getItem(PRINT_SETTINGS_KEY);
      if (savedPrintSettings) setPrintSettings(JSON.parse(savedPrintSettings));
      
      // Theme
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme) setThemeId(savedTheme);

      setTimeout(() => {
        setSyncStatus('synced');
        setTimeout(() => setSyncStatus('idle'), 1500);
      }, 500);
    } catch (error) {
      console.error("Failed to sync data from localStorage", error);
      setSyncStatus('idle');
    }
  }, []);

  const handleThemeChange = useCallback((id: string) => {
      setThemeId(id);
  }, []);

  const handleFontSizeChange = useCallback((direction: 'increase' | 'decrease') => {
    setFontSettings(prev => {
        const newIndex = direction === 'increase'
        ? Math.min(prev.fontSizeIndex + 1, fontSizes.length - 1)
        : Math.max(prev.fontSizeIndex - 1, 0);
        return {...prev, fontSizeIndex: newIndex};
    });
  }, []);

  const handleFontFamilyChange = useCallback((font: string) => {
    setFontSettings(prev => ({...prev, fontFamily: font}));
  }, []);

  const handleSelectMonth = useCallback((index: number) => {
    setSelectedMonthIndex(index);
  }, []);

  const handleEditItem = useCallback((item: PlanItem) => {
    setEditingItem(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setEditingItem(null);
  }, []);

  const handleSaveItem = useCallback((updatedItem: PlanItem) => {
    setPlanData(prevData =>
      prevData.map(item => (item.id === updatedItem.id ? updatedItem : item))
    );
    setEditingItem(null);
  }, []);
  
  const handleWeeklyExecutionChange = useCallback((itemId: number, newWeeklyValues: (number | null)[]) => {
    setPlanData(prevData =>
      prevData.map(item =>
        item.id === itemId
          ? { ...item, weeklyExecution: newWeeklyValues, executed: newWeeklyValues.reduce((s, v) => s + (v || 0), 0) }
          : item
      )
    );
  }, []);

  const handleViewChange = useCallback((view: View) => {
    setViewMode(view);
  }, []);
  
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSavePrintSettings = useCallback((settings: PrintSettings) => {
    setPrintSettings(settings);
    setIsPrintSettingsModalOpen(false);
  }, []);

  const handleUpdateSupervisorsPlans = useCallback((newPlans: {[key: string]: PlanItem[]}) => {
    setSupervisorsPlans(newPlans);
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery) {
      return planData;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return planData.filter(item =>
      item.domain.toLowerCase().includes(lowercasedQuery) ||
      item.objective.toLowerCase().includes(lowercasedQuery) ||
      item.indicator.toLowerCase().includes(lowercasedQuery) ||
      item.activity.toLowerCase().includes(lowercasedQuery)
    );
  }, [planData, searchQuery]);

  const renderContent = () => {
    switch(viewMode) {
      case 'table':
        return <PlanTable data={filteredData} selectedMonthIndex={selectedMonthIndex} onEdit={handleEditItem} printSettings={printSettings} isPrinting={isPrinting} onPrintComplete={() => setIsPrinting(false)} />;
      case 'report':
        return <ReportView data={filteredData} selectedMonthIndex={selectedMonthIndex} onWeeklyExecutionChange={handleWeeklyExecutionChange} />;
      case 'semester':
        return <SemesterReportView data={filteredData} selectedMonthIndex={selectedMonthIndex} />;
      case 'summary':
        return <SummaryView planData={planData} supervisorsPlans={supervisorsPlans} />;
      case 'statistics':
        return <StatisticsView data={filteredData} />;
      case 'unified-glossary':
        return <UnifiedGlossaryView data={planData} />;
      case 'events':
        return <EventsView />;
      case 'tools':
        return <ToolsView />;
      case 'follow-up':
        return <FollowUpView data={planData} />;
      case 'ai-tools':
        return <AIToolsView />;
      case 'framework':
        return <FrameworkView />;
      case 'supervisors':
        return <SupervisorsView plans={supervisorsPlans} onUpdatePlans={handleUpdateSupervisorsPlans} />;
      case 'control-panel':
        return <ControlPanelView />;
      default:
        return null;
    }
  }


  return (
    <div className={`min-h-screen bg-gray-50 text-gray-800 ${fontSizes[fontSettings.fontSizeIndex]} ${fontSettings.fontFamily}`}>
      <header className="bg-white shadow-md sticky top-0 z-20 no-print">
        <div className="container mx-auto px-4 py-4 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-700 text-center md:text-right">
              {viewMode === 'dashboard' ? 'لوحة التحكم الرئيسية' : 'خطة قسم الإشراف التربوي للعام الدراسي ٢٠٢٥م-٢٠٢٦م / ١٤٤٧هـ'}
            </h1>
             {viewMode !== 'dashboard' && (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button onClick={() => setViewMode('dashboard')} className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary font-semibold rounded-md hover:bg-primary/20" title="العودة للوحة التحكم">
                        <HomeIcon />
                        <span>الرئيسية</span>
                    </button>
                    <MonthSelector
                        selectedIndex={selectedMonthIndex}
                        onSelectMonth={handleSelectMonth}
                    />
                </div>
            )}
          </div>
          {viewMode !== 'dashboard' && (
             <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                <div className="w-full lg:w-1/2">
                    <SearchBar query={searchQuery} onQueryChange={handleSearchChange} />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <ViewSwitcher
                        currentView={viewMode as View}
                        onViewChange={handleViewChange}
                    />
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                        <button onClick={handleManualSave} className={`flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded-md text-sm transition-all duration-300 ${saveStatus === 'saved' ? 'bg-green-500 text-white' : 'hover:bg-gray-200'}`} title="حفظ التغييرات" disabled={saveStatus !== 'idle'}>
                            {saveStatus === 'idle' && <><SaveDataIcon /><span>حفظ</span></>}
                            {saveStatus === 'saving' && <div className="w-4 h-4 border-2 border-transparent border-t-primary rounded-full animate-spin"></div>}
                            {saveStatus === 'saved' && <><CheckIcon /><span>تم الحفظ</span></>}
                        </button>
                        <button onClick={handleSyncData} className={`flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded-md text-sm transition-all duration-300 ${syncStatus === 'synced' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`} title="مزامنة البيانات من التخزين المحلي (مفيد عند فتح التطبيق في أكثر من نافذة)" disabled={syncStatus !== 'idle'}>
                            {syncStatus === 'idle' && <><SyncIcon /><span>مزامنة</span></>}
                            {syncStatus === 'syncing' && <div className="w-4 h-4 border-2 border-transparent border-t-primary rounded-full animate-spin"></div>}
                            {syncStatus === 'synced' && <><CheckIcon /><span>تمت المزامنة</span></>}
                        </button>
                        <button onClick={handleRefreshData} className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-200 text-sm text-red-600 hover:text-red-700" title="تحديث البيانات للخطة الأصلية">
                            <RefreshIcon />
                            <span>تحديث</span>
                        </button>
                    </div>
                    {viewMode === 'table' && (
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                        <button onClick={() => setIsPrinting(true)} className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-200 text-sm" title="طباعة الجدول">
                        <PrintIcon />
                        <span>طباعة</span>
                        </button>
                        <button onClick={() => setIsPrintSettingsModalOpen(true)} className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-200 text-sm" title="إعدادات الطباعة">
                        <CogIcon />
                        </button>
                    </div>
                    )}
                    <FontControls 
                        onFontSizeChange={handleFontSizeChange}
                        onFontFamilyChange={handleFontFamilyChange}
                        currentFont={fontSettings.fontFamily}
                        fontFamilies={fontFamilies}
                    />
                    <ThemeSwitcher
                        currentThemeId={themeId}
                        onThemeChange={handleThemeChange}
                    />
                </div>
            </div>
          )}
        </div>
      </header>
      
      <main className="container mx-auto p-4 pb-16">
        <Suspense fallback={<LoadingSpinner />}>
            {viewMode === 'dashboard' ? (
                <Dashboard onViewChange={handleViewChange} />
            ) : (
                renderContent()
            )}
        </Suspense>
      </main>

      <Suspense fallback={null}>
        {editingItem && (
          <EditModal
            item={editingItem}
            isOpen={!!editingItem}
            onClose={handleCloseModal}
            onSave={handleSaveItem}
          />
        )}
        {isPrintSettingsModalOpen && (
          <PrintSettingsModal
            isOpen={isPrintSettingsModalOpen}
            onClose={() => setIsPrintSettingsModalOpen(false)}
            onSave={handleSavePrintSettings}
            currentSettings={printSettings}
          />
        )}
      </Suspense>
      <Footer />
    </div>
  );
};

export default App;