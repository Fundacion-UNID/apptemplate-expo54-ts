import Constants from 'expo-constants';

const readNumericConfig = (extraKey: string, envKey: string, fallback: number, min = 0): number => {
  const extra = Constants.expoConfig?.extra ?? {};
  const raw = extra[extraKey] ?? process.env[envKey];
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.floor(parsed));
};

export const getSubmitRetryCount = (): number =>
  readNumericConfig('SUBMIT_RETRY_COUNT', 'EXPO_PUBLIC_SUBMIT_RETRY_COUNT', 2, 0);

export const getSubmitRetryDelayMs = (): number =>
  readNumericConfig('SUBMIT_RETRY_DELAY_MS', 'EXPO_PUBLIC_SUBMIT_RETRY_DELAY_MS', 1500, 0);

export const getRegistryRefreshIntervalMs = (): number =>
  readNumericConfig('REGISTRY_REFRESH_INTERVAL_MS', 'EXPO_PUBLIC_REGISTRY_REFRESH_INTERVAL_MS', 2500, 500);

export type RetryOperation =
  | 'registerFamilyOrganization'
  | 'registerOrganization';

const operationRetryKeys: Record<RetryOperation, { countExtra: string; countEnv: string; delayExtra: string; delayEnv: string }> = {
  registerFamilyOrganization: {
    countExtra: 'RETRY_REGISTER_FAMILY_ORG_COUNT',
    countEnv: 'EXPO_PUBLIC_RETRY_REGISTER_FAMILY_ORG_COUNT',
    delayExtra: 'RETRY_REGISTER_FAMILY_ORG_DELAY_MS',
    delayEnv: 'EXPO_PUBLIC_RETRY_REGISTER_FAMILY_ORG_DELAY_MS',
  },
  registerOrganization: {
    countExtra: 'RETRY_REGISTER_ORG_COUNT',
    countEnv: 'EXPO_PUBLIC_RETRY_REGISTER_ORG_COUNT',
    delayExtra: 'RETRY_REGISTER_ORG_DELAY_MS',
    delayEnv: 'EXPO_PUBLIC_RETRY_REGISTER_ORG_DELAY_MS',
  },
};

export const getRetryPolicy = (operation: RetryOperation): { retries: number; delayMs: number } => {
  const keys = operationRetryKeys[operation];
  return {
    retries: readNumericConfig(keys.countExtra, keys.countEnv, getSubmitRetryCount(), 0),
    delayMs: readNumericConfig(keys.delayExtra, keys.delayEnv, getSubmitRetryDelayMs(), 0),
  };
};
