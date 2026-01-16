// types/expo-constants.d.ts

// This file provides complete type definitions for our custom configuration in app.config.ts.
// It augments the default types from Expo to make TypeScript aware of the modern `expoConfig`
// object and the custom properties nested within its `extra` field.

// We augment the existing module declaration for 'expo-constants'.
declare module 'expo-constants' {
  // We use `import type` to get the original type of the default export without importing the value.
  type OriginalConstants = typeof import('expo-constants').default;

  // Define the shape of our entire custom `extra` object.
  interface CustomExtraConfig {
    googleApi?: {
      androidClientId?: string;
      iosClientId?: string;
      webClientId?: string;
    };
    // Add other custom properties from app.config.ts here as needed.
  }

  // Define the shape of the `expoConfig` object, ensuring it includes our custom `extra`.
  interface ExpoConfig {
    extra: CustomExtraConfig;
    // This allows other standard expoConfig properties to exist without causing errors.
    [key: string]: any;
  }

  // Create a new Constants type that merges the original type with our additions.
  // This ensures we don't lose any of the existing properties from the library.
  type MergedConstants = OriginalConstants & {
    // The `expoConfig` property can be null, so we type it safely.
    expoConfig: ExpoConfig | null;
  };

  // Re-export the merged type as the default export for this module.
  const constants: MergedConstants;
  export default constants;
}
