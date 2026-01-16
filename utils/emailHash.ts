// utils/emailHash.ts

import * as Crypto from 'expo-crypto';

export const hashEmail = async (email: string): Promise<string> => {
  const normalized = email.trim().toLowerCase();
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, normalized);
};
