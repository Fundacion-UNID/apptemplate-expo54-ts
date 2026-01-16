// screens/organization/OrgCodeVerificationScreen.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import ScreenHeader from '../../components/ScreenHeader';
import ThemedText from '../../components/ThemedText';
import ThemedTextInput from '../../components/ThemedTextInput';
import ThemedButton from '../../components/ThemedButton';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { getScreenStyles } from '../../constants/Styles';
import { useThemeColor } from '../../hooks/useThemeColor';
import { Routes } from '../../constants/Routes';
import { AuthManagerMock } from '../../managers/LoginManager';

const manager = new AuthManagerMock();

export default function OrgCodeVerificationScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [jwtPayload, setJWTPayload] = useState(null);

  // Get email from route params or fallback (optional)
  const email = route?.params?.email || '';

  const handleSubmit = async () => {
    try {
      setError('');
      const result = await manager.codeVerificationExchange(email, code);
      if (result.valid) {
        setJWTPayload(result.payload);
        navigation.navigate(Routes.Organization.Dashboard.name);
      }
    } catch (err) {
      setError(err.message || 'Verification failed.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <ScreenHeader
                title={t('organization.screens.orgCodeVerification.title')}
      subtitle={t('organization.screens.orgCodeVerification.subtitle')}
        />

        <View style={styles.formGroup}>
          <ThemedTextInput
            accessible={true}
            accessibilityLabel={t('organization.screens.orgCodeVerification.options.01-code-input-label')}
            accessibilityHint={t('organization.screens.orgCodeVerification.options.01-code-input-placeholder')}
            value={code}
            onChangeText={setCode}
            placeholder={t('organization.screens.orgCodeVerification.options.01-code-input-placeholder')}
          />
          {error ? (
            <ThemedText style={{ color: 'red', marginTop: 8 }}>{error}</ThemedText>
          ) : null}
        </View>

        <ThemedButton
          accessible={true}
          accessibilityLabel={t('organization.screens.orgCodeVerification.options.02-next-button-label')}
          title={t('organization.screens.orgCodeVerification.options.02-next-button-label')}
          onPress={handleSubmit}
          disabled={!code}
        />
      </ScrollView>
    </View>
  );
}
