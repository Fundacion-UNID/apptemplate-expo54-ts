// screens/family/FamLoginMemberScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useMemo, useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';

import ScreenHeader from '../../components/ScreenHeader';
import ThemedInput from '../../components/ThemedTextInput';
import ThemedPicker from '../../components/ThemedPicker';
import ThemedButton from '../../components/ThemedButton';
import { useThemeColor } from '../../hooks/useThemeColor';
import { getScreenStyles } from '../../constants/style_family';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useProfile } from '../../context/ProfileContext';
import { Routes } from '../../constants/Routes';
import { Sector } from '../../constants/Schemas';
import { deriveProfileId } from '../../utils/profileId';
import { appWallet } from '../../platformServices';
import { entityMldsaJwk, entityMlkemJwk, entityUrnCds, legalRepDid } from '../../data/demo/sdkMockData';
import { MldsaPublicJwk, MlkemPublicJwk } from 'gdc-common-utils-ts/interfaces/Cryptography.types';
import { generateDidDocument_forMock, generateWellKnownServices_forMock, generateGatewayEntityServices_forMock } from 'gdc-sdk-client-ts';
import { getBaseUrlFromDidWeb, normalizeDidWeb } from 'gdc-common-utils-ts/utils/did';
import { HL7_PERSONAL_RELATIONSHIP_ROLES } from '../../data/hl7-personal-relationship';
import CountrySelector from '../../components/CountrySelector';
import ThemedText from '../../components/ThemedText';
import { hashEmail } from '../../utils/emailHash';
import { toDidRoleCode } from '../../utils/roleCoding';
import { resolveFamilyProviders } from '../../utils/providerDiscovery';

type FamilyLoginRouteParams = {
  FamilyLoginMember: { email: string; idToken: string; activationCode?: string; domain?: string; familyId?: string; role?: string };
};

