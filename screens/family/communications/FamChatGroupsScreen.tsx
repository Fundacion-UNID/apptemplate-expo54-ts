// screens/family/communications/FamChatGroupsScreen.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { useAccessibilityContext } from '../../../context/AccessibilityContext';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { getScreenStyles } from '../../../constants/style_family';

import AccessibleChatList from '../../../components/AccessibleChatList';

export default function ChatGroupsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { scaleFactor } = useAccessibilityContext();
  const backgroundColor = useThemeColor({}, 'background');
  const styles = getScreenStyles(scaleFactor);

  // Mock demo data (replace with backend integration later)
  const groups = [
    {
      id: 'fam-1',
      groupName: t('family.screens.communications.connections.FamilyHealth'),
      profileImage: 'https://i.pravatar.cc/150?img=11', // A personal avatar
      badge: { type: 'warning', content: '2', visible: true },
      lastAction: {
        type: 'messageReceived',
        sender: 'Mom',
        date: '2026-09-02',
        time: '11:00',
        iconName: 'chat',
        iconType: 'material',
      },
    },
    {
      id: 'conn-1', // Re-using an ID from org connections for consistency
      groupName: t('family.screens.communications.connections.FamilyDoctor'),
      profileImage: 'https://placehold.co/100x100/A8D5E2/333333?text=FD',
      badge: { type: 'info', content: 'NEW', visible: true },
      lastAction: {
        type: 'messageReceived',
        sender: 'Dr. Smith',
        date: '2026-09-01',
        time: '10:00',
        iconName: 'sms',
        iconType: 'material',
      },
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <AccessibleChatList
        data={groups}
        onPress={(item) => {
          navigation.navigate('Chat', {
            connectionId: item.id,
            connectionName: item.groupName,
          });
        }}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
