'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { saveToolsAsCookie } from '@/app/(chat)/actions';
import { DEFAULT_TOOLS, getSelectedToolsFromStorage, saveSelectedToolsToStorage } from '@/lib/ai/tools';

interface ToolsContextType {
  selectedTools: string[];
  setSelectedTools: (tools: string[]) => void;
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

export function ToolsProvider({ initialTools = DEFAULT_TOOLS, children }: { initialTools?: string[], children: ReactNode }) {
  const [selectedTools, setSelectedTools] = useState<string[]>(initialTools);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on client side
  useEffect(() => {
    if (!isInitialized) {
      const storedTools = getSelectedToolsFromStorage();
      setSelectedTools(storedTools);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Update localStorage when tools change
  useEffect(() => {
    if (isInitialized) {
      saveSelectedToolsToStorage(selectedTools);
      // Also save to cookie for server-side rendering, but don't wait for it
      saveToolsAsCookie(selectedTools).catch(console.error);
    }
  }, [selectedTools, isInitialized]);

  return (
    <ToolsContext.Provider value={{ selectedTools, setSelectedTools }}>
      {children}
    </ToolsContext.Provider>
  );
}

export function useTools() {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error('useTools must be used within a ToolsProvider');
  }
  return context;
} 