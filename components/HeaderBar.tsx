// components/HeaderBar.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Icon } from 'react-native-elements';
import { useThemeColor } from '../hooks/useThemeColor';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../context/ProfileContext';
import { useAppType } from '../context/AppTypeContext';
import { extractRoleCode } from '../utils/roleCoding';

const routeTitleKeys: Record<string, string> = {
  FamilyDashboard: 'family.screens.dashboard.title',
  FamilyCommunications: 'family.screens.communications.title',
  FamilyIdentityMenu: 'family.screens.identityMenu.title',
  FamilyDocumentsMenu: 'family.screens.documents.title',
  FamilyDataSpace: 'family.screens.dataSpace.title',
  FamilyAccount: 'family.screens.account.title',
  OrgDashboard: 'organization.screens.dashboard.title',
  OrgCommunications: 'organization.screens.communications.title',
  OrgIdentityMenu: 'organization.screens.identity.title',
  OrgMyEntity: 'organization.screens.myEntity.title',
};

const prettifyRouteName = (name: string): string =>
  name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^Org\s?/, '')
    .replace(/^Family\s?/, '')
    .trim();

const getFamilyIdFromDid = (did?: string): string => {
  const raw = (did || '').trim();
  if (!raw) return '';
  const parts = raw.split(':');
  const idx = parts.findIndex((part) => part === 'family');
  if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
  return '';
};

export default function HeaderBar({ navigation, route }: NativeStackHeaderProps) {
  const { t } = useTranslation();
  const { profile } = useProfile();
  const { appType } = useAppType();

  const iconColor = useThemeColor({}, 'text');
  const bgColor = useThemeColor({}, 'background');

  // The navigator stack gives us a `canGoBack` method
  const canGoBack = navigation.canGoBack();
  const title = t(routeTitleKeys[route.name], prettifyRouteName(route.name));

  const roleCode = extractRoleCode(profile?.role || '', '').toUpperCase();
  const familyDisplay = (profile as any)?.profileDisplay || (profile as any)?.familyLabel || getFamilyIdFromDid(profile?.did);
  const orgDisplay = (profile as any)?.profileDisplay || profile?.providerDid || profile?.email || '';
  const contextLine =
    appType === 'family'
      ? [familyDisplay, roleCode].filter(Boolean).join(' | ')
      : [orgDisplay, roleCode].filter(Boolean).join(' | ');

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
          {title}
        </Text>
        {!!contextLine && (
          <Text style={[styles.subtitle, { color: iconColor }]} numberOfLines={1}>
            {contextLine}
          </Text>
        )}
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
    height: 68,
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
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    opacity: 0.75,
  },
});
