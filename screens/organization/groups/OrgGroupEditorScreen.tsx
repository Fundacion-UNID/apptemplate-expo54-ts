// screens/organization/groups/OrgGroupEditorScreen.js
import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { useThemeColor } from '../../../hooks/useThemeColor';
import { getScreenStyles } from '../../../constants/Styles';
import ScreenHeader from '../../../components/ScreenHeader';
import ThemedText from '../../../components/ThemedText';
import ThemedInput from '../../../components/ThemedTextInput';
import ThemedButton from '../../../components/ThemedButton';
import { useDirectory } from '../../../context/DirectoryContext';
import { useJobs } from '../../../context/JobContext';

const OrgGroupEditorScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const styles = getScreenStyles();
  const backgroundColor = useThemeColor({}, 'background');

  const { addGroup } = useDirectory();
  const { createJob } = useJobs();

  // Check if we are editing an existing group
  const existingGroup = route.params?.group;

  const [name, setName] = useState(existingGroup?.meta.claims.name || '');
  const [description, setDescription] = useState(existingGroup?.meta.claims.description || '');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert(t('common.validation'), t('organization.screens.groupEditor.nameRequired'));
      return;
    }

    const groupData = {
      name: name.trim(),
      description: description.trim(),
      // In the future, member list will be handled here
      members: [], 
    };

    // This adds the group to the local directory cache for immediate UI feedback
    const newGroupResource = addGroup(groupData);

    // Now, create a job to persist this change to the vault and sync with backend
    createJob({
      // TODO: Define a proper serviceId for group creation/updates
      serviceId: 'v1_health-care_test-network_org.schema_Group_create',
      payload: {
        type: 'https://didcomm.org/group-management/1.0/create',
        body: {
          // The job payload should contain the claims, not the full resource object
          ...groupData,
          localId: newGroupResource.id, // Link the job to the cached resource
        }
      },
      notification: {
        title: t('organization.screens.groupEditor.jobNotification.title'),
        message: t('organization.screens.groupEditor.jobNotification.message', { name: groupData.name }),
      }
    });
    
    Alert.alert(
      t('organization.screens.groupEditor.successTitle'),
      t('organization.screens.groupEditor.successMessage')
    );
    navigation.goBack();
  };

  const screenTitle = existingGroup 
    ? t('organization.screens.groupEditor.editTitle') 
    : t('organization.screens.groupEditor.newTitle');
  
  const screenSubtitle = existingGroup
    ? t('organization.screens.groupEditor.editSubtitle')
    : t('organization.screens.groupEditor.newSubtitle');


  return (
    <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={styles.scrollContainer}>
      <ScreenHeader title={screenTitle} subtitle={screenSubtitle} />
      
      <View style={styles.container}>
        <ThemedText style={styles.formLabel}>{t('organization.screens.groupEditor.nameLabel')}</ThemedText>
        <ThemedInput 
          placeholder={t('organization.screens.groupEditor.namePlaceholder')} 
          value={name} 
          onChangeText={setName} 
        />

        <View style={{ height: 16 }} />

        <ThemedText style={styles.formLabel}>{t('organization.screens.groupEditor.descriptionLabel')}</ThemedText>
        <ThemedInput
          placeholder={t('organization.screens.groupEditor.descriptionPlaceholder')}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: 'top' }}
        />

        <View style={{ height: 32 }} />

        <ThemedButton 
          title={t('common.save')} 
          onPress={handleSave} 
          accessibilityLabel={t('common.save')}
          accessibilityRole="button"
        />
      </View>
    </ScrollView>
  );
};

export default OrgGroupEditorScreen;
