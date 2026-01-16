# Project Documentation

This directory contains all the architectural and technical documentation for the project.

## Core Documents

1.  **[Main Project Architecture](./ARCHITECTURE.md)**
    -   **The single source of truth** for the high-level design, including the 4-layer architecture, data models, and security principles. This is the foundational document.

2.  **[Frontend Architecture Guide](./frontend-guide.md)**
    -   A detailed guide on the frontend's structure, covering Navigation, Styling & Theming, Internationalization (i18n), and Accessibility conventions.

3.  **[Global Context Providers](./context-providers.md)**
    -   An overview of the global React Context Providers that wrap the application, such as `ProfileProvider`, `JobProvider`, etc.

4.  **[Wallet SDK Cryptography Strategy](./cryptography.md)**
    -   An Architectural Decision Record (ADR) outlining the strategy for cryptographic operations. This includes the "Single Source of Truth" policy, the manual synchronization mandate, and the dependency injection pattern for platform-specific primitives.

5.  **[Vault Storage Model (Frontend + Backend Alignment)](./vault_storage_model.md)**
    -   Canonical vault/section/container model plus an SQL/SQLite attribute-index pattern to support blind queries (`indexed.attributes`) consistently across frontend and backend BYOD databases.

6.  **[Onboarding TODO / Backlog](./TODO_ONBOARDING_BACKLOG.md)**
    -   Implementation checklist to align Expo screens with SDK + backend onboarding flows (Organization + Family).
