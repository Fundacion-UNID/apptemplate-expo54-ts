// __tests__/ModuleImport.spec.js

// We try both import syntaxes to see what Jest resolves
import * as VaultRepositoryModule from '../database/VaultRepository';
import VaultRepositoryDefault from '../database/VaultRepository';

describe('Module Import Diagnostic Test', () => {
  it('should resolve the VaultRepository constructor consistently', () => {
    expect(typeof VaultRepositoryModule.default).toBe('function');
    expect(typeof VaultRepositoryDefault).toBe('function');
  });
});
