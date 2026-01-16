// constants/Providers.js

/**
 * Defines a list of authorized service providers for the application.
 * In the future, this list could be fetched from a remote configuration endpoint.
 */
export const ServiceProviders = [
  {
    id: 'gdc-test',
    name: 'API Demo (GDC Test)',
    url: 'https://globaldatacare-test-961105121121.europe-southwest1.run.app'
  }
  // Example of a future provider:
  // {
  //   id: 'prod-provider',
  //   name: 'Production Services',
  //   url: 'https://api.production.com'
  // }
];

export const FamilyProvidersByCountry = {
  ES: [
    { id: 'unid-foundation', nameKey: 'family.providers.unidFoundation', domain: 'unid.foundation' },
  ],
  MX: [
    { id: 'unid-foundation', nameKey: 'family.providers.unidFoundation', domain: 'unid.foundation' },
  ],
  US: [
    { id: 'unid-foundation', nameKey: 'family.providers.unidFoundation', domain: 'unid.foundation' },
  ],
  CA: [
    { id: 'unid-foundation', nameKey: 'family.providers.unidFoundation', domain: 'unid.foundation' },
  ],
  GB: [
    { id: 'unid-foundation', nameKey: 'family.providers.unidFoundation', domain: 'unid.foundation' },
  ],
} as const;
