// __tests__/ProfessionalWorkflow.test.js

import ContactManager from '../managers/DirectoryManager';
import JobManager from '../managers/JobManager';
import { ClaimsPersonSchemaorg } from '../constants/Schemas';
import { testCommMsgExtAppointmentRequest } from './data/appointment.data';
import { testCustomer1Data } from './data/identity.data';
import { testOrg1ApiDidWeb } from './data/organization.data';
import { ServiceIds } from '../constants/ServiceIds';

// --- Mocks ---
jest.mock('../database/VaultRepository');
jest.mock('../crypto/DemoAppWallet', () => ({
  protectConfidentialData: jest.fn(doc => Promise.resolve({ ...doc, jwe: {} })),
  protectAttributesForQuery: jest.fn(attrs => Promise.resolve(attrs.map(a => ({ ...a, value: `hmac-of-${a.value}` })))),
}));

// --- Test Data ---
const mockProfessionalProfile = { id: 'professional-profile-id', did: testOrg1ApiDidWeb };


describe('Professional End-to-End Workflow', () => {

  let contactManager;
  let jobManager;
  let vaultPutSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
    
    // Instantiate real managers for this integration test
    contactManager = new ContactManager(mockProfessionalProfile);
    jobManager = new JobManager({ profile: mockProfessionalProfile });

    // Spy on vault.put to see exactly what gets saved
    const VaultRepository = require('../database/VaultRepository').default;
    vaultPutSpy = jest.spyOn(VaultRepository.prototype, 'put');
  });

  it('should allow creating a customer, finding them, and then creating a Communication job for them', async () => {
    
    // --- Phase 1: Create a new Customer ---

    // 1. The professional's app prepares the customer document.
    const unprotectedCustomerDoc = {
      id: testCustomer1Data.did, // The customer's resolvable DID
      type: 'Contact.Customer',
      content: {
        [ClaimsPersonSchemaorg.identifier]: testCustomer1Data.urn,
        [ClaimsPersonSchemaorg.givenName]: testCustomer1Data.givenName,
        [ClaimsPersonSchemaorg.familyName]: testCustomer1Data.familyName,
        [ClaimsPersonSchemaorg.email]: testCustomer1Data.email,
        [ClaimsPersonSchemaorg.telephone]: testCustomer1Data.phone,
        [ClaimsPersonSchemaorg.identifierValue]: testCustomer1Data.legalIdValue,
        [ClaimsPersonSchemaorg.identifierType]: testCustomer1Data.legalIdType,
      },
      indexed: [
        { name: ClaimsPersonSchemaorg.email, value: testCustomer1Data.email },
        { name: ClaimsPersonSchemaorg.identifierValue, value: testCustomer1Data.legalIdValue },
      ],
    };

    // 2. The app adds the new customer to the "recents" cache for immediate use.
    contactManager.addRecentContact(unprotectedCustomerDoc);

    // --- Phase 2: Find the Customer and Create an Appointment Communication ---

    // 3. The professional searches for the customer by their legal ID in the "recents" cache.
    const foundCustomer = await contactManager.findRecentContactBy({
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
    });

    // Assert: A job was saved to the vault with the correct structure.
    expect(vaultPutSpy).toHaveBeenCalledTimes(1);
    const savedJobArgs = vaultPutSpy.mock.calls[0];
    const tableName = savedJobArgs[0];
    const savedJobDoc = savedJobArgs[1];
    
    expect(tableName).toBe('jobs');
    expect(savedJobDoc.type).toBe('Communication');
    expect(savedJobDoc.thid).toBe(communicationThid);
    expect(savedJobDoc.content.serviceId).toBe(ServiceIds.HEALTHCARE_COMMUNICATION_BATCH);
    expect(savedJobDoc.content.body).toEqual(testCommMsgExtAppointmentRequest.body);
  });
});
