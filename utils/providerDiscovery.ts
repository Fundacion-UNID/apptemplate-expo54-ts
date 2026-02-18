import Constants from 'expo-constants';
import { getAllowedSectors, getFamilyProvidersForSector, getServiceProvidersForSector } from '../constants/Providers';
import { Sector } from '../constants/Schemas';
import {
  didWebToBaseUrl,
  didWebToDidDocumentUrlCandidates,
  getDidWebHost,
} from './providerDid';

export type ProviderConfig = {
  id: string;
  nameKey: string;
  label?: string;
  domain: string;
  did?: string;
  sector?: string;
  country?: string;
};

const parseCsv = (value: string | undefined): string[] =>
  (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeSector = (value: string | undefined): string =>
  String(value || '').trim().toLowerCase();

const DEFAULT_FAMILY_DISCOVERY_SECTOR = Sector.HEALTH_CARE;

const getOperationMode = (): string =>
  String(Constants.expoConfig?.extra?.OPERATION_MODE || process.env.EXPO_PUBLIC_OPERATION_MODE || 'DEMO')
    .toUpperCase();

const extractCountryFromDid = (did: string): string | undefined => {
  const match = did.match(/:cds-([a-z]{2})(?::|$)/i);
  if (match?.[1]) return match[1].toUpperCase();
  return undefined;
};

const buildProviderFromDid = (
  did: string,
  sector: string,
  source: string,
  index: number
): ProviderConfig | null => {
  const host = getDidWebHost(did);
  if (!host) return null;
  const country = extractCountryFromDid(did);
  return {
    id: `${source}-${sector}-${index + 1}-${host}`.toLowerCase(),
    nameKey: 'family.providers.unidFoundation',
    label: `${host.toLowerCase()}${country ? ` (${country})` : ''}`,
    domain: host.toLowerCase(),
    did,
    sector,
    country,
  };
};

const buildProviderFromEndpoint = (
  endpoint: string,
  sector: string,
  source: string,
  index: number
): ProviderConfig | null => {
  try {
    const parsed = new URL(endpoint);
    return {
      id: `${source}-${sector}-${index + 1}-${parsed.host}`.toLowerCase(),
      nameKey: 'family.providers.unidFoundation',
      label: parsed.host.toLowerCase(),
      domain: parsed.host.toLowerCase(),
      sector,
    };
  } catch {
    return null;
  }
};

const dedupeProviders = (providers: ProviderConfig[]): ProviderConfig[] => {
  const dedup = new Map<string, ProviderConfig>();
  providers.forEach((provider) => {
    const key = provider.did || provider.domain;
    if (!key) return;
    dedup.set(key, provider);
  });
  return Array.from(dedup.values());
};

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  let handle: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>((_, reject) => {
    handle = setTimeout(() => reject(new Error('timeout')), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (handle) clearTimeout(handle);
  }
};

const fetchJson = async (url: string, init?: RequestInit): Promise<any | null> => {
  try {
    const response = await withTimeout(fetch(url, init), 7000);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
};

const resolveDidDocument = async (did: string): Promise<any | null> => {
  const candidates = didWebToDidDocumentUrlCandidates(did);
  for (const candidate of candidates) {
    const didDoc = await fetchJson(candidate);
    if (didDoc) return didDoc;
  }
  return null;
};

const asArray = <T>(value: T | T[] | undefined | null): T[] =>
  Array.isArray(value) ? value : value ? [value] : [];

const toAbsoluteUrl = (endpoint: string, sourceDid: string): string => {
  if (/^https?:\/\//i.test(endpoint)) return endpoint;
  const base = didWebToBaseUrl(sourceDid);
  if (!base) return endpoint;
  if (endpoint.startsWith('/')) return `${base}/${endpoint.replace(/^\/+/, '')}`;
  return `${base}/${endpoint}`;
};

const extractCatalogEndpoints = (didDoc: any, sourceDid: string): string[] => {
  const services = Array.isArray(didDoc?.service) ? didDoc.service : [];
  const endpoints = new Set<string>();

  services.forEach((service: any) => {
    const typeRaw = asArray(service?.type).map((item) => String(item || '').toLowerCase());
    const id = String(service?.id || '').toLowerCase();
    const isCatalog =
      typeRaw.some((value) => value.includes('catalog')) ||
      id.includes('catalog');
    if (!isCatalog) return;

    const rawEndpoint =
      typeof service?.serviceEndpoint === 'string'
        ? service.serviceEndpoint
        : String(
            service?.serviceEndpoint?.['@id'] ||
              service?.serviceEndpoint?.id ||
              service?.serviceEndpoint?.url ||
              ''
          );
    if (!rawEndpoint) return;
    endpoints.add(toAbsoluteUrl(rawEndpoint, sourceDid));
  });

  const base = didWebToBaseUrl(sourceDid);
  if (base) endpoints.add(`${base}/catalog/request`.replace(/([^:]\/)\/+/g, '$1'));
  return Array.from(endpoints);
};

const collectDidWebStrings = (value: any, out: Set<string>, depth = 0): void => {
  if (depth > 6 || value == null) return;
  if (typeof value === 'string') {
    if (value.startsWith('did:web:')) out.add(value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectDidWebStrings(item, out, depth + 1));
    return;
  }
  if (typeof value === 'object') {
    Object.values(value).forEach((item) => collectDidWebStrings(item, out, depth + 1));
  }
};

const collectEndpointUrls = (value: any, out: Set<string>, depth = 0): void => {
  if (depth > 6 || value == null) return;
  if (typeof value === 'string') {
    if (/^https?:\/\//i.test(value)) out.add(value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectEndpointUrls(item, out, depth + 1));
    return;
  }
  if (typeof value === 'object') {
    Object.values(value).forEach((item) => collectEndpointUrls(item, out, depth + 1));
  }
};

const datasetLooksLikeFamilyIndex = (dataset: any, sector: string): boolean => {
  const keywords = [
    ...asArray(dataset?.['dcat:keyword']),
    ...asArray(dataset?.keyword),
    ...asArray(dataset?.serviceType),
    ...asArray(dataset?.['dcterms:type']),
    ...asArray(dataset?.type),
  ]
    .map((item) => String(item || '').toLowerCase())
    .join(' ');

  const hasFamilyToken = keywords.includes('family') || keywords.includes('individual');
  const hasIndexToken = keywords.includes('index') || keywords.includes('unified');
  const hasSectorToken = keywords.includes(sector);

  return (hasFamilyToken && hasIndexToken) || (hasSectorToken && hasIndexToken);
};

const parseProvidersFromCatalogPayload = (
  payload: any,
  sector: string,
  sourceDid: string
): ProviderConfig[] => {
  if (!payload || typeof payload !== 'object') return [];

  const roots = Array.isArray(payload['@graph']) ? payload['@graph'] : [payload];
  const catalogNode =
    roots.find((node: any) =>
      asArray(node?.['@type']).some((type) => String(type).toLowerCase().includes('catalog'))
    ) || payload;

  const datasets = asArray<any>(catalogNode?.['dcat:dataset'] ?? catalogNode?.dataset);
  if (!datasets.length) return [];

  const filtered = datasets.filter((dataset) => datasetLooksLikeFamilyIndex(dataset, sector));
  const sourceDatasets = filtered.length ? filtered : datasets;

  const didSet = new Set<string>();
  const endpointSet = new Set<string>();

  sourceDatasets.forEach((dataset: any) => {
    const participantId = String(dataset?.['dspace:participantId'] || dataset?.participantId || '').trim();
    if (participantId.startsWith('did:web:')) didSet.add(participantId);

    const publisher = dataset?.['dcterms:publisher'] ?? dataset?.['dcat:publisher'] ?? dataset?.publisher;
    if (typeof publisher === 'string' && publisher.startsWith('did:web:')) didSet.add(publisher);
    if (publisher && typeof publisher === 'object') {
      const publisherId = String(publisher?.['@id'] || publisher?.id || '').trim();
      if (publisherId.startsWith('did:web:')) didSet.add(publisherId);
    }

    collectDidWebStrings(dataset, didSet);
    collectEndpointUrls(dataset, endpointSet);
  });

  const providersFromDid = Array.from(didSet)
    .filter((did) => did !== sourceDid)
    .map((did, index) => buildProviderFromDid(did, sector, 'catalog-did', index))
    .filter(Boolean) as ProviderConfig[];

  const providersFromEndpoints = Array.from(endpointSet)
    .map((endpoint, index) => buildProviderFromEndpoint(endpoint, sector, 'catalog-endpoint', index))
    .filter(Boolean) as ProviderConfig[];

  return dedupeProviders([...providersFromDid, ...providersFromEndpoints]);
};

const discoverProvidersFromCatalogDid = async (
  catalogDid: string,
  sector: string
): Promise<ProviderConfig[]> => {
  const didDoc = await resolveDidDocument(catalogDid);
  if (!didDoc) return [];

  const endpoints = extractCatalogEndpoints(didDoc, catalogDid);
  if (!endpoints.length) return [];

  for (const endpoint of endpoints) {
    const requestBody = {
      '@context': {
        dspace: 'https://w3id.org/dspace/2024/1/context.json',
        dcat: 'https://www.w3.org/ns/dcat#',
      },
      '@type': 'dspace:CatalogRequestMessage',
    };

    const postPayload = await fetchJson(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    const providersFromPost = parseProvidersFromCatalogPayload(postPayload, sector, catalogDid);
    if (providersFromPost.length) return providersFromPost;

    const getPayload = await fetchJson(endpoint);
    const providersFromGet = parseProvidersFromCatalogPayload(getPayload, sector, catalogDid);
    if (providersFromGet.length) return providersFromGet;
  }

  return [];
};

const getConfiguredIcaDidList = (): string[] => {
  const fromExtra = String((Constants.expoConfig?.extra as any)?.ICA_DID_LIST || '').trim();
  const fromEnvList = String(process.env.EXPO_PUBLIC_ICA_DID_LIST || '').trim();
  const fromEnvSingle = String(process.env.EXPO_PUBLIC_ICA_DID || '').trim();
  return parseCsv(fromExtra || fromEnvList || fromEnvSingle);
};

const toProviderFromConfiguredFamilyList = (sector: string): ProviderConfig[] => {
  const list = getFamilyProvidersForSector(sector);
  return list.map((provider) => ({
    id: provider.id,
    nameKey: provider.nameKey,
    label: provider.label,
    domain: provider.domain,
    did: provider.did,
    sector: provider.sector,
    country: provider.country,
  }));
};

export const resolveFamilyProviders = async (sector?: string): Promise<ProviderConfig[]> => {
  const normalizedSector = normalizeSector(sector) || normalizeSector(DEFAULT_FAMILY_DISCOVERY_SECTOR);
  const allowedSectors = getAllowedSectors();
  const effectiveSector = allowedSectors.includes(normalizedSector)
    ? normalizedSector
    : normalizeSector(DEFAULT_FAMILY_DISCOVERY_SECTOR);

  const configuredProviders = toProviderFromConfiguredFamilyList(effectiveSector);
  if (configuredProviders.length) return configuredProviders;

  const operationMode = getOperationMode();
  const icaDids = getConfiguredIcaDidList();

  for (const icaDid of icaDids) {
    const providers = await discoverProvidersFromCatalogDid(icaDid, effectiveSector);
    if (providers.length) return dedupeProviders(providers);
  }

  // Demo fallback requested by product: if ICA is not configured or unavailable,
  // discover family index providers directly from configured operators for the sector.
  if (operationMode === 'DEMO') {
    const operators = getServiceProvidersForSector(effectiveSector);
    const discoveredFromOperators: ProviderConfig[] = [];

    for (const operator of operators) {
      if (!operator.did) continue;
      const providers = await discoverProvidersFromCatalogDid(operator.did, effectiveSector);
      discoveredFromOperators.push(...providers);
    }

    const deduped = dedupeProviders(discoveredFromOperators);
    if (deduped.length) return deduped;

    // Last-resort demo fallback so the family picker is usable in UI-only demos.
    return operators
      .map((operator, index) => buildProviderFromDid(operator.did, effectiveSector, 'demo-operator', index))
      .filter(Boolean) as ProviderConfig[];
  }

  return [];
};
