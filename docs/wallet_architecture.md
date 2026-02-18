# Wallet SDK Architecture

This document outlines the architecture for the client-side Wallet SDK, a self-contained system responsible for identity management, cryptography, and secure offline-first storage.

## Core Principles

1.  **Separation of Concerns**: The architecture is layered to decouple application logic from platform-specific implementations and pure cryptographic operations.
2.  **Dependency Injection**: High-level modules are agnostic of low-level implementations. Dependencies are injected, making the system portable and testable.
3.  **Offline-First**: The primary source of truth is the local, on-device storage. Cloud services are used for backup and synchronization, not as the primary data store.
4.  **Platform Agnosticism**: The core cryptographic engine (`gdc-common-utils-ts`) is written in pure TypeScript and has zero dependencies on any specific runtime (like Expo or Node), making it reusable across any JavaScript/TypeScript project.

## Architectural Layers

The system is designed as a pyramid of responsibilities. Higher-level layers orchestrate the layers below them.

```mermaid
graph TD
    subgraph "UI Layer (The Consumer)"
        Screen[OrgRegisterRepresentativeScreen.js]
    end
    
    subgraph "App Logic Layer (The Conductor)"
        PM[ProfileManager.js]
    end

    subgraph "Platform Implementation Layer (The Adapter)"
        EW[managers/ExpoWallet.ts]
    end

    subgraph "Agnostic Core SDK (gdc-common-utils-ts)"
        IWallet[interfaces/IWallet.ts]
        CS[CryptographyService.ts]
        RandomGenInterface[interfaces/RandomGenerator.ts]
    end

    subgraph "Platform-Specific Primitives (The Bridge)"
        ERG[ExpoRandomGenerator (private to ExpoWallet)]
        ExpoCrypto[expo-crypto library]
    end

    Screen -- "1. Calls `ProfileManager.createAnonymousSession()`" --> PM
    PM -- "2. Instantiates `new ExpoWallet()`" --> EW
    EW -- "3. Implements" --> IWallet
    EW -- "4. Instantiates `new CryptographyService(randomGenerator)`" --> CS
    EW -- "5. Instantiates `new ExpoRandomGenerator()`" --> ERG
    CS -- "6. Depends on" --> RandomGenInterface
    ERG -- "7. Implements" --> RandomGenInterface
    ERG -- "8. Calls" --> ExpoCrypto
```

### 1. UI Layer (`screens/`)
*   **Responsibility**: To capture user input and trigger high-level business logic.
*   **Knowledge**: It should only know about the `ProfileManager`. It is not aware of `Wallet`, `CryptographyService`, or any implementation details.
*   **Example**: `OrgRegisterRepresentativeScreen.js`.

### 2. App Logic Layer (`ProfileManager.js`)
*   **Responsibility**: The "Conductor". It orchestrates the creation and management of user identities (profiles). It contains the application's business rules for profiles.
*   **Knowledge**: It knows it needs a concrete "Wallet" implementation to do its job. It is responsible for instantiating the platform-specific wallet (e.g., `new ExpoWallet()`).
*   **Flow**: When asked to create a session, it instantiates the appropriate Wallet, uses the Wallet to provision keys, builds the profile object with those keys, and returns the complete session (`{ profile, wallet }`) to the UI.

### 3. Platform Implementation Layer (`managers/ExpoWallet.ts`)
*   **Responsibility**: The "Adapter". It bridges the platform-agnostic `gdc-common-utils-ts` SDK with the specific runtime environment (Expo).
*   **Knowledge**: This is the **only** high-level module that should `import` platform-specific libraries like `expo-crypto`.
*   **Flow**:
    1.  It implements the `IWallet` interface defined in `gdc-common-utils-ts`.
    2.  It contains the private `ExpoRandomGenerator` class, which implements the `RandomGenerator` interface using `expo-crypto`.
    3.  In its constructor, it instantiates the `CryptographyService` (from `gdc-common-utils-ts`) and injects the `ExpoRandomGenerator` into it.
    4.  It exposes methods like `provisionKeys`, which delegate the complex cryptographic work to the `CryptographyService` instance it owns.

### 4. Agnostic Core SDK (`gdc-common-utils-ts/`)
*   **Responsibility**: The "Engine". Performs pure, stateless cryptographic operations. This entire directory is intended to be published as a reusable, framework-agnostic library.
*   **Knowledge**: It has **zero knowledge** of Expo, Node, or any specific runtime. It operates only on the data and dependencies (like a `RandomGenerator`) that are passed to it.
*   **Key Components**:
    *   `interfaces/IWallet.ts`: Defines the public contract for any wallet implementation.
    *   `interfaces/ICryptography.ts`: Defines the contract for the low-level crypto engine.
    *   `interfaces/RandomGenerator.ts`: Defines the contract for a provider of random bytes.
    *   `CryptographyService.ts`: The main class that performs crypto operations, relying on an injected `RandomGenerator`.

This architecture ensures that the core logic is portable and testable, while platform-specific details are cleanly isolated in a single, well-defined adapter layer.
# Wallet SDK Architecture

