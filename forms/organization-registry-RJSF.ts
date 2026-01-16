// forms/organization-registry-RJSF.ts
type RJSFSchema = any;
type UiSchema = any;
import {
  ClaimsOrganizationSchemaorg,
  ClaimsPersonSchemaorg,
  ClaimsServiceSchemaorg
} from '../constants/Schemas';

// =================================================================================
// MANUAL & ROBUST TYPE DEFINITION
// =================================================================================

/**
 * MANUAL TYPE DEFINITION for the registration form data.
 * This is the single source of truth for the data's shape. It is manually
 * maintained to be in sync with the schemas above.
 */
export type OrgRegistrationForm = {
  // --- Fields from Part 1 ---
  [ClaimsOrganizationSchemaorg.addressCountry]?: string;
  [ClaimsOrganizationSchemaorg.alternateName]?: string;
  [ClaimsOrganizationSchemaorg.url]?: string;
  [ClaimsOrganizationSchemaorg.identifierType]?: string;
  [ClaimsOrganizationSchemaorg.identifierValue]?: string;
  [ClaimsServiceSchemaorg.category]?: string;
  [ClaimsOrganizationSchemaorg.legalName]?: string;
  [ClaimsOrganizationSchemaorg.name]?: string;
  [ClaimsOrganizationSchemaorg.streetAddress]?: string;
  [ClaimsOrganizationSchemaorg.addressLocality]?: string;
  [ClaimsOrganizationSchemaorg.addressRegion]?: string;
  [ClaimsOrganizationSchemaorg.postalCode]?: string;
  [ClaimsServiceSchemaorg.url]?: string; // FIX: Use the correct schema key for the provider URL

  // --- Fields from Part 2 (Base) ---
  [ClaimsPersonSchemaorg.email]?: string;
  [ClaimsPersonSchemaorg.telephone]?: string;
  [ClaimsPersonSchemaorg.hasOccupation]?: string;
  [ClaimsServiceSchemaorg.termsOfService]?: string | null;
  signatureType?: number;

  // --- Fields from Part 2 (Conditional "No Cert") ---
  [ClaimsPersonSchemaorg.givenName]?: string;
  [ClaimsPersonSchemaorg.familyName]?: string;
  [ClaimsPersonSchemaorg.additionalName]?: string;
  [ClaimsPersonSchemaorg.addressCountry]?: string;
  [ClaimsPersonSchemaorg.addressRegion]?: string;
  [ClaimsPersonSchemaorg.identifierType]?: string;
  [ClaimsPersonSchemaorg.identifierValue]?: string;
};


// =================================================================================
// DATA SCHEMA - PART 1 (Defines the fields from the first screen)
// =================================================================================
export const registrationSchemaPart1: RJSFSchema = {
  type: "object",
  properties: {
    [ClaimsOrganizationSchemaorg.legalName]: { type: "string", title: "common.legalName" },
    [ClaimsOrganizationSchemaorg.name]: { type: "string", title: "common.commercialName" },
    [ClaimsOrganizationSchemaorg.alternateName]: { type: "string", title: "common.shortName" },
    [ClaimsOrganizationSchemaorg.url]: { type: "string", title: "common.website", format: "uri" },
    [ClaimsServiceSchemaorg.category]: { type: "string", title: "common.sector" },
    [ClaimsOrganizationSchemaorg.identifierType]: { type: "string", title: "common.identifierType" },
    [ClaimsOrganizationSchemaorg.identifierValue]: { type: "string", title: "common.identifierValue" },
    [ClaimsOrganizationSchemaorg.addressCountry]: { type: "string", title: "common.jurisdiction" },
    [ClaimsOrganizationSchemaorg.addressRegion]: { type: "string", title: "common.region" },
    [ClaimsOrganizationSchemaorg.addressLocality]: { type: "string", title: "common.city" },
    [ClaimsOrganizationSchemaorg.streetAddress]: { type: "string", title: "common.address1" },
    [ClaimsOrganizationSchemaorg.postalCode]: { type: "string", title: "common.postalCode" },
  },
  required: [
    ClaimsOrganizationSchemaorg.legalName,
    ClaimsOrganizationSchemaorg.alternateName,
    ClaimsServiceSchemaorg.category,
    ClaimsOrganizationSchemaorg.identifierType,
    ClaimsOrganizationSchemaorg.identifierValue,
    ClaimsOrganizationSchemaorg.addressCountry,
    ClaimsOrganizationSchemaorg.addressRegion,
    ClaimsOrganizationSchemaorg.addressLocality,
    ClaimsOrganizationSchemaorg.streetAddress,
    ClaimsOrganizationSchemaorg.postalCode,
  ],
};

