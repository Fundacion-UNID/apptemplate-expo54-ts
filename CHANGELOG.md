# Changelog

# Changelog

## [Unreleased] - Architectural Overhaul

### Added

*   **Personal Evidence Composer flow (new reusable UI + contract draft):**
    *   Added reusable component `PersonalEvidenceComposer` (`components/forms/PersonalEvidenceComposer.tsx`).
    *   Replaced previous `OrgAddEvidenceScreen` placeholder with a full flow implementation using:
        * `indexSection` targeting (instead of `clinicalSection`),
        * `period` semantics (`startDate` + optional `endDate`),
        * optional communication recipients/messages,
        * confidential attachment and portal URL handling.
    *   Introduced `PersonalEvidenceDraft` as emitted data model for end-to-end mapping to backend endpoints.
    *   Wired Family navigation to the same reusable flow: `Documents -> Create` now opens `FamAddDocumentScreen` (`screens/family/FamAddDocumentScreen.tsx`) and reuses `PersonalEvidenceComposer`.

*   **Internal security policy wiring for evidence publication:**
    *   `qualifiedCreator` is now treated as an internal policy outcome (derived from trusted DID/role context), not a user-editable toggle.
    *   Added explicit professional attestation checkbox for attachment/code review.
    *   `registerResearchMetadata` is now policy-computed (not manually toggled), only when all required conditions are met:
        1. qualified creator,
        2. attachment present,
        3. code selected,
        4. attestation accepted.

*   **Documentation for end-to-end flow:**
    *   Added `docs/personal-evidence-flow.md` describing frontend behavior, backend contract mapping, and blockchain/statistics policy.
    *   Updated backend integrator guide with concrete `PersonalEvidenceComposer` submission examples (`Bundle/_batch` + optional `Communication/_batch`).

## [Unreleased] - Architectural Refinement & DEMO Mode Overhaul

This release focuses on hardening the SDK's architecture, improving the developer experience by exposing a richer public API, and implementing a robust, dynamic DEMO mode that correctly simulates the application's core flows.

### Major Architectural Changes

*   **The SDK is now truly DID-First:** The primary method `initializeSession` has been refactored to accept a `providerDid` as its entry point, instead of a URL. The SDK is now responsible for resolving the DID to a URL internally, adhering to SSI best practices.
*   **"Batteries Included" Public API:** The SDK's public API surface (`index.ts`) has been greatly expanded. It now officially exports:
    *   **Utility Functions:** `buildHostedDidDetails`, `getBaseUrlFromDidWeb`, and a suite of mock data generators (`generateDidDocument_forMock`, etc.) are now public, providing developers with the tools to build and test integrations correctly.
    *   **Data Models & Enums:** Key data models and enums like `IscoCode` are now exported, enabling type-safe development in consuming applications.
*   **Encapsulation Maintained:** A new public method, `sdk.addMockDidDocument()`, was added to allow the UI to dynamically inject mock data in DEMO mode without violating the SDK's private state (`sdkConfig`).

### Fixes

*   **DEMO Mode Completely Overhauled:** The DEMO mode logic has been moved from a static configuration in `ProfileContext` to a dynamic, runtime implementation within the UI screens (`OrgLoginMemberScreen`, `OrgDeviceActivateScreen`). When a network call fails in DEMO mode, the UI now correctly:
    1.  Catches the error.
    2.  Uses the SDK's public mock generators to create a valid, in-memory `DID Document`.
    3.  Injects this mock back into the SDK.
    4.  Re-calls `initializeSession`, which now succeeds.
    5.  Correctly navigates to the **Device Activation** screen, allowing the full application flow to be tested.
*   **Fixed Core SDK Logic:** Corrected the internal logic in `ClientSDK.ts` for constructing employee DIDs to align with the official documentation (`...:role:ISCO-08|<code>`).
*   **Fixed Mock Data Generation:** All mock `DID Document` generation is now centralized and uses the newly exposed public utility functions, ensuring consistency between test data and runtime mocks. The `service.id` generation logic was also corrected.

