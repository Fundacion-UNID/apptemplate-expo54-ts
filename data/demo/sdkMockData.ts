// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: data/demo/sdkMockData.ts

import { normalizeDidWeb } from 'gdc-common-utils-ts/utils/did';
import { MldsaPublicJwk, MlkemPublicJwk } from 'gdc-common-utils-ts/interfaces/Cryptography.types';
import {
  generateDidDocument_forMock,
  generateGatewayEntityServices_forMock,
  generateHostRegistryServices_forMock,
  generateWellKnownServices_forMock,
} from 'gdc-sdk-client-ts';

export const entityMldsaJwk = {
  alg: 'ML-DSA-44',
  kid: 'KqCxRrE2dfPzyZv_xjAtIzll2WJAkcccYGiKvTG-MVw',
  kty: 'AKP',
  pub: 'ix12AZQ9er6zibP63xJA3tNmeYnlxICP1ZlVDzfTaPWHfvDk9qYOeOFbazvv4K9X8Xi5HKGN2s8j_A2ioapEdp3O3_tvMOApncrwwuQc6q5QvH-Fmp8ujB9aXOcQ3nt90jURHnoFNtciad-e8ickavGIGCQPL421i3bI-gxtbK0rL8Ibic7R6wkBi-5FvkkCw0pH3lja_Kosd7xt9SmGUFQuWKiLVF1027N9dwD71tVGQDH5we2cxuJQZ4tmJ6vS1Lhee6IseEAYlf9V_zc4AxiHeysYQKkfmc9JPK3PgD4OehBDm5wstHGjv7rfPWmOomifzEnBAKzO_o5sitoqv6ZuoIemo4h47lSHaZEjpBtbt0FHQ1ml0C6seaVXjLfOOiugdyoPkEvkOS-YSYcuwGGbK9Hk7XylvT0ulZ79SOn6xgKdEbYWLdfOsF406a7hjb_CaRbpq7oLullyK8MrHDcek9dsgY9nkl88EMzodcqQNTb2K9NO9fMxZz8YJiD9ZQ-nVGJIMKNrvCIJyGQukFH_ZM_WmGJX0Xzl5d7FqJ1bAnTsDrmc74TXPTdR6UhQyvjzqogAXRe-612-7ikialbvXG69D4XSkcUMjq2arpHPPSpHMhl3fPdgtR17x9ITtVeSAl7lsAfqFaSOFJTaoUfi7qm-wtKSN8HNk930XntX9nKedefViKWcZAMajdsZyOl4meRMwLoSH5FU7BB28pI9-kxWyHrVjugph6pHiTE5URMVST4fphY9O_W15s9CM8W1FwkwhRNpPfUAPrS5QX2pUcKWFLWOwyjFxJ0b6B_suoon4QfR0FY_Pukzwie3EnboUnuOOwWjwCX7ejypoLLiCRzIvosPTayb7Uao-lkUQSePFnRmx2Wji111toYpS9ZKl1zKmbe_DzYtuB2qnv6Iv6zWhpNerbJNik_A2lIgLjnxfWflyLTbSyTjU6uXvAgcPu3yz0J93MMHcvucoE3i9HZgUBGLg728ug5eiY4_uM9ssxMLxpcV4N8VrGJ2y3G_o2c0EQWhVzo0gESswsgnmsnV2bqtneBTuq7Y85HXulXeMEnDYyoBdCCmxKCsvYR6Hena_dLLcdGFyV-xXlfcZTU4zqQENA-N2ZapIm4hnWBUlKz3j5bYTOg3O1dBEW-LZ2mhuAai5nIg2vZwjWkpW6wZIWXh6AJKgZYeVCM6pbSism0zRu4zfsjmAgPfPLqSUuRVda4px-BWJGY93-vUFngxjZG88bK12SqBZIWjsjntNblrsEfWzrUkIWtMfDA2WwHkQPht669gUdY4CvDd4vIFYR40-GcNYrls7Yuzk6Gt2B6O6eTe3IctS656SOrAB_gUp8DTNG_u68Kq3k8gfXDOPao_UCugA9HuslKFBqjo7mhKTs-hlinlt8AoiKhX93Xkg37feDBW8NHyyRt1qqVsCU1Vlpb6LV1My5CdRVpqcbY21LIMjCqn6ugSsoZGCPfsfqklJzeB-4rQZYi4AZ9Nmo7nie2RSj87hSOBlJ8iHi57KcAPsj8T07UyJfI6JjfbivgjcoQataTg1BTpZWbZCRd452xgU0eKbtttOXk4220Wtv6_u8wSj8A72HVuChGN8TqwWncDKRh4kCgTOE3P5ri4ikjQaYYuZZAn9rGBRk2xpY8V4kyAXGxQID9zFm2S9yR0vBhzWViibJvNp8EbMl2dCLpxfTPaEH05oLb8mjYFtSygDmxqFNjIzAEwFVJYV3nsRawFHy_NEg',
} as const;

