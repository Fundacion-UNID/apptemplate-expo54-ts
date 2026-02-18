// constants/Providers.ts
import Constants from 'expo-constants';
import { didWebToBaseUrl, didWebToDidDocumentUrl, getDidWebHost } from '../utils/providerDid';
import { Sector } from './Schemas';

const parseCsv = (value: string | undefined): string[] =>
  (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeUrl = (url: string): string => url.replace(/\/+$/, '');

const normalizeSector = (value: string | undefined): string =>
  String(value || '').trim().toLowerCase();

const sectorToEnvSuffix = (sector: string): string =>
  normalizeSector(sector).replace(/-/g, '_').toUpperCase();

const unique = <T>(items: T[]): T[] => Array.from(new Set(items));

const allSupportedSectors = Object.values(Sector).map((value) => value.toLowerCase());
const supportedSectorSet = new Set(allSupportedSectors);

const asStringRecord = (value: unknown): Record<string, string> => {
  if (!value || typeof value !== 'object') return {};
  return Object.entries(value as Record<string, unknown>).reduce<Record<string, string>>(
    (acc, [key, current]) => {
      if (typeof current === 'string') acc[normalizeSector(key)] = current;
      return acc;
    },
    {}
  );
};

export type ProfessionalServiceProviderConfig = {
  id: string;
  name: string;
  url: string;
  did: string;
  sector: string;
};

type FamilyProviderConfig = {
  id: string;
  nameKey: string;
  label?: string;
  domain: string;
  did?: string;
  country?: string;
  sector: string;
};

const extra = Constants.expoConfig?.extra ?? {};

const configuredAllowedSectors = unique(
  parseCsv(extra.ALLOWED_SECTOR_LIST || process.env.EXPO_PUBLIC_ALLOWED_SECTOR_LIST)
    .map(normalizeSector)
    .filter((sector) => supportedSectorSet.has(sector))
);

const allowedSectors = configuredAllowedSectors;

export const getAllowedSectors = (): string[] => [...allowedSectors];

const extractCountryFromDid = (did: string): string | undefined => {
  const match = did.match(/:cds-([a-z]{2})(?::|$)/i);
  if (match?.[1]) return match[1].toUpperCase();
  return undefined;
};

const professionalBySectorFromExtra = asStringRecord((extra as any).PROFESSIONAL_OPERATOR_LIST_BY_SECTOR);
const familyBySectorFromExtra = asStringRecord((extra as any).FAMILY_PROVIDER_LIST_BY_SECTOR);

const getProfessionalDidListForSector = (sector: string): string[] => {
  const normalizedSector = normalizeSector(sector);
  if (!normalizedSector) return [];
  const fromExtra = professionalBySectorFromExtra[normalizedSector];
  const fromEnv = process.env[`EXPO_PUBLIC_PROFESSIONAL_OPERATOR_LIST_${sectorToEnvSuffix(normalizedSector)}`];
  return unique(parseCsv(fromExtra || fromEnv));
};

const getFamilyDidListForSector = (sector: string): string[] => {
  const normalizedSector = normalizeSector(sector);
  if (!normalizedSector) return [];
  const fromExtra = familyBySectorFromExtra[normalizedSector];
  const fromEnv = process.env[`EXPO_PUBLIC_FAMILY_PROVIDER_LIST_${sectorToEnvSuffix(normalizedSector)}`];
  return unique(parseCsv(fromExtra || fromEnv));
};

const toProfessionalServiceProvider = (
  did: string,
  sector: string,
  index: number
): ProfessionalServiceProviderConfig | null => {
  const host = getDidWebHost(did);
  if (!host) return null;
  const baseUrl = normalizeUrl(didWebToBaseUrl(did) || `https://${host.toLowerCase()}`);
  const normalizedSector = normalizeSector(sector);

  return {
    id: `professional-${normalizedSector}-${index + 1}`,
    name: `Operator (${host.toLowerCase()} / ${normalizedSector})`,
    url: baseUrl,
    did,
    sector: normalizedSector,
  };
};

const toFamilyProvider = (
  did: string,
  sector: string,
  index: number
): FamilyProviderConfig | null => {
  const host = getDidWebHost(did);
  if (!host) return null;
  const normalizedSector = normalizeSector(sector);
  const country = extractCountryFromDid(did);
  return {
    id: `family-${normalizedSector}-${index + 1}`,
    nameKey: 'family.providers.unidFoundation',
    label: `${host.toLowerCase()}${country ? ` (${country})` : ''}`,
    domain: host.toLowerCase(),
    did,
    country,
    sector: normalizedSector,
  };
};

const professionalProvidersBySector = new Map<string, ProfessionalServiceProviderConfig[]>();
const familyProvidersBySector = new Map<string, FamilyProviderConfig[]>();

allowedSectors.forEach((sector) => {
  const professionalProviders = getProfessionalDidListForSector(sector)
    .map((did, index) => toProfessionalServiceProvider(did, sector, index))
    .filter(Boolean) as ProfessionalServiceProviderConfig[];

  const familyProviders = getFamilyDidListForSector(sector)
    .map((did, index) => toFamilyProvider(did, sector, index))
    .filter(Boolean) as FamilyProviderConfig[];

  professionalProvidersBySector.set(sector, professionalProviders);
  familyProvidersBySector.set(sector, familyProviders);
});

export const ServiceProviders = allowedSectors.flatMap(
  (sector) => professionalProvidersBySector.get(sector) || []
);

export const getServiceProvidersForSector = (
  sector?: string
): ProfessionalServiceProviderConfig[] => {
  const normalizedSector = normalizeSector(sector);
  if (!normalizedSector) return [];
  return professionalProvidersBySector.get(normalizedSector) || [];
};

export const getFamilyProvidersForSector = (sector?: string): FamilyProviderConfig[] => {
  const normalizedSector = normalizeSector(sector);
  if (normalizedSector) {
    return familyProvidersBySector.get(normalizedSector) || [];
  }

  const dedup = new Map<string, FamilyProviderConfig>();
  allowedSectors.forEach((allowedSector) => {
    (familyProvidersBySector.get(allowedSector) || []).forEach((provider) => {
      const key = provider.did || provider.domain;
      dedup.set(key, provider);
    });
  });
  return Array.from(dedup.values());
};

const allFamilyProviders = getFamilyProvidersForSector();
export const FamilyProvidersByCountry = {
  ES: allFamilyProviders,
  MX: allFamilyProviders,
  US: allFamilyProviders,
  CA: allFamilyProviders,
  GB: allFamilyProviders,
} as const;

const professionalDidList = ServiceProviders.map((provider) => provider.did).filter(Boolean);
const familyDidList = allFamilyProviders.map((provider) => provider.did).filter(Boolean) as string[];

console.log('[Providers] Allowed sectors:', allowedSectors);
console.log('[Providers] Effective professional operator DIDs:', professionalDidList);
console.log(
  '[Providers] Professional operators (name/url/sector):',
  ServiceProviders.map((provider) => ({
    name: provider.name,
    url: provider.url,
    sector: provider.sector,
  }))
);
console.log(
  '[Providers] Professional DID -> URLs:',
  professionalDidList.map((did) => ({
    did,
    baseUrl: didWebToBaseUrl(did),
    didDocumentUrl: didWebToDidDocumentUrl(did),
  }))
);

console.log('[Providers] Effective family provider DIDs:', familyDidList);
console.log(
  '[Providers] Family DID -> URLs:',
  familyDidList.map((did) => ({
    did,
    baseUrl: didWebToBaseUrl(did),
    didDocumentUrl: didWebToDidDocumentUrl(did),
  }))
);
