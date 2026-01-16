// components/DraftSummary.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Icon } from 'react-native-elements';
import ThemedText from './ThemedText';
import { useThemeColor } from '../hooks/useThemeColor';
import { useAccessibilityContext } from '../context/AccessibilityContext';

const DraftSummary = ({ title, items = [], onRemoveItem }) => {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const { scaleFactor } = useAccessibilityContext();
  const styles = getComponentStyles(scaleFactor, tintColor, textColor, backgroundColor);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Icon name={item.iconName} type={item.iconType || 'material'} size={24 * scaleFactor} color={textColor} containerStyle={styles.columnIcon} />
            <ThemedText style={styles.columnPrimary} numberOfLines={1}>{item.primaryText}</ThemedText>
            <ThemedText style={styles.columnSecondary} numberOfLines={1}>({item.secondaryText})</ThemedText>
            <Pressable onPress={() => onRemoveItem(item.id)} style={styles.columnAction} accessibilityRole="button" accessibilityLabel={`Remove ${item.primaryText}`}>
              <View style={styles.removeIconContainer}>
                <Icon name="close" type="material" size={18 * scaleFactor} color="white" />
              </View>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<ThemedText style={styles.emptyText}>No hay cambios pendientes.</ThemedText>}
      />
    </View>
  );
};

const getComponentStyles = (scaleFactor, tintColor, textColor, backgroundColor) => StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: tintColor,
    borderRadius: 8,
    backgroundColor: backgroundColor,
  },
  title: {
    fontSize: 18 * scaleFactor,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  columnIcon: {
    width: '10%',
    alignItems: 'center',
  },
  columnPrimary: {
    width: '40%',
    paddingHorizontal: 8,
  },
  columnSecondary: {
    width: '35%',
    paddingHorizontal: 8,
    opacity: 0.7,
  },
  columnAction: {
    width: '15%',
    alignItems: 'center',
  },
  removeIconContainer: {
    backgroundColor: 'red',
    borderRadius: 12 * scaleFactor,
    width: 24 * scaleFactor,
    height: 24 * scaleFactor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 16,
    opacity: 0.6,
  },
});

export default DraftSummary;
