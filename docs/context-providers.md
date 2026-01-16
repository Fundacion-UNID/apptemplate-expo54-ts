# ADR 02: Global Context Providers

This document outlines the global React Context Providers used in the application, as defined in `App.js`. These providers wrap the entire application to supply cross-cutting concerns like state management, accessibility, and internationalization.

## Provider Stack

The application is wrapped in a series of nested providers. The order is important as inner providers may depend on contexts supplied by outer providers.

-   **`<AccessibilityProvider>`**: Manages UI preferences that affect the entire application, such as:
    -   `interfaceSize`: User-selected size ('S', 'M', 'L').
    -   `colorTheme`: User-selected theme ('light', 'dark').
    -   `scaleFactor`: A multiplier derived from `interfaceSize` used for dynamic styling.

-   **`<AppTypeProvider>`**: Determines the primary mode of the application (e.g., "Family" or "Organization"). This can be used to alter UI elements and available features.

-   **`<ProfileProvider>`**: Manages the currently active user profile, including their identity, keys, and other session-related data.

-   **`<AuthorizationProvider>`**: Manages authorization policies and access control based on the active profile's roles and permissions.

-   **`<DirectoryProvider>`**: Manages contact lists, trusted parties, and other directory-related information.

-   **`<JobProvider>`**: Manages the lifecycle of asynchronous tasks ("jobs"), such as submitting data to a backend, handling offline queueing, and polling for results.

-   **`<SubjectProvider>`**: **Architectural Core.** Manages the application's current operational context (the "Subject"). It holds the active `subjectId` (e.g., a patient DID, the user's own DID) and the `accessToken` associated with that subject's session. This is the central source of truth for all transactional authorization.

-   **`<I18nextProvider>`**: Supplies the `i18next` instance for internationalization (translations) throughout the component tree.
