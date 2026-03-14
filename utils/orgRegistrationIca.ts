import { ClaimsOrganizationSchemaorg, ClaimsPersonSchemaorg, ClaimsServiceSchemaorg } from '../constants/Schemas';
import { OrgRegistrationForm } from '../forms/organization-registry-RJSF';
import { getDidWebHost, normalizeUrl } from './providerDid';

type IcaAutofillSource = {
  organizationCredential?: any;
  organizationInfo?: any;
  legalRepresentativeInfo?: any;
};

export const getOrganizationDidFromIca = (source: IcaAutofillSource): string | undefined => {
  const credentialDid = source.organizationCredential?.credentialSubject?.id;
  if (typeof credentialDid === 'string' && credentialDid.trim()) {
    return credentialDid.trim();
  }

  const infoDid = source.organizationInfo?.id;
  if (typeof infoDid === 'string' && infoDid.trim()) {
    return infoDid.trim();
  }

  return undefined;
};

export const getProviderUrlFromOrganizationDid = (organizationDid?: string): string | undefined => {
  if (!organizationDid) return undefined;

  if (organizationDid.startsWith('did:web:')) {
    const host = getDidWebHost(organizationDid);
    return host || undefined;
  }

  try {
    const parsed = new URL(normalizeUrl(organizationDid));
    return parsed.hostname.toLowerCase();
  } catch {
    return undefined;
  }
};

export const buildIcaAutofillData = (
  source: IcaAutofillSource
): Partial<OrgRegistrationForm> => {
  const organizationInfo = source.organizationInfo || {};
  const legalRepresentativeInfo = source.legalRepresentativeInfo || {};
  const organizationDid = getOrganizationDidFromIca(source);
  const providerUrl = getProviderUrlFromOrganizationDid(organizationDid);

  const nextData: Partial<OrgRegistrationForm> = {};

  if (typeof organizationInfo.legalName === 'string' && organizationInfo.legalName.trim()) {
    nextData[ClaimsOrganizationSchemaorg.legalName] = organizationInfo.legalName;
  }
  if (typeof organizationInfo.url === 'string' && organizationInfo.url.trim()) {
    nextData[ClaimsOrganizationSchemaorg.url] = organizationInfo.url;
  }
  if (typeof organizationInfo.taxID === 'string' && organizationInfo.taxID.trim()) {
    nextData[ClaimsOrganizationSchemaorg.identifierType] = 'TAX';
    nextData[ClaimsOrganizationSchemaorg.identifierValue] = organizationInfo.taxID;
  }
  if (typeof legalRepresentativeInfo.givenName === 'string' && legalRepresentativeInfo.givenName.trim()) {
    nextData[ClaimsPersonSchemaorg.givenName] = legalRepresentativeInfo.givenName;
  }
  if (typeof legalRepresentativeInfo.familyName === 'string' && legalRepresentativeInfo.familyName.trim()) {
    nextData[ClaimsPersonSchemaorg.familyName] = legalRepresentativeInfo.familyName;
  }
  if (typeof legalRepresentativeInfo.identifier === 'string' && legalRepresentativeInfo.identifier.trim()) {
    nextData[ClaimsPersonSchemaorg.identifierValue] = legalRepresentativeInfo.identifier;
    nextData[ClaimsPersonSchemaorg.identifier] = legalRepresentativeInfo.identifier;
  }
  if (providerUrl) {
    nextData[ClaimsServiceSchemaorg.url] = providerUrl;
  }

  return nextData;
};
