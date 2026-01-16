// __tests__/data/employee.data.js

import { ClaimsPersonSchemaorg } from '../../constants/Schemas';
import * as Crypto from 'expo-crypto';

// This is the flat reverse-DNS claims structure for a new employee.
// This is the object that will be inside the "claims" property.
export const NEW_EMPLOYEE_CLAIMS = {
  [ClaimsPersonSchemaorg.identifier]: `urn:uuid:${Crypto.randomUUID()}`,
  [ClaimsPersonSchemaorg.email]: 'test.employee@acme.org',
  'org.schema.Person.hasOccupation': 'org.isco.isco-08.1219', // Example role
  'org.schema.Person.memberOf': 'did:web:acme.org:group:admins'
};

// This represents the full "data" entry for a new employee.
export const NEW_EMPLOYEE_DATA_ENTRY = {
  "type": "Employee-registration-form-v1.0",
  "meta": {
    "claims": NEW_EMPLOYEE_CLAIMS
  }
};

// This represents the initial state of a draft job's BODY, containing one employee.
export const DRAFT_EMPLOYEES_BODY_INITIAL = {
  "data": [NEW_EMPLOYEE_DATA_ENTRY]
};

// --- For the update test ---

export const ANOTHER_EMPLOYEE_CLAIMS = {
    [ClaimsPersonSchemaorg.identifier]: `urn:uuid:${Crypto.randomUUID()}`,
    [ClaimsPersonSchemaorg.email]: 'another.employee@acme.org',
    'org.schema.Person.hasOccupation': 'org.isco.isco-08.3343',
    'org.schema.Person.memberOf': []
};

export const ANOTHER_EMPLOYEE_DATA_ENTRY = {
    "type": "Employee-registration-form-v1.0",
    "meta": {
      "claims": ANOTHER_EMPLOYEE_CLAIMS
    }
};

// This represents the updated state of a draft job's BODY.
export const DRAFT_EMPLOYEES_BODY_UPDATED = {
  "data": [NEW_EMPLOYEE_DATA_ENTRY, ANOTHER_EMPLOYEE_DATA_ENTRY]
};
