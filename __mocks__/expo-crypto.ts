// __mocks__/expo-crypto.js
const crypto = require('crypto');

/**
 * Manual mock for the 'expo-crypto' module.
 *
 * Why we mock this:
 * The real 'expo-crypto' relies on native code (via expo-modules-core) which
 * is not available in the Node.js environment where Jest runs our tests.
 * Attempting to import it directly causes a "Cannot find module" error.
 *
 * What this mock does:
 * It provides simple, predictable JavaScript implementations of the crypto
 * functions needed by the application's logic tests.
 */
export const CryptoDigestAlgorithm = {
  SHA256: 'SHA256',
};

export async function digestStringAsync(algorithm, data) {
  // Return a predictable, non-crypto hash for testing purposes.
  return Promise.resolve(`hashed-for-test[${data}]`);
}

/**
 * Provides a polyfill for the randomUUID function which is part of the
 * Web Crypto API but not available in all Node.js environments by default
 * when accessed via expo-crypto.
 */
export function randomUUID() {
  return crypto.randomUUID();
}
