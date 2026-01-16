// utils/jwt.ts
// Minimal JWT helpers to validate expiration without extra dependencies.

type JwtPayload = {
  exp?: number;
};

const decodeBase64Url = (input: string): string | null => {
  try {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    if (typeof atob === 'function') {
      return atob(padded);
    }
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(padded, 'base64').toString('utf8');
    }
  } catch {
    return null;
  }
  return null;
};

export const getJwtPayload = (token?: string | null): JwtPayload | null => {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  const decoded = decodeBase64Url(parts[1]);
  if (!decoded) return null;
  try {
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
};

export const isJwtExpired = (token?: string | null, skewSeconds = 30): boolean => {
  const payload = getJwtPayload(token);
  if (!payload?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now + skewSeconds;
};
