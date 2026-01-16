// 
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
 
// import { CryptographicSignatureAbstract } from './signature.abstract';
import { Content } from 'gdc-common-utils-ts/utils/content';

export class MockSignatureManager { // extends CryptographicSignatureAbstract {
  
  async sign(dataBytes) {
    const mockSignature = new TextEncoder().encode('mock-signature');
    return Promise.resolve(mockSignature);
  }

  // dataJWT: { header, payload }
  async signAndCompactJWT(dataJWT) {
    const headerB64 = Content.objectToRawBase64UrlSafe(dataJWT.header);
    const payloadB64 = Content.objectToRawBase64UrlSafe(dataJWT.payload);
    const signatureB64 = Content.objectToRawBase64UrlSafe({ mock: true }); // fake signature
    return `${headerB64}.${payloadB64}.${signatureB64}`;
  }

  
  async verify(dataBytes) {
    return true;
  }

  async verifyCompactJWT(compactJWT) {
    const parts = compactJWT.split('.');
    if (parts.length !== 3) return false;
    try {
      const header = Content.base64UrlSafeToJSON(parts[0]);
      const payload = Content.base64UrlSafeToJSON(parts[1]);
      return !!header && !!payload;
    } catch {
      return false;
    }
  }
}
