// screens/family/FamMembersScreen.tsx
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
import { getScreenStyles } from '../../constants/style_family';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useProfile } from '../../context/ProfileContext';
import { useSubject } from '../../context/SubjectContext';
import { Routes } from '../../constants/Routes';
import { createVaultForProfile } from '../../platformServices';
import { JobRequest, JobStatus } from 'gdc-common-utils-ts/models/confidential-job';
import { useEntitlements } from '../../context/EntitlementContext';

export default function FamMembersScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const backgroundColor = useThemeColor({}, 'background');

  const { profileManager } = useProfile();
  const { accessToken: idToken } = useSubject();
  const { memberAvailable, consumeOne } = useEntitlements();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
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
    const foundCode =
      (typeof codeFromClaims === 'string' && codeFromClaims) ||
      (typeof codeFromId === 'string' && codeFromId) ||
      null;
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

  const typeItems = useMemo(
    () => [
      { label: t('common.mobile', 'Mobile'), value: 'mobile' },
      { label: t('common.web', 'Web'), value: 'web' },
    ],
    [t]
  );

  const canIssue = useMemo(() => {
    return !!profileManager?.familyAdmin?.it && !!idToken && !!email && !!role && memberAvailable > 0;
  }, [profileManager, idToken, email, role, memberAvailable]);

  const handleIssue = useCallback(async () => {
    const familyAdmin = profileManager?.familyAdmin?.it;
    if (!familyAdmin) {
      setError('Family admin IT services are not available for this session.');
      return;
    }
    if (!idToken) {
      setError('Authorization token is missing.');
      return;
    }
    if (memberAvailable <= 0) {
      setError('No member licenses available. Complete purchase/allocation first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIssuedThid(null);
    setActivationCode(null);
    try {
      const providerDid = profileManager.orgDidDoc.id;
      const { thid } = await familyAdmin.issueLicenseActivationCode(providerDid, idToken, {
        email,
        role,
        userClass: 'individual',
        type,
      });
      setIssuedThid(thid);
      consumeOne('member');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [profileManager, idToken, email, role, type, memberAvailable, consumeOne]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScreenHeader
        title={t('family.screens.members.title', 'Family members')}
        subtitle={t('family.screens.members.subtitle', 'Issue activation codes for family members')}
        description={t(
          'family.screens.members.description',
          'This creates an asynchronous job. The activation code will be returned in the final response.'
        )}
      />

      <View style={{ padding: 16, width: '100%' }}>
        <ThemedText style={styles.formLabel}>{t('common.email', 'Email')}</ThemedText>
        <ThemedInput value={email} onChangeText={setEmail} placeholder="name@example.com" style={{}} />

        <ThemedText style={[styles.formLabel, { marginTop: 12 }]}>
          {t('family.screens.members.role', 'Role (system|code)')}
        </ThemedText>
        <ThemedInput value={role} onChangeText={setRole} placeholder="v3-RoleCode|FAMMEMB" style={{}} />

        <ThemedText style={[styles.formLabel, { marginTop: 12 }]}>{t('common.deviceType', 'Device type')}</ThemedText>
        <ThemedPicker
          selectedValue={type}
          onValueChange={setType as any}
          items={typeItems}
          accessibilityLabel={t('common.deviceType', 'Device type')}
        />

        {error && (
          <ThemedText style={{ marginTop: 12, opacity: 0.9 }}>
            {error}
          </ThemedText>
        )}
        <ThemedText style={{ marginTop: 12, opacity: 0.8 }}>
          {t('family.screens.members.availableLicenses', 'Available member licenses')}: {memberAvailable}
        </ThemedText>

        {issuedThid && (
          <>
            <ThemedText style={{ marginTop: 12, opacity: 0.8 }}>
              {t('family.screens.members.jobThid', 'Job thid')}:
            </ThemedText>
            <ThemedText selectable style={{ fontFamily: 'monospace', marginTop: 6 }}>
              {issuedThid}
            </ThemedText>
          </>
        )}

        {issuedThid && job?.status && (
          <ThemedText style={{ marginTop: 12, opacity: 0.8 }}>
            {t('family.screens.members.status', 'Status')}: {job.status}
          </ThemedText>
        )}

        {activationCode && (
          <>
            <ThemedText style={{ marginTop: 12, opacity: 0.8 }}>
              {t('family.screens.members.activationCode', 'Activation code')}:
            </ThemedText>
            <ThemedText selectable style={{ fontFamily: 'monospace', marginTop: 6 }}>
              {activationCode}
            </ThemedText>
            <ThemedButton
              title={t('family.screens.members.activateDevice', 'Activate device')}
              onPress={() => {
                if (!idToken) return;
                navigation.navigate(Routes.Family.DeviceActivate.name, {
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
            title={t('family.screens.members.issue', 'Issue activation code')}
            onPress={handleIssue}
            disabled={!canIssue}
            style={{ marginTop: 20 }}
          />
        )}
      </View>
    </View>
  );
}
