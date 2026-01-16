// components/ThemedButton.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React from 'react';
import { Pressable, Text, PressableProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { getScreenStyles } from '../constants/Styles';
import { useThemeColor } from '../hooks/useThemeColor';

// Define the props for the component
// We extend PressableProps to inherit all standard props like accessibilityLabel, onPress, etc.
type ThemedButtonProps = PressableProps & {
  title: string;
  style?: StyleProp<ViewStyle>; // Allow passing custom styles
  type?: 'primary' | 'secondary' | 'outline'; // Define the button type
  loading?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

export default function ThemedButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  buttonStyle,
  titleStyle,
  type = 'primary',
  ...props
}: ThemedButtonProps) {
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const isDisabled = disabled || loading;

  // Determine background and text colors based on the button type and disabled state
  const backgroundColor = useThemeColor(
    {},
    isDisabled
      ? 'buttonDisabledBackground'
      : type === 'primary'
        ? 'buttonPrimaryBackground'
        : type === 'outline'
          ? 'background'
          : 'buttonSecondaryBackground'
  );
  const textColor = useThemeColor(
    {},
    isDisabled
      ? 'buttonDisabledText'
      : type === 'primary'
        ? 'buttonPrimaryText'
        : type === 'outline'
          ? 'buttonSecondaryBackground'
          : 'buttonSecondaryText'
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: backgroundColor,
          borderColor: type === 'outline' ? textColor : backgroundColor,
          opacity: pressed || isDisabled ? 0.5 : 1,
          alignSelf: 'center',
          minWidth: '60%',
        },
        style, // Apply custom styles passed in via props
        buttonStyle,
      ]}
      // Spread the rest of the props (including accessibility props) onto the Pressable
      {...props} 
      // Ensure accessibilityRole is explicitly set if not passed in props
      accessibilityRole={props.accessibilityRole || "button"} 
    >
      <Text
        style={[
          styles.formButtonText,
          { 
            color: textColor,
            paddingHorizontal: 30,
          },
          titleStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}
