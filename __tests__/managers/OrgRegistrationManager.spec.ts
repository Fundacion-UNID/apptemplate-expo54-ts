// __tests__/managers/OrgRegistrationManager.spec.ts

// By mocking JobManager, we prevent Jest from trying to resolve its complex dependencies
// (like VaultRepository), which are irrelevant for testing our pure function.
jest.mock('../../managers/JobManager');

// We are only importing the PURE function we want to test.
import { _constructRegistrationClaims } from '../../managers/OrgRegistrationManager';
import { ClaimsOrganizationSchemaorg, ClaimsPersonSchemaorg, ClaimsServiceSchemaorg } from '../../constants/Schemas';

// The describe block remains the same
describe('OrgRegistrationManager', () => {

  // Test case for the "With Certificate" flow
  it('should correctly map form data for the "WithCert" flow', () => {
    // 1. Arrange: Simulate input data from the two forms
    const entityData = {
      legalName: 'Test Legal Name',
      commercialName: 'Test Commercial Name',
      shortName: 'test-short',
      domain: 'test.com',
      legalType: 'TAX',
      legalValue: '12345678X',
      jurisdiction: 'ES',
      region: 'M',
      city: 'Madrid',
      address1: '123 Test St',
      postalCode: '28001',
      sector: 'health-care',
      providerUrl: 'https://test-provider.com',
    };

    const repData = {
      email: 'rep@test.com',
      phone: '555-1234',
      role: 'CEO',
      termsFile: 'base64-string',
      signatureType: 0, // <-- "WithCert" flow
    };

    // 2. Act: Call the pure function
    const claims = _constructRegistrationClaims(entityData, repData);

    // 3. Assert: Check if the output matches the expected contract
    expect(claims[ClaimsOrganizationSchemaorg.legalName]).toBe('Test Legal Name');
    expect(claims[ClaimsOrganizationSchemaorg.alternateName]).toBe('test-short');
    expect(claims[ClaimsOrganizationSchemaorg.identifierValue]).toBe('12345678X');
    expect(claims[ClaimsServiceSchemaorg.category]).toBe('health-care');
    expect(claims[ClaimsPersonSchemaorg.email]).toBe('rep@test.com');
    
    // Ensure conditional fields are NOT present
    expect(claims[ClaimsPersonSchemaorg.givenName]).toBeUndefined();
    expect(claims[`${ClaimsPersonSchemaorg.identifier}.addressCountry`]).toBeUndefined();
  });

  // Test case for the "No Certificate" flow
  it('should correctly map form data for the "NoCert" flow, including conditional fields', () => {
    // 1. Arrange
    const entityData = {
      legalName: 'Test Legal Name',
      // ... other entity data
    };
    const repData = {
      email: 'rep@test.com',
      role: 'Manager',
      signatureType: 1, // <-- "NoCert" flow
      // Conditional fields
      officialName: 'John',
      lastName: 'Doe',
      secondLastName: 'Smith',
      jurisdiction: 'US',
    };

    // 2. Act
    const claims = _constructRegistrationClaims(entityData, repData);

    // 3. Assert
    expect(claims[ClaimsPersonSchemaorg.email]).toBe('rep@test.com');
    
    // Ensure conditional fields ARE present
    expect(claims[ClaimsPersonSchemaorg.givenName]).toBe('John');
    expect(claims[ClaimsPersonSchemaorg.familyName]).toBe('Doe');
    expect(claims[ClaimsPersonSchemaorg.additionalName]).toBe('Smith');
    expect(claims[`${ClaimsPersonSchemaorg.identifier}.addressCountry`]).toBe('US');
  });

});
