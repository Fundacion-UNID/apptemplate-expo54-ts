# ADR 01: Wallet SDK Cryptography Strategy

This document outlines the architectural decisions for the cryptographic components of the Wallet SDK, ensuring consistency between the frontend (React Native/Expo) and the backend (Node.js).

## 1. Single Source of Truth

-   **Decision:** The TypeScript implementation of the cryptographic logic, currently located in the backend project (`src/crypto/CryptographyService.ts`), is designated as the **Single Source of Truth**.
-   **Reasoning:** The backend contains the complete, most up-to-date, and type-safe implementation of the Post-Quantum cryptography, key generation, and JWE/JWS handling. The frontend's JavaScript version is a direct port of this logic.
-   **Implication:** Any bug fixes, security enhancements, or logic changes **must** be made in the TypeScript `CryptographyService.ts` file first.

## 2. Manual Synchronization Mandate

-   **Decision:** Until the cryptographic logic is extracted into a shared, version-controlled NPM package, any changes made to the source of truth (`CryptographyService.ts`) **must be manually ported** to the corresponding JavaScript files in the frontend project (e.g., `crypto/Wallet.js`).
-   **Reasoning:** This is a temporary but critical technical debt we are accepting to ensure that both the client and server operate with identical cryptographic logic. Failure to synchronize will lead to signature verification errors, decryption failures, and other critical bugs.
-   **Process:**
    1.  Modify `CryptographyService.ts` in the backend project.
    2.  Transpile or manually convert the changes to standard JavaScript.
    3.  Update the corresponding files in the frontend project (`crypto/Wallet.js`).
    4.  It is the responsibility of the developer making the change to ensure this synchronization occurs.

## 3. Dependency Injection for Environment-Specific Primitives

-   **Decision:** The core cryptographic services must be agnostic of the underlying platform (Node.js, Browser, React Native). All platform-specific functions, especially for generating random numbers, must be provided via **Dependency Injection**.
-   **Reasoning:** Different environments have different APIs for secure random number generation:
    -   **Node.js:** `crypto.randomBytes`
    -   **React Native:** `expo-crypto.getRandomBytesAsync`
    -   **Web Browsers:** `window.crypto.getRandomValues`
-   **Implementation:** The SDK's cryptographic classes will not call these directly. Instead, they will receive a `RandomGenerator` implementation in their constructor.

### Example Implementation

```javascript
// In the SDK's CryptographyService
class CryptographyService {
  constructor(randomGenerator) {
    this.randomGenerator = randomGenerator;
  }

  async generateKey() {
    // Uses the injected dependency, not a global function
    const seed = await this.randomGenerator.getRandomBytes(32);
    // ...
  }
}

// In the Expo App's setup
import * as Crypto from 'expo-crypto';

const expoRandomGenerator = {
  async getRandomBytes(byteCount) {
    return await Crypto.getRandomBytesAsync(byteCount);
  }
};

const cryptoService = new CryptographyService(expoRandomGenerator);
```
