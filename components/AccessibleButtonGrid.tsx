// components/AccessibleButtonGrid.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useMemo, FC } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { useThemeColor } from '../hooks/useThemeColor';
import { AppDimensions } from '../constants/Styles';

// --- Type Definitions ---
// REASON: Added strong types for the component's props to make it a first-class TypeScript component.
// This provides type safety and autocompletion wherever the component is used.
interface Badge {
  visible: boolean;
  content?: string;
  icon?: string;
  family?: string;
  type?: 'error' | 'info' | 'warning';
}

export interface ButtonItem {
  id?: string;
  iconName: string;
  iconType?: string;
  label: string;
  testID?: string;
  badge?: Badge;
  [key: string]: any; // Allow other properties like 'route' or 'appType'
}

interface AccessibleButtonGridProps {
  data: ButtonItem[];
  onPress: (item: ButtonItem) => void;
}

const badgeColors = {
  error: { background: '#ff4444', text: 'white' },
  info: { background: '#1E90FF', text: 'white' },
  warning: { background: '#FFD700', text: 'black' },
};

const AccessibleButtonGrid: FC<AccessibleButtonGridProps> = ({ data = [], onPress }) => {
  const { scaleFactor } = useAccessibilityContext();
  const screenWidth = Dimensions.get('window').width;

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'buttonPrimaryText');
  const bgColor = useThemeColor({}, 'buttonPrimaryBackground');

  // Simplified and centralized sizing logic
  const itemSize = useMemo(() => {
    const baseSize = screenWidth / 2.5; // Adjust number for more/less items per row
    return Math.min(baseSize * scaleFactor, 200 * scaleFactor); // Cap max size
  }, [screenWidth, scaleFactor]);

  const iconSize = itemSize * 0.35;
  const fontSize = AppDimensions.button * 0.8 * scaleFactor; // Smaller than standard button text
  const margin = AppDimensions.itemMargin / 2;
  const resolveIconComponent = (type?: string) => {
    switch ((type || '').toLowerCase()) {
      case 'font-awesome':
      case 'fontawesome':
        return FontAwesome;
      case 'material-community':
      case 'materialcommunity':
        return MaterialCommunityIcons;
      case 'material':
        return MaterialIcons;
      case 'feather':
        return Feather;
      case 'ionicons':
      case 'ionicon':
      default:
        return Ionicons;
    }
  };

  return (
    <View style={[styles.wrapper, { backgroundColor }]}>
      <View style={styles.grid}>
        {data.map((item, index) => {
          const badgeType = item.badge?.type || 'info';
          const colors = badgeColors[badgeType];

          const IconComponent = resolveIconComponent(item.iconType);
          const BadgeIconComponent = resolveIconComponent(item.badge?.family);

          return (
            <Pressable
              key={index}
              disabled={item.disabled} // Use the disabled prop here
              style={[
                styles.square,
                {
                  width: itemSize,
                  height: itemSize,
                  backgroundColor: bgColor,
                  margin: margin,
                  opacity: item.disabled ? 0.5 : 1, // Visual feedback for disabled state
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ disabled: item.disabled }} // Announce disabled state to screen readers
              onPress={() => !item.disabled && onPress?.(item)} // Prevent onPress if disabled
              testID={item.testID}
            >
              <IconComponent name={item.iconName as never} size={iconSize} color={textColor} />
              <Text
                style={{
                  marginTop: AppDimensions.itemMargin / 2,
                  textAlign: 'center',
                  fontSize: fontSize,
                  color: textColor,
                  fontWeight: '500',
                }}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {item.label}
              </Text>

              {item.badge?.visible && (
                <View
                  style={[
                    styles.badgeContainer,
                    { backgroundColor: colors.background },
                  ]}
                >
                  {item.badge.icon ? (
                    <BadgeIconComponent name={item.badge.icon as never} size={AppDimensions.badgeIcon * scaleFactor} color={colors.text} />
                  ) : (
                    <Text style={[styles.badgeText, { color: colors.text, fontSize: AppDimensions.badge * scaleFactor }]}>
                      {item.badge.content || '*'}
                    </Text>
                  )}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  square: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    elevation: 2,
    position: 'relative',
    padding: 8, // Add padding to ensure content never touches the edges
  },
  badgeContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  badgeText: {
    fontWeight: '700',
  },
});

export default AccessibleButtonGrid;
