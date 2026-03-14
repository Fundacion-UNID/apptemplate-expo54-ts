// utils/i18n.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import translationsEN from '../locales/en/index';
import translationsES from '../locales/es/index';

const flattenTranslations = (input, prefix = '') => {
    const output = {};
    Object.entries(input).forEach(([key, value]) => {
        const path = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(output, flattenTranslations(value, path));
        } else {
            output[path] = value;
        }
    });
    return output;
};

const resources = {
    en: {
        translation: flattenTranslations(translationsEN)
    },
    es: {
        translation: flattenTranslations(translationsES)
    }
};

const detectDefaultLanguage = () => {
    const locale = Localization.getLocales?.()[0]?.languageTag;
    if (locale) {
        return locale.toLowerCase().startsWith('es') ? 'es' : 'en';
    }
    if (typeof navigator !== 'undefined' && typeof navigator.language === 'string') {
        return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
    }
    return 'en';
};

i18n.use(initReactI18next).init({
    resources,
    lng: detectDefaultLanguage(),
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    returnNull: false,
    returnEmptyString: false,
    interpolation: { escapeValue: false },
    keySeparator: false
});

export default i18n;
