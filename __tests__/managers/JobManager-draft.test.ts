import JobManager from 'gdc-sdk-client-ts/src/JobManager';
import { JobStatus } from 'gdc-common-utils-ts/models/confidential-job';
import { DRAFT_EMPLOYEES_BODY_INITIAL, DRAFT_EMPLOYEES_BODY_UPDATED } from '../data/employee.data';

const mockProfile = { id: 'test-profile', did: 'did:web:test' };

const mockWallet = {
  protectConfidentialData: jest.fn(async (doc) => {
    const { content, ...rest } = doc as any;
    return { ...rest, jwe: { ciphertext: JSON.stringify(content) } };
  }),
  unprotectConfidentialData: jest.fn(async (doc) => {
    const content = JSON.parse(doc.jwe.ciphertext);
    return { ...doc, content };
  }),
};

const mockSdkConfig = {
  crypto: {
    randomUUID: jest.fn(() => `mock-uuid-${Math.random()}`),
    digestString: jest.fn(async () => `hashed-${Math.random()}`),
  },
  network: {
    isConnected: jest.fn(async () => true),
  },
  api: {
    operationMode: 'DEMO' as const,
    legacyFhirEnabled: false,
  },
  fetcher: jest.fn(),
};

const selector = {
  section: 'organization',
  format: 'json',
  resourceType: 'employees',
  action: 'create',
};

const createVault = () => {
  const store = { jobs: {} as Record<string, any> };
  return {
    initialize: jest.fn(),
    put: jest.fn((table, doc) => {
      store[table][doc.id] = doc;
    }),
    get: jest.fn((table, id) => store[table][id]),
    query: jest.fn((table, { where }) => {
      const status = where.find((c) => c.attribute === 'status')?.equals;
      const type = where.find((c) => c.attribute === 'content.type')?.equals;
      const vaultId = where.find((c) => c.attribute === 'vaultId')?.equals;
      return Object.values(store.jobs).filter((job: any) => {
        const content = job.content ?? (job.jwe?.ciphertext ? JSON.parse(job.jwe.ciphertext) : undefined);
        return job.status === status && job.vaultId === vaultId && content?.type === type;
      });
    }),
  };
};

// --- The Test Suite ---
describe('JobManager Draft Handling', () => {
  let jobManager: JobManager;
  let mockVault: ReturnType<typeof createVault>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockVault = createVault();
    jobManager = new JobManager({
      profile: mockProfile,
      wallet: mockWallet,
      vault: mockVault,
      sdkConfig: mockSdkConfig,
    });
    jobManager.isInitialized = true;
  });

  it('should create a NEW draft job when none exists', async () => {
    await jobManager.createOrUpdateDraftJob(
      {
        type: 'employees',
        body: DRAFT_EMPLOYEES_BODY_INITIAL,
        aud: 'https://api.example.com/employees',
      },
      selector
    );

    expect(mockVault.put).toHaveBeenCalledTimes(1);
    const [tableName, savedJob] = mockVault.put.mock.calls[0];

    expect(tableName).toBe('jobs');
    expect(savedJob.status).toBe(JobStatus.DRAFT);

    const unprotected = await mockWallet.unprotectConfidentialData(savedJob, mockProfile.id);
    expect(unprotected.content.body).toEqual(DRAFT_EMPLOYEES_BODY_INITIAL);
  });

  it('should UPDATE an existing draft, keeping ID stable and changing versionId', async () => {
    const initialJob = await jobManager.createOrUpdateDraftJob(
      {
        type: 'employees',
        body: DRAFT_EMPLOYEES_BODY_INITIAL,
        aud: 'https://api.example.com/employees',
      },
      selector
    );
    const initialJobId = initialJob.id;
    const initialVersionId = initialJob.versionId;

    const updatedJob = await jobManager.createOrUpdateDraftJob(
      {
        type: 'employees',
        body: DRAFT_EMPLOYEES_BODY_UPDATED,
        aud: 'https://api.example.com/employees',
      },
      selector
    );

    expect(updatedJob.id).toBe(initialJobId);
    expect(updatedJob.versionId).not.toBe(initialVersionId);

    const unprotected = await mockWallet.unprotectConfidentialData(updatedJob, mockProfile.id);
    expect(unprotected.content.body).toEqual(DRAFT_EMPLOYEES_BODY_UPDATED);
  });
});
