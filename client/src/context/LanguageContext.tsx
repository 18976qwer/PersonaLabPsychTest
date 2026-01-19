import { translations } from '../data/locales';

export type Language = 'zh' | 'en';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { StorageManager } from '../utils/storage';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: any) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('zh');

  useEffect(() => {
    const savedLang = StorageManager.getItem<Language>('app_language');
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    StorageManager.setItem('app_language', lang);
  };

  const t = (key: string, options?: any): any => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // Fallback to key if translation not found
      }
    }
    
    if (typeof value === 'string' && options && typeof options === 'object') {
      return value.replace(/\{(\w+)\}/g, (_match, k: string) => {
        const replacement = options[k];
        return replacement !== undefined && replacement !== null ? String(replacement) : _match;
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    const fallbackLanguage: Language = 'zh';

    const t = (key: string, options?: any): any => {
      const keys = key.split('.');
      let value: any = translations[fallbackLanguage];

      for (const k of keys) {
        if (value && value[k]) {
          value = value[k];
        } else {
          return key;
        }
      }

      if (typeof value === 'string' && options && typeof options === 'object') {
        return value.replace(/\{(\w+)\}/g, (_match, k: string) => {
          const replacement = options[k];
          return replacement !== undefined && replacement !== null ? String(replacement) : _match;
        });
      }

      return value;
    };

    return {
      language: fallbackLanguage,
      setLanguage: () => {},
      t
    };
  }
  return context;
};
