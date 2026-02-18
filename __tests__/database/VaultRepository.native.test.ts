// __tests__/database/VaultRepository.native.test.ts

import VaultRepository from '../../database/VaultRepository.native';

type Row = { id: string; status?: string; vaultId?: string; doc: string };

const createMockDb = () => {
  const rows = new Map<string, Row>();

  const executeSql = (sql: string, params: any[], onSuccess: any, onError: any) => {
    try {
      const normalized = sql.replace(/\s+/g, ' ').trim();

      if (normalized.startsWith('CREATE TABLE')) {
        onSuccess(null, { rows: { length: 0, item: () => undefined } });
        return;
      }

      if (normalized.startsWith('INSERT OR REPLACE INTO jobs')) {
        const [id, status, vaultId, doc] = params;
        rows.set(id, { id, status, vaultId, doc });
        onSuccess(null, { rows: { length: 0, item: () => undefined } });
        return;
      }

      if (normalized.startsWith('SELECT doc FROM jobs WHERE id = ?')) {
        const [id] = params;
        const row = rows.get(id);
        const resultRows = row ? [row] : [];
        onSuccess(null, {
          rows: {
            length: resultRows.length,
            item: (index: number) => resultRows[index],
          },
        });
        return;
      }

      if (normalized.startsWith('SELECT doc FROM jobs WHERE')) {
        const whereClause = normalized.split('WHERE')[1].replace(';', '').trim();
        const columns = whereClause
          .split('AND')
          .map(part => part.replace('= ?', '').trim());

        const resultRows = Array.from(rows.values()).filter(row => {
          return columns.every((column, index) => row[column as keyof Row] === params[index]);
        });

        onSuccess(null, {
          rows: {
            length: resultRows.length,
            item: (index: number) => resultRows[index],
          },
        });
        return;
      }

      onSuccess(null, { rows: { length: 0, item: () => undefined } });
    } catch (error) {
      onError(null, error);
    }
  };

  return {
    rows,
    transaction: (callback: any) => {
      const tx = { executeSql };
      callback(tx);
    },
  };
};

jest.mock('expo-sqlite', () => {
  return {
    openDatabase: jest.fn(() => createMockDb()),
    openDatabaseSync: jest.fn(() => createMockDb()),
  };
});

describe('VaultRepository (Native)', () => {
  const vaultId = 'test-vault';
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    logSpy.mockRestore();
  });

  test('should save and retrieve a document', async () => {
    const vault = new VaultRepository(vaultId);
    await vault.initialize();

    const jobDocument = {
      id: 'doc-123',
      thid: 'thread-456',
      status: 'draft',
      vaultId,
      content: { test: true },
    };

    await vault.put('jobs', jobDocument);
    const stored = await vault.get('jobs', 'doc-123');

    expect(stored).toEqual(jobDocument);
  });

  test('should query documents by indexed columns', async () => {
    const vault = new VaultRepository(vaultId);
    await vault.initialize();

    const draftJob = { id: 'doc-1', status: 'draft', vaultId };
    const pendingJob = { id: 'doc-2', status: 'pending', vaultId };

    await vault.put('jobs', draftJob);
    await vault.put('jobs', pendingJob);

    const results = await vault.query('jobs', {
      where: [{ attribute: 'status', equals: 'draft' }],
    });

    expect(results).toHaveLength(1);
    expect(results[0]).toEqual(draftJob);
  });

  test('should return empty when no records match', async () => {
    const vault = new VaultRepository(vaultId);
    await vault.initialize();

    await vault.put('jobs', { id: 'doc-1', status: 'draft', vaultId });

    const results = await vault.query('jobs', {
      where: [{ attribute: 'status', equals: 'completed' }],
    });

    expect(results).toEqual([]);
  });
});
