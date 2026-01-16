// screens/organization/OrgRegisterRepresentativeScreen.tsx

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Platform, View, Pressable, DimensionValue } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { DocumentPickerAsset } from 'expo-document-picker';
import { readAsStringAsync, EncodingType } from 'expo-file-system/legacy';

import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useOrgRegistryForm } from '../../context/OrgRegistryFormContext';
import { useSubject } from '../../context/SubjectContext';

import { registrationSchemaPart2, registrationUiSchemaPart2, OrgRegistrationForm } from '../../forms/organization-registry-RJSF';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { ClaimsPersonSchemaorg, ClaimsServiceSchemaorg } from '../../constants/Schemas';
import { getIscoRoleLabelKey, roles as appRoles } from '../../constants/Roles';
import { Routes } from '../../constants/Routes';

import { getJwtPayload } from '../../utils/jwt';

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
  const { formData: entityData, setFormData } = useOrgRegistryForm();
  
  const { accessToken: idToken } = useSubject();
  
  const [localData, setLocalData] = useState<Partial<OrgRegistrationForm>>({});

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

  const updateField = useCallback((field: keyof OrgRegistrationForm, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFilePick = useCallback(async (assets: DocumentPickerAsset[]) => {
    if (assets && assets.length > 0) {
      const file = assets[0];
      updateField(ClaimsServiceSchemaorg.termsOfService, file.uri);
      try {
        const base64Content = await readAsStringAsync(file.uri, { encoding: EncodingType.Base64 });
        const dataUri = `data:${file.mimeType};base64,${base64Content}`;
        updateField(ClaimsServiceSchemaorg.termsOfService, dataUri);
      } catch (error) {
        // Keep the file URI as a fallback when base64 encoding is unavailable.
      }
    }
  }, [updateField]);
  
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

  const handleNext = useCallback(() => {
    const finalFormData = { ...entityData, ...localData };
    setFormData(finalFormData);
    
    if (!idToken) {
        navigation.dispatch(CommonActions.navigate({ name: 'ErrorScreen', params: { errorMessage: "Authorization token is missing." } }));
        return;
    }

    navigation.navigate(Routes.Organization.NewEntity.name);
  }, [entityData, localData, setFormData, navigation, idToken]);
  
  const renderFormField = (key: keyof OrgRegistrationForm, columnCount: number): React.ReactNode => {
    const fieldSchema = (registrationSchemaPart2.properties as any)?.[key] ?? ((registrationSchemaPart2.dependencies as any)?.signatureType?.oneOf?.[1]?.properties || {})[key];
    if (typeof fieldSchema !== 'object' || !fieldSchema.title) return null;

    const uiSchema = (registrationUiSchemaPart2 as any)[key] || {};
    const placeholder = uiSchema['ui:options']?.placeholder || '';

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
        fieldComponent = <ThemedPicker selectedValue={(localData as any)[key]} onValueChange={(v) => updateField(key, v)} items={pickerOptions} accessibilityLabel={t(fieldSchema.title)} />;
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
            editable={key === ClaimsPersonSchemaorg.email ? !emailFromToken : undefined}
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
      isLoading={false}
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
        </>
      )}
    </FormStepLayout>
  );
}
