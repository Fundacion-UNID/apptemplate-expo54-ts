// utils/ExpoCryptoHelper.ts
import * as Crypto from 'expo-crypto';
import { ICryptoHelper } from 'gdc-common-utils-ts/interfaces/ICryptoHelper';

/**
 * @class ExpoCryptoHelper
 * An adapter that implements the ICryptoHelper interface from the gdc-common-utils-ts library
 * using Expo's native crypto primitives. This class acts as a bridge between the
 * platform-agnostic core cryptography service and the Expo runtime.
 */
export class ExpoCryptoHelper implements ICryptoHelper {
  randomUUID(): string {
    return Crypto.randomUUID();
  }

  /**
   * Generates a specified number of random bytes.
   * @param byteCount The number of random bytes to generate.
   * @returns A Promise that resolves to a Uint8Array containing the random bytes.
   */
  getRandomBytes(byteCount: number): Promise<Uint8Array> {
    return Promise.resolve(Crypto.getRandomBytes(byteCount));
  }

  /**
   * Computes the digest of a string using a specified algorithm.
   * @param data The string to hash.
   * @param algorithm The cryptographic hash algorithm to use.
   * @returns A Promise that resolves to the hex-encoded hash string.
   */
  digestString(data: string, algorithm: Crypto.CryptoDigestAlgorithm): Promise<string> {
    return Crypto.digestStringAsync(algorithm, data);
  }
}
