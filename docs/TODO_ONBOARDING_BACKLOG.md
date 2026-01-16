<!--
This file is an implementation-oriented TODO/changelog for the Expo app template.
Goal: align app screens + state management with the backend flows and the client SDK.
-->

# TODO / Backlog: Onboarding Flows (Organization + Family)

This document lists what the Expo app template still needs to implement to support the end-to-end onboarding flows using the **client SDK** against the **gwtemplate-node-ts** backend.

It is written as a “what’s missing / what to build next” checklist and can be used as a working changelog.

---

## Definitions (shared)

- **Trust bootstrap**: fetch and verify `/.well-known/vc.json` + DID Doc before starting a session.
- **Activation code**: out-of-band onboarding artifact (copy/paste/email/QR). It is **NOT** OIDC PKCE and **NOT** the DIDComm OOB invitation protocol.
- **DCR**: device registration flow (DIDComm message → backend returns `client_id`/device DID).
- **SMART token**: scoped token for authorized operations (Composition/Consent/Communication/etc).

---

## A) Organization App (employees)

### A.0 Screens / UX (shell)

- [ ] `Welcome` / `ProviderSelect`: pick provider/host DID (and environment: demo/test/dev).
- [ ] `Auth`:
  - [ ] “Register organization” (legal representative)
  - [ ] “Login” (existing employee)
- [ ] `AsyncJobProgress` reusable UI (polling, error details, retry).
- [ ] `Dashboard` entry gate:
  - [ ] blocked until device is activated (DCR completed) and core SMART token(s) are available.

### A.1 Organization onboarding (host registry)

Expected backend step chain:

1. Register organization → receive Offer
2. Confirm Order → receive final Organization + persisted `vc.json`/`self-description`
3. (Optional) initial admin activation code auto-issued by backend

TODOs:

- [ ] `OrganizationRegistrationWizard` (uses `docs/forms/organization-registration-form.md`):
  - [ ] build claims object (schema.org)
  - [ ] call SDK `OrgAdminService.createOrganization(...)`
  - [ ] poll job and show Offer summary (offer id, eligible quantity, payment method)
- [ ] `OrganizationOrderConfirmScreen`:
  - [ ] call SDK `OrgAdminService.confirmOrder(offerId, hostDid, idToken, targetNetwork)`
  - [ ] poll and persist:
    - [ ] tenant/provider DID (for later calls)
    - [ ] organization “assurance/trust” artifacts availability
- [ ] `TrustRefreshScreen`:
  - [ ] after order success, re-run trust bootstrap against tenant DID:
    - expects `/.well-known/vc.json` and `/.well-known/did.json`
  - [ ] show meaningful errors if trust fetch fails

Notes:
- Backend now serves `/.well-known/vc.json` and `/.well-known/self-description.json` for hosted tenants.

### A.2 License admin (post-purchase invitations)

The app template needs an admin workflow for inviting/activating devices.

- [ ] `LicensesDashboard`:
  - [ ] show pool status (available/issued/used) for `device-licenses` (backend endpoint TBD for listing)
  - [ ] show “Issue activation code” form:
    - [ ] call SDK `OrgAdminService.issueLicenseActivationCode(providerDid, idToken, { email, role, userClass?, type? })`
    - [ ] display activation code for copy/QR

Open questions (needs backend + SDK alignment):
- [ ] define “purchase licenses” API (Stripe webhook vs explicit endpoint); decide what the app can trigger in DEMO.
- [ ] define “list licenses / pool” API for admins.

### A.3 Device activation (employee)

Expected step chain:

1. User logs in (Firebase id_token)
2. User enters activation code (or uses auto-issued one)
3. SDK exchanges activation code → `Token/_exchange` → gets `initial_access_token`
4. SDK does DCR → `Device/_dcr` → gets `client_id` (device DID)

TODOs:

- [ ] `ActivateDeviceScreen`:
  - [ ] input activation code
  - [ ] call SDK `CommonAuthService.activateDevice(activationCode, providerDid, firebaseIdToken)`
  - [ ] poll DCR job and store:
    - [ ] device DID (`client_id`)
    - [ ] registered keys/JWKS state in local profile

