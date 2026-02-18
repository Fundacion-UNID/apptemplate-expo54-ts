import Constants from 'expo-constants';

export type RoleDomain = 'family' | 'organization';

const readConfig = (extraKey: string, envKey: string, fallback: string): string => {
  const extra = Constants.expoConfig?.extra ?? {};
  const raw = extra[extraKey] ?? process.env[envKey];
  const value = typeof raw === 'string' ? raw.trim() : '';
  return value || fallback;
};

const readBoolConfig = (extraKey: string, envKey: string, fallback: boolean): boolean => {
  const extra = Constants.expoConfig?.extra ?? {};
  const raw = extra[extraKey] ?? process.env[envKey];
  if (typeof raw === 'boolean') return raw;
  if (typeof raw === 'string') return raw.trim().toLowerCase() === 'true';
  return fallback;
};

export const extractRoleCode = (role: string, fallback = 'unknown-role'): string => {
  const raw = (role || '').trim();
  if (!raw) return fallback;
  const parts = raw.split('|');
  if (parts.length === 2) return (parts[1] || '').trim() || fallback;
  return raw;
};

export const toDidRoleCode = (role: string, fallback = 'ONESELF'): string =>
  extractRoleCode(role, fallback).toUpperCase();

export const getRoleCodingSystem = (domain: RoleDomain): string => {
  if (domain === 'family') {
    return readConfig('FAMILY_ROLE_CODING_SYSTEM', 'EXPO_PUBLIC_FAMILY_ROLE_CODING_SYSTEM', 'org.hl7.v3.RoleCode');
  }
  return readConfig('ORG_ROLE_CODING_SYSTEM', 'EXPO_PUBLIC_ORG_ROLE_CODING_SYSTEM', 'org.ilo.isco-08');
};

export const shouldSendRoleAsToken = (domain: RoleDomain): boolean => {
  if (domain === 'family') {
    return readBoolConfig('FAMILY_ROLE_SEND_SYSTEM', 'EXPO_PUBLIC_FAMILY_ROLE_SEND_SYSTEM', true);
  }
  return readBoolConfig('ORG_ROLE_SEND_SYSTEM', 'EXPO_PUBLIC_ORG_ROLE_SEND_SYSTEM', true);
};

export const toBackendRole = (role: string, domain: RoleDomain): string => {
  const code = extractRoleCode(role, domain === 'family' ? 'ONESELF' : 'unknown-role');
  if (!shouldSendRoleAsToken(domain)) return code;
  return `${getRoleCodingSystem(domain)}|${code}`;
};
