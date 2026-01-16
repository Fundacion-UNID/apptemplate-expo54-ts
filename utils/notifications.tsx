// utils/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Requests notification permissions and retrieves the Expo Push Token.
 * @returns {Promise<string | null>} The Expo push token or null if permission is denied or an error occurs.
 */
export async function getPushNotificationToken(): Promise<string | null> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.error('Permission to receive notifications was denied.');
    return null;
  }

  // Set a notification channel for Android (required)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Retrieve the token
  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      throw new Error('EAS project ID not found. Please ensure it is set in your app.config.ts extra section.');
    }
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log('Obtained Expo Push Token:', token);
    return token;
  } catch (error) {
    console.error('Failed to get push token:', error);
    return null;
  }
}
