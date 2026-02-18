// __tests__/managers/ProfileManager.test.js

import { ProfileManager } from 'gdc-sdk-client-ts/ProfileManager';

describe('ProfileManager', () => {
  let logSpy: jest.SpyInstance;

  beforeAll(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    logSpy.mockRestore();
  });

  it('should initialize with a job manager and common services', () => {
    const profile = {
      id: 'profile-123',
      isAnonymous: false,
      createdAt: new Date().toISOString(),
      keys: { keys: [] },
      role: 'ISCO-08|1120',
      did: 'did:example:org-admin',
    };

    const manager = new ProfileManager({
      profile,
      wallet: {
        protectConfidentialData: jest.fn(),
        unprotectConfidentialData: jest.fn(),
      } as any,
      vault: {
        initialize: jest.fn(),
        put: jest.fn(),
        query: jest.fn(),
      } as any,
      sdkConfig: {
        crypto: { randomUUID: jest.fn(), digestString: jest.fn() },
        network: { isConnected: jest.fn(async () => true) },
        api: { operationMode: 'DEMO', legacyFhirEnabled: false },
        fetcher: jest.fn(),
      },
      appInfo: {
        appType: 'Organization',
        sector: 'health-care',
        applicationType: 'native',
        redirectUris: [],
        deviceInfo: {
          device_id: 'device-1',
          device_name: 'Device',
          os: 'ios',
          os_version: '1.0',
        },
      },
      orgDidDoc: {
        id: 'did:example:org',
        controller: [profile.did],
      } as any,
    });

    expect(manager.profile).toBe(profile);
    expect(manager.jobManager).toBeDefined();
    expect(manager.common.auth).toBeDefined();
  });
});
