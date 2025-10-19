export const DOMAIN_COLORS: { [key: string]: { bg: string; text: string; border: string; hoverBg: string; hex: string; } } = {
  'العمليات الإدارية للإشراف التربوي': { bg: 'bg-blue-50 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200', border: 'border-blue-300 dark:border-blue-700', hoverBg: 'hover:bg-blue-100 dark:hover:bg-blue-900', hex: '#3b82f6' },
  'التدريس': { bg: 'bg-green-50 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200', border: 'border-green-300 dark:border-green-700', hoverBg: 'hover:bg-green-100 dark:hover:bg-green-900', hex: '#22c55e' },
  'البرامج النوعية': { bg: 'bg-purple-50 dark:bg-purple-900/50', text: 'text-purple-800 dark:text-purple-200', border: 'border-purple-300 dark:border-purple-700', hoverBg: 'hover:bg-purple-100 dark:hover:bg-purple-900', hex: '#a855f7' },
  'التنمية المهنية': { bg: 'bg-yellow-50 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-200', border: 'border-yellow-300 dark:border-yellow-700', hoverBg: 'hover:bg-yellow-100 dark:hover:bg-yellow-900', hex: '#eab308' },
  'تقويم التحصيل العلمي': { bg: 'bg-red-50 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-200', border: 'border-red-300 dark:border-red-700', hoverBg: 'hover:bg-red-100 dark:hover:bg-red-900', hex: '#ef4444' },
  'الخطة الاستراتيجية': { bg: 'bg-indigo-50 dark:bg-indigo-900/50', text: 'text-indigo-800 dark:text-indigo-200', border: 'border-indigo-300 dark:border-indigo-700', hoverBg: 'hover:bg-indigo-100 dark:hover:bg-indigo-900', hex: '#6366f1' },
  'العمليات الداخلية': { bg: 'bg-teal-50 dark:bg-teal-900/50', text: 'text-teal-800 dark:text-teal-200', border: 'border-teal-300 dark:border-teal-700', hoverBg: 'hover:bg-teal-100 dark:hover:bg-teal-900', hex: '#14b8a6' },
  'وسائل ومصادر التعلم': { bg: 'bg-pink-50 dark:bg-pink-900/50', text: 'text-pink-800 dark:text-pink-200', border: 'border-pink-300 dark:border-pink-700', hoverBg: 'hover:bg-pink-100 dark:hover:bg-pink-900', hex: '#ec4899' },
};

export const getDomainColor = (domain: string) => {
  return DOMAIN_COLORS[domain] || { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-800 dark:text-gray-200', border: 'border-gray-300 dark:border-gray-600', hoverBg: 'hover:bg-gray-100 dark:hover:bg-gray-700', hex: '#6b7280' };
};
