// utils/firebase-config.ts
import { Platform } from 'react-native';
import rnFirebase from '@react-native-firebase/app';
import { initializeApp, getApps, FirebaseOptions } from 'firebase/app';
import Constants from 'expo-constants';

// --- Robust, Build-Time Configuration ---
const configFromConstants = Constants.expoConfig?.extra?.firebaseConfig;

// We initialize the correct Firebase SDK for each platform.
if (Platform.OS === 'web') {
  // --- WEB INITIALIZATION ---
  if (getApps().length === 0) {
    if (configFromConstants?.apiKey) {
      initializeApp(configFromConstants as FirebaseOptions);
      console.log("Firebase initialized for web using the JS SDK.");
    } else {
      console.error("Web Firebase config is missing from Constants.expoConfig.extra. Check app.config.ts");
    }
  }
} else {
  // --- NATIVE INITIALIZATION ---
  if (rnFirebase.apps.length === 0) {
    // The native SDK's `initializeApp` has a stricter type signature (`FirebaseAppOptions`)
    // than the web SDK's (`FirebaseOptions`). It does not allow `undefined` for most properties.
    //
    // To solve this, we perform a runtime validation and build a new, clean options object
    // that is guaranteed to satisfy the stricter native type.
    if (
      configFromConstants &&
      typeof configFromConstants.apiKey === 'string' &&
      typeof configFromConstants.appId === 'string' &&
      typeof configFromConstants.projectId === 'string' &&
      typeof configFromConstants.messagingSenderId === 'string'
    ) {
      const nativeFirebaseOptions = {
        apiKey: configFromConstants.apiKey,
        appId: configFromConstants.appId,
        projectId: configFromConstants.projectId,
        messagingSenderId: configFromConstants.messagingSenderId,
        storageBucket: configFromConstants.storageBucket,
        databaseURL: configFromConstants.databaseURL,
      };

      rnFirebase.initializeApp(nativeFirebaseOptions);
      console.log("Firebase initialized for native.");
    } else {
      console.error(
        "Native Firebase config is missing or incomplete in Constants.expoConfig.extra. " +
        "Could not initialize Firebase for native."
      );
    }
  }
}

// Export the native firebase wrapper by default. It won't be used on web.
export default rnFirebase;