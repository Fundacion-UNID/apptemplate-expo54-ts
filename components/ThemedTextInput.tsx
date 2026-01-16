// components/ThemedTextInput.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { TextInput, TextInputProps, StyleProp, TextStyle } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { moderateScale, scale } from 'react-native-size-matters';

type ThemedTextInputProps = TextInputProps & {
  style?: StyleProp<TextStyle>;
  disabled?: boolean;
  label?: string;
};

export default function ThemedTextInput({ style, disabled, editable, ...props }: ThemedTextInputProps) {
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'placeholder');
  const borderColor = useThemeColor({}, 'tint');

  const { scaleFactor } = useAccessibilityContext();

  return (
    <TextInput
      placeholderTextColor={placeholderColor}
      editable={typeof editable === 'boolean' ? editable : disabled ? false : true}
      style={[
        {
          color: textColor,
          borderColor,
          borderWidth: 1,
          borderRadius: scale(8),
          paddingVertical: scale(6), // Reduced from 12
          paddingHorizontal: scale(12),
          fontSize: moderateScale(14 * scaleFactor),
          marginBottom: scale(12),
        },
        style,
      ]}
      {...props}
    />
  );
}
