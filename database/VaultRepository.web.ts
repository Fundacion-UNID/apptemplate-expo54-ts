// database/VaultRepository.web.js
import { openDB } from 'idb';
import { IVaultRepository } from 'gdc-sdk-client-ts/src/interfaces/IVaultRepository';

/**
 * A web-optimized repository for the user's vault, using IndexedDB via the 'idb' library.
 * This provides a robust client-side storage solution for web platforms.
 * @implements {IVaultRepository}
 */
class VaultRepository {
  private vaultId: string;
  private db: any;
  private isInitialized: boolean;

  constructor(vaultId: string) {
    if (!vaultId) {
      throw new Error('VaultRepository requires a vaultId upon instantiation.');
    }
    this.vaultId = vaultId;
    this.db = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    this.db = await openDB(this.vaultId, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('jobs')) {
          const store = db.createObjectStore('jobs', { keyPath: 'id' });
          store.createIndex('status_vaultId', ['status', 'vaultId']);
        }
      },
    });
    
    this.isInitialized = true;
  }

  async put(tableName, doc) {
    if (!this.isInitialized || tableName !== 'jobs') return false;
    if (!doc || !doc.id) throw new Error('Document must have an id.');

    const docString = JSON.stringify(doc);
    const tx = this.db.transaction('jobs', 'readwrite');
    await tx.store.put({ id: doc.id, status: doc.status, vaultId: doc.vaultId, doc: docString });
    await tx.done;
    return true;
  }

  async get(tableName, docId) {
    if (!this.isInitialized || tableName !== 'jobs') return undefined;

    const result = await this.db.get('jobs', docId);
    return result ? JSON.parse(result.doc) : undefined;
  }

  async query(tableName, { where }) {
    if (!this.isInitialized || tableName !== 'jobs' || !where || where.length === 0) {
      return [];
    }

    // IndexedDB is most efficient when querying by a single index.
    // For this client-side repo, we'll fetch all and filter in memory for flexibility.
    // For more complex scenarios, additional indexes could be created.
    const allJobs = await this.db.getAll('jobs');

    const filteredJobs = allJobs.filter(job => {
      // The job must match ALL conditions in the `where` clause.
      return where.every(condition => {
        return job[condition.attribute] === condition.equals;
      });
    });

    return filteredJobs.map(row => JSON.parse(row.doc));
  }

  async flush() {
    return Promise.resolve();
  }
}

export default VaultRepository;
