// constants/ServiceIds.js

/**
 * @description Defines the standardized serviceId strings used to identify
 * specific backend service endpoints. Using this enum-like object prevents
 * typos and keeps service identifiers consistent across the application.
 *
 * The format is generally: 'v{version}_{sector}_{context}_{format}_{resource}_{action}'
 */
export const ServiceIds = {
  /**
   * @description Service for submitting evidence for a Person resource.
   * The "_batch" suffix indicates that the service can accept multiple entries.
   * In our architecture, this is used to submit different pieces of evidence for a
   * SINGLE individual over time (e.g., 1. Signed ToS, 2. Verified ID, 3. VC).
   * It is NOT for creating multiple individuals in one call.
   */
  HEALTHCARE_CUSTOMERID_BATCH: 'v1_health-care_individual_org.schema_Person_batch',
  HEALTHCARE_COMMUNICATION_BATCH: 'v1_health-care_individual_api_Communication_batch',
  
  // Add other service IDs here as they are defined in the service locator.
};