### A.4 SMART tokens (employee roles)

Goal: after device activation, obtain role-based SMART tokens to unlock the dashboard operations.

- [ ] Implement a `ScopeBuilder` (SDK helper) that produces correct FHIR-style scopes for:
  - [ ] reading index Composition by subject + section (IPS-style)
  - [ ] creating/updating Consent rules
  - [ ] sending/reading Communication bundles
- [ ] `DashboardAuthGate`:
  - [ ] request required SMART tokens per role (physician/paramedic/IT/admin)
  - [ ] cache per provider DID + scope set

---

## B) Family App (individuals)

The Family flow should reuse most screens and logic with different labels and a different “admin context”.

Conceptually, the **family group** can be treated as a “department/group” associated to an **individual** (the subject entity). Members have roles, and the group has one or more controllers.

### B.0 Shared UI reuse

- [ ] Duplicate/parameterize organization screens to “family” wording:
  - [ ] registration wizard
  - [ ] order confirmation
  - [ ] device activation
  - [ ] dashboard gate

### B.1 Family onboarding (tenant registry / family org)

Expected chain is analogous to Organization:

1. Register family org → receive Offer
2. Confirm Order → final family org config
3. Auto-issued activation code for controller (backend)

TODOs:

- [ ] `FamilyRegistrationWizard` (claims builder)
- [ ] `FamilyOrderConfirmScreen`
- [ ] Trust bootstrap for family org DID

### B.2 Invite/activate additional individuals (members/caregivers/friends)

- [ ] `FamilyMembersScreen`:
  - [ ] “Issue activation code” for `userClass='individual'`
  - [ ] flow for member device activation (same as A.3)

### B.3 SMART tokens (family)

- [ ] Define “individual” scopes used by family app (controller + member roles):
  - [ ] create/update Consent rules (pre-authorization)
  - [ ] update/read the subject index Composition (IPS sections)
  - [ ] send/receive Communication bundles (text conversations, IPS document, assistant-captured data)
  - [ ] share access with other members (controller-managed rules)
- [ ] Add “family controller” flows for minors/elderly:
  - [ ] controller can manage consent rules on behalf of the subject
  - [ ] controller can receive notifications (Communication) when professionals access data

---

## C) Cross-cutting TODOs (app + SDK + backend alignment)

- [ ] Centralize environment selection:
  - [ ] demo/test/dev URLs and did:web construction rules
  - [ ] http/https handling for localhost dev
- [ ] Make job polling robust:
  - [ ] exponential backoff + timeout
  - [ ] surface OperationOutcome errors to UI
- [ ] Define a single “session state” persisted locally:
  - [ ] provider DID / host DID
  - [ ] device DID (`client_id`)
  - [ ] activation status
  - [ ] SMART token cache keying (by provider DID + scope set)

---

## D) SMART Token + Scopes (missing building blocks)

The SDK/app still needs a **single canonical way** to build scopes for the gateway’s SMART token endpoint.

- [ ] Create `ScopeBuilder` in SDK:
  - [ ] Subject-pinning scope item (always include):
    - `patient/Composition.rs?subject=<did:web:...:individual:<id>>`
  - [ ] Section scoping:
    - `...&section=<SYSTEM|CODE>` (e.g., `LOINC|48765-2`)
  - [ ] Consent CRUD:
    - `patient/Consent.cruds`
  - [ ] Communication:
    - `patient/Communication.cruds` (or equivalent scope string used by backend)
  - [ ] Composition update:
    - `patient/Composition.cruds` (or equivalent used by backend)
- [ ] Role-based “required scopes” presets:
  - [ ] Organization admin / IT (employee):
    - manage employee onboarding + licensing administration
  - [ ] Physician / nurse (employee):
    - read index sections for treatment purpose
  - [ ] Family controller (individual role):
    - manage consent + index updates + communications on behalf of subject

Implementation note:
- The backend enforces consent rules per subject (stored under tenant vault per-individual rules section). The SMART token request must match those rules.

---

## E) Global-DataCare “Memoria” MVP mapping (Use-cases 5.1–5.7)

