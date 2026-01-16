// locales/en/index.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import appCommon from './appCommon';
import appFamily from './appFamily';
import appOrganization from './appOrganization';

import loinc from './loinc';
import roles from './roles';
import professionalTypes from './hl7';
import sectors from './sectors';
import sections from './sections';

const translations = {
    'org.loinc': loinc,
    'org.hl7.terminology.CodeSystem.v2-0360': professionalTypes,
    ...sectors,
    ...sections,
    ...roles, // org.isco,isco-08.<role>-<label|description>
    common: { ...appCommon },
    ...appCommon,
    family: { ...appFamily },
    organization: { ...appOrganization }
};

export default translations;


/*
import appCommon from './appCommon'; // by default, then specific entity Type translations can be loaded (appFamily, appOrganization) 
import appFamily from './appFamily';
import appOrganization from './appOrganization';

// Namespaced dictionaries
import loinc from './loinc'; // e.g., { "48765-2": "Allergies", ... }
import professionalTypes from './hl7'; // e.g., { "EMTP": "Paramedic", ... }

// Flat key translations (not nested)
// e.g., { "fin.quarterly-draft": "Quarterly Financial Drafts", "education": "Education & Training" }
import sectors from './sectors'; // old
import sections from './sections'; // new

// Combine everything into a single object
// Namespaced entries like "org.loinc" will be flattened later
const translations = {
  "org.loinc": loinc,
  "org.hl7.terminology.CodeSystem.v2-0360": professionalTypes,

  // Directly spread flat key-value pairs
  ...sectors,
  ...sections,
  ... appCommon,
  family: {...appFamily},
  organization: {...appOrganization}
};

export default translations;
*/
