// screens/organization/OrgLicensesScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';
import ThemedText from '../../components/ThemedText';
import ThemedInput from '../../components/ThemedTextInput';
import ThemedPicker from '../../components/ThemedPicker';
import ThemedButton from '../../components/ThemedButton';
import { useThemeColor } from '../../hooks/useThemeColor';
import { getScreenStyles } from '../../constants/Styles';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useProfile } from '../../context/ProfileContext';
import { useSubject } from '../../context/SubjectContext';
import { getIscoRoleLabelKey, roles as roleGroups } from '../../constants/Roles';
import { Routes } from '../../constants/Routes';
import { createVaultForProfile } from '../../platformServices';
import { JobRequest, JobStatus } from 'gdc-common-utils-ts/models/confidential-job';
import { useEntitlements } from '../../context/EntitlementContext';

export default function OrgLicensesScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const backgroundColor = useThemeColor({}, 'background');

  const { profileManager } = useProfile();
  const { accessToken: idToken } = useSubject();
  const { employeeAvailable, consumeOne } = useEntitlements();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string>('');
  const [type, setType] = useState<'mobile' | 'web'>('mobile');
  const [isLoading, setIsLoading] = useState(false);

  const [issuedThid, setIssuedThid] = useState<string | null>(null);
  const [activationCode, setActivationCode] = useState<string | null>(null);
  const [job, setJob] = useState<JobRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!profileManager || !issuedThid) return;

    const jobs = await profileManager.queryJobs({
      where: [{ attribute: 'thid', equals: issuedThid }],
      limit: 1,
    });

    const found = jobs?.[0] ?? null;
    setJob(found);
    if (!found || found.status !== JobStatus.COMPLETED) return;

    const responseMessageId = (found as any).responseMessageId as string | undefined;
    if (!responseMessageId) return;

    const vault = createVaultForProfile(profileManager.profile.id);
    await vault.initialize();
    const message = await vault.get<any>('messages', responseMessageId);
    const responseContent = message?.content;

    const entry = responseContent?.body?.data?.[0] || responseContent?.body?.entry?.[0];
    const claims = entry?.meta?.claims;
    const codeFromClaims = claims?.['org.schema.IndividualProduct.serialNumber'];
    const codeFromId = entry?.id;
    const foundCode = (typeof codeFromClaims === 'string' && codeFromClaims) || (typeof codeFromId === 'string' && codeFromId) || null;
    if (foundCode) setActivationCode(foundCode);
  }, [profileManager, issuedThid]);

  useEffect(() => {
    if (!issuedThid) return;
    refresh();
    const handle = setInterval(() => {
      refresh().catch(() => undefined);
    }, 2500);
    return () => clearInterval(handle);
  }, [issuedThid, refresh]);

  const roleItems = useMemo(
    () =>
      Object.entries(roleGroups.managing).map(([roleKey, roleValue]) => ({
        value: roleValue,
        label: t(getIscoRoleLabelKey(roleValue), roleKey),
      })),
    [t]
  );

  const typeItems = useMemo(
    () => [
      { label: t('common.mobile', 'Mobile'), value: 'mobile' },
      { label: t('common.web', 'Web'), value: 'web' },
    ],
    [t]
  );

  const canIssue = useMemo(() => {
    return !!profileManager?.orgAdmin?.admin && !!idToken && !!email && !!role && employeeAvailable > 0;
  }, [profileManager, idToken, email, role, employeeAvailable]);

  const handleIssue = useCallback(async () => {
    if (!profileManager?.orgAdmin?.admin) {
      setError('Admin services are not available for this session.');
      return;
    }
    if (!idToken) {
      setError('Authorization token is missing.');
      return;
    }
    if (employeeAvailable <= 0) {
      setError('No employee licenses available. Complete purchase/allocation first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIssuedThid(null);
    setActivationCode(null);
    try {
      const providerDid = profileManager.orgDidDoc.id;
      const { thid } = await profileManager.orgAdmin.admin.issueLicenseActivationCode(providerDid, idToken, {
        email,
        role,
        userClass: 'employee',
        type,
      });
      setIssuedThid(thid);
      consumeOne('employee');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [profileManager, idToken, email, role, type, employeeAvailable, consumeOne]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScreenHeader
        title={t('organization.screens.licenses.title', 'Licenses')}
        subtitle={t('organization.screens.licenses.subtitle', 'Issue device activation codes for employees')}
        description={t(
          'organization.screens.licenses.description',
          'This creates an asynchronous job. The activation code will be returned in the final response.'
        )}
      />

      <View style={{ padding: 16, width: '100%' }}>
        <ThemedText style={styles.formLabel}>{t('common.email', 'Email')}</ThemedText>
        <ThemedInput value={email} onChangeText={setEmail} placeholder="name@example.com" style={{}} />

        <ThemedText style={[styles.formLabel, { marginTop: 12 }]}>{t('common.role', 'Role')}</ThemedText>
        <ThemedPicker
          selectedValue={role}
          onValueChange={setRole}
          items={[{ label: t('pickers.select', 'Select'), value: '' }, ...roleItems]}
          accessibilityLabel={t('common.role', 'Role')}
        />

        <ThemedText style={[styles.formLabel, { marginTop: 12 }]}>{t('common.deviceType', 'Device type')}</ThemedText>
        <ThemedPicker selectedValue={type} onValueChange={setType as any} items={typeItems} accessibilityLabel="Device type" />

        {error && (
          <ThemedText style={{ marginTop: 12, opacity: 0.9 }}>
            {error}
          </ThemedText>
        )}
        <ThemedText style={{ marginTop: 12, opacity: 0.8 }}>
          {t('organization.screens.licenses.availableLicenses', 'Available employee licenses')}: {employeeAvailable}
        </ThemedText>

        {issuedThid && (
          <>
            <ThemedText style={{ marginTop: 12, opacity: 0.8 }}>
              {t('organization.screens.licenses.jobThid', 'Job thid')}:
            </ThemedText>
            <ThemedText selectable style={{ fontFamily: 'monospace', marginTop: 6 }}>
              {issuedThid}
            </ThemedText>
          </>
        )}

        {issuedThid && job?.status && (
          <ThemedText style={{ marginTop: 12, opacity: 0.8 }}>
            {t('organization.screens.licenses.status', 'Status')}: {job.status}
          </ThemedText>
        )}

        {activationCode && (
          <>
            <ThemedText style={{ marginTop: 12, opacity: 0.8 }}>
              {t('organization.screens.licenses.activationCode', 'Activation code')}:
            </ThemedText>
            <ThemedText selectable style={{ fontFamily: 'monospace', marginTop: 6 }}>
              {activationCode}
            </ThemedText>
            <ThemedButton
              title={t('organization.screens.licenses.activateDevice', 'Activate device')}
              onPress={() => {
                if (!idToken) return;
                navigation.navigate(Routes.Organization.DeviceActivate.name, {
                  idToken,
                  activationCode,
                });
              }}
              disabled={!idToken}
              style={{ marginTop: 16 }}
            />
          </>
        )}

        {isLoading ? (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <ThemedButton
            title={t('organization.screens.licenses.issue', 'Issue activation code')}
            onPress={handleIssue}
            disabled={!canIssue}
            style={{ marginTop: 20 }}
          />
        )}
      </View>
    </View>
  );
}
