import { Platform } from 'react-native';
import Constants from 'expo-constants';
import icaVerifyFallbackResponse from '../data/demo/icaVerifyFallbackResponse';
import { normalizeUrl } from './providerDid';

let hasRunIcaReadmeDemo = false;

const ICA_README_DEMO_PREFIX = '[ICA README demo]';

const isDemoMode = (): boolean =>
  String(Constants.expoConfig?.extra?.OPERATION_MODE || process.env.EXPO_PUBLIC_OPERATION_MODE || 'DEMO')
    .trim()
    .toUpperCase() === 'DEMO';

const readEnv = (key: string): string | undefined => {
  const value = process.env[key];
  if (typeof value !== 'string') return undefined;

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const inferMediaTypeFromUrl = (value: string): string => {
  const normalized = value.toLowerCase();

  if (normalized.endsWith('.xlsx') || normalized.includes('.xlsx?')) {
    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }

  if (normalized.endsWith('.pdf') || normalized.includes('.pdf?')) {
    return 'application/pdf';
  }

  return 'application/octet-stream';
};

const resolveSector = (SectorEnum: Record<string, string>, rawSector?: string): string => {
  switch ((rawSector || '').trim().toLowerCase()) {
    case 'animal-care':
      return SectorEnum.AnimalCare ?? 'animal-care';
    case 'onehealth-research':
      return SectorEnum.OneHealthResearch ?? 'onehealth-research';
    case 'health-care':
    default:
      return SectorEnum.HealthCare ?? 'health-care';
  }
};

const getOrganizationInfo = (client: any, verifyResponse: any) =>
  client.getOrganizationInfoFromVerifyResponse(verifyResponse);

const getLegalRepresentativeInfo = (client: any, verifyResponse: any) =>
  client.getLegalRepresentativeInfoFromVerifyResponse(verifyResponse);

const summarizeVerifyResponse = (verifyResponse: any) => {
  const entries = Array.isArray(verifyResponse?.body?.data) ? verifyResponse.body.data : [];
  return {
    total: Number(verifyResponse?.body?.total || 0),
    entryTypes: entries.map((entry: any) => entry?.type).filter(Boolean),
    hasAttachments: Array.isArray(verifyResponse?.attachments) && verifyResponse.attachments.length > 0,
  };
};

const extractIssueMessage = (issue: any): string | undefined => {
  if (!issue || typeof issue !== 'object') return undefined;

  return [
    issue.description,
    issue.diagnostics,
    issue.details,
    issue.message,
  ].find((value) => typeof value === 'string' && value.trim().length > 0);
};

const getIcaErrorMessageFromVerifyResponse = (verifyResponse: any): string | undefined => {
  const bodyIssues = verifyResponse?.body?.issues?.issue;
  if (Array.isArray(bodyIssues)) {
    for (const issue of bodyIssues) {
      const message = extractIssueMessage(issue);
      if (message) return message;
    }
  }

  const entries = Array.isArray(verifyResponse?.body?.data) ? verifyResponse.body.data : [];
  for (const entry of entries) {
    const outcomeIssues = entry?.response?.outcome?.issue;
    if (!Array.isArray(outcomeIssues)) continue;
    for (const issue of outcomeIssues) {
      const message = extractIssueMessage(issue);
      if (message) return message;
    }
  }

  return undefined;
};

const logReadmeFields = (
  organizationInfo: {
    id?: string;
    legalName?: string;
    taxID?: string;
    url?: string;
  } | undefined,
  legalRepresentativeInfo: {
    givenName?: string;
    familyName?: string;
    identifier?: string;
    sameAs?: string;
  } | undefined,
): void => {
  console.log(`${ICA_README_DEMO_PREFIX} extracted fields`, {
    organizationDid: organizationInfo?.id,
    hasOrganizationLegalName: !!organizationInfo?.legalName,
    hasOrganizationTaxId: !!organizationInfo?.taxID,
    organizationUrlHost: organizationInfo?.url ? new URL(normalizeUrl(organizationInfo.url)).hostname : undefined,
    hasRepresentativeGivenName: !!legalRepresentativeInfo?.givenName,
    hasRepresentativeFamilyName: !!legalRepresentativeInfo?.familyName,
    hasRepresentativeIdentifier: !!legalRepresentativeInfo?.identifier,
    hasRepresentativeSameAs: !!legalRepresentativeInfo?.sameAs,
  });
};

const getRuntimeConfig = () => {
  const baseUrl = readEnv('EXPO_PUBLIC_ICA_BASE_URL') || readEnv('ICA_BASE_URL') || 'http://localhost:3310';
  const fileUrl =
    readEnv('EXPO_PUBLIC_ICA_README_DEMO_FILE_URL') ||
    readEnv('EXPO_PUBLIC_ICA_README_DEMO_PDF_URL');
  const didWeb = readEnv('EXPO_PUBLIC_ICA_README_DEMO_DID_WEB') || 'did:web:ica';
  const mediaType = readEnv('EXPO_PUBLIC_ICA_README_DEMO_MEDIA_TYPE');
  const autorun = readEnv('EXPO_PUBLIC_ICA_README_DEMO_AUTORUN') === 'true';

  return {
    autorun,
    baseUrl,
    didWeb,
    fileUrl,
    mediaType,
    sector: readEnv('EXPO_PUBLIC_ICA_README_DEMO_SECTOR'),
  };
};

const buildVerifyEndpoint = (baseUrl: string, sector: string): string => {
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${normalizedBaseUrl}/ica/cds-ES/v1/${sector}/terms/pdf/contract/_verify`;
};

const buildVerifyFlowResult = (
  client: any,
  thid: string,
  verifyResponse: any
):
  | {
      ok: true;
      thid: string;
      verifyResponse: any;
      vcs: any;
      organizationCredential: any;
      legalRepresentativeCredential: any;
      organizationInfo: any;
      legalRepresentativeInfo: any;
    }
  | {
      ok: false;
      reason: string;
      message: string;
      thid?: string;
      verifyResponse?: any;
    } => {
  const vcs = client.getVcsFromResponse(verifyResponse);
  const organizationCredential = client.getOrganizationCredentialFromVerifyResponse(verifyResponse);
  const legalRepresentativeCredential =
    client.getLegalRepresentativeCredentialFromVerifyResponse(verifyResponse);
  const organizationInfo = getOrganizationInfo(client, verifyResponse);
  const legalRepresentativeInfo = getLegalRepresentativeInfo(client, verifyResponse);

  console.log(`${ICA_README_DEMO_PREFIX} parsed verify response`, {
    summary: summarizeVerifyResponse(verifyResponse),
    hasOrganizationCredential: !!organizationCredential,
    hasLegalRepresentativeCredential: !!legalRepresentativeCredential,
  });

  const total = Number(verifyResponse?.body?.total || 0);
  const dataEntries = Array.isArray(verifyResponse?.body?.data) ? verifyResponse.body.data : [];
  const hasCredentials = !!organizationCredential || !!legalRepresentativeCredential;
  if (!hasCredentials || total === 0 || dataEntries.length === 0) {
    const message =
      getIcaErrorMessageFromVerifyResponse(verifyResponse) ||
      'ICA verifyTerms returned no credentials.';
    console.error(`${ICA_README_DEMO_PREFIX} verifyTerms returned no credentials`, verifyResponse);
    return {
      ok: false,
      reason: 'empty-credentials',
      message,
      thid,
      verifyResponse,
    };
  }

  logReadmeFields(organizationInfo, legalRepresentativeInfo);

  return {
    ok: true,
    thid,
    verifyResponse,
    vcs,
    organizationCredential,
    legalRepresentativeCredential,
    organizationInfo,
    legalRepresentativeInfo,
  };
};

const buildDemoFallbackVerifyResult = (client: any, reason: string) => {
  console.warn(`${ICA_README_DEMO_PREFIX} using anonymized DEMO fallback response`, { reason });
  return buildVerifyFlowResult(
    client,
    String((icaVerifyFallbackResponse as any)?.thid || 'demo-ica-verify-response'),
    icaVerifyFallbackResponse
  );
};

export async function runIcaReadmeVerifyFlow(options?: {
  fileUrl?: string;
  fileBytes?: Uint8Array;
  mediaType?: string;
  suppressMissingConfigLog?: boolean;
}): Promise<
  | {
      ok: true;
      thid: string;
      verifyResponse: any;
      vcs: any;
      organizationCredential: any;
      legalRepresentativeCredential: any;
      organizationInfo: any;
      legalRepresentativeInfo: any;
    }
  | {
      ok: false;
      reason: string;
      message: string;
      thid?: string;
      verifyResponse?: any;
    }
> {
  if (Platform.OS !== 'web') {
    return { ok: false, reason: 'web-only', message: 'ICA verifyTerms is only enabled on web.' };
  }

  const sdkModule: any = await import('ica-client-sdk-ts');
  const { IcaClient, Sector } = sdkModule;
  const config = getRuntimeConfig();

  const baseUrl = config.baseUrl;
  const fileUrl = options?.fileUrl || config.fileUrl;
  const fileBytes = options?.fileBytes;
  const mediaType =
    options?.mediaType ||
    config.mediaType ||
    (fileUrl ? inferMediaTypeFromUrl(fileUrl) : 'application/octet-stream');
  const sector = resolveSector(Sector, config.sector);
  const client = new IcaClient({
    sector,
    didWeb: config.didWeb,
    organizationVcs: [],
    baseUrl,
    retryTimes: 5,
    retryDelayMs: 1500,
    fetch: typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : undefined,
  });

  if (!baseUrl || (!fileUrl && !fileBytes)) {
    if (isDemoMode()) {
      return buildDemoFallbackVerifyResult(
        client,
        'Missing ICA base URL or terms file in DEMO mode.'
      );
    }
    if (!options?.suppressMissingConfigLog) {
      console.warn(
        `${ICA_README_DEMO_PREFIX} missing config. ` +
        'Set EXPO_PUBLIC_ICA_BASE_URL and provide a file URL or file bytes.',
      );
    }
    return {
      ok: false,
      reason: 'missing-config',
      message: 'Missing ICA base URL or terms file.',
    };
  }

  if (fileUrl) {
    console.log(`${ICA_README_DEMO_PREFIX} verifyTerms input`, {
      kind: 'link',
      url: fileUrl,
      mediaType,
      endpoint: buildVerifyEndpoint(baseUrl, sector),
    });
  } else {
    console.log(`${ICA_README_DEMO_PREFIX} verifyTerms input`, {
      kind: 'bytes',
      bytesLength: fileBytes?.length || 0,
      mediaType,
    });
  }

  let thid: string;
  let verifyResponse: any;

  try {
    const accepted = await client.verifyTerms(fileBytes || String(fileUrl), { mediaType });
    thid = accepted.thid;

    console.log(`${ICA_README_DEMO_PREFIX} verifyTerms accepted`, accepted);

    verifyResponse = await client.pollVerifyTermsResponse(thid);
  } catch (error) {
    if (isDemoMode()) {
      return buildDemoFallbackVerifyResult(
        client,
        (error as Error)?.message || 'verifyTerms request failed in DEMO mode.'
      );
    }
    throw error;
  }

  console.log(`${ICA_README_DEMO_PREFIX} pollVerifyTermsResponse`, summarizeVerifyResponse(verifyResponse));
  const parsedResult = buildVerifyFlowResult(client, thid, verifyResponse);
  if (parsedResult.ok === false && isDemoMode()) {
    return buildDemoFallbackVerifyResult(client, parsedResult.message);
  }
  return parsedResult;
}

export async function runIcaReadmeConsoleDemo(): Promise<void> {
  if (Platform.OS !== 'web' || hasRunIcaReadmeDemo) {
    return;
  }

  if (!getRuntimeConfig().autorun) {
    return;
  }

  hasRunIcaReadmeDemo = true;

  try {
    await runIcaReadmeVerifyFlow();
  } catch (error) {
    console.error(`${ICA_README_DEMO_PREFIX} failed`, error);
  }
}
