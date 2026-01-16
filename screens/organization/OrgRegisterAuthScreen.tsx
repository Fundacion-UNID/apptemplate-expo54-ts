// screens/organization/OrgRegisterAuthScreen.tsx

import React, { useEffect } from 'react';
import { View, Platform, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, CommonActions } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import Constants from 'expo-constants';

import { signInWithGoogle, signInWithApple } from '../../utils/firebase-auth';
import ScreenHeader from '../../components/ScreenHeader';
import AccessibleButtonGrid from '../../components/AccessibleButtonGrid';
import { useThemeColor } from '../../hooks/useThemeColor';
import { getScreenStyles } from '../../constants/Styles';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useAuth } from '../../hooks/useAuth'; // Import the useAuth hook
import { Routes } from '../../constants/Routes'; // Import Routes
import { useSubject } from '../../context/SubjectContext';
import { useOrgRegistryForm, OrgRegistryFormProvider } from '../../context/OrgRegistryFormContext';

// This is necessary for the redirect flow to work correctly on web after authentication.
WebBrowser.maybeCompleteAuthSession();

// --- Client ID Configuration ---
// Read the configuration from Constants.expoConfig.extra, which was populated by app.config.ts.
// This is the most reliable method.
const { googleApi } = Constants.expoConfig.extra;
const WEB_CLIENT_ID = googleApi?.webClientId;
const IOS_CLIENT_ID = googleApi?.iosClientId;
const ANDROID_CLIENT_ID = googleApi?.androidClientId;

// --- Configuration Validation ---
// We crash loudly during development if the environment is not configured correctly.
if (!WEB_CLIENT_ID || WEB_CLIENT_ID.includes('YOUR_WEB_CLIENT_ID')) {
  throw new Error(
    'Google Sign-In is not configured for the web. ' +
    'Please check your .env file and ensure the Expo server was restarted.'
  );
}

// This screen is for new user registration. It authenticates the user, stores their
// idToken in a shared form context, and then navigates to the multi-step registration form.
function OrgRegisterAuthScreenContent() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { scaleFactor } = useAccessibilityContext();
  const screenStyles = getScreenStyles(scaleFactor);
  const backgroundColor = useThemeColor({}, 'background');
  const auth = useAuth();
  const { setSubject } = useSubject(); // Import the new Subject context hook

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    extraParams: { prompt: 'select_account' },
  });

  // --- (useEffect for redirect URI logging remains the same) ---
  useEffect(() => {
    if (request) {
      console.log("--- AUTHORIZED REDIRECT URI ---");
      console.log("Ensure this URI is listed in your Google Cloud Console for the Web Client ID:");
      console.log(request.redirectUri);
      console.log("-------------------------------");
    }
  }, [request]);

  // --- (useEffect for Google Sign-In response remains the same) ---
  useEffect(() => {
    const handleGoogleSignIn = async () => {
      console.log("[DEBUG] Google response received:", response);
      if (response?.type === 'success') {
        const { id_token } = response.params;
        if (id_token) {
          await auth.handleSignIn(() => signInWithGoogle(id_token));
        } else {
          throw new Error("Google ID token was missing in the response.");
        }
      } else if (response?.type === 'error') {
        if (response.error?.message.includes('ERR_REQUEST_CANCELED')) {
          return;
        }
        console.error('Google Sign-In response error:', response.error);
        navigation.dispatch(CommonActions.navigate({ 
          name: 'ErrorScreen', 
          params: { errorMessage: response.error?.message || t('common.unknownError'), retryRoute: 'OrgRegisterAuth' } 
        }));
      }
    };
    
    handleGoogleSignIn().catch(error => {
      console.error("Error during Google sign-in handling:", error);
      navigation.dispatch(CommonActions.navigate({ 
        name: 'ErrorScreen', 
        params: { errorMessage: error.message || t('common.unknownError'), retryRoute: 'OrgRegisterAuth' } 
      }));
    });
  }, [response, navigation, t]);

  // --- (handleAppleSignIn function remains the same) ---
  const handleAppleSignIn = async () => {
    if (Platform.OS === 'web') {
      console.log('Sign in with Apple for web is not yet implemented.');
      navigation.dispatch(CommonActions.navigate({ 
        name: 'ErrorScreen', 
        params: { 
          errorMessage: t('common.notImplemented.appleWebMessage'), 
          retryRoute: 'OrgRegisterAuth' 
        } 
      }));
      return;
    }
    const signInFunc = async () => {
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (appleCredential.identityToken) {
        return signInWithApple(appleCredential.identityToken);
      }
      return null;
    };
    await auth.handleSignIn(signInFunc);
  };
  
  // --- REFACTORED: Simplified Post-Authentication Logic ---
  useEffect(() => {
    const processAuth = async () => {
      if (auth.userCredential?.user) {
        const idToken = await auth.userCredential.user.getIdToken();
        const subjectId = auth.userCredential.user.uid;
        if (!idToken) {
          throw new Error("Could not retrieve idToken after authentication.");
        }
        
        console.log("Authentication successful. Setting Subject Context and navigating to form.");
        
        // ARCHITECTURE: Set the global Subject Context. This is the new source of truth for the token.
        setSubject(subjectId, idToken);
        
        // The screen's job is done. Navigate to the start of the registration form.
        navigation.navigate(Routes.Organization.NewRepresentative.name);
        
      } else if (auth.error) {
        navigation.dispatch(CommonActions.navigate({
          name: 'ErrorScreen',
          params: { errorMessage: auth.error.message, retryRoute: 'OrgRegisterAuth' }
        }));
      }
    };
    processAuth().catch(err => navigation.dispatch(CommonActions.navigate({
      name: 'ErrorScreen',
      params: { errorMessage: err.message || t('common.unknownError'), retryRoute: 'OrgRegisterAuth' }
    })));
  }, [auth.userCredential, auth.error, setSubject, navigation, t]);


  if (auth.isLoading) {
    return (
      <View style={[screenStyles.container, { backgroundColor, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[screenStyles.container, { backgroundColor }]}>
      <ScreenHeader
              title={t('organization.screens.auth.title')}
              subtitle={t('organization.screens.auth.subtitle')}
              description={undefined} 
     />
      <View style={localStyles.buttonContainer}>
        <AccessibleButtonGrid
          data={[
            {
              id: 'org-register-google',
              label: t('organization.screens.auth.googleButton'),
              iconName: 'google',
              iconType: 'fontawesome',
              onPress: () => promptAsync(),
              disabled: !request || auth.isLoading,
            },
            ...(Platform.OS === 'ios'
              ? [
                  {
                    id: 'org-register-apple',
                    label: t('organization.screens.auth.appleButton'),
                    iconName: 'apple',
                    iconType: 'fontawesome',
                    onPress: handleAppleSignIn,
                    disabled: auth.isLoading,
                  },
                ]
              : []),
          ]}
          onPress={(item) => item.onPress?.()}
        />
      </View>
    </View>
  );
}

// The main export now wraps the content in the provider, making the context available.
export default function OrgRegisterAuthScreen() {
  return (
    <OrgRegistryFormProvider>
      <OrgRegisterAuthScreenContent />
    </OrgRegistryFormProvider>
  );
}

const localStyles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
