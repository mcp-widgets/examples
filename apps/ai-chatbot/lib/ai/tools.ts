import { CloudIcon, ShoppingCartIcon, LucideIcon } from 'lucide-react';
export const DEFAULT_TOOLS: string[] = [];

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export const tools: Array<Tool> = [
  {
    id: 'weather',
    icon: CloudIcon,
    name: 'Weather Forecast',
    description: 'Get the weather forecast for a specific location',
  },
  {
    id: 'ecommerce',
    icon: ShoppingCartIcon,
    name: 'Ecommerce',
    description: 'Order products from an ecommerce store',
  },
];

// Client-side only function to get and set selected tools
export const getSelectedToolsFromStorage = (): string[] => {
  if (typeof window === 'undefined') return DEFAULT_TOOLS;

  const storedTools = localStorage.getItem('selectedTools');
  return storedTools ? JSON.parse(storedTools) : DEFAULT_TOOLS;
};

export const saveSelectedToolsToStorage = (tools: string[]): void => {
  if (typeof window === 'undefined') return;

  localStorage.setItem('selectedTools', JSON.stringify(tools));
};
