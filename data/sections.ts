// utils/sections.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

export const medicalHistoryClassification = {
  // ips: "60591-5",
  allergies: "48765-2",
  vitalSigns: "8716-3",
  problemList: "11450-4",
  pastProblems: "11348-0",
  familyDiseases: "10157-6",
  medication: "10160-0",
  immunization: "11369-6",
  procedures: "47519-4",
  diet: "61144-2",
  diagnosticResults: "30954-2",
  radiologyStudies: "18726-0",
  medicalDevices: "46264-8",
  socialHistory: "29762-2",
  mentalStatus: "10190-7",
  functionalStatus: "47420-5",
  planOfCare: "18776-5",
  pregnancy: "82810-3",
  symptoms: "10187-3",
  insuranceCoverage: "87520-3",
  advanceDirectives: "42348-3",
  defaultMedicalRecords: '11503-0'
};

// it is used for i18n in pickers and checkboxes
export const dataSections = [
  {
    type: "healthcare",
    attributes: medicalHistoryClassification,
    roles: [
      "org.hl7.codesystem.v2-0360.EMTP", // "Emergency Medical Technician",
      "org.hl7.codesystem.v2-0360.PH", // "Physician",
      "org.hl7.codesystem.v2-0360.NP", // "Nurse Practitioner",
      "org.hl7.codesystem.v2-0360.RN", // "Registered Nurse",
      "org.hl7.codesystem.v2-0360.PHAR", // "Pharmacist"
    ]
  },
  {
    type: "finance",
    attributes: {
      "quarterly-draft": "fin.quarterly-draft",
      "annual-statement": "fin.annual-statement",
      "invoice": "fin.invoice",
      "payment-receipt": "fin.payment-receipt",
      "payroll": "fin.payroll",
      "bank-statement": "fin.bank-statement",
      "tax-declaration": "fin.tax-declaration",
      "proof-income": "fin.proof-income",
      "expense-report": "fin.expense-report",
      "loan-agreement": "fin.loan-agreement"
    },
    roles: [
      "org.isco.isco08.2411", //  "Accountant",
      "org.isco.isco08.2412", // "Financial Analyst",
      "org.isco.isco08.3313", //  "Bookkeeper",
      "org.isco.isco08.3311", // "Securities Clerk"
    ]
  },
  {
    type: "legal",
    attributes: {
      "contract": "legal.contract",
      "poa": "legal.poa",
      "gov-correspondence": "legal.gov-correspondence",
      "litigation": "legal.litigation",
      "notarized-doc": "legal.notarized-doc",
      "birth-death-cert": "legal.birth-death-cert",
      "proof-residency": "legal.proof-residency",
      "legal-auth": "legal.legal-auth",
      "compliance-report": "legal.compliance-report",
      "terms": "legal.terms"
    },
    roles: [
      "org.isco.isco08.2611", // "Lawyer",
      "org.isco.isco08.2619", // "Legal Professional Not Elsewhere Classified",
      "org.isco.isco08.3411", // "Legal Clerk",
      "org.isco.isco08.3342", // "Court Clerk"
    ]

  },
  {
    type: "education",
    attributes: {
      "student-id": "edu.student-id",
      "transcript": "edu.transcript",
      "course-enrollment": "edu.course-enrollment",
      "diploma": "edu.diploma",
      "attendance": "edu.attendance",
      "exam-results": "edu.exam-results",
      "tutor-report": "edu.tutor-report",
      "field-trip-consent": "edu.field-trip-consent",
      "guardian-permission": "edu.guardian-permission",
      "training-completion": "edu.training-completion"
    },
    roles: [
      "org.isco.isco08.2341", // "Primary School Teacher",
      "org.isco.isco08.2330", // "Secondary School Teacher",
      "org.isco.isco08.2359", // "Education Methods Specialist",
      "org.isco.isco08.3340", // "Teaching Assistant"
    ]
  },
  {
    type: "identity",
    attributes: {
      "national-id": "id.national-id",
      "proof-address": "id.proof-address",
      "residency-permit": "id.residency-permit",
      "driver-license": "id.driver-license",
      "voter-registration": "id.voter-registration",
      "immigration-doc": "id.immigration-doc",
      "emergency-contact": "id.emergency-contact",
      "disability-cert": "id.disability-cert",
      "marriage-divorce": "id.marriage-divorce",
      "photo-biometric": "id.photo-biometric"
    }
  },
  {
    type: "organization",
    attributes: {
      "articles-incorporation": "org.articles-incorporation",
      "company-bylaws": "org.company-bylaws",
      "board-resolutions": "org.board-resolutions",
      "shareholder-records": "org.shareholder-records",
      "staff-roles": "org.staff-roles",
      "business-license": "org.business-license",
      "esg-report": "org.esg-report",
      "compliance-cert": "org.compliance-cert",
      "internal-memos": "org.internal-memos",
      "partner-agreements": "org.partner-agreements"
    }
  },
  {
    type: "veterinary",
    attributes: {
      "vaccination-record": "vet.vaccination-record",
      "pedigree-cert": "vet.pedigree-cert",
      "ownership-transfer": "vet.ownership-transfer",
      "health-check": "vet.health-check",
      "microchip-data": "vet.microchip-data",
      "treatment-history": "vet.treatment-history",
      "breeding-permit": "vet.breeding-permit",
      "feeding-instructions": "vet.feeding-instructions",
      "insurance-policy": "vet.insurance-policy",
      "export-doc": "vet.export-doc"
    }
  },
  {
    type: "infrastructure",
    attributes: {
      "vehicle-registration": "infra.vehicle-registration",
      "service-logs": "infra.service-logs",
      "blueprints": "infra.blueprints",
      "inspection-report": "infra.inspection-report",
      "repair-order": "infra.repair-order",
      "rental-agreement": "infra.rental-agreement",
      "hazardous-disclosure": "infra.hazardous-disclosure",
      "energy-certificate": "infra.energy-certificate",
      "manuals": "infra.manuals",
      "iot-permissions": "infra.iot-permissions"
    }
  }
  /*
  {
    type: "healthcare",
    attributes: medicalHistoryClassification,
  } 
  */ 
];
