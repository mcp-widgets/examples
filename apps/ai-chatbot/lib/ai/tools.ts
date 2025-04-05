export const DEFAULT_TOOLS: string[] = [];

interface Tool {
  id: string;
  name: string;
  description: string;
}

export const tools: Array<Tool> = [
  {
    id: 'weather',
    name: 'Weather',
    description: 'Get the weather in a specific location',
  },
  {
    id: 'forecast',
    name: 'Weather Forecast',
    description: 'Get the weather forecast for a specific location',
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