This section expands the missing TODOs required for the “memoria” demo flows beyond onboarding.

### 5.1 Activate unified health index + predefined permissions

- [ ] App personal (Family/Individual):
  - [ ] “Activate Index” wizard:
    - [ ] collect and sign PDF terms (as attachment) and submit as claims
    - [ ] create initial Consent rules (pre-authorization) with ODRL attachment
  - [ ] Backend:
    - [ ] persist individual index “container” (Composition) and default consent rules
- [ ] SDK:
  - [ ] implement “activate individual” method that submits:
    - [ ] Person onboarding entry (schema.org claims)
    - [ ] Consent entry with attachment (FHIR Consent claims + base64 attachment)
    - [ ] initial Composition index entry or placeholder (depending on backend contract)

### 5.2 Organization identity activation (tenant)

Covered by Organization onboarding (Offer/Order) plus trust bootstrap.

### 5.3 Employee onboarding (tenant)

- [ ] App org admin:
  - [ ] “Create employee” form (email + role)
  - [ ] “Issue activation code” for employee device
- [ ] SDK:
  - [ ] ensure employee onboarding service + license issuing service are exposed in app flows

### 5.4 Employee device activation

Covered by activation code → token exchange → DCR.

### 5.5 Import HL7 FHIR data, generate IPS, share securely

- [ ] Family/Individual app:
  - [ ] “External providers” registry UI:
    - [ ] store external portal base URLs / endpoints in local confidential storage
    - [ ] bind those URLs to index sections in a local Composition
  - [ ] IPS import:
    - [ ] import a FHIR Bundle (IPS doc) and update local index Composition
    - [ ] update remote index via gateway (Composition update)
  - [ ] Share IPS securely:
    - [ ] send a DIDComm `Communication` to selected recipients with IPS as payload (Bundle)
- [ ] SDK:
  - [ ] `IndividualService.updateIndexComposition(...)` (Composition/_batch)
  - [ ] `IndividualService.sendCommunicationWithBundle(...)` (Communication/_batch, FHIR or internal JSON:API depending on contract)
  - [ ] “offline-first job queue” integration (already conceptually present via JobManager; wire to app screens)

### 5.6 Access via pre-authorization (professional + notifications)

- [ ] Professional app:
  - [ ] request SMART token for:
    - [ ] a subject DID
    - [ ] specific sections (LOINC codes)
    - [ ] purpose (`TREAT`, etc.)
  - [ ] fetch index Composition sections from gateway and extract external links
  - [ ] call external provider URLs (FHIR endpoints) using the obtained links
- [ ] Backend:
  - [ ] on successful index access, send a notification `Communication` to:
    - [ ] subject OR family controller(s)
- [ ] SDK:
  - [ ] professional `getSmartToken(...)` wrapper that uses ScopeBuilder
  - [ ] professional “read index section” wrapper(s)
  - [ ] receiver-side handling for incoming `Communication` notifications

### 5.7 Digital twin anonymized updates

Out of scope for apptemplate MVP UI, but track as TODO:

- [ ] “Send IPS to anonymization service” (encrypted `Communication`)
- [ ] de-identification pipeline (SMART Health Cards minimization) + signing
- [ ] publish to digital-twin channel / storage

---

## F) Current backend + SDK status (reference)

Backend (gwtemplate-node-ts):
- Supports org onboarding Offer/Order and produces tenant well-known artifacts.
- Supports token exchange, DCR, SMART token issuance, and License activation code issuance.

SDK (gdc-sdk-client-ts):
- Has org onboarding calls and device activation (token exchange + DCR).
- Has “issue activation code” call for tenant admins.
- Has SMART token manager that can be wired to backend (requires final scope builder usage in app flows).

---

## G) Implementation Breakdown (by repository / files)

This is the “next sprint” view: concrete tasks per repo to deliver the **memoria (5.1–5.7)** flows.

### G.1 SDK: `gdc-sdk-client-ts`

**1) ScopeBuilder (single source of truth)**

