// components/ContactsList.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { View, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAccessibilityContext } from '../context/AccessibilityContext';
import { useThemeColor } from '../hooks/useThemeColor';
import { getListCardStyles } from '../constants/Styles';
import ActorListCard from './ActorListCard';

export default function ContactsList({ data, onPress }) {
  const { t } = useTranslation();
  const { scaleFactor } = useAccessibilityContext();

  const screenBg = useThemeColor({}, 'background');
  const separatorColor = useThemeColor({}, 'separator');
  const styles = getListCardStyles(scaleFactor);

  const renderItem = ({ item, index }) => {
    const lines = [];
    if (item.role) lines.push(`${t('info.role')}: ${item.role}`);
    if (item.organization) lines.push(`${t('info.organization')}: ${item.organization}`);

    const accessibilityLabel = `Contact ${item.displayName}. ${lines.join('. ')}`;

    return (
      <ActorListCard
        avatarUri={item.avatarUri}
        title={item.displayName}
        subtitle={item.subtitle}      // optional, e.g., preferred channel
        lines={lines}
        // No meta passed, so no date/time row rendered
        badge={item.badge}            // optional badge
        onPress={() => onPress?.(item)}
        accessibilityLabel={accessibilityLabel}
        testID={`contact-card-${index}`}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]} accessibilityRole="list">
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: separatorColor }]} />
        )}
        keyboardShouldPersistTaps="handled"
        accessibilityLabel="Contacts list"
      />
    </View>
  );
}
