// __tests__/managers/OrgRegistrationManager.spec.ts

// npx jest --config jest.logic.config.ts __tests__/managers/OrgRegistrationManager.spec.ts

import { cleanRegistrationClaims } from '../../managers/OrgRegistrationManager';

describe('OrgRegistrationManager.cleanRegistrationClaims', () => {

  it('should not mutate the input object', () => {
    const original = {
      legalName: 'Test Legal Name',
      emptyField: '',
    };

    const claims = cleanRegistrationClaims(original);

    expect(claims.legalName).toBe('Test Legal Name');
    expect(claims.emptyField).toBeUndefined();
    expect(original.emptyField).toBe('');
  });

});
