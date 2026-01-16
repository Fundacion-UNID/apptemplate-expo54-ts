// context/AuthorizationContext.js
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import AuthorizationManager from '../managers/AuthorizationManager';
import { useProfile } from './ProfileContext';

const AuthorizationContext = createContext(null);

/**
 * This provider is responsible for instantiating the AuthorizationManager
 * for the currently logged-in professional and providing its methods to the UI.
 */
export const AuthorizationProvider = ({ children }) => {
  const { profile: currentProfile } = useProfile();
  const [authManager, setAuthManager] = useState(null);

  useEffect(() => {
    // A professional's URN is their verifiable identifier, which contains their roles.
    const professionalUrn = currentProfile?.urn;

    if (professionalUrn) {
      const manager = new AuthorizationManager(professionalUrn);
      setAuthManager(manager);
    } else {
      setAuthManager(null);
    }
  }, [currentProfile]);

  const authInterface = useMemo(() => {
    const isReady = !!authManager;
    return {
      isReady,
      // The core method: can(action, resource)
      can: isReady ? authManager.can.bind(authManager) : () => false,
      
      // A convenience method for building UIs
      getAllowedDocumentTypesForCreation: isReady 
        ? authManager.getAllowedDocumentTypesForCreation.bind(authManager) 
        : () => [],
      
      // Expose contextual information
      getRole: isReady ? authManager.getRole.bind(authManager) : () => null,
      getSector: isReady ? authManager.getSector.bind(authManager) : () => null,
      getJurisdiction: isReady ? authManager.getJurisdiction.bind(authManager) : () => null,
    };
  }, [authManager]);

  return (
    <AuthorizationContext.Provider value={authInterface}>
      {children}
    </AuthorizationContext.Provider>
  );
};

/**
 * Hook to access the authorization methods and user's permissions.
 * @example
 * const { can, getRole } = useAuthorization();
 * if (can('create', 'Appointment')) {
 *   // render the button
 * }
 */
export const useAuthorization = () => useContext(AuthorizationContext);
