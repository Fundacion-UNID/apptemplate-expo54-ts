# Personal Evidence Flow (Frontend + Backend Contract)

This document describes the end-to-end flow implemented by `PersonalEvidenceComposer` in the Expo app and its expected backend mapping.

## 1. Goal

Create a reusable data-entry flow where Phase 1 always registers a `DocumentReference` and Phase 2 exposes optional actions (evidence registration, communication, finalize).

Primary use cases:
- Self-reported data from the subject.
- Data entered by a legal guardian/controller.
- Data entered by an employee/caregiver/qualified professional.

## 2. Core model

The UI emits `PersonalEvidenceDraft` with these key fields:
- `indexSection`: target index section (for example `LOINC|8716-3`).
- `creatorDid`, `subjectDid`, `yearOfBirth`, `sexOrGender`.
- `confidential`: optional portal URL + optional attachments.
- `openData`: resource type, free-text description, coding system, code, `period` flag, dates, jurisdiction.
- `actions`: `signEvidence`, `registerOnBlockchain`, `qualifiedCreator`, `registerResearchMetadata`.
- optional `communication`: recipients + text.

## 3. Internal security policy

`qualifiedCreator` is **not user-editable**. It is derived by trusted policy from creator identity/role (`did:web`, role claims, backend authorization state).

`registerResearchMetadata` is computed automatically and only becomes true when all conditions are met:
1. `qualifiedCreator === true`
2. At least one attachment exists
3. A code is selected
4. The user checks attestation ("I reviewed the attachment and code mapping")

Reason: statistical metadata is anonymous and effectively immutable in the statistics channel, so accidental publication must be strongly constrained.

## 4. Two-phase submission flow

### 4.1 Phase 1 (always): DocumentReference registration

Always register one or more `DocumentReference` resources first:
- `POST /{tenantId}/cds-{jurisdiction}/v1/{sector}/individual/org.hl7.fhir.r4/DocumentReference/_batch`

Transport is `Bundle(type=batch)` with `entry[].resource.resourceType = "DocumentReference"`.

### 4.2 Phase 2 (optional actions)

After Phase 1, UI can choose:
1. `Register evidence` (policy-controlled anchoring/statistics path).
2. `Send communication`:
   - `POST /{tenantId}/cds-{jurisdiction}/v1/{sector}/individual/org.hl7.fhir.r4/Communication/_batch`
   - payload may include document by `contentAttachment` (inline) or `contentReference` (URL).
3. `Finalize` (close/return without communication).

Recipients:
- Subject DID can be prefilled.
- Controllers/guardians/other recipients should come from local index cache when available.
- If not cached, frontend should query a backend discovery endpoint (target capability).

## 5. Blockchain behavior

- `registerOnBlockchain`: controls evidentiary anchoring (document hash anchor path).
- `registerResearchMetadata`: controls anonymous metadata push to sector/jurisdiction statistics channel.

Recommended backend contract:
- Hash anchor can be produced from any attachment format (PDF/FHIR JSON/XLSX/etc.).
- If only URL is provided and no attachment is present, do not auto-anchor file content unless backend fetch/versioning policy guarantees deterministic integrity.

## 6. Backend implementation notes

Suggested smart-contract split:
- Evidence anchoring: existing evidence/document anchoring contract.
- Statistical metadata: dedicated `researchmetadata-sc` (append-only policy).

For `researchmetadata-sc`, store only anonymous fields (section, code, coding system, jurisdiction, coarse demographics) and avoid reversible identifiers.
