export interface CalendarEvent {
  name: string;
  day: number;
  month: number; // 1 = January, 12 = December
  type: 'yemeni' | 'international' | 'educational';
  description: string;
}

export const GREGORIAN_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

export const eventsData: CalendarEvent[] = [
  // Month 1 (January)
  { name: 'اليوم العالمي للتعليم', day: 24, month: 1, type: 'educational', description: 'يوم للاحتفال بدور التعليم من أجل السلام والتنمية.' },
  // Month 2 (February)
  { name: 'اليوم الدولي للمرأة والفتاة في ميدان العلوم', day: 11, month: 2, type: 'educational', description: 'يهدف إلى تحقيق وصول المرأة والفتاة ومشاركتهما الكاملة والمتساوية في العلوم.' },
  // Month 4 (April)
  { name: 'اليوم العالمي للإبداع والابتكار', day: 21, month: 4, type: 'educational', description: 'يهدف إلى زيادة الوعي بدور الإبداع والابتكار في جميع جوانب التنمية البشرية.' },
  { name: 'اليوم العالمي للكتاب وحقوق المؤلف', day: 23, month: 4, type: 'educational', description: 'احتفالية لتعزيز التمتع بالكتب والقراءة.' },
  // Month 5 (May)
  { name: 'عيد العمال', day: 1, month: 5, type: 'international', description: 'احتفال سنوي يقام في دول عديدة احتفاءً بالعمال.' },
  { name: 'يوم الوحدة اليمنية', day: 22, month: 5, type: 'yemeni', description: 'ذكرى توحيد شطري اليمن الشمالي والجنوبي عام 1990.' },
  // Month 7 (July)
  { name: 'اليوم العالمي لمهارات الشباب', day: 15, month: 7, type: 'educational', description: 'يهدف إلى التركيز على الأهمية الاستراتيجية لتزويد الشباب بالمهارات اللازمة للتوظيف.' },
  // Month 9 (September)
  { name: 'اليوم الدولي لمحو الأمية', day: 8, month: 9, type: 'educational', description: 'لتذكير المجتمع الدولي بأهمية محو الأمية باعتباره مسألة تتعلق بالكرامة وحقوق الإنسان.' },
  { name: 'ثورة 26 سبتمبر', day: 26, month: 9, type: 'yemeni', description: 'ذكرى قيام ثورة 26 سبتمبر 1962 في شمال اليمن.' },
  // Month 10 (October)
  { name: 'يوم المعلم العالمي', day: 5, month: 10, type: 'educational', description: 'يوم لتكريم المعلمين والاحتفاء بإنجازاتهم ودورهم في بناء أجيال المستقبل.' },
  { name: 'ثورة 14 أكتوبر', day: 14, month: 10, type: 'yemeni', description: 'ذكرى قيام ثورة 14 أكتوبر 1963 في جنوب اليمن.' },
  { name: 'يوم المدير العامي', day: 16, month: 10, type: 'international', description: 'يوم للاعتراف بجهود المديرين والقادة في بيئات العمل المختلفة.' },
  { name: 'يوم الأمم المتحدة', day: 24, month: 10, type: 'international', description: 'ذكرى بدء العمل بميثاق الأمم المتحدة في عام 1945.' },
  // Month 11 (November)
  { name: 'اليوم العالمي للعلم من أجل السلام والتنمية', day: 10, month: 11, type: 'educational', description: 'يسلط الضوء على الدور الهام للعلم في المجتمع والحاجة إلى إشراك الجمهور في النقاشات المتعلقة بالقضايا العلمية.' },
  { name: 'اليوم العالمي للجودة', day: 13, month: 11, type: 'educational', description: 'يوم لزيادة الوعي العالمي بأهمية الجودة في التنمية والازدهار.' }, // 2nd Thursday of Nov 2025
  { name: 'عيد الاستقلال', day: 30, month: 11, type: 'yemeni', description: 'ذكرى استقلال جنوب اليمن عن الاحتلال البريطاني عام 1967.' },
  // Month 12 (December)
  { name: 'اليوم العالمي للغة العربية', day: 18, month: 12, type: 'educational', description: 'اليوم الذي اعتمدت فيه الجمعية العامة للأمم المتحدة اللغة العربية لغة رسمية سادسة في عام 1973.' },
];
