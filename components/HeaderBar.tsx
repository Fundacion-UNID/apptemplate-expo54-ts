// components/HeaderBar.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Icon } from 'react-native-elements';
import { useThemeColor } from '../hooks/useThemeColor';

export default function HeaderBar({ navigation, route }: NativeStackHeaderProps) {

  const iconColor = useThemeColor({}, 'text');
  const bgColor = useThemeColor({}, 'background');

  // The navigator stack gives us a `canGoBack` method
  const canGoBack = navigation.canGoBack();

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.left}>
        {canGoBack && (
          <Pressable onPress={() => navigation.goBack()} style={styles.button}>
            <Icon name="chevron-left" type="material" color={iconColor} size={30} />
          </Pressable>
        )}
      </View>
      <View style={styles.center}>
        <Text style={[styles.title, { color: iconColor }]} numberOfLines={1}>
          {route.name}
        </Text>
      </View>
      <View style={styles.right} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60, // Standard header height
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'grey',
    // Add elevation for Android shadow and boxShadow for web
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  left: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  center: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    flex: 1,
  },
  button: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});
