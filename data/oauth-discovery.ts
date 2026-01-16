// utils/oauth-discovery.ts

/**
 * Discovery document endpoints for OAuth providers.
 * This configuration is used by expo-auth-session.
 */
export const DiscoveryAuthProviders = {
  google: {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    revocationEndpoint: "https://oauth2.googleapis.com/revoke",
  },
  apple: {
    authorizationEndpoint: "https://appleid.apple.com/auth/authorize",
    tokenEndpoint: "https://appleid.apple.com/auth/token",
  },
};