### Documentation

*   **New Root `README.md` Section:** Added a high-level "Project Architecture" section to the main `README.md` to explain the multi-package monorepo structure (Core vs. Platform packages).
*   **`client-sdk-ts/README.md` Overhauled:** The SDK's documentation has been completely rewritten to serve as a practical Quick Start guide. It now includes:
    *   An explanation of the "Engine vs. Chassis" (SDK vs. Platform) concept.
    *   Clear examples for implementing required interfaces like `IWallet`.
    *   Step-by-step guides for core business flows like organization onboarding.
    *   Documentation for the new public utility functions.

---

This version represents a fundamental architectural refactoring of the Client SDK and its integration with the Expo application. What began as a bug fix evolved into a complete overhaul of the security model, service architecture, and configuration management to align with industry best practices for security, scalability, and maintainability.

### Added

*   **Implemented Core Business Flows using the New Architecture:**
    *   **Organization Onboarding:** The SDK now fully supports the critical business flow of registering a new organization and activating the first administrative device. The step for accepting the `Offer` is now implemented.
        *   `OrgAdminService.startOrganizationRegistration()`
        *   `OrgAdminService.confirmOrganizationRegistration()`
        *   `CommonAuthService.activateDevice()`
    *   This flow is now driven by the robust, reusable services (`OrgAdminService`, `CommonAuthService`) instead of bespoke UI-layer logic.

*   **Added Capability-Based Service Architecture:**
    *   Introduced a hierarchical and composable service model.
    *   **Role Services** (`PhysicianService`, `ParamedicService`) define a user's job.
    *   **Capability Services** (`MedicationService`, `AppointmentService`, `TaskService`) define shared functions and are composed by Role Services.
    *   **Base Services** (`BaseProfessionalService`, `BaseApiService`) provide common logic through inheritance.

*   **Added Centralized Registries for Scalability:**
    *   Created `roleRegistry.ts` to map ISCO-08 codes and contexts (`Organization`, `Family`) to `RoleDefinition` blueprints, eliminating "magic strings".
    *   Created `serviceSelectorRegistry.ts` as the single source of truth for all API endpoint definitions, derived from the `API_INTEGRATORS_GUIDE`.

*   **Added "The Brain" - a Context-Aware `capabilityMapper`:**
    *   The `capabilityMapper` now acts as a generic "assembler" that reads from the registries.
    *   It dynamically instantiates and injects capability services into role services based on the user's role and the application's context (`AppType`).

*   **Added Bundled Trust Anchor Security Model:**
    *   Implemented a true PKI chain-of-trust model to prevent Man-in-the-Middle attacks.
    *   The application is now bundled with a **Root Governing Public Key** (from `.env`).
    *   The `VerifierService` is now 100% offline for the root verification step and validates the entire trust chain.

*   **Added Environment-Aware Configuration (`DEMO`/`STAGING`/`PRODUCTION`):**
    *   The application's entry point (`ProfileContext.tsx`) now implements a robust, three-branch logic for configuration.
    *   **`DEMO` mode** is fully offline, using local mock data from `test-data`.
    *   **`STAGING` and `PRODUCTION` modes** rely on environment variables for security anchors.

*   **Added `AppInfo` Dependency Injection Flow:**
    *   Created a clear data flow for injecting application-wide static information (`deviceInfo`, `appType`, etc.) from the top level (`ClientSDK`) down to all services.

*   **Added Comprehensive Domain Models:**
    *   Created `isco.ts` as the single, type-safe source of truth for all supported ISCO-08 roles.
    *   Created and/or verified the existence of `flat claims` models (e.g., `ClaimsMedicationStatement.model.ts`).

*   **Added Architectural Documentation (`docs/architecture.md`):**
    *   Created a new, detailed architecture document with Mermaid diagrams explaining the dependency injection flow and the service assembly logic.

