// components/AccessibleConnectionsGrid.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useState } from 'react';
import { View, Text, Pressable, Image, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { AppDimensions } from '../constants/Styles';
import { useThemeColor } from '../hooks/useThemeColor';

const badgePalette = {
  info:    { background: 'rgba(0,122,255,0.2)', text: '#0A84FF' },
  warning: { background: 'rgba(255,149,0,0.2)', text: '#FF9500' },
  error:   { background: 'rgba(255,59,48,0.2)', text: '#FF3B30' },
};

const statusPalette = {
  pending:  { bg: 'rgba(255,204,0,0.18)', text: '#CC8A00' },
  accepted: { bg: 'rgba(52,199,89,0.18)', text: '#34C759' },
  rejected: { bg: 'rgba(255,59,48,0.18)', text: '#FF3B30' },
  closed:   { bg: 'rgba(142,142,147,0.18)', text: '#8E8E93' },
};

type AccessibleConnectionsGridProps = {
  data?: any[];
  onPress?: (item: any) => void;
  onSearch?: (query: string) => void;
  onAdd?: () => void;
  cardSize?: 'S' | 'M' | 'L';
  onOptionsPress?: (item: any) => void;
};

export default function AccessibleConnectionsGrid({
  data = [],
  onPress,
  onSearch,
  onAdd,
  cardSize,
  onOptionsPress,
}: AccessibleConnectionsGridProps) {
  const { t } = useTranslation();
  const { accessibility, scaleFactor } = useAccessibilityContext();
  const size = cardSize || accessibility.interfaceSize || 'M';

  const [query, setQuery] = useState('');

  const bg = useThemeColor({}, 'background');
  const cardBg = useThemeColor({}, 'cardBackground');
  const textPrimary = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const separator = useThemeColor({}, 'separator');
  const border = useThemeColor({}, 'border');
  const inputBg = useThemeColor({}, 'inputBackground');
  const primary = useThemeColor({}, 'primary');

  const dims = {
    padding: 16 * scaleFactor,
    radius: 16,
    avatar: (size === 'S' ? 50 : size === 'L' ? 70 : 60) * scaleFactor,
    title: AppDimensions.cardTitle * scaleFactor,
    subtitle: AppDimensions.cardSubtitle * scaleFactor,
    meta: AppDimensions.cardMeta * scaleFactor,
    icon: AppDimensions.cardIcon * scaleFactor,
    metaIcon: (AppDimensions.cardIcon - 4) * scaleFactor,
  };

  const renderBadge = (item) => {
    if (!item?.badge?.visible) return null;
    const type = item.badge?.type || 'info';
    const pal = badgePalette[type] || badgePalette.info;
    return (
      <View style={[styles.badge, { backgroundColor: pal.background, borderColor: pal.text }]}>
        {item.badge?.icon ? (
          <Icon name={item.badge.icon} type={item.badge.family} size={AppDimensions.badgeIcon * scaleFactor} color={pal.text} />
        ) : (
          <Text style={{ color: pal.text, fontSize: AppDimensions.badge * scaleFactor, fontWeight: '600' }}>
            {item.badge?.content || '*'}
          </Text>
        )}
      </View>
    );
  };
  
  const SearchCard = () => (
    <View style={[styles.card, { backgroundColor: cardBg, padding: dims.padding, borderRadius: dims.radius, borderColor: border }]}>
      <View style={styles.searchTitleRow}>
        <Text style={[styles.searchTitle, { color: textPrimary, fontSize: dims.title + 1 }]}>{t('groups.searchTitle')}</Text>
        <View style={styles.searchActions}>
            <Pressable onPress={() => onSearch && onSearch(query)} style={[styles.roundBtn, { backgroundColor: primary }]}><Icon name="search" type="material" size={dims.icon} color="#FFF" /></Pressable>
            <Pressable onPress={onAdd} style={[styles.roundBtn, { backgroundColor: primary, marginLeft: 8 }]} testID="add-connection-button"><Icon name="add" type="material" size={dims.icon} color="#FFF" /></Pressable>
        </View>
      </View>
      <View style={[styles.inputWrap, { backgroundColor: inputBg, borderColor: separator }]}>
          <Icon name="search" type="material" size={dims.icon} color={textSecondary} />
          <TextInput
              placeholder={t('groups.searchPlaceholder')}
              placeholderTextColor={textSecondary}
              value={query}
              onChangeText={(v) => { setQuery(v); onSearch && onSearch(v); }}
              style={[styles.input, { color: textPrimary, fontSize: dims.subtitle }]}
          />
          {!!query && <Pressable onPress={() => { setQuery(''); onSearch && onSearch(''); }}><Icon name="close" type="material" size={dims.icon} color={textSecondary} /></Pressable>}
      </View>
      <Text style={{ color: textSecondary, fontSize: dims.meta, marginTop: 10 }} numberOfLines={3}>{t('groups.searchHelp')}</Text>
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: bg }} contentContainerStyle={styles.container}>
      <SearchCard/>
      <View style={styles.gridContainer}>
        {data.map((item, index) => {
          const last = item.lastAction || {};
          return (
            <Pressable
              key={item.id || index}
              style={[styles.card, styles.gridCard, { backgroundColor: cardBg, padding: dims.padding, borderRadius: dims.radius, borderColor: border }]}
              onPress={() => onPress && onPress(item)}
            >
              <View style={styles.headerRow}>
                {item.profileImage ? <Image source={{ uri: item.profileImage }} style={{ width: dims.avatar, height: dims.avatar, borderRadius: dims.avatar / 2 }} /> : <View style={[styles.avatarPlaceholder, { width: dims.avatar, height: dims.avatar, borderRadius: dims.avatar/2}]}><Icon name="group" type="material" size={dims.avatar * 0.6} color={textSecondary} /></View>}
                <View style={styles.headerText}>
                  <Text style={{ color: textPrimary, fontSize: dims.title, fontWeight: '700' }} numberOfLines={1}>{item.groupName}</Text>
                  {!!onOptionsPress && <Pressable onPress={() => onOptionsPress(item)}><Icon name="more-vert" type="material" size={dims.metaIcon + 2} color={textSecondary} /></Pressable>}
                </View>
                {renderBadge(item)}
              </View>
              <Text style={{ color: textSecondary, fontSize: dims.subtitle, marginTop: 8 }} numberOfLines={1}>{t(`action.${last.type || 'notification'}`)}</Text>
              {!!last.sender && <Text style={{ color: textSecondary, fontSize: dims.meta, marginTop: 4 }} numberOfLines={1}>{`${t('info.from')}: ${last.sender}`}</Text>}
              {(last.date || last.time) && (
                <View style={styles.metaRow}>
                  {!!last.iconName && <Icon name={last.iconName} type={last.iconType} size={dims.metaIcon} color={textSecondary} />}
                  {!!last.date && <Text style={{ color: textSecondary, fontSize: dims.meta }}>{last.date}</Text>}
                  {!!last.date && !!last.time && <View style={[styles.dot, { backgroundColor: separator }]} />}
                  {!!last.time && <Text style={{ color: textSecondary, fontSize: dims.meta }}>{last.time}</Text>}
                </View>
              )}
              {item.status && <View style={[styles.statusPill, { backgroundColor: statusPalette[item.status]?.bg }]}><Text style={{ fontSize: dims.meta, color: statusPalette[item.status]?.text }}>{item.status}</Text></View>}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: AppDimensions.itemMargin,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: AppDimensions.itemMargin,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: AppDimensions.itemMargin,
  },
  gridCard: {
    minWidth: 300, 
    flex: 1,      
  },
  badge: { position: 'absolute', top: 6, right: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth },
  searchTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppDimensions.itemMargin,
  },
  searchActions: {
    flexDirection: 'row',
  },
  searchTitle: { fontWeight: '700' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 6, marginBottom: AppDimensions.itemMargin / 2 },
  input: { flex: 1, paddingVertical: 4 },
  roundBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: { backgroundColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 6 },
  statusPill: { alignSelf: 'flex-start', marginTop: 8, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
});
