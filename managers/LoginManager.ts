// managers/AuthManager.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { MockSignatureManager } from './SignManager';
import { Content } from 'gdc-common-utils-ts/utils/content';

export class AuthManagerMock {
  private signer: MockSignatureManager;
  private idToken: string | null;
  private payload: any;

  constructor(options: Record<string, unknown> = {}) {
    this.signer = new MockSignatureManager();
    this.idToken = null; // Store JWT here
    this.payload = null;
  }

  async codeVerificationExchange(email: string, code: string) {
    if (code !== '111') throw new Error('Invalid code');

    const payload = {
      sub: 'user123',
      email,
      sid: 'session-abc',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      iss: 'https://mock.auth',
      aud: 'mock-client-id',
      roles: ['role1'],
    };

    const header = { alg: 'none', typ: 'JWT' };
    const jwt = await this.signer.signAndCompactJWT({ header, payload });

    this.idToken = jwt;
    this.payload = payload;

    return {
      jwt,
      payload,
      valid: true,
    };
  }

  async requestVerificationCodeEmail(email: string) {
    console.log(`[AuthManager] Simulating request code for ${email}`);
    return { ok: true };
  }

  async validateCode(emailOrCode: string, code?: string) {
    const resolvedEmail = code ? emailOrCode : 'unknown@example.com';
    const resolvedCode = code ?? emailOrCode;
    const result = await this.codeVerificationExchange(resolvedEmail, resolvedCode);
    return result;
  }

  getIdToken() {
    return this.idToken;
  }

  getSession() {
    return this.payload;
  }

  parseJWT(jwt: string) {
    const parts = jwt.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');
    const [headerB64, payloadB64, signature] = parts;
    return {
      raw: jwt,
      header: Content.base64UrlSafeToJSON(headerB64),
      payload: Content.base64UrlSafeToJSON(payloadB64),
      signature,
    };
  }

  verifyJWT(jwt: string) {
    const parsed = this.parseJWT(jwt);
    if ((parsed.header as any)?.alg === 'none' && parsed.signature !== '') {
      throw new Error('Invalid JWT: alg "none" must have empty signature');
    }
    return { ...parsed, valid: true };
  }

  getHeaderJWT(jwt: string) {
    return this.parseJWT(jwt).header;
  }

  getPayloadJWT(jwt: string) {
    return this.parseJWT(jwt).payload;
  }
}
