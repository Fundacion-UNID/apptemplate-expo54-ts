// app.config.ts
import { ExpoConfig } from 'expo/config';

// This is the correct, modern way to handle environment variables in Expo.
// 1. The Expo CLI loads your .env file into process.env.
// 2. This config file reads from process.env and places the values into the `extra` object.
// 3. The application code reads the configuration from `Constants.expoConfig.extra`.
// This provides a robust, build-time configuration without conflicts.

const parseCsv = (value: string | undefined): string[] =>
  (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeSector = (value: string): string => value.trim().toLowerCase();
const sectorToEnvSuffix = (sector: string): string =>
  normalizeSector(sector).replace(/-/g, '_').toUpperCase();

const allowedSectors = parseCsv(process.env.EXPO_PUBLIC_ALLOWED_SECTOR_LIST).map(normalizeSector);

const professionalOperatorListBySector = allowedSectors.reduce<Record<string, string>>((acc, sector) => {
  acc[sector] =
    process.env[`EXPO_PUBLIC_PROFESSIONAL_OPERATOR_LIST_${sectorToEnvSuffix(sector)}`] || '';
  return acc;
}, {});

const familyProviderListBySector = allowedSectors.reduce<Record<string, string>>((acc, sector) => {
  acc[sector] =
    process.env[`EXPO_PUBLIC_FAMILY_PROVIDER_LIST_${sectorToEnvSuffix(sector)}`] || '';
  return acc;
}, {});

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
    ICA_DID_LIST: process.env.EXPO_PUBLIC_ICA_DID_LIST || process.env.EXPO_PUBLIC_ICA_DID || '',
    ALLOWED_SECTOR_LIST: process.env.EXPO_PUBLIC_ALLOWED_SECTOR_LIST || '',
    PROFESSIONAL_OPERATOR_LIST_BY_SECTOR: professionalOperatorListBySector,
    FAMILY_PROVIDER_LIST_BY_SECTOR: familyProviderListBySector,
    SUBMIT_RETRY_COUNT: process.env.EXPO_PUBLIC_SUBMIT_RETRY_COUNT || '2',
    SUBMIT_RETRY_DELAY_MS: process.env.EXPO_PUBLIC_SUBMIT_RETRY_DELAY_MS || '1500',
    REGISTRY_REFRESH_INTERVAL_MS: process.env.EXPO_PUBLIC_REGISTRY_REFRESH_INTERVAL_MS || '2500',
    RETRY_REGISTER_FAMILY_ORG_COUNT: process.env.EXPO_PUBLIC_RETRY_REGISTER_FAMILY_ORG_COUNT || '',
    RETRY_REGISTER_FAMILY_ORG_DELAY_MS: process.env.EXPO_PUBLIC_RETRY_REGISTER_FAMILY_ORG_DELAY_MS || '',
    RETRY_REGISTER_ORG_COUNT: process.env.EXPO_PUBLIC_RETRY_REGISTER_ORG_COUNT || '',
    RETRY_REGISTER_ORG_DELAY_MS: process.env.EXPO_PUBLIC_RETRY_REGISTER_ORG_DELAY_MS || '',
    FAMILY_ROLE_CODING_SYSTEM: process.env.EXPO_PUBLIC_FAMILY_ROLE_CODING_SYSTEM || 'org.hl7.v3.RoleCode',
    ORG_ROLE_CODING_SYSTEM: process.env.EXPO_PUBLIC_ORG_ROLE_CODING_SYSTEM || 'org.ilo.isco-08',
    FAMILY_ROLE_SEND_SYSTEM: process.env.EXPO_PUBLIC_FAMILY_ROLE_SEND_SYSTEM || 'true',
    ORG_ROLE_SEND_SYSTEM: process.env.EXPO_PUBLIC_ORG_ROLE_SEND_SYSTEM || 'true',
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
    "expo-localization",
    "expo-sqlite",
    "expo-web-browser"
  ]
};

export default config;
