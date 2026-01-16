// managers/ConnectorManager.ts

/**
 * A simple in-memory state manager for the currently active provider/connector DID.
 * In a more complex application, this could be replaced by a state management library
 * like Redux, Zustand, or a React Context.
 */

let currentProviderDid: string | null = null;

const ConnectorManager = {
  /**
   * Sets the did:web for the provider/organization the user is interacting with.
   * @param {string} did - The did:web string of the provider.
   */
  setProviderDid: (did: string): void => {
    console.log(`[ConnectorManager] Setting provider DID to: ${did}`);
    currentProviderDid = did;
  },

  /**
   * Retrieves the currently set provider did:web.
   * @returns {string | null} The currently active provider DID, or null if not set.
   */
  getProviderDid: (): string | null => {
    return currentProviderDid;
  },

  /**
   * Clears the currently set provider did:web.
   */
  clearProviderDid: (): void => {
    console.log('[ConnectorManager] Clearing provider DID.');
    currentProviderDid = null;
  },
};

export default ConnectorManager;