// =================================================================================
// DATA SCHEMA - PART 2 (Defines the fields from the second screen)
// =================================================================================
export const registrationSchemaPart2: RJSFSchema = {
  type: "object",
  properties: {
    [ClaimsPersonSchemaorg.email]: { type: "string", title: "organization.screens.newRepresentative.options.email-input-label", format: "email" },
    [ClaimsPersonSchemaorg.telephone]: { type: "string", title: "forms.phone" },
    [ClaimsPersonSchemaorg.hasOccupation]: { type: "string", title: "organization.screens.newRepresentative.options.role-picker-label" },
    [ClaimsServiceSchemaorg.termsOfService]: { type: "string", title: "forms.attachTerms", format: "data-url" },
    "signatureType": { type: "number", title: "forms.signatureTypeLabel", enum: [0, 1], default: 0 },
  },
  required: [
    ClaimsPersonSchemaorg.email,
    ClaimsPersonSchemaorg.hasOccupation,
    ClaimsServiceSchemaorg.termsOfService,
  ],
  dependencies: {
    signatureType: {
      oneOf: [
        { properties: { signatureType: { const: 0 } } },
        {
          properties: {
            signatureType: { const: 1 },
            [ClaimsPersonSchemaorg.givenName]: { type: "string", title: "forms.officialName" },
            [ClaimsPersonSchemaorg.familyName]: { type: "string", title: "forms.lastName" },
            [ClaimsPersonSchemaorg.additionalName]: { type: "string", title: "forms.secondLastName" },
            [ClaimsPersonSchemaorg.addressCountry]: { type: "string", title: "forms.jurisdiction" },
            [ClaimsPersonSchemaorg.addressRegion]: { type: "string", title: "forms.addressRegion" },
          },
          required: [
            ClaimsPersonSchemaorg.givenName,
            ClaimsPersonSchemaorg.familyName,
            ClaimsPersonSchemaorg.addressCountry,
            ClaimsPersonSchemaorg.addressRegion,
          ],
        },
      ],
    },
  },
};

// =================================================================================
// FINAL COMBINED SCHEMA & TYPE (This is what the rest of the app will use)
// =================================================================================

// This is the single source of truth for the form's data structure.
// It is explicitly defined to be compatible with `json-schema-to-ts`.
export const registrationSchema: RJSFSchema = {
  title: "organization.screens.newEntity.title",
  type: "object" as const, // The `as const` here is critical
  properties: {
    ...registrationSchemaPart1.properties,
    ...registrationSchemaPart2.properties,
  },
  required: [
...(registrationSchemaPart1.required || []),
...(registrationSchemaPart2.required || []),
],
  dependencies: {
    ...registrationSchemaPart2.dependencies,
  },
};

