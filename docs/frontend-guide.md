# Frontend Architecture Guide

This document serves as the single source of truth for the app's frontend architecture, covering navigation, styling, internationalization, and accessibility conventions.

---

## 🔧 1. Navigation System

The navigation is structured in three layers:

a) **`RootNavigator.js`**: The top-level container. It holds:
    -   `<NavigationContainer>`: The root from `@react-navigation`.
    -   `<AccessibilityBar>`: A custom, always-visible bar at the top for theme, size, and language controls. It lives **outside** the Stack Navigator.
    -   `<StackNavigator>`: The main navigator which controls screens and the header.

b) **`HeaderBar.js`**: This is the default header for every screen in the StackNavigator.
    -   It is configured once in `RootNavigator`'s `screenOptions`.
    -   It automatically displays the screen's title (`route.name`) and a back button if navigation is possible.
    -   Screens can be excluded from this header using `options={{ headerShown: false }}`.

c) **`FamNavigator.js` / `OrgNavigator.js`**: These are nested Stack Navigators.
    -   Each defines the specific screen flow for the "Family" or "Organization" user journey.
    -   They are treated as single screens within the `RootNavigator`.

---

## 🔒 2. The Subject Context: A Unified Approach to Authorization

The application's authorization model is built around a central architectural concept: the **Subject Context**. This is the primary source of truth for determining *on whose behalf* the user is currently operating.

### a) Core Principle

The app is not monolithic; a user's actions are always performed within the context of a specific **Subject**. A Subject can be:
- The user themselves (e.g., during organization registration).
- A patient (e.g., when a doctor is accessing a health record via SMART on FHIR).
- An organization (e.g., when an admin is managing employees).
- A family member.

The active Subject determines which resources the user can access and what actions they can perform.

### b) The `SubjectContext` Provider

This architecture is implemented via `context/SubjectContext.tsx`. This global provider exposes:
- `subjectId`: The unique identifier for the current Subject (often their `did:web`).
- `accessToken`: The Bearer token associated with the Subject's current session.

Any component that performs an authorized action must source its token from this context.

### c) Token Lifecycle and Authorization Flows

The `accessToken` in the Subject Context is dynamic and changes depending on the user's workflow, aligning with modern security patterns like OAuth 2.0 and OpenID Connect.

**Phase 1: Organization & Representative Registration**
1.  A new user (the legal representative) authenticates via a third party (e.g., Google), receiving a Firebase `id_token`.
2.  Upon success, the app sets the **Subject Context**: `subjectId` becomes the user's Firebase UID, and `accessToken` becomes their `id_token`.
3.  This `id_token` is used as the **one-time Bearer token** for the organization registration transaction. It proves the representative's identity to the backend for this specific action.
4.  The frontend submits the registration form. The backend validates the `id_token` and, upon success, creates the organization and the representative's professional DID.

