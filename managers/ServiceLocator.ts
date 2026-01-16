// managers/ServiceLocator.js

// This would eventually fetch and cache a DID Document.
// For the demo, it holds a hardcoded map.
const serviceEndpoints = {
  'v1_health-care_test-network_org.schema_Person_discovery': 'https://api.acme.org/test-network/org.schema/Person/_discovery',
  // ... other service endpoints can be added here
};

const ServiceLocator = {
  getServiceEndpoint: async (serviceId) => {
    console.log(`[ServiceLocator] Resolving service ID: ${serviceId}`);
    const endpoint = serviceEndpoints[serviceId];
    if (!endpoint) {
      throw new Error(`Service endpoint not found for ID: ${serviceId}`);
    }
    return endpoint;
  }
};

export default ServiceLocator;
