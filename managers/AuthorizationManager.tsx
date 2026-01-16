// managers/AuthorizationManager.js

import { Policies } from '../constants/AuthorizationPolicies';

/**
 * Manages authorization logic based on semantic URNs. It acts as a 
 * Policy Decision Point (PDP) by parsing URNs to extract jurisdiction and 
 * role, then checking them against a defined set of policies.
 */
class AuthorizationManager {
  private urn: string;
  private parsedUrn: { jurisdiction: string | null; sector: string | null; role: string | null };
  /**
   * @param {string} professionalUrn - The full semantic URN of the logged-in professional.
   */
  constructor(professionalUrn: string) {
    if (!professionalUrn) {
      throw new Error('AuthorizationManager requires a professional URN.');
    }
    this.urn = professionalUrn;
    this.parsedUrn = this._parseUrn(professionalUrn);
  }

  /**
   * A simple URN parser to extract key segments.
   * Example URN: urn:unid:test-network:cds-es:v1:health-care:entity:alternatename:acme:connection:uuid:<uuid>:employee:doctor@hospital.example.com:role:isco-08|2211
   * @private
   */
  _parseUrn(urn: string) {
    const parts = urn.split(':');
    const jurisdiction = parts[3]; // e.g., 'cds-es'
    const sector = parts[5]; // e.g., 'health-care'
    
    let role = null;
    const roleSegment = parts.find(p => p === 'role');
    if (roleSegment) {
      const roleIndex = parts.indexOf(roleSegment);
      if (parts[roleIndex + 1] === 'isco-08') {
        role = parts[roleIndex + 2];
      }
    }
    
    return { jurisdiction, sector, role };
  }

  /**
   * @returns {string|null} The jurisdiction (e.g., 'cds-es') from the URN.
   */
  getJurisdiction(): string | null {
    return this.parsedUrn.jurisdiction;
  }
  
  /**
   * @returns {string|null} The business sector (e.g., 'health-care') from the URN.
   */
  getSector(): string | null {
    return this.parsedUrn.sector;
  }

  /**
   * @returns {string|null} The ISCO-08 role code from the URN.
   */
  getRole(): string | null {
    return this.parsedUrn.role;
  }

  /**
   * The core of the policy engine. Determines if the user can perform an action on a resource.
   * This is our Policy Decision Point (PDP).
   * @param {string} action - The action to perform (e.g., 'create', 'read', 'prescribe').
   * @param {string} resourceType - The type of resource (e.g., 'Appointment', 'Medication').
   * @returns {boolean} True if the action is permitted, false otherwise.
   */
  can(action: string, resourceType: string) {
    const { jurisdiction, role } = this.parsedUrn;
    if (!jurisdiction || !role) return false;

    // Get the specific policy for the jurisdiction and role, if it exists.
    const specificPolicy = Policies[jurisdiction]?.[role]?.[resourceType] || [];
    
    // Get the fallback wildcard policy for the role.
    const wildcardPolicy = Policies['*']?.[role]?.[resourceType] || [];

    // The user has permission if the action is in either the specific or wildcard policy set.
    // Using a Set prevents duplicates and gives fast lookups.
    const allowedActions = new Set([...wildcardPolicy, ...specificPolicy]);
    
    return allowedActions.has(action);
  }

  /**
   * Gets the list of document types the professional is allowed to create,
   * derived directly from the authorization policies.
   * @returns {Array<string>} A list of permitted document type names for creation.
   */
  getAllowedDocumentTypesForCreation() {
    const { jurisdiction, role } = this.parsedUrn;
    if (!jurisdiction || !role) return [];

    // 1. Get policies for the wildcard jurisdiction
    const wildcardRolePolicy = Policies['*']?.[role] || {};
    
    // 2. Get policies for the specific jurisdiction
    const specificRolePolicy = Policies[jurisdiction]?.[role] || {};

    // 3. Merge them, with specific policies overriding wildcard policies.
    const finalPolicy = { ...wildcardRolePolicy, ...specificRolePolicy };

    // 4. Iterate over the final policy and find all resources where 'create' is allowed.
    const allowedTypes = [];
    for (const resourceType in finalPolicy) {
      // We must check the merged policy for the 'create' action.
      if (this.can('create', resourceType)) {
        allowedTypes.push(resourceType);
      }
    }
    
    return [...new Set(allowedTypes)]; // Return unique types
  }
}

export default AuthorizationManager;
