// screens/family/FamNewScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useMemo, useState, useEffect } from 'react';
import { ScrollView, View, Pressable, Linking, Platform, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useThemeColor } from '../../hooks/useThemeColor';
import { getScreenStyles } from '../../constants/style_family';
import ScreenHeader from '../../components/ScreenHeader';
import ThemedButton from '../../components/ThemedButton';
import ThemedCheckbox from '../../components/ThemedCheckbox';
import ThemedInput from '../../components/ThemedTextInput';
import ThemedText from '../../components/ThemedText';
import ThemedPicker from '../../components/ThemedPicker';
import CountrySelector from '../../components/CountrySelector';
import { useProfile } from '../../context/ProfileContext';
import { useSubject } from '../../context/SubjectContext';
import { deriveProfileId } from '../../utils/profileId';
import { Routes } from '../../constants/Routes';
import { ClaimsOrganizationSchemaorg, ClaimsPersonSchemaorg, ClaimsServiceSchemaorg } from '../../constants/Schemas';
import { FamilyProvidersByCountry } from '../../constants/Providers';
import { HL7_PERSONAL_RELATIONSHIP_ROLES } from '../../data/hl7-personal-relationship';
import { encodeHexToMultibase58btc } from 'gdc-common-utils-ts/utils/multibase58';
import { hashEmail } from '../../utils/emailHash';

const TERMS_URL = 'https://github.com/your-org/your-terms.pdf';

type FamilyNewRouteParams = {
  FamilyNew: { email?: string; idToken?: string };
};

