// screens/family/FamDevicesScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../components/ScreenHeader';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { getScreenStyles } from '../../constants/style_family';
import { useProfile } from '../../context/ProfileContext';
import { useSubject } from '../../context/SubjectContext';
import DeviceListPanel from '../../components/DeviceListPanel';

export default function FamDevicesScreen() {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'background');
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const { profileManager } = useProfile();
  const { accessToken: idToken } = useSubject();

  if (!profileManager || !idToken) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={styles.scrollContainer}>
        <ScreenHeader
          title={t('family.devices.title', 'Devices')}
          subtitle={t('family.devices.subtitle', 'Registered devices')}
        />
      </ScrollView>
    );
  }

  const providerDid = profileManager.orgDidDoc.id;

  return (
    <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={styles.scrollContainer}>
      <ScreenHeader
        title={t('family.devices.title', 'Devices')}
        subtitle={t('family.devices.subtitle', 'Registered devices for this family')}
      />
      <DeviceListPanel
        providerDid={providerDid}
        idToken={idToken}
        searchDevices={profileManager.common.auth.searchDevices.bind(profileManager.common.auth)}
        getSearchResult={profileManager.common.auth.getDeviceSearchResult.bind(profileManager.common.auth)}
        labels={{
          title: t('family.devices.listTitle', 'Device list'),
          subtitle: t('family.devices.listSubtitle', 'Visible to legal representatives and IT roles'),
          search: t('family.devices.search', 'Search devices'),
          status: t('family.devices.status', 'Job thid'),
          empty: t('family.devices.empty', 'No devices found yet.'),
          deviceId: t('family.devices.deviceId', 'Device ID'),
          deviceName: t('family.devices.deviceName', 'Device name'),
          deviceOs: t('family.devices.deviceOs', 'OS'),
        }}
      />
    </ScrollView>
  );
}
