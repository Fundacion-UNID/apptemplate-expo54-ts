// screens/organization/OrgNewEntityScreen.tsx

import React, { useState, useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';

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
import { ServiceProviders } from '../../constants/Providers';
import { getScreenStyles } from '../../constants/Styles';
import { cleanRegistrationClaims } from '../../managers/OrgRegistrationManager';
import { defaultNetworkIdentifier } from 'gdc-sdk-client-ts/src/serviceSelectorRegistry';
import { generateDidDocument_forMock, generateWellKnownServices_forMock, generateGatewayEntityServices_forMock } from 'gdc-sdk-client-ts/src/utils/mockData';
import { entityMldsaJwk, entityMlkemJwk } from 'gdc-sdk-client-ts/data/demo/entityKeys.data';
import { getBaseUrlFromDidWeb } from 'gdc-common-utils-ts/utils/did';
import { MldsaPublicJwk, MlkemPublicJwk } from 'gdc-common-utils-ts/interfaces/Cryptography.types';
import { deriveProfileId } from '../../utils/profileId';

// --- UI COMPONENTS ---
import FormStepLayout from '../../components/FormStepLayout';
import ThemedText from '../../components/ThemedText';
import ThemedInput from '../../components/ThemedTextInput';
import CountrySelector from '../../components/CountrySelector';
import ThemedPicker from '../../components/ThemedPicker';
import { Routes } from '../../constants/Routes';

type Props = StackScreenProps<RootStackParamList, 'OrgNewEntity'>;

export default function OrgNewEntityScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const { formData, setFormData } = useOrgRegistryForm();
  const { initializeSession, isLoading: isProfileLoading, operationMode, sdk } = useProfile();
  const { accessToken: idToken } = useSubject();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [localData, setLocalData] = useState<Partial<OrgRegistrationForm>>(() => {
    const initialState: Partial<OrgRegistrationForm> = {};
    Object.keys(registrationSchemaPart1.properties as any).forEach(key => {
      (initialState as any)[key] = (formData as any)[key] || '';
    });
    // FIX: Initialize provider under the correct schema key
    initialState[ClaimsServiceSchemaorg.url] = formData[ClaimsServiceSchemaorg.url] || ServiceProviders[0]?.url || '';
    return initialState;
  });

  const updateField = (field: keyof OrgRegistrationForm, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const buildDidFromProviderUrl = (providerUrl: string) => {
    const parsed = new URL(providerUrl);
    const host = parsed.host.toLowerCase().replace(':', '%3A');
    const path = parsed.pathname.replace(/^\/|\/$/g, '');
    const pathSuffix = path ? `:${path.split('/').join(':')}` : '';
    return `did:web:${host}${pathSuffix}`;
  };

  const handleNext = useCallback(async () => {
    const finalFormData = { ...formData, ...localData };
    setFormData(prev => ({ ...prev, ...localData }));

    if (!idToken) {
      navigation.dispatch(CommonActions.navigate({ name: 'ErrorScreen', params: { errorMessage: 'Authorization token is missing.' } }));
      return;
    }

    setIsSubmitting(true);
    try {
      const email = finalFormData[ClaimsPersonSchemaorg.email] as string;
      const role = finalFormData[ClaimsPersonSchemaorg.hasOccupation] as string;
      const gatewayUrl = finalFormData[ClaimsServiceSchemaorg.url] as string;

      if (!email || !role || !gatewayUrl) {
        throw new Error('Missing critical data for session creation (email, role, or gateway URL).');
      }

      const gatewayDid = buildDidFromProviderUrl(gatewayUrl);

      const profileId = await deriveProfileId({
        appType: 'Organization',
        providerDid: gatewayDid,
        email,
        role,
      });
      let newManager: Awaited<ReturnType<typeof initializeSession>> | null = null;
      try {
        newManager = await initializeSession({
          profileId,
          email,
          role,
          providerDid: gatewayDid,
        });
      } catch (error) {
        if (operationMode === 'DEMO') {
          const mockDidDoc = generateDidDocument_forMock(
            gatewayDid,
            getBaseUrlFromDidWeb(gatewayDid),
            [generateWellKnownServices_forMock, generateGatewayEntityServices_forMock],
            {
              mldsa: entityMldsaJwk as MldsaPublicJwk,
              mlkem: entityMlkemJwk as MlkemPublicJwk,
            }
          );
          sdk.addMockDidDocument(gatewayDid, mockDidDoc);
          newManager = await initializeSession({
            profileId,
            email,
            role,
            providerDid: gatewayDid,
          });
        } else {
          throw error;
        }
      }

      const orgAdmin = newManager.orgAdmin?.admin;
      if (!orgAdmin) {
        throw new Error('Admin services are not available for this session (missing OrgAdminService).');
      }

      const cleanedData = cleanRegistrationClaims(finalFormData);
      const { thid } = await orgAdmin.createOrganization(
        cleanedData,
        gatewayDid,
        idToken,
        defaultNetworkIdentifier
      );

      navigation.navigate(Routes.Organization.RegistrySent.name, { thid });
    } catch (error) {
      navigation.dispatch(CommonActions.navigate({ name: 'ErrorScreen', params: { errorMessage: (error as Error).message || t('common.unknownError') } }));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, localData, setFormData, idToken, initializeSession, navigation, t, operationMode, sdk, buildDidFromProviderUrl]);
  
  const isFormValid = useMemo(() => {
    // Also validate the provider field
    const requiredFields = [...(registrationSchemaPart1.required || []), ClaimsServiceSchemaorg.url];
    return requiredFields.every(fieldKey => {
      const value = localData[fieldKey as keyof OrgRegistrationForm];
      return typeof value === 'string' && value.length > 0;
    });
  }, [localData]);

  return (
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
            
            let fieldComponent;
            
            switch (uiSchema['ui:widget']) {
              case 'select':
                let pickerOptions = [{ label: t('pickers.select'), value: '' }];
                if (typedKey === ClaimsOrganizationSchemaorg.identifierType) {
                  pickerOptions = [...pickerOptions, { label: t('pickers.legalIdTypes.TAX'), value: 'TAX' }, { label: t('pickers.legalIdTypes.EI'), value: 'EI' }];
                } else if (typedKey === ClaimsServiceSchemaorg.category) {
                  pickerOptions = [...pickerOptions, { label: t('pickers.sectors.emergency'), value: Sector.EMERGENCY }, { label: t('pickers.sectors.health-care'), value: Sector.HEALTH_CARE }, { label: t('pickers.sectors.health-insurance'), value: Sector.HEALTH_INSURANCE }, { label: t('pickers.sectors.research'), value: Sector.RESEARCH }];
                }
                
                fieldComponent = <ThemedPicker selectedValue={localData[typedKey]} onValueChange={(v: any) => updateField(typedKey, v)} items={pickerOptions} accessibilityLabel={t(fieldSchema.title)} />;
                break;

              default:
                fieldComponent = <ThemedInput placeholder={t(placeholder)} value={localData[typedKey] ? String(localData[typedKey]) : ''} onChangeText={(v: any) => updateField(typedKey, v)} accessibilityLabel={t(fieldSchema.title)} style={{}} />;
                break;
            }

            if (typedKey === ClaimsOrganizationSchemaorg.addressCountry) {
              fieldComponent = <CountrySelector value={localData[typedKey]} onChange={(v: any) => updateField(typedKey, v)} placeholder={t(placeholder)} />;
            }

            return (
              <View key={typedKey} style={{ width: `${100 / columnCount}%`, padding: 8 }}>
                <ThemedText style={[styles.formLabel, { textAlign: 'left' }]}>{t(fieldSchema.title)}</ThemedText>
                {fieldComponent}
              </View>
            );
          })}

          {/* FIX: Picker now reads from and writes to localData using the correct schema key */}
          <View style={{ width: `${100 / columnCount}%`, padding: 8 }}>
            <ThemedText style={[styles.formLabel, { textAlign: 'left' }]}>Service Provider</ThemedText>
            <ThemedPicker 
              selectedValue={localData[ClaimsServiceSchemaorg.url]} 
              onValueChange={(v: any) => updateField(ClaimsServiceSchemaorg.url, v)} 
              items={ServiceProviders.map(p => ({ label: p.name, value: p.url }))} 
              accessibilityLabel="Service Provider" 
            />
          </View>
        </>
      )}
    </FormStepLayout>
  );
}
