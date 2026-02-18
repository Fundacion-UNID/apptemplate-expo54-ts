// __tests__/context/JobContext.test.js
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { JobProvider, useJobs } from '../../context/JobContext';
import { useProfile } from '../../context/ProfileContext';

// --- Mock Dependencies ---
// Mock the useProfile hook, which is a dependency of JobProvider.
jest.mock('../../context/ProfileContext');
jest.mock('../../platformServices', () => ({
  appWallet: {},
  createVaultForProfile: jest.fn(),
}));

describe('JobContext', () => {
  let logSpy: jest.SpyInstance;

  beforeAll(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    logSpy.mockRestore();
  });

  test('should provide a safe, non-functional interface while initializing', () => {
    // ARRANGE: Simulate the initial state where no profile is active yet.
    useProfile.mockReturnValue({ profileManager: null, isLoading: false });

    // ACT: Render the useJobs hook within the provider.
    // `renderHook` is a utility from Testing Library for testing hooks.
    const { result } = renderHook(() => useJobs(), { wrapper: JobProvider });

    // ASSERT:
    // 1. Verify the system is not ready.
    expect(result.current.isJobSystemReady).toBe(false);

    // 2. **This is the test that would have caught the crash.**
    //    Verify that `createJob` is a function, even in this initial state.
    expect(typeof result.current.createJob).toBe('function');

    // 3. Verify that calling it returns a rejected promise, as per our fix.
    return expect(result.current.createJob()).rejects.toThrow('JobManager not ready');
  });

  test('should provide a functional interface after a profile is loaded', async () => {
    // ARRANGE: Simulate a profile being loaded.
    const mockJobManager = {
      isInitialized: true,
      createJob: jest.fn(),
      createOrUpdateDraftJob: jest.fn(),
      findDraftJobByFormType: jest.fn(),
      sync: jest.fn(),
    };
    const mockProfileManager = {
      jobManager: mockJobManager,
      queryJobs: jest.fn(async () => []),
    };
    useProfile.mockReturnValue({ profileManager: mockProfileManager, isLoading: false });

    // ACT: Render the hook.
    const { result } = renderHook(() => useJobs(), { wrapper: JobProvider });

    // ASSERT:
    // 1. Wait for the useEffect to complete and the system to become ready.
    await waitFor(() => {
      expect(result.current.isJobSystemReady).toBe(true);
    });

    // 2. Verify that `createJob` is now the real (mocked) function from our instance.
    // We can test this by calling it and checking if our mock was invoked.
    const payload = { thid: 'test' };
    result.current.createJob(payload);
    expect(mockJobManager.createJob).toHaveBeenCalledWith(payload, undefined);
  });
});
