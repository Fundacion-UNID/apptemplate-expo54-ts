// __tests__/managers/OrgRegistrationManager.spec.ts

// npx jest --config jest.logic.config.ts __tests__/managers/OrgRegistrationManager.spec.ts

jest.mock('../../managers/JobManager');

import { _constructRegistrationClaims } from '../../managers/OrgRegistrationManager';
import { registrationSchemaPart1, registrationSchemaPart2 } from '../../forms/organization-registry-RJSF';

describe('OrgRegistrationManager._constructRegistrationClaims', () => {

  it('should produce a claims object that satisfies all REQUIRED fields for the "WithCert" flow', () => {
    // 1. Arrange
    const entityData = {
      legalName: 'Test Legal Name', commercialName: 'Test Commercial Name', shortName: 'test-short',
      domain: 'test.com', legalType: 'TAX', legalValue: '12345678X', jurisdiction: 'ES',
      region: 'M', city: 'Madrid', address1: '123 Test St', postalCode: '28001',
      sector: 'health-care', providerUrl: 'https://test-provider.com',
    };
    const repData = {
      email: 'rep@test.com', phone: '555-1234', role: 'CEO',
      termsFile: 'base64-string', signatureType: 0,
    };

    // 2. Act
    const claims = _constructRegistrationClaims(entityData, repData);
    const claimKeys = Object.keys(claims);

    // 3. Assert
    const requiredFields = [
      ...(registrationSchemaPart1.required || []),
      ...(registrationSchemaPart2.required || []),
    ];

    for (const field of requiredFields) {
      expect(claimKeys).toContain(field);
    }
    
    // @ts-ignore
    const conditionalProperties = registrationSchemaPart2.dependencies.signatureType.oneOf[1].properties;
    for (const field in conditionalProperties) {
      if (field !== 'signatureType') {
        expect(claimKeys).not.toContain(field);
      }
    }
  });

  it('should produce a claims object that satisfies all REQUIRED fields for the "NoCert" flow', () => {
    // 1. Arrange
    const entityData = {
      legalName: 'Test Legal Name', commercialName: 'Test Commercial Name', shortName: 'test-short',
      domain: 'test.com', legalType: 'TAX', legalValue: '12345678X', jurisdiction: 'ES',
      region: 'M', city: 'Madrid', address1: '123 Test St', postalCode: '28001',
      sector: 'health-care', provider: 'https://test-provider.com',
    };
    const repData = {
      email: 'rep@test.com', phone: '555-1234', role: 'CEO',
      termsFile: 'base64-string', signatureType: 1,
      officialName: 'Jane', familyName: 'Doe',
      jurisdiction: 'US',
    };

    // 2. Act
    const claims = _constructRegistrationClaims(entityData, repData);
    const claimKeys = Object.keys(claims);

    // 3. Assert
    const baseRequiredFields = [
      ...(registrationSchemaPart1.required || []),
      ...(registrationSchemaPart2.required || []),
    ];
    // --- FIX ---
    // @ts-ignore - We know this path exists for the test, but handle it safely.
    const conditionalRequiredFields = registrationSchemaPart2.dependencies?.signatureType?.oneOf?.[1]?.required || [];
    const allRequiredFields = [...baseRequiredFields, ...conditionalRequiredFields];

    for (const field of allRequiredFields) {
      expect(claimKeys).toContain(field);
    }
  });

});