// __tests__/database/VaultRepository.test.js
import VaultRepository from '../../database/VaultRepository';

// Mock the tinybase persister to prevent it from writing to actual browser local storage.
jest.mock('tinybase/persisters/persister-browser', () => ({
  createLocalPersister: jest.fn(() => ({
    load: jest.fn().mockResolvedValue(true),
    save: jest.fn().mockResolvedValue(true),
  })),
}));

describe('VaultRepository (Web)', () => {
  let vaultRepository;
  const vaultId = 'test-vault';

  beforeEach(async () => {
    // Before each test, create a new instance of the real VaultRepository.
    vaultRepository = new VaultRepository(vaultId);
    // We must call initialize() to set up the in-memory store.
    await vaultRepository.initialize();
  });

  test('should save the entire document as a row when put is called', async () => {
    // ARRANGE: Create a sample job document to be stored.
    const jobDocument = {
      id: 'doc-123',
      thid: 'thread-456',
      status: 'draft',
    };

    // ACT: Call the `put` method with the single document.
    await vaultRepository.put('jobs', jobDocument);

    // ASSERT:
    // 1. Directly inspect the internal tinybase store to verify the saved data.
    const store = vaultRepository.getStore();
    const savedRow = store.getRow('jobs', 'doc-123');

    // 2. **This is the critical assertion.**
    //    Verify that the entire saved row matches our original document.
    expect(savedRow).toEqual(jobDocument);
  });

  test('query should find and return the correct documents', async () => {
    // ARRANGE: Create two documents with different statuses.
    const draftJob = { id: 'doc-1', status: 'draft' };
    const pendingJob = { id: 'doc-2', status: 'pending' };
    await vaultRepository.put('jobs', draftJob);
    await vaultRepository.put('jobs', pendingJob);

    // ACT: Query for documents with status 'draft'.
    const results = await vaultRepository.query('jobs', { where: [{ attribute: 'status', equals: 'draft' }] });

    // ASSERT:
    // 1. Verify that it found exactly one result.
    expect(results).toHaveLength(1);

    // 2. Verify that the result is the correct job document.
    expect(results[0]).toEqual(draftJob);
  });

  test('query should return an empty array if no match is found', async () => {
    // ARRANGE: Store a document.
    const job = { id: 'doc-1', status: 'draft' };
    await vaultRepository.put('jobs', job);

    // ACT: Query for a status that doesn't exist.
    const results = await vaultRepository.query('jobs', { where: [{ attribute: 'status', equals: 'non-existent-status' }] });

    // ASSERT: Verify that the result is an empty array.
    expect(results).toEqual([]);
  });
});


