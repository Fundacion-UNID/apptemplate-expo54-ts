// components/forms/OrgRegistrationForm.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React from 'react';
import { View, Pressable } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

// Component Imports
import ThemedText from '../ThemedText';
import ThemedInput from '../ThemedTextInput';
import ThemedPicker from '../ThemedPicker';
import CountrySelector from '../CountrySelector';
import FilePickerButton from '../FilePickerButton';

// Style, Hooks and Constants
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { getScreenStyles } from '../../constants/Styles';
import { roles as roleGroups } from '../../constants/Roles';
import { identifierTypes } from '../../constants/IdentifierTypes';

// Tab sub-component (kept here as it's specific to this form's layout)
const Tab = ({ title, isActive, onPress }) => {
  const activeColor = useThemeColor({}, 'tint');
  const inactiveColor = useThemeColor({}, 'background');
  const activeTextColor = useThemeColor({}, 'background');
  const inactiveTextColor = useThemeColor({}, 'text');
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);

  return (
    <Pressable
      onPress={onPress}
      style={[
        isActive ? styles.activeTab : styles.inactiveTab,
        { backgroundColor: isActive ? activeColor : inactiveColor },
      ]}
    >
      <ThemedText style={[{ color: isActive ? activeTextColor : inactiveTextColor }, styles.activeTabText]}>
        {title}
      </ThemedText>
    </Pressable>
  );
};

/**
 * A "dumb" presentational component for the Organization Registration form.
 * It receives all its data and callbacks via props and has no internal business logic.
 * @param {object} props
 * @param {object} props.formData - The object holding the current state of all form fields.
 * @param {function} props.onFieldChange - A callback function `(fieldName, value) => {}` to update the form state in the parent.
 * @param {boolean} props.isReadonly - If true, all fields are disabled.
 * @param {number} props.columnCount - The number of columns for the layout.
 * @param {function} props.t - The translation function from i18next.
 */
const OrgRegistrationComponent = ({ formData, onFieldChange, isReadonly, columnCount, t }) => {
  const { scaleFactor } = useAccessibilityContext();
  const textColor = useThemeColor({}, 'text');
  const styles = getScreenStyles(scaleFactor);

  const roleItems = Object.values(roleGroups.managing).map((roleKey) => ({
    value: roleKey,
    label: t(`${roleKey}-label`),
  }));

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const canAttachFile = isEmailValid && !!formData.role;

  return (
    <View style={{ padding: 16 }}>
      <ThemedText style={[styles.tabGroupLabel, { color: textColor }]}>{t('common.forms.signatureTypeLabel')}</ThemedText>
      <View style={styles.tabGroupContainer}>
        <View style={styles.tabGroup}>
          <Tab title={t('common.forms.tabs.digitalCertificate')} isActive={formData.signatureType === 0} onPress={() => onFieldChange('signatureType', 0)} />
          <Tab title={t('common.forms.tabs.verificationCode')} isActive={formData.signatureType === 1} onPress={() => onFieldChange('signatureType', 1)} />
        </View>
      </View>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 16 }}>
        {/* All form fields are now disabled if a draft exists (isReadonly) */}
        <View style={{ width: `${100 / columnCount}%`, padding: 8 }}>
          <ThemedText style={styles.formLabel}>{t('organization.screens.newRepresentative.options.email-input-label')}</ThemedText>
          <ThemedInput value={formData.email} onChangeText={(v) => onFieldChange('email', v)} disabled={isReadonly} placeholder={t('organization.screens.newRepresentative.options.email-input-placeholder')} />
        </View>
        <View style={{ width: `${100 / columnCount}%`, padding: 8 }}>
          <ThemedText style={styles.formLabel}>{t('common.forms.phone')}</ThemedText>
          <ThemedInput value={formData.phone} onChangeText={(v) => onFieldChange('phone', v)} disabled={isReadonly} placeholder={t('common.forms.phonePlaceholder')} />
        </View>
        <View style={{ width: `${100 / columnCount}%`, padding: 8 }}>
          <ThemedText style={styles.formLabel}>{t('organization.screens.newRepresentative.options.role-picker-label')}</ThemedText>
          <ThemedPicker selectedValue={formData.role} onValueChange={(v) => onFieldChange('role', v)} items={[{ label: t('organization.screens.newRepresentative.options.role-picker-placeholder'), value: '' }, ...roleItems]} disabled={isReadonly} />
        </View>
        
        {formData.signatureType === 1 && (
          <>
            <View style={{ width: `${100 / columnCount}%`, padding: 8 }}>
              <ThemedText style={styles.formLabel}>{t('common.forms.officialName')}</ThemedText>
              <ThemedInput value={formData.officialName} onChangeText={(v) => onFieldChange('officialName', v)} disabled={isReadonly} placeholder={t('common.forms.officialNamePlaceholder')} />
            </View>
            <View style={{ width: `${100 / columnCount}%`, padding: 8 }}>
              <ThemedText style={styles.formLabel}>{t('common.forms.lastName')}</ThemedText>
              <ThemedInput value={formData.lastName} onChangeText={(v) => onFieldChange('lastName', v)} disabled={isReadonly} placeholder={t('common.forms.lastNamePlaceholder')} />
            </View>
            <View style={{ width: `${100 / columnCount}%`, padding: 8 }}>
              <ThemedText style={styles.formLabel}>{t('common.forms.secondLastName')}</ThemedText>
              <ThemedInput value={formData.secondLastName} onChangeText={(v) => onFieldChange('secondLastName', v)} disabled={isReadonly} placeholder={t('common.forms.secondLastNamePlaceholder')} />
            </View>
            <View style={{ width: `${100 / columnCount}%`, padding: 8 }}>
              <ThemedText style={styles.formLabel}>{t('common.forms.jurisdiction')}</ThemedText>
              <CountrySelector value={formData.jurisdiction} onChange={(v) => onFieldChange('jurisdiction', v)} disabled={isReadonly} placeholder={t('common.forms.jurisdictionPlaceholder')} />
            </View>
            <View style={{ width: `${100 / columnCount}%`, padding: 8 }}>
              <ThemedText style={styles.formLabel}>{t('common.forms.identifierType')}</ThemedText>
              <ThemedPicker selectedValue={formData.identifierType} onValueChange={(v) => onFieldChange('identifierType', v)} items={[{ label: t('common.forms.identifierTypePlaceholder'), value: '' }, ...identifierTypes.map(type => ({ label: t(`forms.identifierTypeLabels.${type}`), value: type }))]} disabled={isReadonly} />
            </View>
            <View style={{ width: `${100 / columnCount}%`, padding: 8 }}>
              <ThemedText style={styles.formLabel}>{t('common.forms.identifierNumber')}</ThemedText>
              <ThemedInput value={formData.identifierNumber} onChangeText={(v) => onFieldChange('identifierNumber', v)} disabled={isReadonly} placeholder={t('common.forms.identifierNumberPlaceholder')} />
            </View>
          </>
        )}

        <View style={{ width: '100%', padding: 8, marginTop: 16 }}>
          <FilePickerButton
            title={formData.termsFile ? 'Terms Attached' : t('common.forms.attachTerms')}
            onFilePick={(f) => onFieldChange('termsFile', f)}
            disabled={!canAttachFile || isReadonly}
            maxFiles={1} // <-- Ensure only one file can be picked
          />
        </View>
      </View>
    </View>
  );
};

export default OrgRegistrationComponent;
