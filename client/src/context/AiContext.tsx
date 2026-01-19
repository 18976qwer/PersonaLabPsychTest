import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AiContextType {
  isAiEnabled: boolean;
  setIsAiEnabled: (enabled: boolean) => void;
  aiLoading: boolean;
  setAiLoading: (loading: boolean) => void;
}

const AiContext = createContext<AiContextType | undefined>(undefined);

export const AiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAiEnabled, setIsAiEnabledState] = useState(false);
  const [aiLoading, setAiLoadingState] = useState(false);

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
        setAiLoading: setAiLoadingState
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
