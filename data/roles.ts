// utils/roles.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

export const dataRolesInSectorsEN = [
  {
    type: "healthcare",
    attributes: {
      "org.hl7.codesystem.v2-0360.EMTP": "Emergency Medical Technician",
      "org.hl7.codesystem.v2-0360.PH": "Physician",
      "org.hl7.codesystem.v2-0360.NP": "Nurse Practitioner",
      "org.hl7.codesystem.v2-0360.RN": "Registered Nurse",
      "org.hl7.codesystem.v2-0360.PHAR": "Pharmacist"
    }
  },
  {
    type: "education",
    attributes: {
      "org.isco.isco08.2341": "Primary School Teacher",
      "org.isco.isco08.2330": "Secondary School Teacher",
      "org.isco.isco08.2359": "Education Methods Specialist",
      "org.isco.isco08.3340": "Teaching Assistant"
    }
  },
  {
    type: "finance",
    attributes: {
      "org.isco.isco08.2411": "Accountant",
      "org.isco.isco08.2412": "Financial Analyst",
      "org.isco.isco08.3313": "Bookkeeper",
      "org.isco.isco08.3311": "Securities Clerk"
    }
  },
  {
    type: "legal",
    attributes: {
      "org.isco.isco08.2611": "Lawyer",
      "org.isco.isco08.2619": "Legal Professional Not Elsewhere Classified",
      "org.isco.isco08.3411": "Legal Clerk",
      "org.isco.isco08.3342": "Court Clerk"
    }
  }
];
