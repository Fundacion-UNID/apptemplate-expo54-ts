// navigation/OrgNavigator.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from '../constants/Routes';
import HeaderBar from '../components/HeaderBar';

import OrgAuthScreen from '../screens/organization/OrgAuthScreen';
import OrgJoinScreen from '../screens/organization/OrgJoinScreen';
import OrgRegisterAuthScreen from '../screens/organization/OrgRegisterAuthScreen';
import OrgLoginAuthScreen from '../screens/organization/OrgLoginAuthScreen';
import OrgLoginMemberScreen from '../screens/organization/OrgLoginMemberScreen'; // The role selection screen
import OrgLoginVerifyScreen from '../screens/organization/OrgLoginVerifyScreen';
import ProfileSelectScreen from '../screens/common/ProfileSelectScreen';

import OrgNewEntityScreen from '../screens/organization/OrgNewEntityScreen';
import OrgRegisterRepresentativeScreen from '../screens/organization/OrgRegisterRepresentativeScreen';
import OrgRegistrySentScreen from '../screens/organization/OrgRegistrySentScreen';
import OrgDeviceActivateScreen from '../screens/organization/OrgDeviceActivateScreen';
import OrgDevicesScreen from '../screens/organization/OrgDevicesScreen';

import OrgCodeVerificationScreen from '../screens/organization/OrgCodeVerificationScreen';
import OrgDashboardScreen from '../screens/organization/OrgDashboardScreen';

import OrgMgmtEmployeesScreen from '../screens/organization/OrgMgmtEmployeesScreen';
import OrgLicensesScreen from '../screens/organization/OrgLicensesScreen';
import OrgMgmtGroupsScreen from '../screens/organization/OrgMgmtGroupsScreen';
import OrgMyEntityScreen from '../screens/organization/OrgMyEntityScreen';
import OrgMgmtLocationsScreen from '../screens/organization/OrgMgmtLocationsScreen';
import OrgMgmtDepartmentsScreen from '../screens/organization/OrgMgmtDepartmentsScreen';


import OrgIdentityMenuScreen from '../screens/organization/OrgIdentityMenuScreen';
import OrgIssueCredentialScreen from '../screens/organization/OrgIssueCredentialScreen';

// 👇 Communications
import OrgCommunicationsScreen from '../screens/organization/communications/OrgCommunicationsScreen';
import OrgChatGroupsScreen from '../screens/organization/communications/OrgChatGroupsScreen';
import OrgContactsScreen from '../screens/organization/communications/OrgContactsScreen';
import OrgInboxScreen from '../screens/organization/communications/OrgInboxScreen';
import OrgSentScreen from '../screens/organization/communications/OrgSentScreen';
import OrgDraftsScreen from '../screens/organization/communications/OrgDraftsScreen';
import OrgOutboxScreen from '../screens/organization/communications/OrgOutboxScreen';
import OrgNewConnectionScreen from '../screens/organization/communications/OrgNewConnectionScreen';
import ChatScreen from '../screens/communications/ChatScreen';
import OrgManageUnifiedIndexScreen from '../screens/organization/OrgManageUnifiedIndexScreen';
import OrgRegisterUnifiedIndexScreen from '../screens/organization/OrgNewCustomerScreen';
import OrgAddEvidenceScreen from '../screens/organization/OrgAddEvidenceScreen';
import OrgManageGroupsScreen from '../screens/organization/groups/OrgManageGroupsScreen';
import OrgGroupEditorScreen from '../screens/organization/groups/OrgGroupEditorScreen';

import { OrgRegistryFormProvider } from '../context/OrgRegistryFormContext';

const Stack = createNativeStackNavigator<any>();

/**
 * A nested stack navigator for the organization registration flow.
 * It's wrapped in a FormProvider to share form state across its screens.
 */
// A nested stack navigator for the organization registration flow.
// It's wrapped in a FormProvider to share form state across its screens.
//
// 🚨 DEPRECATED: This approach has been replaced by integrating the registration
// screens directly into the main stack. This avoids navigation issues where
// the back button would exit the entire flow. The OrgRegistryFormProvider is now
// applied at a higher level in the component tree.
/*
function RegistrationFlow() {
  return (
    <OrgRegistryFormProvider>
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name={Routes.Organization.NewEntity.name} component={OrgNewEntityScreen} />
        <Stack.Screen name={Routes.Organization.NewRepresentative.name} component={OrgRegisterRepresentativeScreen} />
      </Stack.Navigator>
    </OrgRegistryFormProvider>
  );
}
*/

