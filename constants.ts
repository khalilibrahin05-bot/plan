export const MONTHS: string[] = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الثانية',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

// Mapping from the app's month index (0-11) to a Gregorian month and year
// Based on the academic year 1447H / 2025-2026M
export const HIJRI_TO_GREGORIAN_MAP: { month: number; year: number }[] = [
  { month: 7, year: 2025 },  // Muharram
  { month: 8, year: 2025 },  // Safar
  { month: 9, year: 2025 },  // Rabi' al-awwal
  { month: 10, year: 2025 }, // Rabi' al-thani
  { month: 11, year: 2025 }, // Jumada al-ula
  { month: 12, year: 2025 }, // Jumada al-thani
  { month: 1, year: 2026 },   // Rajab
  { month: 2, year: 2026 },   // Sha'ban
  { month: 3, year: 2026 },   // Ramadan
  { month: 4, year: 2026 },   // Shawwal
  { month: 5, year: 2026 },   // Dhu al-Qi'dah
  { month: 6, year: 2026 },   // Dhu al-Hijjah
];
