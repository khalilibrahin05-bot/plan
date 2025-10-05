export interface Theme {
  id: string;
  name: string;
  colors: Record<string, string>;
}

export const themes: Theme[] = [
  {
    id: 'blue',
    name: 'أزرق (افتراضي)',
    colors: {
      '--color-primary-action': '#2563eb', // blue-600
    }
  },
  {
    id: 'green',
    name: 'أخضر',
    colors: {
      '--color-primary-action': '#16a34a', // green-600
    }
  },
  {
    id: 'purple',
    name: 'بنفسجي',
    colors: {
       '--color-primary-action': '#9333ea', // purple-600
    }
  },
    {
    id: 'red',
    name: 'أحمر',
    colors: {
       '--color-primary-action': '#dc2626', // red-600
    }
  },
  {
    id: 'yellow',
    name: 'أصفر',
    colors: {
       '--color-primary-action': '#f59e0b', // amber-500
    }
  },
  {
    id: 'gray',
    name: 'داكن',
    colors: {
       '--color-primary-action': '#4b5563', // gray-600
    }
  },
];