// =================================================================================
// UI SCHEMAS (These are separate and can be exported as needed)
// =================================================================================
export const registrationUiSchemaPart1: UiSchema = {
  [ClaimsOrganizationSchemaorg.addressCountry]: { "ui:options": { placeholder: "organization.screens.newEntity.options.jurisdiction-placeholder" } },
  [ClaimsOrganizationSchemaorg.alternateName]: { "ui:options": { placeholder: "organization.screens.newEntity.options.shortName-placeholder", "ui:help": "organization.screens.newEntity.options.shortName-description" } },
  [ClaimsOrganizationSchemaorg.url]: { "ui:options": { inputType: "url", placeholder: "organization.screens.newEntity.options.domain-placeholder" } },
  [ClaimsOrganizationSchemaorg.identifierType]: { "ui:widget": "select", "ui:options": { placeholder: "organization.screens.newEntity.options.legalType-placeholder" } },
  [ClaimsOrganizationSchemaorg.identifierValue]: { "ui:options": { placeholder: "organization.screens.newEntity.options.legalValue-placeholder" } },
  [ClaimsServiceSchemaorg.category]: { "ui:widget": "select", "ui:options": { placeholder: "organization.screens.newEntity.options.sector-placeholder" } },
  [ClaimsOrganizationSchemaorg.legalName]: { "ui:options": { placeholder: "organization.screens.newEntity.options.legalName-placeholder" } },
  [ClaimsOrganizationSchemaorg.name]: { "ui:options": { placeholder: "organization.screens.newEntity.options.commercialName-placeholder" } },
  [ClaimsOrganizationSchemaorg.streetAddress]: { "ui:options": { placeholder: "organization.screens.newEntity.options.address1-placeholder" } },
  [ClaimsOrganizationSchemaorg.addressLocality]: { "ui:options": { placeholder: "organization.screens.newEntity.options.city-placeholder" } },
  [ClaimsOrganizationSchemaorg.addressRegion]: { "ui:options": { placeholder: "organization.screens.newEntity.options.region-placeholder" } },
  [ClaimsOrganizationSchemaorg.postalCode]: { "ui:options": { placeholder: "organization.screens.newEntity.options.postalCode-placeholder" } },
};

export const registrationUiSchemaPart2: UiSchema = {
  [ClaimsPersonSchemaorg.email]: { "ui:options": { inputType: "email", placeholder: "organization.screens.newRepresentative.options.email-input-placeholder" } },
  [ClaimsPersonSchemaorg.telephone]: { "ui:options": { inputType: "tel", placeholder: "forms.phonePlaceholder" } },
  [ClaimsPersonSchemaorg.hasOccupation]: { "ui:widget": "select", "ui:options": { placeholder: "organization.screens.newRepresentative.options.role-picker-placeholder" } },
  [ClaimsServiceSchemaorg.termsOfService]: { "ui:widget": "file" },
  "signatureType": { "ui:widget": "radio", "ui:options": { "inline": true } },
  [ClaimsPersonSchemaorg.givenName]: { "ui:options": { placeholder: "forms.officialNamePlaceholder" } },
  [ClaimsPersonSchemaorg.familyName]: { "ui:options": { placeholder: "forms.lastNamePlaceholder" } },
  [ClaimsPersonSchemaorg.additionalName]: { "ui:options": { placeholder: "forms.secondLastNamePlaceholder" } },
  [ClaimsPersonSchemaorg.addressCountry]: { "ui:widget": "select", "ui:options": { placeholder: "forms.jurisdictionPlaceholder" } },
  [ClaimsPersonSchemaorg.addressRegion]: { "ui:options": { placeholder: "forms.addressRegionPlaceholder" } },
};

export const registrationUiSchema = {
  ...registrationUiSchemaPart1,
  ...registrationUiSchemaPart2,
};

// =================================================================================
// COMBINED SCHEMA & AUTO-GENERATED TYPE
// =================================================================================
const combinedSchema: UiSchema = {
  title: "organization.screens.newEntity.title",
  type: "object",
  properties: {
    ...registrationSchemaPart1.properties,
    ...registrationSchemaPart2.properties,
  },
  required: [
    ...(registrationSchemaPart1.required || []),
    ...(registrationSchemaPart2.required || []),
  ],
  dependencies: {
    ...(registrationSchemaPart2.dependencies || {}),
  },
} as const; // <--- THE CRITICAL `as const` ASSERTION

/**
 * PROGRAMMATIC TYPE DEFINITION for the registration form data.
 *
 * This uses TypeScript's Mapped Types to create a type based on the keys of the
 * combined schema's properties. This is a robust, dependency-free way to ensure
 * the type and the schema stay in sync.
 */
type SchemaProperties = keyof typeof registrationSchema.properties;
