// __tests__/managers/OrgRegistrationManager.spec.ts

// We are only importing the pure helper we want to test.
import { cleanRegistrationClaims } from '../../managers/OrgRegistrationManager';

// The describe block remains the same
describe('OrgRegistrationManager', () => {

  it('should remove empty values from the registration claims', () => {
    const rawClaims = {
      legalName: 'Test Legal Name',
      emptyString: '',
      emptyNull: null,
      emptyUndefined: undefined,
      keepFalse: false,
      keepZero: 0,
    };

    const claims = cleanRegistrationClaims(rawClaims);

    expect(claims.legalName).toBe('Test Legal Name');
    expect(claims.keepFalse).toBe(false);
    expect(claims.keepZero).toBe(0);
    expect(claims.emptyString).toBeUndefined();
    expect(claims.emptyNull).toBeUndefined();
    expect(claims.emptyUndefined).toBeUndefined();
  });

});
