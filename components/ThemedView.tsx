// components/ThemedView.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { View as RNView } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

export function ThemedView({ style, lightColor, darkColor, ...props }) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  return <RNView style={[{ backgroundColor }, style]} {...props} />;
}