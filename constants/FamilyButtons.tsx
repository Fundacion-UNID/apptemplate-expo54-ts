// constants/FamilyButtons.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { Routes } from './Routes';

type TFunction = (...args: any[]) => any;

export const FamilyButtons = (t: TFunction) => ({
  auth: [
    {
      iconName: 'login',
      iconType: 'material',
      label: t('auth.login'),
      route: Routes.Family.LoginAuth.name,
    },
    {
      iconName: 'person-add',
      iconType: 'material',
      label: t('auth.register'),
      route: Routes.Family.Register.name,
    },
  ],

  dashboard: [
    {
      label: t('family.dashboard.options.communications', 'Communications'),
      iconName: 'email',
      route: Routes.Family.Communications.name,
    },
    {
      label: t('family.dashboard.options.selectSubject', 'Select subject'),
      iconName: 'person-search',
      route: Routes.Family.SelectSubject.name,
    },
    {
      label: t('family.dashboard.options.devices', 'Devices'),
      iconName: 'devices',
      route: Routes.Family.Devices.name,
    },
  ],

  // ----------------------------
  // 1️⃣ Identity Management
  // ----------------------------
  identity: [
    {
      label: t('family.identity.shareId'),
      iconName: "qr-code",
      route: Routes.Family.ShareID.name,
    },
    {
      label: t('family.identity.linkIdentifiers'),
      iconName: "link",
      route: Routes.Family.LinkIdentifiers.name,
    },
    {
      label: t('family.identity.issueCredential'),
      iconName: "id-card",
      route: Routes.Family.IssueCredential.name,
    },
    {
      label: t('family.identity.readIdentity'),
      iconName: "search",
      route: Routes.Family.ReadIdentity.name,
    },
  ],

  // -------------------------------------------
  // 2️⃣ Family / Group Management
  // -------------------------------------------
  family: [
    {
      label: t('family.family.members'),
      iconName: "groups",
      route: Routes.Family.Members.name,
    },
    {
      label: t('family.family.permissions'),
      iconName: "vpn-key",
      route: Routes.Family.Permissions.name,
    },
    {
      label: t('family.family.appointments'),
      iconName: "event",
      route: Routes.Family.Appointments.name,
    },
    {
      label: t('family.devices.title', 'Devices'),
      iconName: "devices",
      route: Routes.Family.Devices.name,
    },
  ],

  // -------------------------
  // 3️⃣ User Documents
  // -------------------------
  documents: [
    {
      label: t('family.documents.selectSubject'),
      iconName: "person-search",
      route: Routes.Family.SelectSubject.name,
    },
    {
      label: t('family.documents.scanId'),
      iconName: "qr-code-scanner",
      route: Routes.Family.ScanID.name,
    },
    {
      label: t('family.documents.indexSections'),
      iconName: "folder",
      route: Routes.Family.IndexSections.name,
    },
    {
      label: t('family.documents.addDocument'),
      iconName: "add-circle",
      route: Routes.Family.AddDocument.name,
    },
    {
      label: t('family.documents.summaryRecords'),
      iconName: "description",
      route: Routes.Family.SummaryRecords.name,
    },
  ],

  // ------------------------
  // 4️⃣ Communications
  // ------------------------
  communications: [
    {
      label: t('groupsLabel'),
      iconName: "group",
      route: Routes.Family.ChatGroups.name,
    },
    {
      label: t('contacts'),
      iconName: "contact",
      route: Routes.Family.Contacts.name,
    },    
    {
      label: t('inbox'),
      iconName: "inbox",
      route: Routes.Family.Inbox.name,
    },
    {
      label: t('sent'),
      iconName: "send",
      route: Routes.Family.Sent.name,
    },
    {
      label: t('drafts'),
      iconName: "drafts",
      route: Routes.Family.Drafts.name,
    },
    {
      label: t('sync'),
      iconName: "sync",
      route: Routes.Family.Outbox.name,
    },
  ],
});
