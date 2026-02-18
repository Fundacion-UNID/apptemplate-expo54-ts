// locales/en/appFamily.js
export default {
    screens: {
        auth: {
            title: "Family access",
            subtitle: "Sign in to continue",
            description: "Choose how you want to access your family account."
        },
        login: {
            title: "Family login",
            subtitle: "Enter the data to access with your role",
            "country-label": "Country",
            "country-placeholder": "Select country",
            "provider-label": "Provider",
            "provider-placeholder": "-- Select --",
            "domain-placeholder": "Provider domain (e.g., api.acme.org)",
            "familyId-label": "Family identifier",
            "familyId-placeholder": "Family identifier",
            "role-label": "Relationship role",
            "role-placeholder": "-- Select --",
            continue: "Continue"
        },
        register: {
            title: "Family register",
            subtitle: "Create or join a family account",
            description: "Choose how you want to start your family account."
        },
        join: {
            title: "Join a family",
            subtitle: "Enter the data to access with your role",
            "country-label": "Country",
            "country-placeholder": "Select country",
            "provider-label": "Provider",
            "provider-placeholder": "-- Select --",
            "familyId-label": "Family identifier",
            "familyId-placeholder": "Family identifier",
            "role-label": "Relationship role",
            "role-placeholder": "-- Select --",
            continue: "Continue"
        },
        newEntity: {
            "title": "Create new family",
            "subtitle": "Enter the details to create the family organization",
            "email-label": "Email",
            "email-placeholder": "e.g. user@example.com",
            "role-label": "Relationship role",
            "role-placeholder": "-- Select --",
            "familyName-label": "Individual's family name",
            "familyName-placeholder": "Family of <name or nickname>",
            "familyId-label": "Family ID",
            "familyId-placeholder": "Generated family ID",
            "country-label": "Country",
            "country-placeholder": "Select country",
            "provider-label": "Provider",
            "provider-placeholder": "-- Select --"
        },
        dashboard: {
            title: "My Family Dashboard",
            subtitle: "Manage members, permissions, and appointments",
            authGate: "Fetching SMART access token for this session.",
            memberLicenses: "Available member licenses",
            description: "Overview and management of your family.",
            options: {
                communications: "Communications",
                identity: "Digital identity",
                documents: "Documents",
                dataSpace: "Data space",
                account: "My account"
            },
            messages: {
                welcome: "Welcome to your family dashboard."
            },
            errors: {
                loadFailed: "Could not load your family data."
            }
        },

        entity: {
            title: "My Family",
            subtitle: "Manage members, permissions, appointments",
            description: "Add or manage family members, permissions and appointments.",
            options: {
                "members-button-label": "Members",
                "members-button-description": "Manage family members and assign roles.",
                "permissions-button-label": "Permissions",
                "permissions-button-description": "Control access permissions.",
                "appointments-button-label": "Appointments",
                "appointments-button-description": "Manage family appointments."
            }
        },

        identityMenu: {
            title: "Digital identity",
            subtitle: "Identity and evidence operations",
            description: "Manage family members' identifiers and credentials.",
            options: {
                add: "Add",
                search: "Search",
                evidence: "Identity evidence",
                shareId: "Share my ID",
                "shareId-button-label": "Share My ID / QR",
                "shareId-button-description": "Tap to display your QR code for sharing your identifier.",
                "linkIdentifiers-button-label": "Link individual's identifiers",
                "linkIdentifiers-button-description": "Link additional identifiers related to the same person.",
                "issueCredential-button-label": "Issue individual's credential",
                "issueCredential-button-description": "Create and issue a verifiable credential.",
                "readIdentity-button-label": "Read identity",
                "readIdentity-button-description": "Review stored identity information."
            },
            messages: {
                successLink: "Identifiers linked successfully."
            },
            errors: {
                failedLink: "Failed to link identifiers."
            }
        },

        issueCredential: {
            title: "Issue Credential",
            subtitle: "Create a credential for an individual",
            description: "Fill in the data to issue a verifiable credential.",
            options: {
                "uuid-input-label": "UUID",
                "uuid-input-description": "Unique identifier for the individual. Leave blank to auto-generate.",
                "uuid-input-placeholder": "Enter UUID",
                "birthdate-input-label": "Birth Date",
                "birthdate-input-description": "Individual's birth date (YYYY-MM-DD).",
                "birthdate-input-placeholder": "YYYY-MM-DD",
                "twins-input-label": "Twins number",
                "twins-input-description": "Enter 0 if no twins.",
                "twins-input-placeholder": "0",
                "name-input-label": "Official full name",
                "name-input-description": "Used only to generate hash, not stored.",
                "name-input-placeholder": "Full name (transliterated)",
                "addAuthorized-checkbox-label": "Add authorized people for notifications",
                "addAuthorized-checkbox-description": "Enable to specify authorized people to notify.",
                "submit-button-label": "Issue Credential",
                "submit-button-description": "Submit data to issue credential."
            },
            messages: {
                success: "Credential issued successfully."
            },
            errors: {
                missingEmail: "Email is required if no authorized recipients are specified."
            }
        },

        documents: {
          title: "User Documents",
          subtitle: "Manage records and documents",
          description: "Add, view, or manage documents and sections related to this family.",
          options: {
              index: "Index",
              create: "Create document",
              signature: "Signature and certification",
              traceability: "Verification and traceability",
              "selectSubject-button-label": "Select subject / Scan ID",
              "selectSubject-button-description": "Select a person or scan their QR code.",
              "scanId-button-label": "Scan ID",
              "scanId-button-description": "Scan and retrieve identity information.",
              "indexSections-button-label": "Navigate index & sections",
              "indexSections-button-description": "Browse documents by sections.",
              "addDocument-button-label": "Add document",
              "addDocument-button-description": "Upload a new document or record.",
              "summaryRecords-button-label": "Summary of records",
              "summaryRecords-button-description": "View the summarized records for this subject."
          },
          messages: {
              successUpload: "Document uploaded successfully."
          },
          errors: {
              loadFailed: "Could not load document data."
          }
      },

      communications: {
          title: "Communications",
          subtitle: "Inbox, Outbox, Drafts",
          description: "Create, send, and review communications related to this family.",
          options: {
              "createCommunication-button-label": "Create communication",
              "createCommunication-button-description": "Start a new communication or message.",
              "inbox-button-label": "Inbox",
              "inbox-button-description": "View received communications.",
              "sent-button-label": "Sent",
              "sent-button-description": "View sent communications.",
              "drafts-button-label": "Drafts",
              "drafts-button-description": "Access communications saved as drafts.",
              "outbox-button-label": "Outbox",
              "outbox-button-description": "Pending delivery or signature."
          },
          messages: {
              sentSuccess: "Communication sent successfully."
          },
          errors: {
              deliveryFailed: "Could not deliver the communication."
          }
      },
      dataSpace: {
        title: "Data space",
        subtitle: "Organizations, services and locations",
        options: {
          organizations: "Participating organizations",
          departments: "Departments / services",
          locations: "Nearby locations",
          myProvider: "My provider"
        }
      },
      account: {
        title: "My account",
        subtitle: "Profile, DID and session",
        email: "Email",
        role: "Role",
        did: "My DID",
        providerDid: "Provider DID",
        token: "Token available",
        tasksHistory: "Tasks history",
        jobs: "My jobs",
        logout: "Sign out"
      },
      connections: {
        'Family Health': 'Family Health',
        'Family Doctor': 'Family Doctor',
      }
    },
    roles: {
        ONESELF: {
            label: "Personal user"
        }
    },
    providers: {
        unidFoundation: "UNID Foundation"
    }
};
