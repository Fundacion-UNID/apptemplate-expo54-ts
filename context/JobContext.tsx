// context/JobContext.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { useProfile } from './ProfileContext';
import { JobRequest, JobStatus } from 'gdc-common-utils-ts/models/confidential-job';
import { IDecodedDidcommPayload } from 'gdc-common-utils-ts/models/confidential-message';
import { ServiceEndpointSelector } from 'gdc-common-utils-ts/models/did';
import { IJobManager } from 'gdc-sdk-client-ts/interfaces/IJobManager';

// --- Type Definitions for the Context ---

interface JobContextValue {
  jobs: JobRequest[];
  allJobs: JobRequest[];
  draftJobs: JobRequest[];
  isLoading: boolean;
  isJobSystemReady: boolean;
  jobManager: IJobManager | null;
  createJob: (content: any, selector?: ServiceEndpointSelector) => Promise<JobRequest>;
  createOrUpdateDraftJob: (content: any, selector?: ServiceEndpointSelector) => Promise<JobRequest>;
  findDraftJob: (formType: string) => Promise<JobRequest | null>;
  unprotectJob: (job: JobRequest) => Promise<JobRequest>;
  sync: (idToken?: string) => Promise<void>;
}

const JobContext = createContext<JobContextValue>({
  jobs: [],
  allJobs: [],
  draftJobs: [],
  isLoading: true,
  isJobSystemReady: false,
  jobManager: null,
  createJob: async () => {
    throw new Error('JobManager not ready');
  },
  createOrUpdateDraftJob: async () => {
    throw new Error('JobManager not ready');
  },
  findDraftJob: async () => null,
  unprotectJob: async (job) => job,
  sync: async () => {},
});

/**
 * This provider consumes the ProfileContext to get the JobManager
 * and provides a live-updated list of jobs to the UI.
 */
export const JobProvider = ({ children }: { children: ReactNode }) => {
  //isLoading is renamed to avoid conflicts. The jobManager is retrieved from the ProfileContext.
  const { profileManager, isLoading: isProfileLoading } = useProfile();
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isProfileLoading) {
      setIsLoading(true);
      return;
    }

    if (!profileManager) {
      setJobs([]);
      setIsLoading(false);
      return;
    }

    const fetchJobs = async () => {
      // Fetch the 50 most recent jobs for the current profile.
      const recentJobs = await profileManager.queryJobs({
        orderBy: { attribute: 'createdAtTimestamp', direction: 'desc' },
        limit: 50,
      });
      setJobs(recentJobs);
      setIsLoading(false);
    };

    fetchJobs();

    // TODO: Implement a listener on the JobManager to update jobs in real-time.
    // const unsubscribe = profileManager.jobManager.subscribe(fetchJobs);
    // return () => unsubscribe();

  }, [profileManager, isProfileLoading]);

  const jobManager = profileManager?.jobManager ?? null;
  const isJobSystemReady = !!jobManager?.isInitialized;
  const allJobs = jobs;
  const draftJobs = jobs.filter(job => job.status === JobStatus.DRAFT);

  const createJob = async (content: any, selector?: ServiceEndpointSelector) => {
    if (!jobManager) throw new Error('JobManager not ready');
    return jobManager.createJob(content as IDecodedDidcommPayload, selector as ServiceEndpointSelector);
  };

  const createOrUpdateDraftJob = async (content: any, selector?: ServiceEndpointSelector) => {
    if (!jobManager) throw new Error('JobManager not ready');
    return jobManager.createOrUpdateDraftJob(content as IDecodedDidcommPayload, selector as ServiceEndpointSelector);
  };

  const findDraftJob = async (formType: string) => {
    if (!jobManager) return null;
    return jobManager.findDraftJobByFormType(formType);
  };

  const unprotectJob = async (job: JobRequest) => {
    if (!profileManager) throw new Error('ProfileManager not ready');
    return profileManager.jobManager.wallet.unprotectConfidentialData(job, profileManager.profile.id) as Promise<JobRequest>;
  };

  const sync = async (idToken?: string) => {
    if (!jobManager) throw new Error('JobManager not ready');
    if (!idToken) return;
    return jobManager.sync(idToken);
  };

  const contextValue = useMemo(
    () => ({
      jobs,
      allJobs,
      draftJobs,
      isLoading,
      isJobSystemReady,
      jobManager,
      createJob,
      createOrUpdateDraftJob,
      findDraftJob,
      unprotectJob,
      sync,
    }),
    [jobs, allJobs, draftJobs, isLoading, isJobSystemReady, jobManager]
  );

  return (
    <JobContext.Provider value={contextValue}>
      {children}
    </JobContext.Provider>
  );
};

/**
 * Custom hook to access the live list of jobs and its loading state.
 */
export const useJobs = (): JobContextValue => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
