// components/ThemedCheckbox.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { Pressable, Text, View, StyleSheet, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { scale, moderateScale } from 'react-native-size-matters';

type ThemedCheckboxProps = PressableProps & {
  label?: string;
  checked: boolean;
  onToggle?: () => void;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function ThemedCheckbox({
  label,
  checked,
  onToggle,
  disabled = false,
  style,
  ...props
}: ThemedCheckboxProps) {
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'text');
  const fillColor = useThemeColor({}, 'tint');

  const { accessibility } = useAccessibilityContext();
  const interfaceSize = accessibility.interfaceSize || 'M';
  const scaleFactor = interfaceSize === 'S' ? 1 : interfaceSize === 'L' ? 1.4 : 1.2;

  const size = moderateScale(18 * scaleFactor);

  const handleToggle = onToggle ?? props.onPress ?? (() => {});

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={handleToggle}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      {...props}
    >
      <View
        style={[
          styles.checkbox,
          {
            width: size,
            height: size,
            borderColor,
            backgroundColor: checked ? fillColor : 'transparent',
          },
        ]}
      />
      <Text
        style={{
          marginLeft: scale(10),
          color: textColor,
          fontSize: moderateScale(14 * scaleFactor),
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  checkbox: {
    borderWidth: 1,
    borderRadius: scale(4),
  },
});
