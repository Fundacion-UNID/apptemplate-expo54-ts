// components/ScreenHeader.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { View } from 'react-native';
import Logo from './Logo';
import ThemedText from './ThemedText';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { AppDimensions } from '../constants/Styles';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  description?: string;
};

export function ScreenHeader({ title, subtitle, description }: ScreenHeaderProps) {
  const { scaleFactor } = useAccessibilityContext();
  const logoSize = AppDimensions.logo * scaleFactor;

  return (
    <View style={{ alignItems: 'center', marginBottom: AppDimensions.headerMarginBottom * 0.5 * scaleFactor }}>
      <Logo size={logoSize} />

      <ThemedText
        accessible
        accessibilityRole="header"
        variant="title"
      >
        {String(title)}
      </ThemedText>

      {subtitle ? (
        <ThemedText
          accessible
          accessibilityRole="text"
          variant="subtitle"
        >
          {String(subtitle)}
        </ThemedText>
      ) : null}

      {description && (
        <ThemedText
          accessible
          accessibilityRole="text"
          variant="description"
          style={{ marginTop: 8 * scaleFactor, marginBottom: AppDimensions.itemMargin * 1.5 }}
        >
          {String(description)}
        </ThemedText>
      )}
    </View>
  );
}

export default ScreenHeader;
