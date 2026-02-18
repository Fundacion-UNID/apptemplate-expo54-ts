// components/ThemedText.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { Text as RNText, TextProps, StyleProp, TextStyle } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { getScreenStyles } from '../constants/Styles';
import Colors from '../constants/Colors';

// Define the component's props interface
interface ThemedTextProps extends TextProps {
  style?: StyleProp<TextStyle>;
  lightColor?: string;
  darkColor?: string;
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | string; // Allow for custom variants
}

export default function ThemedText({
  style,
  lightColor,
  darkColor,
  variant = 'body',
  ...props
}: ThemedTextProps) {
  const { scaleFactor } = useAccessibilityContext();
  const { accessibility } = useAccessibilityContext();
  const theme = accessibility?.colorTheme || 'light';
  const useTitleAccent = theme === 'light' && (variant === 'title' || variant === 'subtitle');

  const color = useThemeColor(
    { light: lightColor ?? (useTitleAccent ? Colors.dark.background : undefined), dark: darkColor },
    'text'
  );
  const styles = getScreenStyles(scaleFactor);

  return (
    <RNText
      style={[
        { color },
        styles[variant as keyof typeof styles], // Use type assertion for dynamic style keys
        style,
      ]}
      {...props}
    />
  );
}
