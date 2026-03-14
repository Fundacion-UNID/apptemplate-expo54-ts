// screens/organization/OrgNewEntityScreen.tsx

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

// --- CONTEXT & HOOKS ---
import { useOrgRegistryForm } from '../../context/OrgRegistryFormContext';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useProfile } from '../../context/ProfileContext';
import { useSubject } from '../../context/SubjectContext';

// --- SCHEMAS & TYPES (THE SINGLE SOURCE OF TRUTH) ---
import { registrationSchemaPart1, registrationUiSchemaPart1, OrgRegistrationForm } from '../../forms/organization-registry-RJSF';
import { RootStackParamList } from '../../navigation/RootNavigator';

// --- CONSTANTS ---
import { Sector, ClaimsOrganizationSchemaorg, ClaimsPersonSchemaorg, ClaimsServiceSchemaorg } from '../../constants/Schemas';
import { ServiceProviders, getServiceProvidersForSector } from '../../constants/Providers';
import { getScreenStyles } from '../../constants/Styles';
import { cleanRegistrationClaims } from '../../managers/OrgRegistrationManager';
import { defaultNetworkIdentifier } from 'gdc-sdk-client-ts/serviceSelectorRegistry';
import { generateDidDocument_forMock, generateWellKnownServices_forMock, generateGatewayEntityServices_forMock, generateHostRegistryServices_forMock } from 'gdc-sdk-client-ts';
import { entityMldsaJwk, entityMlkemJwk } from '../../data/demo/sdkMockData';
import { getBaseUrlFromDidWeb } from 'gdc-common-utils-ts/utils/did';
import { MldsaPublicJwk, MlkemPublicJwk } from 'gdc-common-utils-ts/interfaces/Cryptography.types';
import { deriveProfileId } from '../../utils/profileId';
import { buildDidFromProviderUrl, buildHostedDid, buildSelfHostedDid, normalizeUrl } from '../../utils/providerDid';
import { buildIcaAutofillData } from '../../utils/orgRegistrationIca';
import {
  cancelPendingJobsByThid,
  detectRouteNotFoundForThid,
  isRouteNotFoundErrorMessage,
  withTimeout,
} from '../../utils/registrationSubmitGuard';

// --- UI COMPONENTS ---
import FormStepLayout from '../../components/FormStepLayout';
import ThemedText from '../../components/ThemedText';
import ThemedInput from '../../components/ThemedTextInput';
import CountrySelector from '../../components/CountrySelector';
import ThemedPicker from '../../components/ThemedPicker';
import ConfirmationModal from '../../components/ConfirmationModal';
import { Routes } from '../../constants/Routes';

type Props = StackScreenProps<RootStackParamList, 'OrgNewEntity'>;