This document outlines the architecture for the client-side Wallet SDK, a self-contained system responsible for identity management, cryptography, and secure offline-first storage.

## Core Principles

1.  **Separation of Concerns**: The architecture is layered to decouple application logic from platform-specific implementations and pure cryptographic operations.
2.  **Dependency Injection**: High-level modules are agnostic of low-level implementations. Dependencies are injected, making the system portable and testable.
3.  **Offline-First**: The primary source of truth is the local, on-device storage. Cloud services are used for backup and synchronization, not as the primary data store.
4.  **Platform Agnosticism**: The core cryptographic engine (`gdc-common-utils-ts`) is written in pure TypeScript and has zero dependencies on any specific runtime (like Expo or Node), making it reusable across any JavaScript/TypeScript project.

## Architectural Layers

The system is designed as a pyramid of responsibilities, from the application's UI at the top to the platform-specific primitives at the bottom.

```mermaid
graph TD
    subgraph "UI Layer (The Consumer)"
        Screen[OrgRegisterRepresentativeScreen.js]
    end
    subgraph "App Logic Layer (The Conductor)"
        PM[ProfileManager.js]
    end
    subgraph "Platform Implementation Layer (The Adapter)"
        EW[ExpoWallet.js]
    end
    subgraph "Agnostic Core SDK (gdc-common-utils-ts)"
        CS[CryptographyService.ts]
    end
    subgraph "Platform-Specific Primitives"
        ERG[ExpoRandomGenerator (private to ExpoWallet)]
        ExpoCrypto[expo-crypto]
    end

    Screen -- "1. Instantiates and uses" --> PM
    Screen -- "2. Instantiates and injects" --> EW
    PM -- "3. Uses" --> EW
    EW -- "4. Instantiates and injects" --> ERG
    EW -- "5. Instantiates and uses" --> CS
    CS -- "6. Uses injected" --> ERG
    ERG -- "7. Calls" --> ExpoCrypto
```

### 1. UI Layer (`OrgRegisterRepresentativeScreen.js`)
*   **Responsibility**: To capture user input and trigger high-level actions.
*   **Knowledge**: It only knows that it needs a `ProfileManager` to handle identity-related tasks. It should not know how a `Wallet` or `CryptographyService` is constructed. For the "just-in-time" anonymous flow, it instantiates the necessary managers.

