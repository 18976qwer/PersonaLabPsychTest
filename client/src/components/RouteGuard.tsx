import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { StorageManager } from '../utils/storage';

export const RequireMBTI: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const mbtiResult = StorageManager.getItem('mbti_result');
  const location = useLocation();

  if (!mbtiResult) {
    return <Navigate to="/mbti" state={{ from: location }} replace />;
  }

  return children;
};

export const RequireResults: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const enneagramResult = StorageManager.getItem('enneagram_result');
  const location = useLocation();

  if (!enneagramResult) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};
