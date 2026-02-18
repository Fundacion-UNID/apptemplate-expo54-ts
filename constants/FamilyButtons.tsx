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
      iconName: 'chat',
      iconType: 'material',
      route: Routes.Family.Communications.name,
    },
    {
      label: t('family.dashboard.options.identity', 'Digital identity'),
      iconName: 'badge',
      iconType: 'material',
      route: Routes.Family.Identity.name,
    },
    {
      label: t('family.dashboard.options.documents', 'Documents'),
      iconName: 'folder-open',
      iconType: 'material',
      route: Routes.Family.DocumentsMenu.name,
    },
    {
      label: t('family.dashboard.options.dataSpace', 'Data space'),
      iconName: 'apartment',
      iconType: 'material',
      route: Routes.Family.DataSpace.name,
    },
  ],

  // ----------------------------
  // 1️⃣ Identity Management
  // ----------------------------
  identity: [
    {
      label: t('family.screens.identityMenu.options.add', 'Add'),
      iconName: 'person-add',
      iconType: 'material',
    },
    {
      label: t('family.screens.identityMenu.options.search', 'Search'),
      iconName: 'search',
      iconType: 'material',
      route: Routes.Family.SelectSubject.name,
    },
    {
      label: t('family.screens.identityMenu.options.evidence', 'Identity evidence'),
      iconName: 'fact-check',
      iconType: 'material',
    },
    {
      label: t('family.screens.identityMenu.options.shareId', 'Share my ID'),
      iconName: 'qr-code',
      iconType: 'material',
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
      label: t('family.screens.documents.options.index', 'Index'),
      iconName: 'folder',
      iconType: 'material',
      route: Routes.Family.SelectSubject.name,
    },
    {
      label: t('family.screens.documents.options.create', 'Create document'),
      iconName: 'note-add',
      iconType: 'material',
      route: Routes.Family.AddDocument.name,
    },
    {
      label: t('family.screens.documents.options.signature', 'Signature and certification'),
      iconName: 'verified',
      iconType: 'material',
    },
    {
      label: t('family.screens.documents.options.traceability', 'Verification and traceability'),
      iconName: 'manage-search',
      iconType: 'material',
    },
  ],

  dataSpace: [
    {
      label: t('family.screens.dataSpace.options.organizations', 'Organizations'),
      iconName: 'corporate-fare',
      iconType: 'material',
    },
    {
      label: t('family.screens.dataSpace.options.departments', 'Departments / services'),
      iconName: 'local-hospital',
      iconType: 'material',
    },
    {
      label: t('family.screens.dataSpace.options.locations', 'Nearby locations'),
      iconName: 'location-on',
      iconType: 'material',
    },
    {
      label: t('family.screens.dataSpace.options.myProvider', 'My provider'),
      iconName: 'account-balance',
      iconType: 'material',
    },
  ],

  // ------------------------
  // 4️⃣ Communications
  // ------------------------
  communications: [
    {
      label: t('groupsLabel'),
      iconName: "group",
      iconType: 'material',
      route: Routes.Family.ChatGroups.name,
    },
    {
      label: t('contacts'),
      iconName: "contacts",
      iconType: 'material',
      route: Routes.Family.Contacts.name,
    },    
    {
      label: t('inbox'),
      iconName: "inbox",
      iconType: 'material',
      route: Routes.Family.Inbox.name,
    },
    {
      label: t('sent'),
      iconName: "send",
      iconType: 'material',
      route: Routes.Family.Sent.name,
    },
    {
      label: t('drafts'),
      iconName: "drafts",
      iconType: 'material',
      route: Routes.Family.Drafts.name,
    },
    {
      label: t('sync'),
      iconName: "sync",
      iconType: 'material',
      route: Routes.Family.Outbox.name,
    },
  ],
});
