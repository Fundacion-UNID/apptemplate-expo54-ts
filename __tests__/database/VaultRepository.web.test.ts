// __tests__/database/VaultRepository.web.test.js

// --- CURRENT STATUS: FAILING ---
// This test suite is currently failing. The tests for queries on 'indexed'
// attributes (e.g., by email, by birthDate) are returning 0 results.
//
// The root cause is that the query logic in `VaultRepository.web.js` is not
// correctly finding matches within the `indexed` array of the stored documents,
// even though the data is present.
//
// The code has been instrumented with `console.log` statements to facilitate
// debugging by the next developer.
import VaultRepository from '../../database/VaultRepository.web';
import { ClaimsPersonSchemaorg } from '../../constants/Schemas';

// Mock the tinybase persister to prevent it from writing to actual browser local storage.
jest.mock('tinybase/persisters/persister-browser', () => ({
  createLocalPersister: jest.fn(() => ({
    load: jest.fn().mockResolvedValue(true),
    save: jest.fn().mockResolvedValue(true),
  })),
}));

describe('VaultRepository (Web)', () => {
  let vault;
  const vaultId = 'test-vault';

  // --- Test Data ---
  const job1 = { id: 'job-1', status: 'draft' };
  const job2 = { id: 'job-2', status: 'pending' };
  const customer1 = { id: 'did:web:c1', type: 'Contact.Customer', indexed: [{ name: ClaimsPersonSchemaorg.email, value: 'hmac(c1@example.com)' }, { name: ClaimsPersonSchemaorg.birthDate, value: 'hmac(1990-01-15)' }] };
  const customer2 = { id: 'did:web:c2', type: 'Contact.Customer', indexed: [{ name: ClaimsPersonSchemaorg.email, value: 'hmac(c2@example.com)' }, { name: ClaimsPersonSchemaorg.birthDate, value: 'hmac(1990-01-15)' }] };
  const professional1 = { id: 'did:web:p1', type: 'Contact.Professional', indexed: [{ name: ClaimsPersonSchemaorg.email, value: 'hmac(p1@example.com)' }] };

  beforeEach(async () => {
    // A single, unified setup for all tests in this suite.
    vault = new VaultRepository(vaultId);
    await vault.initialize();
    
    // Seed the vault with all necessary data for all tests.
    await vault.put('jobs', job1);
    await vault.put('jobs', job2);
    await vault.put('customers', customer1);
    await vault.put('customers', customer2);
    await vault.put('professionals', professional1);
  });

  it('should save a document and retrieve it', async () => {
    const store = vault.getStore();
    const savedRow = store.getRow('jobs', 'job-1');
    expect(savedRow).toEqual(job1);
  });

  it('should query documents by a top-level property', async () => {
    const results = await vault.query('jobs', { where: [{ attribute: 'status', equals: 'draft' }] });
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual(job1);
  });

  it('should find a single document by a single indexed attribute', async () => {
    const results = await vault.query('customers', { where: [{ attribute: ClaimsPersonSchemaorg.email, equals: 'hmac(c1@example.com)' }] });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(customer1.id);
  });

  it('should find multiple documents by a shared indexed attribute', async () => {
    const results = await vault.query('customers', { where: [{ attribute: ClaimsPersonSchemaorg.birthDate, equals: 'hmac(1990-01-15)' }] });
    expect(results).toHaveLength(2);
    const ids = results.map(r => r.id);
    expect(ids).toContain(customer1.id);
    expect(ids).toContain(customer2.id);
  });

  it('should find a single document using multiple AND conditions', async () => {
    const results = await vault.query('customers', { where: [{ attribute: ClaimsPersonSchemaorg.birthDate, equals: 'hmac(1990-01-15)' }, { attribute: ClaimsPersonSchemaorg.email, equals: 'hmac(c2@example.com)' }] });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(customer2.id);
  });

  it('should return an empty array if not all AND conditions match', async () => {
    const results = await vault.query('customers', { where: [{ attribute: ClaimsPersonSchemaorg.birthDate, equals: 'hmac(1990-01-15)' }, { attribute: ClaimsPersonSchemaorg.email, equals: 'hmac(nonexistent@example.com)' }] });
    expect(results).toHaveLength(0);
  });

  it('should query different tables independently', async () => {
    const customerResults = await vault.query('customers', { where: [{ attribute: ClaimsPersonSchemaorg.email, equals: 'hmac(c1@example.com)' }] });
    expect(customerResults).toHaveLength(1);

    const professionalResults = await vault.query('professionals', { where: [{ attribute: ClaimsPersonSchemaorg.email, equals: 'hmac(p1@example.com)' }] });
    expect(professionalResults).toHaveLength(1);
  });
});