- [ ] Add `src/utils/scopeBuilder.ts`:
  - [ ] `subjectPin(subjectDid): string` → `patient/Composition.rs?subject=<subjectDid>`
  - [ ] `withSection(scopeItem, sectionToken): string` → appends `&section=<SYSTEM|CODE>`
  - [ ] `consentCruds(): string`, `compositionCruds(): string`, `communicationCruds(): string`
  - [ ] `buildProfessionalIndexReadScopes({ subject, sections, purpose }): string[]`
  - [ ] `buildFamilyIndexWriteScopes({ subject, purpose }): string[]`
- [ ] Add tests under `gdc-sdk-client-ts/__tests__/scopeBuilder.test.ts`.

**2) SMART token acquisition wrappers**

- [ ] Add an SDK method that calls the backend SMART token endpoint and caches it by `{providerDid, scopes[]}`:
  - [ ] `ProfileManager.getSmartToken(providerDid, scopes, idToken)` (thin wrapper)
  - [ ] Use `SmartTokenManager` in backend mode (already supported) + feed it scopes from ScopeBuilder.

**3) Family admin flows (controller + members)**

- [ ] Refactor `gdc-sdk-client-ts/src/frontend-services/family-admin/FamilyAdminService.ts`:
  - [ ] remove the hardcoded `sector='family'` overrides; use `appInfo.sector` (e.g., `health-care`)
  - [ ] add `issueActivationCodeForMember(...)` (wraps License/_issue with `userClass='individual'`)
  - [ ] add `setPreAuthorizationRules(...)` (wraps Consent/_batch)

**4) Individual flows (index + communications)**

- [ ] Expand `gdc-sdk-client-ts/src/frontend-services/individual/IndividualService.ts`:
  - [ ] `activateIndexAndDefaultConsent(...)` (memoria 5.1)
  - [ ] `updateIndexComposition(...)` (memoria 5.5; wraps Composition/_batch)
  - [ ] `sendConversationCommunication(...)` (memoria 5.5; wraps Communication/_batch)
  - [ ] `sendIpsCommunication(...)` (memoria 5.5; Communication with IPS Bundle attachment/reference)

**5) Professional flows (read index + notifications)**

- [ ] Add to professional services (e.g., `PhysicianService`):
  - [ ] `requestIndexAccessToken(subjectDid, sections, purpose, idToken)`
  - [ ] `readIndexSections(subjectDid, sections, ...)` (Composition query contract TBD; initial version can be “read latest section updates”)
  - [ ] `fetchExternalLinksFromIndex(...)` (parses Composition.entry link claims)

### G.2 Backend: `gwtemplate-node-ts`

**1) Index read API for professionals (memoria 5.6)**

- [ ] Define an explicit endpoint contract to read index sections (Composition) for a subject:
  - [ ] scope-checked via SMART token
  - [ ] returns Composition entries for requested sections

**2) Notification to individual/controller on access (memoria 5.6)**

- [ ] On successful index access, send a `Communication` to subject/controller(s) (notification).

**3) Family “activate index” endpoint (memoria 5.1)**

- [ ] Ensure Person onboarding + Consent/_batch + Composition/_batch can be submitted as one “activation job” (or document the required call sequence).

**4) License pool management APIs (admin UX)**

- [ ] Endpoint to list license pool state (available/issued/used) per tenant and `userClass`.

### G.3 App Template: `apptemplate-expo54-ts`

**1) Organization demo (employees)**

- [ ] Complete UI screens from sections A.1–A.4 and wire them to SDK services.
- [ ] Add a “demo happy path” navigation checklist:
  - [ ] register org → confirm order → trust bootstrap → activate device → obtain SMART token → dashboard

**2) Family demo (individual + controller)**

- [ ] Clone organization flow screens and adapt wording + role mapping:
  - [ ] controller registers family → activates device → sets pre-authorization → updates index → sends Communication (IPS/text)

**3) Memoria scripts**

- [ ] Add a “Memoria MVP” dev menu that can trigger:
  - [ ] 5.1 activate index + default rules
  - [ ] 5.5 import IPS + update index + send IPS Communication
  - [ ] 5.6 request access as professional + see notification on family device
