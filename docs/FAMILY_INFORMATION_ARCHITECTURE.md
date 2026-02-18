# Family Information Architecture

This document defines the Family app menu structure aligned with the common cross-sector model.

## Main Sections

1. Communications
- Channels
- New communication
- Drafts
- Sent messages

2. Digital Identity
- Add
- Search
- Identity evidence
- Share my ID

3. Documents
- Index
- Create document
- Signature and certification
- Verification and traceability

4. Data Space
- Participating organizations
- Departments / services
- Nearby locations
- My provider

5. My Account
- My information
- Tasks history
- Sign out (returns to global landing)

## Profile Model

Family roles are treated as distinct profiles.

Examples:
- `ONESELF` profile
- `PARENT` profile

Switching role/profile requires sign out and sign in with the target profile.

## Notes

- The global accessibility bar user icon opens **My Account** in Family mode.
- **My Account is not a dashboard tile**; it is accessed from the global accessibility bar user icon.
- Identity details are shown in **My Account** and **Digital Identity > Share my ID**.
- License management details are planned under Data Space/Provider management flows.

## Role Encoding Rules

- DID generation must never include coding-system prefixes (`HL7|`, `ISCO-08|`).
- Family member DID format is:
  - `did:web:<provider>:family:<familyId>:z<sha256(email)>:<ROLE_CODE>`
- Role code is accepted in any case from UI/input (for example `oneself`) and canonicalized to uppercase in DID (`ONESELF`).
- Backend payload role format is configurable:
  - `EXPO_PUBLIC_FAMILY_ROLE_CODING_SYSTEM` (default `org.hl7.v3.RoleCode`)
  - `EXPO_PUBLIC_FAMILY_ROLE_SEND_SYSTEM` (`true` => `system|code`, `false` => `code`)
