// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: adapters-sdk-expo/crypto.ts

import * as Crypto from 'expo-crypto';
import { ICryptoHelper } from 'gdc-common-utils-ts/interfaces/ICryptoHelper';

/**
 * Implements the SDK's ICryptoHelper interface using the expo-crypto library.
 * This class acts as a direct adapter between the Expo environment
 * and the platform-agnostic SDK.
 */
export class AdapterCryptoSdkExpo implements ICryptoHelper {
  /**
   * Generates a random UUID using Expo's native capabilities.
   * @returns A string containing the UUID.
   */
  randomUUID(): string {
    return Crypto.randomUUID();
  }


  /**
   * Generates a specified number of cryptographically secure random bytes.
   * @param byteCount The number of bytes to generate.
   * @returns A Promise that resolves to a Uint8Array with the random bytes.
   */
  getRandomBytes(byteCount: number): Promise<Uint8Array> {
    return Crypto.getRandomBytesAsync(byteCount);
  }

  /**
   * Computes the cryptographic digest of a string using a specified algorithm.
   * @param data The string to hash.
   * @param algorithm The hash algorithm to use (e.g., 'SHA-256', 'SHA-384').
   * @returns A Promise that resolves to the digest as a hex string.
   */
  async digestString(data: string, algorithm: string): Promise<string> {
    let expoAlgorithm: Crypto.CryptoDigestAlgorithm;
    switch (algorithm.toUpperCase()) {
      case 'SHA256':
      case 'SHA-256':
        expoAlgorithm = Crypto.CryptoDigestAlgorithm.SHA256;
        break;
      case 'SHA384':
      case 'SHA-384':
        expoAlgorithm = Crypto.CryptoDigestAlgorithm.SHA384;
        break;
      case 'SHA512':
      case 'SHA-512':
        expoAlgorithm = Crypto.CryptoDigestAlgorithm.SHA512;
        break;
      default:
        throw new Error(`Unsupported digest algorithm: ${algorithm}`);
    }
    return await Crypto.digestStringAsync(expoAlgorithm, data, { encoding: Crypto.CryptoEncoding.HEX });
  }
}
