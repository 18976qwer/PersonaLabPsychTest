import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TestProgressContextType {
  progress: number;
  total: number;
  showProgress: boolean;
  setProgress: (progress: number) => void;
  setTotal: (total: number) => void;
  setShowProgress: (show: boolean) => void;
}

const TestProgressContext = createContext<TestProgressContextType | undefined>(undefined);

export const TestProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  return (
    <TestProgressContext.Provider value={{ progress, total, showProgress, setProgress, setTotal, setShowProgress }}>
      {children}
    </TestProgressContext.Provider>
  );
};

export const useTestProgress = () => {
  const context = useContext(TestProgressContext);
  if (!context) {
    throw new Error('useTestProgress must be used within a TestProgressProvider');
  }
  return context;
};
