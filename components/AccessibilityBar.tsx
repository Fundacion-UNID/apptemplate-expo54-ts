// components/AccessibilityBar.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { useThemeColor } from '../hooks/useThemeColor';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
// REMOVED: No longer importing the modal
// import JobsStatusModal from './JobsStatusModal';

export default function AccessibilityBar() {
  const { accessibility, setAccessibility } = useAccessibilityContext();
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<any>(); // Get navigation object

  const iconColor = useThemeColor({}, 'text');
  const bgColor = useThemeColor({}, 'background');

  const toggleTheme = () => {
    setAccessibility(prev => ({ ...prev, colorTheme: prev.colorTheme === 'dark' ? 'light' : 'dark' }));
  };

  const cycleInterfaceSize = () => {
    const sizes = ['S', 'M', 'L'] as const;
    const currentIndex = sizes.indexOf(accessibility.interfaceSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setAccessibility(prev => ({ ...prev, interfaceSize: sizes[nextIndex] }));
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <Pressable 
          onPress={() => navigation.navigate('Jobs')} // Navigate to the Jobs screen
          style={styles.button}
          accessible
          accessibilityRole="button"
          accessibilityLabel={t('components.accessibilityBar.viewJobs')}
        >
          <Icon name="person-outline" type="material" color={iconColor} />
        </Pressable>

        <Pressable 
          onPress={toggleTheme} 
          style={styles.button}
          accessible
          accessibilityRole="button"
          accessibilityLabel={t('components.accessibilityBar.toggleTheme', { theme: accessibility.colorTheme === 'dark' ? 'light' : 'dark' })}
        >
          <Icon name={accessibility.colorTheme === 'dark' ? 'wb-sunny' : 'brightness-3'} type="material" color={iconColor} />
        </Pressable>

        <Pressable 
          onPress={cycleInterfaceSize} 
          style={styles.button}
          accessible
          accessibilityRole="button"
          accessibilityLabel={t('components.accessibilityBar.cycleSize')}
        >
          <Icon name="format-size" type="material" color={iconColor} />
        </Pressable>

        <Pressable 
          onPress={toggleLanguage} 
          style={styles.button}
          accessible
          accessibilityRole="button"
          accessibilityLabel={t('components.accessibilityBar.toggleLang', { lang: i18n.language === 'en' ? 'Spanish' : 'English' })}
        >
          <Text style={[styles.langText, { color: iconColor }]}>{i18n.language.toUpperCase()}</Text>
        </Pressable>
      </View>

      {/* REMOVED: The modal is no longer here */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10, // Adjust as needed for status bar
    paddingBottom: 5,
  },
  button: {
    paddingHorizontal: 12,
  },
  langText: {
    fontWeight: 'bold',
    fontSize: 16,
  }
});
