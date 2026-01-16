// screens/common/ProfileSelectScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Alert, Pressable } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import ScreenHeader from '../../components/ScreenHeader';
import ThemedText from '../../components/ThemedText';
import ThemedButton from '../../components/ThemedButton';
import { getScreenStyles } from '../../constants/Styles';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useProfile } from '../../context/ProfileContext';
import { Routes } from '../../constants/Routes';
import { hashEmail } from '../../utils/emailHash';
import { ProfileRegistryEntry } from 'gdc-sdk-client-ts';
import { deriveProfileId } from '../../utils/profileId';


type ProfileSelectRouteParams = {
  OrgProfileSelect?: { email: string; idToken: string };
  FamilyProfileSelect?: { email: string; idToken: string };
};

const formatLastUsed = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const resolveProviderLabel = (providerDid?: string) => {
  if (!providerDid) return '';
  return providerDid.replace(/^did:web:/, '').replace(/:/g, '/');
};

export default function ProfileSelectScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ProfileSelectRouteParams, keyof ProfileSelectRouteParams>>();
  const params = route.params || ({} as any);
  const { email, idToken } = params;
  const appType = route.name === Routes.Organization.ProfileSelect.name ? 'organization' : 'family';

  const { profileRegistry, initializeSession } = useProfile();
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  const [profiles, setProfiles] = useState<ProfileRegistryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!email || !idToken || !profileRegistry) return;
    let mounted = true;
    const load = async () => {
      const emailHash = await hashEmail(email);
      const results = await profileRegistry.list({
        where: [
          { attribute: 'emailHash', equals: emailHash },
          { attribute: 'appType', equals: appType },
        ],
        orderBy: { attribute: 'lastUsedAt', direction: 'desc' },
      });
      if (mounted) setProfiles(results);
    };
    load().catch((error) => console.warn('[ProfileSelect] Failed to load profiles:', error));
    return () => {
      mounted = false;
    };
  }, [appType, email, idToken, profileRegistry]);

  const handleSelect = async (entry: ProfileRegistryEntry) => {
    if (!email || !idToken) {
      Alert.alert(t('common.error'), t('common.error.missingFields', 'Missing required fields.'));
      return;
    }
    if (!entry.providerDid || !entry.role) {
      Alert.alert(t('common.error'), t('common.error.missingFields', 'Missing required fields.'));
      return;
    }

    setIsLoading(true);
    try {
      const profileId = entry.profileId || (await deriveProfileId({
        appType: appType === 'family' ? 'Family' : 'Organization',
        providerDid: entry.providerDid,
        email,
        role: entry.role,
      }));

      const manager = await initializeSession({
        profileId,
        email,
        role: entry.role,
        providerDid: entry.providerDid,
        appType: appType === 'family' ? 'Family' : 'Organization',
      });

      if (profileRegistry && entry.profileId) {
        await profileRegistry.markLastUsed(entry.profileId);
      }

      if (appType === 'family') {
        if (manager?.profile?.status === 'pending') {
          navigation.navigate(Routes.Family.DeviceActivate.name, { idToken });
        } else {
          navigation.navigate(Routes.Family.Dashboard.name);
        }
      } else {
        if (manager?.profile?.status === 'pending') {
          navigation.navigate(Routes.Organization.DeviceActivate.name, { idToken });
        } else {
          navigation.navigate(Routes.Organization.Dashboard.name);
        }
      }
    } catch (error) {
      Alert.alert(t('common.error'), (error as Error).message || t('common.unknownError'));
    } finally {
      setIsLoading(false);
    }
  };

  const emptyMessage = appType === 'family'
    ? t('common.profileSelect.emptyFamily')
    : t('common.profileSelect.emptyOrganization');

  const handleUseAnother = () => {
    if (!email || !idToken) {
      Alert.alert(t('common.error'), t('common.error.missingFields', 'Missing required fields.'));
      return;
    }
    if (appType === 'family') {
      navigation.navigate(Routes.Family.Join.name, { email, idToken });
    } else {
      navigation.navigate(Routes.Organization.LoginRoleSelect.name, { email, idToken });
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={styles.scrollContainer}>
      <ScreenHeader
        title={t('common.profileSelect.title')}
        subtitle={t('common.profileSelect.subtitle')}
      />

      <View style={{ width: '100%', padding: 16 }}>
        {profiles.length === 0 ? (
          <ThemedText style={{ opacity: 0.7 }}>{emptyMessage}</ThemedText>
        ) : (
          profiles.map((entry) => (
            <Pressable
              key={entry.profileId}
              onPress={() => handleSelect(entry)}
              style={{
                borderWidth: 1,
                borderColor: tintColor,
                borderRadius: 10,
                padding: 12,
                marginBottom: 12,
              }}
              disabled={isLoading}
            >
              <ThemedText style={{ fontWeight: '600', marginBottom: 4 }}>
                {entry.profileDisplay || entry.tenantId || entry.providerDid}
              </ThemedText>
              {entry.role ? (
                <ThemedText style={{ opacity: 0.8 }}>
                  {t('common.role', 'Role')}: {entry.role}
                </ThemedText>
              ) : null}
              {entry.tenantId ? (
                <ThemedText style={{ opacity: 0.8 }}>
                  {t('common.profileSelect.tenantId')}: {entry.tenantId}
                </ThemedText>
              ) : null}
              {entry.providerDid ? (
                <ThemedText style={{ opacity: 0.8 }}>
                  {t('common.profileSelect.provider')}: {resolveProviderLabel(entry.providerDid)}
                </ThemedText>
              ) : null}
              {entry.lastUsedAt ? (
                <ThemedText style={{ opacity: 0.7, marginTop: 4 }}>
                  {t('common.profileSelect.lastUsed', { date: formatLastUsed(entry.lastUsedAt) })}
                </ThemedText>
              ) : null}
            </Pressable>
          ))
        )}

        <ThemedButton
          title={t('common.profileSelect.addProfile')}
          onPress={handleUseAnother}
          disabled={isLoading}
          style={{ marginTop: 8 }}
        />
      </View>
    </ScrollView>
  );
}
