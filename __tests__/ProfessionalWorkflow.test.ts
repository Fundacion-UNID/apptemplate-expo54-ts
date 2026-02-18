// __tests__/ProfessionalWorkflow.test.js

import DirectoryManager from '../managers/DirectoryManager';
import JobManager from 'gdc-sdk-client-ts/JobManager';
import { ClaimsPersonSchemaorg } from '../constants/Schemas';
import { testCommMsgExtAppointmentRequest } from './data/appointment.data';
import { testCustomer1Data } from './data/identity.data';
import { testOrg1ApiDidWeb } from './data/organization.data';
import { ServiceIds } from '../constants/ServiceIds';

// --- Test Data ---
const mockProfessionalProfile = { id: 'professional-profile-id', did: testOrg1ApiDidWeb };


describe('Professional End-to-End Workflow', () => {
  let logSpy: jest.SpyInstance;

  let directoryManager;
  let jobManager;
  let mockVault;

  beforeEach(() => {
    jest.clearAllMocks();
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
    
    // Instantiate real managers for this integration test
    directoryManager = new DirectoryManager(mockProfessionalProfile);
    mockVault = {
      initialize: jest.fn(),
      put: jest.fn(),
      get: jest.fn(),
      query: jest.fn(),
    };
    const mockWallet = {
      protectConfidentialData: jest.fn(async (doc) => ({ ...doc, jwe: { ciphertext: JSON.stringify(doc.content) } })),
      unprotectConfidentialData: jest.fn(async (doc) => ({ ...doc, content: JSON.parse(doc.jwe.ciphertext) })),
      packForRecipient: jest.fn(async () => 'packed-jwe'),
    };
    const mockSdkConfig = {
      crypto: {
        randomUUID: jest.fn(() => 'mock-uuid'),
        digestString: jest.fn(async () => 'mock-digest'),
      },
      network: { isConnected: jest.fn(async () => true) },
      api: { operationMode: 'DEMO', legacyFhirEnabled: false },
      fetcher: jest.fn(),
    };

    jobManager = new JobManager({
      profile: mockProfessionalProfile,
      wallet: mockWallet,
      vault: mockVault,
      sdkConfig: mockSdkConfig,
    });
  });

  beforeAll(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    logSpy.mockRestore();
  });

  it('should allow creating a customer, finding them, and then creating a Communication job for them', async () => {
    
    // --- Phase 1: Create a new Customer ---

    // 1. The professional's app prepares the customer document.
    const resourceCustomer = {
      id: testCustomer1Data.did, // The customer's resolvable DID
      type: 'Contact.Customer',
      meta: {
        claims: {
        [ClaimsPersonSchemaorg.identifier]: testCustomer1Data.urn,
        [ClaimsPersonSchemaorg.givenName]: testCustomer1Data.givenName,
        [ClaimsPersonSchemaorg.familyName]: testCustomer1Data.familyName,
        [ClaimsPersonSchemaorg.email]: testCustomer1Data.email,
        [ClaimsPersonSchemaorg.telephone]: testCustomer1Data.phone,
        [ClaimsPersonSchemaorg.identifierValue]: testCustomer1Data.legalIdValue,
        [ClaimsPersonSchemaorg.identifierType]: testCustomer1Data.legalIdType,
        },
      },
    };

    // 2. The app adds the new customer to the "recents" cache for immediate use.
    directoryManager.addRecentResource(resourceCustomer);

    // --- Phase 2: Find the Customer and Create an Appointment Communication ---

    // 3. The professional searches for the customer by their legal ID in the "recents" cache.
    const foundCustomer = await directoryManager.findRecentResourceBy({
      where: [{ attribute: ClaimsPersonSchemaorg.identifierValue, equals: testCustomer1Data.legalIdValue }],
    });

    // Assert: We found the correct customer.
    expect(foundCustomer).not.toBeNull();
    expect(foundCustomer.id).toBe(testCustomer1Data.did);

    // 4. The app constructs the Communication job using the found customer's data.
    const communicationThid = 'thid-comm-001';
    const appointmentPayload = {
      ...testCommMsgExtAppointmentRequest,
      to: [foundCustomer.id], // Target the found customer
      from: mockProfessionalProfile.did,
      thid: communicationThid,
    };

    await jobManager.createJob({
      thid: communicationThid,
      type: 'Communication',
      to: appointmentPayload.to,
      from: appointmentPayload.from,
      body: appointmentPayload.body,
      serviceId: ServiceIds.HEALTHCARE_COMMUNICATION_BATCH,
    }, {
      section: 'organization',
      format: 'json',
      resourceType: 'communication',
      action: 'create',
    });

    // Assert: A job was saved to the vault with the correct structure.
    expect(mockVault.put).toHaveBeenCalledTimes(1);
    const savedJobArgs = mockVault.put.mock.calls[0];
    const tableName = savedJobArgs[0];
    const savedJobDoc = savedJobArgs[1];
    
    expect(tableName).toBe('jobs');
    expect(savedJobDoc.content.type).toBe('Communication');
    expect(savedJobDoc.thid).toBe(communicationThid);
    expect(savedJobDoc.content.serviceId).toBe(ServiceIds.HEALTHCARE_COMMUNICATION_BATCH);
    expect(savedJobDoc.content.body).toEqual(testCommMsgExtAppointmentRequest.body);
  });
});
