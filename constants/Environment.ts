// constants/Environment.ts
import Constants from 'expo-constants';

export const IS_DEMO_MODE = Constants.expoConfig?.extra?.OPERATION_MODE === 'DEMO' || __DEV__;
