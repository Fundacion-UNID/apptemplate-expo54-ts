// utils/sectors.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

export const dataSectors = [
  {
    type: "healthcare",
    sections: [
        "healthcare.48765-2", // Allergies",
        "healthcare.8716-3", // Vital Signs",
        "healthcare.11450-4", // Problem List",
        "healthcare.11348-0", // Past Problems",
        "healthcare.10157-6", // Family Diseases",
        "healthcare.10160-0", // Medication",
        "healthcare.11369-6", // Immunization",
        "healthcare.47519-4", // Procedures",
        "healthcare.61144-2", // Diet",
        "healthcare.30954-2", // Diagnostic Results",
        "healthcare.18726-0", // Radiology Studies",
        "healthcare.46264-8", // Medical Devices",
        "healthcare.29762-2", // Social History",
        "healthcare.10190-7", // Mental Status",
        "healthcare.47420-5", // Functional Status",
        "healthcare.18776-5", // Plan of Care",
        "healthcare.82810-3", // Pregnancy",
        "healthcare.10187-3", // Symptoms",
        "healthcare.87520-3", // Insurance Coverage",
        "healthcare.42348-3", // Advance Directives",
        "healthcare.11503-0", // Default Medical Records" 
    ],
    roles: [
      "org.hl7.codesystem.v2-0360.EMTP", // Emergency Medical Technician
      "org.hl7.codesystem.v2-0360.PH",   // Physician
      "org.hl7.codesystem.v2-0360.NP",   // Nurse Practitioner
      "org.hl7.codesystem.v2-0360.RN",   // Registered Nurse
      "org.hl7.codesystem.v2-0360.PHAR"  // Pharmacist
    ]
  },
  {
    type: "finance",
    sections: [
      "quarterly-draft",
      "annual-statement",
      "invoice",
      "payment-receipt",
      "payroll",
      "bank-statement",
      "tax-declaration",
      "proof-income",
      "expense-report",
      "loan-agreement"
    ],
    roles: [
      "org.isco.isco08.2411", // Accountant
      "org.isco.isco08.2412", // Financial Analyst
      "org.isco.isco08.3313", // Bookkeeper
      "org.isco.isco08.3311"  // Securities Clerk
    ]
  },
  {
    type: "legal",
    sections: [
      "contract",
      "poa",
      "gov-correspondence",
      "litigation",
      "notarized-doc",
      "birth-death-cert",
      "proof-residency",
      "legal-auth",
      "compliance-report",
      "terms"
    ],
    roles: [
      "org.isco.isco08.2611", // Lawyer
      "org.isco.isco08.2619", // Legal Professional NEC
      "org.isco.isco08.3411", // Legal Clerk
      "org.isco.isco08.3342"  // Court Clerk
    ]
  },
  {
    type: "education",
    sections: [
      "student-id",
      "transcript",
      "course-enrollment",
      "diploma",
      "attendance",
      "exam-results",
      "tutor-report",
      "field-trip-consent",
      "guardian-permission",
      "training-completion"
    ],
    roles: [
      "org.isco.isco08.2341", // Primary School Teacher
      "org.isco.isco08.2330", // Secondary School Teacher
      "org.isco.isco08.2359", // Education Methods Specialist
      "org.isco.isco08.3340"  // Teaching Assistant
    ]
  },
  {
    type: "identity",
    sections: [
      "national-id",
      "proof-address",
      "residency-permit",
      "driver-license",
      "voter-registration",
      "immigration-doc",
      "emergency-contact",
      "disability-cert",
      "marriage-divorce",
      "photo-biometric"
    ]
  },
  {
    type: "organization",
    sections: [
      "articles-incorporation",
      "company-bylaws",
      "board-resolutions",
      "shareholder-records",
      "staff-roles",
      "business-license",
      "esg-report",
      "compliance-cert",
      "internal-memos",
      "partner-agreements"
    ]
  },
  {
    type: "veterinary",
    sections: [
      "vaccination-record",
      "pedigree-cert",
      "ownership-transfer",
      "health-check",
      "microchip-data",
      "treatment-history",
      "breeding-permit",
      "feeding-instructions",
      "insurance-policy",
      "export-doc"
    ]
  },
  {
    type: "infrastructure",
    sections: [
      "vehicle-registration",
      "service-logs",
      "blueprints",
      "inspection-report",
      "repair-order",
      "rental-agreement",
      "hazardous-disclosure",
      "energy-certificate",
      "manuals",
      "iot-permissions"
    ]
  }
];

