// __tests__/data/identity.data.js

// Based on the backend's src/__tests__/data/identity.data.ts
// Contains test data fixtures for individuals/customers.

export const testCustomer1Data = {
  did: 'did:web:example.com:individual:zCustomer1',
  urn: 'urn:uuid:8e0d846a-2492-4b9c-8a4e-5e065fb6ba76',
  email: 'customer1@example.com',
  phone: '+34600123456',
  legalIdValue: '12345678X',
  legalIdType: 'NNES',
  givenName: "Joseph",
  familyName: "Doe",
};

export const testExamplesDidWeb = {
  individual: testCustomer1Data.did,
  customer: testCustomer1Data.did, // Alias for clarity in tests
};
