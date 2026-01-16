// constants/FHIRValueSets.js

/**
 * Defines standard codes from HL7 FHIR ValueSets.
 * Using these constants prevents typos and centralizes the vocabulary.
 */

/**
 * @see https://www.hl7.org/fhir/valueset-consent-action.html
 */
export const ConsentAction = {
  COLLECT: 'collect',
  ACCESS: 'access',
  USE: 'use',
  DISCLOSE: 'disclose',
  CORRECT: 'correct',
};

/**
 * @see https://terminology.hl7.org/5.1.0/ValueSet-v3-PurposeOfUse.html
 */
export const PurposeOfUse = {
  /** Emergency Treatment */
  ETREAT: 'ETREAT',
  /** Care Management */
  CAREMGT: 'CAREMGT',
  // ... add other purposes as needed
};
