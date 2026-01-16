// utils/profileId.ts
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import * as Crypto from 'expo-crypto';

type ProfileIdParams = {
  appType: string;
  providerDid: string;
  email: string;
  role: string;
};

/**
 * Deterministic profile ID for a device session context.
 * Ensures distinct keys per appType + provider + role + email.
 */
export async function deriveProfileId({ appType, providerDid, email, role }: ProfileIdParams): Promise<string> {
  const normalizedEmail = email.trim().toLowerCase();
  const seed = [appType, providerDid, normalizedEmail, role].join('|');
  const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, seed);
  return `profile-${digest}`;
}
