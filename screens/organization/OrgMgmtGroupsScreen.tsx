// screens/organization/OrgMgmtGroupsScreen.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useThemeColor } from '../../hooks/useThemeColor';
import { getScreenStyles } from '../../constants/Styles';
import { getIscoRoleLabelKey, professionalRoles } from '../../constants/Roles';
import { useJobs } from '../../context/JobContext';
import * as Crypto from 'expo-crypto';

import ScreenHeader from '../../components/ScreenHeader';
import ThemedText from '../../components/ThemedText';
import ThemedInput from '../../components/ThemedTextInput';
import ThemedPicker from '../../components/ThemedPicker';
import ThemedButton from '../../components/ThemedButton';

export default function OrgMgmtGroupsScreen({ navigation }) {
  const { t } = useTranslation();
  const { scaleFactor } = useAccessibilityContext();
  const tintColor = useThemeColor({}, 'tint');
  const styles = getScreenStyles(scaleFactor, tintColor);
  const componentStyles = getComponentStyles(scaleFactor, useThemeColor);
  const backgroundColor = useThemeColor({}, 'background');

  const { isJobSystemReady, findDraftJob, createOrUpdateDraftJob, unprotectJob } = useJobs();

  const [groupName, setGroupName] = useState('');
  const [role, setRole] = useState('');
  
  const [draftJob, setDraftJob] = useState(null);
  const [unprotectedBody, setUnprotectedBody] = useState([]);
  const draftGroups = useMemo(() => unprotectedBody || [], [unprotectedBody]);

  const loadDraft = useCallback(async () => {
    if (isJobSystemReady) {
      const job = await findDraftJob('groups');
      if (job) {
        try {
          const unprotected = await unprotectJob(job);
          setDraftJob(job);
          setUnprotectedBody(unprotected.content.body || []);
        } catch (error) {
          console.error("Error decrypting groups draft job:", error);
        }
      } else {
        setDraftJob(null);
        setUnprotectedBody([]);
      }
    }
  }, [isJobSystemReady, findDraftJob, unprotectJob]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDraft();
    });
    return unsubscribe;
  }, [navigation, loadDraft]);

  const handleAddGroup = async () => {
    if (!groupName || !role) return;
    const isDuplicate = draftGroups.some(g => g.audienceType === groupName);
    if (isDuplicate) return;

    const newGroup = {
      '@type': 'Audience',
      'audienceType': groupName,
      'additionalType': [role], // Array with a single role as agreed
      'id': `did:web:acme.org:group:${Crypto.randomUUID()}` // Placeholder DID
    };

    const updatedGroups = [...draftGroups, newGroup];
    
    try {
      await createOrUpdateDraftJob({
        resourceType: 'groups',
        payload: updatedGroups,
      });
      await loadDraft();
      setGroupName('');
      setRole('');
    } catch (error) {
      console.error("Error updating groups draft:", error);
    }
  };

  /**
   * Handles removing a group from the DRAFT job.
   * NOTE: This is a draft-only operation for correcting the batch before it is sent.
   * The backend is expected to enforce traceability and will likely handle group
   * removal as a deactivation rather than a hard delete.
   */
  const handleRemoveGroup = async (id) => {
    const updatedGroups = draftGroups.filter(g => g.id !== id);
    try {
      await createOrUpdateDraftJob({
        resourceType: 'groups',
        payload: updatedGroups,
      });
      await loadDraft();
    } catch (error) {
      console.error("Error updating groups draft:", error);
    }
  };
  
  const roleItems = professionalRoles.map((roleKey) => ({
    value: roleKey,
    label: t(getIscoRoleLabelKey(roleKey), roleKey),
  }));

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader
          title={t('organization.screens.manageGroups.title', 'Gestionar Grupos')}
          subtitle={t('organization.screens.manageGroups.subtitle', 'Añadir o eliminar grupos del borrador.')}
        />
        
        <View style={{ padding: 16 }}>
          <ThemedText style={componentStyles.label}>{t('organization.screens.manageGroups.groupName', 'Nombre del Grupo')}</ThemedText>
          <ThemedInput
            placeholder={t('organization.screens.manageGroups.groupNamePlaceholder', 'ej. Enfermería')}
            value={groupName}
            onChangeText={setGroupName}
          />

          <ThemedText style={componentStyles.label}>{t('organization.screens.manageGroups.roleLabel', 'Rol del Grupo')}</ThemedText>
          <ThemedPicker
            selectedValue={role}
            onValueChange={setRole}
            items={[{ label: t('common.picker-role-placeholder', '-- Elegir Rol --'), value: '' }, ...roleItems]}
          />

          <ThemedButton
            title={t('organization.screens.manageGroups.addGroup', 'Añadir Grupo')}
            onPress={handleAddGroup}
            style={{ marginTop: 16 }}
          />
        </View>

        <View style={componentStyles.listContainer}>
          <ThemedText style={componentStyles.listHeader}>{t('organization.screens.manageGroups.draftTitle', 'Borrador de Grupos')}</ThemedText>
          <FlatList
            data={draftGroups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={componentStyles.listItem}>
                <View style={{ flex: 1 }}>
                  <ThemedText>{item.audienceType}</ThemedText>
                  <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>
                    {t(getIscoRoleLabelKey(item.additionalType?.[0]), '')}
                  </ThemedText>
                </View>
                <ThemedButton
                  title={t('common.remove', 'Eliminar')}
                  onPress={() => handleRemoveGroup(item.id)}
                  type="outline"
                />
              </View>
            )}
            ListEmptyComponent={<ThemedText style={{textAlign: 'center'}}>{t('organization.screens.manageGroups.noDrafts', 'No hay grupos en el borrador.')}</ThemedText>}
          />
        </View>

      </ScrollView>
    </View>
  );
}

const getComponentStyles = (scaleFactor, useThemeColor) => {
  const textColor = useThemeColor({}, 'text');
  return StyleSheet.create({
    label: {
      fontSize: 16 * scaleFactor,
      color: textColor,
      marginBottom: 8,
      marginTop: 16,
    },
    listContainer: {
        paddingHorizontal: 16,
        marginTop: 24,
    },
    listHeader: {
        fontSize: 18 * scaleFactor,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    }
  });
};
