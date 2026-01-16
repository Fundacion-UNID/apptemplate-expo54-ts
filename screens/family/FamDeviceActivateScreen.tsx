// screens/family/FamDeviceActivateScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation, CommonActions, RouteProp } from '@react-navigation/native';

import { useProfile } from '../../context/ProfileContext';
import ThemedButton from '../../components/ThemedButton';
import ScreenHeader from '../../components/ScreenHeader';
import ThemedInput from '../../components/ThemedTextInput';
import { useThemeColor } from '../../hooks/useThemeColor';
import { getScreenStyles } from '../../constants/style_family';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { Routes } from '../../constants/Routes';

type ActivateDeviceRouteParams = {
  FamilyDeviceActivate: { idToken: string; activationCode?: string };
};

export default function FamDeviceActivateScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ActivateDeviceRouteParams, 'FamilyDeviceActivate'>>();
  const { profileManager, operationMode } = useProfile();
  const { idToken, activationCode: activationCodeFromRoute } = route.params || ({} as any);

  const { scaleFactor } = useAccessibilityContext();
  const screenStyles = getScreenStyles(scaleFactor);
  const backgroundColor = useThemeColor({}, 'background');

  const [activationCode, setActivationCode] = useState(activationCodeFromRoute || '');
  const [isLoading, setIsLoading] = useState(false);

  const waitForClientId = async (thid: string): Promise<string | null> => {
    if (!profileManager?.common?.auth) return null;
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const result = await profileManager.common.auth.getDeviceRegistrationResult(thid);
      if (result?.clientId) return result.clientId;
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    return null;
  };

  const handleActivate = async () => {
    if (isLoading || !profileManager?.common?.auth || !profileManager.orgDidDoc?.id) {
      Alert.alert('Error', 'Profile session is not ready or is missing required information.');
      return;
    }

    setIsLoading(true);
    try {
      const providerDid = profileManager.orgDidDoc.id;
      const { thid } = await profileManager.common.auth.activateDevice(activationCode, providerDid, idToken);
      const clientId = await waitForClientId(thid);
      if (clientId) {
        await profileManager.updateProfile({ deviceDid: clientId, status: 'active' });
      } else if (profileManager.profile) {
        profileManager.profile.status = 'active';
      }

      Alert.alert(
        t('common.screens.activateDevice.successTitle'),
        t('common.screens.activateDevice.successMessage')
      );
      navigation.navigate(Routes.Family.Dashboard.name);
    } catch (error) {
      if (operationMode === 'DEMO') {
        if (profileManager.profile) {
          profileManager.profile.status = 'active';
        }
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: Routes.Family.Dashboard.name }],
          })
        );
      } else {
        Alert.alert(t('common.error.title'), (error as Error).message || t('common.unknownError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[screenStyles.container, { backgroundColor }]}>
      <ScreenHeader
        title={t('common.screens.activateDevice.title')}
        subtitle={t('common.screens.activateDevice.subtitle')}
      />
      <View style={styles.formContainer}>
        <ThemedInput
          placeholder={t('common.screens.activateDevice.placeholder')}
          value={activationCode}
          onChangeText={setActivationCode}
          editable={!isLoading}
          accessibilityLabel={t('common.screens.activateDevice.label')}
          accessibilityHint={t('common.screens.activateDevice.hint')}
        />
        {isLoading ? (
          <ActivityIndicator size="large" style={styles.activityIndicator} />
        ) : (
          <ThemedButton
            title={t('common.screens.activateDevice.button')}
            onPress={handleActivate}
            disabled={!activationCode || isLoading}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  activityIndicator: {
    marginTop: 20,
  },
});
