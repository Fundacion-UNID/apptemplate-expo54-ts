// components/ActorListCard.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { View, Text, Pressable, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { useThemeColor } from '../hooks/useThemeColor';
import { getListCardStyles, getBadgeStyles, badgeColors } from '../constants/Styles';

type BadgeInfo = {
  visible?: boolean;
  type?: keyof typeof badgeColors;
  icon?: string;
  family?: string;
  content?: string;
};

type MetaInfo = {
  iconName?: string;
  iconType?: string;
  date?: string;
  time?: string;
};

type ActorListCardProps = {
  avatarUri?: string;
  title: string;
  subtitle?: string;
  lines?: string[];
  meta?: MetaInfo;
  badge?: BadgeInfo;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
};

export default function ActorListCard({
  avatarUri,
  title,
  subtitle,             // optional
  lines = [],           // array of strings, each renders on its own line
  meta,                 // optional: { iconName, iconType, date, time }
  badge,                // optional: { visible, type, icon, family, content }
  onPress,
  accessibilityLabel,
  accessibilityHint = 'Open item',
  testID,
}: ActorListCardProps) {
  const { scaleFactor } = useAccessibilityContext();

  // Theme colors
  const screenBg = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const textPrimary = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const separatorColor = useThemeColor({}, 'separator');

  const styles = getListCardStyles(scaleFactor);
  const badgeStyles = getBadgeStyles(scaleFactor);

  const cardBg = cardBackground || screenBg;
  const badgeType = badge?.type || 'info';
  const currentBadgeColors = badgeColors[badgeType];

  const hasMeta = Boolean(meta?.date || meta?.time || meta?.iconName);

  const BadgeContent = () => {
    if (!badge?.visible) return null;
    if (badge?.icon) {
      return (
        <Icon
          name={badge.icon}
          type={badge.family}
          size={styles.sizes.badgeIcon}
          color={currentBadgeColors.text}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
      );
    }
    if (badge?.content) {
      return (
        <Text
          style={[badgeStyles.badgeText, { color: currentBadgeColors.text }]}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {badge.content}
        </Text>
      );
    }
    return null;
  };

  return (
    <Pressable
      style={[styles.card, { backgroundColor: cardBg, borderBottomColor: separatorColor }]}
      onPress={onPress}
      hitSlop={styles.sizes.hitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
    >
      {/* Left: avatar + badge */}
      <View style={styles.profileContainer} accessible={false}>
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            style={[styles.profileImage, { width: styles.sizes.avatar, height: styles.sizes.avatar }]}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View
            style={[styles.profilePlaceholder, { width: styles.sizes.avatar, height: styles.sizes.avatar }]}
          >
            <Icon
              name="person"
              type="material"
              size={styles.sizes.avatarIcon}
              color={textSecondary}
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
          </View>
        )}

        {badge?.visible && (
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

      {/* Right: details */}
      <View style={styles.detailsContainer}>
        <Text style={[styles.title, { color: textPrimary }]} numberOfLines={1} maxFontSizeMultiplier={1.4}>
          {title}
        </Text>

        {!!subtitle && (
          <Text style={[styles.subtitle, { color: textSecondary }]} numberOfLines={1} maxFontSizeMultiplier={1.4}>
            {subtitle}
          </Text>
        )}

        {/* Lines (generic detail lines) */}
        {lines.map((line, idx) => (
          <View key={`line-${idx}`} style={styles.infoRow} accessible={false}>
            <Text
              style={[styles.infoText, { color: textSecondary }]}
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
            >
              {line}
            </Text>
          </View>
        ))}

        {/* Meta row: icon + date + time */}
        {hasMeta && (
          <View style={styles.metaRow} accessible={false}>
            {!!meta?.iconName && (
              <Icon
                name={meta.iconName}
                type={meta.iconType}
                size={styles.sizes.metaIcon}
                color={textSecondary}
                containerStyle={styles.metaIconContainer}
                accessibilityRole="image"
              />
            )}
            {!!meta?.date && (
              <Text style={[styles.metaText, { color: textSecondary }]} numberOfLines={1} maxFontSizeMultiplier={1.2}>
                {meta.date}
              </Text>
            )}
            {meta?.date && meta?.time && (
              <View style={[styles.dotSeparator, { backgroundColor: separatorColor }]} />
            )}
            {!!meta?.time && (
              <Text style={[styles.metaText, { color: textSecondary }]} numberOfLines={1} maxFontSizeMultiplier={1.2}>
                {meta.time}
              </Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}
