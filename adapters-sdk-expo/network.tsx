// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: adapters-sdk-expo/network.ts

import NetInfo from '@react-native-community/netinfo';
import { INetwork } from 'gdc-sdk-client-ts/src/interfaces/others';

/**
 * Implements the SDK's INetwork interface using the @react-native-community/netinfo library.
 * This adapter allows the SDK to check for network connectivity in a React Native environment.
 */
export class AdapterNetworkSdkExpo implements INetwork {
  /**
   * Checks if the device is currently connected to the internet.
   * @returns A Promise that resolves to `true` if a connection is available, otherwise `false`.
   */
  async isConnected(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  }
}
