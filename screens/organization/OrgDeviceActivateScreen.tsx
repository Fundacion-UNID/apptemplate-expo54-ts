// screens/organization/OrgDeviceActivateScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RouteProp, useRoute, useNavigation, CommonActions } from '@react-navigation/native';

import { useProfile } from '../../context/ProfileContext';
import ThemedButton from '../../components/ThemedButton';
import ScreenHeader from '../../components/ScreenHeader';
import ThemedInput from '../../components/ThemedTextInput';
import { useThemeColor } from '../../hooks/useThemeColor';
import { getScreenStyles } from '../../constants/Styles';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { Routes } from '../../constants/Routes';

// Define the type for the navigation route parameters
// The only parameter we now expect is the idToken from the initial native login.
type ActivateDeviceScreenRouteProp = {
  ActivateDevice: {
    idToken: string;
    activationCode?: string;
  };
};

export default function OrgDeviceActivateScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ActivateDeviceScreenRouteProp, 'ActivateDevice'>>();
  const { profileManager, operationMode } = useProfile();
  
  // Get idToken from the navigation state.
  const { idToken, activationCode: activationCodeFromRoute } = route.params;

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
    // CRITICAL: Pull all necessary info from the active session context, not from params.
    if (isLoading || !profileManager?.common?.auth || !profileManager.orgDidDoc?.id) {
        Alert.alert("Error", "Profile session is not ready or is missing required information.");
        return;
    };

    setIsLoading(true);
    try {
      // The providerDid is now sourced directly from the session's DID Document.
      const providerDid = profileManager.orgDidDoc.id;

      const { thid } = await profileManager.common.auth.activateDevice(
        activationCode,
        providerDid,
        idToken
      );

      const clientId = await waitForClientId(thid);
      if (clientId) {
        await profileManager.updateProfile({ deviceDid: clientId, status: 'active' });
      } else if (profileManager.profile) {
        profileManager.profile.status = 'active';
      }

      // Optimistically update the profile status in the context.
      if (profileManager.profile && profileManager.profile.status !== 'active') {
        profileManager.profile.status = 'active';
      }
      
      Alert.alert(
        t('common.screens.activateDevice.successTitle'),
        t('common.screens.activateDevice.successMessage')
      );
      navigation.navigate(Routes.Organization.Dashboard.name);

    } catch (error: any) {
      console.error("[ActivateDeviceScreen] Activation failed:", error);

      if (operationMode === 'DEMO') {
        console.warn("[ActivateDeviceScreen] DEMO MODE: Bypassing activation failure. Navigating to Dashboard.");
        if (profileManager.profile) {
          profileManager.profile.status = 'active'; // Simulate success
        }
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: Routes.Organization.Dashboard.name }],
          })
        );
      } else {
        Alert.alert(t('common.error.title'), error.message || t('common.unknownError'));
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <View style={[screenStyles.container, { backgroundColor }]}>
      <ScreenHeader
        title={t('common.screens.activateDevice.title')}
        subtitle={t('common.screens.activateDevice.subtitle')} description={undefined}      />
      <View style={styles.formContainer}>
        <ThemedInput
          placeholder={t('common.screens.activateDevice.placeholder')}
          value={activationCode}
          onChangeText={setActivationCode}
          editable={!isLoading}
          accessibilityLabel={t('common.screens.activateDevice.label')}
          accessibilityHint={t('common.screens.activateDevice.hint')} style={undefined}        />
        {isLoading ? (
          <ActivityIndicator size="large" style={styles.activityIndicator} />
        ) : (
          <ThemedButton
            title={t('common.screens.activateDevice.button')}
            onPress={handleActivate}
            disabled={!activationCode || isLoading} 
            accessibilityLabel={t('common.screens.activateDevice.button')}
            accessibilityRole="button"
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
