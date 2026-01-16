// managers/DirectoryManager.js

const SESSION_STORAGE_KEY = 'recentResourcesCache';

/**
 * @class DirectoryManager
 * @description Manages a directory of "Resource Objects" for the professional.
 *
 * --- ARCHITECTURAL NOTE: Resource Objects ---
 * This manager operates exclusively on "Resource Objects". As defined in ARCHITECTURE.md,
 * a Resource Object is a plaintext, in-memory representation of a single piece of
 * business data (e.g., a RelatedPerson, an Appointment).
 *
 * Its defining feature is a `meta.claims` object at its root, which is the single
 * source of truth for its business data.
 *
 * This manager does NOT handle "ConfidentialStorageDocs" (which have `indexed` attributes 
 * protected by HMAC (both attribute name and its value, multiplexed from comma-separated values), 
 * and a `.content` property (unencrypted) or a `.jwe` property (when stored), 
 * and are used for persistence by JobManager and VaultRepository).
 *
 * NOTE: This is a temporary implementation using sessionStorage to unblock UI
 * and workflow development.
 */
class DirectoryManager {
  private profile: { id: string };
  private recentResources: Map<string, any>;

  constructor(profile: { id: string }) {
    if (!profile) {
      throw new Error('DirectoryManager requires a profile.');
    }
    this.profile = profile;
    
    // In-memory cache loaded from sessionStorage. Stores Resource Objects, keyed by their ID (DID).
    this.recentResources = this._loadFromSession();
  }

  _loadFromSession() {
    try {
      if (typeof sessionStorage === 'undefined') return new Map();
      const storedData = sessionStorage.getItem(`${SESSION_STORAGE_KEY}_${this.profile.id}`);
      return storedData ? new Map(JSON.parse(storedData)) : new Map();
    } catch (error) {
      console.error("[DirectoryManager] Failed to load resources from sessionStorage:", error);
      return new Map();
    }
  }

  _saveToSession() {
    try {
      if (typeof sessionStorage === 'undefined') return;
      const dataToStore = JSON.stringify(Array.from(this.recentResources.entries()));
      sessionStorage.setItem(`${SESSION_STORAGE_KEY}_${this.profile.id}`, dataToStore);
    } catch (error) {
      console.error("[DirectoryManager] Failed to save resources to sessionStorage:", error);
    }
  }

  /**
   * Adds a Resource Object to the in-memory "recents" cache and persists it.
   * @param {object} resource - The Resource Object. It must have an `id` and `meta.claims`.
   */
  addRecentResource(resource) {
    if (!resource || !resource.id || !resource.meta?.claims) {
      console.error("[DirectoryManager] Cannot add to cache: object is not a valid Resource Object.", resource);
      return;
    }
    console.log(`[DirectoryManager] Caching recent resource: ${resource.id}`);
    this.recentResources.set(resource.id, resource);
    this._saveToSession();
  }

  /**
   * Finds a resource in the in-memory cache using one or more query conditions (AND).
   * It searches in top-level properties (like 'id') and directly within `meta.claims`.
   * @param {object} query - The query object.
   * @param {Array<object>} query.where - An array of conditions. { attribute: string, equals: any }.
   * @returns {Promise<object|null>} The first matching resource, or null if not found.
   */
  async findRecentResourceBy({ where }) {
    if (!where || where.length === 0) return null;

    for (const resource of this.recentResources.values()) {
      const isMatch = where.every(condition => {
        // Condition targets a top-level property of the Resource Object (e.g., 'id', 'type')
        if (resource[condition.attribute] !== undefined) {
          return resource[condition.attribute] === condition.equals;
        }
        // Condition targets a claim within the meta property. This is the primary search mechanism.
        const claimValue = resource.meta?.claims?.[condition.attribute];
        return claimValue === condition.equals;
      });

      if (isMatch) {
        return resource; // Return the first match
      }
    }
    return null;
  }

  /**
   * Retrieves all resources currently in the "recents" cache, optionally filtered by type.
   * @param {string} [type] - The type of resource to retrieve (e.g., 'RelatedPerson').
   * @returns {Array<object>} An array of matching Resource Objects.
   */
  getAllRecentResources(type = null) {
    const allResources = Array.from(this.recentResources.values());
    if (type) {
      return allResources.filter(r => r.type === type);
    }
    return allResources;
  }

  // --- Group Methods ---

  /**
   * Creates a Group Resource Object and adds it to the cache.
   * @param {object} groupData - Contains group details like `name`, `description`.
   * @returns {object} The created group resource object.
   */
  addGroup(groupData) {
    const newId = `urn:uuid:${crypto.randomUUID()}`; // A standard way to generate a temp ID
    const groupResource = {
      id: newId,
      type: 'Group',
      meta: {
        claims: groupData
      }
    };
    this.addRecentResource(groupResource);
    return groupResource;
  }

  /**
   * Retrieves all groups from the "recents" cache.
   * @returns {Array<object>} An array of Group Resource Objects.
   */
  getAllGroups() {
    return this.getAllRecentResources('Group');
  }
}

export default DirectoryManager;
