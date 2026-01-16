// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/request.ts
/**
 * @file This file contains the core data models for the job processing system.
 * These models are platform-agnostic and are part of the core SDK.
 * @sdk
 */

export enum FormRequest {
  'OrganizationTerms' = 'register-organization_form_org.schema_v1.0',
  'IndividualTerms' = 'register-individual_form_org.schema_v1.0',
  'EmployeeRole' = 'employee-role_form_org.schema_v1.0',
  'PersonalIdentity' = 'personal-identity_form_org.schema_v1.0',
  'EvidenceEmbedded' = 'evidence-embedded_form_net.openid_v1.0',
}
