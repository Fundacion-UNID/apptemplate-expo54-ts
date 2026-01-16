// utils/auth-providers.ts
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useAuthRequest, exchangeCodeAsync, makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import Constants from 'expo-constants';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { signInWithGoogle, signInWithApple } from './firebase-auth';

// --- Client ID Configuration ---
const { googleApi } = Constants.expoConfig.extra;
const WEB_CLIENT_ID = googleApi?.webClientId || '';
const IOS_CLIENT_ID = googleApi?.iosClientId || '';
const ANDROID_CLIENT_ID = googleApi?.androidClientId || '';

/**
 * A hook that provides a function to initiate the Google Sign-In flow.
 * It handles the Authorization Code Flow with PKCE and returns a function
 * that, when called, resolves with a Firebase UserCredential.
 * 
 * @returns A tuple: [The sign-in function, a boolean indicating if the request is ready]
 */
export const useGoogleSignIn = (): [() => Promise<FirebaseAuthTypes.UserCredential | null>, boolean] => {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: Platform.select({
        ios: IOS_CLIENT_ID,
        android: ANDROID_CLIENT_ID,
        web: WEB_CLIENT_ID,
      }),
      responseType: 'code',
      scopes: ['openid', 'profile', 'email'],
      redirectUri: makeRedirectUri(),
    },
    Google.discovery
  );

  const signIn = async (): Promise<FirebaseAuthTypes.UserCredential | null> => {
    if (!request) {
      throw new Error("Google sign-in request not initialized.");
    }
    
    // Prompt the user to sign in.
    const authResponse = await promptAsync();

    // If the user cancels, the response type will not be 'success'.
    if (authResponse.type !== 'success') {
      return null;
    }

    // Exchange the authorization code for an ID token.
    const tokenResponse = await exchangeCodeAsync(
      {
        code: authResponse.params.code,
        clientId: request.clientId,
        redirectUri: request.redirectUri,
        extraParams: { code_verifier: request.codeVerifier || "" },
      },
      Google.discovery
    );

    if (!tokenResponse.idToken) {
      throw new Error("Failed to exchange authorization code for ID token.");
    }

    // Use the ID token to sign in with Firebase and return the credential.
    return signInWithGoogle(tokenResponse.idToken);
  };

  return [signIn, !!request];
};


/**
 * A standalone function to initiate the Apple Sign-In flow.
 * It is not a hook because the underlying AppleAuthentication API is not a hook.
 * It resolves with a Firebase UserCredential.
 * 
 * @returns {Promise<FirebaseAuthTypes.UserCredential | null>}
 */
export const signInWithAppleProvider = async (): Promise<FirebaseAuthTypes.UserCredential | null> => {
  try {
    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (appleCredential.identityToken) {
      return signInWithApple(appleCredential.identityToken);
    }
    return null; // User cancelled
  } catch (e: any) {
    if (e.code === 'ERR_REQUEST_CANCELED') {
      return null;
    }
    throw e;
  }
};
