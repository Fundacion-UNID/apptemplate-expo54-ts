// screens/family/FamJoinScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useMemo, useState, useEffect } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, RouteProp } from '@react-navigation/native';

import ScreenHeader from '../../components/ScreenHeader';
import ThemedInput from '../../components/ThemedTextInput';
import ThemedButton from '../../components/ThemedButton';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { getScreenStyles } from '../../constants/style_family';
import { Routes } from '../../constants/Routes';
import CountrySelector from '../../components/CountrySelector';
import ThemedText from '../../components/ThemedText';
import ThemedPicker from '../../components/ThemedPicker';
import { FamilyProvidersByCountry } from '../../constants/Providers';
import { HL7_PERSONAL_RELATIONSHIP_ROLES } from '../../data/hl7-personal-relationship';
import { useProfile } from '../../context/ProfileContext';
import { deriveProfileId } from '../../utils/profileId';
import { appWallet } from '../../platformServices';
import { hashEmail } from '../../utils/emailHash';
import { entityMldsaJwk, entityMlkemJwk } from 'gdc-sdk-client-ts/data/demo/entityKeys.data';
import { MldsaPublicJwk, MlkemPublicJwk } from 'gdc-common-utils-ts/interfaces/Cryptography.types';
import { entityUrnCds } from 'gdc-sdk-client-ts/data/demo/didProvider.data';
import { generateDidDocument_forMock, generateWellKnownServices_forMock, generateGatewayEntityServices_forMock } from 'gdc-sdk-client-ts';
import { getBaseUrlFromDidWeb, normalizeDidWeb } from 'gdc-common-utils-ts/utils/did';

type FamilyJoinRouteParams = {
  FamilyJoin: { email: string; idToken: string };
};

export default function FamilyJoinScreen({ navigation }) {
  const route = useRoute<RouteProp<FamilyJoinRouteParams, 'FamilyJoin'>>();
  const { email, idToken } = route.params || ({} as any);
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'background');
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const { initializeSession, operationMode, sdk, profileRegistry } = useProfile();

  const [country, setCountry] = useState('');
  const [providerId, setProviderId] = useState('');
  const [familyId, setFamilyId] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const providerOptions = useMemo(() => {
    if (!country) return [];
    const list = FamilyProvidersByCountry[country as keyof typeof FamilyProvidersByCountry] ?? [];
    return list.map((provider) => ({
      id: provider.id,
      label: String(t(provider.nameKey, provider.id)),
      domain: provider.domain,
    }));
  }, [country, t]);

  const selectedProvider = useMemo(() => {
    return providerOptions.find((provider) => provider.id === providerId) ?? providerOptions[0];
  }, [providerOptions, providerId]);

  const roleItems = useMemo(() => {
    const hl7Items = HL7_PERSONAL_RELATIONSHIP_ROLES.map((roleItem) => ({
      value: `HL7|${roleItem.code}`,
      label: String(t(`family.roles.${roleItem.code}.label`, roleItem.display)),
    }));
    const caregiverItem = {
      value: 'ISCO-08|5322',
      label: String(t('family.roles.CAREGIVER.label', 'Caregiver')),
    };
    return [caregiverItem, ...hl7Items];
  }, [t]);

  const isCountrySelected = !!country;
  const isProviderSelected = !!selectedProvider?.domain;
  const domain = selectedProvider?.domain || '';

  const handleSubmit = async () => {
    if (!email || !idToken || !domain || !familyId || !role) {
      Alert.alert(t('common.error'), t('common.error.missingFields', 'Missing required fields.'));
      return;
    }
    setIsLoading(true);
    const providerDid = `did:web:${domain.toLowerCase()}`;
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
        navigation.navigate(Routes.Family.DeviceActivate.name, { idToken });
      } else {
        navigation.navigate(Routes.Family.Dashboard.name);
      }
    } catch (error) {
      if (operationMode === 'DEMO') {
        const profileId = await deriveProfileId({
          appType: 'Family',
          providerDid,
          email,
          role,
        });
        const multibaseId = `z${profileId.replace(/-/g, '')}`;
        const didController = normalizeDidWeb(`${providerDid}:family:${familyId}:multibase:${multibaseId}:${role}`);
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
          navigation.navigate(Routes.Family.DeviceActivate.name, { idToken });
        } else {
          navigation.navigate(Routes.Family.Dashboard.name);
        }
      } else {
        Alert.alert(t('common.error'), (error as Error).message || t('common.unknownError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!email || !idToken) {
      Alert.alert(t('common.error'), t('common.error.missingFields', 'Missing required fields.'));
      navigation.navigate(Routes.Family.LoginAuth.name, { nextRoute: Routes.Family.Join.name });
    }
  }, [email, idToken, navigation, t]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={styles.scrollContainer}>
      <ScreenHeader
        title={t('family.screens.join.title')}
        subtitle={t('family.screens.join.subtitle')}
      />

      <View style={{ width: '100%', padding: 16 }}>
        <ThemedText style={styles.formLabel}>{t('family.screens.join.country-label')}</ThemedText>
        <CountrySelector
          value={country}
          onChange={setCountry}
          placeholder={t('family.screens.join.country-placeholder')}
          allowedCountries={['ES', 'MX', 'US', 'CA', 'GB']}
        />

        <ThemedText style={styles.formLabel}>{t('family.screens.join.provider-label')}</ThemedText>
        <ThemedPicker
          selectedValue={providerId}
          onValueChange={setProviderId}
          items={providerOptions.map((provider) => ({
            value: provider.id,
            label: provider.label,
          }))}
          placeholder={t('family.screens.join.provider-placeholder')}
          disabled={!isCountrySelected}
          accessibilityLabel={t('family.screens.join.provider-label')}
        />

        <ThemedText style={[styles.formLabel, { marginTop: 8 }]}>{t('family.screens.join.familyId-label')}</ThemedText>
        <ThemedInput
          placeholder={t('family.screens.join.familyId-placeholder')}
          value={familyId}
          onChangeText={setFamilyId}
          autoCapitalize="none"
          editable={isProviderSelected}
        />

        <ThemedText style={styles.formLabel}>{t('family.screens.join.role-label')}</ThemedText>
        <ThemedPicker
          selectedValue={role}
          onValueChange={setRole}
          items={roleItems}
          placeholder={t('family.screens.join.role-placeholder')}
          disabled={!isProviderSelected}
          accessibilityLabel={t('family.screens.join.role-label')}
        />

        <ThemedButton
          title={t('family.screens.join.continue')}
          onPress={handleSubmit}
          disabled={!isProviderSelected || !familyId || !role || isLoading}
          style={{ marginTop: 16 }}
        />
      </View>
    </ScrollView>
  );
}
