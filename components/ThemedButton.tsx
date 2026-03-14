// components/ThemedButton.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React from 'react';
import { Pressable, Text, PressableProps, StyleProp, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { getScreenStyles } from '../constants/Styles';
import { useThemeColor } from '../hooks/useThemeColor';
import Colors from '../constants/Colors';

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

const toGradientTuple = (
  colors: readonly string[] | undefined,
  fallbackStart: string,
  fallbackEnd: string
): readonly [string, string] => {
  const [start = fallbackStart, end = fallbackEnd] = colors || [];
  return [start, end];
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
  const { scaleFactor, accessibility } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const isDisabled = disabled || loading;
  const theme = accessibility?.colorTheme || 'light';

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

  const useGradient = theme === 'dark' && !isDisabled && type !== 'outline';
  const gradientColors: readonly [string, string] =
    type === 'secondary'
      ? toGradientTuple(
          Colors.dark.buttonSecondaryGradient,
          Colors.dark.buttonSecondaryBackground,
          Colors.dark.secondary
        )
      : toGradientTuple(
          Colors.dark.buttonPrimaryGradient,
          Colors.dark.buttonPrimaryBackground,
          Colors.dark.primary
        );

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: useGradient ? 'transparent' : backgroundColor,
          borderColor: type === 'outline' ? textColor : backgroundColor,
          opacity: pressed || isDisabled ? 0.5 : 1,
          alignSelf: 'center',
          minWidth: '60%',
          overflow: useGradient ? 'hidden' : 'visible',
        },
        style, // Apply custom styles passed in via props
        buttonStyle,
      ]}
      // Spread the rest of the props (including accessibility props) onto the Pressable
      {...props} 
      // Ensure accessibilityRole is explicitly set if not passed in props
      accessibilityRole={props.accessibilityRole || "button"} 
    >
      {useGradient && (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            StyleSheet.absoluteFillObject,
            { borderRadius: (styles.button as any).borderRadius ?? 8 },
          ]}
        />
      )}
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
