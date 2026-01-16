// navigation/FamNavigator.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from '../constants/Routes';

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

const Stack = createNativeStackNavigator<any>();

export default function NavigatorFamily() {
  // <Stack.Screen name={Routes.Family.Consent?.name ?? 'FamilyConsent'} component={FamilyConsentScreen} />
  return (
    <Stack.Navigator id="family-stack" screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.Family.Auth.name} component={FamilyAuthScreen} />
      <Stack.Screen name={Routes.Family.Register.name} component={FamilyRegisterScreen} />
      <Stack.Screen name={Routes.Family.Join.name} component={FamilyJoinScreen} />
      <Stack.Screen name={Routes.Family.New.name} component={FamilyNewScreen} />
      <Stack.Screen name={Routes.Family.RegistrySent.name} component={FamRegistrySentScreen} />
      <Stack.Screen name={Routes.Family.LoginAuth.name} component={FamLoginAuthScreen} />
      <Stack.Screen name={Routes.Family.ProfileSelect.name} component={ProfileSelectScreen} />
      <Stack.Screen name={Routes.Family.Login.name} component={FamLoginMemberScreen} />
      <Stack.Screen name={Routes.Family.DeviceActivate.name} component={FamDeviceActivateScreen} />
      <Stack.Screen name={Routes.Family.Dashboard.name} component={FamilyDashboardScreen} />
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
