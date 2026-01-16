// utils/i18n.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
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

i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'en',
    returnNull: false,
    returnEmptyString: false,
    interpolation: { escapeValue: false },
    keySeparator: false
});

export default i18n;
