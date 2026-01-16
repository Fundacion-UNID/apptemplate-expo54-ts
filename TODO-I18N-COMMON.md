# TODO: i18n common namespace migration

Context:
- We currently expose common strings both at the root level (e.g., `landing.title`)
  and under a `common.*` namespace for forward compatibility.
- Root-level keys avoid touching a large number of existing screens, but long-term
  we should standardize on `common.*` to reduce collisions with `organization.*`,
  `family.*`, and `org.*` dictionaries.

Next steps:
- Gradually migrate screen translations to `common.*`.
- Once all usages are migrated, remove the root-level `...appCommon` export.

Files:
- locales/en/index.tsx
- locales/es/index.ts
