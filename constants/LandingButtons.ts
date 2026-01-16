// constants/LandinButtons.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { Routes } from './Routes';

export const LandingButtons = (t) => [
  {
    iconName: 'person',
    label: t('subject.family'),
    route: Routes.Family.Auth.name,
    appType: 'family',
    testID: 'family-button',
    badge:{
      content: 'new',
      visible: true
    }
  },
  {
    iconName: 'business',
    label: t('subject.organization'),
    route: Routes.Organization.Auth.name,
    appType: 'organization',
    testID: 'organization-button',
    badge: {
      visible: true,
      icon: 'alert-triangle',
      family: 'feather',
      type: 'warning'
    }
  },
];
