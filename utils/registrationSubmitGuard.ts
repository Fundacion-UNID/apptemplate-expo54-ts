// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: utils/registrationSubmitGuard.ts

import { JobRequest, JobStatus } from 'gdc-common-utils-ts/models/confidential-job';

type ProfileManagerLike = {
  queryJobs: (query: any) => Promise<JobRequest[]>;
  jobManager?: {
    updateJobStatus?: (
      jobId: string,
      newStatus: JobStatus,
      additionalData?: Record<string, unknown>
    ) => Promise<unknown>;
  };
};

const pendingStatuses = new Set<JobStatus>([
  JobStatus.DRAFT,
  JobStatus.SUBMITTING,
  JobStatus.SENT,
  JobStatus.ERROR_RETRYABLE,
]);

const routeNotFoundPatterns = [
  /\b404\b/i,
  /not\s+found/i,
  /service with id .* not found/i,
  /cannot\s+post/i,
  /failed to resolve did document/i,
  /failed to parse url/i,
  /failed to execute ['"]fetch['"]/i,
  /network request failed/i,
  /timed out/i,
];

export const isRouteNotFoundErrorMessage = (message?: string): boolean => {
  const text = String(message || '').trim();
  if (!text) return false;
  return routeNotFoundPatterns.some((pattern) => pattern.test(text));
};

const sortBySequenceDesc = (jobs: JobRequest[]): JobRequest[] =>
  [...jobs].sort((a, b) => {
    const seqA = Number((a as any).sequence || 0);
    const seqB = Number((b as any).sequence || 0);
    return seqB - seqA;
  });

export const getLatestJobByThid = async (
  profileManager: ProfileManagerLike,
  thid: string
): Promise<JobRequest | null> => {
  if (!profileManager || !thid) return null;
  const jobs = await profileManager.queryJobs({
    where: [{ attribute: 'thid', equals: thid }],
    limit: 20,
  });
  if (!jobs?.length) return null;
  return sortBySequenceDesc(jobs)[0];
};

export const cancelPendingJobsByThid = async (
  profileManager: ProfileManagerLike,
  thid: string,
  reason: string
): Promise<void> => {
  if (!profileManager || !thid) return;
  const updateJobStatus = profileManager?.jobManager?.updateJobStatus;
  if (typeof updateJobStatus !== 'function') return;

  const jobs = await profileManager.queryJobs({
    where: [{ attribute: 'thid', equals: thid }],
    limit: 50,
  });

  for (const job of jobs || []) {
    const status = (job as any).status as JobStatus | undefined;
    if (!status || !pendingStatuses.has(status)) continue;
    await updateJobStatus((job as any).id, JobStatus.FAILED, { errorMessage: reason });
  }
};

export const detectRouteNotFoundForThid = async (
  profileManager: ProfileManagerLike,
  thid: string
): Promise<{ isNotFound: boolean; message: string; job: JobRequest | null }> => {
  const job = await getLatestJobByThid(profileManager, thid);
  if (!job) return { isNotFound: false, message: '', job: null };

  const status = (job as any).status as JobStatus | undefined;
  const errorMessage = String((job as any).errorMessage || '');
  const isFailedLike = status === JobStatus.FAILED || status === JobStatus.ERROR_RETRYABLE;
  const isNotFound = isFailedLike && isRouteNotFoundErrorMessage(errorMessage);

  return {
    isNotFound,
    message: errorMessage,
    job,
  };
};

export const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string
): Promise<T> => {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
};
