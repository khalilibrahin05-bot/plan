export interface CalendarEvent {
  name: string;
  day: number;
  month: number; // 1 = January, 12 = December
  type: 'yemeni' | 'international' | 'educational';
}

export const GREGORIAN_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

export const eventsData: CalendarEvent[] = [
  // Month 1 (January)
  { name: 'اليوم العالمي للتعليم', day: 24, month: 1, type: 'educational' },
  // Month 2 (February)
  { name: 'اليوم الدولي للمرأة والفتاة في ميدان العلوم', day: 11, month: 2, type: 'educational' },
  // Month 4 (April)
  { name: 'اليوم العالمي للإبداع والابتكار', day: 21, month: 4, type: 'educational' },
  { name: 'اليوم العالمي للكتاب وحقوق المؤلف', day: 23, month: 4, type: 'educational' },
  // Month 5 (May)
  { name: 'عيد العمال', day: 1, month: 5, type: 'international' },
  { name: 'يوم الوحدة اليمنية', day: 22, month: 5, type: 'yemeni' },
  // Month 7 (July)
  { name: 'اليوم العالمي لمهارات الشباب', day: 15, month: 7, type: 'educational' },
  // Month 9 (September)
  { name: 'اليوم الدولي لمحو الأمية', day: 8, month: 9, type: 'educational' },
  { name: 'ثورة 26 سبتمبر', day: 26, month: 9, type: 'yemeni' },
  // Month 10 (October)
  { name: 'يوم المعلم العالمي', day: 5, month: 10, type: 'educational' },
  { name: 'ثورة 14 أكتوبر', day: 14, month: 10, type: 'yemeni' },
  { name: 'يوم الأمم المتحدة', day: 24, month: 10, type: 'international' },
  // Month 11 (November)
  { name: 'اليوم العالمي للعلم من أجل السلام والتنمية', day: 10, month: 11, type: 'educational' },
  { name: 'اليوم العالمي للجودة', day: 13, month: 11, type: 'educational' }, // 2nd Thursday of Nov 2025
  { name: 'عيد الاستقلال', day: 30, month: 11, type: 'yemeni' },
  // Month 12 (December)
  { name: 'اليوم العالمي للغة العربية', day: 18, month: 12, type: 'educational' },
];
