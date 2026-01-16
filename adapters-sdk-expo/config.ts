// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: adapters-sdk-expo/config.ts

import Constants from 'expo-constants';
import { IApiConfig } from 'gdc-sdk-client-ts/src/interfaces/others';

/**
 * Implements the SDK's IApiConfig interface using expo-constants.
 * This adapter provides the SDK with API-related configuration values
 * sourced from the app's manifest (app.json/app.config.js).
 */
export class AdapterApiConfigSdkExpo implements IApiConfig {
  /**
   * The current operation mode for the API ('DEMO' or 'FAPI').
   * Defaults to 'DEMO' if not specified in the app configuration.
   */
  public readonly operationMode: 'DEMO' | 'FAPI';

  /**
   * Flag to determine if legacy FHIR endpoints should be used.
   * Defaults to `false` if not specified.
   */
  public readonly legacyFhirEnabled: boolean;

  constructor() {
    const extra = Constants.expoConfig?.extra ?? {};
    this.operationMode = extra.OPERATION_MODE === 'FAPI' ? 'FAPI' : 'DEMO';
    this.legacyFhirEnabled = extra.LEGACY_FHIR_ENABLED === true;

    console.log(`[ExpoApiConfigAdapter] Initialized with Mode: ${this.operationMode}, Legacy FHIR: ${this.legacyFhirEnabled}`);
  }
}
