// __tests__/context/JobContext.test.js
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { JobProvider, useJobs } from '../../context/JobContext';
import { useProfile } from '../../context/ProfileContext';
import JobManager from '../../managers/JobManager';

// --- Mock Dependencies ---
// 1. Mock the JobManager module itself. We want to control its behavior.
jest.mock('../../managers/JobManager');
// 2. Mock the useProfile hook, which is a dependency of JobProvider.
jest.mock('../../context/ProfileContext');

describe('JobContext', () => {
  const mockJobManagerInstance = {
    initialize: jest.fn().mockResolvedValue(true),
    shutdown: jest.fn(),
    createJob: jest.fn(),
    sync: jest.fn(),
  };

  beforeEach(() => {
    // Before each test, clear mocks and reset the JobManager constructor mock.
    jest.clearAllMocks();
    JobManager.mockImplementation(() => mockJobManagerInstance);
  });

  test('should provide a safe, non-functional interface while initializing', () => {
    // ARRANGE: Simulate the initial state where no profile is active yet.
    useProfile.mockReturnValue({ profile: null });

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
    return expect(result.current.createJob()).rejects.toThrow("Job system not ready.");
  });

  test('should provide a functional interface after a profile is loaded', async () => {
    // ARRANGE: Simulate a profile being loaded.
    const mockProfile = { id: 'user123', did: 'did:example:123' };
    useProfile.mockReturnValue({ profile: mockProfile });

    // ACT: Render the hook.
    const { result } = renderHook(() => useJobs(), { wrapper: JobProvider });

    // ASSERT:
    // 1. Wait for the useEffect to complete and the system to become ready.
    await waitFor(() => {
      expect(result.current.isJobSystemReady).toBe(true);
    });

    // 2. Verify that the JobManager was initialized.
    expect(JobManager).toHaveBeenCalledWith({ profile: mockProfile, listener: expect.any(Function) });
    expect(mockJobManagerInstance.initialize).toHaveBeenCalled();

    // 3. Verify that `createJob` is now the real (mocked) function from our instance.
    // We can test this by calling it and checking if our mock was invoked.
    result.current.createJob({ thid: 'test' });
    expect(mockJobManagerInstance.createJob).toHaveBeenCalledWith({ thid: 'test' });
  });
});