**Phase 2: Device Registration (DCR) on First Login**
1.  After Phase 1 is complete, the user performs their first login using their professional identity (e.g., by entering their organization's domain and their role). The app determines that no local profile exists for this identity on this device.
2.  The app authenticates the user again (e.g., via Google), obtaining a fresh **Firebase ID token** (JWT).
3.  If the identity provider is not directly supported on-device (e.g., eIDAS), the app first calls the **Tenant** normalizer endpoint (e.g., `POST /identity/firebase/Token/_custom`) to obtain a Firebase custom token and then signs in to obtain a Firebase ID token.
4.  The app exchanges `activation_code` + Firebase ID token for an **`initial_access_token`** scoped for DCR by calling the **Tenant** token exchange endpoint (`POST /identity/openid/Token/_exchange`) discovered via the tenant DID Document, with `Authorization: Bearer <firebase_id_token>` and body `{ "subject_token": "<activation_code>" }`.
5.  The app proceeds to the device activation screen, where it uses this `initial_access_token` to securely register the device with the backend (DCR), sending the device JWKS and other metadata, and receives a permanent `client_id` for the device.

**Phase 3: Operational Access (e.g., SMART on FHIR)**
1.  Once the device is registered, for day-to-day operations, the user initiates an authorization flow like **SMART on FHIR `launch`**.
2.  This flow results in a **new, short-lived `access_token`** that is specific to a resource (e.g., a patient, who becomes the new Subject).
3.  The app then switches the **Subject Context**: `subjectId` becomes the patient's DID, and `accessToken` becomes the new FHIR-scoped token.
4.  All subsequent API calls will now use this new token.

### d) The Stateless `JobManager`

The `JobManager` is designed to be **stateless** regarding authorization. It does not hold onto tokens. Instead, it processes self-contained "jobs" (DIDComm messages).
1.  When a job is created (e.g., by `OrgRegistrationManager`), it reads the **current `accessToken`** from the `SubjectContext`.
2.  This token is "sealed" inside the job's payload, at `content.meta.bearer.compact`.
3.  When `JobManager.sync()` runs, it processes jobs that are in a `pending_submission` state.
4.  For each job, `_submitJob` extracts the token **from the job's own payload** and places it in the `Authorization: Bearer` header for that specific HTTP request.

This ensures that every action is explicitly authorized by the token corresponding to the Subject that was active when the action was initiated, making the system secure, transactional, and scalable.

---

## 🎨 3. Styling & Theme System

All styling is centralized and driven by a single system for consistency.

a) **`constants/Styles.js`**: The heart of the styling system.
    -   `AppDimensions`: An object containing all base sizes (fonts, icons, spacing) for the entire app. This is the **single source of truth for sizing**.
    -   `getScreenStyles(scaleFactor)`: A function that takes the current `scaleFactor` and returns a StyleSheet with all dimensions correctly scaled. Components should always use this.

b) **`constants/Colors.js`**: Defines color palettes for `light` and `dark` modes.

c) **`context/AccessibilityContext.js`**: The global provider for user preferences.
    -   `interfaceSize`: 'S', 'M', or 'L'.
    -   `colorTheme`: 'light' or 'dark'.
    -   `scaleFactor`: A multiplier (e.g., S=0.8, M=1.0, L=1.2) derived from `interfaceSize`. This is the key value passed to `getScreenStyles`.

d) **Themed Components** (e.g., `ThemedButton`, `ThemedText`): These components are designed to be theme-aware and scalable out-of-the-box by using `useThemeColor` and `useAccessibilityContext`.

---

## 🌐 4. Internationalization (i18n)

The app supports multiple languages via `i18next`.

a) **File Structure**: Translations are split by language and domain (namespace).
    -   `locales/en/appCommon.js`: Shared terms (e.g., "Login", "Next").
    -   `locales/en/appOrganization.js`: Terms specific to the Organization flow.
    -   `locales/en/appFamily.js`: Terms specific to the Family flow.
    -   (Same structure for `es` and other languages).

b) **Key Convention**:
    -   Keys are structured like reverse DNS: `namespace.screen.element.type`.
    -   Example: `organization.screens.dashboard.options.identity-button-label`.
    -   Keys use dots (`.`) for nesting and hyphens (`-`) for descriptors like `-label` or `-placeholder`.

---

## ♿ 5. Accessibility (ARIA) Convention

To ensure the app is usable with screen readers, we follow a strict convention for interactive components.

a) **Rule**: All interactive components (Pressable, ThemedButton, ThemedInput, etc.) **must** have `accessible={true}` and an `accessibilityLabel`.

b) **Convention for Labels & Hints**:
    -   `accessibilityLabel`: Should reuse the translation key for the visible label (e.g., a key ending in `-label`).
    -   `accessibilityHint`: Should reuse the translation key for the placeholder text (e.g., a key ending in `-placeholder`), providing extra context.

c) **Example**:
    ```javascript
    <ThemedInput
      accessible={true}
      accessibilityLabel={t('key-for-visible-label')}
      accessibilityHint={t('key-for-placeholder-text')}
      placeholder={t('key-for-placeholder-text')}
    />
    ```
