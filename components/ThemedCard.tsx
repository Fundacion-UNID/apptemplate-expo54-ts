// components/ThemedCard.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { View } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

export function ThemedCard({ style, lightColor, darkColor, ...props }) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'card');
  const borderColor = useThemeColor({}, 'border');

  return (
    <View
      style={[
        {
          backgroundColor,
          borderColor,
          borderWidth: 1,
          borderRadius: 12,
          padding: 16,
        },
        style,
      ]}
      {...props}
    />
  );
}