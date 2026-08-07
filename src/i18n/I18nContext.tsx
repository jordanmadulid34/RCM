// Sitewide multilingual translation context supporting all ASEAN languages and local dialects.

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CountryMapping, LocaleCode } from './types';
import { COUNTRY_MAPPINGS, DEFAULT_COUNTRY, DEFAULT_LOCALE, LOCALE_LABELS } from './countryMapping';
import { getSavedCountryAndLocale, saveCountrySelection } from './cookieUtils';
import { TRANSLATION_DICTIONARY } from './translations';

// Import message catalogs
import en from './messages/en.json';
import fil from './messages/fil.json';
import id from './messages/id.json';
import ms from './messages/ms.json';
import th from './messages/th.json';
import vi from './messages/vi.json';
import zh from './messages/zh.json';
import km from './messages/km.json';
import lo from './messages/lo.json';
import my from './messages/my.json';
import ta from './messages/ta.json';
import tet from './messages/tet.json';
import pt from './messages/pt.json';

const MESSAGES: Record<string, any> = {
  en,
  fil,
  id,
  ms,
  th,
  vi,
  zh,
  km,
  lo,
  my,
  ta,
  tet,
  pt,
};

interface I18nContextType {
  country: CountryMapping;
  locale: LocaleCode;
  languageName: string;
  isMachineTranslated: boolean;
  selectCountry: (countryId: string, customLocale?: LocaleCode) => void;
  selectLanguageForSingapore: (localeCode: LocaleCode) => void;
  selectLanguage: (localeCode: LocaleCode) => void;
  t: (keyPath: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [country, setCountry] = useState<CountryMapping>(DEFAULT_COUNTRY);
  const [locale, setLocale] = useState<LocaleCode>(DEFAULT_LOCALE);

  // Initialize from saved cookies or defaults on mount
  useEffect(() => {
    const saved = getSavedCountryAndLocale();
    setCountry(saved.country);
    setLocale(saved.locale);

    // Update document lang attribute for accessibility & SEO
    if (typeof document !== 'undefined') {
      document.documentElement.lang = saved.locale;
    }
  }, []);

  const handleSelectCountry = (countryId: string, customLocale?: LocaleCode) => {
    const targetCountry = COUNTRY_MAPPINGS.find((c) => c.id === countryId) || DEFAULT_COUNTRY;
    const targetLocale = customLocale || targetCountry.defaultLocale;

    setCountry(targetCountry);
    setLocale(targetLocale);
    saveCountrySelection(targetCountry, targetLocale);

    if (typeof document !== 'undefined') {
      document.documentElement.lang = targetLocale;
    }
  };

  const handleSelectLanguageForSingapore = (sgLocale: LocaleCode) => {
    const sgCountry = COUNTRY_MAPPINGS.find((c) => c.id === 'SGP') || DEFAULT_COUNTRY;
    setCountry(sgCountry);
    setLocale(sgLocale);
    saveCountrySelection(sgCountry, sgLocale);

    if (typeof document !== 'undefined') {
      document.documentElement.lang = sgLocale;
    }
  };

  const handleSelectLanguage = (targetLocale: LocaleCode) => {
    setLocale(targetLocale);
    saveCountrySelection(country, targetLocale);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = targetLocale;
    }
  };

  // Translation function with dictionary lookup, direct text resolution, nested key resolution & fallback
  const t = (keyPath: string, params?: Record<string, string | number>): string => {
    if (!keyPath) return '';

    // If English locale is selected and input is direct English text
    if (locale === 'en' && !TRANSLATION_DICTIONARY[keyPath] && !keyPath.includes('.')) {
      return keyPath;
    }

    // 1. Check central dictionary first (exact match or trimmed match)
    const exactEntry = TRANSLATION_DICTIONARY[keyPath] || TRANSLATION_DICTIONARY[keyPath.trim()];
    if (exactEntry) {
      let val = exactEntry[locale] || exactEntry['en'] || exactEntry['fil'] || keyPath;
      if (params) {
        Object.entries(params).forEach(([paramKey, paramVal]) => {
          val = val.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g'), String(paramVal));
        });
      }
      return val;
    }

    // 2. Search in message JSON catalog for dotted paths
    const keys = keyPath.split('.');
    let result: any = MESSAGES[locale];
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        result = undefined;
        break;
      }
    }

    // Fallback to English in JSON catalogs
    if (result === undefined || typeof result !== 'string') {
      let fallback: any = MESSAGES.en;
      for (const k of keys) {
        if (fallback && typeof fallback === 'object' && k in fallback) {
          fallback = fallback[k];
        } else {
          fallback = undefined;
          break;
        }
      }
      result = typeof fallback === 'string' ? fallback : keyPath;
    }

    // Param interpolation
    if (params && typeof result === 'string') {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        result = result.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g'), String(paramVal));
      });
    }

    return result;
  };

  const languageName = LOCALE_LABELS[locale] || 'English';
  const isMachineTranslated = locale !== 'en';

  return (
    <I18nContext.Provider
      value={{
        country,
        locale,
        languageName,
        isMachineTranslated,
        selectCountry: handleSelectCountry,
        selectLanguageForSingapore: handleSelectLanguageForSingapore,
        selectLanguage: handleSelectLanguage,
        t,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
