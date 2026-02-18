import {
  ClientSDK,
  generateDidDocument_forMock,
  generateGatewayEntityServices_forMock,
  generateWellKnownServices_forMock,
} from 'gdc-sdk-client-ts';
import { entityMldsaJwk, entityMlkemJwk, entityUrnCds } from '../data/demo/sdkMockData';
import { MldsaPublicJwk, MlkemPublicJwk } from 'gdc-common-utils-ts/interfaces/Cryptography.types';
import { getBaseUrlFromDidWeb } from 'gdc-common-utils-ts/utils/did';

/**
 * Injects a mock provider DID document in the SDK for DEMO mode, so session
 * initialization can continue when real well-known endpoints are unavailable.
 */
export const ensureDemoProviderDidDocument = (sdk: ClientSDK, providerDid: string) => {
  const apiBaseUrl = getBaseUrlFromDidWeb(providerDid);

  const providerDidDoc = generateDidDocument_forMock(
    providerDid,
    apiBaseUrl,
    [generateWellKnownServices_forMock, generateGatewayEntityServices_forMock],
    {
      mldsa: entityMldsaJwk as MldsaPublicJwk,
      mlkem: entityMlkemJwk as MlkemPublicJwk,
      alsoKnownAs: entityUrnCds,
    }
  );

  sdk.addMockDidDocument(providerDid, providerDidDoc);
};
