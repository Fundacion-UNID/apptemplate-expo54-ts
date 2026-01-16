// constants/OrgButtons.ts
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { Routes } from './Routes';
import { ButtonItem } from '../components/AccessibleButtonGrid';

// Define the structure for the translation function for type safety.
type TFunction = (...args: any[]) => any;

// Define the return type for the OrgButtons function.
type OrgButtonSections = {
  [key: string]: ButtonItem[];
};

export const OrgButtons = (t: TFunction): OrgButtonSections => ({
  dashboard: [
    {
      id: Routes.Organization.Communications.name,
      iconName: "email",
      label: t('organization.screens.dashboard.options.communications-button-label'),
      route: Routes.Organization.Communications.name
    },    
    {
      id: Routes.Organization.IdentityMenu.name,
      iconName: "badge",
      label: t('organization.screens.dashboard.options.identity-button-label'),
      route: Routes.Organization.IdentityMenu.name
    },
    {
      id: Routes.Organization.Documents.name,
      iconName: "folder",
      label: t('organization.screens.dashboard.options.documents-button-label'),
      route: Routes.Organization.Documents.name,
      disabled: true,
    },
    {
      id: Routes.Organization.MyEntity.name,
      iconName: "business",
      label: t('organization.screens.dashboard.options.myEntity-button-label'),
      route: Routes.Organization.MyEntity.name
    },    
  ],
  
  communications: [
    {
      id: Routes.Organization.ChatGroups.name,
      label: t('groupsLabel'),
      iconName: "group",
      route: Routes.Organization.ChatGroups.name,
    },
    {
      id: Routes.Organization.Contacts.name,
      label: t('contacts'),
      iconName: "contact",
      route: Routes.Organization.Contacts.name,
    },    
    {
      id: Routes.Organization.Inbox.name,
      label: t('inbox'),
      iconName: "inbox",
      route: Routes.Organization.Inbox.name,
      disabled: true,
    },
    {
      id: Routes.Organization.Sent.name,
      label: t('sent'),
      iconName: "send",
      route: Routes.Organization.Sent.name,
      disabled: true,
    },
    {
      id: Routes.Organization.Drafts.name,
      label: t('drafts'),
      iconName: "drafts",
      route: Routes.Organization.Drafts.name,
      disabled: true,
    },
    {
      id: Routes.Organization.Outbox.name,
      label: t('sync'),
      iconName: "sync",
      route: Routes.Organization.Outbox.name,
      disabled: true,
    },
  ],

  identityMenu: [
    {
      id: Routes.Organization.ShareID.name,
      iconName: "qr-code",
      label: t('organization.screens.identityMenu.options.shareId-button-label'),
      route: Routes.Organization.ShareID.name,
      disabled: true,
    },
    {
      id: Routes.Organization.ManageUnifiedIndex.name,
      iconName: "badge",
      label: t('unifiedID.manageTitle'),
      route: Routes.Organization.ManageUnifiedIndex.name,
    },
    {
      id: Routes.Organization.IssueCredential.name,
      iconName: "id-card",
      label: t('organization.screens.identityMenu.options.issueCredential-button-label'),
      route: Routes.Organization.IssueCredential.name,
      disabled: true,
    },
    {
      id: Routes.Organization.ReadIdentity.name,
      iconName: "search",
      label: t('organization.screens.identityMenu.options.readIdentity-button-label'),
      route: Routes.Organization.ReadIdentity.name,
      disabled: true,
    },
  ],

  myEntity: [
    {
      id: Routes.Organization.Employees.name,
      iconName: "groups",
      label: t('organization.screens.myEntity.options.employees-button-label'),
      route: Routes.Organization.Employees.name
    },
    {
      id: Routes.Organization.Licenses.name,
      iconName: "key",
      label: t('organization.screens.myEntity.options.licenses-button-label'),
      route: Routes.Organization.Licenses.name
    },
    {
      id: Routes.Organization.Devices.name,
      iconName: "devices",
      iconType: "material",
      label: t('organization.screens.myEntity.options.devices-button-label', 'Devices'),
      route: Routes.Organization.Devices.name
    },
    {
      id: Routes.Organization.Groups.name,
      iconName: "segment",
      label: t('organization.screens.myEntity.options.groups-button-label'),
      route: Routes.Organization.Groups.name,
      disabled: true,
    },
    {
      id: Routes.Organization.Departments.name,
      iconName: "business",
      label: t('organization.screens.myEntity.options.departments-button-label'),
      route: Routes.Organization.Departments.name,
      disabled: true,
    },
    {
      id: Routes.Organization.Locations.name,
      iconName: "map-marker",
      iconType: "material-community",
      label: t('organization.screens.myEntity.options.locations-button-label'),
      route: Routes.Organization.Locations.name,
      disabled: true,
    }
  ],
  documents: [
    {
      id: Routes.Organization.SelectSubject.name,
      iconName: "person-search",
      label: t('organization.screens.documents.options.selectSubject-button-label'),
      route: Routes.Organization.SelectSubject.name,
      disabled: true,
    },
    {
      id: Routes.Organization.ScanID.name,
      iconName: "qr-code-scanner",
      label: t('organization.screens.documents.options.scanId-button-label'),
      route: Routes.Organization.ScanID.name,
      disabled: true,
    },
    {
      id: Routes.Organization.IndexSections.name,
      iconName: "folder",
      label: t('organization.screens.documents.options.indexSections-button-label'),
      route: Routes.Organization.IndexSections.name,
      disabled: true,
    },
    {
      id: Routes.Organization.AddDocument.name,
      iconName: "add-circle",
      label: t('organization.screens.documents.options.addDocument-button-label'),
      route: Routes.Organization.AddDocument.name,
      disabled: true,
    },
    {
      id: Routes.Organization.SummaryRecords.name,
      iconName: "description",
      label: t('organization.screens.documents.options.summaryRecords-button-label'),
      route: Routes.Organization.SummaryRecords.name,
      disabled: true,
    },
  ],
});
