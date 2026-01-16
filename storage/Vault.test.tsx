// context/JobContext.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useProfile } from './ProfileContext';
import * as Vault from '../storage/Vault';
import ProfileManager from '../managers/ProfileManager'; // Import ProfileManager

// Import the TypeScript crypto service and the Expo-specific random generator
import { CryptographyService } from 'gdc-common-utils-ts/CryptographyService';
import { expoRandomGenerator } from '../crypto-js/expo-random-generator';

// The JobManager now depends on the Vault and a crypto service
import JobManager from '../managers/JobManager';

const JobManagerContext = createContext(null);
const JobsDataContext = createContext({ allJobs: [], isJobSystemReady: false });

export const JobProvider = ({ children }) => {
  const { profile: currentProfile } = useProfile();
  const [jobManager, setJobManager] = useState(null);
  const [allJobs, setAllJobs] = useState([]); // Esto podría venir del Vault en el futuro
  const [dataVersion, setDataVersion] = useState(0);

  // Inicializa el sistema de jobs cuando el perfil de usuario está disponible
  useEffect(() => {
    let manager;
    const initializeForProfile = async () => {
      if (currentProfile) {
        // 1. Unlock the profile before using its keys.
        await ProfileManager.unlock('demo-pin');
        
        if (!ProfileManager.isUnlocked()) {
          console.error("[JobContext] Failed to unlock profile. Aborting JobManager initialization.");
          return;
        }

        // 2. Initialize the SQLite database.
        await Vault.initialize();

        // 3. Create the platform-specific crypto service instance.
        const cryptoService = new CryptographyService(expoRandomGenerator);

        // 4. Create and initialize the JobManager, injecting its dependencies.
        const listener = () => setDataVersion(v => v + 1);
        manager = new JobManager({
          profile: currentProfile,
          wallet: cryptoService, // Pass the crypto service as the 'wallet'
          listener,
        });
        await manager.initialize();
        setJobManager(manager);

      } else {
        if (jobManager) jobManager.shutdown();
        setJobManager(null);
      }
    };
    initializeForProfile();
    return () => {
      if (manager) manager.shutdown();
    };
  }, [currentProfile]);

  // Define la interfaz pública del contexto
  const jobInterface = useMemo(() => {
    const isReady = !!jobManager;
    return {
      isJobSystemReady: isReady,
      allJobs, // Podríamos popular esto con los jobs del Vault si la UI lo necesita
      // Exponemos los métodos del JobManager de forma segura
      createJob: isReady ? jobManager.createJob.bind(jobManager) : () => Promise.reject(new Error("Sistema de Jobs no listo.")),
      sync: isReady ? jobManager.sync.bind(jobManager) : () => Promise.resolve(),
      // El JobManager ahora maneja su propio estado, no necesitamos más funciones aquí.
    };
  }, [jobManager, allJobs]);

  return (
    <JobManagerContext.Provider value={jobManager}>
      <JobsDataContext.Provider value={jobInterface}>
        {children}
      </JobsDataContext.Provider>
    </JobManagerContext.Provider>
  );
};

export const useJobs = () => useContext(JobsDataContext);