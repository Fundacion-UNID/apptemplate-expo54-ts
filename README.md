# Expo SDK 54 Template for Data Spaces

This repository is a template for creating data space applications using Expo SDK 54. It is an evolving project that includes features like internationalization, a demo chat, and identity management components.

For a detailed guide on how this template was built, please see [SETUP_EXPO54_JS.md](SETUP_EXPO54_JS.md).

---

## 🏛️ Architecture

This project uses a sophisticated, offline-first, and secure architecture for handling asynchronous tasks and confidential data. For a detailed explanation of this system, please read the guide:

- **[Architecture Guide: Asynchronous Jobs & Secure Storage](ARCHITECTURE_JOBS.md)**

### A Multi-Package Ecosystem (Monorepo)

This repository is structured as a **monorepo** containing several independent, publishable packages. This architecture promotes a clean separation of concerns and allows for code reuse across different platforms (e.g., Expo, Angular, Vue).

The architecture is divided into two main layers:

#### 1. The Core Packages (The "Engine")

These are platform-agnostic, pure TypeScript libraries with zero dependencies on any specific UI framework.

-   **`crypto-ts/`**: A low-level cryptography library providing the fundamental cryptographic primitives and interfaces.
-   **`client-sdk-ts/`**: The main SDK "engine" that orchestrates business logic and defines the interfaces (`IWallet`, `ICryptoHelper`, etc.) that platform-specific packages must implement.

#### 2. The Platform Packages (The "Chassis" for Expo)

These packages form the bridge between the Core Engine and the Expo platform. To build an app for a different framework, you would create a similar set of adapter packages.

-   **`adapters-sdk-expo/`**: Contains low-level adapters that implement the SDK's interfaces using Expo APIs (e.g., `expo-crypto`).
-   **`database/`**: The data persistence layer for the Expo app, providing a concrete implementation of the `IVaultRepository` interface.
-   **`platformServices/`**: The high-level "glue" that assembles all platform-specific pieces, including the crucial `ExpoWallet` (the `IWallet` implementation) and the `createVaultForProfile` function.

---

## ✨ Features


-   **Platform-Agnostic SDK:** Includes a powerful `client-sdk-ts` for all backend interactions, designed with a clean, composable, and test-driven architecture.
-   **Complete Organization Onboarding Flow:** The SDK now fully implements and has end-to-end tests for the critical business flow of registering a new organization, including:
    -   `createOrganization`
    -   `confirmOrder`
-   **Dynamic Role-Based Capabilities:** Services are dynamically assembled at runtime based on user roles defined in a central `roleRegistry`, ensuring a scalable and maintainable codebase.

---

## 🚀 Running the Project

Follow these steps to run the project locally.

### 1. Install Dependencies
```bash
npm i
```
### 2. Start the Development Application
```bash
npx expo start
```

### 3. Launch the Application
Once the server is running, you will see several options in the terminal:
- **Press `w`** to launch the application in your web browser.
- **Scan the QR code** with the Expo Go app on your iOS or Android device.

For a clean start that clears the cache, you can use:
```bash
npx expo start -c
```

---

## ✅ Running Tests

This project includes a comprehensive test suite for the `client-sdk-ts` to ensure its reliability and correctness.

### Running All SDK Tests

To run the complete, isolated test suite for the `client-sdk-ts` package, use the new dedicated script:

```bash
npm run test:sdk
```

### Running a Specific Test File

To run a single test file (e.g., for `OrgAdminService`), you can specify the path to the file:

```bash
npm test client-sdk-ts/__tests__/OrgAdminService.test.ts
```
