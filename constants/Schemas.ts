// constants/Schemas.ts
// Based on the backend's src/models/schemaorg.ts

/**
 * Defines canonical claim names for Organization-related claims.
 * Based on Schema.org vocabulary and registration form requirements.
 * Using `as const` creates a readonly object with literal types, preventing typos.
 */
export const ClaimsOrganizationSchemaorg = {
  /** ISO 3166-1 alpha-2 (two-letter country code). */
  addressCountry: "org.schema.Organization.address.addressCountry",
  /** ISO 3166-2 code for administrative divisions (state, province). */
  addressRegion: "org.schema.Organization.address.addressRegion",
  addressLocality: "org.schema.Organization.address.addressLocality",
  postalCode: "org.schema.Organization.address.postalCode",
  streetAddress: "org.schema.Organization.address.streetAddress",
  /** `TAX` or `EN` (Employer Number): @see http://terminology.hl7.org/CodeSystem/v2-0203 */
  identifierType: "org.schema.Organization.identifier.additionalType",
  identifierValue: "org.schema.Organization.identifier.value",
  legalName: "org.schema.Organization.legalName",
  /** Commercial name */
  name: "org.schema.Organization.name",
  /** short url-friendly name (0-9,a-z) */
  alternateName: "org.schema.Organization.alternateName",
  /** External URL for the organization's primary website */
  url: "org.schema.Organization.url",
  /** The identifier is a URN generated using the legal ID (TAX or EI) */
  identifier: "org.schema.Organization.identifier",
} as const;

/**
 * Defines canonical claim names based on Schema.org vocabulary
 * for Service-related claims.
 */
export const ClaimsServiceSchemaorg = {
  category: "org.schema.Service.category",
  termsOfService: "org.schema.Service.termsOfService",
  serviceType: "org.schema.Service.serviceType",
  url: "org.schema.Service.url",
} as const;

/**
 * Defines canonical claim names based on Schema.org vocabulary
 * for Person-related claims.
 */
export const ClaimsPersonSchemaorg = {
  /** ISO 3166-1 alpha-2 (two-letter country code) for the legal identifier */
  addressCountry: "org.schema.Organization.address.addressCountry",
  /** ISO 3166-2 code for regional legal identifiers (state, province). */
  addressRegion: "org.schema.Organization.address.addressRegion",
  additionalName: "org.schema.Person.additionalName",
  alternateName: "org.schema.Person.alternateName",
  birthDate: "org.schema.Person.birthDate",
  email: "org.schema.Person.email",
  familyName: "org.schema.Person.familyName",
  gender: "org.schema.Person.gender",
  givenName: "org.schema.Person.givenName",
  identifier: "org.schema.Person.identifier", // This is the URN/UUID anchor
  identifierType: "org.schema.Person.identifier.additionalType",
  identifierValue: "org.schema.Person.identifier.value",
  name: "org.schema.Person.name",
  memberOf: "org.schema.Person.memberOf",
  hasOccupation: "org.schema.Person.hasOccupation",
  telephone: "org.schema.Person.telephone",
} as const;

/**
 * Combines all claims required for the organization registration form
 * into a single schema object for consistency and maintainability.
 */
export const OrganizationRegistration = {
  // Service Claims
  serviceCategory: ClaimsServiceSchemaorg.category,
  serviceTerms: ClaimsServiceSchemaorg.termsOfService,
  serviceUrl: "org.schema.Service.url", // Custom addition for service endpoint

  // Organization Claims
  orgUrl: ClaimsOrganizationSchemaorg.url,
  orgLegalName: ClaimsOrganizationSchemaorg.legalName,
  orgIdType: ClaimsOrganizationSchemaorg.identifierType,
  orgIdValue: ClaimsOrganizationSchemaorg.identifierValue,
  orgAlternateName: ClaimsOrganizationSchemaorg.alternateName,
  orgCountry: ClaimsOrganizationSchemaorg.addressCountry,
  orgRegion: ClaimsOrganizationSchemaorg.addressRegion,
  orgStreet: ClaimsOrganizationSchemaorg.streetAddress,
  orgCity: ClaimsOrganizationSchemaorg.addressLocality,
  orgPostalCode: ClaimsOrganizationSchemaorg.postalCode,

  // Representative Claims
  repId: ClaimsPersonSchemaorg.identifier,
  repEmail: ClaimsPersonSchemaorg.email,
  repRole: ClaimsPersonSchemaorg.hasOccupation,
} as const;

/**
 * Defines the types of form requests that can be sent in a batch.
 */
export const FormRequestType = {
  IndividualTerms: 'IndividualTerms',
  PersonalIdentity: 'PersonalIdentity',
} as const;

// --- Enums for URL construction and validation ---

export const Sector = {
  EMERGENCY: 'emergency',
  HEALTH_CARE: 'health-care',
  HEALTH_INSURANCE: 'health-insurance',
  HEALTH_TECH: 'health-tech',
  HEALTH_IT: 'health-it',
  RESEARCH: 'research',
} as const;
export type Sector = typeof Sector[keyof typeof Sector];

export const Section = {
  REGISTRY: 'registry',
  ENTITY: 'entity',
  INDIVIDUAL: 'individual',
  NETWORK: 'network',
} as const;
export type Section = typeof Section[keyof typeof Section];

export const Format = {
  SCHEMA: 'org.schema',
  FHIR_API: 'org.hl7.fhir.api',
} as const;
export type Format = typeof Format[keyof typeof Format];

export const Resource = {
  PERSON: 'Person',
  RELATED_PERSON: 'RelatedPerson',
  EMPLOYEE: 'Employee',
  EMPLOYEE_ROLE: 'EmployeeRole',
  PRACTITIONER: 'Practitioner',
  PRACTITIONER_ROLE: 'PractitionerRole',
  ORGANIZATION: 'Organization',
  LOCATION: 'Location',
  GROUP: 'Group',
} as const;
export type Resource = typeof Resource[keyof typeof Resource];

export const JobAction = {
  BATCH: '_batch',
  CREATE: '_create',
  DISCOVERY: '_discovery',
} as const;
export type JobAction = typeof JobAction[keyof typeof JobAction];

export const knownDomainsReversed = [
  'org.schema',
  'org.hl7.fhir',
  'org.ilo.isco',
  'net.openid',
] as const;
