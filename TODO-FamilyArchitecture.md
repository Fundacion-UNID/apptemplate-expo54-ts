// TODO: ARCHITECTURE FOR FAMILY FLOWS
// This is a placeholder file to leave top-level architectural notes.

// 1. Create `FamilyAdminService.ts` in `client-sdk-ts/src/services/family-admin/`
//    - It should contain a `createFamily(founderData: object)` method.
//    - This method will be analogous to `OrgAdminService.startOrganizationRegistration`.
//    - It will target a HOST provider endpoint in the `registry` section.

// 2. Implement the UI Flow in the Application (e.g., in App.js or a dedicated screen)
//    - Flow A: "Create Family by Individual". A new or existing user (auth with OIDC id_token) calls `family.admin.createFamily` (/individual/org.schema/Organization/_batch) and sets its role in the family as person o related person but becomes the controller of the new family organization / group of members with roles (it will be close to a department which is created within a gateway / hosted organization)
//    - Flow B: "Create Family by Employee". An  employee (auth with SMART token) calls `organization.individual.createFamily` (/individual/org.schema/Organization/_batch).
//    - Flow B: "Add Member to Family". An existing `controller` (auth with SMART token) calls `individual.service.onboardIndividual` and provides the `familyId`, similar to create employee but for related persons to the family 
//    - The `useProfile` hook will provide the necessary services after session initialization.

// 3. Update `IndividualService.onboardIndividual`
//    - The `customerData` payload should be validated to ensure it contains a `memberOf.identifier` field, which is the `familyId`.
