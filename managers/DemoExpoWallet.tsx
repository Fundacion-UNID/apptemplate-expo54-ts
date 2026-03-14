// managers/DemoExpoWallet.ts
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import * as Crypto from 'expo-crypto';
import { CryptoDigestAlgorithm } from 'expo-crypto'; // <-- IMPORT FIX
import { CryptographyService } from 'gdc-common-utils-ts/CryptographyService';
import { JWK, JwkSet } from 'gdc-common-utils-ts/models/jwk';
import { IWallet } from 'gdc-common-utils-ts/interfaces/IWallet';
import { ICryptoHelper } from 'gdc-common-utils-ts/interfaces/ICryptoHelper';

/**
 * @class ExpoCryptoHelper
 * A Types implementation of the ICryptoHelper interface for the Expo platform.
 */
class ExpoCryptoHelper implements ICryptoHelper {
  randomUUID(): string {
    return Crypto.randomUUID();
  }

  getRandomBytes(byteCount: number): Promise<Uint8Array> {
    return Promise.resolve(Crypto.getRandomBytes(byteCount));
  }

  digestString(data: string, algorithm: CryptoDigestAlgorithm): Promise<string> {
    return Crypto.digestStringAsync(algorithm, data);
  }
}

/**
 * @class DemoExpoWallet
 * The concrete Wallet implementation for the Expo platform.
 */
export class DemoExpoWallet implements IWallet {
  cryptoService: CryptographyService;
  cryptoHelper: ICryptoHelper;
  _managedKeys = new Map();

  constructor() {
    this.cryptoHelper = new ExpoCryptoHelper();
    this.cryptoService = new CryptographyService(this.cryptoHelper);
    console.log("[DemoExpoWallet] Instance created and configured with Expo crypto engine.");
  }

  async digest(data: string, algorithm: CryptoDigestAlgorithm): Promise<string> {
    return this.cryptoHelper.digestString(data, algorithm);
  }

  async provisionKeys(entityId: string): Promise<JwkSet> {
    const existingKeys = this._managedKeys.get(entityId);
    if (existingKeys?.verificationKeyPair?.publicJWKey && existingKeys?.encryptionKeyPair?.publicJWKey) {
      console.log(`[DemoExpoWallet] Reusing existing keys for entity: ${entityId}`);
      return {
        keys: [
          existingKeys.verificationKeyPair.publicJWKey as JWK,
          existingKeys.encryptionKeyPair.publicJWKey as JWK,
        ],
      };
    }

    console.log(`[DemoExpoWallet] Provisioning new keys for entity: ${entityId}`);
    
    const dsaSeedString = await this.digest(entityId + '-dsa', CryptoDigestAlgorithm.SHA256);
    const kemSeedString = await this.digest(entityId + '-kem', CryptoDigestAlgorithm.SHA256);
    const hmacKeyString = await this.digest(entityId + '-hmac', CryptoDigestAlgorithm.SHA256);

    const dsaSeed = new TextEncoder().encode(dsaSeedString);
    const kemSeed = new TextEncoder().encode(kemSeedString);
    
    const verificationKeyPair = await this.cryptoService.generateKeyPairMlDsa(dsaSeed);
    const encryptionKeyPair = await this.cryptoService.generateKeyPairMlKem(kemSeed);

    this._managedKeys.set(entityId, {
      verificationKeyPair,
      encryptionKeyPair,
      hmacKey: new TextEncoder().encode(hmacKeyString),
    });

    console.log(`[DemoExpoWallet]   - Signing Key Provisioned. kid: ${verificationKeyPair.publicJWKey.kid}`);
    console.log(`[DemoExpoWallet]   - Encryption Key Provisioned. kid: ${encryptionKeyPair.publicJWKey.kid}`);

    // Return in the correct JwkSet format
    return {
      keys: [
        verificationKeyPair.publicJWKey as JWK,
        encryptionKeyPair.publicJWKey as JWK,
      ],
    };
  }

  async protectConfidentialData(doc: any, entityId: string): Promise<any> {
    if (!doc.content) return doc;
    
    const keys = this._managedKeys.get(entityId);
    if (!keys) {
      throw new Error(`[DemoExpoWallet] Cannot protect data. No keys found for entity: ${entityId}`);
    }
    
    const { content, ...docWithoutContent } = doc;
    const simulatedJwe = { 
      protected: {
        alg: keys.encryptionKeyPair.publicJWKey.alg,
        enc: 'A256GCM',
        kid: keys.encryptionKeyPair.publicJWKey.kid
      }, 
      ciphertext: JSON.stringify(content)
    };
    
    return { ...docWithoutContent, jwe: simulatedJwe };
  }

  async   unprotectConfidentialData(doc: any): Promise<any> {
    if (!doc.jwe) return doc;
    const jweObject = typeof doc.jwe === 'string' ? JSON.parse(doc.jwe) : doc.jwe;
    
    if (jweObject.ciphertext === undefined) {
      throw new Error('DemoExpoWallet: Invalid simulated JWE. Missing "ciphertext".');
    }
    const content = JSON.parse(jweObject.ciphertext);
    
    const { jwe, ...docWithoutJwe } = doc;
    return Promise.resolve({ ...docWithoutJwe, content: content });
  }

  /**
   * Simulates the unpacking of a secure message from the server.
   * This is the client-side counterpart to the KmsService.decodeRequest method.
   * It mirrors the logic of checking for a nested JWS based on the 'cty' header.
   */
  async unpack(packedMessage: string): Promise<{ content: any, meta: any }> {
    console.log("[DemoExpoWallet] Unpacking received message:", packedMessage);
    
    // For FAPI JARM, the response is typically a URL-encoded parameter.
    // The standard parameter name is 'response'.
    const jweString = new URLSearchParams(packedMessage).get('response');

    if (!jweString) {
      // Fallback: If not a FAPI JARM response, assume the entire body is the payload.
      // This could be a plain JSON object or a compact JWE string.
      try {
        // Attempt to parse as a JWE object first (simulation)
        const jweObject = JSON.parse(packedMessage);
        if (jweObject.ciphertext) {
          const nestedPayload = JSON.parse(jweObject.ciphertext);
          return { content: nestedPayload, meta: { jwe: { header: jweObject.protected } } };
        }
        // If not a JWE, it must be the content itself.
        console.log("[DemoExpoWallet]   - Message is plain JSON.");
        return { content: jweObject, meta: {} };
      } catch (e) {
        throw new Error("Failed to parse packed message. It is not a valid FAPI response or a JSON string.");
      }
    }

    console.log("[DemoExpoWallet]   - Found 'response' parameter, processing as JWE.");
    const jweObject = JSON.parse(jweString);
    const protectedHeader = jweObject.protected || {};
    
    // The ciphertext is the nested payload.
    const nestedPayload = jweObject.ciphertext;

    if (protectedHeader.cty === 'JWS') {
      // Case 1: The payload is a simulated JWS. We parse it.
      console.log("[DemoExpoWallet]   - JWE 'cty' is JWS. Unpacking nested JWS.");
      const jwsObject = JSON.parse(nestedPayload);
      const jwsPayload = JSON.parse(jwsObject.payload);
      return {
        content: jwsPayload,
        meta: { jws: jwsObject, jwe: { header: protectedHeader } },
      };
    } else {
      // Case 2: The payload is a direct JSON object.
      console.log("[DemoExpoWallet]   - No JWE 'cty'. Assuming direct JSON payload.");
      const content = JSON.parse(nestedPayload);
      return {
        content: content,
        meta: { jwe: { header: protectedHeader } },
      };
    }
  }
}