export default function NavigatorOrganization() {
  return (
    <OrgRegistryFormProvider>
    <Stack.Navigator 
      id="org-stack"
      screenOptions={{
        header: (props) => <HeaderBar {...props} />,
      }}
    >
      <Stack.Screen name={Routes.Organization.AuthLanding.name} component={OrgAuthScreen} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.Organization.LoginAuth.name} component={OrgLoginAuthScreen} />
      <Stack.Screen name={Routes.Organization.ProfileSelect.name} component={ProfileSelectScreen} />
      <Stack.Screen name={Routes.Organization.LoginRoleSelect.name} component={OrgLoginMemberScreen} />
      <Stack.Screen name={Routes.Organization.LoginVerify.name} component={OrgLoginVerifyScreen} />
      <Stack.Screen name={Routes.Organization.RegisterAuth.name} component={OrgRegisterAuthScreen} />
      <Stack.Screen name={Routes.Organization.Join.name} component={OrgJoinScreen} />
      
      {/* The multi-step registration form screens are now part of the main stack */}
      <Stack.Screen name={Routes.Organization.NewEntity.name} component={OrgNewEntityScreen} />
      <Stack.Screen name={Routes.Organization.NewRepresentative.name} component={OrgRegisterRepresentativeScreen} />

      <Stack.Screen name={Routes.Organization.RegistrySent.name} component={OrgRegistrySentScreen} />
      <Stack.Screen name={Routes.Organization.DeviceActivate.name} component={OrgDeviceActivateScreen} />
      <Stack.Screen name={Routes.Organization.MyEntity.name} component={OrgMyEntityScreen} />
      <Stack.Screen name={Routes.Organization.Employees.name} component={OrgMgmtEmployeesScreen} />
      <Stack.Screen name={Routes.Organization.Licenses.name} component={OrgLicensesScreen} />
      <Stack.Screen name={Routes.Organization.Devices.name} component={OrgDevicesScreen} />
      <Stack.Screen name={Routes.Organization.Groups.name} component={OrgMgmtGroupsScreen} />
      <Stack.Screen name={Routes.Organization.Locations.name} component={OrgMgmtLocationsScreen} />
      <Stack.Screen name={Routes.Organization.Departments.name} component={OrgMgmtDepartmentsScreen} />
      <Stack.Screen name={Routes.Organization.CodeVerification.name} component={OrgCodeVerificationScreen} />
      <Stack.Screen name={Routes.Organization.Dashboard.name} component={OrgDashboardScreen} />
      
      <Stack.Screen name={Routes.Organization.IdentityMenu.name} component={OrgIdentityMenuScreen} />
      <Stack.Screen name={Routes.Organization.ManageUnifiedIndex.name} component={OrgManageUnifiedIndexScreen} />
      <Stack.Screen name={Routes.Organization.RegisterUnifiedIndex.name} component={OrgRegisterUnifiedIndexScreen} />
      <Stack.Screen name={Routes.Organization.AddEvidence.name} component={OrgAddEvidenceScreen} />
      <Stack.Screen name={Routes.Organization.IssueCredential.name} component={OrgIssueCredentialScreen} />

      {/* 3️⃣ My Organization */}
      <Stack.Screen name={Routes.Organization.GroupEditor.name} component={OrgGroupEditorScreen} />


      {/* 4️⃣ Communications */}
      <Stack.Screen name={Routes.Organization.Communications.name} component={OrgCommunicationsScreen} />
      <Stack.Screen name={Routes.Organization.ChatGroups.name} component={OrgChatGroupsScreen} />
      <Stack.Screen name={Routes.Organization.AddConnection.name} component={OrgNewConnectionScreen} options={{ title: 'New Connection' }} />

      <Stack.Screen name={Routes.Organization.Contacts.name} component={OrgContactsScreen} />
      <Stack.Screen name={Routes.Organization.Inbox.name} component={OrgInboxScreen} />
      <Stack.Screen name={Routes.Organization.Sent.name} component={OrgSentScreen} />
      <Stack.Screen name={Routes.Organization.Drafts.name} component={OrgDraftsScreen} />
      <Stack.Screen name={Routes.Organization.Outbox.name} component={OrgOutboxScreen} />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ 
          header: undefined, // This will fallback to the default header
          headerShown: true,
        }} 
      />
    </Stack.Navigator>
    </OrgRegistryFormProvider>
  );
}
