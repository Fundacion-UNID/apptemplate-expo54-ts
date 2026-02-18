# Vault Storage Model (Frontend + Backend Alignment)

This document defines a **single logical storage model** shared by:
- the **frontend** (offline-first storage using SQLite / IndexedDB / TinyBase-like stores), and
- the **backend** (tenant BYOD databases such as Firestore today, later Supabase/Postgres/MongoDB).

The goal is to keep the SDK and backend managers consistent, while allowing different physical database layouts.

---

## 1) Terminology (logical model)

- **Vault**: a logical storage boundary (e.g., *one tenant*, or *one user profile* on device).
- **Section**: a logical collection inside a vault (e.g., `employees`, `observations`, `rules`, `individual-dictionary-related-persons`).
- **Container**: a persisted record (typically a `ConfidentialStorageDoc`) stored inside a section.
- **Indexed attributes**: blind-search attributes stored alongside a container in `indexed.attributes[]`, with `name/value/type`.
  - Values are typically HMAC-protected for blind queries.
- **Tags**: ledger-safe, coded tags stored outside encrypted content.
  - In the backend we use `ConfidentialStorageDoc.tag[]` and we may mirror them to payload-level `body.meta.tag[]`.
- **Clinical section codes**: standardized document section identifiers (e.g., IPS `Composition.section.code`).
  - Use stable codes (typically LOINC) and resolve UI labels via reverse-DNS i18n keys (e.g., `org.loinc.48765-2`).
  - Translations live in app i18n resources (e.g., `locales/*/loinc.*` under the `org.loinc` namespace); the shared SDK/common layer only provides the code list + i18n keys.
  - The canonical supported catalog lives in `gdc-common-utils-ts` and is re-exported by the client SDK.

This corresponds to the backend interface `IVaultRepository`:
- `collectionName` ≈ vault physical name
- `sectionId` ≈ section name
- `containerId` ≈ document id

---

## 2) Recommended physical layout (Option 1: “n sections, m records”)

This is the layout we want for both backend and frontend:
- **n** sections/collections/tables, independent of how many individuals exist
- **m** records per section
- each record includes `individualId`/`subjectDid` to scope results

This avoids the anti-pattern of “one table/collection per individual”.

---

## 3) SQL / SQLite schema (frontend offline-first and backend SQL BYOD)

In relational storage, do not store `indexed.attributes[]` only as JSON and then try to query it.
Use an **Attribute-Value index table**.

### 3.1 Core tables

**`containers`** (one row per container):
- `id` (PRIMARY KEY)
- `section_id` (string)
- `vault_id` (string) – optional if DB is already per-vault
- `individual_id` or `subject_did` (string) – for scoping
- `status` (string)
- `sequence` (int)
- `version_id` (string) – optional content hash
- `content_type` (string) – optional label
- `jwe` (TEXT/JSON) – encrypted content
- `content` (TEXT/JSON) – optional plaintext (usually not persisted)
- `created_at`, `updated_at` (timestamps)

**`indexed_attributes`** (one-to-many):
- `container_id` (FK → `containers.id`)
- `name` (string) – HMAC-protected value
- `value` (string) – HMAC-protected value
- `type` (string)
- `unique_flag` (boolean)

Indexes to support blind queries:
- `(name, value)`
- plus `(individual_id, name, value)` if you denormalize `individual_id` into this table to avoid joins.

### 3.2 Optional `tags` table

If you need fast retrieval without decrypting:
- `container_id`
- `individual_id`
- `tag_id` (e.g., `Observation[0].code`)
- `system`, `code`, `version`, `user_selected`
- `display` (optional; do not publish to ledger)

---

## 4) Firestore layout (backend today)

Firestore is document-based; a good mapping is:
- **one Firestore collection per vault** (tenant vault)
- **one “section document” per section** (e.g., `observations`)
- **one `documents` subcollection per section** that stores containers

Conceptually:
`/{vaultCollection}/{sectionId}/documents/{containerId}`

Important:
- Firestore collection/document IDs cannot contain `/`, so section naming must be “safe” (use prefixes + hashes when needed).
- Sections should be discoverable (listable), so the repository should create the parent section document explicitly.

---

## 5) Individual-scoped sections (dictionary and clinical sections)

When a vault contains data for multiple individuals (e.g., family organization on a device, or tenant vault on backend), scope by:
- `individualId` / `subjectDid` field in each record, and/or
- a section naming convention that includes a **hashed subject**.

Example section naming (safe across Firestore/SQL/SQLite):
- `individual_observations_<subjectHash>`
- `individual_rules_<subjectHash>`

Dictionary (B1, recommended):
- `individual_dictionary_<subjectHash>`
  - store all dictionary containers for that individual in this single section

The **dictionary** is a *multi-container section*, not one big container:
- one container per entity (RelatedPerson/Place/Provider/Preference…)
- each container has its own `indexed.attributes[]` for blind lookups

---

## 6) Ledger-safe publication alignment

For anchoring/certification, you typically publish:
- `contentHash` (or `versionId` if it is a content hash)
- ledger-safe `tag[]` (no `display`)

The actual encrypted content stays in the vault (`jwe`).
