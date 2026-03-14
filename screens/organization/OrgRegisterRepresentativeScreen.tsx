// screens/organization/OrgRegisterRepresentativeScreen.tsx

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Pressable, DimensionValue, Platform } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';
import { DocumentPickerAsset } from 'expo-document-picker';
import { readAsStringAsync, EncodingType } from 'expo-file-system/legacy';

import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useOrgRegistryForm } from '../../context/OrgRegistryFormContext';
import { useProfile } from '../../context/ProfileContext';
import { useSubject } from '../../context/SubjectContext';

import { registrationSchemaPart2, registrationUiSchemaPart2, OrgRegistrationForm } from '../../forms/organization-registry-RJSF';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { ClaimsPersonSchemaorg, ClaimsServiceSchemaorg } from '../../constants/Schemas';
import { getIscoRoleLabelKey, roles as appRoles } from '../../constants/Roles';
import { Routes } from '../../constants/Routes';

import { getJwtPayload } from '../../utils/jwt';
import { runIcaReadmeVerifyFlow } from '../../utils/icaReadmeDemo';
import { buildIcaAutofillData, getOrganizationDidFromIca } from '../../utils/orgRegistrationIca';
import { deriveProfileId } from '../../utils/profileId';
import { appWallet } from '../../platformServices';
import { getBaseUrlFromDidWeb } from 'gdc-common-utils-ts/utils/did';
import { MldsaPublicJwk, MlkemPublicJwk } from 'gdc-common-utils-ts/interfaces/Cryptography.types';
import {
  generateDidDocument_forMock,
  generateGatewayEntityServices_forMock,
  generateWellKnownServices_forMock,
} from 'gdc-sdk-client-ts';

import FormStepLayout from '../../components/FormStepLayout';
import ThemedText from '../../components/ThemedText';
import ThemedInput from '../../components/ThemedTextInput';
import ThemedPicker from '../../components/ThemedPicker';
import FilePickerButton from '../../components/FilePickerButton';
import { getScreenStyles } from '../../constants/Styles';

type Props = StackScreenProps<RootStackParamList, 'OrgNewRepresentative'>;

export default function OrgRegisterRepresentativeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const { formData: entityData, icaVerification, setFormData, setIcaVerification } = useOrgRegistryForm();
  const { initializeSession, sdk } = useProfile();
  
  const { accessToken: idToken } = useSubject();
  
  const [localData, setLocalData] = useState<Partial<OrgRegistrationForm>>(() => {
    const initialState: Partial<OrgRegistrationForm> = {};
    Object.keys(registrationSchemaPart2.properties as any).forEach((key) => {
      (initialState as any)[key] = (entityData as any)[key] || '';
    });
    Object.keys(((registrationSchemaPart2.dependencies as any)?.signatureType?.oneOf?.[1]?.properties || {})).forEach((key) => {
      if (key === 'signatureType') return;
      (initialState as any)[key] = (entityData as any)[key] || '';
    });
    initialState.signatureType = typeof entityData.signatureType === 'number' ? entityData.signatureType : 0;
    return initialState;
  });
  const [termsPdfDataUri, setTermsPdfDataUri] = useState<string | null>(
    typeof entityData[ClaimsServiceSchemaorg.termsOfService] === 'string'
      ? entityData[ClaimsServiceSchemaorg.termsOfService]
      : null
  );
  const [termsFileBytes, setTermsFileBytes] = useState<Uint8Array | null>(null);
  const [termsFileMediaType, setTermsFileMediaType] = useState<string>('application/pdf');
  const [icaLog, setIcaLog] = useState<string>('');
  const [isVerifyingIca, setIsVerifyingIca] = useState(false);

  const fastTrackToDashboard = process.env.EXPO_PUBLIC_ORG_ICA_FAST_TRACK === 'true';
  const isDemoMode = String(Constants.expoConfig?.extra?.OPERATION_MODE || process.env.EXPO_PUBLIC_OPERATION_MODE || 'DEMO')
    .trim()
    .toUpperCase() === 'DEMO';

  const emailFromToken = useMemo(() => {
    if (!idToken) return '';
    const payload = getJwtPayload(idToken);
    return (payload as any)?.email || '';
  }, [idToken]);

  useEffect(() => {
    if (!emailFromToken) return;
    if (!localData[ClaimsPersonSchemaorg.email]) {
      setLocalData((prev) => ({ ...prev, [ClaimsPersonSchemaorg.email]: emailFromToken }));
    }
  }, [emailFromToken, localData]);

  const icaAutofillData = useMemo(
    () => (icaVerification ? buildIcaAutofillData(icaVerification) : {}),
    [icaVerification]
  );
  const icaLockedFields = useMemo(
    () => new Set(Object.keys(icaAutofillData) as Array<keyof OrgRegistrationForm>),
    [icaAutofillData]
  );

  const updateField = useCallback((field: keyof OrgRegistrationForm, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  }, []);

  const decodeBase64ToBytes = useCallback((base64: string): Uint8Array | null => {
    if (!base64) return null;

    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    } catch {
      return null;
    }
  }, []);

  const inferTermsMediaType = useCallback((asset: DocumentPickerAsset): string => {
    if (typeof asset.mimeType === 'string' && asset.mimeType.trim()) {
      return asset.mimeType;
    }

    const source = `${asset.name || ''} ${asset.uri || ''}`.toLowerCase();
    if (source.includes('.xlsx')) {
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    if (source.includes('.pdf')) {
      return 'application/pdf';
    }

    return 'application/octet-stream';
  }, []);

  const handleFilePick = useCallback(async (assets: DocumentPickerAsset[]) => {
    if (assets && assets.length > 0) {
      const file = assets[0];
      const mediaType = inferTermsMediaType(file);
      updateField(ClaimsServiceSchemaorg.termsOfService, file.uri);
      setTermsFileBytes(null);
      setTermsFileMediaType(mediaType);

      if (Platform.OS === 'web') {
        const browserFile = (file as DocumentPickerAsset & { file?: File }).file;
        if (browserFile && typeof browserFile.arrayBuffer === 'function') {
          try {
            const buffer = await browserFile.arrayBuffer();
            setTermsFileBytes(new Uint8Array(buffer));
            setTermsPdfDataUri(file.uri);
            return;
          } catch {
            // fall through to the other web/native readers
          }
        }
      }

      try {
        const base64Content = await readAsStringAsync(file.uri, { encoding: EncodingType.Base64 });
        const dataUri = `data:${file.mimeType};base64,${base64Content}`;
        updateField(ClaimsServiceSchemaorg.termsOfService, dataUri);
        setTermsPdfDataUri(dataUri);
        setTermsFileBytes(decodeBase64ToBytes(base64Content));
      } catch (error) {
        if (Platform.OS === 'web' && typeof fetch === 'function' && file.uri.startsWith('blob:')) {
          try {
            const response = await fetch(file.uri);
            const buffer = await response.arrayBuffer();
            setTermsFileBytes(new Uint8Array(buffer));
            setTermsPdfDataUri(file.uri);
            return;
          } catch {
            // fall through to URI-only fallback
          }
        }
        setTermsPdfDataUri(file.uri);
      }
    }
  }, [decodeBase64ToBytes, inferTermsMediaType, updateField]);

  const decodeDataUriToBytes = useCallback((dataUri: string): Uint8Array | null => {
    if (!dataUri.startsWith('data:')) return null;

    const [, base64 = ''] = dataUri.split(',');
    if (!base64) return null;

    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    } catch {
      return null;
    }
  }, []);

  const isFormValid = useMemo(() => {
    const dataToValidate = { ...entityData, ...localData };
    const baseRequired = registrationSchemaPart2.required || [];
    let conditionalRequired: string[] = [];
    if ((dataToValidate as any).signatureType === 1) {
      const dependencies = registrationSchemaPart2.dependencies as any;
      conditionalRequired = dependencies?.signatureType?.oneOf?.[1]?.required || [];
    }
    const allRequired = [...baseRequired, ...conditionalRequired];
    return allRequired.every((fieldKey) => {
      const value = dataToValidate[fieldKey as keyof OrgRegistrationForm];
      return typeof value === 'string' ? value.trim().length > 0 : !!value;
    });
  }, [entityData, localData]);

  const attachDidDocumentFromIcaCredentials = useCallback(async ({
    profileId,
    controllerSameAs,
    organizationCredential,
    legalRepresentativeCredential,
  }: {
    profileId: string;
    controllerSameAs: string;
    organizationCredential: any;
    legalRepresentativeCredential: any;
  }) => {
    const keySet = await appWallet.provisionKeys(profileId);
    const signingKey =
      keySet.keys.find((key: any) => key?.kty === 'AKP') ||
      keySet.keys[0];
    const encryptionKey =
      keySet.keys.find((key: any) => key?.kty === 'OKP') ||
      keySet.keys.find((key: any) => key?.kty !== 'AKP') ||
      keySet.keys[1];

    if (!signingKey || !encryptionKey) {
      throw new Error('No key pair available to create the organization DID document.');
    }

    const sdkModule: any = await import('ica-client-sdk-ts');
    const { IcaClient, Sector } = sdkModule;

    const rawSector = String(process.env.EXPO_PUBLIC_ICA_README_DEMO_SECTOR || '').trim().toLowerCase();
    const sector =
      rawSector === 'animal-care'
        ? (Sector.AnimalCare ?? 'animal-care')
        : rawSector === 'onehealth-research'
          ? (Sector.OneHealthResearch ?? 'onehealth-research')
          : (Sector.HealthCare ?? 'health-care');

    const client = new IcaClient({
      sector,
      didWeb: process.env.EXPO_PUBLIC_ICA_README_DEMO_DID_WEB || 'did:web:ica',
      organizationVcs: [],
      baseUrl: process.env.EXPO_PUBLIC_ICA_BASE_URL || process.env.ICA_BASE_URL || 'http://localhost:3310',
      retryTimes: 5,
      retryDelayMs: 1500,
      fetch: typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : undefined,
    });

    try {
      const { thid } = await client.createOrgDidDocumentFromVcs({
        controllerSameAs,
        organizationVC: organizationCredential,
        legalRepresentativeVC: legalRepresentativeCredential,
        organizationPublicKeyJwk: signingKey,
        controllerPublicKeyJwk: signingKey,
      });

      const didDocumentResponse = await client.pollCreateOrgDidDocumentResponse(thid);
      const didDocument =
        didDocumentResponse?.body?.data?.[0]?.resource?.didDocument ||
        didDocumentResponse?.body?.data?.[0]?.resource;

      if (!didDocument?.id) {
        throw new Error('ICA did document response did not include a DID document.');
      }

      return { thid, didDocumentResponse, didDocument };
    } catch (error) {
      if (!isDemoMode) {
        throw error;
      }

      const organizationDid = String(
        organizationCredential?.credentialSubject?.id ||
        legalRepresentativeCredential?.credentialSubject?.memberOf?.id ||
        ''
      ).trim();
      if (!organizationDid.startsWith('did:web:')) {
        throw error;
      }

      console.warn('[ICA DID document] using DEMO fallback DID document', {
        reason: (error as Error)?.message || 'unknown',
        organizationDid,
      });

      const didDocument = generateDidDocument_forMock(
        organizationDid,
        `${getBaseUrlFromDidWeb(organizationDid).replace(/\/?$/, '/')}`,
        [generateWellKnownServices_forMock, generateGatewayEntityServices_forMock],
        {
          mldsa: signingKey as MldsaPublicJwk,
          mlkem: encryptionKey as MlkemPublicJwk,
          alsoKnownAs: organizationCredential?.credentialSubject?.taxID,
        }
      );

      return {
        thid: 'demo-ica-did-document',
        didDocumentResponse: {
          mode: 'DEMO_FALLBACK',
          reason: (error as Error)?.message || 'ICA DID document endpoint unavailable.',
          didDocument,
        },
        didDocument,
      };
    }
  }, [isDemoMode]);

  const handleNext = useCallback(async () => {
    if (!idToken) {
      navigation.dispatch(CommonActions.navigate({ name: 'ErrorScreen', params: { errorMessage: "Authorization token is missing." } }));
      return;
    }

    const usesDigitalCertificate = (localData.signatureType ?? 0) === 0;
    const baseFormData = { ...entityData, ...localData };

    if (!usesDigitalCertificate) {
      setIcaVerification(null);
      setFormData(baseFormData);
      navigation.navigate(Routes.Organization.NewEntity.name);
      return;
    }

    const termsValue = termsPdfDataUri || (typeof localData[ClaimsServiceSchemaorg.termsOfService] === 'string'
      ? localData[ClaimsServiceSchemaorg.termsOfService] as string
      : null);

    if (!termsValue) {
      setIcaLog('ICA verifyTerms requires an attached terms file.');
      return;
    }

    setIsVerifyingIca(true);
    setIcaLog('');

    try {
      const fileBytes =
        termsFileBytes ||
        (termsValue.startsWith('data:') ? decodeDataUriToBytes(termsValue) : undefined);
      const result = await runIcaReadmeVerifyFlow({
        fileBytes: fileBytes || undefined,
        fileUrl: fileBytes ? undefined : termsValue,
        mediaType: termsFileMediaType,
      });

      if (result.ok === false) {
        setIcaVerification({
          thid: result.thid,
          verifyResponse: result.verifyResponse,
          errorMessage: result.message,
        });
        setIcaLog(result.message);
        return;
      }

      const autofillData = buildIcaAutofillData(result);
      const finalFormData = { ...baseFormData, ...autofillData };
      const nextIcaVerification = {
        thid: result.thid,
        verifyResponse: result.verifyResponse,
        organizationCredential: result.organizationCredential,
        legalRepresentativeCredential: result.legalRepresentativeCredential,
        organizationInfo: result.organizationInfo,
        legalRepresentativeInfo: result.legalRepresentativeInfo,
      };

      setIcaVerification(nextIcaVerification);
      setFormData(finalFormData);
      setIcaLog(`ICA verifyTerms OK. thid=${result.thid}`);

      if (fastTrackToDashboard) {
        const providerDid = getOrganizationDidFromIca(result);
        const email = String(finalFormData[ClaimsPersonSchemaorg.email] || '').trim().toLowerCase();
        const role = String(finalFormData[ClaimsPersonSchemaorg.hasOccupation] || '').trim();

        if (providerDid && email && role) {
          try {
            const profileId = await deriveProfileId({
              appType: 'Organization',
              providerDid,
              email,
              role,
            });

            setIcaLog(`ICA verifyTerms OK. thid=${result.thid}\nCreating DID document from ICA credentials...`);

            const { thid: didDocumentThid, didDocumentResponse, didDocument } =
              await attachDidDocumentFromIcaCredentials({
                profileId,
                controllerSameAs: `mailto:${email}`,
                organizationCredential: result.organizationCredential,
                legalRepresentativeCredential: result.legalRepresentativeCredential,
              });

            sdk.addMockDidDocument(didDocument.id, didDocument);
            setIcaVerification({
              ...nextIcaVerification,
              organizationDidDocumentThid: didDocumentThid,
              organizationDidDocumentResponse: didDocumentResponse,
              organizationDidDocument: didDocument,
            });

            await initializeSession({
              profileId,
              email,
              role,
              providerDid: didDocument.id,
            });

            navigation.navigate(Routes.Organization.Dashboard.name);
            return;
          } catch (sessionError) {
            console.warn('[ICA] fast-track session init failed, falling back to entity step', sessionError);
            setIcaLog(`ICA verifyTerms OK, but fast-track session init failed: ${(sessionError as Error).message}`);
          }
        }
      }

      navigation.navigate(Routes.Organization.NewEntity.name);
    } catch (error) {
      const message = (error as Error).message || 'ICA verifyTerms failed.';
      setIcaVerification({ errorMessage: message });
      setIcaLog(message);
      console.error('[ICA] verifyTerms error', error);
    } finally {
      setIsVerifyingIca(false);
    }
  }, [
    idToken,
    localData,
    entityData,
    setIcaVerification,
    setFormData,
    navigation,
    termsPdfDataUri,
    termsFileBytes,
    termsFileMediaType,
    decodeDataUriToBytes,
    attachDidDocumentFromIcaCredentials,
    fastTrackToDashboard,
    initializeSession,
    sdk,
  ]);
  
  const renderFormField = (key: keyof OrgRegistrationForm, columnCount: number): React.ReactNode => {
    const fieldSchema = (registrationSchemaPart2.properties as any)?.[key] ?? ((registrationSchemaPart2.dependencies as any)?.signatureType?.oneOf?.[1]?.properties || {})[key];
    if (typeof fieldSchema !== 'object' || !fieldSchema.title) return null;

    const uiSchema = (registrationUiSchemaPart2 as any)[key] || {};
    const placeholder = uiSchema['ui:options']?.placeholder || '';
    const isLockedByIca = icaLockedFields.has(key);

    let fieldComponent;
    switch (uiSchema['ui:widget']) {
      case 'select':
        const pickerOptions = [
          { label: t('pickers.select'), value: '' },
          ...Object.entries(appRoles.managing).map(([roleKey, value]) => ({
            label: t(getIscoRoleLabelKey(value), roleKey),
            value,
          })),
        ];
        fieldComponent = (
          <ThemedPicker
            selectedValue={(localData as any)[key]}
            onValueChange={(v) => updateField(key, v)}
            items={pickerOptions}
            accessibilityLabel={t(fieldSchema.title)}
            disabled={isLockedByIca}
          />
        );
        break;
      case 'radio':
        fieldComponent = (
          <View style={styles.tabGroup}>
            <Pressable onPress={() => updateField('signatureType', 0)} style={localData.signatureType === 0 ? styles.activeTab : styles.inactiveTab}><ThemedText>{t('common.forms.withCert')}</ThemedText></Pressable>
            <Pressable onPress={() => updateField('signatureType', 1)} style={localData.signatureType === 1 ? styles.activeTab : styles.inactiveTab}><ThemedText>{t('common.forms.noCert')}</ThemedText></Pressable>
          </View>
        );
        break;
      case 'file': return null; 
      default:
        fieldComponent = (
          <ThemedInput
            placeholder={t(placeholder)}
            value={(localData as any)[key as string]}
            onChangeText={(v: any) => updateField(key, v)}
            accessibilityLabel={t(fieldSchema.title)}
            editable={key === ClaimsPersonSchemaorg.email ? !emailFromToken : !isLockedByIca}
            style={{}}
          />
        );
    }

    const width = uiSchema['ui:widget'] === 'radio' ? '100%' : `${100 / columnCount}%`;
    return (
      <View key={key} style={{ width: width as DimensionValue, padding: 8 }}>
        <ThemedText style={[styles.formLabel, { textAlign: 'left' }]}>{t(fieldSchema.title)}</ThemedText>
        {fieldComponent}
      </View>
    );
  };

  return (
    <FormStepLayout
      title={t('organization.screens.newRepresentative.title')}
      subtitle={t('organization.screens.newRepresentative.subtitle')}
      description=""
      onContinue={handleNext}
      isContinueEnabled={isFormValid}
      isLoading={isVerifyingIca}
    >
      {(columnCount) => (
        <>
          {Object.keys(registrationSchemaPart2.properties || {}).map(key => renderFormField(key as keyof OrgRegistrationForm, columnCount))}
          {localData.signatureType === 1 && Object.keys(((registrationSchemaPart2.dependencies as any)?.signatureType.oneOf[1].properties || {})).map(key => {
              if (key === 'signatureType') return null;
              return renderFormField(key as keyof OrgRegistrationForm, columnCount);
          })}
          <View style={{ width: '100%', padding: 8, alignItems: 'center' }}>
            <FilePickerButton 
              title={t('common.forms.attachTerms')} 
              onFilePick={handleFilePick}
              maxFiles={1}
              allowedMimeTypes={undefined}
              accessibilityLabel={t('common.forms.attachTerms')}
              accessibilityRole="button"
            />
          </View>
          {!!icaLog && (
            <View style={{ padding: 8 }}>
              <ThemedText>{`ICA log:\n${icaLog}`}</ThemedText>
            </View>
          )}
        </>
      )}
    </FormStepLayout>
  );
}
