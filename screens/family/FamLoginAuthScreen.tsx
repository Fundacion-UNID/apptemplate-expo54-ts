// screens/family/FamLoginAuthScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';

import { useAuth } from '../../hooks/useAuth';
import ScreenHeader from '../../components/ScreenHeader';
import AccessibleButtonGrid from '../../components/AccessibleButtonGrid';
import { useThemeColor } from '../../hooks/useThemeColor';
import { getScreenStyles } from '../../constants/style_family';
import { Routes } from '../../constants/Routes';
import { signInWithApple, signInWithGoogle } from '../../utils/firebase-auth';
import { AuthButtons } from '../../constants/AuthButtons';
import { useSubject } from '../../context/SubjectContext';
import { useProfile } from '../../context/ProfileContext';
import { hashEmail } from '../../utils/emailHash';

const { googleApi } = Constants.expoConfig.extra;

export default function FamLoginAuthScreen() {
  const { t } = useTranslation();
  const screenStyles = getScreenStyles();
  const backgroundColor = useThemeColor({}, 'background');
  const auth = useAuth();
  const { setSubject } = useSubject();
  const { profileRegistry } = useProfile();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ FamilyLoginAuth: { activationCode?: string; domain?: string; nextRoute?: string; nextParams?: Record<string, unknown> } }, 'FamilyLoginAuth'>>();
  const { activationCode, domain, nextRoute, nextParams } = route.params || {};

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: googleApi?.webClientId,
    iosClientId: googleApi?.iosClientId,
    androidClientId: googleApi?.androidClientId,
    extraParams: { prompt: 'select_account' },
  });

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        if (id_token) {
          await auth.handleSignIn(() => signInWithGoogle(id_token));
        } else {
          throw new Error('Google ID token was missing.');
        }
      } else if (response?.type === 'error' && !response.error?.message.includes('ERR_REQUEST_CANCELED')) {
        throw response.error;
      }
    };
    handleGoogleResponse().catch(err => Alert.alert(t('common.error'), err.message));
  }, [response]);

  useEffect(() => {
    const navigateToNextStep = async () => {
      if (auth.userCredential?.user) {
        const email = auth.userCredential.user.email;
        const idToken = await auth.userCredential.user.getIdToken();
        const subjectId = auth.userCredential.user.uid;

        if (!email || !idToken) {
          throw new Error('User email or ID token is missing after authentication.');
        }

        setSubject(subjectId, idToken);

        if (profileRegistry && !nextRoute) {
          const emailHash = await hashEmail(email);
          const profiles = await profileRegistry.list({
            where: [
              { attribute: 'emailHash', equals: emailHash },
              { attribute: 'appType', equals: 'family' },
            ],
          });
          if (profiles.length > 0) {
            navigation.navigate(Routes.Family.ProfileSelect.name, { email, idToken });
            return;
          }
        }

        const targetRoute = nextRoute || Routes.Family.ProfileSelect.name;
        navigation.navigate(targetRoute, {
          email,
          idToken,
          activationCode,
          domain,
          ...nextParams,
        });
      } else if (auth.error) {
        Alert.alert(t('common.error'), auth.error.message);
      }
    };

    navigateToNextStep().catch(err => Alert.alert(t('common.error'), err.message));
  }, [auth.userCredential, auth.error]);

  const handleGoogleSignIn = () => {
    if (request) {
      promptAsync();
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });
      if (appleCredential.identityToken) {
        await auth.handleSignIn(() => signInWithApple(appleCredential.identityToken));
      }
    } catch (e) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert(t('common.error'), e.message);
      }
    }
  };

  const authButtons = AuthButtons(t, handleGoogleSignIn, handleAppleSignIn);

  if (auth.isLoading) {
    return (
      <View style={[screenStyles.container, { backgroundColor, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[screenStyles.container, { backgroundColor, justifyContent: 'center' }]}>
      <ScreenHeader
        title={t('family.auth.title', 'Family login')}
        subtitle={t('family.auth.subtitle', 'Sign in to continue')}
      />
      <AccessibleButtonGrid data={authButtons} onPress={(item) => item.onPress()} />
    </View>
  );
}
