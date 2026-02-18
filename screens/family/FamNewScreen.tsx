// screens/family/FamNewScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useMemo, useState, useEffect } from 'react';
import { ScrollView, View, Pressable, Linking, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import NetInfo from '@react-native-community/netinfo';

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
import ConfirmationModal from '../../components/ConfirmationModal';
import { useProfile } from '../../context/ProfileContext';
import { useSubject } from '../../context/SubjectContext';
import { deriveProfileId } from '../../utils/profileId';
import { Routes } from '../../constants/Routes';
import { ClaimsOrganizationSchemaorg, ClaimsPersonSchemaorg, ClaimsServiceSchemaorg, Sector } from '../../constants/Schemas';
import { HL7_PERSONAL_RELATIONSHIP_ROLES } from '../../data/hl7-personal-relationship';
import { encodeHexToMultibase58btc } from 'gdc-common-utils-ts/utils/multibase58';
import { hashEmail } from '../../utils/emailHash';
import { ensureDemoProviderDidDocument } from '../../utils/demoDidFallback';
import { toBackendRole } from '../../utils/roleCoding';
import { resolveFamilyProviders } from '../../utils/providerDiscovery';
import {
  cancelPendingJobsByThid,
  detectRouteNotFoundForThid,
  isRouteNotFoundErrorMessage,
  withTimeout,
} from '../../utils/registrationSubmitGuard';

const TERMS_URL = 'https://github.com/your-org/your-terms.pdf';

type FamilyNewRouteParams = {
  FamilyNew: { email?: string; idToken?: string };
};

export default function FamNewScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<FamilyNewRouteParams, 'FamilyNew'>>();
  const { email: emailFromRoute, idToken } = route.params || {};
  const { initializeSession, profileRegistry, operationMode, sdk } = useProfile();
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
  const [discoveredProviders, setDiscoveredProviders] = useState<Array<{ id: string; nameKey: string; label?: string; domain: string; did?: string; sector?: string; country?: string }>>([]);
  const [termsClicked, setTermsClicked] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isProviderModalVisible, setIsProviderModalVisible] = useState(false);
  const [providerModalMessage, setProviderModalMessage] = useState('');
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');
  const [errorModalOnConfirm, setErrorModalOnConfirm] = useState<(() => void) | null>(null);
  const [rawUuid] = useState(() => uuidv4());
  const resetToDashboard = () =>
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: Routes.Family.Dashboard.name }],
      })
    );
  const openProviderNotFoundModal = (message: string) => {
    setProviderModalMessage(message);
    setIsProviderModalVisible(true);
  };
  const openErrorModal = (message: string, onConfirm?: () => void) => {
    setErrorModalMessage(message);
    setErrorModalOnConfirm(() => onConfirm || null);
    setIsErrorModalVisible(true);
  };

  useEffect(() => {
    if (emailFromRoute && emailFromRoute !== email) {
      setEmail(emailFromRoute);
    }
  }, [emailFromRoute, email]);

  const familyId = useMemo(() => encodeHexToMultibase58btc(rawUuid), [rawUuid]);

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
      value: roleItem.code,
      label: String(t(`family.roles.${roleItem.code}.label`, roleItem.display)),
    }));
    const caregiverItem = {
      value: '5322',
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
      openErrorModal(
        t(
          'common.modals.registration.authRequired',
          'Authentication is required. Please log in to continue.'
        ),
        () => navigation.navigate(Routes.Family.LoginAuth.name, { nextRoute: Routes.Family.New.name })
      );
      return;
    }
    if (!email || !role || !familyName || !isProviderSelected) {
      openErrorModal(t('common.modals.errors.missingFields', 'Missing required fields.'));
      return;
    }

    setIsLoading(true);
    setSubmitError(null);
    try {
      const domain = selectedProvider?.domain || '';
      const providerDid = selectedProvider?.did || `did:web:${domain.toLowerCase()}`;
      const claims = {
        '@context': 'org.schema',
        [ClaimsOrganizationSchemaorg.addressCountry]: country || 'ES',
        [ClaimsOrganizationSchemaorg.identifier]: `urn:uuid:${rawUuid}`,
        [ClaimsOrganizationSchemaorg.name]: familyName || `Family of ${email}`,
        [ClaimsPersonSchemaorg.email]: email,
        [ClaimsPersonSchemaorg.hasOccupation]: toBackendRole(role, 'family'),
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

      if (operationMode === 'DEMO') {
        ensureDemoProviderDidDocument(sdk, providerDid);
      }

      const newManager = await initializeSession({
        profileId,
        email,
        role,
        providerDid,
        appType: 'Family',
        familyId,
      });
      await newManager?.updateProfile?.({
        profileDisplay: familyName || familyId,
        familyLabel: familyName || familyId,
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

      const netState = await NetInfo.fetch();
      const isOnline = netState.isConnected ?? true;
      if (!isOnline) {
        openProviderNotFoundModal(
          t(
            'common.modals.registration.noProviderConnection',
            'No connection to the provider. Change provider or continue offline to review the demo.'
          )
        );
        return;
      }

      const { thid } = await withTimeout(
        familyAdmin.createFamilyOrganization(claims, providerDid, idToken),
        15000,
        'Registration request timed out while contacting provider'
      );

      const registrationResult = await detectRouteNotFoundForThid(newManager as any, thid);
      if (registrationResult.isNotFound) {
        const reason =
          registrationResult.message ||
          `Provider endpoint not found for provider DID: ${providerDid}`;
        await cancelPendingJobsByThid(newManager as any, thid, reason);
        openProviderNotFoundModal(
          t(
            'common.modals.registration.providerNotFoundWithDid',
            'Registration route not found for "{{providerDid}}". You can change provider or continue offline to review the demo.',
            { providerDid }
          )
        );
        return;
      }

      navigation.navigate(Routes.Family.RegistrySent.name, { thid });
    } catch (err) {
      const message = (err as Error).message || t('common.unknownError');

      if (isRouteNotFoundErrorMessage(message)) {
        openProviderNotFoundModal(
          t(
            'common.modals.registration.providerNotFoundGeneric',
            'Registration route not found for this provider. Change provider or continue offline to review the demo.'
          )
        );
        return;
      }

      setSubmitError(message);
      openErrorModal(message);
      if (operationMode === 'DEMO') return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
        {submitError ? (
          <ThemedText style={{ marginTop: 12, opacity: 0.85 }}>
            {submitError}
          </ThemedText>
        ) : null}

      </View>
      </ScrollView>
      <ConfirmationModal
        visible={isProviderModalVisible}
        title={t('common.modals.registration.providerNotFoundTitle', 'Provider not found')}
        message={providerModalMessage}
        cancelText={t('common.modals.registration.changeProvider', 'Change provider')}
        confirmText={t('common.modals.registration.continueOffline', 'Continue offline')}
        onCancel={() => setIsProviderModalVisible(false)}
        onConfirm={() => {
          setIsProviderModalVisible(false);
          resetToDashboard();
        }}
      />
      <ConfirmationModal
        visible={isErrorModalVisible}
        title={t('common.modals.errors.title', t('common.error', 'Error'))}
        message={errorModalMessage}
        hideCancel
        confirmText={t('common.modals.errors.close', 'Close')}
        onCancel={() => {
          setIsErrorModalVisible(false);
          setErrorModalOnConfirm(null);
        }}
        onConfirm={() => {
          setIsErrorModalVisible(false);
          const action = errorModalOnConfirm;
          setErrorModalOnConfirm(null);
          if (action) action();
        }}
      />
    </>
  );
}
