// platformServices.ts
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

/**
 * @file This is the Platform Service Factory for the application.
 * It is the ONLY place where concrete service implementations are instantiated.
 * It returns the appropriate services based on the current environment, failing loudly
 * if a production environment is not explicitly configured.
 * @app
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { IWallet } from 'gdc-common-utils-ts/interfaces/IWallet';
import { IVaultRepository } from 'gdc-sdk-client-ts/src/interfaces/IVaultRepository';

// --- Concrete Implementations ---
import { DemoExpoWallet } from './managers/DemoExpoWallet';
import { ExpoWallet } from './managers/ExpoWallet';

// We DO NOT import VaultRepository here directly, as it requires platform-specific resolution.

/**
 * Creates and returns the appropriate IWallet instance based on the app's operation mode.
 * @returns An object conforming to the IWallet interface.
 */
function createWallet(): IWallet {
  // 1. Normalize the operation mode from config. Default to 'DEMO' if not set.
  const mode = (Constants.expoConfig?.extra?.OPERATION_MODE || 'DEMO').toUpperCase();

  // 2. If the intention is DEMO, always use the mock wallet.
  if (mode === 'DEMO') {
    console.log(`[PlatformServices] Using DemoExpoWallet for DEMO mode.`);
    return new DemoExpoWallet();
  }
  
  // 3. If the intention is STAGING or PRODUCTION, always use the real wallet,
  //    regardless of whether this is a DEV or PROD build. This allows a developer
  //    to test the production flow locally.
  if (mode === 'STAGING' || mode === 'PRODUCTION') {
    console.log(`[PlatformServices] Using REAL ExpoWallet for ${mode} mode (Build: ${__DEV__ ? 'Development' : 'Production'}).`);
    return new ExpoWallet();
  }

  // 4. Fail loudly if the configuration is invalid.
  throw new Error(`[PlatformServices] Invalid OPERATION_MODE: "${mode}". Must be DEMO, STAGING, or PRODUCTION.`);
}

/**
 * Creates and returns the appropriate IVaultRepository instance by dynamically
 * requiring the correct platform-specific implementation.
 * @returns An object conforming to the IVaultRepository interface.
 */
function createVault(profileId: string): IVaultRepository {
  let VaultRepository;

  // This is the platform-specific dynamic import pattern.
  if (Platform.OS === 'web') {
    VaultRepository = require('./database/VaultRepository.web').default;
  } else {
    VaultRepository = require('./database/VaultRepository.native').default;
  }

  // A new instance is created for a specific profile ID.
  return new VaultRepository(profileId);
}

// The wallet is stateless and can be a singleton.
export const appWallet = createWallet();

// The vault is stateful, so we export the factory function.
export const createVaultForProfile = createVault;
