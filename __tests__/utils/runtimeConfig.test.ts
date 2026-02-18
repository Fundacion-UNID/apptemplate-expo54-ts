jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {},
    },
  },
}));

import Constants from 'expo-constants';
import {
  getRetryPolicy,
  getSubmitRetryCount,
  getSubmitRetryDelayMs,
  getRegistryRefreshIntervalMs,
} from '../../utils/runtimeConfig';

describe('runtimeConfig', () => {
  beforeEach(() => {
    (Constants as any).expoConfig.extra = {};
    delete process.env.EXPO_PUBLIC_SUBMIT_RETRY_COUNT;
    delete process.env.EXPO_PUBLIC_SUBMIT_RETRY_DELAY_MS;
    delete process.env.EXPO_PUBLIC_REGISTRY_REFRESH_INTERVAL_MS;
    delete process.env.EXPO_PUBLIC_RETRY_REGISTER_FAMILY_ORG_COUNT;
    delete process.env.EXPO_PUBLIC_RETRY_REGISTER_FAMILY_ORG_DELAY_MS;
    delete process.env.EXPO_PUBLIC_RETRY_REGISTER_ORG_COUNT;
    delete process.env.EXPO_PUBLIC_RETRY_REGISTER_ORG_DELAY_MS;
  });

  test('uses defaults when no env values exist', () => {
    expect(getSubmitRetryCount()).toBe(2);
    expect(getSubmitRetryDelayMs()).toBe(1500);
    expect(getRegistryRefreshIntervalMs()).toBe(2500);
  });

  test('reads endpoint-specific retry policy from env', () => {
    process.env.EXPO_PUBLIC_RETRY_REGISTER_FAMILY_ORG_COUNT = '4';
    process.env.EXPO_PUBLIC_RETRY_REGISTER_FAMILY_ORG_DELAY_MS = '800';

    expect(getRetryPolicy('registerFamilyOrganization')).toEqual({
      retries: 4,
      delayMs: 800,
    });
  });

  test('falls back to global retry values when endpoint values are missing', () => {
    process.env.EXPO_PUBLIC_SUBMIT_RETRY_COUNT = '3';
    process.env.EXPO_PUBLIC_SUBMIT_RETRY_DELAY_MS = '1200';

    expect(getRetryPolicy('registerOrganization')).toEqual({
      retries: 3,
      delayMs: 1200,
    });
  });

  test('reads from expo extra when present', () => {
    (Constants as any).expoConfig.extra = {
      RETRY_REGISTER_ORG_COUNT: '5',
      RETRY_REGISTER_ORG_DELAY_MS: '900',
    };

    expect(getRetryPolicy('registerOrganization')).toEqual({
      retries: 5,
      delayMs: 900,
    });
  });
});
