// context/RulesProvider.js
import React, { createContext, useContext, useMemo } from 'react';
import { useAuthorization } from './AuthorizationContext';
import { Policies } from '../constants/AuthorizationPolicies';

const RulesContext = createContext(null);

/**
 * This Provider acts as a Policy Enforcement Point (PEP). It interprets a list
 * of consent policies (from AuthorizationPolicies.js) to determine what a user
 * is allowed to see or do, based on the subject's consent.
 *
 * It works in tandem with the AuthorizationProvider:
 * - AuthorizationProvider: Checks what a professional CAN do based on their role.
 * - RulesProvider: Checks what a professional IS ALLOWED to do based on subject consent.
 */
export const RulesProvider = ({ children }) => {
  const { getRole, getJurisdiction } = useAuthorization();

  const rulesInterface = useMemo(() => {
    
    /**
     * Finds the first policy that grants a specific action for a given resource and purpose.
     * @param {string} action - The action being requested (e.g., 'access').
     * @param {string} resourceType - The type of resource (e.g., 'RelatedPerson').
     * @param {string} purpose - The reason for the request (e.g., 'ETREAT').
     * @returns {object|null} The matching policy object or null if no consent is found.
     */
    const findConsentPolicy = (action, resourceType, purpose) => {
      const professionalRole = getRole();
      const professionalJurisdiction = getJurisdiction();

      if (!professionalRole || !professionalJurisdiction) return null;

      return Policies.find(policy => 
        policy.action.includes(action) &&
        policy.purpose.includes(purpose) &&
        (Array.isArray(policy.resource.type) ? policy.resource.type.includes(resourceType) : policy.resource.type === resourceType) &&
        policy.actor.role.includes(professionalRole) &&
        policy.actor.jurisdiction === professionalJurisdiction
      );
    };

    /**
     * Applies consent rules to filter a list of in-memory Resource Objects.
     * @param {Array<object>} resources - The list of resources to filter.
     * @param {string} resourceType - The type of resource in the list.
     * @param {string} purpose - The purpose of use for the data access.
     * @returns {Array<object>} The filtered list of resources.
     */
    const filterResourcesByConsent = (resources, resourceType, purpose = 'default') => {
      const policy = findConsentPolicy('access', resourceType, purpose);

      // If no policy grants access, return nothing.
      if (!policy) {
        return [];
      }

      // If a policy exists but has no extra filter, return all resources.
      if (!policy.resource.filter) {
        return resources;
      }

      // If a filter exists, apply it.
      const { claim, contains } = policy.resource.filter;
      return resources.filter(resource => {
        const claimValue = resource.meta?.claims?.[claim];
        if (typeof claimValue === 'string') {
          return claimValue.split(',').map(s => s.trim()).includes(contains);
        }
        return false;
      });
    };

    return { findConsentPolicy, filterResourcesByConsent };
  }, [getRole, getJurisdiction]);

  return (
    <RulesContext.Provider value={rulesInterface}>
      {children}
    </RulesContext.Provider>
  );
};

export const useRules = () => useContext(RulesContext);
