// navigation/FamNavigator.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from '../constants/Routes';
import HeaderBar from '../components/HeaderBar';

import FamilyAuthScreen from '../screens/family/FamAuthScreen';
import FamilyRegisterScreen from '../screens/family/FamRegisterScreen';
import FamilyJoinScreen from '../screens/family/FamJoinScreen';
import FamilyNewScreen from '../screens/family/FamNewScreen';
import FamilyDashboardScreen from '../screens/family/FamDashboardScreen';
import FamLoginAuthScreen from '../screens/family/FamLoginAuthScreen';
import FamLoginMemberScreen from '../screens/family/FamLoginMemberScreen';
import FamRegistrySentScreen from '../screens/family/FamRegistrySentScreen';
import FamSelectSubjectScreen from '../screens/family/FamSelectSubjectScreen';
// import FamilyConsentScreen from '../screens/family/FamConsentScreen';

// 👇 Communications
import FamilyCommunicationsScreen from '../screens/family/communications/FamCommunicationsScreen';
import FamilyChatGroupsScreen from '../screens/family/communications/FamChatGroupsScreen';
import FamilyContactsScreen from '../screens/family/communications/FamContactsScreen';
import FamilyInboxScreen from '../screens/family/communications/FamInboxScreen';
import FamilySentScreen from '../screens/family/communications/FamSentScreen';
import FamilyDraftsScreen from '../screens/family/communications/FamDraftsScreen';
import FamilyOutboxScreen from '../screens/family/communications/FamOutboxScreen';
import ChatScreen from '../screens/communications/ChatScreen';
import JobsScreen from '../screens/JobsScreen'; // Import the new screen
import FamDevicesScreen from '../screens/family/FamDevicesScreen';
import FamDeviceActivateScreen from '../screens/family/FamDeviceActivateScreen';
import FamMembersScreen from '../screens/family/FamMembersScreen';
import ProfileSelectScreen from '../screens/common/ProfileSelectScreen';
import FamIdentityMenuScreen from '../screens/family/FamIdentityMenuScreen';
import FamDocumentsMenuScreen from '../screens/family/FamDocumentsMenuScreen';
import FamAddDocumentScreen from '../screens/family/FamAddDocumentScreen';
import FamDataSpaceScreen from '../screens/family/FamDataSpaceScreen';
import FamAccountScreen from '../screens/family/FamAccountScreen';

const Stack = createNativeStackNavigator<any>();

export default function NavigatorFamily() {
  // <Stack.Screen name={Routes.Family.Consent?.name ?? 'FamilyConsent'} component={FamilyConsentScreen} />
  return (
    <Stack.Navigator id="family-stack" screenOptions={{ header: (props) => <HeaderBar {...props} /> }}>
      <Stack.Screen name={Routes.Family.Auth.name} component={FamilyAuthScreen} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.Family.Register.name} component={FamilyRegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.Family.Join.name} component={FamilyJoinScreen} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.Family.New.name} component={FamilyNewScreen} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.Family.RegistrySent.name} component={FamRegistrySentScreen} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.Family.LoginAuth.name} component={FamLoginAuthScreen} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.Family.ProfileSelect.name} component={ProfileSelectScreen} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.Family.Login.name} component={FamLoginMemberScreen} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.Family.DeviceActivate.name} component={FamDeviceActivateScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name={Routes.Family.Dashboard.name}
        component={FamilyDashboardScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name={Routes.Family.Identity.name} component={FamIdentityMenuScreen} />
      <Stack.Screen name={Routes.Family.DocumentsMenu.name} component={FamDocumentsMenuScreen} />
      <Stack.Screen name={Routes.Family.AddDocument.name} component={FamAddDocumentScreen} />
      <Stack.Screen name={Routes.Family.DataSpace.name} component={FamDataSpaceScreen} />
      <Stack.Screen name={Routes.Family.Account.name} component={FamAccountScreen} />
      <Stack.Screen name={Routes.Family.SelectSubject.name} component={FamSelectSubjectScreen} />
      <Stack.Screen name={Routes.Family.Members.name} component={FamMembersScreen} />
      

      {/* 4️⃣ Communications */}
      <Stack.Screen name={Routes.Family.Communications.name} component={FamilyCommunicationsScreen} />
      <Stack.Screen name={Routes.Family.ChatGroups.name} component={FamilyChatGroupsScreen} />
      <Stack.Screen name={Routes.Family.Contacts.name} component={FamilyContactsScreen} />
      <Stack.Screen name={Routes.Family.Inbox.name} component={FamilyInboxScreen} />
      <Stack.Screen name={Routes.Family.Sent.name} component={FamilySentScreen} />
      <Stack.Screen name={Routes.Family.Drafts.name} component={FamilyDraftsScreen} />
      <Stack.Screen name={Routes.Family.Outbox.name} component={FamilyOutboxScreen} />
      <Stack.Screen name={Routes.Family.Devices.name} component={FamDevicesScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Jobs" component={JobsScreen} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
}
