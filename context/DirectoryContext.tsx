// context/DirectoryContext.js
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import DirectoryManager from '../managers/DirectoryManager';
import { useProfile } from './ProfileContext';

type DirectoryContextValue = {
  allContacts: any[];
  allGroups: any[];
  isDirectoryReady: boolean;
  isContactSystemReady: boolean;
  addRecentResource: (doc: any) => void;
  findRecentResourceBy: (query: any) => Promise<any | null>;
  getAllRecentResources: (type?: string | null) => any[];
  addGroup: (groupData: any) => any;
  getAllGroups: () => any[];
};

// This context will hold the ContactManager instance itself.
const ContactManagerContext = createContext<DirectoryManager | null>(null);
// This context will provide a stable interface for the UI to consume.
const DirectoryDataContext = createContext<DirectoryContextValue>({
  allContacts: [],
  allGroups: [],
  isDirectoryReady: false,
  isContactSystemReady: false,
  addRecentResource: () => {},
  findRecentResourceBy: async () => null,
  getAllRecentResources: () => [],
  addGroup: () => ({}),
  getAllGroups: () => [],
});

export const DirectoryProvider = ({ children }) => {
  const { profile: currentProfile } = useProfile();
  const [contactManager, setContactManager] = useState(null);
  const [allContacts, setAllContacts] = useState([]);
  const [allGroups, setAllGroups] = useState([]);

  // Initialize the ContactManager when a profile becomes active.
  useEffect(() => {
    if (currentProfile) {
      const manager = new DirectoryManager(currentProfile);
      setContactManager(manager);
      setAllContacts(manager.getAllRecentResources());
      setAllGroups(manager.getAllGroups());
    } else {
      setContactManager(null);
      setAllContacts([]);
      setAllGroups([]);
    }
  }, [currentProfile]);

  const directoryInterface = useMemo(() => {
    const isReady = !!contactManager;
    return {
      isDirectoryReady: isReady,
      isContactSystemReady: isReady,
      allContacts,
      allGroups,
      // We expose the methods from the manager through this stable interface.
      addRecentResource: isReady 
        ? (doc) => {
            contactManager.addRecentResource(doc);
            // Refresh the contacts list after adding a new one.
            setAllContacts(contactManager.getAllRecentResources());
          }
        : () => { /* no-op */ },
      findRecentResourceBy: isReady 
        ? contactManager.findRecentResourceBy.bind(contactManager) 
        : () => Promise.resolve(null),
      getAllRecentResources: isReady
        ? contactManager.getAllRecentResources.bind(contactManager)
        : () => [],
      addGroup: isReady
        ? (groupData) => {
            const newGroup = contactManager.addGroup(groupData);
            // Create a job to persist the group to the vault
            // This part will be implemented later, for now just update the context
            setAllGroups(contactManager.getAllGroups()); 
            return newGroup;
          }
        : () => { /* no-op */ },
      getAllGroups: isReady
        ? contactManager.getAllGroups.bind(contactManager)
        : () => [],
    };
  }, [contactManager, allContacts, allGroups]);

  return (
    <ContactManagerContext.Provider value={contactManager}>
      <DirectoryDataContext.Provider value={directoryInterface}>
        {children}
      </DirectoryDataContext.Provider>
    </ContactManagerContext.Provider>
  );
};

/**
 * Hook to access the directory of contacts and manager methods.
 */
export const useDirectory = () => useContext(DirectoryDataContext);

// Backward-compatible alias for older screens.
export const useContacts = () => useContext(DirectoryDataContext);