export default function OrgNewEntityScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const { formData, icaVerification, setFormData } = useOrgRegistryForm();
  const { initializeSession, isLoading: isProfileLoading, operationMode, sdk } = useProfile();
  const { accessToken: idToken } = useSubject();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOperatorModalVisible, setIsOperatorModalVisible] = useState(false);
  const [operatorModalMessage, setOperatorModalMessage] = useState('');
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');

  const openOperatorNotFoundModal = useCallback((message: string) => {
    setOperatorModalMessage(message);
    setIsOperatorModalVisible(true);
  }, []);

  const openErrorModal = useCallback((message: string) => {
    setErrorModalMessage(message);
    setIsErrorModalVisible(true);
  }, []);
  
  const [localData, setLocalData] = useState<Partial<OrgRegistrationForm>>(() => {
    const initialState: Partial<OrgRegistrationForm> = {};
    Object.keys(registrationSchemaPart1.properties as any).forEach(key => {
      (initialState as any)[key] = (formData as any)[key] || '';
    });
    // FIX: Initialize provider under the correct schema key
    const initialSector = String(formData[ClaimsServiceSchemaorg.category] || '').trim().toLowerCase();
    const initialProviders = getServiceProvidersForSector(initialSector);
    initialState[ClaimsServiceSchemaorg.url] =
      formData[ClaimsServiceSchemaorg.url] || initialProviders[0]?.url || ServiceProviders[0]?.url || '';
    return initialState;
  });

  const selectedSector = String(localData[ClaimsServiceSchemaorg.category] || '').trim().toLowerCase();
  const icaAutofillData = useMemo(
    () => (icaVerification ? buildIcaAutofillData(icaVerification) : {}),
    [icaVerification]
  );
  const icaLockedFields = useMemo(
    () => new Set(Object.keys(icaAutofillData) as Array<keyof OrgRegistrationForm>),
    [icaAutofillData]
  );
  const providersForSelectedSector = useMemo(
    () => getServiceProvidersForSector(selectedSector),
    [selectedSector]
  );

  useEffect(() => {
    if (!providersForSelectedSector.length) return;
    const selectedProvider = String(localData[ClaimsServiceSchemaorg.url] || '');
    const hasSelectedProvider = providersForSelectedSector.some((provider) => provider.url === selectedProvider);
    const isProviderLocked = icaLockedFields.has(ClaimsServiceSchemaorg.url);
    if (!selectedProvider || (!isProviderLocked && !hasSelectedProvider)) {
      setLocalData((prev) => ({
        ...prev,
        [ClaimsServiceSchemaorg.url]: providersForSelectedSector[0].url,
      }));
    }
  }, [icaLockedFields, localData, providersForSelectedSector]);

  const updateField = (field: keyof OrgRegistrationForm, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = useCallback(async () => {
    const finalFormData = { ...formData, ...localData };
    setFormData(prev => ({ ...prev, ...localData }));

    if (!idToken) {
      navigation.dispatch(
        CommonActions.navigate({
          name: 'ErrorScreen',
          params: {
            errorMessage: t(
              'common.modals.registration.authRequired',
              'Authentication is required. Please log in to continue.'
            ),
          },
        })
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const email = finalFormData[ClaimsPersonSchemaorg.email] as string;
      const role = finalFormData[ClaimsPersonSchemaorg.hasOccupation] as string;
      const orgWebsiteUrl = finalFormData[ClaimsOrganizationSchemaorg.url] as string;
      const providerUrl = finalFormData[ClaimsServiceSchemaorg.url] as string;
      const alternateName = finalFormData[ClaimsOrganizationSchemaorg.alternateName] as string;
      const jurisdiction = finalFormData[ClaimsOrganizationSchemaorg.addressCountry] as string;
      const sector = finalFormData[ClaimsServiceSchemaorg.category] as string;

      if (!email || !role || !providerUrl || !alternateName || !jurisdiction || !sector) {
        openErrorModal(t('common.modals.errors.missingFields', 'Missing required fields.'));
        return;
      }

      const normalizedProviderUrl = normalizeUrl(providerUrl);
      const normalizedOrgWebsiteUrl = orgWebsiteUrl ? normalizeUrl(orgWebsiteUrl) : '';
      let useSelfHosted = false;
      if (normalizedOrgWebsiteUrl) {
        try {
          const orgHost = new URL(normalizedOrgWebsiteUrl).hostname.toLowerCase();
          const providerHost = new URL(normalizedProviderUrl).hostname.toLowerCase();
          const looksLikeValidSelfHostedDomain =
            orgHost === 'localhost' ||
            orgHost.endsWith('.localhost') ||
            orgHost.includes('.');
          useSelfHosted = looksLikeValidSelfHostedDomain && orgHost !== providerHost;
        } catch {
          useSelfHosted = false;
        }
      }

      const tenantDid = useSelfHosted
        ? buildSelfHostedDid(normalizedOrgWebsiteUrl)
        : buildHostedDid({
            providerUrl: normalizedProviderUrl,
            context: {
              tenantAltName: alternateName,
              jurisdiction,
              sector,
            },
          });
      const hostDid = buildDidFromProviderUrl(providerUrl);

      const profileId = await deriveProfileId({
        appType: 'Organization',
        providerDid: tenantDid,
        email,
        role,
      });
      if (operationMode === 'DEMO') {
        const keys = {
          mldsa: entityMldsaJwk as MldsaPublicJwk,
          mlkem: entityMlkemJwk as MlkemPublicJwk,
        };
        if (tenantDid === hostDid) {
          const combinedMockDidDoc = generateDidDocument_forMock(
            tenantDid,
            getBaseUrlFromDidWeb(tenantDid),
            [
              generateWellKnownServices_forMock,
              generateHostRegistryServices_forMock,
              generateGatewayEntityServices_forMock,
            ],
            keys
          );
          sdk.addMockDidDocument(tenantDid, combinedMockDidDoc);
        } else {
          const tenantMockDidDoc = generateDidDocument_forMock(
            tenantDid,
            getBaseUrlFromDidWeb(tenantDid),
            [
              generateWellKnownServices_forMock,
              generateGatewayEntityServices_forMock,
            ],
            keys
          );
          const hostMockDidDoc = generateDidDocument_forMock(
            hostDid,
            getBaseUrlFromDidWeb(hostDid),
            [
              generateWellKnownServices_forMock,
              generateHostRegistryServices_forMock,
            ],
            keys
          );
          sdk.addMockDidDocument(tenantDid, tenantMockDidDoc);
          sdk.addMockDidDocument(hostDid, hostMockDidDoc);
        }
      }

      const newManager = await initializeSession({
        profileId,
        email,
        role,
        providerDid: tenantDid,
      });

      const orgAdmin = newManager.orgAdmin?.admin;
      if (!orgAdmin) {
        throw new Error('Admin services are not available for this session (missing OrgAdminService).');
      }

      const cleanedData = cleanRegistrationClaims(finalFormData);
      const netState = await NetInfo.fetch();
      const isOnline = netState.isConnected ?? true;
      if (!isOnline) {
        openOperatorNotFoundModal(
          t(
            'common.modals.registration.noOperatorConnection',
            'No connection to the operator. Change operator or continue offline to review the demo.'
          )
        );
        return;
      }

      const { thid } = await withTimeout(
        orgAdmin.startOrganizationRegistration(
          cleanedData,
          idToken,
          defaultNetworkIdentifier
        ),
        15000,
        'Registration request timed out while contacting operator'
      );

      const registrationResult = await detectRouteNotFoundForThid(newManager as any, thid);
      if (registrationResult.isNotFound) {
        const reason =
          registrationResult.message ||
          `Operator endpoint not found for provider: ${providerUrl}`;
        await cancelPendingJobsByThid(newManager as any, thid, reason);
        openOperatorNotFoundModal(
          t(
            'common.modals.registration.operatorNotFoundWithProvider',
            'Registration route not found at "{{provider}}". You can change operator or continue offline to review the demo.',
            { provider: providerUrl }
          )
        );
        return;
      }

      navigation.navigate(Routes.Organization.RegistrySent.name, { thid });
    } catch (error) {
      const message = (error as Error).message || t('common.unknownError');
      if (isRouteNotFoundErrorMessage(message)) {
        openOperatorNotFoundModal(
          t(
            'common.modals.registration.operatorNotFoundGeneric',
            'Registration route not found for this operator. Change operator or continue offline to review the demo.'
          )
        );
        return;
      }

      openErrorModal(message);
      if (operationMode === 'DEMO') return;
      navigation.dispatch(CommonActions.navigate({ name: 'ErrorScreen', params: { errorMessage: message } }));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, localData, setFormData, idToken, initializeSession, navigation, t, operationMode, sdk, openErrorModal, openOperatorNotFoundModal]);
  
  const isFormValid = useMemo(() => {
    // Also validate the provider field
    const requiredFields = [...(registrationSchemaPart1.required || []), ClaimsServiceSchemaorg.url];
    return requiredFields.every(fieldKey => {
      const value = localData[fieldKey as keyof OrgRegistrationForm];
      return typeof value === 'string' && value.length > 0;
    });
  }, [localData]);

  return (
    <>
      <FormStepLayout
        title={t('organization.screens.newEntity.title')}
        subtitle={t('organization.screens.newEntity.subtitle')}
        description=""
        onContinue={handleNext}
        isContinueEnabled={isFormValid}
        isLoading={isSubmitting || isProfileLoading}
      >
        {(columnCount) => (
          <>
          {Object.keys(registrationSchemaPart1.properties as any).map((key) => {
            const typedKey = key as keyof OrgRegistrationForm;
            const fieldSchema = registrationSchemaPart1.properties?.[typedKey];
            
            if (typeof fieldSchema !== 'object' || !fieldSchema.title) return null;

            const uiSchema = registrationUiSchemaPart1[typedKey] || {};
            const placeholder = uiSchema['ui:options']?.placeholder || '';
            const isLockedByIca = icaLockedFields.has(typedKey);
            
            let fieldComponent;
            
            switch (uiSchema['ui:widget']) {
              case 'select':
                let pickerOptions = [{ label: t('pickers.select'), value: '' }];
                if (typedKey === ClaimsOrganizationSchemaorg.identifierType) {
                  pickerOptions = [...pickerOptions, { label: t('pickers.legalIdTypes.TAX'), value: 'TAX' }, { label: t('pickers.legalIdTypes.EI'), value: 'EI' }];
                } else if (typedKey === ClaimsServiceSchemaorg.category) {
                  pickerOptions = [
                    ...pickerOptions,
                    { label: t('pickers.sectors.emergency'), value: Sector.EMERGENCY },
                    { label: t('pickers.sectors.health-care'), value: Sector.HEALTH_CARE },
                    { label: t('pickers.sectors.health-insurance'), value: Sector.HEALTH_INSURANCE },
                    { label: t('pickers.sectors.health-tech'), value: Sector.HEALTH_TECH },
                    { label: t('pickers.sectors.health-it'), value: Sector.HEALTH_IT },
                    { label: t('pickers.sectors.research'), value: Sector.RESEARCH },
                  ];
                } else if (typedKey === ClaimsServiceSchemaorg.serviceType) {
                  pickerOptions = [
                    ...pickerOptions,
                    { label: t('pickers.networkRoles.provider'), value: 'provider' },
                    { label: t('pickers.networkRoles.data-reader'), value: 'data-reader' },
                  ];
                }
                
                fieldComponent = (
                  <ThemedPicker
                    selectedValue={localData[typedKey]}
                    onValueChange={(v: any) => updateField(typedKey, v)}
                    items={pickerOptions}
                    accessibilityLabel={t(fieldSchema.title)}
                    disabled={isLockedByIca}
                  />
                );
                break;

              default:
                fieldComponent = (
                  <ThemedInput
                    placeholder={t(placeholder)}
                    value={localData[typedKey] ? String(localData[typedKey]) : ''}
                    onChangeText={(v: any) => updateField(typedKey, v)}
                    accessibilityLabel={t(fieldSchema.title)}
                    disabled={isLockedByIca}
                    style={{}}
                  />
                );
                break;
            }

            if (typedKey === ClaimsOrganizationSchemaorg.addressCountry) {
              fieldComponent = (
                <CountrySelector
                  value={localData[typedKey]}
                  onChange={(v: any) => updateField(typedKey, v)}
                  placeholder={t(placeholder)}
                  disabled={isLockedByIca}
                />
              );
            }

            return (
              <View key={typedKey} style={{ width: `${100 / columnCount}%`, padding: 8 }}>
                <ThemedText style={[styles.formLabel, { textAlign: 'left' }]}>{t(fieldSchema.title)}</ThemedText>
                {fieldComponent}
                {typedKey === ClaimsOrganizationSchemaorg.url ? (
                  <ThemedText style={{ opacity: 0.7, marginTop: 4 }}>
                    {t('organization.screens.newEntity.options.domain-help')}
                  </ThemedText>
                ) : null}
              </View>
            );
          })}

          {/* FIX: Picker now reads from and writes to localData using the correct schema key */}
          <View style={{ width: `${100 / columnCount}%`, padding: 8 }}>
            <ThemedText style={[styles.formLabel, { textAlign: 'left' }]}>
              {t('organization.screens.newEntity.provider-label')}
            </ThemedText>
            {icaLockedFields.has(ClaimsServiceSchemaorg.url) ? (
              <ThemedInput
                value={localData[ClaimsServiceSchemaorg.url] ? String(localData[ClaimsServiceSchemaorg.url]) : ''}
                accessibilityLabel={t('organization.screens.newEntity.provider-label')}
                disabled
                style={{}}
              />
            ) : (
              <ThemedPicker 
                selectedValue={localData[ClaimsServiceSchemaorg.url]} 
                onValueChange={(v: any) => updateField(ClaimsServiceSchemaorg.url, v)} 
                items={providersForSelectedSector.map((provider) => ({ label: provider.name, value: provider.url }))} 
                accessibilityLabel={t('organization.screens.newEntity.provider-label')}
              />
            )}
            <ThemedText style={{ opacity: 0.7, marginTop: 4 }}>
              {t('organization.screens.newEntity.options.provider-help')}
            </ThemedText>
          </View>
          </>
        )}
      </FormStepLayout>
      <ConfirmationModal
        visible={isOperatorModalVisible}
        title={t('common.modals.registration.operatorNotFoundTitle', 'Operator not found')}
        message={operatorModalMessage}
        cancelText={t('common.modals.registration.changeOperator', 'Change operator')}
        confirmText={t('common.modals.registration.continueOffline', 'Continue offline')}
        onCancel={() => setIsOperatorModalVisible(false)}
        onConfirm={() => {
          setIsOperatorModalVisible(false);
          navigation.navigate(Routes.Organization.Dashboard.name);
        }}
      />
      <ConfirmationModal
        visible={isErrorModalVisible}
        title={t('common.modals.errors.title', t('common.error', 'Error'))}
        message={errorModalMessage}
        hideCancel
        confirmText={t('common.modals.errors.close', 'Close')}
        onCancel={() => setIsErrorModalVisible(false)}
        onConfirm={() => setIsErrorModalVisible(false)}
      />
    </>
  );
}
