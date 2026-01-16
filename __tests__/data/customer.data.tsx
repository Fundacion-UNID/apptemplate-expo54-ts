// __tests__/data/customer.data.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

const { ClaimsPersonSchemaorg, ClaimsServiceSchemaorg, Sector, Section, Format, Resource, JobAction } = require('../../constants/Schemas');

// --- Mocked Data (Original Source: customer.data.ts) ---
const testCustomer1Data = {
  alternateName: 'Customer1',
  uuidIdentifier: 'urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
  email: 'customer1@example.com',
  officialIdType: 'PPN', // passport number
  officialIdValue: '123456789',
};

// --- Organization's Data ---
// TODO: Replace these mocked values using the `/.well-knonw/vc.json` from the did:web (where `credentialSubject.identifier` will be the URN with the legal identifier)
const testOrg1AddressCountry = "ES";
const testOrg1AlternateName = "acme";
const testOrg1UrlExternal = "https://api.acme.org/";
const testOrg1DidWebExternal = "did:web:api.acme.org";

// --- Customer Data Definitions ---

const testCustomerGwProviderDomain = "api.acme.org";
const testCustomerGwProviderUrl = `https://${testCustomerGwProviderDomain}/`;

const testCustomer1ServiceProviderDidWeb = `did:web:${testCustomerGwProviderDomain}`;
const testCustomer1ServiceProviderCategory = Sector.HEALTH_CARE;

const testCustomer1ServiceProviderAcceptedTerms = "https://provider.example.com/terms";
const testCustomer1ServiceProviderAcceptedPurposeType = "http://terminology.hl7.org/CodeSystem/v3-ActReason|FAMRQT,PWATRNY,METAMGT,FRAUD,RECORDMGT,COVAUTH,TREAT,DISASTER,HPAYMT,MLTRAINING,ETREAT,HOPERAT,CAREMGT,HSYSADMIN,PATADMIN,PATSFTY";

const testCustomer1ServiceTermsClaims = {
    [ClaimsServiceSchemaorg.category]: testCustomer1ServiceProviderCategory,
    [ClaimsServiceSchemaorg.termsOfService]: testCustomer1ServiceProviderAcceptedTerms,
    [ClaimsServiceSchemaorg.serviceType]: testCustomer1ServiceProviderAcceptedPurposeType
};

const testCustomer1OnboardingClaimsWithTerms = {
    [ClaimsPersonSchemaorg.alternateName]: testCustomer1Data.alternateName,
    [ClaimsPersonSchemaorg.identifier]: testCustomer1Data.uuidIdentifier,
    [ClaimsPersonSchemaorg.email]: testCustomer1Data.email,
    ...testCustomer1ServiceTermsClaims,
};

const testCustomerOnboardingRelativePath = `${Section.INDIVIDUAL}/${Format.SCHEMA}/${Resource.PERSON}/`;
const testCustomerBatchRequestUrlExternal = `${testOrg1UrlExternal}${testCustomerOnboardingRelativePath}${JobAction.BATCH}`;

const testCustomer1ConsentSignedOnboardingEvidenceEmbedded = {
    id: 'urn:multibase:<multibase58(multihash(SHA3-256(attachedbytes)))>',
    type: "application/pdf",
    attachments: [{
        content: "Base64(raw-pdf-bytes)",
        content_type: "application/pdf",
    }]
};

const testIndividualConsentSignedOnboardingEntry = {
    meta: {
        claims: testCustomer1OnboardingClaimsWithTerms,
        verification: {
            evidence: [testCustomer1ConsentSignedOnboardingEvidenceEmbedded]
        }
    },
    request: {
        method: 'POST',
        url: testCustomerOnboardingRelativePath
    },
    type: 'IndividualTerms',
};

const testIndividualOnboardingBatchEntries = [
    { ...testIndividualConsentSignedOnboardingEntry },
    {
        meta: {
            claims: {
                [ClaimsPersonSchemaorg.identifier]: testCustomer1Data.uuidIdentifier,
                [ClaimsPersonSchemaorg.identifierType]: testCustomer1Data.officialIdType,
                [ClaimsPersonSchemaorg.identifierValue]: testCustomer1Data.officialIdValue,
            }
        },
        request: {
            method: 'POST',
            url: testCustomerOnboardingRelativePath
        },
        type: 'PersonalIdentity', // Assuming FormRequest.PersonalIdentity = 'PersonalIdentity'
    }
];

const testCreateCustomerJobRequestProfessionalOnboarding = {
    tenantId: `${testOrg1AlternateName}`,
    jurisdiction: `${testOrg1AddressCountry}`,
    sector: `${testCustomer1ServiceProviderCategory}`, 
    section: `${Section.INDIVIDUAL}`,
    format: `${Format.SCHEMA}`,
    resourceType: `${Resource.PERSON}`,
    action: `${JobAction.CREATE}`,
    content: {
        aud: testOrg1DidWebExternal,
        thid: 'thid-customer-prof-onboarding',
        type: 'api+json',
        body: {
            data: testIndividualOnboardingBatchEntries,
        },
    },
    httpMethod: 'POST',
    requestUrl: testCustomerBatchRequestUrlExternal
};


module.exports = {
  testGwProviderDomain: testCustomerGwProviderDomain,
  testGwProviderUrl: testCustomerGwProviderUrl,
  testCustomer1ServiceProviderDidWeb,
  testCustomer1ServiceProviderCategory,
  testCreateCustomerJobRequestProfessionalOnboarding,
  testCustomer1ServiceProviderAcceptedTerms,
  testCustomer1ServiceProviderAcceptedPurposeType,
  testCustomer1ServiceTermsClaims,
  testCustomer1OnboardingClaimsWithTerms,
  testCustomerOnboardingRelativePath,
  testCustomerBatchRequestUrlExternal,
  testCustomer1ConsentSignedOnboardingEvidenceEmbedded,
  testIndividualConsentSignedOnboardingEntry,
  testIndividualOnboardingBatchEntries,
};
