// constants/Routes.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

export const Routes = {
  Landing: { name: 'Landing', path: '/' },

  Family: {
    Auth: { name: 'FamilyAuth', path: '/family/auth' },
    Register: { name: 'FamilyRegister', path: '/family/register' },
    Join: { name: 'FamilyJoin', path: '/family/join' },
    LoginAuth: { name: 'FamilyLoginAuth', path: '/family/login-auth' },
    ProfileSelect: { name: 'FamilyProfileSelect', path: '/family/profile-select' },
    Login: { name: 'FamilyLoginMember', path: '/family/login' },
    New: { name: 'FamilyNew', path: '/family/new' },
    RegistrySent: { name: 'FamilyRegistrySent', path: '/family/register-sent' },
    Dashboard: { name: 'FamilyDashboard', path: '/family/dashboard' },

    // Communications
    Communications: { name: 'FamilyCommunications', path: '/family/communications' },
    ChatGroups: { name: 'FamilyChatGroups', path: '/family/communications/chat-groups' },
    Contacts: { name: 'FamilyContacts', path: '/family/communications/contacts'}, 
    Inbox: { name: 'FamilyInbox', path: '/family/communications/inbox' },
    Sent: { name: 'FamilySent', path: '/family/communications/sent' },
    Drafts: { name: 'FamilyDrafts', path: '/family/communications/drafts' },
    Outbox: { name: 'FamilyOutbox', path: '/family/communications/outbox' },

    // Identity Management
    ShareID: { name: 'FamilyShareID', path: '/family/identity/share-id' },
    LinkIdentifiers: { name: 'FamilyLinkIdentifiers', path: '/family/identity/link-identifiers' },
    IssueCredential: { name: 'FamilyIssueCredential', path: '/family/identity/issue-credential' },
    ReadIdentity: { name: 'FamilyReadIdentity', path: '/family/identity/read-identity' },

    // Family / Group Management
    Members: { name: 'FamilyMembers', path: '/family/family/members' },
    Permissions: { name: 'FamilyPermissions', path: '/family/family/permissions' },
    Appointments: { name: 'FamilyAppointments', path: '/family/family/appointments' },

    // User Documents
    SelectSubject: { name: 'FamilySelectSubject', path: '/family/documents/select-subject' },
    ScanID: { name: 'FamilyScanID', path: '/family/documents/scan-id' },
    IndexSections: { name: 'FamilyIndexSections', path: '/family/documents/index-sections' },
    AddDocument: { name: 'FamilyAddDocument', path: '/family/documents/add-document' },
    SummaryRecords: { name: 'FamilySummaryRecords', path: '/family/documents/summary-records' },
    Devices: { name: 'FamilyDevices', path: '/family/devices' },
    DeviceActivate: { name: 'FamilyDeviceActivate', path: '/family/device-activate' },
  },

  Organization: {
    Auth: { name: 'OrgAuth', path: '/organization/auth' }, // This is the navigator entry point
    AuthLanding: { name: 'OrgAuthLanding', path: '/organization/auth/landing' }, // This is the screen inside the navigator
    // Register: { name: 'OrgRegister', path: '/organization/register' }, // Deprecated: use OrgRegisterAuth
    RegisterAuth: { name: 'OrgRegisterAuth', path: '/organization/register-auth' },
    NewEntity: { name: 'OrgNewEntity', path: '/organization/register-entity' },
    NewRepresentative: { name: 'OrgNewRepresentative', path: '/organization/register-representative' },
    RegistrySent: { name: 'OrgRegistrySent', path: '/organization/register-sent' },
    DeviceActivate: { name: 'OrgDeviceActivate', path: '/organization/device-activate' },
    Join: { name: 'OrgJoin', path: '/organization/join' },
    Login: { name: 'OrgLoginMember', path: '/organization/login' },
    LoginAuth: { name: 'OrgLoginAuth', path: '/organization/login-auth' },
    ProfileSelect: { name: 'OrgProfileSelect', path: '/organization/profile-select' },
    LoginRoleSelect: { name: 'OrgLoginRoleSelect', path: '/organization/login-role-select' },
    LoginVerify: { name: 'OrgLoginVerify', path: '/organization/login-verify' },
    LoginVerifyCode: { name: 'OrgLoginVerifyCode', path: '/organization/login-verify' },
    CodeVerification: { name: 'OrgCodeVerification', path: '/organization/code-verification' },
    Dashboard: { name: 'OrgDashboard', path: '/organization/dashboard' },

    // --------------------------
    // 1️⃣ Identity Management
    // --------------------------
    IdentityMenu: { name: 'OrgIdentityMenu', path: '/organization/identity' },
    ManageUnifiedIndex: { name: 'OrgManageUnifiedIndex', path: '/organization/identity/manage-index' },
    RegisterUnifiedIndex: { name: 'OrgRegisterUnifiedIndex', path: '/organization/identity/register-index' },
    RegisterCustomer: { name: 'OrgRegisterCustomer', path: '/organization/identity/register-customer' },
    AddEvidence: { name: 'OrgAddEvidence', path: '/organization/identity/add-evidence' },
    ShareID: { name: 'OrgShareID', path: '/organization/identity/share-id' },
    LinkIdentifiers: { name: 'OrgLinkIdentifiers', path: '/organization/identity/link-identifiers' },
    IssueCredential: { name: 'OrgIssueCredential', path: '/organization/identity/issue-credential' },
    ReadIdentity: { name: 'OrgReadIdentity', path: '/organization/identity/read-identity' },

    MyEntity: { name: 'OrgMyEntity', path: '/organization/my-entity' },
    Groups: { name: 'OrgMgmtGroups', path: '/organization/my-entity/groups' },
    GroupEditor: { name: 'OrgGroupEditor', path: '/organization/my-entity/groups/editor' },
    Departments: { name: 'OrgDepartments', path: '/organization/my-entity/departments' },
    Employees: { name: 'OrgMgmtEmployees', path: '/organization/my-entity/employees' },
    Licenses: { name: 'OrgLicenses', path: '/organization/my-entity/licenses' },
    Devices: { name: 'OrgDevices', path: '/organization/my-entity/devices' },
    Locations: { name: 'OrgMgmtLocations', path: '/organization/my-entity/locations' },
    
    // Appointments: { name: 'OrgAppointments', path: '/organization/my-entity/appointments' },
    // Permissions: { name: 'OrgPermissions', path: '/organization/my-entity/permissions' },

    Documents: { name: 'OrgDocuments', path: '/organization/documents' },

    SelectSubject: { name: 'OrgSelectSubject', path: '/organization/documents/select-subject' },
    ScanID: { name: 'OrgScanID', path: '/organization/documents/scan-id' },
    IndexSections: { name: 'OrgIndexSections', path: '/organization/documents/index-sections' },
    AddDocument: { name: 'OrgAddDocument', path: '/organization/documents/add-document' },
    SummaryRecords: { name: 'OrgSummaryRecords', path: '/organization/documents/summary-records' },
    
    Communications: { name: 'OrgCommunications', path: '/organization/communications' },
    AddConnection: {name: 'OrgAddConnection', path: '/organization/communications/connection-add' },
    ChatGroups: { name: 'ChatGroups', path: '/organization/communications/chat-groups' },
    Contacts: { name: 'Contacts', path: '/organization/communications/contacts'}, 
    Inbox: { name: 'OrgInbox', path: '/organization/communications/inbox' },
    Sent: { name: 'OrgSent', path: '/organization/communications/sent' },
    Drafts: { name: 'OrgDrafts', path: '/organization/communications/drafts' },
    Outbox: { name: 'OrgOutbox', path: '/organization/communications/outbox' },
  },
};