export const i18sectionsEN = {
  "healthcare.48765-2": "Allergies",
  "healthcare.8716-3": "Vital Signs",
  "healthcare.11450-4": "Problem List",
  "healthcare.11348-0": "Past Problems",
  "healthcare.10157-6": "Family Diseases",
  "healthcare.10160-0": "Medication",
  "healthcare.11369-6": "Immunization",
  "healthcare.47519-4": "Procedures",
  "healthcare.61144-2": "Diet",
  "healthcare.30954-2": "Diagnostic Results",
  "healthcare.18726-0": "Radiology Studies",
  "healthcare.46264-8": "Medical Devices",
  "healthcare.29762-2": "Social History",
  "healthcare.10190-7": "Mental Status",
  "healthcare.47420-5": "Functional Status",
  "healthcare.18776-5": "Plan of Care",
  "healthcare.82810-3": "Pregnancy",
  "healthcare.10187-3": "Symptoms",
  "healthcare.87520-3": "Insurance Coverage",
  "healthcare.42348-3": "Advance Directives",
  "healthcare.11503-0": "Default Medical Records",
  "finance.invoice": "Invoice",
  "finance.payroll": "Payroll",
  "finance.tax-declaration": "Tax Declaration",
  "finance.bank-statement": "Bank Statement",
  "finance.loan-agreement": "Loan Agreement",
  "finance.expense-report": "Expense Report",
  "finance.annual-statement": "Annual Statement",
  "finance.quarterly-draft": "Quarterly Draft",
  "finance.payment-receipt": "Payment Receipt",
  "finance.proof-income": "Proof of Income",
  "legal.contract": "Contract",
  "legal.poa": "Power of Attorney",
  "legal.gov-correspondence": "Government Correspondence",
  "legal.litigation": "Litigation",
  "legal.notarized-doc": "Notarized Document",
  "legal.birth-death-cert": "Birth/Death Certificate",
  "legal.proof-residency": "Proof of Residency",
  "legal.legal-auth": "Legal Authorization",
  "legal.compliance-report": "Compliance Report",
  "legal.terms": "Terms and Conditions",
  "education.student-id": "Student ID",
  "education.transcript": "Transcript",
  "education.course-enrollment": "Course Enrollment",
  "education.diploma": "Diploma",
  "education.attendance": "Attendance Record",
  "education.exam-results": "Exam Results",
  "education.tutor-report": "Tutor Report",
  "education.field-trip-consent": "Field Trip Consent",
  "education.guardian-permission": "Guardian Permission",
  "education.training-completion": "Training Completion",
  "identity.national-id": "National ID",
  "identity.proof-address": "Proof of Address",
  "identity.residency-permit": "Residency Permit",
  "identity.driver-license": "Driver’s License",
  "identity.voter-registration": "Voter Registration",
  "identity.immigration-doc": "Immigration Document",
  "identity.emergency-contact": "Emergency Contact",
  "identity.disability-cert": "Disability Certificate",
  "identity.marriage-divorce": "Marriage/Divorce Certificate",
  "identity.photo-biometric": "Photo or Biometric Data",
  "organization.articles-incorporation": "Articles of Incorporation",
  "organization.company-bylaws": "Company Bylaws",
  "organization.board-resolutions": "Board Resolutions",
  "organization.shareholder-records": "Shareholder Records",
  "organization.staff-roles": "Staff Roles",
  "organization.business-license": "Business License",
  "organization.esg-report": "ESG Report",
  "organization.compliance-cert": "Compliance Certificate",
  "organization.internal-memos": "Internal Memos",
  "organization.partner-agreements": "Partner Agreements",
  "veterinary.vaccination-record": "Vaccination Record",
  "veterinary.pedigree-cert": "Pedigree Certificate",
  "veterinary.ownership-transfer": "Ownership Transfer",
  "veterinary.health-check": "Health Check",
  "veterinary.microchip-data": "Microchip Data",
  "veterinary.treatment-history": "Treatment History",
  "veterinary.breeding-permit": "Breeding Permit",
  "veterinary.feeding-instructions": "Feeding Instructions",
  "veterinary.insurance-policy": "Insurance Policy",
  "veterinary.export-doc": "Export Documentation",
  "infrastructure.vehicle-registration": "Vehicle Registration",
  "infrastructure.service-logs": "Service Logs",
  "infrastructure.blueprints": "Blueprints",
  "infrastructure.inspection-report": "Inspection Report",
  "infrastructure.repair-order": "Repair Order",
  "infrastructure.rental-agreement": "Rental Agreement",
  "infrastructure.hazardous-disclosure": "Hazardous Material Disclosure",
  "infrastructure.energy-certificate": "Energy Certificate",
  "infrastructure.manuals": "User Manuals",
  "infrastructure.iot-permissions": "IoT Permissions"
}

export const i18rolesEN = {
  "org.hl7.codesystem.v2-0360.EMTP": "Emergency Medical Technician",
  "org.hl7.codesystem.v2-0360.PH": "Physician",
  "org.hl7.codesystem.v2-0360.NP": "Nurse Practitioner",
  "org.hl7.codesystem.v2-0360.RN": "Registered Nurse",
  "org.hl7.codesystem.v2-0360.PHAR": "Pharmacist",
  "org.isco.isco08.2411": "Accountant",
  "org.isco.isco08.2412": "Financial Analyst",
  "org.isco.isco08.3313": "Bookkeeper",
  "org.isco.isco08.3311": "Securities Clerk",
  "org.isco.isco08.2611": "Lawyer",
  "org.isco.isco08.2619": "Legal Professional Not Elsewhere Classified",
  "org.isco.isco08.3411": "Legal Clerk",
  "org.isco.isco08.3342": "Court Clerk",
  "org.isco.isco08.2341": "Primary School Teacher",
  "org.isco.isco08.2330": "Secondary School Teacher",
  "org.isco.isco08.2359": "Education Methods Specialist",
  "org.isco.isco08.3340": "Teaching Assistant"
}