### 2. App Logic Layer (`ProfileManager.js`)
*   **Responsibility**: To orchestrate business logic related to user profiles. It acts as the primary entry point for the UI.
*   **Knowledge**: It knows that it needs an object that conforms to a "Wallet" interface to perform cryptographic operations. It does not know *how* that wallet is implemented (i.e., it doesn't know about Expo). It receives a concrete wallet implementation (`ExpoWallet`) via dependency injection.
*   **Key Methods**: `createAnonymousSession()`, `loadProfileSession()`.

### 3. Platform Implementation Layer (`ExpoWallet.js`)
*   **Responsibility**: To act as the "adapter" or "bridge" between the platform-agnostic core and the specific platform (Expo).
*   **Knowledge**: This is the only high-level module that is allowed to have direct knowledge of Expo. It implements the `IWallet` interface.
*   **Actions**:
    *   It instantiates the platform-specific `ExpoRandomGenerator`.
    *   It instantiates the platform-agnostic `CryptographyService` and injects the `ExpoRandomGenerator` into it.
    *   It exposes high-level cryptographic methods like `provisionKeys()`, which internally call the `CryptographyService`.

### 4. Agnostic Core SDK (`gdc-common-utils-ts/`)
*   **Responsibility**: To perform pure, stateless cryptographic operations. This is the reusable "engine".
*   **Knowledge**: It has zero knowledge of Expo, Node, or any specific runtime. It operates only on the data and dependencies (like a `RandomGenerator`) that are passed to it.
*   **Key Components**:
    *   `CryptographyService.ts`: The main class that performs crypto operations.
    *   `interfaces/`: Defines the contracts (`ICryptography`, `RandomGenerator`) that decouple the layers.
    *   `models/`: Contains all TypeScript types and interfaces for data structures (JWK, JWE, etc.).

## Key Data and Logic Flows

### Session Creation Flow
1.  The **UI** instantiates `ProfileManager` and `ExpoWallet`.
2.  The **UI** calls `profileManager.createAnonymousSession()`.
3.  The **ProfileManager** calls `this.wallet.provisionKeys()`.
4.  The **ExpoWallet** calls `this.cryptoService.generateKeyPair...()`.
5.  The **CryptographyService** calls `this.randomGenerator.getRandomBytes()` to get entropy.
6.  The **ExpoRandomGenerator** calls `expo-crypto` to get the native random bytes.
7.  The keys are generated and returned up the chain.
8.  The **ProfileManager** assembles the `profile` object with the new keys and returns the complete `{ profile, wallet }` session object to the UI.

This architecture ensures that the core logic is portable and testable, while platform-specific details are isolated in a single, well-defined adapter layer.


# Wallet SDK Architecture

This document outlines the architecture for the client-side Wallet SDK, a self-contained system responsible for identity management, cryptography, and secure offline-first storage.

## Core Principles

1.  **Separation of Concerns**: The architecture is layered to decouple application logic from platform-specific implementations and pure cryptographic operations.
2.  **Dependency Injection**: High-level modules are agnostic of low-level implementations. Dependencies are injected, making the system portable and testable.
3.  **Offline-First**: The primary source of truth is the local, on-device storage. Cloud services are used for backup and synchronization, not as the primary data store.
4.  **Platform Agnosticism**: The core cryptographic engine (`gdc-common-utils-ts`) is written in pure TypeScript and has zero dependencies on any specific runtime (like Expo or Node), making it reusable across any JavaScript/TypeScript project.

## Architectural Layers

The system is designed as a pyramid of responsibilities. Higher-level layers orchestrate the layers below them.

```mermaid
graph TD
    subgraph "UI Layer (The Consumer)"
        Screen[OrgRegisterRepresentativeScreen.js]
    end
    
    subgraph "App Logic Layer (The Conductor)"
        PM[ProfileManager.js]
    end

    subgraph "Platform Implementation Layer (The Adapter)"
        EW[managers/ExpoWallet.ts]
    end

    subgraph "Agnostic Core SDK (gdc-common-utils-ts)"
        IWallet[interfaces/IWallet.ts]
        CS[CryptographyService.ts]
        RandomGenInterface[interfaces/RandomGenerator.ts]
    end

    subgraph "Platform-Specific Primitives (The Bridge)"
        ERG[ExpoRandomGenerator (private to ExpoWallet)]
        ExpoCrypto[expo-crypto library]
    end

    Screen -- "1. Calls `ProfileManager.createAnonymousSession()`" --> PM
    PM -- "2. Instantiates `new ExpoWallet()`" --> EW
    EW -- "3. Implements" --> IWallet
    EW -- "4. Instantiates `new CryptographyService(randomGenerator)`" --> CS
    EW -- "5. Instantiates `new ExpoRandomGenerator()`" --> ERG
    CS -- "6. Depends on" --> RandomGenInterface
    ERG -- "7. Implements" --> RandomGenInterface
    ERG -- "8. Calls" --> ExpoCrypto
```

### 1. UI Layer (`screens/`)
*   **Responsibility**: To capture user input and trigger high-level business logic.
*   **Knowledge**: It should only know about the `ProfileManager`. It is not aware of `Wallet`, `CryptographyService`, or any implementation details.
*   **Example**: `OrgRegisterRepresentativeScreen.js`.

### 2. App Logic Layer (`ProfileManager.js`)
*   **Responsibility**: The "Conductor". It orchestrates the creation and management of user identities (profiles). It contains the application's business rules for profiles.
*   **Knowledge**: It knows it needs a concrete "Wallet" implementation to do its job. It is responsible for instantiating the platform-specific wallet (e.g., `new ExpoWallet()`).
*   **Flow**: When asked to create a session, it instantiates the appropriate Wallet, uses the Wallet to provision keys, builds the profile object with those keys, and returns the complete session (`{ profile, wallet }`) to the UI.

### 3. Platform Implementation Layer (`managers/ExpoWallet.ts`)
*   **Responsibility**: The "Adapter". It bridges the platform-agnostic `gdc-common-utils-ts` SDK with the specific runtime environment (Expo).
*   **Knowledge**: This is the **only** high-level module that should `import` platform-specific libraries like `expo-crypto`.
*   **Flow**:
    1.  It implements the `IWallet` interface defined in `gdc-common-utils-ts`.
    2.  It contains the private `ExpoRandomGenerator` class, which implements the `RandomGenerator` interface using `expo-crypto`.
    3.  In its constructor, it instantiates the `CryptographyService` (from `gdc-common-utils-ts`) and injects the `ExpoRandomGenerator` into it.
    4.  It exposes methods like `provisionKeys`, which delegate the complex cryptographic work to the `CryptographyService` instance it owns.

### 4. Agnostic Core SDK (`gdc-common-utils-ts/`)
*   **Responsibility**: The "Engine". Performs pure, stateless cryptographic operations. This entire directory is intended to be published as a reusable, framework-agnostic library.
*   **Knowledge**: It has **zero knowledge** of Expo, Node, or any specific runtime. It operates only on the data and dependencies (like a `RandomGenerator`) that are passed to it.
*   **Key Components**:
    *   `interfaces/IWallet.ts`: Defines the public contract for any wallet implementation.
    *   `interfaces/ICryptography.ts`: Defines the contract for the low-level crypto engine.
    *   `interfaces/RandomGenerator.ts`: Defines the contract for a provider of random bytes.
    *   `CryptographyService.ts`: The main class that performs crypto operations, relying on an injected `RandomGenerator`.

This architecture ensures that the core logic is portable and testable, while platform-specific details are cleanly isolated in a single, well-defined adapter layer.
