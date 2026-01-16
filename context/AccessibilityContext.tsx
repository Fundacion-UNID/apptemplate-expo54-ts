// context/AccessibilityContext.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';

type InterfaceSize = 'S' | 'M' | 'L';

type AccessibilityState = {
  interfaceSize: InterfaceSize;
  colorTheme: ColorSchemeName;
};

type AccessibilityContextValue = {
  accessibility: AccessibilityState;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilityState>>;
  scaleFactor: number;
};

const defaultAccessibility: AccessibilityState = {
  interfaceSize: 'M',
  colorTheme: 'light',
};

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [accessibility, setAccessibility] = useState<AccessibilityState>({
    ...defaultAccessibility,
    colorTheme: systemColorScheme || 'light',
  });

  const scaleFactor =
    accessibility.interfaceSize === 'S' ? 0.8 :
    accessibility.interfaceSize === 'L' ? 1.2 :
    1.0;

  const value = useMemo(() => ({
    accessibility,
    setAccessibility,
    scaleFactor,
  }), [accessibility]);

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
};

export const useAccessibilityContext = (): AccessibilityContextValue => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibilityContext must be used within an AccessibilityProvider');
  }
  return context;
};
