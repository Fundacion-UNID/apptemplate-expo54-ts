// app.config.ts
import { ExpoConfig } from 'expo/config';

// This is the correct, modern way to handle environment variables in Expo.
// 1. The Expo CLI loads your .env file into process.env.
// 2. This config file reads from process.env and places the values into the `extra` object.
// 3. The application code reads the configuration from `Constants.expoConfig.extra`.
// This provides a robust, build-time configuration without conflicts.

const config: ExpoConfig = {
  name: "online.unid.app",
  slug: "online.unid.app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    
    // Pass the environment variables from process.env into the "extra" object.
    // The `EXPO_PUBLIC_` prefix is still required in the .env file for Expo to pick them up.
    OPERATION_MODE: process.env.EXPO_PUBLIC_OPERATION_MODE || 'DEMO',
    LEGACY_MODE: process.env.EXPO_PUBLIC_LEGACY_MODE === 'true', // Convert string to boolean
    firebaseConfig: {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
    },
    googleApi: {
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_API_ANDROID_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_API_IOS_CLIENT_ID,
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_API_WEB_CLIENT_ID
    }
  },
  plugins: [
    "expo-font",
    "expo-asset",
    "expo-sqlite",
    "expo-web-browser"
  ]
};

export default config;
