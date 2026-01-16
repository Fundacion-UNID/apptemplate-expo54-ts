// screens/organization/OrgJoinScreen.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useState, useMemo, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RouteProp, useRoute } from '@react-navigation/native';

import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { getScreenStyles } from '../../constants/Styles';
import { useThemeColor } from '../../hooks/useThemeColor';
import ScreenHeader from '../../components/ScreenHeader';
import ThemedPicker from '../../components/ThemedPicker';
import ThemedInput from '../../components/ThemedTextInput';
import ThemedButton from '../../components/ThemedButton';
import { AuthManagerMock } from '../../managers/LoginManager';
import { Routes } from '../../constants/Routes';
import { getIscoRoleLabelKey, organizationRoleCodes, sectorRoleCodes } from '../../constants/Roles';
import { Sector } from '../../constants/Schemas';
import ThemedText from '../../components/ThemedText';


export default function OrgJoinScreen({ navigation }) {
  const route = useRoute<RouteProp<{ OrgJoin: { email: string; idToken: string } }, 'OrgJoin'>>();
  const { email, idToken } = route.params || ({} as any);
  const { t } = useTranslation();
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const backgroundColor = useThemeColor({}, 'background');

  const [role, setRole] = useState('');
  const [sector, setSector] = useState('');
  const [code, setCode] = useState('');
  const authManager = useMemo(() => new AuthManagerMock(), []);

  const handleJoinPress = async () => {
    try {
      if (!email || !idToken) {
        Alert.alert(t('common.error'), t('common.error.missingFields', 'Missing required fields.'));
        return;
      }
      // In a real implementation, you would pass the role to the manager
      // For the mock, we just proceed after validation.
      const jwtPayload = await authManager.validateCode(code);
      if (jwtPayload) {
        console.log('[Join] Auth successful. Role:', role, 'Payload:', jwtPayload);
        navigation.navigate(Routes.Organization.Dashboard.name);
      } else {
        // Handle invalid code
        console.log('[Join] Invalid code entered.');
      }
    } catch (error) {
      console.error('[Join] Authentication error:', error);
    }
  };

  const isFormValid = useMemo(() => {
    return sector !== '' && role !== '' && code.trim().length > 0; // Basic validation
  }, [sector, role, code]);

  const availableRoleCodes = useMemo(() => {
    if (!sector) return [];
    return sectorRoleCodes[sector] || organizationRoleCodes;
  }, [sector]);

  useEffect(() => {
    if (role && !availableRoleCodes.includes(role)) {
      setRole('');
    }
  }, [role, availableRoleCodes]);

  const roleItems = availableRoleCodes.map((roleKey) => ({
    value: roleKey,
    label: t(getIscoRoleLabelKey(roleKey), roleKey),
  }));

  const sectorItems = Object.values(Sector).map((sectorValue) => ({
    label: t(`pickers.sectors.${sectorValue}`),
    value: sectorValue,
  }));

  const handleSuccess = (jwtPayload) => {
    console.log('[Join] Auth successful. Payload:', jwtPayload);
    navigation.navigate(Routes.Organization.Dashboard.name);
  };


  return (
    <View style={[styles.container, { backgroundColor, justifyContent: 'flex-start' }]}>
      <ScreenHeader
        title={t('organization.screens.join.title')}
        subtitle={t('organization.screens.join.subtitle')}
      />
      <View style={{ width: '80%', marginTop: 20, alignSelf: 'center' }}>
        <ThemedText style={styles.formLabel}>{t('organization.screens.join.sector-picker-label')}</ThemedText>
        <ThemedPicker
          selectedValue={sector}
          onValueChange={setSector}
          items={sectorItems}
          placeholder={t('organization.screens.join.sector-picker-placeholder')}
        />
        <ThemedText style={styles.formLabel}>{t('organization.screens.join.role-picker-label')}</ThemedText>
        <ThemedPicker
          selectedValue={role}
          onValueChange={setRole}
          items={roleItems}
          placeholder={t('organization.screens.join.role-picker-placeholder')}
          disabled={!sector}
        />
        <ThemedText style={[styles.formLabel, { marginTop: 20 }]}>{t('organization.screens.join.code-input-label')}</ThemedText>
        <ThemedInput
          placeholder={t('organization.screens.join.code-input-placeholder')}
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
          maxLength={6}
          editable={!!sector}
        />
        <ThemedButton
          title={t('organization.screens.join.join-button-label')}
          onPress={handleJoinPress}
          disabled={!isFormValid}
          style={{ marginTop: 30 }}
        />
      </View>
    </View>
  );
}
