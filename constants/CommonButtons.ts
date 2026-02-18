// constants/CommonButtons.ts
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { TFunction } from 'i18next';
import { ButtonItem } from '../components/AccessibleButtonGrid';
import { Routes } from './Routes';

/**
 * @interface CommonButtonsConfig
 * @description Defines the structure of the object returned by the CommonButtons function.
 * This ensures that all button groups adhere to a consistent, typed structure.
 */
interface CommonButtonsConfig {
  landing: ButtonItem[];
  auth: ButtonItem[];
}

/**
 * @function CommonButtons
 * @description
 * A centralized configuration for buttons used across the application.
 * This approach promotes consistency and reusability.
 * Using a function that accepts the translation function `t` allows for dynamic labels
 * based on the current language.
 *
 * @param {TFunction} t - The translation function from i18next.
 * @returns {CommonButtonsConfig} An object containing different sets of button configurations.
 */
export const CommonButtons = (t: TFunction): CommonButtonsConfig => ({
  landing: [{
    id: 'family-button',
    iconName: 'person',
    iconType: 'material',
    label: t('subject.family'),
    route: Routes.Family.Auth.name,
    appType: 'family',
    testID: 'family-button',
  },
  {
    id: 'organization-button',
    iconName: 'building', // Example of a FontAwesome icon
    iconType: 'font-awesome', // Specify the icon library here
    label: t('subject.organization'),
    route: Routes.Organization.Auth.name,
    appType: 'organization',
    testID: 'organization-button',
    },
  ],
  auth:[  {
    id: 'google',
    iconName: 'logo-google',
    iconType: 'ionicons',
    label: 'organization.screens.auth.googleButton', // Translation key
    testID: 'google-auth-button',
  },
  {
    id: 'apple',
    iconName: 'logo-apple',
    iconType: 'ionicons',
    label: 'organization.screens.auth.appleButton', // Translation key
    testID: 'apple-auth-button',
    // REASON: Platform-specific rendering is a UI concern. We add a static property here
    // that the UI component can use to decide whether to render this button.
    platform: 'ios', 
  }]
});
