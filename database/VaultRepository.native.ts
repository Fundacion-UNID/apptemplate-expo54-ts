// database/VaultRepository.native.js
// @ts-ignore
import * as SQLite from 'expo-sqlite';
import { IVaultRepository } from 'gdc-sdk-client-ts/src/interfaces/IVaultRepository';

/**
 * A robust, native-only repository for the user's vault, using Expo SQLite.
 * This provides a reliable local-first storage foundation for iOS and Android.
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

    const openDatabase = (SQLite as any).openDatabase ?? (SQLite as any).openDatabaseSync;
    this.db = openDatabase(`${this.vaultId}.db`);
    await this._executeSql(
      `CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY NOT NULL,
        status TEXT,
        vaultId TEXT,
        doc TEXT NOT NULL
      );`
    );
    // An index is implicitly created for the PRIMARY KEY. 
    // We can add more indexes if other queries become slow.
    
    this.isInitialized = true;
    console.log(`[VaultRepository.native] Initialized successfully for vault: ${this.vaultId}`);
  }

  _executeSql(sql: string, params: any[] = []) {
    return new Promise<any>((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          sql,
          params,
          (_, result) => resolve(result),
          (_, error) => {
            reject(error);
            return true; // Rollback transaction
          }
        );
      });
    });
  }

  async put(tableName, doc) {
    if (!this.isInitialized || tableName !== 'jobs') return false;
    if (!doc || !doc.id) throw new Error('Document must have an id.');

    const docString = JSON.stringify(doc);
    await this._executeSql(
      'INSERT OR REPLACE INTO jobs (id, status, vaultId, doc) VALUES (?, ?, ?, ?);',
      [doc.id, doc.status, doc.vaultId, docString]
    );
    return true;
  }

  async get(tableName, docId) {
    if (!this.isInitialized || tableName !== 'jobs') return undefined;

    const result: any = await this._executeSql('SELECT doc FROM jobs WHERE id = ?;', [docId]);
    if (result.rows.length > 0) {
      return JSON.parse(result.rows.item(0).doc);
    }
    return undefined;
  }

  async query(tableName, { where }) {
    if (!this.isInitialized || tableName !== 'jobs' || !where || where.length === 0) {
      return [];
    }

    // Dynamically build the WHERE clause and parameters
    const whereClauses = where.map(condition => `${condition.attribute} = ?`).join(' AND ');
    const params = where.map(condition => condition.equals);

    const sql = `SELECT doc FROM jobs WHERE ${whereClauses};`;

    const result: any = await this._executeSql(sql, params);
    
    // Convert the SQLite result to a standard array and parse the JSON
    const resultsArray = [];
    for (let i = 0; i < result.rows.length; i++) {
        resultsArray.push(JSON.parse(result.rows.item(i).doc));
    }
    return resultsArray;
  }

  // No-op for this implementation, but kept for interface consistency.
  async flush() {
    return Promise.resolve();
  }
}

export default VaultRepository;
