// screens/organization/OrgDevicesScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../components/ScreenHeader';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { getScreenStyles } from '../../constants/Styles';
import { useProfile } from '../../context/ProfileContext';
import { useSubject } from '../../context/SubjectContext';
import DeviceListPanel from '../../components/DeviceListPanel';

export default function OrgDevicesScreen() {
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
          title={t('organization.screens.devices.title', 'Devices')}
          subtitle={t('organization.screens.devices.subtitle', 'Registered devices')}
        />
      </ScrollView>
    );
  }

  const providerDid = profileManager.orgDidDoc.id;

  return (
    <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={styles.scrollContainer}>
      <ScreenHeader
        title={t('organization.screens.devices.title', 'Devices')}
        subtitle={t('organization.screens.devices.subtitle', 'Registered devices for this organization')}
      />
      <DeviceListPanel
        providerDid={providerDid}
        idToken={idToken}
        searchDevices={profileManager.common.auth.searchDevices.bind(profileManager.common.auth)}
        getSearchResult={profileManager.common.auth.getDeviceSearchResult.bind(profileManager.common.auth)}
        labels={{
          title: t('organization.screens.devices.listTitle', 'Device list'),
          subtitle: t('organization.screens.devices.listSubtitle', 'Visible to legal representatives and IT roles'),
          search: t('organization.screens.devices.search', 'Search devices'),
          status: t('organization.screens.devices.status', 'Job thid'),
          empty: t('organization.screens.devices.empty', 'No devices found yet.'),
          deviceId: t('organization.screens.devices.deviceId', 'Device ID'),
          deviceName: t('organization.screens.devices.deviceName', 'Device name'),
          deviceOs: t('organization.screens.devices.deviceOs', 'OS'),
        }}
      />
    </ScrollView>
  );
}
