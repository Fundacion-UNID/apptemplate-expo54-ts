// layouts/ScreenLayout.js - OK

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { moderateScale, scale } from 'react-native-size-matters';
import { useThemeColor } from '../../hooks/useThemeColor';

interface ScreenLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function ScreenLayout({ title, children }: ScreenLayoutProps) {
  const { accessibility } = useAccessibilityContext();
  const interfaceSize = accessibility.interfaceSize || 'M';

  const scaleFactor =
    interfaceSize === 'S' ? 1 :
    interfaceSize === 'L' ? 1.4 : 1.2;

  const titleColor = useThemeColor({}, 'buttonPrimaryBackground');
  const cardColor = useThemeColor({}, 'surface'); // cambia con el tema
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <View style={[styles.outerContainer, { backgroundColor }]}>
      <View style={[styles.innerCard, { backgroundColor: cardColor }]}>
        <Text
          style={[
            styles.title,
            {
              fontSize: moderateScale(24 * scaleFactor),
              color: titleColor,
            },
          ]}
        >
          {title}
        </Text>

        <View style={styles.content}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(16),
  },
  innerCard: {
    width: '100%',
    borderRadius: scale(12),
    padding: scale(16),
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: scale(24),
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
});
