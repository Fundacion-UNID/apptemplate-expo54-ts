// components/ThemedSegmentedControl.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import ThemedText from './ThemedText';
import { useThemeColor } from '../hooks/useThemeColor';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { AppDimensions } from '../constants/Styles';

const ThemedSegmentedControl = ({ values, selectedIndex, onChange }) => {
  const { scaleFactor } = useAccessibilityContext();
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: backgroundColor,
      borderRadius: AppDimensions.mainBorderRadius,
      borderWidth: AppDimensions.mainBorderWidth,
      borderColor: tintColor,
      overflow: 'hidden',
    },
    segment: {
      flex: 1,
      paddingVertical: 8 * scaleFactor,
      paddingHorizontal: 12 * scaleFactor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeSegment: {
      backgroundColor: tintColor,
    },
    text: {
      color: textColor,
      fontSize: 14 * scaleFactor,
    },
    activeText: {
      color: backgroundColor,
      fontWeight: 'bold',
    },
    separator: {
      width: AppDimensions.mainBorderWidth,
      backgroundColor: tintColor,
    },
  });

  return (
    <View style={styles.container}>
      {values.map((value, index) => (
        <React.Fragment key={index}>
          <Pressable
            onPress={() => onChange({ nativeEvent: { selectedSegmentIndex: index } })}
            style={[styles.segment, selectedIndex === index && styles.activeSegment]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={value}
            accessibilityState={{ selected: selectedIndex === index }}
          >
            <ThemedText style={[styles.text, selectedIndex === index && styles.activeText]}>
              {value}
            </ThemedText>
          </Pressable>
          {index < values.length - 1 && <View style={styles.separator} />}
        </React.Fragment>
      ))}
    </View>
  );
};

export default ThemedSegmentedControl;