export default function FamNewScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<FamilyNewRouteParams, 'FamilyNew'>>();
  const { email: emailFromRoute, idToken } = route.params || {};
  const { initializeSession, profileRegistry } = useProfile();
  const { setSubject } = useSubject();

  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);

  const backgroundColor = useThemeColor({}, 'background');
  const linkColor = useThemeColor({}, 'tint');

  const [email, setEmail] = useState(emailFromRoute || '');
  const [role, setRole] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [country, setCountry] = useState('');
  const [providerId, setProviderId] = useState('');
  const [termsClicked, setTermsClicked] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rawUuid] = useState(() => uuidv4());

  useEffect(() => {
    if (emailFromRoute && emailFromRoute !== email) {
      setEmail(emailFromRoute);
    }
  }, [emailFromRoute, email]);

  const familyId = useMemo(() => encodeHexToMultibase58btc(rawUuid), [rawUuid]);

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

  useEffect(() => {
    if (!country) {
      setProviderId('');
      return;
    }
    if (!providerOptions.length) {
      setProviderId('');
      return;
    }
    if (providerId && providerOptions.some((provider) => provider.id === providerId)) {
      return;
    }
    setProviderId(providerOptions[0].id);
  }, [country, providerOptions, providerId]);

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
  const canSubmit = !!email && !!idToken && !!role && !!familyName && isProviderSelected && termsAccepted;

  const openLink = () => {
    setTermsClicked(true);
    if (Platform.OS === 'web') {
      window.open(TERMS_URL, '_blank');
    } else {
      Linking.openURL(TERMS_URL);
    }
  };

  const handleSubmit = async () => {
    if (!idToken) {
      Alert.alert(t('common.error'), t('common.error.missingFields', 'Missing required fields.'));
      navigation.navigate(Routes.Family.LoginAuth.name, { nextRoute: Routes.Family.New.name });
      return;
    }
    if (!email || !role || !familyName || !isProviderSelected) {
      Alert.alert(t('common.error'), t('common.error.missingFields', 'Missing required fields.'));
      return;
    }

    setIsLoading(true);
    try {
      const domain = selectedProvider?.domain || '';
      const providerDid = `did:web:${domain.toLowerCase()}`;
      const claims = {
        '@context': 'org.schema',
        [ClaimsOrganizationSchemaorg.addressCountry]: country || 'ES',
        [ClaimsOrganizationSchemaorg.identifier]: `urn:uuid:${rawUuid}`,
        [ClaimsOrganizationSchemaorg.name]: familyName || `Family of ${email}`,
        [ClaimsPersonSchemaorg.email]: email,
        [ClaimsPersonSchemaorg.hasOccupation]: role,
        [ClaimsServiceSchemaorg.category]: 'health-care,health-emergency,health-insurance,health-research',
        [ClaimsServiceSchemaorg.url]: `https://${domain.toLowerCase()}`,
        [ClaimsServiceSchemaorg.termsOfService]: TERMS_URL,
      };

      const profileId = await deriveProfileId({
        appType: 'Family',
        providerDid,
        email,
        role,
      });

      setSubject(email, idToken);

      const newManager = await initializeSession({
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
          profileDisplay: familyName || `Family of ${email}`,
          emailHash,
          lastUsedAt: new Date().toISOString(),
        });
      }

      const familyAdmin = newManager?.familyAdmin?.admin;
      if (!familyAdmin) throw new Error('Family admin services are not available for this session.');
      const { thid } = await familyAdmin.createFamilyOrganization(claims, providerDid, idToken);
      navigation.navigate(Routes.Family.RegistrySent.name, { thid });
    } catch (err) {
      Alert.alert(t('common.error'), (err as Error).message || t('common.unknownError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={styles.scrollContainer}>
      <ScreenHeader
        title={t('family.screens.newEntity.title')}
        subtitle={t('family.screens.newEntity.subtitle')}
      />

      <View style={{ width: '100%', padding: 16 }}>
        <ThemedText style={styles.formLabel}>{t('family.screens.newEntity.email-label')}</ThemedText>
        <ThemedInput
          placeholder={t('family.screens.newEntity.email-placeholder')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!idToken}
        />

        <ThemedText style={styles.formLabel}>{t('family.screens.newEntity.role-label')}</ThemedText>
        <ThemedPicker
          selectedValue={role}
          onValueChange={setRole}
          items={roleItems}
          placeholder={t('family.screens.newEntity.role-placeholder')}
          disabled={!idToken && !email}
          accessibilityLabel={t('family.screens.newEntity.role-label')}
        />

        <ThemedText style={styles.formLabel}>{t('family.screens.newEntity.familyName-label')}</ThemedText>
        <ThemedInput
          placeholder={t('family.screens.newEntity.familyName-placeholder')}
          value={familyName}
          onChangeText={setFamilyName}
          autoCapitalize="words"
        />

        <ThemedText style={styles.formLabel}>{t('family.screens.newEntity.familyId-label')}</ThemedText>
        <ThemedInput
          placeholder={t('family.screens.newEntity.familyId-placeholder')}
          value={familyId}
          editable={false}
        />

        <ThemedText style={styles.formLabel}>{t('family.screens.newEntity.country-label')}</ThemedText>
        <CountrySelector
          value={country}
          onChange={setCountry}
          placeholder={t('family.screens.newEntity.country-placeholder')}
          allowedCountries={['ES', 'MX', 'US', 'CA', 'GB']}
        />

        <ThemedText style={styles.formLabel}>{t('family.screens.newEntity.provider-label')}</ThemedText>
        <ThemedPicker
          selectedValue={providerId}
          onValueChange={setProviderId}
          items={providerOptions.map((provider) => ({
            value: provider.id,
            label: provider.label,
          }))}
          placeholder={t('family.screens.newEntity.provider-placeholder')}
          disabled={!isCountrySelected}
          accessibilityLabel={t('family.screens.newEntity.provider-label')}
        />

        <Pressable onPress={openLink}>
          <ThemedText style={[styles.linkText, { color: linkColor }]}>
            {t('common.reviewTerms')}
          </ThemedText>
        </Pressable>

        <ThemedCheckbox
          label={t('common.checkbox-acceptTerms-label')}
          checked={termsAccepted}
          onToggle={() => setTermsAccepted(!termsAccepted)}
          disabled={!termsClicked}
        />

        <ThemedButton
          title={t('common.continue')}
          onPress={handleSubmit}
          disabled={!canSubmit || isLoading}
          style={{ marginTop: 16 }}
        />

      </View>
    </ScrollView>
  );
}
