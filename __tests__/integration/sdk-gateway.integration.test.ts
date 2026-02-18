/**
 * SDK/Gateway integration smoke test scaffold.
 *
 * Enable and adapt this suite when gwtemplate test environment is available.
 * By default it is skipped so unit test runs stay deterministic.
 */

describe.skip('SDK Gateway integration (gwtemplate)', () => {
  test('gateway test base url is configured', () => {
    expect(process.env.GW_INTEGRATION_BASE_URL).toBeDefined();
  });
});
