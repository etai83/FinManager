import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AIProviderType = 'gemini' | 'ollama';

export interface AIConfig {
  provider: AIProviderType;
  geminiApiKey: string;
  ollamaUrl: string;
  ollamaModel: string;
}

interface AIContextType {
  config: AIConfig;
  updateConfig: (newConfig: Partial<AIConfig>) => void;
}

const defaultConfig: AIConfig = {
  provider: 'gemini',
  geminiApiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'llama3',
};

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<AIConfig>(() => {
    const saved = localStorage.getItem('ai_config');
    return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig;
  });

  useEffect(() => {
    localStorage.setItem('ai_config', JSON.stringify(config));
  }, [config]);

  const updateConfig = (newConfig: Partial<AIConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <AIContext.Provider value={{ config, updateConfig }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
