const organizationCredential = {
  id: 'urn:uuid:9d4a8f85-39e3-4a93-bfe8-1c90053d3b6d',
  '@context': [
    'https://www.w3.org/ns/credentials/v2',
    'https://schema.org',
  ],
  type: [
    'VerifiableCredential',
    'OrganizationCredential',
  ],
  issuer: 'did:web:localhost%3A3310',
  validFrom: '2026-03-13T03:21:57.159Z',
  credentialSubject: {
    id: 'did:web:globaldatacare.es:animal-care:organization:taxid:VATES-B00000000',
    '@type': 'Organization',
    legalName: 'DEMO DATA COLLABORATION SERVICES SL',
    taxID: 'VATES-B00000000',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ES',
    },
  },
  evidence: [
    {
      type: 'electronic_signature',
      signature_type: 'pades',
      issuer: 'C=ES\nO=FNMT-RCM\nOU=CERES\nCN=AC Representacion',
      serial_number: 'DEMO20A438B97CF06452688B9E2C796700',
      created_at: '2026-03-13T03:21:57.159Z',
      attachments: [
        {
          content_type: 'application/json',
          content:
            'data:application/json;base64,eyJwcm9maWxlIjoiZGVtby1vaWRjNGlkYS1ldmlkZW5jZS12MSIsImFzc3VyYW5jZUxldmVsIjoiaGlnaCIsInZlcmlmaWNhdGlvblJlc3VsdCI6InZhbGlkIiwic2lnbmF0dXJlVmFsaWQiOnRydWUsImNoYWluVmFsaWQiOnRydWV9',
        },
      ],
    },
    {
      type: 'document',
      method: 'eid',
      time: '2026-03-13T03:21:57.159Z',
      verifier: {
        organization: 'did:web:localhost%3A3310',
      },
      check_details: [
        {
          check_method: 'vdig',
          organization: 'did:web:localhost%3A3310',
          txn: 'audit:gcs:ica-audit/animal-care/es/contract/2026-03-13/demo-contract-organization.pdf',
          time: '2026-03-13T03:21:57.159Z',
        },
        {
          check_method: 'vcrypt',
          organization: 'did:web:localhost%3A3310',
          txn: 'audit:gcs:ica-audit/animal-care/es/contract/2026-03-13/demo-contract-organization.pdf',
          time: '2026-03-13T03:21:57.159Z',
        },
      ],
      attachments: {
        digest: {
          alg: 'sha3-384',
          value: 'demoDigestOrganizationSha3384Value000000000000000000000000000000',
        },
        url: 'urn:uuid:demo-contract-organization',
      },
      document_details: {
        type: 'terms-and-conditions',
        document_number: 'contract',
        serial_number: 'DEMO20A438B97CF06452688B9E2C796700',
        issuer: {
          id: 'did:web:localhost%3A3310',
          type: 'TrustServiceProvider',
          country_code: 'ES',
          jurisdiction: 'ES',
        },
      },
    },
  ],
  proof: {
    type: 'JsonWebSignature2020',
    created: '2026-03-13T03:22:53.554Z',
    proofPurpose: 'assertionMethod',
    verificationMethod: 'did:web:localhost%3A3310#demoOrganizationVerificationMethod',
    jws: 'eyJhbGciOiJFUzM4NCIsImtpZCI6ImRlbW8tb3JnYW5pemF0aW9uIn0.demo-signature.organization',
  },
  meta: {
    versionId: 'zDemoVersionOrganizationCredential20260313',
  },
};