### Changed

*   **Refactored `ProfileManager` & `IWallet` Interaction:**
    *   Clarified the architectural role of `ProfileManager` as an orchestrator that relies on the `IWallet` interface.
    *   The `IWallet` implementation (e.g., `ExpoWallet`) is the SDK's "port" to the platform's native Key Management System (KMS), such as iOS Keychain or Android Keystore. `ProfileManager` manages the session's identity, while `IWallet` manages the cryptographic keys.
    *   Converted `ProfileManager` from a monolithic service builder into a thin orchestrator that delegates all capability mapping to the `capabilityMapper`.

*   **Refactored `ClientSDK`:** The constructor now requires all critical dependencies, including `AppInfo` and the trust anchor (`icaDid` or root key).
*   **Refactored `did:web` Format:** Updated the official `did:web` format in `docs/did_generation.md` to use the FHIR-compliant `system|code` pattern (e.g., `isco-08|2211`).
*   **Standardized on Bundle (`_batch`):** All services that perform write operations (`create`, `update`) were refactored to construct and send batches (`JSON:API` `data` array or FHIR `Bundle` `entry` array).
*   **Standardized on Internal `CommMsgExtended` Format:** Services now create messages using a canonical, internal format (`gdc.comm.v1`), and the frontend is fully decoupled from FHIR construction.
*   **Refactored Application Screens (`OrgLoginMemberScreen`, `OrgDeviceActivateScreen`):** Screens were simplified to be "dumb" components that pull state from the `ProfileContext` instead of passing props, making the UI more robust and decoupled from the SDK.

---

### Changed

*   **Refactored `didProvider.data.ts` Test Data:** Overhauled the mock DID Document generation to accurately model the architectural distinction between a **Host Provider** (manages `registry` services) and a **Gateway/Tenant** (manages `entity` services).
*   **Centralized Service Definitions:** Implemented a dynamic DID Document service generator (`generateServicesFromServiceRegistry`) that consumes endpoint definitions directly from `serviceSelectorRegistry.ts`. This makes the registry the Single Source of Truth and eliminates data duplication in tests.
*   **Refined `capabilityMapper` Logic:** Refactored the mapper to be a pure, registry-driven engine. It now dynamically instantiates and injects services based on definitions in `roleRegistry.ts`, removing all hardcoded logic.
*   **Standardized Internal Role Format:** Aligned the internal session `role` format with the `system|code` standard (e.g., `ISCO-08|1120`), ensuring consistency from session creation to DID generation.
*   **Decoupled Services from Network Context:** Refactored Host-level services (`createOrganization`, `confirmOrder`) to accept a `targetNetwork` parameter, removing hardcoded network context and improving architectural clarity.

### Fixed

*   **Corrected `JobRequest` Data Model:** The `JobManager` now correctly persists the `ServiceEndpointSelector` properties within the `JobRequest` object, fixing a critical data integrity issue.
*   **Aligned `JobManager` with `ICryptoHelper` Interface:** Corrected calls to `crypto.digest` to use the defined `crypto.digestString` method, resolving a `TypeError` at runtime.
*   **Resolved Test Suite Instability:** Fixed a resource leak where `setInterval` from the `JobManager` was not being cleaned up between tests. The test suite now uses `afterEach` for reliable session shutdown, ensuring a clean exit.
*   **Fixed `capabilityMapper` Role Parsing:** Corrected a bug where the mapper failed to parse the new `system|code` role format, which prevented the `OrgAdminService` from being instantiated.
*   **TDD Verification:** Implemented a full suite of tests for the `OrgAdminService`, covering both `createOrganization` and `confirmOrder` methods and verifying the entire architectural flow via mocked API calls.
*   **Man-in-the-Middle Security:** Replaced the `governingBodyDid` string with a proper, bundled Trust Anchor verification flow.
*   **Fixed Architectural Dependency Violation:** Removed direct `uuidv4` dependency from `BaseApiService` and moved UUID generation to the `ICryptoHelper` interface, respecting the hexagonal architecture.
*   **Fixed All Compilation & Runtime Errors:** Resolved dozens of TypeScript errors and the final runtime error related to dependency injection.