export const entityMlkemJwk = {
  crv: 'ML-KEM-768',
  kid: 'W_cjEOrBniheWIK7n5XT7MxIEvpwfF9swdol24YLCbc',
  kty: 'OKP',
  x: '1YshDOum6cAjtCdvNJtkEHKJf_FsXsigG0B4RnHBLXQ0goaPEHMs1bSwRwtB-YeifiKRx4Ml9jGzy7hqKPV-5BLHQjaHOVqgLOdtAQy8nuGk_BJC6eWn3rUuAtl-wmZN93RJxcsLJCqut2dZfYu93Qq65Zcrk2CBHDescleagkF9KdOFMxe_d5qg8nLG3iZqxdkqhHUw0wau_SA3wqNoD4rOjdIX4ZUywCZg8rE_qHGw7beOIhuz7aKrTZqhPCS0XwknCXaR3WINIOV3J1nLJenDXjlgPaerCLktwfFMYaKr1uBxgeOIILbIqDlbNAYmmCyPlMlDrbqGa_aG5YNp7TQkM1rL0eVqkyabvxGjWzsjA9VqNExLXLlPpEg83gvBOjjJXUk7vCd6ZLSCj6ZV4hdoKUR_ryWF9CMIISjNmdzPVOKN33VlZadK1DUZ0vCWtdcTWlBCz2kso4gCXTgDO6c7dNAW9kYjwDfKQ_WG-PcucAl-cDwzgxUYJHA5EAKB08kj4ZYAUpSgw9l_lDhbyhogXIBhSoFQOEU4KYgAvcJ5-XsGLZWqFlWjhdEck5sOowNV-fIQPAYuROpr_pNC5Lk9IxANt0tuXXpM4ETLqwBeIXLM3NKBhshefNdtouJj4-sthRSat7FGE5kRjsGwJUaCkyXNsNGTpBNcREqQfNguNUB5AEekdVBixYdejEt1DKxKv-qGcvymLyVWMVtNNCWjm5K281i1AzO1xEWpUay1Swu8fFeH-rqGdpFzQna_P7UBT9ggn8uOtWczbRGcHTOYrIYVkfBP2om5CWNEsNGfa8xbcPN5UFkJuNoatKy-7UQi0Um5UCMSolw8mAWf7zpVr7mxaxFN0nl93gy_SljN79NpIslC3zNXiHkN8GwgS2aJ9_wysRU51mOruHa1HlJqNrS9NKRCjUCd3Ha50_thccsSWxkDSogCTxJT0itYW-YdUNewMOKl5uyHphANZYWdbswTLkNSw1w_S2kQGAe64qsNs2VDFbwJ1paGX7gI-5IFBqgBDpbC3wGUrQl98JlbmbauI1DF1onJ68p59OoRxsp9NclfV9hyHGaMWyMMqbBRHqM6jMgi8Io--la9TJoBH6ZRjut3V1fHRnF8JrSOVzWtjjqHSQmyCJGjOXmM08tu4GqaCbNTXfFROldAe7NcaOHG4YFlGcXPWZGQNhU_G4MZxTAAEyZXYcGM_BwCIGh6gUAF2PS2hXu3FRpan3mICvsMRcJQURYpRiN9E9p6yrl3BJysC6CRe3lcXoS788FFF8pqtZq6YKYx2daRutAk6_mmjrmOA1oZkPoomnI9C0Rjr2J_9ei4n5WtgER1D0F7I5i8lShIkAt_9GINS7lHKViK_OBEo3ww5KpMLHaZEiO5_WVrtVony_xC-mKmqTCT2efO7ketKbkQtXtZ8TkANNo6n9NMnTuvpJEZRvRSxZd1FoQhqDpjHKCYVZd0hnFdy0dyf1uKHUtX8pp7Yva-PVPGl0KLTQOmszw6TfrJ2pdDuXdr7GZqdCx0Rts4a1J5mdqvONzE_3OXh-FQl9_kMYcwbAVu83H59qiroQk',
} as const;

export const hostDomain = 'api-host.example.com';
export const hostDidWeb = `did:web:${hostDomain}`;
export const hostUrl = `https://${hostDomain}/`;

export const gatewayDomain = 'api-provider-1.example.com';
export const gatewayDidWeb = `did:web:${gatewayDomain}`;
export const gatewayUrl = `https://${gatewayDomain}/`;

export const legalRepEmail = 'admin@test.com';
export const legalRepIscoCode = '1120';
export const legalRepRole = `ISCO-08|${legalRepIscoCode}`;
export const legalRepDid = normalizeDidWeb(`did:web:${gatewayDomain}:employee:${legalRepEmail}:${legalRepRole}`);

export const entityLegalIdJurisdiction = 'ES';
export const entityLegalIdType = 'TAX';
export const entityLegalIdValue = '88';
export const entitySectorCategory = 'health-care';
export const entityUrnCds = `urn:cds-${entityLegalIdJurisdiction}:v1:${entitySectorCategory}:organization:${entityLegalIdType}:${entityLegalIdValue}`;

export const mockHostProviderDidDocument = generateDidDocument_forMock(
  hostDidWeb,
  hostUrl,
  [generateWellKnownServices_forMock, generateHostRegistryServices_forMock],
  {
    mldsa: entityMldsaJwk as unknown as MldsaPublicJwk,
    mlkem: entityMlkemJwk as unknown as MlkemPublicJwk,
  }
);

export const mockGatewayProviderDidDocument = generateDidDocument_forMock(
  gatewayDidWeb,
  gatewayUrl,
  [generateWellKnownServices_forMock, generateGatewayEntityServices_forMock],
  {
    mldsa: entityMldsaJwk as unknown as MldsaPublicJwk,
    mlkem: entityMlkemJwk as unknown as MlkemPublicJwk,
    alsoKnownAs: entityUrnCds,
  },
  [legalRepDid]
);

export const MOCK_ICA_DID_DOCUMENT = mockHostProviderDidDocument;
export const MOCK_ROOT_GOVERNING_KEY_PUB = entityMldsaJwk.pub;
