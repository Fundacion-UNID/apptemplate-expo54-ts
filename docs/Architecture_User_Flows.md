# System Architecture: User Flows and Device Registration

This document outlines the architectural design for user authentication, profile creation, and device registration. It employs a modern, secure, and identity-centric approach by combining standard OIDC for user authentication with a DIDComm-based, DCR-like pattern for cryptographic profile and device registration.

## Components Overview

-   **Expo App (Client)**: The user-facing application. Manages stateful local cryptographic profiles (`ProfileManager`, with `status: 'pending' | 'active'`) and orchestrates registration flows (`ProfileDeviceRegistrationManager`).
-   **Firebase Authentication**: The trusted third-party Identity Provider (IdP) for authenticating users via Google, Apple, etc., using the OpenID Connect (OIDC) standard.
-   **Backend API**: The custom server that manages user profiles, devices, and business logic. It trusts Firebase as the OIDC provider.
-   **Database**: The persistent storage for the Backend API, containing user profiles, public keys, and registered device information (e.g., push tokens).
-   **Email Service**: An external service (e.g., SendGrid, AWS SES) triggered by the backend to send security notifications.

---

## Flow 1: New User & First Device Registration

This flow is for a new user creating their account and registering their first device. The process is seamless and does not require an activation code, as the registration of the organization serves as implicit activation. The local profile is created directly with an `'active'` status.

```mermaid
sequenceDiagram
    actor User
    participant ExpoApp as Expo App (UI)
    participant ProfileManager as ProfileManager (Local)
    participant RegManager as ProfileDeviceRegistrationManager
    participant Firebase
    participant Backend

    User->>ExpoApp: Clicks "Register with Google"
    activate ExpoApp
    ExpoApp->>Firebase: Initiates OIDC login flow
    activate Firebase
    Firebase-->>ExpoApp: Returns OIDC id_token
    deactivate Firebase
    
    note right of ExpoApp: Profile is created locally with 'active' status for the first device.
    ExpoApp->>ProfileManager: createAnonymousSession(user.uid, 'active')
    activate ProfileManager
    ProfileManager-->>ExpoApp: Local profile with crypto keys created (status: active)
    deactivate ProfileManager

    ExpoApp->>RegManager: registerProfileAndDevice(id_token)
    activate RegManager
    RegManager->>Backend: POST /register-profile (DIDComm msg, Auth: Bearer id_token)
    activate Backend
    Backend->>Firebase: Validate id_token
    Backend->>Backend: Store user profile, JWKS, and device push token in DB
    Backend-->>RegManager: Success response
    deactivate Backend
    
    RegManager-->>ExpoApp: Registration successful
    deactivate RegManager
    
    ExpoApp->>ExpoApp: Navigate to OrgNewEntityScreen
    deactivate ExpoApp
```

---

## Flow 2: Existing User Login & New Device Activation

This flow describes a returning user logging in from a new, unrecognized device. This is a security-critical path that requires explicit device activation to proceed. The local profile is initially created in a `'pending'` state until activation is complete.

```mermaid
sequenceDiagram
    actor User
    participant ExpoApp as Expo App (UI)
    participant ActivateDeviceScreen as ActivateDeviceScreen
    participant ProfileManager as ProfileManager (Local)
    participant RegManager as ProfileDeviceRegistrationManager
    participant Firebase
    participant Backend
    participant EmailService

    User->>ExpoApp: Clicks "Login with Google" on new device
    activate ExpoApp
    ExpoApp->>Firebase: OIDC login flow
    Firebase-->>ExpoApp: Returns OIDC id_token & user.uid
    
    ExpoApp->>ProfileManager: getProfileById(user.uid)
    ProfileManager-->>ExpoApp: Returns null (no local profile found)

    note right of ExpoApp: App knows this is a new device. Create a pending local profile.
    ExpoApp->>ProfileManager: createAnonymousSession(user.uid, 'pending')
    activate ProfileManager
    ProfileManager-->>ExpoApp: Local profile created (status: pending)
    deactivate ProfileManager

    ExpoApp->>ActivateDeviceScreen: Navigate to Activate Device Screen
    deactivate ExpoApp
    activate ActivateDeviceScreen

    User->>ActivateDeviceScreen: Enters Activation Code
    ActivateDeviceScreen->>RegManager: registerProfileAndDevice(id_token, activationCode)
    activate RegManager
    
    RegManager->>Backend: POST /register-profile (DIDComm, Auth: Bearer id_token, Code)
    activate Backend
    Backend->>Backend: Validate Activation Code
    Backend->>Backend: Add new device to existing user profile in DB
    Backend->>EmailService: Trigger "New Device Login" notification
    Backend-->>RegManager: Success response
    deactivate Backend
    
    RegManager-->>ActivateDeviceScreen: Registration successful
    deactivate RegManager
    
    note left of ActivateDeviceScreen: Now, promote the local profile to active.
    ActivateDeviceScreen->>ProfileManager: updateProfileStatus(user.uid, 'active')
    activate ProfileManager
    ProfileManager-->>ActivateDeviceScreen: Local profile updated (status: active)
    deactivate ProfileManager

    ActivateDeviceScreen->>ExpoApp: Navigate to App Dashboard
    deactivate ActivateDeviceScreen
```

## Security Model

### New Device Login Notifications
As detailed in Flow 2, the backend **must** send an email notification to the user's registered email address whenever a new device is registered to their profile. This is a critical security measure.

### Device Activation Codes
The device activation step is a core part of the security model for existing users.
1.  A user attempts to log in from an unrecognized device.
2.  A local profile is created with a `'pending'` status. This prevents the user from accessing the main app until activation is complete.
3.  The user is forced to navigate to the `ActivateDeviceScreen`.
4.  The user must provide a valid activation code to proceed.
5.  Upon successful registration with the backend, the local profile's status is promoted to `'active'`.
This provides granular control over which devices can be associated with a professional's profile. For the initial implementation, the backend may accept an empty or default code, but the client-side flow is already in place.