### Removed

*   **Removed `app.json`:** Consolidated all application configuration into `app.config.ts` to create a single source of truth.
*   **Removed Redundant `ICrypto` Interface:** Simplified the cryptographic abstraction to rely solely on `ICryptoHelper`.

---

## [Unreleased] - SDK early version

- **New Client SDK (`client-sdk-ts/`)**:
  - Created a new, standalone SDK to manage all backend interactions.
  - **`ClientSDK`**: The main entry point for initializing the SDK and managing sessions.
  - **`ProfileManager`**: A central, role-based hub for providing namespaced API services.
  - **`SmartTokenManager`**: A sophisticated manager for acquiring and caching `smartTokens` (Access Tokens), correctly modeling the `private_key_jwt` flow.
  - **Namespaced API Architecture**: Introduced a scalable, role-based API surface (e.g., `profileManager.admin.organization`).
    - `BaseApiService`: An abstract class providing a generic, robust engine (`resolveAndExecute`) for all API calls, handling DID resolution and secure job submission.
    - `AdminOrganizationService`: The first concrete service implementation.
  - **Built-in Mocking Engine**: Added a powerful testing and demonstration engine via `mockOptions` in the SDK configuration, allowing for:
    - Mocked API responses to test polling and error handling.
    - Mocked DID Document resolution.
    - Mocked network status.
  - **`README.md`**: Comprehensive documentation for the new SDK, explaining its architecture, security model, and usage.

- **New SDK Adapter Layer (`adapters-sdk-expo/`)**:
  - Created a dedicated directory to act as a bridge between the platform-agnostic SDK and the Expo environment.
  - `AdapterCryptoSdkExpo`: Implements the SDK's crypto interface using `expo-crypto`.
  - `AdapterNetworkSdkExpo`: Implements the SDK's network interface using `@react-native-community/netinfo`.
  - `AdapterApiConfigSdkExpo`: Implements the SDK's config interface using `expo-constants`.

### Changed

- **Core Architecture**: Shifted from a tightly-coupled, static manager pattern to a modern, decoupled architecture using Dependency Injection.
- **Security Model**:
  - Formally distinguished between **User Identity** (via OIDC `id_token` for Pre-DCR calls) and **Device Identity** (via `private_key_jwt` for Post-DCR calls).
  - The SDK now correctly models and manages this two-phase authentication flow.
- **`ProfileContext.tsx`**: Completely refactored to be a clean consumer of the new `ClientSDK`. It is now responsible for instantiating the SDK with the correct adapters and managing the `ProfileManager` session state.
- **`OrgRegisterRepresentativeScreen.tsx`**: Overhauled the submission logic to use the new SDK's namespaced API (`admin.organization.createOrganization`), correctly handling the creation of an authenticated session and passing the required `id_token`.
- **`OrgRegistrationManager.ts`**: Simplified this manager, removing its complex responsibilities (DID construction, message building) which are now correctly handled by the SDK. Its sole purpose is now to clean form data.

### Fixed

- **Decoupled API Calls**: Refactored `OrgDashboardScreen` and `OrgAuthScreen` to remove direct, static dependencies on the old managers, instead using the `useProfile` hook to interact with the session.

### Deprecated

- **`managers/ProfileManager.ts` and `managers/JobManager.ts`**: The original manager files have been archived by renaming them to `.txt`. Their functionality is now superseded by the new `client-sdk-ts`.
- **Static State Management**: Removed the old, global, static instance management from the original `ProfileManager`. Session state is now correctly managed within the `ClientSDK` instance and exposed via React Context.
