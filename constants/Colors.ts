// constants/Colors.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

const Colors = {
  general: {
    grayLight: '#e0e0e0',
    grayDark: '#333333',
    white: '#ffffff',
    black: '#000000',
  },

  light: {
    primary: '#007aff',
    secondary: '#ff7f2a',
    tint: '#007aff',

    text: '#1a1a1a',
    textSecondary: 'rgba(26,26,26,0.72)',

    placeholder: '#999999',

    background: '#d9e1e7',
    surface: '#f9f9f9',
    inputBackground: '#f7fafc',
    inputBorder: '#C7D1DB',

    // Navigation-style surfaces
    card: '#f2f2f2',
    cardBackground: '#ffffff',

    border: '#dcdcdc',
    separator: '#E5E7EB',

    buttonPrimaryBackground: '#1e63ad',
    buttonPrimaryText: '#d7dadd',
    buttonSecondaryBackground: '#ff7f2a',
    buttonSecondaryText: '#f2f2f2',
    buttonDisabledBackground: '#bbbbbb', // Darker gray for visibility
    buttonDisabledText: '#999999', // Muted text color for disabled state

    error: '#DD3444',
    checkboxCheckedBackground: '#1e63ad',
  },

  dark: {
    primary: '#007aff',
    secondary: '#ff7f2a',
    tint: '#007aff',

    text: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.72)',

    placeholder: '#cccccc',

    background: '#25496c',
    surface: '#0B2232',
    inputBackground: '#0C2538',
    inputBorder: '#1C3B56',

    // Navigation-style surfaces
    card: '#0E2436',
    cardBackground: '#0E2436',

    border: '#1A3952',
    separator: '#13334A',

    buttonPrimaryBackground: '#2a79ce',
    buttonPrimaryText: '#d7dadd',
    buttonPrimaryGradient: ['#0B3D91', '#0A4F7A'],
    buttonSecondaryBackground: '#ff7f2a',
    buttonSecondaryText: '#f2f2f2',
    buttonSecondaryGradient: ['#0B2C40', '#13526B'],
    buttonDisabledBackground: '#333333', // Added for dark mode
    buttonDisabledText: '#666666', // Muted text color for disabled state

    error: '#FF6666',
    checkboxCheckedBackground: '#0A5FA6',
  },
};

export default Colors;
