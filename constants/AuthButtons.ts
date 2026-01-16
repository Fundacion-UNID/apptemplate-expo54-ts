// constants/AuthButtons.js
import { Platform } from 'react-native';

// REASON: This file centralizes the configuration for authentication buttons (Google, Apple, etc.).
// It follows the existing pattern of using data structures to define UI elements,
// promoting consistency and reusability, similar to LandingButtons.js.
// The AccessibleButtonGrid component will render these buttons.

export const AuthButtons = (t, handleGoogleSignIn, handleAppleSignIn) => {
  const buttons = [
    {
      id: 'google',
      iconName: 'google',
      iconType: 'font-awesome',
      label: t('organization.screens.auth.googleButton'),
      onPress: handleGoogleSignIn,
      testID: 'google-auth-button',
    },
  ];

  // Apple Sign-In is only available on iOS, iPadOS, and macOS.
  // It is also available on the web, but our current implementation uses expo-apple-authentication,
  // which does not support the web. We only show the button on compatible platforms.
  if (Platform.OS === 'ios') {
    buttons.push({
      id: 'apple',
      iconName: 'logo-apple',
      iconType: 'font-awesome',
      label: t('organization.screens.auth.appleButton'),
      onPress: handleAppleSignIn,
      testID: 'apple-auth-button',
    });
  }

  return buttons;
};
