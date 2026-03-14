// managers/ExpoWallet.ts
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import * as Crypto from 'expo-crypto';
import { CryptoDigestAlgorithm } from 'expo-crypto';
import { ICryptoHelper } from 'gdc-common-utils-ts/interfaces/ICryptoHelper';
import { IWallet } from 'gdc-common-utils-ts/interfaces/IWallet';
import { CryptographyService } from 'gdc-common-utils-ts/CryptographyService';
import { JWK, JwkSet } from 'gdc-common-utils-ts/models/jwk';

/**
 * @class ExpoCryptoHelper
 * Adapter that implements the ICryptoHelper interface from gdc-common-utils-ts
 * using Expo's native crypto primitives. This is the bridge between the
 * platform-agnostic core and the Expo runtime.
 */
class ExpoCryptoHelper implements ICryptoHelper {
  randomUUID(): string {
    return Crypto.randomUUID();
  }

  getRandomBytes(byteCount: number): Promise<Uint8Array> {
    return Promise.resolve(Crypto.getRandomBytes(byteCount));
  }
  digestString(data: string, algorithm: string): Promise<string> {
    // This is the "adapter" layer. We cast the generic string from the
    // agnostic interface to the specific type required by the expo-crypto library.
    // This is where the responsibility of platform-specific typing lies.
    return Crypto.digestStringAsync(algorithm as CryptoDigestAlgorithm, data);
  }
}

/**
 * @class ExpoWallet
 * The concrete, production-ready implementation of the Wallet for the Expo platform.
 * It directly adapts the logic from KmsService.txt for the client-side.
 */
export class ExpoWallet implements IWallet {
  private cryptoService: CryptographyService;
  private cryptoHelper: ICryptoHelper;
  private _managedKeys = new Map<string, any>();

  constructor() {
    this.cryptoHelper = new ExpoCryptoHelper();
    this.cryptoService = new CryptographyService(this.cryptoHelper);
    console.log("[ExpoWallet] PRODUCTION instance created, crypto engine configured.");
  }

  /**
   * Creates a cryptographic digest (hash) of a string.
   * This method fulfills the IWallet interface contract.
   * @param data The string to hash.
   * @param algorithm The digest algorithm to use.
   * @returns A promise that resolves to the hex-encoded hash string.
   */
  async digest(data: string, algorithm: any): Promise<string> {
    return this.cryptoHelper.digestString(data, algorithm);
  }

  /**
   * Provisions a real, full set of cryptographic keys for an entity.
   * This is a direct adaptation of the KmsService.provisionKeys logic.
   * @param entityId The unique identifier for the key set.
   * @returns A promise that resolves to the public parts of the generated keys.
   */
  async provisionKeys(entityId: string): Promise<JwkSet> {
    const existingKeys = this._managedKeys.get(entityId);
    if (existingKeys?.verificationKeyPair?.publicJWKey && existingKeys?.encryptionKeyPair?.publicJWKey) {
      console.log(`[ExpoWallet] Reusing existing keys for entity: ${entityId}`);
      return {
        keys: [
          existingKeys.verificationKeyPair.publicJWKey as JWK,
          existingKeys.encryptionKeyPair.publicJWKey as JWK,
        ],
      };
    }

    console.log(`[ExpoWallet] (PRODUCTION) Provisioning REAL keys for entity: ${entityId}`);

    let dsaSeed: Uint8Array;
    let kemSeed: Uint8Array;

    // Use deterministic keys in DEV mode, as per KmsService.txt logic
    if (__DEV__) {
      console.log(`[ExpoWallet] Using deterministic seeds for DEV environment.`);
      const dsaSeedString = await this.digest(entityId + '-dsa', 'SHA-256');
      const kemSeedString = await this.digest(entityId + '-kem', 'SHA-256');
      dsaSeed = new TextEncoder().encode(dsaSeedString).slice(0, 32);
      kemSeed = new TextEncoder().encode(kemSeedString).slice(0, 64);
    } else {
      dsaSeed = await this.cryptoHelper.getRandomBytes(32);
      kemSeed = await this.cryptoHelper.getRandomBytes(64);
    }

    const hmacKeyString = await this.digest(entityId + '-hmac', 'SHA-256');
    const dataEncryptionKeyString = await this.digest(entityId + '-dek', 'SHA-256');
    const hmacKey = new TextEncoder().encode(hmacKeyString).slice(0, 32);
    const dataEncryptionKey = new TextEncoder().encode(dataEncryptionKeyString).slice(0, 32);
   
    const verificationKeyPair = await this.cryptoService.generateKeyPairMlDsa(dsaSeed);
    const encryptionKeyPair = await this.cryptoService.generateKeyPairMlKem(kemSeed);

    this._managedKeys.set(entityId, {
      verificationKeyPair,
      encryptionKeyPair,
      hmacKey: hmacKey,
      dataEncryptionKey: dataEncryptionKey,
    });

    console.log(`[ExpoWallet] (PRODUCTION)   - Signing Key Provisioned. kid: ${verificationKeyPair.publicJWKey.kid}`);
    console.log(`[ExpoWallet] (PRODUCTION)   - Encryption Key Provisioned. kid: ${encryptionKeyPair.publicJWKey.kid}`);

    const publicKeys: JwkSet = {
      keys: [verificationKeyPair.publicJWKey as JWK, encryptionKeyPair.publicJWKey as JWK],
    };
    return publicKeys;
  }

  /**
   * Encrypts a document for secure, local storage.
   * Adapts KmsService.protectConfidentialData logic.
   */
  async protectConfidentialData(doc: any, entityId: string): Promise<any> {
    if (!doc.content) return doc;
    
    const keys = this._managedKeys.get(entityId);
    if (!keys || !keys.dataEncryptionKey) {
      throw new Error(`[ExpoWallet] Cannot protect data. No keys or DEK found for entity: ${entityId}`);
    }

    const contentString = JSON.stringify(doc.content);
    const encryptedData = await this.cryptoService.encrypt(contentString, keys.dataEncryptionKey, entityId);
    
    const { content, ...docWithoutContent } = doc;
    return { ...docWithoutContent, jwe: encryptedData };
  }

  /**
   * Decrypts a document from secure storage.
   * Adapts KmsService.unprotectConfidentialData logic.
   */
  async unprotectConfidentialData(doc: any, entityId: string): Promise<any> {
    if (!doc.jwe) return doc;

    const keys = this._managedKeys.get(entityId);
    if (!keys || !keys.dataEncryptionKey) {
      throw new Error(`[ExpoWallet] Cannot unprotect data. No keys or DEK found for entity: ${entityId}`);
    }
    
    const decryptedString = await this.cryptoService.decrypt(doc.jwe, keys.dataEncryptionKey, entityId);
    const content = JSON.parse(decryptedString);

    const { jwe, ...docWithoutJwe } = doc;
    return { ...docWithoutJwe, content: content };
  }
}
