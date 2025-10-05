export const DOMAIN_COLORS: { [key: string]: { bg: string; text: string; border: string; hoverBg: string; } } = {
  'العمليات الإدارية للإشراف التربوي': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300', hoverBg: 'hover:bg-blue-100' },
  'التدريس': { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-300', hoverBg: 'hover:bg-green-100' },
  'البرامج النوعية': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-300', hoverBg: 'hover:bg-purple-100' },
  'التنمية المهنية': { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-300', hoverBg: 'hover:bg-yellow-100' },
  'تقويم التحصيل العلمي': { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-300', hoverBg: 'hover:bg-red-100' },
};

export const getDomainColor = (domain: string) => {
  return DOMAIN_COLORS[domain] || { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-300', hoverBg: 'hover:bg-gray-100' };
};