export default function FamLoginMemberScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<FamilyLoginRouteParams, 'FamilyLoginMember'>>();
  const { email, idToken, activationCode, domain: domainFromRoute, familyId: familyIdFromRoute, role: roleFromRoute } = route.params || ({} as any);

  const backgroundColor = useThemeColor({}, 'background');
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const { initializeSession, operationMode, sdk, profileRegistry } = useProfile();

  const [country, setCountry] = useState('');
  const [providerId, setProviderId] = useState('');
  const [discoveredProviders, setDiscoveredProviders] = useState<Array<{ id: string; nameKey: string; label?: string; domain: string; did?: string; sector?: string; country?: string }>>([]);
  const [familyId, setFamilyId] = useState(familyIdFromRoute || '');
  const [role, setRole] = useState(roleFromRoute || '');
  const [isLoading, setIsLoading] = useState(false);
  const resetToDashboard = () =>
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: Routes.Family.Dashboard.name }],
      })
    );

  const providerOptions = useMemo(() => {
    if (!country) return [];
    const list = discoveredProviders;
    return list.map((provider) => ({
      id: provider.id,
      label: provider.label ? String(provider.label) : String(t(provider.nameKey, provider.id)),
      domain: provider.domain,
      did: provider.did,
    }));
  }, [country, t, discoveredProviders]);

  useEffect(() => {
    let mounted = true;
    if (!country) {
      setDiscoveredProviders([]);
      return;
    }
    (async () => {
      const providers = await resolveFamilyProviders(Sector.HEALTH_CARE);
      if (!mounted) return;
      setDiscoveredProviders(providers);
    })();
    return () => {
      mounted = false;
    };
  }, [country]);

  const selectedProvider = useMemo(() => {
    return providerOptions.find((provider) => provider.id === providerId) ?? providerOptions[0];
  }, [providerOptions, providerId]);

  useEffect(() => {
    if (!country) {
      setProviderId('');
      setRole('');
      return;
    }
    if (!providerOptions.length) {
      setProviderId('');
      return;
    }
    if (providerId && providerOptions.some((provider) => provider.id === providerId)) {
      return;
    }
    if (domainFromRoute) {
      const match = providerOptions.find((provider) => provider.domain === domainFromRoute);
      if (match) {
        setProviderId(match.id);
        return;
      }
    }
    setProviderId(providerOptions[0].id);
  }, [country, providerOptions, providerId, domainFromRoute]);

  const roleItems = useMemo(() => {
    const hl7Items = HL7_PERSONAL_RELATIONSHIP_ROLES.map((roleItem) => ({
      value: roleItem.code,
      label: String(t(`family.roles.${roleItem.code}.label`, roleItem.display)),
    }));
    const caregiverItem = {
      value: '5322',
      label: String(t('family.roles.CAREGIVER.label', 'Caregiver')),
    };
    return [caregiverItem, ...hl7Items];
  }, [t]);

  const domain = selectedProvider?.domain || domainFromRoute || '';
  const isCountrySelected = !!country;
  const isProviderSelected = !!selectedProvider?.domain;
  const canSubmit = !!email && !!idToken && isCountrySelected && isProviderSelected && !!familyId && !!role;

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert(t('common.error'), t('common.error.missingFields', 'Missing required fields.'));
      return;
    }
    setIsLoading(true);
    const providerDid = selectedProvider?.did || `did:web:${domain.toLowerCase()}`;
    try {
      const profileId = await deriveProfileId({
        appType: 'Family',
        providerDid,
        email,
        role,
      });
      const manager = await initializeSession({
        profileId,
        email,
        role,
        providerDid,
        appType: 'Family',
        familyId,
      });
      await manager?.updateProfile?.({
        profileDisplay: familyId,
        familyLabel: familyId,
      });

      if (profileRegistry) {
        const emailHash = await hashEmail(email);
        await profileRegistry.upsert({
          profileId,
          appType: 'family',
          providerDid,
          tenantId: familyId,
          role,
          profileDisplay: familyId,
          emailHash,
          lastUsedAt: new Date().toISOString(),
        });
      }

      if (manager?.profile?.status === 'pending') {
        navigation.navigate(Routes.Family.DeviceActivate.name, { idToken, activationCode });
      } else {
        resetToDashboard();
      }
    } catch (error) {
      if (operationMode === 'DEMO') {
        const profileId = await deriveProfileId({
          appType: 'Family',
          providerDid,
          email,
          role,
        });

        const emailHashForDid = await hashEmail(email);
        const roleCodeForDid = toDidRoleCode(role, 'ONESELF');
        const didController = normalizeDidWeb(`${providerDid}:family:${familyId}:z${emailHashForDid}:${roleCodeForDid}`);
        const publicKeys = await appWallet.provisionKeys(profileId);
        const mldsa = publicKeys.keys.find((key) => key.kty === 'AKP') as MldsaPublicJwk | undefined;
        const mlkem = publicKeys.keys.find((key) => key.kty === 'OKP') as MlkemPublicJwk | undefined;

        const mockDidDoc = generateDidDocument_forMock(
          providerDid,
          getBaseUrlFromDidWeb(providerDid),
          [generateWellKnownServices_forMock, generateGatewayEntityServices_forMock],
          {
            mldsa: mldsa ?? (entityMldsaJwk as MldsaPublicJwk),
            mlkem: mlkem ?? (entityMlkemJwk as MlkemPublicJwk),
            alsoKnownAs: entityUrnCds
          },
          [didController]
        );
        sdk.addMockDidDocument(providerDid, mockDidDoc);
        const familyDid = normalizeDidWeb(`${providerDid}:family:${familyId}`);
        const familyDidDoc = generateDidDocument_forMock(
          familyDid,
          getBaseUrlFromDidWeb(familyDid),
          [generateWellKnownServices_forMock],
          {
            mldsa: mldsa ?? (entityMldsaJwk as MldsaPublicJwk),
            mlkem: mlkem ?? (entityMlkemJwk as MlkemPublicJwk),
          },
          [didController]
        );
        sdk.addMockDidDocument(familyDid, familyDidDoc);
        const manager = await initializeSession({
          profileId,
          email,
          role,
          providerDid,
          appType: 'Family',
          familyId,
        });
        await manager?.updateProfile?.({
          profileDisplay: familyId,
          familyLabel: familyId,
        });
        if (profileRegistry) {
          const emailHash = await hashEmail(email);
          await profileRegistry.upsert({
            profileId,
            appType: 'family',
            providerDid,
            tenantId: familyId,
            role,
            profileDisplay: familyId,
            emailHash,
            lastUsedAt: new Date().toISOString(),
          });
        }
        if (manager?.profile?.status === 'pending') {
          navigation.navigate(Routes.Family.DeviceActivate.name, { idToken, activationCode });
        } else {
          resetToDashboard();
        }
      } else {
        Alert.alert(t('common.error'), (error as Error).message || t('common.unknownError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={styles.scrollContainer}>
      <ScreenHeader
        title={t('family.screens.login.title')}
        subtitle={t('family.screens.login.subtitle')}
      />

      <View style={{ width: '100%', padding: 16 }}>
        <ThemedText style={styles.formLabel}>{t('family.screens.login.country-label')}</ThemedText>
        <CountrySelector
          value={country}
          onChange={setCountry}
          placeholder={t('family.screens.login.country-placeholder')}
          allowedCountries={['ES', 'MX', 'US', 'CA', 'GB']}
        />

        <ThemedText style={styles.formLabel}>{t('family.screens.login.provider-label')}</ThemedText>
        <ThemedPicker
          selectedValue={providerId}
          onValueChange={setProviderId}
          items={providerOptions.map((provider) => ({
            value: provider.id,
            label: provider.label,
          }))}
          placeholder={t('family.screens.login.provider-placeholder')}
          disabled={!isCountrySelected}
          accessibilityLabel={t('family.screens.login.provider-label')}
        />

        <ThemedText style={[styles.formLabel, { marginTop: 8 }]}>{t('family.screens.login.familyId-label')}</ThemedText>
        <ThemedInput
          placeholder={t('family.screens.login.familyId-placeholder')}
          value={familyId}
          onChangeText={setFamilyId}
          autoCapitalize="none"
          editable={isProviderSelected}
        />

        <ThemedText style={styles.formLabel}>{t('family.screens.login.role-label')}</ThemedText>
        <ThemedPicker
          selectedValue={role}
          onValueChange={setRole}
          items={roleItems}
          placeholder={t('family.screens.login.role-placeholder')}
          disabled={!isProviderSelected}
          accessibilityLabel={t('family.screens.login.role-label')}
        />

        <ThemedButton
          title={t('family.screens.login.continue')}
          onPress={handleSubmit}
          disabled={!canSubmit || isLoading}
          style={{ marginTop: 16 }}
        />
      </View>
    </ScrollView>
  );
}
