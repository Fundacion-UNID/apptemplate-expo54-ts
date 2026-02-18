# SDK Gateway Testing (gwtemplate)

This app includes unit tests for retry/config logic and a scaffold for SDK-to-gateway integration tests.

## Unit Tests

Run:

```bash
npm test -- --watchman=false __tests__/utils/retry.test.ts __tests__/utils/runtimeConfig.test.ts
```

## Integration Tests (Scaffold)

File:

- `__tests__/integration/sdk-gateway.integration.test.ts`

By default this suite is `describe.skip(...)`.

When a gwtemplate test environment is available:

1. Set environment values (example):
   - `GW_INTEGRATION_BASE_URL=https://your-test-gateway.example.com`
2. Replace the scaffold assertions with real SDK flows:
   - organization registration `createOrganization -> offer -> confirmOrder`
   - family registration `createFamilyOrganization -> offer -> confirmFamilyOrder`
   - entitlements read/check and license issuance guards
3. Remove `.skip` to execute in CI for integration jobs only.

Recommended:

- Keep these tests in a dedicated CI job (`test:integration`) separate from fast unit tests.
