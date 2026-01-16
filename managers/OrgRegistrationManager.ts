// managers/OrgRegistrationManager.ts
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import * as Crypto from 'expo-crypto';
import { ClaimsPersonSchemaorg, Format, Resource, JobAction, ClaimsOrganizationSchemaorg, ClaimsServiceSchemaorg } from '../constants/Schemas';

// --- Type Definitions ---
export type RegistrationFormData = {
  [key: string]: any;
};

const FORM_TYPE = 'Organization-registration-form-v1.0';

/**
 * A pure helper function to remove empty values from the final claims object.
 * @param finalClaims The raw form data.
 * @returns A cleaned claims object.
 */
export function cleanRegistrationClaims(finalClaims: RegistrationFormData): { [key: string]: any } {
  const registrationClaims = { ...finalClaims };
  Object.keys(registrationClaims).forEach(key => 
    (registrationClaims[key] === undefined || registrationClaims[key] === null || registrationClaims[key] === '') && delete registrationClaims[key]
  );
  return registrationClaims;
}
