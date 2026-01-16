// __mocks__/database/VaultMemRepository.ts

// A simplified version of the backend's VaultMemRepository, adapted for frontend testing.
// It is not a 1-to-1 port but implements the methods needed by JobManager.

// Simple type definitions to make the mock functional without importing complex models.
type RecordBase = { id: string; [key: string]: any; };
type QueryCondition = { attribute: string; equals: any; };

export class VaultMemRepository {
  private static instance: VaultMemRepository | null = null;
  private data: Map<string, Map<string, RecordBase>>; // sectionId -> docId -> doc

  constructor(profileId?: string) {
    if (!VaultMemRepository.instance) {
      this.data = new Map();
      VaultMemRepository.instance = this;
    }
    // This is the fix: ensure 'this.data' is assigned for subsequent calls too
    this.data = VaultMemRepository.instance.data; 
    return VaultMemRepository.instance;
  }

  public static clear(): void {
    if (VaultMemRepository.instance) {
      VaultMemRepository.instance.data.clear();
    }
  }

  public async initialize(): Promise<void> {
    return Promise.resolve();
  }

  public async put(sectionId: string, doc: RecordBase): Promise<void> {
    if (!this.data.has(sectionId)) {
      this.data.set(sectionId, new Map<string, RecordBase>());
    }
    this.data.get(sectionId)!.set(doc.id, doc);
    return Promise.resolve();
  }

  public async get(sectionId: string, docId: string): Promise<RecordBase | undefined> {
    const section = this.data.get(sectionId);
    return Promise.resolve(section ? section.get(docId) : undefined);
  }

  public async query(sectionId: string, query: { where: QueryCondition[] }): Promise<RecordBase[]> {
    const section = this.data.get(sectionId);
    if (!section) {
      return Promise.resolve([]);
    }
    const allDocs = Array.from(section.values());

    const filtered = allDocs.filter(doc => {
      return query.where.every(condition => {
        // Simplified logic to match frontend's usage (direct property access)
        return doc[condition.attribute] === condition.equals;
      });
    });

    return Promise.resolve(filtered);
  }
}

// Export it as a default to match the original module's structure
export default VaultMemRepository;
