// hooks/useThemeColor.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import Colors from '../constants/Colors';
import { useAccessibilityContext } from '../context/AccessibilityContext';

type ThemeOverride = {
  light?: string;
  dark?: string;
};

export function useThemeColor(props?: ThemeOverride, colorName?: string): string;
export function useThemeColor(colorName?: string): string;
export function useThemeColor(
  propsOrColor: ThemeOverride | string = {},
  colorName?: string
): string {
  const props: ThemeOverride =
    typeof propsOrColor === 'string' ? {} : propsOrColor;
  const resolvedColorName =
    typeof propsOrColor === 'string' ? propsOrColor : colorName ?? 'text';

  let theme = 'light';
  try {
    const { accessibility } = useAccessibilityContext();
    theme = accessibility?.colorTheme || 'light';
  } catch {}

  // Per-call override support: useThemeColor({ light: '#fff', dark: '#000' }, 'background')
  if (props && (props.light || props.dark)) {
    return props[theme] ?? Colors[theme]?.[resolvedColorName];
  }

  const palette = Colors[theme] || {};
  if (palette[resolvedColorName] != null) return palette[resolvedColorName];

  // Synonyms / sensible fallbacks
  switch (colorName) {
    case 'cardBackground':
      return palette.card ?? palette.surface ?? palette.background ?? '#ffffff';
    case 'textSecondary':
      return palette.textSecondary ?? palette.text ?? (theme === 'dark' ? '#ffffff' : '#1a1a1a');
    case 'separator':
      return palette.separator ?? palette.border ?? (theme === 'dark' ? '#2A2A2A' : '#E5E7EB');
    default:
      return palette[resolvedColorName] ?? (theme === 'dark' ? '#121212' : '#ffffff');
  }
}
