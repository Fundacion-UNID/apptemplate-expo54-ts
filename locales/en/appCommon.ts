// locale/en/appCommon.js

export default {
  jobs: {
    title: 'Job Status',
    subtitle: 'View the status of your asynchronous tasks.',
    jobId: 'Job ID: {{id}}',
    status: 'Status: {{status}}',
    moveToDraft: 'Retry',
    noJobsFound: 'No jobs found in your local vault.',
  },
  back: "Back",
  next: "Next",
  cancel: "Cancel",
  exit: "Exit",
  error: "Error",
  unexpectedError: "Unexpected error",
  retry: "Retry",
  goHome: "Go home",
  unknownError: "Unknown error",
  reviewTerms: "Review Terms and Conditions",
  joinWithCode: "Join with code",  
  sendCode: "Send code",
  verifyCode: "Verify code to continue",
  codeRequestFailed: "Could not request code.",
  invalidCode: "Verification failed.",
  continue: "Continue",
  noInternet: "No internet connection",
  workOffline: "Work Offline",
  modals: {
    registration: {
      operatorNotFoundTitle: "Operator not found",
      providerNotFoundTitle: "Provider not found",
      operatorNotFoundWithProvider: "Registration route not found at \"{{provider}}\". You can change operator or continue offline to review the demo.",
      operatorNotFoundGeneric: "Registration route not found for this operator. Change operator or continue offline to review the demo.",
      providerNotFoundWithDid: "Registration route not found for \"{{providerDid}}\". You can change provider or continue offline to review the demo.",
      providerNotFoundGeneric: "Registration route not found for this provider. Change provider or continue offline to review the demo.",
      noOperatorConnection: "No connection to the operator. Change operator or continue offline to review the demo.",
      noProviderConnection: "No connection to the provider. Change provider or continue offline to review the demo.",
      changeOperator: "Change operator",
      changeProvider: "Change provider",
      continueOffline: "Continue offline",
      authRequired: "Authentication is required. Please log in to continue.",
    },
    errors: {
      title: "Error",
      close: "Close",
      missingFields: "Missing required fields.",
    },
  },
  legalName: "Legal name",
  commercialName: "Commercial name",
  shortName: "Short name",
  website: "Website",
  "sector": "Sector",
  "networkRole": "Network Role",
  "identifierType": "Identifier type",
  "identifierValue": "Identifier number",
  "jurisdiction": "Jurisdiction",
  "region": "Region",
  "city": "City",
  "address1": "Address",
  "postalCode": "Postal code",

  "input-email-label": "Email",
  "input-email-placeholder": "e.g. user@example.com",
  "picker-role-label": "Select your role",
  "picker-role-placeholder": "-- Choose Role --",
  "input-code-label": "Code",
  "input-code-placeholder": "Enter verification code",
  "checkbox-acceptTerms-label": "I accept the terms and conditions",
  "checkbox-acceptTerms-placeholder": "You must accept to continue",  

  emergency: "Emergency",
  care: "Care",
  insurance: "Insurance",
  payment: "Payment",
  invoice: "Invoice",
  notification: "Notification",
  reminder: "Reminder",
  appointment: "Appointment",
  instruction: "Instruction",
  alert: "Alert",

  communications: "Communications",
  groupsLabel: "Groups",
  contacts: "Contacts",
  drafts: "Drafts",
  inbox: "Received",
  sent: "Sent",
  sync: "Sync",

  subject: {
      family: "Family",
      organization: "Organization"
  },  
  auth: {
    title: "Authentication",
    subtitle: "Log in or register",
    description: "",
    login: "Login",
    register: "Register",
  },
  landing: {
    title: "Welcome",
    subtitle: "Select one option to continue",
    description: "Choose Family or Organization"
  },
  register: {
    create: "Create a new one",
    joinWithCode: "Join with code",
    createNewFamily: "Create new family",
  },
  profileSelect: {
    title: "Select profile",
    subtitle: "Choose one of your saved profiles",
    tenantId: "Tenant ID",
    provider: "Provider",
    lastUsed: "Last used: {{date}}",
    addProfile: "Add profile",
    emptyFamily: "No family profiles found for this account.",
    emptyOrganization: "No organization profiles found for this account.",
  },

  screens: {
    activateDevice: {
      title: "Activate device",
      subtitle: "Enter the activation code to enable this device.",
      placeholder: "Activation code",
      label: "Activation code",
      hint: "Enter the code you received to activate this device.",
      button: "Activate device",
      successTitle: "Device activated",
      successMessage: "Your device is now active.",
    },
  },

  groups: {
    "grid": "Connections grid",
    "card": "Group",
    "searchCardLabel": "Search and create connection",
    "searchTitle": "Search",
    "searchPlaceholder": "Search connections or groups",
    "searchInput": "Search input",
    "clearSearch": "Clear search",
    "searchAction": "Run search",
    "addConnection": "Add new connection",
    "searchHelp": "Search services or groups. Use + to add a new connection."
  },
  "unifiedID": {
    "manageTitle": "Manage Unified ID",
    "registerButton": "Register Unified Index",
    "addEvidenceButton": "Add Evidence to Identity",
    "editRules": "View Rules",
    "editRelatedPersons": "Edit Related Persons"
  },
  "pickers": {
    "select": "-- Select --",
    "legalIdTypes": {
      "TAX": "TAX ID Number",
      "EI": "Employer Number",
    },
    "sectors": {
      "emergency": "Emergency",
      "health-care": "Healthcare",
      "health-insurance": "Health Insurance",
      "health-tech": "Health Tech",
      "health-it": "Health IT",
      "research": "Research"
    },
    "networkRoles": {
      "provider": "Provider",
      "data-reader": "Data Reader"
    }
  },
  "forms": {
    "tabs": {
      "digitalCertificate": "Digital Certificate",
      "verificationCode": "Verification Code"
    },
    "withCert": "With digital certificate",
    "noCert": "Without digital certificate",
    "attachTerms": "Attach Terms & Conditions (PDF)",
    "officialName": "Official Name",
    "officialNamePlaceholder": "Enter official name",
    "lastName": "Last Name",
    "lastNamePlaceholder": "Enter last name",
    "secondLastName": "Second Last Name (Optional)",
    "secondLastNamePlaceholder": "Enter second last name",
    "jurisdiction": "Jurisdiction",
    "jurisdictionPlaceholder": "-- Select --",
    "addressRegion": "Region",
    "addressRegionPlaceholder": "Enter region",
    "identifierType": "Identifier Type",
    "identifierTypePlaceholder": "-- Select --",
    "identifierNumber": "Identifier Number",
    "identifierNumberPlaceholder": "Enter identifier number",
    "phone": "Phone (Optional)",
    "phonePlaceholder": "With international prefix",
    "orSeparator": "- or -",
    "emailHint": "Enter an email, or use the phone field instead.",
    "phoneHint": "Enter a phone number with country code, or use the email field instead.",
    "docTypeLabel": "Document Type",
    "identifierTypeLabels": {
      "did-web": "Unified Global Identifier",
      "dl": "Driver's License",
      "jhn": "Regional Health Number",
      "pi": "Patient Internal Identifier",
      "mb": "Member Number (Health Insurance)",
      "visa": "VISA",
      "wp": "Work Permit",
      "sp": "Student Permit",
      "dr": "Donor Registration Number",
      "ppn": "Passport",
      "nn": "National ID"
    },
    "attachProof": "Attach Proof of Identity",
    "signatureTypeLabel": "Document Signature Type:"
  },

  /* not needed 
  dashboard: {
    consents: "Consents",
    appointments: "Appointments"
  },

  identityMenu: {
    title: "Identity Management",
    subtitle: "Manage identifiers and credentials"
  },

  identity: {
    shareId: "Share My ID / QR",
    linkIdentifiers: "Link individual's identifiers",
    issueCredential: "Issue individual's credential",
    readIdentity: "Read identity"
  },

  documents: {
    selectSubject: "Select subject / Scan ID",
    scanId: "Scan ID",
    indexSections: "Navigate index & sections",
    addDocument: "Add document",
    summaryRecords: "Summary of records"
  },

  communications: {
    create: "Create communication",
    inbox: "Inbox",
    sent: "Sent",
    drafts: "Drafts",
    outbox: "Outbox"
  },
  */

  "notifications": {
    "jobComplete": {
      "title": "Task Complete",
      "message": "A background task has finished successfully.",
      "viewButton": "View Results",
      "dismissButton": "Dismiss"
    }
  },

  "components": {
    "accessibilityBar": {
      "viewJobs": "View jobs status",
      "toggleTheme": "Switch to {theme} mode",
      "cycleSize": "Cycle text size",
      "toggleLang": "Switch to {lang}"
    },
    "jobsStatusModal": {
      "title": "Jobs Status",
      "close": "Close modal",
      "pending": "Pending",
      "finished": "Finished",
      "noPendingJobs": "No pending jobs.",
      "noFinishedJobs": "No finished jobs.",
      "jobId": "Job: {id}",
      "status": "Status: {status}"
    }
  }
};
