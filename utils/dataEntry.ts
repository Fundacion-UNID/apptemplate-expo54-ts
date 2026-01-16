// utils/dataEntry.js
import * as Crypto from 'expo-crypto';

/**
 * Converts a flat object of claims into a structured data entry resource object.
 *
 * @param {string} formType - The high-level type for the resource (e.g., 'Employee-registration-form-v1.0').
 * @param {object} claims - The claims object (e.g., { email: '...', jobTitle: '...' }).
 * @param {object} [options={}] - Optional parameters for schema types.
 * @param {string} [options.context] - The JSON-LD context (e.g., 'org.schema').
 * @param {string} [options.schemaType] - The specific schema type (e.g., 'Person').
 * @returns {object} A structured data entry object.
 */
type DataEntryOptions = {
  context?: string;
  schemaType?: string;
};

export const claimsToDataEntry = (formType: string, claims: Record<string, unknown>, options: DataEntryOptions = {}) => {
  if (!formType) throw new Error('formType must be provided.');
  if (!claims) throw new Error('claims must be provided.');

  const resourceId = `urn:uuid:${Crypto.randomUUID()}`;
  const { context, schemaType } = options;

  const claimsPayload = { ...claims };

  if (context) claimsPayload['@context'] = context;
  if (schemaType) claimsPayload['@type'] = schemaType;

  return {
    type: formType,
    id: resourceId,
    meta: {
      claims: claimsPayload
    }
  };
};
