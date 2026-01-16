// components/AccessibleChatList.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  FlatList,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useTranslation } from 'react-i18next';

import { useAccessibilityContext } from '../context/AccessibilityContext';
import { useThemeColor } from '../hooks/useThemeColor';
import {
  getChatListStyles,
  getBadgeStyles,
  badgeColors,
} from '../constants/Styles';

export default function AccessibleChatList({ data, onPress }) {
  const { t } = useTranslation();

  // Use the same scaling mechanism as the rest of the app
  const { scaleFactor } = useAccessibilityContext();

  // Theme colors with safe fallbacks for dark mode
  const backgroundColor = useThemeColor({}, 'background') ?? '#000';
  const cardBackgroundColor = useThemeColor({}, 'cardBackground') ?? '#111';
  const textPrimary = useThemeColor({}, 'text') ?? '#FFFFFF';
  const textSecondary = useThemeColor({}, 'textSecondary') ?? textPrimary;
  const separatorColor = useThemeColor({}, 'separator') ?? 'rgba(127,127,127,0.35)';

  const chatStyles = getChatListStyles(scaleFactor);
  const badgeStyles = getBadgeStyles(scaleFactor);

  const renderItem = ({ item, index }) => {
    const last = item.lastAction || {};
    const senderOrSectionLabel = last.sender
      ? `${t('info.from')}: ${last.sender}`
      : `${t('info.section')}: ${last.section}`;

    const accessibilityLabel =
      `Group ${item.groupName}. Last action: ${t('action.' + last.type)}. ` +
      `${senderOrSectionLabel}. Date: ${last.date}. Time: ${last.time}.`;

    const badgeType = item.badge?.type || 'info';
    const currentBadgeColors = badgeColors[badgeType];

    const BadgeContent = () => {
      if (!item.badge?.visible) return null;
      if (item.badge?.icon) {
        return (
          <Icon
            name={item.badge.icon}
            type={item.badge.family}
            size={chatStyles.sizes.badgeIcon}
            color={currentBadgeColors.text}
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
        );
      }
      if (item.badge?.content) {
        return (
          <Text
            style={[badgeStyles.badgeText, { color: currentBadgeColors.text }]}
            accessibilityElementsHidden
            importantForAccessibility="no"
          >
            {item.badge.content}
          </Text>
        );
      }
      return null;
    };

    return (
      <Pressable
        style={[
          chatStyles.card,
          { backgroundColor: cardBackgroundColor, borderBottomColor: separatorColor },
        ]}
        onPress={() => onPress?.(item)}
        hitSlop={chatStyles.sizes.hitSlop}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Open group"
        testID={`chat-card-${index}`}
      >
        {/* Left: Avatar + Badge */}
        <View style={chatStyles.profileContainer} accessible={false}>
          {item.profileImage ? (
            <Image
              source={{ uri: item.profileImage }}
              style={[
                chatStyles.profileImage,
                { width: chatStyles.sizes.avatar, height: chatStyles.sizes.avatar },
              ]}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <View
              style={[
                chatStyles.profilePlaceholder,
                { width: chatStyles.sizes.avatar, height: chatStyles.sizes.avatar },
              ]}
            >
              <Icon
                name="group"
                type="material"
                size={chatStyles.sizes.avatarIcon}
                color={textSecondary}
                accessibilityElementsHidden
                importantForAccessibility="no"
              />
            </View>
          )}

          {item.badge?.visible && (
            <View
              style={[
                badgeStyles.badgeContainer,
                { backgroundColor: currentBadgeColors.background },
              ]}
            >
              <BadgeContent />
            </View>
          )}
        </View>

        {/* Right: Details */}
        <View style={chatStyles.detailsContainer}>
          <Text
            style={[chatStyles.title, { color: textPrimary }]}
            numberOfLines={1}
            maxFontSizeMultiplier={1.4}
          >
            {item.groupName}
          </Text>

          <Text
            style={[chatStyles.subtitle, { color: textSecondary }]}
            numberOfLines={1}
            maxFontSizeMultiplier={1.4}
          >
            {t('action.' + last.type)}
          </Text>

          {/* Line 1: From / Section */}
          <View style={chatStyles.infoRow} accessible={false}>
            <Text
              style={[chatStyles.infoText, { color: textSecondary }]}
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
            >
              {senderOrSectionLabel}
            </Text>
          </View>

          {/* Line 2: Icon + Date + Time */}
          <View style={chatStyles.metaRow} accessible={false}>
            {!!last.iconName && (
              <Icon
                name={last.iconName}
                type={last.iconType}
                size={chatStyles.sizes.metaIcon}
                color={textSecondary}
                containerStyle={chatStyles.metaIconContainer}
                accessibilityLabel={t('action.' + last.type)}
                accessibilityRole="image"
              />
            )}
            <Text
              style={[chatStyles.metaText, { color: textSecondary }]}
              numberOfLines={1}
              maxFontSizeMultiplier={1.2}
            >
              {last.date}
            </Text>
            <View style={[chatStyles.dotSeparator, { backgroundColor: separatorColor }]} />
            <Text
              style={[chatStyles.metaText, { color: textSecondary }]}
              numberOfLines={1}
              maxFontSizeMultiplier={1.2}
            >
              {last.time}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[chatStyles.container, { backgroundColor }]} accessibilityRole="list">
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => (
          <View style={[chatStyles.separator, { backgroundColor: separatorColor }]} />
        )}
        keyboardShouldPersistTaps="handled"
        accessibilityLabel="Group list"
      />
    </View>
  );
}
