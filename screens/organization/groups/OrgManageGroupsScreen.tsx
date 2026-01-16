// screens/organization/groups/OrgManageGroupsScreen.js
import React from 'react';
import { View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { useThemeColor } from '../../../hooks/useThemeColor';
import { getScreenStyles } from '../../../constants/Styles';
import ScreenHeader from '../../../components/ScreenHeader';
import ThemedText from '../../../components/ThemedText';
import ThemedButton from '../../../components/ThemedButton';
import { useDirectory } from '../../../context/DirectoryContext';
import { Routes } from '../../../constants/Routes';

const OrgManageGroupsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const styles = getScreenStyles();
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  
  const { allGroups, isDirectoryReady } = useDirectory();

  const renderGroupItem = (group) => (
    <Pressable 
      key={group.id} 
      style={{ padding: 15, borderBottomWidth: 1, borderColor }}
      // onPress={() => navigation.navigate(Routes.Organization.GroupEditor.name, { groupId: group.id })}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${t('organization.screens.manageGroups.groupName', 'Group Name')}: ${group.name}`}
      accessibilityHint={t('organization.screens.manageGroups.editHint', 'Press to edit this group')}
    >
      <ThemedText style={{ fontWeight: 'bold' }}>{group.name}</ThemedText>
      {group.description && (
        <ThemedText style={{ color: 'gray', marginTop: 4 }}>
          {group.description}
        </ThemedText>
      )}
    </Pressable>
  );

  const renderContent = () => {
    if (!isDirectoryReady) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={primaryColor} />
          <ThemedText style={{ marginTop: 10 }}>{t('organization.screens.manageGroups.loading', 'Loading Groups...')}</ThemedText>
        </View>
      );
    }

    if (allGroups.length > 0) {
      return allGroups.map(renderGroupItem);
    }

    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <ThemedText>{t('organization.screens.manageGroups.noGroups', 'No groups found. Create one to get started.')}</ThemedText>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScreenHeader 
        title={t('organization.screens.manageGroups.title', 'Manage Groups')} 
        subtitle={t('organization.screens.manageGroups.subtitle', 'Create and edit professional groups')} 
      />
      <ScrollView style={styles.container}>
        {renderContent()}
      </ScrollView>
      <View style={{ padding: 16 }}>
        <ThemedButton
          title={t('organization.screens.manageGroups.createNew', 'Create New Group')}
          onPress={() => {
            // This will navigate to the editor screen once it's created.
            // navigation.navigate(Routes.Organization.GroupEditor.name)
            console.log("Navigate to Group Editor (screen not created yet)");
          }}
          disabled={!isDirectoryReady}
          accessibilityLabel={t('organization.screens.manageGroups.createNew', 'Create New Group')}
          accessibilityRole="button"
        />
      </View>
    </View>
  );
};

export default OrgManageGroupsScreen;
