// __tests__/data/didProvider.data.ts

/**
 * A mock DID Document for the gateway provider.
 * This is the single source of truth for testing DID resolution.
 */
export const gatewayDid = 'did:web:gateway.example.com';

export const mockGatewayDidDocument = {
  '@context': 'https://www.w3.org/ns/did/v1',
  id: gatewayDid,
  service: [
    {
      id: `${gatewayDid}#v1:test:registry:org.schema:Organization:_batch`,
      type: 'GatewayAPI',
      serviceEndpoint: 'https://gateway.example.com/test/registry/org.schema/Organization/_batch',
    },
    {
      id: `${gatewayDid}#profile-registration-v1`,
      type: 'ProfileRegistration',
      serviceEndpoint: 'https://gateway.example.com/test/profiles/register-device',
    },
    // Add other mock service endpoints here as needed for tests
  ],
};
