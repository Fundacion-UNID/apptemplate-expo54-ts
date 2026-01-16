// components/AuthCodeInput.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { useState } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { useThemeColor } from '../hooks/useThemeColor';
import { getScreenStyles } from '../constants/Styles';
import ThemedButton from './ThemedButton';
import ThemedInput from './ThemedTextInput'; // Use ThemedInput

export default function AuthCodeInput({ onSuccess, manager }) {
  const { t } = useTranslation();
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const errorColor = useThemeColor({}, 'error');

  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleGetCode = async () => {
    setError('');
    try {
      if (!manager?.requestVerificationCodeEmail) throw new Error('Manager not provided or invalid');
      await manager.requestVerificationCodeEmail(email);
      setCodeSent(true);
    } catch (err) {
      console.warn('[AuthCodeInput] Code request failed:', err);
      setError(t('codeRequestFailed'));
    }
  };

  const handleVerify = async () => {
    try {
      if (!manager?.codeVerificationExchange) throw new Error('Manager does not support code exchange');
      const result = await manager.codeVerificationExchange(email, verificationCode);
      if (!result?.valid) throw new Error('Invalid token exchange result');
      setError('');
      onSuccess?.(result.payload);
    } catch (err) {
      console.warn('[AuthCodeInput] Verification failed:', err);
      setError(t('invalidCode'));
    }
  };

  return (
    <View>
      <ThemedInput
        placeholder={t('input-email-placeholder')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        accessibilityLabel={t('input-email-label')}
        testID="email-input"
      />

      {!codeSent && (
        <ThemedButton
          title={t('sendCode')}
          onPress={handleGetCode}
          disabled={!isValidEmail(email)}
        />
      )}

      {codeSent && (
        <>
          <ThemedInput
            placeholder={t('input-code-placeholder')}
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            accessibilityLabel={t('input-code-label')}
            testID="code-input"
          />

          <ThemedButton
            title={t('verifyCode')}
            onPress={handleVerify}
            disabled={verificationCode.trim() === ''}
          />
        </>
      )}

      {error ? (
        <Text style={[styles.body, { color: errorColor, textAlign: 'center', marginTop: 10 }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
