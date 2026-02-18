// utils/providerDid.ts
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
import { getBaseUrlFromDidWeb } from 'gdc-common-utils-ts/utils/did';

export const normalizeUrl = (rawValue: string) => {
  const trimmed = rawValue.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
};

export const buildDidFromProviderUrl = (providerUrl: string) => {
  const parsed = new URL(normalizeUrl(providerUrl));
  const host = parsed.host.toLowerCase().replace(':', '%3A');
  const path = parsed.pathname.replace(/^\/|\/$/g, '');
  const pathSuffix = path ? `:${path.split('/').join(':')}` : '';
  return `did:web:${host}${pathSuffix}`;
};

export type HostedDidContext = {
  tenantAltName: string;
  jurisdiction: string;
  version?: string;
  sector: string;
};

export const buildHostedDid = ({
  providerUrl,
  context,
}: {
  providerUrl: string;
  context: HostedDidContext;
}) => {
  const baseUrl = normalizeUrl(providerUrl);
  const parsed = new URL(baseUrl);
  const host = parsed.host.toLowerCase().replace(':', '%3A');
  const version = context.version || 'v1';
  const jurisdiction = context.jurisdiction.toLowerCase();
  const tenant = context.tenantAltName.toLowerCase();
  const sector = context.sector.toLowerCase();
  return `did:web:${host}:${tenant}:cds-${jurisdiction}:${version}:${sector}`;
};

export const buildSelfHostedDid = (externalDomainUrl: string) => {
  const baseUrl = normalizeUrl(externalDomainUrl);
  const parsed = new URL(baseUrl);
  const host = parsed.host.toLowerCase().replace(':', '%3A');
  return `did:web:${host}`;
};

export const decodeDidWebSegment = (segment: string): string =>
  (segment || '').replace(/%3A/gi, ':');

export const getDidWebHost = (did: string): string => {
  if (!did.startsWith('did:web:')) return '';
  const payload = did.replace(/^did:web:/, '');
  const firstSegment = payload.split(':')[0] || '';
  return decodeDidWebSegment(firstSegment).toLowerCase();
};

export const didWebToBaseUrl = (did: string): string => {
  try {
    return getBaseUrlFromDidWeb(did).replace(/\/$/, '');
  } catch {
    return '';
  }
};

export const didWebToDidDocumentUrl = (did: string): string => {
  if (!did.startsWith('did:web:')) return '';
  const baseUrl = didWebToBaseUrl(did).replace(/\/$/, '');
  if (!baseUrl) return '';

  const payload = did.replace(/^did:web:/, '');
  const segments = payload.split(':').map(decodeDidWebSegment);
  const path = segments.slice(1);
  if (!path.length) return `${baseUrl}/.well-known/did.json`;
  return `${baseUrl}/did.json`;
};

export const didWebToDidDocumentUrlCandidates = (did: string): string[] => {
  if (!did.startsWith('did:web:')) return [];
  const baseUrl = didWebToBaseUrl(did).replace(/\/$/, '');
  if (!baseUrl) return [];
  const payload = did.replace(/^did:web:/, '');
  const segments = payload.split(':').map(decodeDidWebSegment);
  const path = segments.slice(1);
  const candidates = new Set<string>();
  candidates.add(didWebToDidDocumentUrl(did));

  if (path.length) {
    candidates.add(`${baseUrl}/.well-known/did.json`);
  }

  try {
    const origin = new URL(baseUrl).origin;
    candidates.add(`${origin}/.well-known/did.json`);
  } catch {
    // ignore invalid base URL
  }

  return Array.from(candidates);
};