const legalRepresentativeCredential = {
  id: 'urn:uuid:b704a95c-58e4-48db-aaef-f1048cfa72bb',
  '@context': [
    'https://www.w3.org/ns/credentials/v2',
    'https://schema.org',
  ],
  type: [
    'VerifiableCredential',
    'PersonCredential',
    'LegalRepresentativeCredential',
  ],
  issuer: 'did:web:localhost%3A3310',
  validFrom: '2026-03-13T03:21:57.159Z',
  credentialSubject: {
    id: 'urn:person:identifier:IDCES-DEMO0001X',
    '@type': 'Person',
    name: 'ALICIA MARTIN SERRANO',
    hasOccupation: {
      '@type': 'Occupation',
      name: 'LegalRepresentative',
      identifier: 'urn:ilo:ilostat:isco-08:1120',
    },
    memberOf: {
      '@type': 'Organization',
      legalName: 'DEMO DATA COLLABORATION SERVICES SL',
      taxID: 'VATES-B00000000',
    },
    givenName: 'ALICIA',
    familyName: 'MARTIN SERRANO',
    identifier: 'IDCES-DEMO0001X',
    nationality: 'ES',
  },
  evidence: [
    {
      type: 'electronic_signature',
      signature_type: 'pades',
      issuer: 'C=ES\nO=FNMT-RCM\nOU=CERES\nCN=AC Representacion',
      serial_number: 'DEMO20A438B97CF06452688B9E2C796701',
      created_at: '2026-03-13T03:21:57.159Z',
      attachments: [
        {
          content_type: 'application/json',
          content:
            'data:application/json;base64,eyJwcm9maWxlIjoiZGVtby1vaWRjNGlkYS1ldmlkZW5jZS12MSIsImFzc3VyYW5jZUxldmVsIjoiaGlnaCIsInZlcmlmaWNhdGlvblJlc3VsdCI6InZhbGlkIiwic2lnbmF0dXJlVmFsaWQiOnRydWUsImNoYWluVmFsaWQiOnRydWV9',
        },
      ],
    },
    {
      type: 'document',
      method: 'eid',
      time: '2026-03-13T03:21:57.159Z',
      verifier: {
        organization: 'did:web:localhost%3A3310',
      },
      check_details: [
        {
          check_method: 'vdig',
          organization: 'did:web:localhost%3A3310',
          txn: 'audit:gcs:ica-audit/animal-care/es/contract/2026-03-13/demo-contract-legal-representative.pdf',
          time: '2026-03-13T03:21:57.159Z',
        },
        {
          check_method: 'vcrypt',
          organization: 'did:web:localhost%3A3310',
          txn: 'audit:gcs:ica-audit/animal-care/es/contract/2026-03-13/demo-contract-legal-representative.pdf',
          time: '2026-03-13T03:21:57.159Z',
        },
      ],
      attachments: {
        digest: {
          alg: 'sha3-384',
          value: 'demoDigestLegalRepresentativeSha3384Value0000000000000000000000',
        },
        url: 'urn:uuid:demo-contract-legal-representative',
      },
      document_details: {
        type: 'terms-and-conditions',
        document_number: 'contract',
        serial_number: 'DEMO20A438B97CF06452688B9E2C796701',
        issuer: {
          id: 'did:web:localhost%3A3310',
          type: 'TrustServiceProvider',
          country_code: 'ES',
          jurisdiction: 'ES',
        },
      },
    },
  ],
  proof: {
    type: 'JsonWebSignature2020',
    created: '2026-03-13T03:22:53.556Z',
    proofPurpose: 'assertionMethod',
    verificationMethod: 'did:web:localhost%3A3310#demoLegalRepresentativeVerificationMethod',
    jws: 'eyJhbGciOiJFUzM4NCIsImtpZCI6ImRlbW8tbGVnYWwtcmVwcmVzZW50YXRpdmUifQ.demo-signature.legalRepresentative',
  },
  meta: {
    versionId: 'zDemoVersionLegalRepresentativeCredential20260313',
  },
};

const icaVerifyFallbackResponse = {
  jti: 'urn:uuid:571b8916-2d0f-4b9f-8f96-156685179ea4',
  iss: 'did:web:localhost%3A3310',
  aud: 'did:web:localhost%3A3310',
  thid: 'thid-20260312202155',
  type: 'application/bundle-api+json',
  body: {
    resourceType: 'Bundle',
    type: 'batch-response',
    issues: {
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity: 'information',
          code: 'informational',
          diagnostics: 'Verification completed.',
        },
      ],
    },
    total: 2,
    data: [
      {
        type: 'Organization-verification-v1.0',
        response: {
          status: '200',
          outcome: {
            resourceType: 'OperationOutcome',
            issue: [
              {
                severity: 'information',
                code: 'informational',
                diagnostics: 'Organization credential extracted from verified document.',
              },
            ],
          },
        },
        resource: organizationCredential,
      },
      {
        type: 'LegalRepresentative-verification-v1.0',
        response: {
          status: '200',
          outcome: {
            resourceType: 'OperationOutcome',
            issue: [
              {
                severity: 'information',
                code: 'informational',
                diagnostics: 'Legal representative credential extracted from verified document.',
              },
            ],
          },
        },
        resource: legalRepresentativeCredential,
      },
    ],
  },
  attachments: [
    {
      id: 'f8f21ba2-8f94-42c2-b878-71c14df94212',
      format: 'vc+jwt',
      media_type: 'application/vc+jwt',
      filename: 'Organization-verification-v1.0-1.jwt',
      data: {
        json: {
          format: 'vc+jwt',
          jwt: JSON.stringify(organizationCredential),
        },
      },
    },
    {
      id: '959ea09b-5868-4100-be25-e0be47d0a001',
      format: 'vc+jwt',
      media_type: 'application/vc+jwt',
      filename: 'LegalRepresentative-verification-v1.0-2.jwt',
      data: {
        json: {
          format: 'vc+jwt',
          jwt: JSON.stringify(legalRepresentativeCredential),
        },
      },
    },
  ],
};

export default icaVerifyFallbackResponse;
