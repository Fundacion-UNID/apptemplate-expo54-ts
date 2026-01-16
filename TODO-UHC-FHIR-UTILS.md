# TODO: UHC FHIR Utils follow-up

Context:
- The app currently relies on `uhc-fhir-utils-typescript`, which imports
  `@universal-health-chain/uhc-common-utils-typescript` for:
  - TerminologyAdapterMem
  - DomainTerminologyDoc
  - getTerminologyDomainName
  - Uuid / getValidOrNewRandomUUID / validateUUIDv4
- `uhc-common-utils-typescript` is outdated and should not remain a hard dependency.

Next steps to evaluate:
- Option A: Inject random/UUID provider from the app into `uhc-fhir-utils-typescript`
  so it no longer imports `uhc-common-utils` for UUID/random helpers.
- Option B: Extract terminology helpers into a separate package with no UUID dependency,
  and have `uhc-fhir-utils-typescript` depend on that instead.
- Decide if `uhc-fhir-utils-typescript` should be refactored or replaced by a new
  package aligned with `gdc-common-utils-ts`.

Notes:
- Keep `@universal-health-chain/uhc-common-utils-typescript` installed only as long as
  `uhc-fhir-utils-typescript` requires it.
