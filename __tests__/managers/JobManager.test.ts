// __tests__/managers/JobManager.test.ts

import JobManager from 'gdc-sdk-client-ts/JobManager';
import { JobStatus } from 'gdc-common-utils-ts/models/confidential-job';

const mockProfile = {
  id: 'profile-123',
  did: 'did:example:user-did',
};

const mockWallet = {
  protectConfidentialData: jest.fn(async (doc) => {
    const { content, ...rest } = doc as any;
    return { ...rest, jwe: { ciphertext: JSON.stringify(content) } };
  }),
  unprotectConfidentialData: jest.fn(async (doc) => {
    const content = JSON.parse(doc.jwe.ciphertext);
    return { ...doc, content };
  }),
  packForRecipient: jest.fn(async () => 'packed-jwe'),
  unpack: jest.fn(async () => ({ content: { ok: true } })),
};

const mockVault = {
  initialize: jest.fn(),
  put: jest.fn(),
  get: jest.fn(),
  query: jest.fn(),
};

const mockSdkConfig = {
  crypto: {
    randomUUID: jest.fn(() => 'mock-uuid'),
    digestString: jest.fn(async () => 'mock-digest'),
  },
  network: {
    isConnected: jest.fn(async () => true),
  },
  api: {
    operationMode: 'FAPI' as const,
    legacyFhirEnabled: false,
  },
  fetcher: jest.fn(),
};

const selector = {
  section: 'organization',
  format: 'json',
  resourceType: 'basic-message',
  action: 'create',
};

const baseContent = {
  type: 'basic-message',
  to: ['did:web:recipient.com'],
  from: mockProfile.did,
  aud: 'https://api.example.com/org/basic-message',
  body: { message: 'Hello, world!' },
};


describe('JobManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a basic job correctly', async () => {
    const jobManager = new JobManager({
      profile: mockProfile,
      wallet: mockWallet,
      vault: mockVault,
      sdkConfig: mockSdkConfig,
    });

    await jobManager.createJob(baseContent, selector);

    expect(mockVault.put).toHaveBeenCalledTimes(1);
    const [tableName, storedDoc] = mockVault.put.mock.calls[0];

    expect(tableName).toBe('jobs');
    expect(storedDoc.status).toBe(JobStatus.DRAFT);
    expect(storedDoc.vaultId).toBe(mockProfile.id);
    expect(storedDoc.section).toBe(selector.section);
    expect(storedDoc.jwe).toBeDefined();

    const unprotected = await mockWallet.unprotectConfidentialData(storedDoc, mockProfile.id);
    expect(unprotected.content.body).toEqual(baseContent.body);
    expect(unprotected.content.aud).toBe(baseContent.aud);
  });

  test('should submit in FAPI mode', async () => {
    const jobManager = new JobManager({
      profile: mockProfile,
      wallet: mockWallet,
      vault: mockVault,
      sdkConfig: mockSdkConfig,
    });

    const job = {
      id: 'job-1',
      status: JobStatus.DRAFT,
      jwe: { ciphertext: JSON.stringify(baseContent) },
    };

    mockVault.get.mockResolvedValue(job);
    mockSdkConfig.fetcher.mockResolvedValue({
      status: 202,
      headers: { get: () => 'http://poll.url/status' },
      ok: false,
      text: jest.fn(async () => ''),
    });

    await jobManager.submitJob(job as any);

    expect(mockWallet.packForRecipient).toHaveBeenCalledTimes(1);
    const [url, options] = mockSdkConfig.fetcher.mock.calls[0];
    expect(url).toBe(baseContent.aud);
    expect(options.headers['Content-Type']).toBe('application/x-www-form-urlencoded');
    expect(options.body).toBe('request=packed-jwe');
  });

  test('should submit in Legacy FHIR mode', async () => {
    mockSdkConfig.api.operationMode = 'DEMO';
    mockSdkConfig.api.legacyFhirEnabled = true;

    const jobManager = new JobManager({
      profile: mockProfile,
      wallet: mockWallet,
      vault: mockVault,
      sdkConfig: mockSdkConfig,
    });

    const fhirContent = {
      ...baseContent,
      aud: 'https://api.example.com/fhir/Patient',
      body: { resourceType: 'Patient' },
    };

    const job = {
      id: 'job-2',
      status: JobStatus.DRAFT,
      jwe: { ciphertext: JSON.stringify(fhirContent) },
    };

    mockVault.get.mockResolvedValue(job);
    mockSdkConfig.fetcher.mockResolvedValue({
      status: 200,
      ok: true,
      headers: { get: () => null },
      text: jest.fn(async () => 'ok'),
    });

    await jobManager.submitJob(job as any);

    const [, options] = mockSdkConfig.fetcher.mock.calls[0];
    expect(options.headers['Content-Type']).toBe('application/fhir+json');
    expect(options.body).toBe(JSON.stringify(fhirContent.body));
  });

  test('should submit in DIDComm plaintext mode when legacy FHIR is disabled', async () => {
    mockSdkConfig.api.operationMode = 'DEMO';
    mockSdkConfig.api.legacyFhirEnabled = false;

    const jobManager = new JobManager({
      profile: mockProfile,
      wallet: mockWallet,
      vault: mockVault,
      sdkConfig: mockSdkConfig,
    });

    const plaintextContent = {
      ...baseContent,
      aud: 'https://api.example.com/org.schema/Person',
    };

    const job = {
      id: 'job-3',
      status: JobStatus.DRAFT,
      jwe: { ciphertext: JSON.stringify(plaintextContent) },
    };

    mockVault.get.mockResolvedValue(job);
    mockSdkConfig.fetcher.mockResolvedValue({
      status: 200,
      ok: true,
      headers: { get: () => null },
      text: jest.fn(async () => 'ok'),
    });

    await jobManager.submitJob(job as any);

    const [, options] = mockSdkConfig.fetcher.mock.calls[0];
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(options.body).toBe(JSON.stringify(plaintextContent));
  });
});
