// models/device-profile.ts

import { JwkSet } from 'gdc-common-utils-ts/models/jwk';

/**
 * Defines the structure for device information to be registered with the backend.
 */
export interface DeviceInfo {
  // The push token obtained from the notifications utility
  push_token: string;

  // The provider of the push token (e.g., Expo, FCM for native, APNS for native)
  push_provider: 'expo' | 'fcm' | 'apns';
  
  // A unique identifier for the physical device, e.g., from expo-device
  device_id: string;

  // A user-friendly name for the device (e.g., "Fernando's iPhone")
  device_name?: string;
}

/**
 * Defines the `body` of the DIDComm message specifically for profile registration.
 * This is the core data required by the backend to create a new user profile.
 */
export interface ProfileRegistrationData {
  // The public keys of the user's profile, for verifying future signatures
  profile_jwks: JwkSet;

  // The information of the device being registered
  device_info: DeviceInfo;
}
