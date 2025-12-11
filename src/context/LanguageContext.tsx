import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Locale, TranslationKey } from '../i18n/translations';

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Load from localStorage or default to 'en'
    const [locale, setLocaleState] = useState<Locale>(() => {
        const saved = localStorage.getItem('language');
        return (saved === 'en' || saved === 'it') ? saved : 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', locale);
    }, [locale]);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
    };

    const t = (key: TranslationKey): string => {
        const text = translations[locale][key];
        if (!text) {
            console.warn(`Translation missing for key: ${key}`);
            return key;
        }
        return text;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};
