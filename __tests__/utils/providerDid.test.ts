import { buildDidFromProviderUrl, normalizeUrl, buildHostedDid, buildSelfHostedDid } from '../../utils/providerDid';

describe('providerDid utils', () => {
  test('normalizeUrl prefixes https when missing', () => {
    expect(normalizeUrl('api.example.com')).toBe('https://api.example.com');
  });

  test('normalizeUrl keeps existing scheme', () => {
    expect(normalizeUrl('http://api.example.com')).toBe('http://api.example.com');
  });

  test('buildDidFromProviderUrl handles host only', () => {
    expect(buildDidFromProviderUrl('api.example.com')).toBe('did:web:api.example.com');
  });

  test('buildDidFromProviderUrl encodes port and path', () => {
    expect(buildDidFromProviderUrl('https://api.example.com:8443/tenant/cds-es/v1/test'))
      .toBe('did:web:api.example.com%3A8443:tenant:cds-es:v1:test');
  });

  test('buildHostedDid builds hosted DID with provider host', () => {
    const result = buildHostedDid({
      providerUrl: 'https://host.com',
      context: {
        tenantAltName: 'acme',
        jurisdiction: 'es',
        version: 'v1',
        sector: 'health-care',
      },
    });
    expect(result).toBe('did:web:host.com:acme:cds-es:v1:health-care');
  });

  test('buildSelfHostedDid returns base did:web for custom domain', () => {
    expect(buildSelfHostedDid('https://acme.org')).toBe('did:web:acme.org');
  });
});
