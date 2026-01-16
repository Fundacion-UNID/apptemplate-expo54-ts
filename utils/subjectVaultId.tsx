// utils/subjectVaultId.ts
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import * as Crypto from 'expo-crypto';

export async function deriveSubjectVaultId(profileId: string, subjectDid: string): Promise<string> {
  const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, subjectDid);
  return `${profileId}:subject:${digest}`;
}
