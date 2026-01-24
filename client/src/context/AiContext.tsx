import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AiContextType {
  isAiEnabled: boolean;
  setIsAiEnabled: (enabled: boolean) => void;
  aiLoading: boolean;
  setAiLoading: (loading: boolean) => void;
  provider: 'qwen' | 'minimax' | 'moonshot' | 'deepseek';
  setProvider: (p: 'qwen' | 'minimax' | 'moonshot' | 'deepseek') => void;
  streamEnabled: boolean;
  setStreamEnabled: (v: boolean) => void;
}

const AiContext = createContext<AiContextType | undefined>(undefined);

export const AiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAiEnabled, setIsAiEnabledState] = useState(false);
  const [aiLoading, setAiLoadingState] = useState(false);
  const [provider, setProviderState] = useState<'qwen' | 'minimax' | 'moonshot' | 'deepseek'>('qwen');
  const [streamEnabled, setStreamEnabledState] = useState(true);

  // Removed localStorage persistence to ensure AI starts disabled by default

  const setIsAiEnabled = (enabled: boolean) => {
    setIsAiEnabledState(enabled);
  };

  return (
    <AiContext.Provider
      value={{
        isAiEnabled,
        setIsAiEnabled,
        aiLoading,
        setAiLoading: setAiLoadingState,
        provider,
        setProvider: setProviderState,
        streamEnabled,
        setStreamEnabled: setStreamEnabledState
      }}
    >
      {children}
    </AiContext.Provider>
  );
};

export const useAi = () => {
  const context = useContext(AiContext);
  if (!context) {
    throw new Error('useAi must be used within an AiProvider');
  }
  return context;
};
