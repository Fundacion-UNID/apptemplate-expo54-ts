// constants/AuthorizationPolicies.js

import { ConsentAction, PurposeOfUse } from './FHIRValueSets';

/**
 * Defines a list of authorization policies, simulating a subject's consents.
 * Each object in the array is a distinct rule or consent grant.
 * This structure is inspired by ODRL and FHIR Consent principles.
 */
export const Policies = [
  // --- Rule 1: Emergency Contact Access ---
  {
    // A human-readable description of the rule's intent.
    id: 'ES-SO_emergency_all_RelatedPerson_access_ETREAT',
    description: 'Allow emergency responders in Soria to access emergency contacts.',
    
    // The actors to whom this rule applies.
    actor: {
      jurisdiction: 'ES-SO', // Soria, Spain
      role: ['5411', '3221', '2211'], // Firefighter, Nurse, Doctor
    },

    // The actions permitted by this rule.
    action: [ConsentAction.ACCESS, ConsentAction.USE],

    // The resource(s) this rule applies to.
    resource: {
      type: 'RelatedPerson',
      // Further filter: only resources where this claim matches.
      filter: {
        claim: 'org.hl7.fhir.api.RelatedPerson.role',
        contains: 'ECON', // Emergency Contact
      }
    },

    // The context or purpose for which the action is allowed.
    purpose: [PurposeOfUse.ETREAT],
  },

  // --- Rule 2: Emergency Medical History Access ---
  {
    id: 'ES-SO_emergency_medical_access_ETREAT',
    description: 'Allow clinical emergency responders to access key medical history.',
    
    actor: {
      jurisdiction: 'ES-SO',
      role: ['3221', '2211'], // Nurse, Doctor (not firefighter)
    },

    action: [ConsentAction.ACCESS],

    resource: {
      // This rule applies to multiple resource types.
      type: ['Immunization', 'AllergyIntolerance', 'Condition'],
    },

    purpose: [PurposeOfUse.ETREAT],
  },
];
