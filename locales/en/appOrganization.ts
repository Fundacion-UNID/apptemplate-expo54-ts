// locales/en/appOrganization.js

import appCommon from './appCommon';

export default {
  plans: {
    title: "Select a Plan",
    subtitle: "Choose the subscription that fits the organization",
    buttons: {
      select: "Select",
      continue: "Continue with selected plan"
    },
  },
  screens: {
      login: {
        "title": "Data Space Access",
        "subtitle": "Enter credentials to access with your organization's connector",
        "connectorData-header": "Data Space Connector Details",
        "hasDomain-label": "Own Domain",
        "isHosted-label": "Use a provider's domain",
        "email-label": "Employee Email",
        "role-label": "Role",
        "domain-label": "Connector Domain",
        "domain-placeholder": "e.g., api.acme.org",
        "provider-label": "Provider",
        "provider-placeholder": "-- Select Provider --",
        "jurisdiction-label": "Organization's Jurisdiction",
        "sector-label": "Organization's Sector",
        "sector-placeholder": "e.g., health",
        "shortName-label": "Organization's Short ID",
        "shortName-placeholder": "e.g., acme"
      },
      loginVerify: {
        unlockTitle: "Unlock Profile",
        unlockSubtitle: "Enter your PIN to access your local profile.",
        unlockButton: "Unlock",
        verifyTitle: "Verification Code",
        verifySubtitle: "Enter the code sent to your email.",
      },
      register: {
        "title": "Registry",
        "subtitle": "Join an existing organization or register a new one",
        "options": {
          "join-button-label": "Join with a code",
          "create-button-label": "Create a new organization"
        }
      },
      "join": {
        "title": "Join Organization",
        "subtitle": "Enter your credentials and an invitation code",
        "sector-picker-label": "Sector",
        "sector-picker-placeholder": "-- Select sector --",
        "role-picker-label": "Role",
        "role-picker-placeholder": "-- Select role --",
        "code-input-label": "Invitation Code",
        "code-input-placeholder": "Enter the code",
        "join-button-label": "Join",
        "options": {
          "codeInput-label": "Invitation Code",
          "codeInput-placeholder": "Enter the code",
          "nextButton-label": "Join"
        }
      },
      auth: {
        title: "Organization",
        subtitle: "Access by email address",
        description: "Log in or register organization",
        googleButton: "Continue with Google",
        appleButton: "Continue with Apple"
      },
      newEntity: {
        "title": "Register Organization",
        "subtitle": "Enter the organization's legal information",
        "options": {
          "jurisdiction-label": "Jurisdiction (Country)",
          "jurisdiction-placeholder": "-- Select --",
          "legalType-label": "Identifier Type",
          "legalType-placeholder": "-- Select --",
          "legalValue-label": "Identification Number",
          "legalValue-placeholder": "e.g., 123456789",
          "sector-label": "Sector",
          "sector-placeholder": "-- Select --",
          "networkRole-placeholder": "-- Select network role --",
          "legalName-label": "Legal Name",
          "legalName-placeholder": "Official Name",
          "shortName-label": "Short Name for Hosting",
          "shortName-placeholder": "e.g., acme-global",
          "shortName-description": "Used to create the organization's URL. Use only lowercase letters, numbers, and hyphens.",
          "domain-label": "Specific Domain or Subdomain (Optional)",
          "domain-placeholder": "e.g., api.acme.org",
          "domain-help": "Optional custom domain. If set, the DID becomes did:web:<domain> (no hosted path).",
          "commercialName-label": "Commercial Name (Optional)",
          "commercialName-placeholder": "The name used for business",
          "address1-label": "Address Line",
          "address1-placeholder": "Street address",
          "address2-label": "Address Line 2 (Optional)",
          "address2-placeholder": "Apartment, suite, etc.",
          "city-label": "City",
          "city-placeholder": "City",
          "region-label": "State / Province / Region",
          "region-placeholder": "State or region",
          "postalCode-label": "ZIP / Postal Code",
          "postalCode-placeholder": "Postal code",
          "provider-help": "Provider host is used when no custom domain is set (hosted DID with tenant/jurisdiction/sector)."
        }
      },

      newRepresentative: {
          title: "Legal Representative",
          subtitle: "Provide an email and the role in the organization.",
          description: "A verification code will be sent to the email address.",
          options: {
            "email-input-label": "Representative's Email",
            "email-input-placeholder": "e.g. director@acme.org",
            "role-picker-label": "Select Role",
            "role-picker-placeholder": "-- Select --",
            "terms-link-label": "Read the Terms and Conditions",
            "accept-terms-checkbox-label": "I accept the terms for this role",
            "sendVerificationCode-button-label": "Send Verification Code",
            "continue-button-label": "Continue",
            "submissionSentTitle": "Sending Registration",
            "submissionSentMessage": "The job has been submitted and is now in the queue.",
            "submissionTracking": "You can track its progress in the jobs console.",
            "jobIdLabel": "Job ID:",
            "continueToJoin-button-label": "Continue to Join"
          }
      },  

      dashboard: {
          title: "Professional Dashboard",
          subtitle: "Manage distinct options based on the assigned role",
          description: "Overview and management of Appointments, Permissions, ",
          exitConfirm: {
            title: "Exit session?",
            message: "Are you sure you want to exit?"
          },
          options: {
            "identity-button-label": "Identity Management",
            "myEntity-button-label": "My Organization",
            "documents-button-label": "User Documents",
            "communications-button-label": "Communications"
          }
      },

      communications: {
          title: "Communications",
          subtitle: "Manage messages",
          description: "Create, send, and review communications.",
          options: {
              "newCommunication-button-label": "Create communication",
              "newCommunication-button-description": "Start a new communication.",
              "inbox-button-label": "Inbox",
              "inbox-button-description": "View received communications.",
              "sent-button-label": "Sent",
              "sent-button-description": "View sent communications.",
              "drafts-button-label": "Drafts",
              "drafts-button-description": "Access saved drafts.",
              "outbox-button-label": "Outbox",
              "outbox-button-description": "Pending delivery or signature."
          },
      },
      
      myEntity: {
        title: "My Organization",
        subtitle: "Internal structure management",
        description: "Manage employees, groups, departments, and locations.",
        options: {
          "employees-button-label": "Employees",
          "groups-button-label": "Groups",
          "departments-button-label": "Departments",
          "locations-button-label": "Locations"
        }
      },
      manageLocations: {
        title: "Locations",
        subtitle: "Define physical or virtual locations for your organization's activities."
      },
      manageDepartments: {
        title: "Departments",
        subtitle: "Define the structure of your organization."
      },
      manageEmployees: {
        title: "Employees",
        subtitle: "Add or remove employees from the draft.",
        groupsLabel: "Groups",
        addEmployee: "Add Employee",
        draftTitle: "Employee Draft",
        noDrafts: "No employees in the draft.",
        sendRequest: "Send Request"
      },
      groupEditor: {
        newTitle: "New Group",
        newSubtitle: "Define the details for the new group",
        editTitle: "Edit Group",
        editSubtitle: "Update the group's details",
        nameLabel: "Group Name",
        namePlaceholder: "e.g., Nursing Staff",
        descriptionLabel: "Description (Optional)",
        descriptionPlaceholder: "e.g., Nurses and medical assistants",
        nameRequired: "Group name is required.",
        successTitle: "Group Saved",
        successMessage: "The group has been saved and is being synchronized.",
        jobNotification: {
          title: "Group Management",
          message: "The group {{name}} has been processed."
        }
      },

      identityMenu: {
          title: "Identity Management",
          subtitle: "Manage identifiers and credentials",
          description: "Manage identifiers and credentials for individuals.",
          options: {
              "shareId-button-label": "Share Professional ID / QR",
              "shareId-button-description": "Display the professional's QR code to share the identifier.",
              "linkIdentifiers-button-label": "Link Individual's Identifiers",
              "linkIdentifiers-button-description": "Link additional identifiers for an individual.",
              "issueCredential-button-label": "Issue Individual's Credential",
              "issueCredential-button-description": "Create and issue a verifiable credential for an individual.",
              "readIdentity-button-label": "Read Identity",
              "readIdentity-button-description": "Review stored identity information."
          },
          shareId: {
              title: "Share ID / QR",
              subtitle: "Share Professional ID",
              description: "Display or scan the QR code."
          },
          linkIdentifiers: {
              title: "Link Identifiers",
              subtitle: "Link related identifiers",
              description: "Link other identifiers to an individual's profile."
          },
          issueCredential: {
              title: "Issue Credential",
              subtitle: "Create a credential for an individual",
              description: "Fill in the data to issue a verifiable credential.",
              options: {
                  "uuid-input-label": "UUID",
                  "uuid-input-description": "Unique identifier for the individual. Leave blank to auto-generate.",
                  "birthdate-input-label": "Birth Date",
                  "birthdate-input-description": "The individual's birth date (YYYY-MM-DD).",
                  // ... (other fields are fine)
              },
          },
          readIdentity: {
              title: "Read Identity",
              subtitle: "View existing identities",
              description: "Access and review existing identifiers."
          }
      },

      newConnection: {
        "title": "New Connection",
        "subtitle": "Find a user to establish a connection",
        "searchByLabel": "Search by",
        "tabs": {
          "email": "Email/Phone",
          "document": "Identifier",
          "name": "Name"
        },
        "docIdLabel": "Document Identifier",
        "docIdPlaceholder": "Document ID",
        "docSubRegionLabel": "Jurisdiction / Sub-region",
        "docSubRegionPlaceholder": "e.g., CA-BC, US-WA, ES",
        "nameLabel": "Name",
        "namePlaceholder": "User's first name",
        "lastNameLabel": "Last Name",
        "lastNamePlaceholder": "User's last name",
        "secondLastNameLabel": "Additional Last Name / Mother's Maiden Name",
        "secondLastNamePlaceholder": "User's second last name",
        "dobLabel": "Date of Birth",
        "searchButton": "Search User",
        "searching": "Searching, please wait...",
        "permissionsTitle": "Request Permissions",
        "userFound": "User found",
        "purposeLabel": "Purpose",
        "rolesLabel": "Roles",
        "sectionsLabel": "Sections",
        "requestButton": "Request Connection",
        "notification": {
            "title": "Search Complete",
            "message": "The user search has finished. Tap to see the results."
        },
        "notFound": "User not found. Please check the details and try again."
      },

      orgCodeVerification: {
        "title": "Verification Code",
        "subtitle": "Enter the code sent to the email address",
        "options": {
          "01-code-input-label": "Verification Code",
          "01-code-input-placeholder": "Enter code",
          "02-next-button-label": "Verify & Continue"
        }
      },
      
      documents: {
          title: "User Documents",
          subtitle: "Manage records and documents",
          description: "Manage documents and sections related to the organization.",
          options: {
              "selectSubject-button-label": "Select Individual / Scan ID",
              "selectSubject-button-description": "Select an individual or scan their ID.",
              "scanId-button-label": "Scan ID",
              "scanId-button-description": "Scan and retrieve ID information.",
              "indexSections-button-label": "Navigate Index & Sections",
              "indexSections-button-description": "Browse documents by category.",
              "addDocument-button-label": "Add Document",
              "addDocument-button-description": "Upload or create a new document.",
              "summaryRecords-button-label": "Summary of Records",
              "summaryRecords-button-description": "View a summary of stored records."
          },
          selectSubject: {
              title: "Select Subject",
              subtitle: "Select or scan an individual",
              description: "Choose a subject to view their documents."
          },
          scanId: {
              title: "Scan ID",
              subtitle: "Scan Individual ID",
              description: "Scan an ID to access records."
          },
          addDocument: {
              title: "Add Document",
              subtitle: "Create or upload new document",
              description: "Add new documentation to this individual's record."
          },
          summaryRecords: {
              title: "Summary Records",
              subtitle: "Overview of stored records",
              description: "View summary details of documents and sections."
          }
      },

      registerCustomer: {
        title: "Register New Customer",
        subtitle: "Create a global identifier and unified data index.",
        submissionSentTitle: "Registration Submitted",
        submissionSentMessage: "The job has been processed and is now in the queue.",
        submissionTracking: "You can track its progress in the jobs console.",
        jobIdLabel: "Job ID:",
        finishButton: "Finish",
        createConnectionButton: "Create Connection",
        orSeparator: "- or -",
        emailLabel: "Customer's Email",
        emailPlaceholder: "user@example.com",
        phoneLabel: "Customer's Phone",
        phonePlaceholder: "+1234567890",
        alternateNameLabel: "Nickname (Optional)",
        alternateNamePlaceholder: "e.g., Joe",
        providerLabel: "Identity Provider",
        termsLabel: "Signed Terms & Conditions (PDF)",
        attachButton: "Attach PDF",
        registerButton: "Register Customer",
        addEvidenceButton: "Add Identity Evidence",
        tabs: {
          digital: "Digital Certificate Registration",
          inPerson: "In-Person Registration"
        }
      },

      registerUnifiedIndex: {
        title: "Register Unified Data Index",
        subtitle: "Attach terms and provide individual's details",
        tabs: {
          digital: "Digital Certificate",
          inPerson: "In-Person Signature"
        },
        providerLabel: "Select Provider",
        termsLabel: "Terms and Conditions (PDF)",
        attachButton: "Attach PDF File",
        emailLabel: "Individual's Email",
        emailPlaceholder: "e.g., user@example.com",
        phoneLabel: "Individual's Phone",
        phonePlaceholder: "e.g., +1 123 456 7890",
        registerButton: "Register",
        addEvidenceButton: "Add Evidence",
        submissionSuccess: "Job submitted successfully!",
        jobIdLabel: "Job ID:",
        finishButton: "Finish",
        submissionInProgress: "Job submitted, processing...",
        submissionSuccessTitle: "Registration Completed!",
        unifiedIdLabel: "Unified ID:"
      }
  }
};
